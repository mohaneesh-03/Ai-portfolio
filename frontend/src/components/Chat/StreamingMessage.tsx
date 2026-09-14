import React from 'react'
import { MessageBubble } from '@/components/Chat/MessageBubble'
import type { Message } from '@/types'

interface StreamingMessageProps {
  message: Message
}

export const StreamingMessage: React.FC<StreamingMessageProps> = ({ message }) => {
  return (
    <MessageBubble
      message={message}
      isUser={false}
      isStreaming={message.isStreaming}
    />
  )
}

StreamingMessage.displayName = 'StreamingMessage'