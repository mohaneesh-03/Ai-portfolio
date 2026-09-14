import React, { useRef, useEffect, useState } from 'react'
import { Message } from '@/components/Chat/Message'
import { ScrollArea } from '@/components/UI/ScrollArea'
import { Sparkles, ArrowDown, Code2, Briefcase, FolderGit2, Mail } from 'lucide-react'
import type { Message as MessageType } from '@/types'

interface MessageListProps {
  messages: MessageType[]
  onRetry?: () => void
  onSelectPrompt?: (prompt: string) => void
}

const PROMPT_SUGGESTIONS = [
  {
    icon: Code2,
    title: 'Core Skills',
    prompt: 'What are Mohaneesh\'s primary technical skills and tools?',
  },
  {
    icon: Briefcase,
    title: 'Experience',
    prompt: 'Can you summarize Mohaneesh\'s professional work experience?',
  },
  {
    icon: FolderGit2,
    title: 'Projects',
    prompt: 'What are the most notable projects Mohaneesh has built?',
  },
  {
    icon: Mail,
    title: 'Contact',
    prompt: 'What is Mohaneesh\'s contact and profile information?',
  },
]

export const MessageList = React.forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, onRetry, onSelectPrompt }, ref) => {
    const scrollContainerRef = useRef<HTMLDivElement | null>(null)
    const bottomRef = useRef<HTMLDivElement | null>(null)
    const [isAtBottom, setIsAtBottom] = useState(true)

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
      const threshold = 60
      const atBottom = scrollHeight - scrollTop - clientHeight < threshold
      setIsAtBottom(atBottom)
    }

    const scrollToBottom = (smooth = true) => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({
          behavior: smooth ? 'smooth' : 'auto',
          block: 'end',
        })
      }
    }

    useEffect(() => {
      if (isAtBottom) {
        scrollToBottom(false)
      }
    }, [messages, isAtBottom])

    return (
      <div ref={ref} className="relative flex-1 w-full overflow-hidden">
        <ScrollArea
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="h-full px-4 sm:px-8 py-6"
        >
          <div className="max-w-3xl mx-auto flex flex-col min-h-full">
            {messages.length === 0 ? (
              <div className="my-auto py-8 sm:py-12 flex flex-col items-center text-center animate-fade-in">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-primary to-violet-500 text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 mb-5">
                  <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-2">
                  Welcome to Mohaneesh's AI Portfolio
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground max-w-lg mb-8 leading-relaxed">
                  I'm an AI assistant trained on Mohaneesh's verified resume, skills, and projects. Ask me anything to learn more about his qualifications.
                </p>

                {/* Prompt Starters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl text-left">
                  {PROMPT_SUGGESTIONS.map((item, idx) => {
                    const IconComponent = item.icon
                    return (
                      <button
                        key={idx}
                        onClick={() => onSelectPrompt?.(item.prompt)}
                        className="group p-3.5 rounded-xl border border-border/70 bg-card hover:bg-muted/70 hover:border-primary/40 transition-all duration-200 text-left flex flex-col gap-1 shadow-sm hover:shadow active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                          <IconComponent className="w-4 h-4" />
                          <span>{item.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">
                          {item.prompt}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {messages.map((message) => (
                  <Message
                    key={message.id}
                    message={message}
                    isUser={message.role === 'user'}
                    onRetry={message.error ? onRetry : undefined}
                  />
                ))}
                <div ref={bottomRef} className="h-4" />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Floating Scroll to Bottom Button */}
        {!isAtBottom && messages.length > 0 && (
          <button
            onClick={() => scrollToBottom(true)}
            aria-label="Scroll to bottom"
            className="absolute bottom-4 right-6 z-20 p-2.5 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all duration-200 active:scale-95 flex items-center justify-center animate-fade-in"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        )}
      </div>
    )
  }
)

MessageList.displayName = 'MessageList'