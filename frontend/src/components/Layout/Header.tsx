import React from 'react'
import { ThemeToggle } from '@/components/UI/ThemeToggle'
import { Sparkles, Plus, ExternalLink } from 'lucide-react'

interface HeaderProps {
  onNewChat?: () => void
}

export const Header: React.FC<HeaderProps> = ({ onNewChat }) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/60 bg-background/80 backdrop-blur-md transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-violet-500 text-primary-foreground shadow-md shadow-primary/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-background"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold tracking-tight text-foreground">
                Mohaneesh Raj Pradhan
              </h1>
              <span className="hidden sm:inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary border border-primary/20">
                AI Portfolio
              </span>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span>Full-Stack & AI Engineer</span>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-emerald-500 font-medium">Ready to chat</span>
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {onNewChat && (
            <button
              onClick={onNewChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-border/70 bg-card/60 hover:bg-muted text-foreground transition-all duration-150 active:scale-95 shadow-sm"
              title="Start a new conversation"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

Header.displayName = 'Header'