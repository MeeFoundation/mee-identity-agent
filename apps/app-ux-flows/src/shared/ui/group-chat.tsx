import type { FormEvent, ReactNode } from 'react'
import { ArrowUp, Plus } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { shouldSend } from './chat-composer'
import telliAssistantIcon from './icons/telli-assistant.svg'
import { cn } from '@/shared/lib/cn'

// A person shows the first letter of their name; an assistant shows its icon.
type ChatAuthorAvatar = { letter: string } | { icon: string }

type GroupChatMessageProps = {
  // `null` for the person using the app, whose messages sit on the right without a name.
  author: { name: string; avatar: ChatAuthorAvatar } | null
  time: string
  children: ReactNode
}

const AuthorAvatar = ({ avatar }: { avatar: ChatAuthorAvatar }) =>
  'icon' in avatar ? (
    <span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-100">
      <img alt="" className="block" height={16} src={avatar.icon} width={16} />
    </span>
  ) : (
    <span
      aria-hidden
      className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-600 text-xs"
    >
      {avatar.letter}
    </span>
  )

const Time = ({ children, className }: { children: string; className: string }) => (
  <span className={cn('float-right ml-2 translate-y-1 text-[11px] leading-4', className)}>{children}</span>
)

// After the Mee Design System group chat: others' messages carry their avatar, name and time.
export const GroupChatMessage = ({ author, time, children }: GroupChatMessageProps) =>
  author === null ? (
    <div className="flex w-full justify-end">
      <p className="max-w-64 break-words rounded-2xl bg-brand-950 px-3.5 py-2 text-[15px] text-white">
        {children}
        <Time className="text-white/60">{time}</Time>
      </p>
    </div>
  ) : (
    <div className="flex w-full items-end gap-2">
      <AuthorAvatar avatar={author.avatar} />
      <div className="flex min-w-0 max-w-64 flex-col rounded-2xl border border-gray-950/8 bg-white px-3.5 py-2">
        <span className="font-semibold text-brand-600 text-xs">{author.name}</span>
        <p className="break-words text-[15px] text-gray-900">
          {children}
          <Time className="text-gray-500">{time}</Time>
        </p>
      </div>
    </div>
  )

type ChatNoticeProps = {
  children: ReactNode
}

// A centred pill for a day or for something that happened in the chat, such as someone joining.
export const ChatNotice = ({ children }: ChatNoticeProps) => (
  <p className="self-center rounded-md border border-gray-950/5 bg-gray-50 px-2 py-0.5 text-gray-600 text-xs">
    {children}
  </p>
)

// After the Figma "Cell - Chat - 2" frame: shown in a pod chat that has no messages yet.
export const ChatEmptyState = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <img alt="" aria-hidden className="block" height={40} src={telliAssistantIcon} width={40} />
      <div className="flex flex-col">
        <p className="text-gray-900 text-lg">{t('ui.groupChat.empty.title')}</p>
        <p className="text-gray-600 text-sm">
          {t('ui.groupChat.empty.message')}
          <br />
          {t('ui.groupChat.empty.hint')}
        </p>
      </div>
    </div>
  )
}

type GroupChatComposerProps = {
  value: string
  placeholder: string
  sendLabel: string
  attachLabel: string
  onChange: (value: string) => void
  onSend: () => void
}

export const GroupChatComposer = ({
  value,
  placeholder,
  sendLabel,
  attachLabel,
  onChange,
  onSend,
}: GroupChatComposerProps) => {
  const canSend = shouldSend(value)

  // A form submits on Enter in the input as well as on the send button.
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (canSend) onSend()
  }

  return (
    <form
      className="flex flex-col gap-2 rounded-2xl border border-gray-950/10 bg-white px-3 pt-3 pb-2 focus-within:border-brand-500 focus-within:ring-3 focus-within:ring-ring"
      onSubmit={submit}
    >
      <input
        aria-label={placeholder}
        className="min-w-0 bg-transparent text-[15px] text-gray-900 outline-none placeholder:text-gray-500"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
      <div className="flex items-center justify-between">
        <button
          aria-label={attachLabel}
          className="-ml-1 flex size-7 cursor-pointer items-center justify-center rounded-full text-gray-700 outline-none transition-colors hover:bg-gray-100 focus-visible:ring-3 focus-visible:ring-ring"
          type="button"
        >
          <Plus aria-hidden size={22} />
        </button>
        <button
          aria-label={sendLabel}
          className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-brand-600 text-white outline-none transition-colors hover:bg-brand-700 focus-visible:ring-3 focus-visible:ring-ring disabled:cursor-default disabled:bg-brand-300"
          disabled={!canSend}
          type="submit"
        >
          <ArrowUp aria-hidden size={16} />
        </button>
      </div>
    </form>
  )
}
