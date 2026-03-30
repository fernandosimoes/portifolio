---
description: "Task list for AI Chat Mode with Generative UI"
---

# Tasks: AI Chat Mode with Generative UI

**Input**: Design documents from `/specs/001-ai-chat-mode/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/chat-api.md ✅

**Tests**: Not requested in spec — no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation
and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)
- Exact file paths included in all descriptions

## Path Conventions

- Source root: `src/` at repository root
- Chat components: `src/components/portfolio/chat/`
- Generative UI components: `src/components/portfolio/chat/generative/`
- Shared utilities: `src/lib/`
- Types: `src/types/`
- API route: `src/app/api/chat/`

---

## Phase 1: Setup

**Purpose**: Dependency changes and shared infrastructure required before any story work

- [X] T001 Update package.json — run `npm uninstall @google/genai && npm install ai @ai-sdk/google zod` and confirm package.json no longer contains `@google/genai` and now contains `ai`, `@ai-sdk/google`, `zod`
- [X] T002 [P] Create `.env.local` in repo root with placeholder line `GOOGLE_GENERATIVE_AI_API_KEY=` and verify `.gitignore` already excludes `.env.local` (add exclusion if missing)
- [X] T003 [P] Create `src/lib/utils.ts` — export `cn()` helper that composes `clsx` and `tailwind-merge`: `export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }`

---

## Phase 2: Foundational

**Purpose**: Shared type definitions consumed by all user story components and the API route

**⚠️ CRITICAL**: T004 must be complete before any user story implementation begins

- [X] T004 Create `src/types/chat.ts` — export `ModeState = "terminal" | "chat"`, `SuggestionChip { id: string; label: string; prompt: string }`, and `GenerativeComponentType = "renderProjectCard" | "renderCareerTimeline" | "renderSkillTags" | "renderContactCard"`

**Checkpoint**: Types exported and importable — user story implementation can now begin

---

## Phase 3: User Story 1 — Mode Toggle (Priority: P1) 🎯 MVP

**Goal**: Visitors can switch between Terminal and Chat modes; each mode retains its own
independent history across switches.

**Independent Test**: Click Chat toggle → chat placeholder appears; type a terminal
command; click Terminal toggle → terminal shows history; switch back 5 times — no
history loss in either mode.

### Implementation for User Story 1

- [X] T005 [US1] Update `src/components/portfolio/terminal/TerminalHeader.tsx` — add `mode: ModeState` and `onModeChange: (mode: ModeState) => void` to `TerminalHeaderProps`; render two toggle buttons labelled "Terminal" and "Chat" alongside the existing nav buttons; active button uses `bg-emerald-900 border-emerald-700 text-emerald-300`; inactive uses existing `bg-stone-900 border-stone-800 text-stone-300` style
- [X] T006 [P] [US1] Create `src/components/portfolio/chat/ChatInterface.tsx` — `"use client"` placeholder component with `h-full bg-stone-950 text-stone-400 font-mono flex flex-col` layout; render a centered `<p>` reading `Chat mode — coming soon` (will be replaced in US2); no props required yet
- [X] T007 [US1] Update `src/app/page.tsx` — import `ModeState` from `src/types/chat`; add `const [mode, setMode] = useState<ModeState>("terminal")`; pass `mode` and `onModeChange={setMode}` to `TerminalHeader`; keep both the terminal `<div>` and `<ChatInterface />` rendered at all times; use `className={mode === "terminal" ? "flex-1 overflow-y-auto ..." : "hidden"}` pattern to show/hide each view without unmounting (preserves state); wrap the swappable view area with `<AnimatePresence mode="wait">` and `<motion.key>` divs for fade transition

**Checkpoint**: Mode toggle is fully functional and independently testable without AI backend

---

## Phase 4: User Story 2 — Natural Language Q&A (Priority: P2)

**Goal**: Visitors can ask questions in Chat mode and receive factual streaming text
responses grounded in `resume.ts` data, with guardrails for off-topic queries.

**Independent Test**: Ask "What is Fernando's most recent job?" → response mentions
PrivateID and is consistent with `resume.ts`; ask "What do you think of immigration
policy?" → assistant declines and redirects; follow-up question references prior answer.

### Implementation for User Story 2

- [X] T008 [US2] Create `src/lib/system-prompt.ts` — export `buildSystemPrompt(): string` that imports `RESUME_DATA` and serialises it into a structured text block (name, role, summary, experience list, skills, projects, education, contact — excluding phone); prepend identity framing ("You are Fernando's AI representative, not Fernando himself"), language detection instruction ("Detect the language of the user's first message and respond in that language for the entire session; default to English"), topic restriction guardrail ("Never express opinions on politics, social issues, religion, or other controversial topics; politely redirect to professional topics"), and fabrication-prevention rule ("If information is not in the data provided, acknowledge honestly rather than guessing")
- [X] T009 [US2] Create `src/app/api/chat/route.ts` — `export const runtime = "nodejs"`; export `async function POST(req: Request)`; parse `{ messages }` from JSON body; validate messages array is non-empty (return 400 otherwise); call `streamText` with `model: google("gemini-2.0-flash")`, `system: buildSystemPrompt()`, `messages`, and `maxTokens: 1000`; return `result.toDataStreamResponse()`; catch errors: return `{ error: "AI service not configured" }` 500 when API key missing, `{ error: "AI service temporarily unavailable" }` 503 on upstream failures
- [X] T010 [P] [US2] Create `src/components/portfolio/chat/ChatInput.tsx` — `"use client"` component accepting `value: string`, `onChange`, `onSubmit`, `isLoading: boolean` props; render a `<form>` with a text `<input>` (placeholder "Ask me anything…", `aria-label="Chat message input"`) and a submit `<button>` with `aria-label="Send message"`; disable both when `isLoading === true` or `value.trim() === ""`; style with terminal theme: `bg-stone-900 border-t border-stone-800 px-4 py-3`; input is `bg-transparent text-stone-100 caret-emerald-500 font-mono`
- [X] T011 [P] [US2] Create `src/components/portfolio/chat/ChatMessage.tsx` — `"use client"` component accepting a Vercel AI SDK `Message` object; render user messages with `➜ ~ ` prefix and `text-stone-100 font-bold` styling (matching existing terminal prompt style); render assistant messages with `text-stone-400` body text; handle empty content gracefully (return null); toolInvocations rendering will be added in US3 (add empty placeholder section with comment `{/* Generative UI components — added in US3 */}`)
- [X] T012 [US2] Replace `src/components/portfolio/chat/ChatInterface.tsx` placeholder — integrate `useChat({ api: "/api/chat" })` hook; render messages in `<ol role="log" aria-live="polite" aria-label="Chat conversation">` using `ChatMessage` for each entry; scroll to bottom on new message using `useEffect` + `ref`; render `ChatInput` pinned to bottom with `value={input}`, `onChange={handleInputChange}`, `onSubmit={handleSubmit}`, `isLoading={isLoading}`; show `error?.message` in a `text-red-400` banner when error is set

**Checkpoint**: Full text-only Q&A is functional; AI responds to questions about Fernando using resume data

---

## Phase 5: User Story 3 — Generative UI Components (Priority: P3)

**Goal**: When visitors ask about projects, experience, skills, or contact, the assistant
renders rich inline components alongside or instead of plain text.

**Independent Test**: Ask "Show me your projects" → ProjectCard appears with Wallet
Rebalancing data; ask "What's your work history?" → CareerTimeline shows all 5 companies;
ask "What are your skills?" → SkillTags shows three proficiency groups; ask "How do I
contact you?" → ContactCard shows email, LinkedIn, location (no phone).

### Implementation for User Story 3

- [X] T013 [P] [US3] Create `src/components/portfolio/chat/generative/ProjectCard.tsx` — accepts `projects: Array<{ name: string; status: string; description: string; techStack: string[] }>` prop; for each project render: name as `text-emerald-400 font-bold` heading, status badge, description as `text-stone-400` paragraph, tech stack as flex-wrap row of `text-xs bg-stone-800 border border-stone-700 px-2 py-0.5 font-mono` tag spans; no rounded corners; `border-l-2 border-emerald-600 pl-4` left-border accent; full-width on mobile
- [X] T014 [P] [US3] Create `src/components/portfolio/chat/generative/CareerTimeline.tsx` — accepts `experience: Array<{ company: string; role: string; period: string; location: string; description: string; achievements: string[] }>` prop; render as vertical list with `border-l-2 border-stone-700 pl-4 space-y-6`; each entry: company as `text-emerald-400 font-bold`, role as `text-stone-300`, period + location as `text-stone-600 text-xs`, description as `text-stone-400 text-sm`; no rounded corners; font-mono
- [X] T015 [P] [US3] Create `src/components/portfolio/chat/generative/SkillTags.tsx` — accepts `skills: { proficient: string[]; intermediate: string[]; knowledge: string[] }` prop; render three labelled sections: "Proficient" (label `text-emerald-400`), "Intermediate" (label `text-sky-400`), "Familiar" (label `text-stone-400`); each skill is a `font-mono text-xs px-2 py-0.5 border` tag; proficient uses `border-emerald-700 text-emerald-300`, intermediate uses `border-sky-800 text-sky-300`, familiar uses `border-stone-700 text-stone-400`
- [X] T016 [P] [US3] Create `src/components/portfolio/chat/generative/ContactCard.tsx` — accepts `contact: { email: string; linkedin: string; location: string; availability: string }` prop; render as a `border border-stone-800 bg-stone-900 p-4` block with four rows using Lucide icons (`Mail`, `Linkedin`, `MapPin`, `Circle`); each row: icon `w-4 h-4 text-emerald-500 shrink-0` + label `text-stone-300 font-mono text-sm`; email renders as `<a href="mailto:...">` with `hover:text-emerald-400`; LinkedIn renders as plain text (no external link); availability uses `text-emerald-400` color
- [X] T017 [US3] Update `src/app/api/chat/route.ts` — import `tool` from `"ai"`, `z` from `"zod"`, and `RESUME_DATA` from `"@/data/resume"`; add `tools` object to `streamText` call with four entries: `renderProjectCard` (description: "Display Fernando's projects as visual cards", parameters: `z.object({})`, execute: `async () => ({ projects: RESUME_DATA.projects })`), `renderCareerTimeline` (execute: returns `{ experience: RESUME_DATA.experience }`), `renderSkillTags` (execute: returns `{ skills: { proficient: RESUME_DATA.skills.proficient, intermediate: RESUME_DATA.skills.intermediate, knowledge: RESUME_DATA.skills.knowledge } }`), `renderContactCard` (execute: returns `{ contact: { email: RESUME_DATA.contact.email, linkedin: RESUME_DATA.contact.linkedin, location: RESUME_DATA.location, availability: "Open to opportunities" } }` — phone MUST be excluded); add `maxSteps: 2`
- [X] T018 [US3] Update `src/components/portfolio/chat/ChatMessage.tsx` — import all four generative components; in the assistant message render block, iterate `message.parts` (when present); for each part where `part.type === "tool-invocation"` and `part.toolInvocation.state === "result"`: switch on `part.toolInvocation.toolName` and render the matching component passing `part.toolInvocation.result` as props; show a `text-stone-600 text-xs animate-pulse` "thinking…" indicator when `state === "call"`

**Checkpoint**: All four generative component types render inline with live resume data

---

## Phase 6: User Story 4 — Language Detection & Suggestion Chips (Priority: P4)

**Goal**: Chat mode opens with a welcome message and clickable suggestion chips;
the assistant responds in the visitor's language.

**Independent Test**: (a) Enter Chat mode — 4 chips visible; click "Show me your projects"
— message submitted and response arrives. (b) Type first message in Portuguese — response
is in Portuguese; all follow-up responses stay in Portuguese.

### Implementation for User Story 4

- [X] T019 [US4] Update `src/lib/system-prompt.ts` — append explicit language detection block to the system prompt: "LANGUAGE RULE: Identify the language of the user's very first message. Respond in that exact language for every subsequent message in this conversation. If the first message is in English or no language can be determined, default to English."
- [X] T020 [P] [US4] Create `src/components/portfolio/chat/SuggestionChips.tsx` — accepts `onChipClick: (prompt: string) => void` prop; define a static `SUGGESTION_CHIPS: SuggestionChip[]` array with 4 entries: `{ id: "chip-stack", label: "What's your tech stack?", prompt: "What technologies are you most proficient with?" }`, `{ id: "chip-projects", label: "Show me your projects", prompt: "Tell me about your projects" }`, `{ id: "chip-experience", label: "Work experience", prompt: "Walk me through your career history" }`, `{ id: "chip-contact", label: "How to reach you", prompt: "How can I contact Fernando?" }`; render as `flex flex-wrap gap-2`; each chip is a `<button>` with `bg-stone-900 hover:bg-stone-800 border border-stone-700 text-xs font-mono text-stone-300 px-3 py-1.5` and visible focus ring; clicking calls `onChipClick(chip.prompt)`
- [X] T021 [US4] Update `src/components/portfolio/chat/ChatInterface.tsx` — import `SuggestionChips`; when `messages.length === 0`, render a welcome block above the message list: `<p className="text-stone-500 font-mono text-sm">Hi! I'm Fernando's AI assistant. Ask me anything about his professional background.</p>` followed by `<SuggestionChips onChipClick={(prompt) => append({ role: "user", content: prompt })} />`; hide the welcome block once the first message is sent (`messages.length > 0`)

**Checkpoint**: Chips appear on load, submit correctly, language detection active via system prompt

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Animations, accessibility hardening, mobile verification, and final build check

- [X] T022 [P] Add Framer Motion message entrance animation in `src/components/portfolio/chat/ChatMessage.tsx` — wrap each message in `<motion.li initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}`; import `useReducedMotion` from `framer-motion` and set `transition.duration = 0` when reduced motion is preferred
- [X] T023 [P] Add Framer Motion mode transition in `src/app/page.tsx` — wrap each view's `motion.div` with `key={mode}` inside `<AnimatePresence mode="wait">`; use `initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}`; guard with `useReducedMotion` (set duration 0 when true)
- [X] T024 [P] Accessibility audit `src/components/portfolio/chat/` — verify: `<ol role="log" aria-live="polite">` on message list; `aria-label` on ChatInput text field and submit button; all `<button>` elements have visible `focus-visible:ring-2 focus-visible:ring-emerald-500` focus ring; SuggestionChips are keyboard-activatable; ContactCard email link has descriptive text; run axe-core in browser devtools and resolve any critical violations
- [X] T025 [P] Mobile visual check — open DevTools at 375×812 (iPhone SE) and 1280×800 (desktop): no horizontal overflow in either mode; suggestion chips wrap without overflow; message list scrolls within viewport; ChatInput stays visible above virtual keyboard simulation; generative components (ProjectCard, CareerTimeline, SkillTags, ContactCard) render within viewport width
- [X] T026 Final build validation — run `npm run build`; verify zero TypeScript compilation errors and zero ESLint warnings; fix any type errors or lint issues found before marking complete

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on T001 (packages must be installed)
- **US1 (Phase 3)**: Depends on T004 (ModeState type) — can start after T004
- **US2 (Phase 4)**: Depends on US1 completion (T007) — ChatInterface must exist to integrate
- **US3 (Phase 5)**: Depends on T009 (route.ts must exist before adding tools in T017); T013–T016 depend only on T004 and can run in parallel with US2
- **US4 (Phase 6)**: T019 depends on T008 (extends system-prompt.ts); T020–T021 depend on US1 completion (T007)
- **Polish (Phase 7)**: Depends on all user story phases completing

### User Story Dependencies

- **US1 (P1)**: No story dependencies — starts after Foundational
- **US2 (P2)**: Depends on US1 (ChatInterface must be integrated, not placeholder)
- **US3 (P3)**: Depends on US2 (route.ts tools extend the text-only route; ChatMessage extends the text renderer)
- **US4 (P4)**: Chips depend on US1 (ChatInterface); language detection depends on US2 (system-prompt.ts)

### Within Each Phase: Parallel Opportunities

**Phase 1**: T002 and T003 run in parallel after T001

**Phase 3 (US1)**: T005 and T006 run in parallel; T007 depends on both

**Phase 4 (US2)**: T008 runs first; T009 depends on T008; T010 and T011 run in parallel
with each other (and can start while T008 is in progress); T012 depends on T009, T010, T011

**Phase 5 (US3)**: T013, T014, T015, T016 all run in parallel; T017 depends on T009
(already done) and can start immediately; T018 depends on T013–T017

**Phase 6 (US4)**: T019 and T020 run in parallel; T021 depends on T020

**Phase 7 (Polish)**: T022, T023, T024, T025 all run in parallel; T026 runs last

---

## Parallel Example: US3 Generative Components

```bash
# Launch all four generative components simultaneously:
Task: "Create ProjectCard.tsx in src/components/portfolio/chat/generative/"
Task: "Create CareerTimeline.tsx in src/components/portfolio/chat/generative/"
Task: "Create SkillTags.tsx in src/components/portfolio/chat/generative/"
Task: "Create ContactCard.tsx in src/components/portfolio/chat/generative/"

# Once all four complete, proceed sequentially:
Task: "Update route.ts to add tools (T017)"
Task: "Update ChatMessage.tsx to render toolInvocations (T018)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational (T004)
3. Complete Phase 3: US1 — Mode Toggle (T005–T007)
4. **STOP and VALIDATE**: Toggle works, terminal history preserved, no regressions
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → environment ready
2. US1 → Mode toggle ships (no AI yet) — independently demoable
3. US2 → Text Q&A ships — recruiters can ask questions
4. US3 → Generative UI ships — rich component responses live
5. US4 → Chips + language detection — full UX polish
6. Polish → animations, a11y hardening, build validation

### Parallel Execution (Single Developer)

Focus on one phase at a time; within each phase, use the [P]-marked tasks for
maximum throughput by working across different files simultaneously.

---

## Notes

- `[P]` = different files, no blocking dependencies — safe to run simultaneously
- `[USx]` label maps each task to its user story for traceability
- Each user story phase is independently completable and testable
- NEVER surface `RESUME_DATA.contact.phone` in any component or AI response
- All generative components must use terminal aesthetic — no rounded corners, no gradients
- The `ChatInterface` component stays mounted (not unmounted) when switching to Terminal mode to preserve `useChat` state
