import React, { useRef, useState, useEffect } from 'react'
import { ArrowUp, Square } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { MAX_MESSAGE_LENGTH } from '@/constants'

interface InputAreaProps {
  sendMessage: (question: string) => Promise<void>
  isLoading: boolean
  onAbort?: () => void
}

export const InputArea = React.forwardRef<HTMLDivElement, InputAreaProps>(
  ({ sendMessage, isLoading, onAbort }, ref) => {
    const [inputValue, setInputValue] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const adjustTextareaHeight = () => {
      const textarea = textareaRef.current
      if (textarea) {
        textarea.style.height = 'auto'
        const newHeight = Math.min(textarea.scrollHeight, 180)
        textarea.style.height = `${newHeight}px`
      }
    }

    useEffect(() => {
      adjustTextareaHeight()
    }, [inputValue])

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    }

    const handleSend = () => {
      const trimmed = inputValue.trim()
      if (trimmed && !isLoading) {
        sendMessage(trimmed)
        setInputValue('')
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
        }
      }
    }

    return (
      <div ref={ref} className="w-full border-t border-border/60 bg-background/80 backdrop-blur-md p-3 sm:p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex flex-col rounded-2xl border border-border/80 bg-card/70 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all duration-200">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              aria-label="Message Mohaneesh's AI"
              rows={1}
              placeholder="Ask anything about Mohaneesh's projects, experience, or skills..."
              maxLength={MAX_MESSAGE_LENGTH}
              className={cn(
                'w-full max-h-[180px] py-3 pl-4 pr-14 bg-transparent resize-none text-sm sm:text-base text-foreground placeholder:text-muted-foreground/70',
                'focus:outline-none leading-relaxed'
              )}
            />

            <div className="flex items-center justify-between px-3 pb-2 pt-1 text-xs text-muted-foreground/60 border-t border-border/30">
              <span className="hidden sm:inline">
                Press <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-[10px]">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-[10px]">Shift + Enter</kbd> for new line
              </span>
              <span className="sm:hidden text-[10px]">Mohaneesh AI</span>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono">
                  {inputValue.length}/{MAX_MESSAGE_LENGTH}
                </span>

                {isLoading ? (
                  <button
                    type="button"
                    onClick={onAbort}
                    title="Stop generation"
                    aria-label="Stop generation"
                    className="flex items-center justify-center h-8 w-8 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all active:scale-95 shadow-sm"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    title="Send message"
                    aria-label="Send message"
                    className={cn(
                      'flex items-center justify-center h-8 w-8 rounded-xl transition-all duration-150',
                      inputValue.trim()
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/30 active:scale-95'
                        : 'bg-muted text-muted-foreground/50 cursor-not-allowed'
                    )}
                  >
                    <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

InputArea.displayName = 'InputArea'