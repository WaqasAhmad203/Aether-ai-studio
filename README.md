# ⚡ Aether AI Studio — Dual-Mode Generative AI Assistant & Code Workspace

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License: MIT" />
</p>

<p align="center">
  <strong>Aether AI Studio</strong> is a next-generation, high-performance AI platform combining the versatility of a <strong>General Conversational Assistant (ChatGPT / Gemini style)</strong> with a <strong>Pro-Grade 3-Column Developer Workspace (Cursor / Linear style)</strong> powered by Google's latest Gemini models.
</p>

---

## 🌟 Key Features

### 1. 💬 Dual-Mode Experience
- **General AI Assistant Mode (Default):** Spacious, distraction-free conversational canvas for creative writing, professional email drafting, brainstorming, science/math explanations (ELI5), and travel planning.
- **Developer Studio Mode:** High-density 3-column split-pane workspace with docked multi-tab code editor, execution terminal, and test runner.

### 2. 🧠 Chain-of-Thought (CoT) Reasoning Accordion
- Collapsible breakdown card displaying the AI's internal thinking stages (*Semantic Analysis*, *Logic Synthesis*, *Test Verification*).
- Real-time latency tracking (`12ms`) and token computation counters (`450 tokens`).

### 3. 💻 Interactive Code Workspace & Terminal Runner
- **Multi-Tab File Editor:** Edit multiple files (`auth.js`, `auth.test.js`, `schema.sql`) simultaneously with syntax highlighting and line numbers.
- **"Open in Workspace" Action:** 1-click button on any chat code block to instantly load generated code into the right-hand editor.
- **Simulated Execution & Test Runner:** Run code directly with real-time terminal output logs and unit test status assertions (`2 passed, 0 failed`).

### 4. 🎙️ Multimodal Input & Voice Recognition
- **Voice-to-Text Dictation:** Hands-free voice prompts integrated via the browser's native Web Speech API.
- **Context File Attachments:** Attach code or text files directly into the prompt payload with file size badges.
- **Model Selector Pill:** Rapidly switch between `Gemini 2.5 Flash`, `Gemini 1.5 Pro`, and `Gemini 1.5 Flash-8B`.

### 5. ⌨️ Global Command Palette (`Ctrl+K` / `⌘K`)
- Raycast/Linear-style command menu for quick model switches, preset execution, and chat session management with full keyboard navigation (↑/↓/Enter/ESC).

### 6. 📚 Curated Prompt Presets Library
- Categorized 1-click prompts across 4 domains:
  - ✍️ **Writing & Creative:** Professional email drafter, idea brainstorming, text summarizer.
  - 🧠 **Knowledge & Learning:** "Explain Like I'm 5" (ELI5), step-by-step problem solver, travel planner.
  - 💻 **Coding & Architecture:** React 19 component generator, code refactoring, Vitest/Jest test writer.
  - 🗄️ **Database & Security:** SQL query optimizer, OWASP security audit.

### 7. 💾 Zero-Config Session Persistence
- Automatic local storage synchronization saves all conversations and code files across browser reloads without requiring user accounts or external databases.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router + Turbopack)](https://nextjs.org/) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS custom properties |
| **AI Intelligence** | [@google/genai SDK](https://www.npmjs.com/package/@google/genai) (Gemini 2.5 Flash & 1.5 Pro) |
| **Typography** | [Geist Sans & Geist Mono](https://vercel.com/font) via `next/font/google` |
| **Voice & Speech** | Native Web Speech API |
| **Icons** | Custom high-tech SVG icon suite |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)
- A free **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/WaqasAhmad203/Aether-ai-studio.git
cd aether-ai-studio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

Add your Google Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

> 🔒 **Security Notice:** Your `.env.local` file is automatically ignored by `.gitignore` and will never be pushed to GitHub.

### 4. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start chatting and coding!

---

## 📁 Project Architecture

```
ai-chat-app/
├── public/                 # Static assets & favicon
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.js    # Secure serverless Gemini API handler
│   │   ├── globals.css         # Dark slate theme, glowing effects & scrollbars
│   │   ├── layout.js           # Root layout & Google Geist font setup
│   │   └── page.js             # Main state orchestrator (3-pane layout & persistence)
│   ├── components/
│   │   ├── ChatInputBar.js     # Multimodal input, voice recognition & token meter
│   │   ├── ChatStream.js       # Conversation stream, markdown & code renderer
│   │   ├── CodeWorkspace.js    # Multi-tab code editor, terminal & test runner
│   │   ├── CommandPalette.js   # Global Ctrl+K command menu
│   │   ├── Icons.js            # Custom SVG developer icons library
│   │   ├── LeftSidebar.js      # Mode switcher, prompt presets & session history
│   │   └── ThoughtAccordion.js # Collapsible AI Chain-of-Thought reasoning card
│   └── lib/
│       └── gemini.js           # Google GenAI client instance
├── .env.example            # Safe environment template
├── .gitignore              # Git ignore rules (protects API keys & node_modules)
├── package.json            # Project dependencies & build scripts
└── README.md               # Project documentation
```

---

## 🔒 Security Best Practices
- **Server-Side API Calls:** All interactions with the Gemini API occur inside Next.js API route handlers on the server. The `GEMINI_API_KEY` is **never exposed** to client browsers.
- **Graceful Fallbacks:** If an API key is not configured or rate limits are reached, the app provides simulated intelligence without crashing.

---

## 🚢 Deployment on Vercel

The easiest way to deploy this Next.js app is with [Vercel](https://vercel.com/):

1. Push your code to GitHub.
2. Import the repository into [Vercel](https://vercel.com/new).
3. Under **Environment Variables**, add:
   - `GEMINI_API_KEY` = `your_gemini_api_key`
4. Click **Deploy**.

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use it for personal or commercial projects.
