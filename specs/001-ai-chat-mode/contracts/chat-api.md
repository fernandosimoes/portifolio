# Contract: POST /api/chat

**Feature**: 001-ai-chat-mode
**Date**: 2026-03-28 (updated 2026-03-30)
**Route file**: `src/app/api/chat/route.ts`

---

## Overview

Server-side Next.js App Router route handler that receives a conversation history,
converts it to `ModelMessage[]`, runs it through Google Gemini 2.5 Flash via Vercel AI SDK,
and streams back text and tool parts.

---

## Request

**Method**: `POST`
**Content-Type**: `application/json`

### Body Schema

The body is the `UIMessage[]` format sent automatically by `useChat` from `@ai-sdk/react`:

```json
{
  "messages": [
    {
      "id": "string",
      "role": "user" | "assistant",
      "parts": "<MessagePart[] — provided by AI SDK>"
    }
  ]
}
```

The `messages` array is the full conversation history. The route MUST NOT strip history —
the model needs it for context and language detection.

### Server-side conversion

The route converts `UIMessage[]` → `ModelMessage[]` before passing to `streamText`:

```typescript
messages: await convertToModelMessages(messages)  // from "ai"
```

This is required because `useChat` (`@ai-sdk/react` v3+) sends UIMessage format with `parts`,
while `streamText` (`ai` v6+) expects ModelMessage format with `content`.

### Validation rules

- `messages` MUST be a non-empty array.
- Malformed requests MUST return `400 Bad Request`.

---

## Response

**Content-Type**: `text/plain; charset=utf-8` (AI SDK data stream format)
**Transfer-Encoding**: `chunked` (streaming)

The response is produced by `result.toUIMessageStreamResponse()`.
The client's `useChat` hook deserialises this automatically.

### Stream part types

| Part type | When | Client rendering |
|---|---|---|
| `text-delta` | Model generating text | Appended to message text part |
| `tool-call` | Model invokes a generative UI tool | `toolPart.state = "input-available"` → "thinking…" |
| `tool-result` | Tool `execute()` returns resume data | `toolPart.state = "output-available"` → renders component |
| `finish` | Stream complete | `isLoading = false` |
| `error` | Server or model error | `error` set on `useChat` state |

---

## Tools (Generative UI)

All tools are **parameterless from the model's perspective** — the model calls them with
empty args and the `execute` function fetches data from `RESUME_DATA` directly.

Tool definitions use `inputSchema` (AI SDK v6 field name, not `parameters`):

### `renderProjectCard`

- **Description**: "Display Fernando's projects as visual cards"
- **inputSchema**: `z.object({})` (empty)
- **Execute returns**: `{ projects: RESUME_DATA.projects }`

### `renderCareerTimeline`

- **Description**: "Display Fernando's work experience as a career timeline"
- **inputSchema**: `z.object({})` (empty)
- **Execute returns**: `{ experience: RESUME_DATA.experience }` (mapped fields)

### `renderSkillTags`

- **Description**: "Display Fernando's technical skills grouped by proficiency level"
- **inputSchema**: `z.object({})` (empty)
- **Execute returns**: `{ skills: { proficient, intermediate, knowledge } }`

### `renderContactCard`

- **Description**: "Display Fernando's contact information"
- **inputSchema**: `z.object({})` (empty)
- **Execute returns**: `{ contact: { email, linkedin, location, availability } }`
  - **Note**: `RESUME_DATA.contact.phone` is intentionally EXCLUDED.

---

## System Prompt Contract

The route constructs the system prompt via `buildSystemPrompt()` from `src/lib/system-prompt.ts`.

The system prompt MUST contain:

1. **Identity framing**: The assistant is Fernando's AI representative, not Fernando himself.
2. **Factual data block**: All of `RESUME_DATA` serialised as structured text.
3. **Language instruction**: Detect language from the first user message; respond in that language; default to English.
4. **Topic restrictions**: Never express opinions on politics, social issues, religion, or controversial topics.
5. **Fabrication prevention**: If information is not in the data block, acknowledge honestly.
6. **Mandatory tool usage rules**: Explicit trigger conditions for each tool — the model MUST call the tool (not describe data in plain text) when the user asks about projects, experience, skills, or contact.

---

## Error Handling

| Scenario | Response |
|---|---|
| `GOOGLE_GENERATIVE_AI_API_KEY` missing | `500` with `{ "error": "AI service not configured" }` |
| Gemini API unavailable / timeout | `503` with `{ "error": "AI service temporarily unavailable" }` |
| Invalid or empty `messages` | `400 Bad Request` |

---

## Constraints

- `maxOutputTokens: 1000` — limits response length.
- The route is `export const runtime = "nodejs"` (not edge) to allow full Node.js APIs.
- The route MUST NOT log or persist any message content.
- Model: `gemini-2.5-flash` (`gemini-2.0-flash` is no longer available to new users).
