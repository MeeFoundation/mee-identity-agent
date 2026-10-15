import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/lib/cn'

import telliAssistantIcon from './icons/telli-assistant.svg'

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
    <div className="flex w-full items-end gap-1.5">
      <span aria-hidden className="flex shrink-0 pb-1">
        <span className="flex size-8 items-center justify-center rounded-full border border-brand-100 bg-brand-50">
          <img alt="" className="block" height={18} src={telliAssistantIcon} width={18} />
        </span>
      </span>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-2">{children}</div>
    </div>
  )

type ChatAgentBubbleProps = {
  children: ReactNode
  // Cards Telli embeds in its reply, shown inside the bubble below the text.
  attachments?: ReactNode
}

// Telli's text, placed inside an agent `ChatMessage` so a suggestion chip can sit under it.
export const ChatAgentBubble = ({ children, attachments }: ChatAgentBubbleProps) => {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'flex max-w-full flex-col rounded-[10px] border border-gray-950/7 bg-white px-3',
        attachments ? 'w-full pt-1.5 pb-3' : 'py-1.5',
      )}
    >
      <span className="font-semibold text-brand-500 text-xs">{t('ui.chat.telliName')}</span>
      <p className="break-words text-base text-gray-800">{children}</p>
      {attachments && <div className="flex flex-col gap-2 pt-1.5">{attachments}</div>}
    </div>
  )
}
