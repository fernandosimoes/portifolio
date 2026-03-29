<!--
=============================================================================
SYNC IMPACT REPORT
=============================================================================
Version change: (unset) → 1.0.0 (initial constitution, all placeholders filled)

Modified principles: N/A (initial creation)

Added sections:
  - Core Principles (I–VII)
  - Technology Standards
  - Development Workflow & Quality Gates
  - Governance

Removed sections: N/A

Templates reviewed and status:
  ✅ .specify/memory/constitution.md — written (this file)
  ✅ .specify/templates/plan-template.md — Constitution Check section present;
       gates align with principles below (TypeScript, a11y, performance, SSoT)
  ✅ .specify/templates/spec-template.md — FR/SC sections align; no structural
       changes required; mention of WCAG 2.1 AA and resume.ts as source of
       truth should be referenced in feature specs when relevant
  ✅ .specify/templates/tasks-template.md — task categories (Setup, Foundational,
       User Story phases, Polish) are compatible; accessibility and performance
       tasks MUST appear in the Polish phase for any UI-facing feature
  ⚠ .specify/templates/checklist-template.md — review for a11y and SSoT gates
       not yet validated; manual follow-up recommended

Deferred TODOs: None — all fields resolved.
=============================================================================
-->

# Developer Portfolio Constitution

## Core Principles

### I. TypeScript-First Code Quality

All source files MUST be authored in TypeScript with strict mode enabled.
React components MUST be typed with explicit prop interfaces; `any` is
prohibited unless accompanied by a suppression comment explaining why it
is unavoidable. Code MUST be clean and maintainable: functions stay small
and single-purpose, components own one responsibility, and no dead code
is committed.

**Rationale**: Type safety catches integration errors at compile time and
keeps a solo-maintained codebase navigable over time.

### II. Terminal Visual Identity

Every UI element MUST conform to the established terminal aesthetic:
dark background (`#0a0a0a` or equivalent), monospace fonts
(`font-mono` / Geist Mono), low-saturation accent palette, and minimal
chrome. New components MUST NOT introduce rounded-corner card patterns,
gradients, or decorative imagery that break the terminal metaphor.
Tailwind utility classes are the sole styling mechanism — inline `style`
props are prohibited for visual properties.

**Rationale**: Visual consistency is the portfolio's brand signal;
deviations erode the intentional aesthetic and require costly cleanup.

### III. Performance & Server-First Rendering

Components MUST be React Server Components (RSC) by default. `"use client"`
MUST only be added when the component requires browser APIs, event handlers,
or stateful interactivity that cannot be handled server-side. Third-party
scripts and heavy client bundles require explicit justification. Images MUST
use Next.js `<Image>` with defined dimensions. The portfolio MUST achieve a
Lighthouse Performance score ≥ 90 on mobile.

**Rationale**: A portfolio page must be fast — slow load times disqualify
the author before a recruiter reads a single line.

### IV. Accessibility (WCAG 2.1 AA — NON-NEGOTIABLE)

All interactive elements MUST be keyboard-navigable and carry semantic
HTML roles. Color contrast MUST meet WCAG 2.1 AA ratios (4.5:1 for normal
text, 3:1 for large text). Every `<img>` and icon used decoratively MUST
carry `aria-hidden="true"`; icons conveying meaning MUST have an
`aria-label`. Focus indicators MUST be visible and never suppressed with
`outline: none` without a replacement. Motion MUST respect
`prefers-reduced-motion`.

**Rationale**: Accessibility is a professional baseline, not an optional
enhancement. Failing WCAG also represents a legal risk.

### V. Mobile-Responsive Design

Layouts MUST be designed mobile-first using Tailwind responsive prefixes
(`sm:`, `md:`, `lg:`). No horizontal overflow is permitted on viewports
≥ 320 px wide. Touch targets MUST be ≥ 44×44 px. Navigation MUST remain
usable without a mouse on all breakpoints.

**Rationale**: Recruiters view portfolios on phones; a broken mobile
layout signals inattention to detail.

### VI. Single Source of Truth — `resume.ts`

All factual content (work history, skills, projects, education, contact
information) MUST be sourced exclusively from `src/data/resume.ts` (or its
designated canonical path). Hardcoded strings for personal data are
prohibited in component files. Any new data displayed on the site MUST be
added to `resume.ts` first, then consumed via typed imports.

**Rationale**: Diverging data sources create stale content. One file to
update means one place to audit.

### VII. Responsible AI Communication

Any AI-generated or AI-assisted text surfaced to the user MUST be
professional, factual, and grounded in verifiable information from
`resume.ts`. AI responses MUST NOT express opinions on political, social,
religious, or otherwise controversial topics. Speculative claims about
future employment or earnings are prohibited. If a question falls outside
the scope of the portfolio, the AI MUST politely decline rather than
fabricate an answer.

**Rationale**: The portfolio represents a professional identity; off-topic
or opinionated AI output creates reputational risk.

## Technology Standards

The following stack is fixed and MUST NOT be replaced without a constitution
amendment:

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js (App Router) | RSC-first, no Pages Router |
| Language | TypeScript (strict) | `tsconfig` strict: true |
| Styling | Tailwind CSS v4 | Utility-only, no CSS Modules |
| Icon library | Lucide React | No other icon sets without justification |
| Class utility | `clsx` + `tailwind-merge` | Via a shared `cn()` helper |
| Data | `resume.ts` | Single source of truth (Principle VI) |

New dependencies require explicit approval and MUST be evaluated against
bundle-size impact before being added to `package.json`.

## Development Workflow & Quality Gates

Every pull request or commit touching UI components MUST pass the following
gates before merge:

1. **TypeScript** — `tsc --noEmit` reports zero errors.
2. **Linting** — ESLint exits cleanly with no warnings suppressed via
   inline disables without justification.
3. **Accessibility** — Manual keyboard navigation check on any new
   interactive element; axe-core or equivalent scan shows zero critical
   violations.
4. **Visual regression** — New components MUST be reviewed in a browser
   at 375 px (mobile) and 1280 px (desktop) before merge.
5. **Performance** — Any change adding a new `"use client"` boundary MUST
   include a brief justification comment at the top of the file.
6. **SSoT compliance** — No personal data hardcoded outside `resume.ts`.

Hotfixes (typos, broken links) may bypass visual regression review but
MUST still pass TypeScript and lint gates.

## Governance

This constitution supersedes all other coding standards, README guidance,
and verbal conventions for this project. Amendments require:

1. A written rationale explaining what is changing and why.
2. A version bump following semantic versioning (see policy below).
3. An update to the Sync Impact Report header of this file.
4. Review of affected templates and commands in `.specify/`.

**Versioning policy**:
- MAJOR — Principle removed, redefined, or governance fundamentally changed.
- MINOR — New principle or section added; material expansion of existing guidance.
- PATCH — Clarifications, wording improvements, typo fixes.

All feature specs and implementation plans MUST include a Constitution Check
section verifying compliance with Principles I–VII before work begins.
Complexity that violates a principle MUST be justified in the plan's
Complexity Tracking table.

**Version**: 1.0.0 | **Ratified**: 2026-03-28 | **Last Amended**: 2026-03-28
