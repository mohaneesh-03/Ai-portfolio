import React, { useEffect, useState } from 'react'
import { useChat } from '@/hooks/useChat'
import { Header } from '@/components/Layout/Header'
import { Footer } from '@/components/Layout/Footer'
import { MessageList } from '@/components/Chat/MessageList'
import { InputArea } from '@/components/Chat/InputArea'
import { TypingIndicator } from '@/components/Chat/TypingIndicator'
import { ErrorBanner } from '@/components/Chat/ErrorBanner'

export interface ChatContainerProps {
  className?: string
}

export const ChatContainer = React.forwardRef<HTMLDivElement, ChatContainerProps>(
  ({ className }, ref) => {
    const {
      messages,
      sendMessage,
      retryLastMessage,
      clearChat,
      isLoading,
      error,
      abortRequest,
    } = useChat()

    const [isErrorDismissed, setIsErrorDismissed] = useState(false)

    useEffect(() => {
      if (error) {
        setIsErrorDismissed(false)
      }
    }, [error])

    // Typing indicator is shown when loading and the current assistant message is still waiting for first chunk
    const lastMessage = messages[messages.length - 1]
    const isWaitingFirstChunk =
      isLoading && (!lastMessage || lastMessage.role !== 'assistant' || !lastMessage.content)

    return (
      <div
        ref={ref}
        className={`flex flex-col h-screen w-full bg-background text-foreground overflow-hidden ${className || ''}`}
      >
        <Header onNewChat={clearChat} />

        <main className="flex-1 flex flex-col min-h-0 relative">
          <ErrorBanner
            error={!isErrorDismissed ? error : null}
            retryLastMessage={retryLastMessage}
            isLoading={isLoading}
            onDismiss={() => setIsErrorDismissed(true)}
          />

          <MessageList
            messages={messages}
            onRetry={retryLastMessage}
            onSelectPrompt={(prompt) => sendMessage(prompt)}
          />

          {isWaitingFirstChunk && (
            <div className="max-w-3xl mx-auto w-full px-4 sm:px-8">
              <TypingIndicator isVisible={isWaitingFirstChunk} />
            </div>
          )}
        </main>

        <InputArea
          sendMessage={sendMessage}
          isLoading={isLoading}
          onAbort={abortRequest}
        />

        <Footer />
      </div>
    )
  }
)

ChatContainer.displayName = 'ChatContainer'