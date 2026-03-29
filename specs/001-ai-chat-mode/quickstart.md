# Quickstart: AI Chat Mode

**Feature**: 001-ai-chat-mode
**Date**: 2026-03-28

This guide walks through setting up the development environment for the AI Chat Mode
feature from a clean clone of the repo on branch `001-ai-chat-mode`.

---

## Prerequisites

- Node.js 20+
- A Google AI Studio account with access to Gemini 2.0 Flash
- Git

---

## Step 1: Switch to the feature branch

```bash
git checkout 001-ai-chat-mode
```

---

## Step 2: Update dependencies

Remove the old Google AI package and install the Vercel AI SDK:

```bash
npm uninstall @google/genai
npm install ai @ai-sdk/google zod
```

Expected result: `package.json` no longer contains `@google/genai`; it now contains
`ai`, `@ai-sdk/google`, and `zod` as production dependencies.

---

## Step 3: Configure the environment variable

Create a `.env.local` file in the project root (it is already git-ignored):

```bash
# .env.local
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

Obtain the key from [Google AI Studio](https://aistudio.google.com/apikey).

**Important**: This variable name is read automatically by `@ai-sdk/google`.
Do not rename it or commit this file.

For AWS Amplify deployment, add the same variable in the Amplify Console:
`App settings → Environment variables → Add variable`.

---

## Step 4: Start the development server

```bash
npm run dev
```

Navigate to `http://localhost:3000`. The portfolio loads in Terminal mode by default.

---

## Step 5: Verify the mode toggle

1. Click the **Chat** button in the terminal header.
2. The chat interface should appear with a welcome message and suggestion chips.
3. Click the **Terminal** button — the terminal view should reappear with history intact.

---

## Step 6: Test Chat mode

1. Switch to Chat mode.
2. Click the **"Show me your projects"** chip.
3. Expected: a user message appears, then an assistant response with a **ProjectCard**
   component showing the Wallet Rebalancing project.
4. Type: `What's your experience with React?`
5. Expected: a text response referencing Fernando's actual career history.
6. Type a politically controversial question.
7. Expected: the assistant politely declines and redirects to professional topics.

---

## Step 7: Test language detection

1. Switch to Chat mode.
2. Type: `Olá! Qual é a sua experiência com React?`
3. Expected: the assistant responds in Portuguese.

---

## Step 8: Verify mobile layout

Open browser DevTools, set viewport to 375×812 (iPhone SE).

- Both Terminal and Chat modes MUST render without horizontal overflow.
- Chat input MUST be reachable without zooming.
- Suggestion chips MUST wrap correctly.

---

## Build and deploy check

```bash
npm run build
```

There MUST be zero TypeScript errors and zero ESLint warnings.
Check the build output for unexpected `"use client"` bundle additions.

For AWS Amplify: push to the feature branch and verify the Amplify preview build
completes successfully. Confirm `GOOGLE_GENERATIVE_AI_API_KEY` is set in the
Amplify environment before the build runs.
