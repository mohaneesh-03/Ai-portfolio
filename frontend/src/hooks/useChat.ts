import { useState, useCallback, useRef } from 'react'
import { generateId, getErrorMessage, delay } from '@/utils/helpers'
import { streamChat } from '@/utils/api'
import { MAX_RETRIES } from '@/constants'
import type { Message } from '@/types'

export interface UseChatReturn {
  messages: Message[]
  sendMessage: (question: string) => Promise<void>
  retryLastMessage: () => Promise<void>
  clearChat: () => void
  isLoading: boolean
  error: string | null
  abortRequest: () => void
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const lastUserQuestionRef = useRef<string>('')
  const messagesRef = useRef<Message[]>([])
  messagesRef.current = messages

  const abortRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsLoading(false)
      setMessages((prev) =>
        prev.map((msg) => (msg.isStreaming ? { ...msg, isStreaming: false } : msg))
      )
    }
  }, [])

  const executeStream = useCallback(
    async (
      question: string,
      assistantMessageId: string,
      history: Array<{ role: 'user' | 'assistant'; content: string }>
    ) => {
      let retries = 0

      const attempt = async (): Promise<boolean> => {
        const controller = new AbortController()
        abortControllerRef.current = controller

        try {
          let accumulated = ''
          const stream = streamChat(question, history, controller.signal)

          for await (const chunk of stream) {
            accumulated += chunk
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: accumulated, isStreaming: true, error: false }
                  : msg
              )
            )
          }

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, isStreaming: false, error: false }
                : msg
            )
          )
          return true
        } catch (err: unknown) {
          if (controller.signal.aborted) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, isStreaming: false }
                  : msg
              )
            )
            return true
          }

          if (retries < MAX_RETRIES) {
            retries++
            const delayMs = 1000 * Math.pow(2, retries - 1)
            await delay(delayMs)
            return attempt()
          }

          const errorMessage = getErrorMessage(err)
          setError(errorMessage)
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    isStreaming: false,
                    error: true,
                    content: msg.content || 'Failed to get a response. Please check your connection or retry.',
                  }
                : msg
            )
          )
          return false
        } finally {
          if (abortControllerRef.current === controller) {
            abortControllerRef.current = null
          }
        }
      }

      const success = await attempt()
      setIsLoading(false)
      return success
    },
    []
  )

  const sendMessage = useCallback(
    async (question: string) => {
      const trimmed = question.trim()
      if (!trimmed || isLoading) return

      lastUserQuestionRef.current = trimmed
      setError(null)
      setIsLoading(true)

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      }

      const assistantMessageId = generateId()
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      }

      // Prepare conversation history from non-error messages
      const history: Array<{ role: 'user' | 'assistant'; content: string }> =
        messagesRef.current
          .filter((m) => !m.error && m.content)
          .map((m) => ({ role: m.role, content: m.content }))

      setMessages((prev) => [...prev, userMessage, assistantMessage])

      await executeStream(trimmed, assistantMessageId, history)
    },
    [isLoading, executeStream]
  )

  const retryLastMessage = useCallback(async () => {
    if (isLoading || !lastUserQuestionRef.current) return

    const question = lastUserQuestionRef.current
    setError(null)
    setIsLoading(true)

    // Find the last assistant message or create a new one
    let targetAssistantId = ''
    setMessages((prev) => {
      const next = [...prev]
      for (let i = next.length - 1; i >= 0; i--) {
        if (next[i].role === 'assistant') {
          targetAssistantId = next[i].id
          next[i] = {
            ...next[i],
            content: '',
            isStreaming: true,
            error: false,
          }
          break
        }
      }
      return next
    })

    if (!targetAssistantId) {
      targetAssistantId = generateId()
      setMessages((prev) => [
        ...prev,
        {
          id: targetAssistantId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          isStreaming: true,
        },
      ])
    }

    const history: Array<{ role: 'user' | 'assistant'; content: string }> =
      messagesRef.current
        .filter((m) => m.id !== targetAssistantId && !m.error && m.content)
        .map((m) => ({ role: m.role, content: m.content }))

    await executeStream(question, targetAssistantId, history)
  }, [isLoading, executeStream])

  const clearChat = useCallback(() => {
    abortRequest()
    setMessages([])
    setError(null)
    lastUserQuestionRef.current = ''
  }, [abortRequest])

  return {
    messages,
    sendMessage,
    retryLastMessage,
    clearChat,
    isLoading,
    error,
    abortRequest,
  }
}