import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-3 px-4 border-t border-border/40 bg-background/50 text-center text-xs text-muted-foreground transition-colors">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5">
        <p>
          AI answers are grounded strictly on Mohaneesh's verified resume and project portfolio.
        </p>
        <p className="opacity-75">
          Powered by FastAPI • Groq • React 18
        </p>
      </div>
    </footer>
  )
}

Footer.displayName = 'Footer'