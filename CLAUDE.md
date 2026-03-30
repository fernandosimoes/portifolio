# Developer Portfolio — Claude Code Guidelines

Last updated: 2026-03-30 | Constitution: v1.0.0

> This file is the authoritative runtime guide for Claude Code on this project.
> It mirrors `.specify/memory/constitution.md`. When both conflict, the constitution wins.

## Active Technologies

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) — RSC-first, no Pages Router |
| Language | TypeScript 5 (strict) — `tsconfig` strict: true |
| Styling | Tailwind CSS v4 — utility-only, no CSS Modules or inline styles |
| Icons | Lucide React — no other icon sets without justification |
| Class utility | `clsx` + `tailwind-merge` via a shared `cn()` helper |
| AI SDK | `ai` + `@ai-sdk/google` (Vercel AI SDK, Gemini 2.0 Flash) |
| Animation | Framer Motion 12 |
| Data | `src/data/resume.ts` — single source of truth |
| Runtime | Node.js 20, React 19 |

## Project Structure

```text
src/
├── app/
│   ├── api/chat/route.ts          # AI SDK route handler (server only)
│   ├── page.tsx                   # Root page — mode state lives here
│   └── layout.tsx
├── components/portfolio/
│   ├── terminal/                  # Existing terminal UI
│   ├── commands/                  # Terminal command outputs
│   └── chat/                     # Chat mode (NEW)
│       ├── ChatInterface.tsx      # "use client" — streaming root
│       ├── ChatMessage.tsx
│       ├── ChatInput.tsx
│       ├── SuggestionChips.tsx
│       └── generative/            # Inline rich components
│           ├── ProjectCard.tsx
│           ├── CareerTimeline.tsx
│           ├── SkillTags.tsx
│           └── ContactCard.tsx
├── lib/
│   └── system-prompt.ts           # Builds AI system prompt from resume.ts
└── data/
    └── resume.ts                  # Single source of truth — DO NOT hardcode personal data elsewhere
```

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build (must pass with zero TS errors)
npm run lint     # ESLint — must exit clean
```

## Core Principles (non-negotiable)

### I. TypeScript-First Code Quality

- All files MUST be `.ts` / `.tsx` with strict mode.
- React components MUST have explicit typed prop interfaces.
- `any` is prohibited without a suppression comment explaining why.
- Functions stay small and single-purpose; components own one responsibility.
- No dead code committed.

### II. Terminal Visual Identity

- Dark background (`stone-950`), monospace fonts (`font-mono`), minimal chrome.
- No rounded-corner cards, gradients, or decorative imagery.
- Tailwind utility classes only — no inline `style` props for visual properties.
- All new UI components MUST match the existing stone/emerald palette.

### III. Performance & Server-First Rendering

- Components are RSC by default.
- `"use client"` MUST be justified with a comment at the top of the file.
- Only `ChatInterface` and its children require `"use client"` (streaming).
- Images MUST use Next.js `<Image>` with defined dimensions.
- Lighthouse mobile score MUST remain ≥ 90.

### IV. Accessibility (WCAG 2.1 AA — NON-NEGOTIABLE)

- All interactive elements MUST be keyboard-navigable with semantic HTML roles.
- Color contrast: 4.5:1 (normal text), 3:1 (large text).
- Decorative icons: `aria-hidden="true"`. Meaningful icons: `aria-label`.
- `outline: none` is prohibited without a visible replacement focus style.
- Motion MUST respect `prefers-reduced-motion`.

### V. Mobile-Responsive Design

- Mobile-first Tailwind (`sm:`, `md:`, `lg:`).
- No horizontal overflow on viewports ≥ 320 px.
- Touch targets MUST be ≥ 44×44 px.

### VI. Single Source of Truth — `resume.ts`

- ALL personal data (name, experience, projects, skills, contact) comes from `src/data/resume.ts`.
- Hardcoded personal strings in components are prohibited.
- `RESUME_DATA.contact.phone` MUST NEVER be surfaced in any UI or AI response.
- AI system prompt is built dynamically from `resume.ts` via `buildSystemPrompt()`.

### VII. Responsible AI Communication

- AI responses MUST be professional, factual, and grounded in `resume.ts` data only.
- AI MUST NOT express opinions on political, social, religious, or controversial topics.
- AI MUST NOT fabricate information — if unknown, acknowledge honestly.
- AI MUST clarify it is Fernando's representative, not Fernando himself.

### VIII. AI Attribution Rules
1. **No AI signatures in commits or PRs**: AI agents MUST NOT add any form of self-attribution to git commits or pull requests. This includes — but is not limited to — `Co-Authored-By: Claude`, `Generated with [Claude Code]`, `🤖 Generated with`, or any other AI tool signature in commit messages, PR titles, or PR bodies.
2. **English-only commits and PRs**: All commit messages and pull request titles, bodies, and descriptions MUST be written in English. This applies to every contributor and AI agent without exception.


## Development Workflow & Quality Gates

Every commit or PR touching UI MUST pass all of these:

1. `tsc --noEmit` — zero errors.
2. `eslint` — zero warnings without inline justification.
3. Accessibility — keyboard nav check + axe-core scan (zero critical violations).
4. Visual check — 375 px mobile AND 1280 px desktop.
5. Any new `"use client"` — justification comment required.
6. SSoT — no personal data outside `resume.ts`.

## Recent Changes

- `001-ai-chat-mode`: Added AI Chat as a terminal command (`/chat`) — Vercel AI SDK + Gemini 2.5 Flash, Generative UI components (ProjectCard, CareerTimeline, SkillTags, ContactCard), `convertToModelMessages`, `zod`. Removed `@google/genai` and mode toggle.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
