import React from 'react'
import { MessageBubble } from '@/components/Chat/MessageBubble'
import { formatTimestamp, cn } from '@/utils/helpers'
import { User, Sparkles, AlertCircle } from 'lucide-react'
import type { Message as MessageType } from '@/types'

export interface MessageProps {
  message: MessageType
  isUser: boolean
  onRetry?: () => void
}

export const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isUser, onRetry }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'group flex gap-3 sm:gap-4 my-4 max-w-full transition-opacity duration-200 animate-fade-in',
          isUser ? 'flex-row-reverse justify-start' : 'flex-row justify-start'
        )}
      >
        {/* Avatar */}
        <div className="shrink-0 pt-0.5">
          {isUser ? (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-blue-600 text-primary-foreground flex items-center justify-center text-xs font-semibold shadow-sm">
              <User className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shadow-sm shadow-primary/20">
              <Sparkles className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Content Column */}
        <div className={cn('flex flex-col max-w-[85%] sm:max-w-[80%]', isUser ? 'items-end' : 'items-start')}>
          <div className="flex items-center gap-2 mb-1 px-1 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/80">
              {isUser ? 'You' : 'Mohaneesh AI'}
            </span>
            <span>•</span>
            <span>{formatTimestamp(message.timestamp)}</span>
          </div>

          <MessageBubble
            message={message}
            isUser={isUser}
            isStreaming={message.isStreaming}
          />

          {message.error && onRetry && (
            <button
              onClick={onRetry}
              className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive hover:underline font-medium"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Failed to send. Click to retry</span>
            </button>
          )}
        </div>
      </div>
    )
  }
)

Message.displayName = 'Message'