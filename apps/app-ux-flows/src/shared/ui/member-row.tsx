import type { ReactNode } from 'react'
import { ChevronRight } from 'react-bootstrap-icons'

import { cn } from '@/shared/lib/cn'

// A person shows the first letter of their name; an assistant shows its icon.
type MemberAvatar = { letter: string } | { icon: string }

type MemberRowProps = {
  avatar: MemberAvatar
  name: string
  detail: string
  detailTone?: 'default' | 'warning'
  online?: boolean
  // Without it the row is not interactive and shows no chevron.
  onClick?: () => void
}

const Avatar = ({ avatar, online }: { avatar: MemberAvatar; online: boolean }) => (
  <span className="relative shrink-0">
    {'icon' in avatar && (
      <span aria-hidden className="flex size-12 items-center justify-center rounded-full bg-brand-100 pt-0.5">
        <img alt="" className="block" height={24} src={avatar.icon} width={24} />
      </span>
    )}
    {'letter' in avatar && (
      <span
        aria-hidden
        className="flex size-12 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-600 text-lg"
      >
        {avatar.letter}
      </span>
    )}
    {online && (
      <span aria-hidden className="absolute bottom-0 left-0 size-3 rounded-full border-2 border-white bg-success-700" />
    )}
  </span>
)

export const MemberRow = ({
  avatar,
  name,
  detail,
  detailTone = 'default',
  online = false,
  onClick,
}: MemberRowProps) => {
  const content = (
    <>
      <Avatar avatar={avatar} online={online} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-medium text-base text-gray-900">{name}</span>
        <span className={cn('truncate text-sm', detailTone === 'warning' ? 'text-warning-700' : 'text-gray-600')}>
          {detail}
        </span>
      </span>
    </>
  )

  if (!onClick) return <div className="flex w-full items-center gap-3 px-3 py-3">{content}</div>

  return (
    <button
      className="flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-left outline-none transition-colors hover:bg-gray-50 focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset"
      onClick={onClick}
      type="button"
    >
      {content}
      <ChevronRight aria-hidden className="shrink-0 text-gray-700" size={16} />
    </button>
  )
}

type MemberCardProps = {
  children: ReactNode
  // Below the rows, such as an "Invite member" button.
  footer?: ReactNode
}

export const MemberCard = ({ children, footer }: MemberCardProps) => (
  <div className="flex flex-col overflow-clip rounded-2xl bg-white shadow-card">
    <div className="flex flex-col divide-y divide-gray-200">{children}</div>
    {footer && <div className="p-2">{footer}</div>}
  </div>
)
