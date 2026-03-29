# Implementation Plan: AI Chat Mode with Generative UI

**Branch**: `001-ai-chat-mode` | **Date**: 2026-03-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ai-chat-mode/spec.md`

## Summary

Add a Chat mode to the existing terminal-themed portfolio that lets visitors ask natural
language questions about Fernando Simoes da Silva (Senior Software Engineer, 10+ yrs).
The mode is toggled from the terminal header. The AI assistant responds using Google
Gemini 2.0 Flash via Vercel AI SDK, streaming responses with optional Generative UI
components (ProjectCard, CareerTimeline, SkillTags, ContactCard) inline in the chat.
All data is sourced exclusively from `src/data/resume.ts`. Framer Motion 12 handles
mode transition and message entrance animations.

## Technical Context

**Language/Version**: TypeScript 5 (strict), React 19, Node.js 20
**Primary Dependencies**: Next.js 16 (App Router), `ai` + `@ai-sdk/google` (Vercel AI SDK), `zod`, Framer Motion 12, Tailwind CSS 4, Lucide React, `clsx` + `tailwind-merge`
**Storage**: N/A — conversation state is in-memory only; no persistence
**Testing**: N/A — no tests requested in spec
**Target Platform**: Web application — AWS Amplify (Node.js runtime; not Edge)
**Project Type**: web-app (Next.js fullstack)
**Performance Goals**: Chat response visible within 5 s; Lighthouse mobile ≥ 90 maintained
**Constraints**: `"use client"` only for ChatInterface and its children; all other new files MUST be server components or shared utilities; phone number MUST NOT appear in any response
**Scale/Scope**: Single-page portfolio; low traffic; no rate limiting required in v1

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. TypeScript-First | ✅ PASS | All new files are `.ts`/`.tsx`, strict mode, typed interfaces |
| II. Terminal Visual Identity | ✅ PASS | Chat components use `stone-*` palette, `font-mono`, Tailwind utilities only |
| III. Performance & Server-First | ⚠️ JUSTIFIED | `ChatInterface.tsx` and children require `"use client"` for streaming (`useChat`). API route is a server-only Next.js Route Handler. All generative UI components are rendered inside the client chat — no avoidable client boundary added. |
| IV. Accessibility (WCAG 2.1 AA) | ✅ PASS | Chat input must have label; messages must be in `<ul>` with `role="log"` or equivalent; suggestion chips are `<button>` elements with visible focus |
| V. Mobile-Responsive | ✅ PASS | All chat components are mobile-first; chip row wraps; input is full-width |
| VI. Single Source of Truth | ✅ PASS | System prompt and tool results built from `RESUME_DATA`; no hardcoded personal data |
| VII. Responsible AI Communication | ✅ PASS | Enforced via system prompt guardrails in `buildSystemPrompt()` |

## Project Structure

### Documentation (this feature)

```text
specs/001-ai-chat-mode/
├── plan.md              # This file
├── research.md          # Phase 0 — decisions and rationale
├── data-model.md        # Phase 1 — entities and state model
├── quickstart.md        # Phase 1 — setup guide
├── contracts/
│   └── chat-api.md      # POST /api/chat route contract
└── tasks.md             # Phase 2 output (/speckit.tasks — not yet created)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts              # NEW: Vercel AI SDK route handler
│   ├── page.tsx                      # MODIFY: add mode state + AnimatePresence wrapper
│   └── layout.tsx                    # unchanged
├── components/
│   └── portfolio/
│       ├── terminal/
│       │   └── TerminalHeader.tsx    # MODIFY: add Terminal/Chat toggle buttons
│       ├── commands/                 # unchanged
│       └── chat/                    # NEW directory
│           ├── ChatInterface.tsx     # NEW: root chat container ("use client")
│           ├── ChatMessage.tsx       # NEW: renders text + toolInvocations
│           ├── ChatInput.tsx         # NEW: controlled input with submit
│           ├── SuggestionChips.tsx   # NEW: welcome chips
│           └── generative/          # NEW directory
│               ├── ProjectCard.tsx
│               ├── CareerTimeline.tsx
│               ├── SkillTags.tsx
│               └── ContactCard.tsx
├── lib/
│   └── system-prompt.ts             # NEW: builds system prompt from RESUME_DATA
└── data/
    └── resume.ts                    # unchanged (single source of truth)
```

**Structure Decision**: Single Next.js web application. New chat feature is self-contained
under `src/components/portfolio/chat/`. Server logic lives in `src/app/api/chat/route.ts`
and `src/lib/system-prompt.ts`. No new top-level directories are introduced.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| `"use client"` on `ChatInterface` and children | `useChat` hook requires browser APIs for streaming; React state for message list | Cannot stream AI responses in a Server Component; RSC streaming (createStreamableUI) is more complex, not simpler |

## Phase 0: Research Summary

All research decisions are recorded in [research.md](./research.md). Key decisions:

- **AI SDK**: Vercel AI SDK (`ai` + `@ai-sdk/google`) replaces `@google/genai`.
  Provides `streamText`, `useChat`, tool calling, and `toDataStreamResponse()`.
- **Generative UI**: Server-side `tools` with typed `execute` functions return resume data.
  Client renders components from `toolInvocations` in message parts.
- **Mode state**: Local `useState` in `page.tsx` — no Context needed.
- **Framer Motion**: `AnimatePresence` for mode transitions; per-message entrance animations.
- **Language detection**: System prompt instruction — model detects from first message.
- **New packages**: `ai`, `@ai-sdk/google`, `zod`. Remove: `@google/genai`.

## Phase 1: Design Artifacts

### data-model.md (complete)

Key entities: `ModeState`, `ChatMessage`, `ToolInvocation`, `GenerativeComponentType`,
`GenerativeToolResult` (per tool), `SuggestionChip`, `ChatSession`.
See [data-model.md](./data-model.md) for full definitions and state transitions.

### contracts/chat-api.md (complete)

`POST /api/chat` — accepts AI SDK message history, streams text-delta + tool parts.
Four parameterless tools: `renderProjectCard`, `renderCareerTimeline`, `renderSkillTags`,
`renderContactCard`. System prompt contract defined.
See [contracts/chat-api.md](./contracts/chat-api.md).

### quickstart.md (complete)

Covers: branch setup, dependency changes, env variable configuration, dev server,
mode toggle verification, Chat mode smoke tests, language detection test, mobile check.
See [quickstart.md](./quickstart.md).

## Constitution Check (Post-Design)

Re-evaluated after Phase 1 — no changes to initial assessment.

| Principle | Status | Change from initial |
|---|---|---|
| I. TypeScript-First | ✅ PASS | No change — all entities are strongly typed |
| II. Terminal Visual Identity | ✅ PASS | No change — component designs use stone palette |
| III. Performance & Server-First | ⚠️ JUSTIFIED | No change — client boundary justified and minimal |
| IV. Accessibility | ✅ PASS | data-model adds `role="log"` requirement for message list |
| V. Mobile-Responsive | ✅ PASS | No change |
| VI. SSoT | ✅ PASS | No change — tool execute functions sourced from RESUME_DATA |
| VII. AI Communication | ✅ PASS | No change — system prompt contract enforces all guardrails |
