# Feature Specification: AI Chat Mode with Generative UI

**Feature Branch**: `001-ai-chat-mode`
**Created**: 2026-03-28
**Status**: Implemented (updated 2026-03-30)
**Input**: User description: "Add an AI-powered chat mode to an existing terminal-themed portfolio."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — /chat Command: Launching the AI Assistant from the Terminal (Priority: P1)

A visitor using the terminal portfolio types `/chat` (or clicks the "AI Chat" header button)
and a live chat interface appears inline below the command prompt — exactly like any other
terminal command. The visitor can still scroll up to see previous terminal output and still
has the terminal input at the bottom to run other commands.

**Why this priority**: `/chat` is the entry point for all chat functionality. It is
independently shippable as a command with a static placeholder and can be fully tested
without any AI backend by verifying the command renders inline output.

**Independent Test**: Type `/chat` → inline chat interface appears with welcome message and
suggestion chips. Type `/chat` again → a second independent interface appears. Terminal history
is unaffected. Can be fully tested without an AI backend.

**Acceptance Scenarios**:

1. **Given** the visitor types `/chat` in the terminal input, **When** they press Enter,
   **Then** a chat interface appears inline in the terminal history below the `/chat` prompt.
2. **Given** the "AI Chat" button is visible in the terminal header, **When** the visitor
   clicks it, **Then** `/chat` is submitted as a terminal command with the same result.
3. **Given** the visitor types `/help`, **When** the output renders,
   **Then** `/chat` is listed among the available commands.
4. **Given** the visitor launches `/chat` and interacts, **When** they scroll down,
   **Then** the terminal input is accessible below the chat interface.
5. **Given** the visitor is on a mobile viewport, **When** `/chat` is run,
   **Then** the chat interface renders without horizontal overflow.

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

- **FR-001**: The terminal MUST recognise `/chat` as a valid command that renders a
  `ChatInterface` component inline in the terminal history, below the command prompt.
- **FR-002**: The terminal header MUST include an "AI Chat" button that submits the `/chat`
  command, consistent with all other nav buttons.
- **FR-003**: The `/chat` chat interface MUST display a welcome message with 3–4 clickable
  suggestion chips when first launched; clicking a chip MUST submit that chip's text as a user message.
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
- **ChatSession**: In-memory conversation state for a single `/chat` invocation. Each
  invocation mounts a fresh `ChatInterface` with its own independent `useChat` state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Typing `/chat` in the terminal produces an inline chat interface; the terminal
  history above it and the terminal input below it are both intact and functional.
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
