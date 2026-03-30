# Quickstart: AI Chat Mode

**Feature**: 001-ai-chat-mode
**Date**: 2026-03-28 (updated 2026-03-30)

This guide walks through setting up the development environment for the AI Chat Mode
feature from a clean clone of the repo on branch `001-ai-chat-mode`.

---

## Prerequisites

- Node.js 20+
- A Google AI Studio account with access to Gemini 2.5 Flash
- Git

---

## Step 1: Switch to the feature branch

```bash
git checkout 001-ai-chat-mode
```

---

## Step 2: Install dependencies

```bash
npm install
```

Expected result: `package.json` contains `ai`, `@ai-sdk/google`, `@ai-sdk/react`, and `zod`
as production dependencies. `@google/genai` is absent.

---

## Step 3: Configure the environment variable

Create a `.env.local` file in the project root (it is already git-ignored):

```bash
# .env.local
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

Obtain the key from [Google AI Studio](https://aistudio.google.com/apikey). The variable
name is read automatically by `@ai-sdk/google`. Do not rename it or commit this file.

This variable does NOT need the `NEXT_PUBLIC_` prefix — it is only accessed server-side
inside the `/api/chat` route handler.

For AWS Amplify deployment: add the variable in the Amplify Console under
`App settings → Environment variables`.

---

## Step 4: Start the development server

```bash
npm run dev
```

Navigate to `http://localhost:3000`. The portfolio loads in terminal mode.

---

## Step 5: Verify the /chat command

1. In the terminal input, type `/chat` and press **Enter**
   — or click the **AI Chat** button in the header.
2. A chat interface appears inline below the `/chat` command prompt.
3. A welcome message and suggestion chips are visible.
4. The terminal input is still present below the chat interface.

---

## Step 6: Test the chat

1. Click the **"Show me your projects"** chip.
2. Expected: a user message appears, then a streaming assistant response that triggers
   a **ProjectCard** component showing Fernando's projects.
3. Type: `What's your experience with React?`
4. Expected: a text response referencing Fernando's actual career history.
5. Type: `What do you think of the latest US election results?`
6. Expected: the assistant politely declines and redirects to professional topics.

---

## Step 7: Test language detection

1. Type: `Olá! Qual é a sua experiência com React?`
2. Expected: the assistant responds in Portuguese.

---

## Step 8: Test multiple chat sessions

1. Scroll up to the terminal input (below the chat interface).
2. Type `/chat` again and press **Enter**.
3. Expected: a second, independent chat interface appears below the first.
4. Each interface has its own separate conversation history.

---

## Step 9: Verify mobile layout

Open browser DevTools and set viewport to 375×812 (iPhone SE).

- The terminal and inline chat MUST render without horizontal overflow.
- The chat input MUST be reachable without zooming.
- Suggestion chips MUST wrap correctly across multiple rows.

---

## Build and deploy check

```bash
npm run build
```

There MUST be zero TypeScript errors and zero ESLint warnings.

For AWS Amplify: push to the feature branch and verify the Amplify preview build
completes successfully. Confirm `GOOGLE_GENERATIVE_AI_API_KEY` is set in the
Amplify environment before the build runs.
