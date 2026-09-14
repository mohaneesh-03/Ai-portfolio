import React from 'react'
import { cn } from '@/utils/helpers'

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string
  size?: 'sm' | 'md' | 'lg'
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ 'aria-label': ariaLabel, className, size = 'md', children, disabled, ...rest }, ref) => {
    const sizeStyles = {
      sm: 'h-8 w-8 p-1 text-xs',
      md: 'h-9 w-9 p-2 text-sm',
      lg: 'h-10 w-10 p-2.5 text-base',
    }[size]

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        title={ariaLabel}
        className={cn(
          'inline-flex items-center justify-center rounded-lg border border-border/60 bg-background/80 text-foreground transition-all duration-150',
          'hover:bg-muted hover:border-border active:scale-95',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
          'disabled:opacity-50 disabled:pointer-events-none',
          sizeStyles,
          className
        )}
        disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'