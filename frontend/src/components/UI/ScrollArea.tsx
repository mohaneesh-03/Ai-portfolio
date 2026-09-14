import React from 'react'
import { cn } from '@/utils/helpers'

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, onScroll, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        onScroll={onScroll}
        className={cn(
          'relative w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth',
          className
        )}
        {...rest}
      >
        {children}
      </div>
    )
  }
)

ScrollArea.displayName = 'ScrollArea'