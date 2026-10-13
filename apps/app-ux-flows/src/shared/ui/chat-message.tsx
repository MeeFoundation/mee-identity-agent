import type { ReactNode } from 'react'

import telliAvatar from './icons/telli-avatar.svg'

type ChatMessageProps = {
  author: 'user' | 'agent'
  children: ReactNode
}

export const ChatMessage = ({ author, children }: ChatMessageProps) =>
  author === 'user' ? (
    <div className="flex w-full justify-end">
      <p className="max-w-62 break-words rounded-2xl bg-brand-700 px-3.5 py-2.5 text-[15px] text-white">{children}</p>
    </div>
  ) : (
    <div className="flex w-full items-start gap-2">
      <img alt="" aria-hidden className="block shrink-0" height={28} src={telliAvatar} width={28} />
      <div className="flex min-w-0 flex-col items-start gap-2">{children}</div>
    </div>
  )

type ChatAgentBubbleProps = {
  children: ReactNode
}

// Telli's text, placed inside an agent `ChatMessage` so a suggestion chip can sit under it.
export const ChatAgentBubble = ({ children }: ChatAgentBubbleProps) => (
  <p className="max-w-67.5 break-words rounded-2xl border border-gray-950/8 bg-white px-3.5 py-2.5 text-[15px] text-gray-900">
    {children}
  </p>
)
