# Feature Specification: AI Chat Mode with Generative UI

**Feature Branch**: `001-ai-chat-mode`
**Created**: 2026-03-28
**Status**: Draft
**Input**: User description: "Add an AI-powered chat mode to an existing terminal-themed portfolio."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Mode Toggle: Switching Between Terminal and Chat (Priority: P1)

A visitor arriving at the portfolio sees the familiar terminal interface. They notice a
"Chat" toggle in the header and click it. The view transitions to a chat interface with a
welcome message and suggestion chips. They can click "Terminal" at any time to go back,
and their terminal history is exactly as they left it — no state was lost.

**Why this priority**: Without the mode switch, no part of Chat mode is reachable.
This story is the gate that makes all other stories possible, and it is independently
shippable as a UI-only feature with a static placeholder chat view.

**Independent Test**: Switch to Chat mode, interact with the terminal, switch back — both
modes retain their own state independently. This can be fully tested without any AI backend.

**Acceptance Scenarios**:

1. **Given** the visitor is in Terminal mode, **When** they click the Chat toggle in the header,
   **Then** the chat interface replaces the terminal view and the toggle reflects the active mode.
2. **Given** the visitor is in Chat mode, **When** they click the Terminal toggle,
   **Then** the terminal view is restored with all previous command output intact.
3. **Given** the visitor has typed commands in the terminal and also sent chat messages,
   **When** they switch between modes multiple times,
   **Then** each mode preserves its own independent history across switches.
4. **Given** the visitor is on a mobile viewport, **When** they switch modes,
   **Then** both views are fully functional and no content overflows the screen.

---

### User Story 2 — Natural Language Q&A with Text Responses (Priority: P2)

A recruiter in Chat mode types "What's your experience with React?" and receives a concise,
professional text reply from Fernando's AI assistant. The answer is grounded in Fernando's
actual resume data and does not invent or exaggerate any information. If the recruiter
asks about an unrelated topic (e.g. politics), the assistant politely declines and redirects
to professional topics.

**Why this priority**: This is the core value of Chat mode. Recruiters get a conversational
way to learn about Fernando without needing to know the terminal commands.

**Independent Test**: Can be fully tested by typing questions and verifying that answers are
factually consistent with `src/data/resume.ts`. Does not require generative UI components.

**Acceptance Scenarios**:

1. **Given** the visitor is in Chat mode, **When** they ask any question about Fernando's
   professional background, **Then** the assistant responds with a relevant, factual,
   professional answer within 5 seconds.
2. **Given** the visitor asks a question the assistant cannot answer from the available
   resume data, **When** the response is generated, **Then** the assistant honestly states
   it does not have that information rather than guessing.
3. **Given** the visitor asks about a controversial, political, or off-topic subject,
   **When** the assistant responds, **Then** it declines politely and redirects to a
   relevant professional topic without expressing any opinion.
4. **Given** the visitor asks a follow-up question referencing a previous response,
   **When** the assistant replies, **Then** the reply is contextually aware of the
   conversation history.

---

### User Story 3 — Generative UI: Rich Component Responses (Priority: P3)

A recruiter asks "Show me Fernando's projects." Instead of — or alongside — plain text,
the assistant renders an inline **ProjectCard** component directly in the chat showing the
project name, description, and tech stack tags. Similarly, asking about work history renders
a **CareerTimeline**; asking about skills renders **SkillTags** by proficiency level;
asking for contact info renders a **ContactCard**. These components match the terminal theme.

**Why this priority**: Rich components make information dramatically more scannable for
recruiters compared to reading paragraphs. This is the key differentiator of the feature.

**Independent Test**: Can be tested by asking about each data category (projects, experience,
skills, contact) and verifying the correct rich component appears inline in the chat with
accurate data from `resume.ts`.

**Acceptance Scenarios**:

1. **Given** the visitor asks about projects, **When** the assistant responds,
   **Then** one or more **ProjectCard** components appear inline, each showing the project
   name, description, and tech stack tags sourced from `resume.ts`.
2. **Given** the visitor asks about work experience or career history, **When** the assistant
   responds, **Then** a **CareerTimeline** component appears, listing each role with company,
   title, period, and key description.
3. **Given** the visitor asks about skills or technologies, **When** the assistant responds,
   **Then** a **SkillTags** component appears, grouping skills by proficiency level
   (proficient, intermediate, familiar) sourced from `resume.ts`.
4. **Given** the visitor asks how to contact Fernando, **When** the assistant responds,
   **Then** a **ContactCard** component appears showing email, LinkedIn, location, and
   availability status sourced from `resume.ts`.
5. **Given** any of the above rich components are displayed, **When** the visitor views them
   on a mobile device, **Then** the components render correctly within the viewport with no
   horizontal overflow.

---

### User Story 4 — Language Detection and Suggestion Chips (Priority: P4)

When Chat mode is first entered, the visitor sees a welcome message with 3–4 clickable
suggestion chips (e.g. "What's your tech stack?", "Show me your projects", "How can I
contact you?"). Clicking a chip sends that question automatically. If the visitor writes
their first message in Portuguese (or any other language), all subsequent assistant
responses are in that same language. Default is English.

**Why this priority**: This improves the experience for Portuguese-speaking visitors
(Fernando is Brazilian) and lowers the barrier for recruiters who don't know what to ask.

**Independent Test**: Can be tested by (a) verifying chips appear on load and submit a
message when clicked, and (b) writing the first message in Portuguese and verifying the
response is in Portuguese.

**Acceptance Scenarios**:

1. **Given** the visitor enters Chat mode, **When** the interface loads,
   **Then** a welcome message is displayed with 3–4 clickable suggestion chips.
2. **Given** the welcome chips are displayed, **When** the visitor clicks one,
   **Then** that chip's text is submitted as a question and the assistant responds.
3. **Given** the visitor's first message is written in Portuguese (or another non-English
   language), **When** the assistant responds, **Then** the response is in the same language.
4. **Given** no language signal has been detected, **When** the assistant responds,
   **Then** it defaults to English.

---

### Edge Cases

- What happens when the visitor submits an empty message in Chat mode?
  (Expected: the submit action is disabled or ignored; no API call is made.)
- What happens when the AI service is unavailable or times out?
  (Expected: a friendly error message is displayed; the conversation input remains enabled.)
- What happens when the visitor rapidly submits multiple messages before the first reply arrives?
  (Expected: requests are queued or the input is disabled while a response is in progress.)
- What happens when `resume.ts` data is incomplete for a requested component
  (e.g., empty projects array)?
  (Expected: the component is not rendered; the assistant provides a graceful text-only reply.)
- What happens if the visitor asks about the AI assistant itself?
  (Expected: the assistant clarifies it is Fernando's AI representative, not Fernando himself.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The portfolio header MUST provide two mutually exclusive toggle controls —
  "Terminal" and "Chat" — allowing visitors to switch between the two modes.
- **FR-002**: Each mode (Terminal and Chat) MUST maintain independent state; switching modes
  MUST NOT reset or discard the history of the other mode.
- **FR-003**: Chat mode MUST display a welcome message with 3–4 clickable suggestion chips
  when first entered; clicking a chip MUST submit that chip's text as a user message.
- **FR-004**: Chat mode MUST accept natural language text input from visitors and return
  responses that are factually grounded in the data defined in `src/data/resume.ts`.
- **FR-005**: The assistant MUST NEVER fabricate information not present in `resume.ts`;
  if information is unavailable, it MUST acknowledge this honestly.
- **FR-006**: The assistant MUST NEVER express opinions on political, social, religious,
  or otherwise controversial topics; it MUST politely redirect such queries to
  professional topics.
- **FR-007**: The assistant MUST clarify, when asked, that it is Fernando's AI representative
  and not Fernando himself.
- **FR-008**: When a question concerns projects, the assistant MUST render one or more
  inline **ProjectCard** components populated from `resume.ts` project data.
- **FR-009**: When a question concerns work history or career, the assistant MUST render
  an inline **CareerTimeline** component populated from `resume.ts` experience data.
- **FR-010**: When a question concerns skills or technologies, the assistant MUST render
  an inline **SkillTags** component populated from `resume.ts` skills data.
- **FR-011**: When a question concerns how to contact Fernando, the assistant MUST render
  an inline **ContactCard** component populated from `resume.ts` contact data.
- **FR-012**: The assistant MUST detect the language of the visitor's first message and
  respond in that language for the remainder of the session; it MUST default to English.
- **FR-013**: The chat interface MUST be fully usable on mobile viewports (≥ 320 px wide)
  with no horizontal overflow, accessible touch targets, and readable text.
- **FR-014**: All portfolio content displayed in Chat mode MUST be sourced exclusively
  from `src/data/resume.ts`; hardcoded content in UI components is prohibited.
- **FR-015**: Rich UI components (ProjectCard, CareerTimeline, SkillTags, ContactCard) MUST
  visually conform to the existing terminal theme (dark background, monospace typography,
  minimal chrome).

### Key Entities

- **ChatMessage**: A single message in the conversation. Has a sender role (visitor or
  assistant), a text content field, an optional inline rich component, and a timestamp.
- **RichCard**: An inline UI component attached to an assistant message. Typed as one of:
  ProjectCard, CareerTimeline, SkillTags, or ContactCard. Populated directly from resume data.
- **ChatSession**: The full ordered list of ChatMessages for the current visit. Lives
  independently of the Terminal session. Not persisted across page reloads.
- **SuggestionChip**: A pre-filled question label shown in the welcome state. Submitting it
  creates a ChatMessage as if the visitor had typed it.
- **ModeState**: The active mode of the portfolio interface — either "terminal" or "chat".
  Controls which view is rendered in the main area.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitors can switch between Terminal and Chat modes without losing history in
  either mode, verified across at least 5 consecutive switches.
- **SC-002**: The chat assistant returns a response to any portfolio-related question
  within 5 seconds under normal network conditions.
- **SC-003**: 100% of factual claims in assistant responses are traceable to data in
  `resume.ts`; no invented roles, companies, technologies, or dates.
- **SC-004**: All 4 rich component types (ProjectCard, CareerTimeline, SkillTags, ContactCard)
  render correctly with live data when their respective topics are queried.
- **SC-005**: The Chat interface passes WCAG 2.1 AA automated checks (zero critical
  violations) and is fully operable by keyboard on both desktop and mobile.
- **SC-006**: When the visitor writes in Portuguese, the assistant responds in Portuguese
  for 100% of subsequent messages in that session.
- **SC-007**: The assistant declines 100% of questions on controversial/off-topic subjects
  without expressing any opinion, and redirects to professional topics.

## Assumptions

- The portfolio is a Next.js application (App Router) deployed to a hosting environment
  that supports server-side API routes for AI inference.
- An AI inference service is available and accessible from the server environment; API
  credentials are managed via environment variables, not committed to source control.
- Conversation history is session-only and is NOT persisted to any database or storage;
  refreshing the page starts a new session.
- The availability status shown in the ContactCard defaults to "Open to opportunities"
  unless a dedicated field is added to `resume.ts`; this is a reasonable placeholder.
- The portfolio has a single authenticated owner (Fernando); there is no visitor login,
  rate-limiting UI, or per-user quota management in scope for this feature.
- The phone number in `resume.ts` is intentionally hidden (env variable) and MUST NOT
  be surfaced in the ContactCard or any AI response.
- The suggestion chips are a fixed, curated set defined at build time; they are not
  dynamically generated per visitor.
- Chat mode does not require analytics or event tracking beyond what is already in place.
