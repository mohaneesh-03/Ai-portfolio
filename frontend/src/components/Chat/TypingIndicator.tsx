import React from 'react'
import { Sparkles } from 'lucide-react'

interface TypingIndicatorProps {
  isVisible: boolean
}

export const TypingIndicator = React.forwardRef<HTMLDivElement, TypingIndicatorProps>(
  ({ isVisible }, ref) => {
    if (!isVisible) return null

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className="flex items-center gap-3 px-4 py-2 my-2 w-fit max-w-[85%] rounded-2xl bg-card border border-border/60 shadow-sm animate-fade-in text-muted-foreground"
      >
        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10 text-primary">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-center gap-1.5 py-1">
          <span className="typing-dot bg-primary/80" />
          <span className="typing-dot bg-primary/80" />
          <span className="typing-dot bg-primary/80" />
        </div>
        <span className="text-xs font-medium tracking-wide">Mohaneesh's AI is thinking...</span>
      </div>
    )
  }
)

TypingIndicator.displayName = 'TypingIndicator'