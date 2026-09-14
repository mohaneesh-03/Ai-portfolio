export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isStreaming?: boolean
  error?: boolean
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
  abortController: AbortController | null
}

export interface ApiResponse {
  answer: string
}

export interface ChatRequest {
  question: string
  history?: Array<{ role: 'user' | 'assistant'; content: string }>
  stream?: boolean
}
