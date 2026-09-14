import React from 'react'
import { useTheme } from '@/hooks/useTheme'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/utils/helpers'

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={cn(
        'relative inline-flex items-center justify-center h-9 w-9 rounded-lg border border-border/70 bg-card/60 backdrop-blur-sm text-foreground transition-all duration-200',
        'hover:bg-muted hover:border-border hover:scale-105 active:scale-95',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1'
      )}
    >
      <Sun className={cn('h-4 w-4 transition-transform duration-300', isDark ? 'hidden' : 'rotate-0 scale-100 text-amber-500')} />
      <Moon className={cn('h-4 w-4 transition-transform duration-300', isDark ? 'rotate-0 scale-100 text-sky-400' : 'hidden')} />
    </button>
  )
}

ThemeToggle.displayName = 'ThemeToggle'