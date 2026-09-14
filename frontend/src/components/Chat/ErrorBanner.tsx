import React from 'react'
import { AlertCircle, RotateCw, X } from 'lucide-react'
import { Button } from '@/components/UI/Button'

interface ErrorBannerProps {
  error: string | null
  retryLastMessage: () => Promise<void>
  isLoading: boolean
  onDismiss?: () => void
}

export const ErrorBanner = React.forwardRef<HTMLDivElement, ErrorBannerProps>(
  ({ error, retryLastMessage, isLoading, onDismiss }, ref) => {
    if (!error) return null

    return (
      <div
        ref={ref}
        role="alert"
        className="my-3 mx-4 p-3 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive flex items-center justify-between gap-3 shadow-sm transition-all"
      >
        <div className="flex items-center gap-2.5 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 text-destructive" />
          <span className="font-medium">{error}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            size="sm"
            variant="danger"
            onClick={retryLastMessage}
            disabled={isLoading}
            className="h-7 px-2.5 text-xs gap-1"
          >
            <RotateCw className="w-3 h-3" />
            <span>Retry</span>
          </Button>
          {onDismiss && (
            <button
              onClick={onDismiss}
              aria-label="Dismiss error"
              className="p-1 rounded-md hover:bg-destructive/20 text-destructive/80 hover:text-destructive transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    )
  }
)

ErrorBanner.displayName = 'ErrorBanner'