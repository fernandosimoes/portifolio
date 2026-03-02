# FERNANDO_SIMOES.exe

![Portfolio Preview](./public/preview.png) *(Note: Add a preview image in public/preview.png)*

A unified, terminal-inspired professional portfolio built with Next.js and Tailwind CSS. The interface is specifically designed to provide a rich CLI experience for developers (`tech` users) while maintaining clear UI elements like accessible top navigation and inline-expanding accordions for `non-tech` users.

## 🚀 Features

- **Unified CLI + GUI Layout**: A complete terminal emulator that also responds to traditional button navigation.
- **Interactive Commands**: The terminal processes inputs correctly, supporting commands like `/projects`, `/jobs`, `/about`, `/skills`, `/help`, and `/clear`.
- **Inline Expansion Content**: Uses robust, stateful accordions to seamlessly unroll detailed career histories and active codebases without modal dialogs or page reloads.
- **Strict Brutalist / Terminal Aesthetic**: Tailored `stone-950` colors, monospace typography, and a custom stealth scrollbar.
- **DRY Architecture**: Highly reusable and easily testable React components following modern frontend design guidelines.
- **Accessibility & UX**: Combines terminal flow with UX psychology principles (e.g., Fitts's Law on clickable areas, Hickory logic on commands).

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Language:** TypeScript
- **State Management:** React Hooks (`useState`, `useEffect`)

## 💻 Getting Started

To run the portfolio locally, clone the repository and execute the following:

1. **Install Dependencies**
   ```bash
   npm install
   # or yarn / pnpm / bun install
   ```

2. **Run the Development Server**
   ```bash
   npm run dev
   ```

3. **Open the browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the result.

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router (page.tsx, layout.tsx, etc.)
│   └── globals.css       # Core styling & custom scrollbars
├── components/
│   └── portfolio/
│       ├── commands/     # Individually decoupled terminal commands
│       ├── terminal/     # Terminal components (Header, input logic)
│       └── ui/           # Shared UI bits like AccordionItem
└── data/
    └── resume.ts         # Centralized portfolio data
```

## 📝 Commands Available

- `/about` / `whoami` : Who I am, location, open-to-work status, network links.
- `/projects` : Shipped applications and side projects with architecture details.
- `/jobs` : Professional career history and notable achievements.
- `/skills` : Development stack and system modules syntax.
- `/clear` : Empties the terminal history buffer.

## 📫 Deployment

This project aims to be deployed on **AWS Route 53 / AWS Amplify**, decoupling from traditional Vercel deployments, maintaining direct control over DNS and infrastructure.

## 🛡 License

MIT. Fernando Simões da Silva.
