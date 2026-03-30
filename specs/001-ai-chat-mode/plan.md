# Implementation Plan: AI Chat Mode with Generative UI

**Branch**: `001-ai-chat-mode` | **Date**: 2026-03-28 (updated 2026-03-30) | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ai-chat-mode/spec.md`

## Summary

Add an AI-powered `/chat` command to the existing terminal-themed portfolio. Visitors type
`/chat` in the terminal (or click the "AI Chat" header button) to launch an inline chat
session directly within the terminal history — no separate mode or page. The AI assistant
responds using Google Gemini 2.5 Flash via Vercel AI SDK, streaming responses with optional
Generative UI components (ProjectCard, CareerTimeline, SkillTags, ContactCard) inline.
All data is sourced exclusively from `src/data/resume.ts`. Framer Motion handles per-message
entrance animations.

## Technical Context

**Language/Version**: TypeScript 5 (strict), React 19, Node.js 20
**Primary Dependencies**: Next.js 16 (App Router), `ai` + `@ai-sdk/google` (Vercel AI SDK), `@ai-sdk/react`, `zod`, Framer Motion 12, Tailwind CSS 4, Lucide React, `clsx` + `tailwind-merge`
**Storage**: N/A — conversation state is in-memory only; no persistence
**Testing**: N/A — no tests requested in spec
**Target Platform**: Web application — AWS Amplify (Node.js runtime; not Edge)
**Project Type**: web-app (Next.js fullstack)
**Performance Goals**: Chat response visible within 5 s; Lighthouse mobile ≥ 90 maintained
**Constraints**: `"use client"` only for ChatInterface and its children; API key in `.env.local` only; phone number MUST NOT appear in any response
**Scale/Scope**: Single-page portfolio; low traffic; no rate limiting required in v1

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. TypeScript-First | ✅ PASS | All new files are `.ts`/`.tsx`, strict mode, typed interfaces |
| II. Terminal Visual Identity | ✅ PASS | Chat renders inline in terminal history; same stone/mono palette |
| III. Performance & Server-First | ⚠️ JUSTIFIED | `ChatInterface.tsx` and children require `"use client"` for streaming (`useChat`). API route is server-only. No avoidable client boundary added. |
| IV. Accessibility (WCAG 2.1 AA) | ✅ PASS | Chat input has `aria-label`; message list has `role="log"`; chips are `<button>` with visible focus |
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
└── tasks.md             # Phase 2 output (all tasks complete ✅)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts              # AI SDK route handler (server only)
│   ├── page.tsx                      # Root page — renders terminal + /chat command
│   └── layout.tsx                    # Unchanged
├── components/
│   └── portfolio/
│       ├── terminal/
│       │   └── TerminalHeader.tsx    # MODIFIED: added "AI Chat" nav button (no mode props)
│       ├── commands/
│       │   └── BasicCommands.tsx     # MODIFIED: /chat listed in HelpCommand
│       └── chat/                    # NEW directory
│           ├── ChatInterface.tsx     # NEW: inline chat component ("use client")
│           ├── ChatMessage.tsx       # NEW: renders text + tool parts
│           ├── SuggestionChips.tsx   # NEW: welcome chips
│           └── generative/
│               ├── ProjectCard.tsx
│               ├── CareerTimeline.tsx
│               ├── SkillTags.tsx
│               └── ContactCard.tsx
├── lib/
│   ├── utils.ts                      # NEW: cn() helper
│   └── system-prompt.ts              # NEW: builds system prompt from RESUME_DATA
├── types/
│   └── chat.ts                       # NEW: SuggestionChip, GenerativeComponentType
└── data/
    └── resume.ts                     # Unchanged (single source of truth)
```

**Structure Decision**: `/chat` is a terminal command rendered inline in the existing
`renderCommandOutput` switch in `page.tsx`, alongside `/about`, `/projects`, `/jobs`, and
`/skills`. `ChatInterface` mounts fresh per `/chat` invocation (each gets its own session).
No mode state, no `AnimatePresence` view switching.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| `"use client"` on `ChatInterface` and children | `useChat` hook requires browser APIs for streaming | Cannot stream AI responses in a Server Component |

## Phase 0: Research Summary

All research decisions are recorded in [research.md](./research.md). Key decisions:

- **AI SDK**: Vercel AI SDK (`ai` + `@ai-sdk/google`) with `gemini-2.5-flash`.
  Provides `streamText`, `useChat`, tool calling, and `toUIMessageStreamResponse()`.
- **Message conversion**: `convertToModelMessages()` (from `ai`) converts `UIMessage[]`
  sent by `@ai-sdk/react`'s `useChat` into `ModelMessage[]` expected by `streamText`.
- **Generative UI**: Server-side tools with typed `execute` functions return resume data.
  Client renders components from `message.parts` tool entries.
- **Chat as command**: `ChatInterface` renders inline in terminal history via the `/chat`
  command handler — no separate mode, no `ModeState`, no `AnimatePresence` view swap.
- **Framer Motion**: Per-message entrance animations only; `useReducedMotion` respected.
- **Language detection**: System prompt instruction — model detects from first message.
- **Tool schema**: AI SDK v6 uses `inputSchema` (not `parameters`) in inline tool objects.

## Phase 1: Design Artifacts

### data-model.md (complete)

Key entities: `ChatMessage`, `ToolInvocation`, `GenerativeComponentType`,
`GenerativeToolResult` (per tool), `SuggestionChip`, `ChatSession`.
`ModeState` removed — chat is a command, not a mode.
See [data-model.md](./data-model.md) for full definitions and state transitions.

### contracts/chat-api.md (complete)

`POST /api/chat` — accepts AI SDK UIMessage history (converted to ModelMessage[] server-side),
streams text-delta + tool parts via `toUIMessageStreamResponse()`.
Four parameterless tools using `inputSchema`. Model: `gemini-2.5-flash`.
See [contracts/chat-api.md](./contracts/chat-api.md).

### quickstart.md (complete)

Covers: branch setup, dependency changes, env variable configuration, dev server,
`/chat` command verification, Chat mode smoke tests, language detection test, mobile check.
See [quickstart.md](./quickstart.md).

## Constitution Check (Post-Design)

| Principle | Status | Change from initial |
|---|---|---|
| I. TypeScript-First | ✅ PASS | No change |
| II. Terminal Visual Identity | ✅ PASS | Strengthened — chat is now literally inside the terminal |
| III. Performance & Server-First | ⚠️ JUSTIFIED | No change — client boundary justified and minimal |
| IV. Accessibility | ✅ PASS | No change |
| V. Mobile-Responsive | ✅ PASS | No change |
| VI. SSoT | ✅ PASS | No change |
| VII. AI Communication | ✅ PASS | System prompt updated with mandatory tool-usage rules |
