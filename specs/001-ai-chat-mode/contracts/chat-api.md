# Contract: POST /api/chat

**Feature**: 001-ai-chat-mode
**Date**: 2026-03-28
**Route file**: `src/app/api/chat/route.ts`

---

## Overview

Server-side Next.js App Router route handler that receives a conversation history,
runs it through Google Gemini 2.0 Flash via Vercel AI SDK, and streams back text
and tool-invocation parts.

---

## Request

**Method**: `POST`
**Content-Type**: `application/json`

### Body Schema

```json
{
  "messages": [
    {
      "id": "string",
      "role": "user" | "assistant",
      "content": "string",
      "parts": "<MessagePart[] — optional, provided by AI SDK>"
    }
  ]
}
```

The `messages` array is the full conversation history managed by `useChat` on the client.
The route handler MUST NOT strip history — the model needs it for context and language
detection.

### Validation rules

- `messages` MUST be a non-empty array.
- Each message MUST have `role` and `content`.
- Malformed requests MUST return `400 Bad Request`.

---

## Response

**Content-Type**: `text/plain; charset=utf-8` (AI SDK data stream format)
**Transfer-Encoding**: `chunked` (streaming)

The response is a Vercel AI SDK data stream produced by `result.toDataStreamResponse()`.
The client's `useChat` hook deserialises this automatically.

### Stream part types

| Part type | When | Client rendering |
|---|---|---|
| `text-delta` | Model is generating a text response | Appended to `message.content` |
| `tool-call` | Model invokes a generative UI tool | `toolInvocation.state = "call"` |
| `tool-result` | Tool `execute()` returns resume data | `toolInvocation.state = "result"` → renders component |
| `finish` | Stream complete | `isLoading = false` |
| `error` | Server or model error | `error` set on `useChat` state |

---

## Tools (Generative UI)

All tools are **parameterless from the model's perspective** — the model calls them
with empty args and the `execute` function fetches data from `RESUME_DATA` directly.
This keeps the model from having to construct data payloads and prevents hallucination.

### `renderProjectCard`

- **Description**: "Display Fernando's portfolio projects as visual cards."
- **Parameters**: `{}` (empty Zod object)
- **Execute returns**: `ProjectCardResult` — `{ projects: RESUME_DATA.projects }`

### `renderCareerTimeline`

- **Description**: "Display Fernando's work history as a timeline."
- **Parameters**: `{}` (empty Zod object)
- **Execute returns**: `CareerTimelineResult` — `{ experience: RESUME_DATA.experience }`

### `renderSkillTags`

- **Description**: "Display Fernando's technical skills grouped by proficiency."
- **Parameters**: `{}` (empty Zod object)
- **Execute returns**: `SkillTagsResult` — `{ skills: { proficient, intermediate, knowledge } }`

### `renderContactCard`

- **Description**: "Display Fernando's contact information."
- **Parameters**: `{}` (empty Zod object)
- **Execute returns**: `ContactCardResult` — `{ contact: { email, linkedin, location, availability } }`
  - **Note**: `RESUME_DATA.contact.phone` is intentionally EXCLUDED from this result.

---

## System Prompt Contract

The route constructs the system prompt via `buildSystemPrompt()` from `src/lib/system-prompt.ts`.

The system prompt MUST contain:

1. **Identity framing**: The assistant is Fernando's AI representative, not Fernando himself.
2. **Factual data block**: All of `RESUME_DATA` serialised as structured text.
3. **Language instruction**: Detect language from the first user message; respond in that language; default to English.
4. **Topic restrictions**: Never express opinions on politics, social issues, religion, or controversial topics. Redirect politely to professional topics.
5. **Fabrication prevention**: If information is not in the data block, acknowledge honestly rather than guessing.
6. **Tool usage guidance**: Use the Generative UI tools when the user asks about projects, experience, skills, or contact. A text reply may accompany a tool call.

---

## Error Handling

| Scenario | Response |
|---|---|
| `GOOGLE_GENERATIVE_AI_API_KEY` missing | `500` with message "AI service not configured" |
| Gemini API unavailable / timeout | `503` with message "AI service temporarily unavailable" |
| Invalid request body | `400 Bad Request` |
| Empty `messages` array | `400 Bad Request` |

All errors MUST be returned as JSON: `{ "error": "message" }`.

---

## Constraints

- Maximum conversation history forwarded to the model: 20 messages (configurable in route).
  Older messages beyond 20 are trimmed from the tail (oldest first) to control token cost.
- `maxSteps: 2` — allows one tool call plus one final text generation per turn.
- The route is `export const runtime = "nodejs"` (not edge) to allow full Node.js APIs.
- The route MUST NOT log or persist any message content.
