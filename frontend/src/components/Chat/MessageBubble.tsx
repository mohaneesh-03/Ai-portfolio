import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { cn } from '@/utils/helpers'
import { markdownComponents } from '@/utils/markdown'
import type { Message } from '@/types'

interface MessageBubbleProps {
  message: Message
  isUser: boolean
  isStreaming?: boolean
}

export const MessageBubble = React.forwardRef<HTMLDivElement, MessageBubbleProps>(
  ({ message, isUser, isStreaming }, ref) => {
    if (isUser) {
      return (
        <div
          ref={ref}
          className={cn(
            'py-2.5 px-4 rounded-2xl rounded-tr-sm text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap shadow-sm',
            'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-normal'
          )}
        >
          {message.content}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          'py-3 px-4 sm:px-5 rounded-2xl rounded-tl-sm text-sm sm:text-base leading-relaxed break-words shadow-sm border border-border/60 transition-colors',
          'bg-card text-card-foreground',
          message.error && 'border-destructive/40 bg-destructive/5'
        )}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={markdownComponents}
          >
            {message.content}
          </ReactMarkdown>
          {isStreaming && <span className="streaming-cursor" aria-hidden="true" />}
        </div>
      </div>
    )
  }
)

MessageBubble.displayName = 'MessageBubble'