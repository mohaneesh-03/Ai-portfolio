import { API_ENDPOINT } from '@/constants'
import type { ChatRequest } from '@/types'

export async function* streamChat(
  question: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  signal?: AbortSignal,
): AsyncIterable<string> {
  const requestBody: ChatRequest = {
    question,
    history,
    stream: true,
  }

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
    signal,
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    let detail = errorText
    try {
      const parsed = JSON.parse(errorText)
      if (parsed.detail) detail = parsed.detail
    } catch {
      // not JSON
    }
    throw new Error(detail || `Request failed with status ${response.status}`)
  }

  if (!response.body) {
    throw new Error('Response body is not readable')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      if (chunk) {
        yield chunk
      }
    }

    const remaining = decoder.decode()
    if (remaining) {
      yield remaining
    }
  } finally {
    reader.releaseLock()
  }
}

export async function getChatResponse(
  question: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  signal?: AbortSignal,
): Promise<string> {
  const requestBody: ChatRequest = {
    question,
    history,
    stream: false,
  }

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
    signal,
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    let detail = errorText
    try {
      const parsed = JSON.parse(errorText)
      if (parsed.detail) detail = parsed.detail
    } catch {
      // not JSON
    }
    throw new Error(detail || `Request failed with status ${response.status}`)
  }

  const data = (await response.json()) as { answer?: string }
  return data.answer ?? ''
}
