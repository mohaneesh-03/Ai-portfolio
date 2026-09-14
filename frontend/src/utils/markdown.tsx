import React from 'react'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { CodeBlock } from '@/components/Chat/CodeBlock'

export const markdownComponents: Partial<Components> = {
  code(props) {
    const { className, children, ...rest } = props
    const match = /language-(\w+)/.exec(className || '')
    const isInline = !match && !String(children).includes('\n')

    if (isInline) {
      return (
        <code
          className="px-1.5 py-0.5 mx-0.5 rounded bg-muted text-foreground/90 font-mono text-xs font-semibold"
          {...rest}
        >
          {children}
        </code>
      )
    }

    return (
      <CodeBlock
        language={match ? match[1] : undefined}
        value={String(children).replace(/\n$/, '')}
      />
    )
  },
  a(props) {
    const { href, children, ...rest } = props
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
        {...rest}
      >
        {children}
      </a>
    )
  },
  p(props) {
    return <p className="mb-2 last:mb-0 leading-relaxed" {...props} />
  },
  ul(props) {
    return <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />
  },
  ol(props) {
    return <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />
  },
  li(props) {
    return <li className="leading-relaxed" {...props} />
  },
  blockquote(props) {
    return (
      <blockquote
        className="border-l-4 border-primary/40 pl-4 my-3 italic text-muted-foreground"
        {...props}
      />
    )
  },
  h1(props) {
    return <h1 className="text-xl font-bold mt-4 mb-2 tracking-tight text-foreground" {...props} />
  },
  h2(props) {
    return <h2 className="text-lg font-bold mt-3 mb-2 tracking-tight text-foreground" {...props} />
  },
  h3(props) {
    return <h3 className="text-base font-semibold mt-2.5 mb-1.5 text-foreground" {...props} />
  },
  hr(props) {
    return <hr className="my-4 border-border" {...props} />
  },
  table(props) {
    return (
      <div className="my-3 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm" {...props} />
      </div>
    )
  },
  th(props) {
    return <th className="border-b border-border bg-muted/60 px-3 py-2 font-semibold" {...props} />
  },
  td(props) {
    return <td className="border-b border-border/50 px-3 py-2" {...props} />
  }
}

export { ReactMarkdown, remarkGfm, rehypeHighlight }
