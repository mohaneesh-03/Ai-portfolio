import React, { useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface CodeBlockProps {
  language?: string
  value: string
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="my-3 rounded-lg overflow-hidden border border-border bg-card/60 backdrop-blur-sm text-card-foreground shadow-sm">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-muted/70 border-b border-border text-xs font-mono text-muted-foreground">
        <span className="uppercase tracking-wider font-semibold">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="inline-flex items-center gap-1.5 py-1 px-2 rounded hover:bg-background/80 hover:text-foreground transition-colors text-xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed">
        <code>{value}</code>
      </pre>
    </div>
  )
}
