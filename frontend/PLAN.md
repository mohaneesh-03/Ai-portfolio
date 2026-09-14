# Frontend Implementation Plan: AI-Powered Portfolio Chat Interface

## Context
Build a modern, ChatGPT/Claude-like chat interface for the AI-powered portfolio. The backend (FastAPI + Groq) is already configured with a `/chat` endpoint that accepts questions about Mohaneesh's background and streams responses. The frontend will be a React + Vite application in the existing `frontend/` folder, using Tailwind CSS for styling, with Vite proxy for development.

## Tech Stack
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React hooks (useState, useReducer, useRef)
- **HTTP Client**: Native fetch with AbortController for streaming
- **Markdown**: `react-markdown` + `rehype-highlight` for syntax highlighting
- **Icons**: `lucide-react`
- **Dev Proxy**: Vite server proxy (`/api` → `http://localhost:8000`)

## Project Structure
```
frontend/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── vite.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useChat.ts
│   │   ├── useTheme.ts
│   │   └── useLocalStorage.ts
│   ├── components/
│   │   ├── Chat/
│   │   │   ├── ChatContainer.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── Message.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── StreamingMessage.tsx
│   │   │   ├── InputArea.tsx
│   │   │   ├── TypingIndicator.tsx
│   │   │   └── ErrorBanner.tsx
│   │   ├── UI/
│   │   │   ├── Button.tsx
│   │   │   ├── IconButton.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── ScrollArea.tsx
│   │   └── Layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── utils/
│   │   ├── api.ts
│   │   ├── markdown.ts
│   │   └── helpers.ts
│   └── constants/
│       └── index.ts
```

## Implementation Steps

### 1. Project Setup & Configuration
- Initialize `package.json` with React, TypeScript, Vite, Tailwind CSS v4, and dependencies
- Configure `vite.config.ts` with:
  - React plugin
  - Path aliases (`@/` → `src/`)
  - Dev server proxy: `/api` → `http://localhost:8000`
- Configure Tailwind CSS v4 with custom theme (colors, dark mode via class strategy)
- Set up TypeScript config with strict mode

### 2. Type Definitions (`src/types/index.ts`)
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  error?: boolean;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  abortController: AbortController | null;
}

interface ApiResponse {
  answer: string;
}
```

### 3. Custom Hooks

#### `useChat.ts` - Core chat logic
- Manages message state, streaming, error handling, retry logic
- Handles SSE streaming from `/api/chat` endpoint
- Implements retry with exponential backoff (max 3 retries)
- Exposes: `messages`, `sendMessage`, `retryLastMessage`, `clearChat`, `isLoading`, `error`

#### `useTheme.ts` - Dark/Light theme
- Reads/writes to localStorage
- Applies `dark` class to `<html>` element
- Syncs with system preference on first load

#### `useLocalStorage.ts` - Generic localStorage hook
- Type-safe getter/setter with JSON serialization

### 4. API Layer (`src/utils/api.ts`)
- `streamChat(question: string, signal: AbortSignal): AsyncIterable<string>`
- Handles fetch with streaming response parsing
- Error handling for network errors, HTTP errors, timeout

### 5. Markdown Utilities (`src/utils/markdown.ts`)
- Configure `react-markdown` with:
  - GFM (GitHub Flavored Markdown)
  - Syntax highlighting via `rehype-highlight`
  - Custom components for code blocks (with copy button)
  - Link handling (target="_blank", rel="noopener")

### 6. UI Components (`src/components/UI/`)
- **Button.tsx** - Variants: primary, secondary, ghost; sizes: sm, md, lg; loading state
- **IconButton.tsx** - Icon-only button with tooltip/aria-label
- **ThemeToggle.tsx** - Sun/moon icon, keyboard accessible
- **ScrollArea.tsx** - Auto-scroll to bottom on new messages, manual scroll detection

### 7. Layout Components (`src/components/Layout/`)
- **Header.tsx** - App title, theme toggle, new chat button
- **Footer.tsx** - Disclaimer, version info

### 8. Chat Components (`src/components/Chat/`)

#### `ChatContainer.tsx` - Main orchestrator
- Composes all chat components
- Handles keyboard shortcuts (Enter to send, Shift+Enter for newline)
- Manages focus management for accessibility

#### `MessageList.tsx` - Virtualized message list
- Renders messages with auto-scroll
- Shows typing indicator when loading
- Empty state with welcome message

#### `Message.tsx` - Message wrapper
- Renders user/assistant messages differently
- Handles error state with retry button
- Shows timestamp on hover

#### `MessageBubble.tsx` - Content renderer
- User: simple text bubble
- Assistant: markdown rendering with syntax highlighting

#### `StreamingMessage.tsx` - Streaming assistant message
- Renders partial content as it arrives
- Shows cursor animation while streaming
- Seamlessly transitions to complete message

#### `InputArea.tsx` - Message input
- Auto-resizing textarea
- Send button (disabled when empty/loading)
- Character count, keyboard shortcuts
- Paste handling

#### `TypingIndicator.tsx` - Animated dots
- Three bouncing dots animation
- Accessible with aria-live region

#### `ErrorBanner.tsx` - Error display
- Shows error message with dismiss/retry actions
- Auto-dismiss after 10 seconds

### 9. Main App (`src/App.tsx`)
- Provides theme context
- Renders layout + chat container
- Handles global error boundary

### 10. Entry Point (`src/main.tsx`)
- React 18 createRoot
- Global styles import
- Error boundary setup

### 11. Global Styles (`src/index.css`)
- Tailwind v4 imports
- Custom scrollbar styles
- Selection colors
- Focus visible styles
- Animation keyframes (typing indicator, fade-in, slide-up)
- Print styles

## Streaming Implementation Details

The backend returns a streaming response. The frontend will:
1. Create `AbortController` for each request
2. Use `fetch` with `response.body.getReader()` for stream reading
3. Parse chunks as they arrive (text decoder)
4. Update message state incrementally for streaming effect
5. Handle completion/error in finally block

```typescript
// Simplified streaming logic
const reader = response.body!.getReader();
const decoder = new TextDecoder();
let buffer = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  buffer += decoder.decode(value, { stream: true });
  // Parse SSE or plain text chunks
  // Update message content via setMessages
}
```

## Retry Logic
- Max 3 retries with exponential backoff (1s, 2s, 4s)
- Only retry on network errors or 5xx responses
- Show retry button on message error state
- Preserve message history on retry

## Accessibility (WCAG AA)
- Semantic HTML (main, section, article, button)
- ARIA labels on icon buttons
- Live regions for streaming content and typing indicator
- Focus management (trap in modal, restore on close)
- Keyboard navigation (Tab, Enter, Escape)
- Color contrast in both themes
- Reduced motion support

## Responsive Design
- Mobile-first breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Chat container: full width on mobile, max-w-3xl centered on desktop
- Input area: fixed bottom on mobile, flex on desktop
- Header: compact on mobile, full on desktop
- Touch targets: min 44x44px

## Development Workflow
1. `cd frontend && npm install`
2. `npm run dev` - starts Vite dev server (port 5173)
3. Backend runs on port 8000
4. Vite proxy forwards `/api/*` to backend

## Production Build
- `npm run build` → outputs to `dist/`
- Can be served by FastAPI static files or deployed separately
- Environment variable `VITE_API_URL` for production API endpoint

## Verification Checklist
- [ ] Dev server starts without errors
- [ ] Vite proxy works (request to `/api/chat` reaches backend)
- [ ] Streaming responses display token-by-token
- [ ] Markdown renders correctly (code blocks, lists, links)
- [ ] Syntax highlighting works in code blocks
- [ ] Copy button copies code block content
- [ ] Theme toggle persists in localStorage
- [ ] Theme respects system preference on first visit
- [ ] Typing indicator shows during streaming
- [ ] Error banner appears on network failure
- [ ] Retry button re-sends last message
- [ ] New chat clears history
- [ ] Auto-scroll works on new messages
- [ ] Manual scroll disables auto-scroll until scrolled to bottom
- [ ] Responsive layout works on mobile/desktop
- [ ] Keyboard navigation works (Tab, Enter, Shift+Enter, Escape)
- [ ] Screen reader announcements for new messages
- [ ] Build produces optimized production bundle

## Dependencies to Install
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-markdown": "^9.0.1",
    "rehype-highlight": "^7.0.0",
    "lucide-react": "^0.441.0",
    "remark-gfm": "^4.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.4",
    "vite": "^5.4.2",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "postcss": "^8.4.41",
    "autoprefixer": "^10.4.20"
  }
}
```

## Critical Files to Create/Modify
1. `frontend/package.json` - Project config & dependencies
2. `frontend/vite.config.ts` - Vite config with proxy
3. `frontend/tailwind.config.js` - Tailwind theme config
4. `frontend/tsconfig.json` - TypeScript config
5. `frontend/index.html` - Entry HTML
6. `src/main.tsx` - App entry
7. `src/App.tsx` - Root component
8. `src/index.css` - Global styles + Tailwind
9. `src/types/index.ts` - Type definitions
10. `src/hooks/useChat.ts` - Chat logic (most complex)
11. `src/hooks/useTheme.ts` - Theme management
12. `src/utils/api.ts` - API streaming
13. `src/components/Chat/ChatContainer.tsx` - Main chat component
14. `src/components/Chat/MessageList.tsx` - Message list
15. `src/components/Chat/Message.tsx` - Individual message
16. `src/components/Chat/StreamingMessage.tsx` - Streaming render
17. `src/components/Chat/InputArea.tsx` - Input component
18. `src/components/Chat/TypingIndicator.tsx` - Loading animation
19. `src/components/Chat/ErrorBanner.tsx` - Error display
20. `src/components/UI/ThemeToggle.tsx` - Theme switcher
21. `src/components/Layout/Header.tsx` - Header with controls