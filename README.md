# Mohaneesh Raj Pradhan — AI-Powered Portfolio

An interactive, AI-powered portfolio chat application grounded strictly on Mohaneesh Raj Pradhan's professional background, resume, skills, and projects.

Built with **FastAPI**, **Groq (OpenAI OSS 120B)**, **React 18**, **TypeScript**, **Tailwind CSS v4**, and **Vite**.

---

## 🏗️ Project Architecture

The project is organized as a clean full-stack monorepo:

```text
ai_powered_portfolio/
├── .claude/               # IDE configuration
├── .git/                  # Git version control
├── .gitignore             # Unified monorepo ignore rules
├── .venv/                 # Python virtual environment
├── README.md              # Project documentation & setup
│
├── backend/               # FastAPI Backend Service
│   ├── .python-version    # Python 3.11 version specifier
│   ├── pyproject.toml     # Backend dependencies & metadata
│   ├── uv.lock            # Python package lockfile
│   ├── Resume.md          # Grounded resume & portfolio documentation
│   ├── main.py            # FastAPI server & streaming SSE endpoints
│   ├── parser.py          # Google Docs resume parsing utility
│   └── models/
│       └── model.py       # Pydantic schemas (ChatRequest, ChatMessage)
│
└── frontend/              # React 18 + Vite Frontend Application
    ├── PLAN.md            # Frontend UI architecture & specification
    ├── package.json       # Frontend scripts & dependencies
    ├── package-lock.json  # NPM lockfile
    ├── tsconfig.json      # TypeScript compiler configuration
    ├── vite.config.ts     # Vite configuration with /api backend proxy
    ├── index.html         # Application HTML entry point
    └── src/
        ├── App.tsx        # Root application & error boundary
        ├── main.tsx       # React 18 client entry
        ├── index.css      # Tailwind v4 styles, themes & animations
        ├── components/    # Modular UI & Chat components
        │   ├── Chat/      # ChatContainer, MessageList, InputArea, CodeBlock, etc.
        │   ├── Layout/    # Header, Footer
        │   └── UI/        # Button, IconButton, ThemeToggle, ScrollArea
        ├── hooks/         # Custom hooks (useChat, useTheme, useLocalStorage)
        ├── types/         # TypeScript definitions
        └── utils/         # API client, Markdown components, helpers
```

---

## 🚀 Quickstart

### Prerequisites
- **Python 3.11+**
- **Node.js 18+** & **npm**
- **Groq API Key** (set in your environment as `GROQ_API_KEY`)

---

### 1. Start the Backend (FastAPI)

```bash
# From workspace root:
.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

The API will be available at `http://127.0.0.1:8000`:
- **Health check**: `GET /health`
- **Streaming chat endpoint**: `POST /api/chat` (accepts `{"question": "...", "stream": true}`)
- **Interactive OpenAPI docs**: `http://127.0.0.1:8000/docs`

---

### 2. Start the Frontend (React + Vite)

```bash
# Navigate to frontend folder and run dev server:
cd frontend
npm run dev
```

The frontend will run at `http://localhost:5173`. Requests to `/api/*` are automatically proxied to the FastAPI backend.

---

## ✨ Features

- **Grounded AI Answers**: The assistant only answers questions based on Mohaneesh's verified resume and declines extrapolation or sensitive topics.
- **Token-by-Token Streaming**: Responses stream in real-time with an animated typing indicator and streaming cursor.
- **Rich Markdown & Code Blocks**: Clean rendering of lists, bold text, links, and code blocks with syntax highlighting and a 1-click **Copy Code** button.
- **Quick Prompt Starters**: Interactive chips to instantly ask about core skills, experience, projects, or contact information.
- **Dark & Light Mode**: Built-in theme switcher with system preference detection and localStorage persistence.
- **Full Keyboard Navigation**: `Enter` to send, `Shift + Enter` for multi-line inputs, character counter, and stop generation controls.
