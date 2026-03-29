# Research: AI Chat Mode with Generative UI

**Feature**: 001-ai-chat-mode
**Date**: 2026-03-28

---

## Decision 1: AI SDK and LLM Provider

**Decision**: Use Vercel AI SDK (`ai` + `@ai-sdk/google`) with Google Gemini 2.0 Flash.

**Rationale**: The existing `@google/genai` package is a lower-level Google SDK that does
not provide streaming helpers, `useChat`, or tool-calling integrations aligned with Next.js
App Router. The Vercel AI SDK provides:
- `streamText` (server) + `useChat` (client) pairing with built-in streaming support
- Tool-calling API compatible with Gemini 2.0 Flash function calling
- `toDataStreamResponse()` for seamless Next.js Route Handler integration
- `toolInvocations` on message objects, enabling Generative UI on the client

`@ai-sdk/google` exposes `google('gemini-2.0-flash')` as a drop-in model provider.
`GOOGLE_GENERATIVE_AI_API_KEY` is the environment variable read automatically by the package.

**Alternatives considered**:
- Keep `@google/genai`: Lacks `useChat`, requires manual streaming plumbing — rejected.
- OpenAI SDK: Not the specified provider — rejected.
- LangChain.js: Adds significant bundle weight with no benefit over AI SDK — rejected.

---

## Decision 2: Generative UI Pattern

**Decision**: Server-side tools with `toolInvocations` rendered client-side.

**Rationale**: With Vercel AI SDK `streamText` + `tools`, the server defines tool schemas
(Zod) and `execute` functions that return typed data from `resume.ts`. The streaming response
delivers tool call + result parts to the client. The client's `useChat` hook populates
`message.parts` with `tool-invocation` entries; the `ChatMessage` renderer switches on
`toolName` to mount the appropriate React component (`ProjectCard`, `CareerTimeline`, etc.).
`maxSteps: 2` allows one tool call followed by a final text response in the same turn.

**Alternatives considered**:
- RSC streaming with `createStreamableUI` (AI SDK RSC): More complex server-client boundary,
  requires React Server Component streaming infrastructure beyond what App Router provides
  here — rejected in favour of the simpler data-stream pattern.
- Client-side component selection from text keywords: fragile string matching — rejected.

---

## Decision 3: Mode State Management

**Decision**: Local `useState` in `page.tsx` — no Context or external state manager.

**Rationale**: Mode state (`"terminal" | "chat"`) is consumed only by `page.tsx` and
`TerminalHeader`. Terminal history and chat messages each live in their own component
(`page.tsx` for terminal, `useChat` for chat). No cross-cutting state sharing is needed.
A Context or Zustand store would add indirection with zero benefit at this scale.

**Alternatives considered**:
- React Context: Appropriate if 3+ unrelated subtrees needed the mode value — not the case.
- URL search param (`?mode=chat`): Enables shareable links but adds router complexity and
  is non-standard for a portfolio — deferred to future enhancement.

---

## Decision 4: Framer Motion Integration

**Decision**: `AnimatePresence` + `motion.div` on the Terminal/Chat view swap; per-message
`motion.div` entrance animation in the chat message list.

**Rationale**: Framer Motion 12 is already installed. `AnimatePresence` handles exit
animations when a view unmounts (required to animate the outgoing mode). Mode transitions
use a simple fade + slight vertical translate. Each new chat message entrance uses a
`y: 8 → 0` + `opacity: 0 → 1` animation. `prefers-reduced-motion` is respected via
Framer Motion's built-in `useReducedMotion` hook — when motion is reduced, duration is
set to 0.

**Alternatives considered**:
- CSS transitions only: Would work but cannot animate unmounting elements — rejected.
- No animation: Functional but misses the polish opportunity given the library is already
  installed — rejected.

---

## Decision 5: Language Detection

**Decision**: Instruct the model in the system prompt to detect language from the first
user message and respond in that language for the remainder of the session.

**Rationale**: `useChat` preserves full message history in each API call, so the model
has access to the first message on every subsequent turn and can maintain language
consistency. No client-side language-detection library is needed, which avoids adding
a dependency and keeps the bundle lean.

**Alternatives considered**:
- `navigator.language` + explicit `Accept-Language` header: Detects browser locale, not
  the language the user actually writes in — rejected as less accurate.
- `franc` (language detection library): Adds ~30 kB; unnecessary when the model can do
  this natively — rejected.

---

## Decision 6: Zod Dependency

**Decision**: Add `zod` as a production dependency.

**Rationale**: Vercel AI SDK tool schemas require Zod schema objects. Zod is the standard
validation library in the Next.js/TypeScript ecosystem and has no conflicting peer deps
with the current stack.

**Alternatives considered**:
- `@ai-sdk/zod` re-export: Not a real package; `zod` must be added directly.
- `valibot`: Also supported by AI SDK but would deviate from project conventions — rejected.

---

## Decision 7: System Prompt Construction

**Decision**: A `buildSystemPrompt()` function in `src/lib/system-prompt.ts` serialises
`RESUME_DATA` to a structured text block and combines it with behavioural guardrails.

**Rationale**: Building the prompt at request time from a live import of `resume.ts`
ensures the SSoT principle (Constitution §VI) is enforced mechanically. The prompt
includes: identity framing, factual data block, language detection instruction, topic
restrictions, and tool usage guidance. This is a pure function with no side effects —
easy to test and update.

---

## Decision 8: Package Changes

**Packages to remove**:
- `@google/genai` — superseded by `@ai-sdk/google`

**Packages to add**:
- `ai` — Vercel AI SDK core
- `@ai-sdk/google` — Google Gemini provider for AI SDK
- `zod` — Tool schema validation (required by AI SDK)
