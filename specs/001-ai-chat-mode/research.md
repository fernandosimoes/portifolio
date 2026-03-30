# Research: AI Chat Mode with Generative UI

**Feature**: 001-ai-chat-mode
**Date**: 2026-03-28 (updated 2026-03-30)

---

## Decision 1: AI SDK and LLM Provider

**Decision**: Use Vercel AI SDK (`ai` + `@ai-sdk/google`) with Google Gemini 2.5 Flash.

**Rationale**: The existing `@google/genai` package is a lower-level Google SDK that does
not provide streaming helpers, `useChat`, or tool-calling integrations aligned with Next.js
App Router. The Vercel AI SDK provides:
- `streamText` (server) + `useChat` (client) pairing with built-in streaming support
- Tool-calling API compatible with Gemini function calling
- `toUIMessageStreamResponse()` for seamless Next.js Route Handler integration
- `message.parts` on UIMessage objects, enabling Generative UI on the client

`@ai-sdk/google` exposes `google('gemini-2.5-flash')` as a drop-in model provider.
`GOOGLE_GENERATIVE_AI_API_KEY` is the environment variable read automatically by the package.

**Note on model**: `gemini-2.0-flash` is no longer available to new users. Use `gemini-2.5-flash`.

**Alternatives considered**:
- Keep `@google/genai`: Lacks `useChat`, requires manual streaming plumbing — rejected.
- OpenAI SDK: Not the specified provider — rejected.
- LangChain.js: Adds significant bundle weight with no benefit over AI SDK — rejected.

---

## Decision 2: Generative UI Pattern

**Decision**: Server-side tools with `message.parts` rendered client-side.

**Rationale**: With Vercel AI SDK `streamText` + `tools`, the server defines tool schemas
and `execute` functions that return typed data from `resume.ts`. The streaming response
delivers tool call + result parts to the client. The client's `useChat` hook populates
`message.parts` with tool entries; the `ChatMessage` renderer switches on the part type
to mount the appropriate React component (`ProjectCard`, `CareerTimeline`, etc.).

**Implementation notes (AI SDK v6)**:
- Tool definitions use `inputSchema` (not `parameters`) in inline tool objects.
- `useChat` from `@ai-sdk/react` sends `UIMessage[]` to the route; `streamText` expects
  `ModelMessage[]`. Use `await convertToModelMessages(messages)` (from `"ai"`) to convert.
- `toUIMessageStreamResponse()` replaces the older `toDataStreamResponse()`.

**Alternatives considered**:
- RSC streaming with `createStreamableUI`: More complex server-client boundary — rejected.
- Client-side component selection from text keywords: fragile string matching — rejected.

---

## Decision 3: Chat as a Terminal Command (Architecture Change)

**Decision**: `/chat` is a terminal command that renders `ChatInterface` inline in the
terminal history, replacing the original "mode toggle" design.

**Rationale**: The original design used a `ModeState` (`"terminal" | "chat"`) with a
header toggle and `AnimatePresence` view-swapping. During implementation it became clear
that chat-as-a-command is a better fit for the terminal-first identity:
- Stays fully within the established terminal mental model (commands produce output)
- Removes the concept of "two separate pages", which felt inconsistent with the portfolio's
  terminal theme
- Eliminates `ModeState`, `AnimatePresence` view-swapping, and associated complexity
- Each `/chat` invocation gets a fresh `ChatSession` (via a fresh `useChat` mount)
- The "AI Chat" header button simply calls `onCommand("/chat")` — it is not a mode toggle

**Dropped from original design**:
- `ModeState = "terminal" | "chat"` type and `useState` in `page.tsx`
- `AnimatePresence` mode transition animation
- Mode props (`mode`, `onModeChange`) on `TerminalHeader`
- Keeping `ChatInterface` mounted-but-hidden to preserve state across mode switches

**Alternatives considered**:
- Original mode toggle: Functional but breaks terminal mental model — replaced.
- URL-based routing (`/chat` page): Leaves the terminal entirely — rejected.

---

## Decision 4: Framer Motion Integration

**Decision**: Per-message `motion.li` entrance animation in `ChatMessage`; no view-swap animation.

**Rationale**: Framer Motion 12 is already installed. Each new chat message uses a
`y: 8 → 0` + `opacity: 0 → 1` entrance animation. `prefers-reduced-motion` is respected
via `useReducedMotion` — when motion is reduced, duration is set to 0.

The mode-swap `AnimatePresence` animation from the original design was removed along with
`ModeState`. There is no longer a view transition to animate.

**Alternatives considered**:
- CSS transitions only: Cannot animate list item entrance as cleanly — rejected.
- No animation: Functional but misses polish opportunity — rejected.

---

## Decision 5: Language Detection

**Decision**: Instruct the model in the system prompt to detect language from the first
user message and respond in that language for the remainder of the session.

**Rationale**: `useChat` preserves full message history in each API call, so the model
has access to the first message on every subsequent turn. No client-side library needed.

**Alternatives considered**:
- `navigator.language`: Detects browser locale, not the language the user writes in — rejected.
- `franc` (language detection library): Adds ~30 kB; unnecessary — rejected.

---

## Decision 6: Zod Dependency

**Decision**: Add `zod` as a production dependency for tool `inputSchema` definitions.

**Rationale**: Vercel AI SDK tool schemas require Zod schema objects. Standard in the
Next.js/TypeScript ecosystem with no conflicting peer deps.

**Alternatives considered**:
- `valibot`: Also supported by AI SDK but deviates from project conventions — rejected.

---

## Decision 7: System Prompt Construction

**Decision**: A `buildSystemPrompt()` function in `src/lib/system-prompt.ts` serialises
`RESUME_DATA` into structured text with behavioural guardrails and mandatory tool-usage rules.

**Rationale**: Built at request time from a live import of `resume.ts`, enforcing the SSoT
principle mechanically. The prompt includes: identity framing, factual data block, language
detection instruction, topic restrictions, fabrication prevention, and **mandatory tool
invocation rules** specifying exactly when each of the four tools must be called.

---

## Decision 8: Package Changes

**Packages removed**:
- `@google/genai` — superseded by `@ai-sdk/google`

**Packages added**:
- `ai` — Vercel AI SDK core (v6+)
- `@ai-sdk/google` — Google Gemini provider
- `@ai-sdk/react` — `useChat` hook
- `zod` — Tool schema validation
