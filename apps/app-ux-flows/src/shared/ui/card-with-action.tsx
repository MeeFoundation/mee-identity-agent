import type { ReactNode } from 'react'
import type { Icon } from 'react-bootstrap-icons'

import { Button } from './button'

type CardWithActionProps = {
  children: ReactNode
  actionLabel: string
  actionIcon: Icon
  actionTone: 'primary' | 'tertiary'
  onAction: () => void
}

// The Tellipod card that pairs a content card with a full-width action underneath it.
export const CardWithAction = ({
  children,
  actionLabel,
  actionIcon: ActionIcon,
  actionTone,
  onAction,
}: CardWithActionProps) => (
  <div className="flex flex-col overflow-clip rounded-2xl bg-white shadow-card">
    {children}
    <div className="px-2 py-1">
      <Button className="w-full px-1.5" onClick={onAction} size="l" tone={actionTone} variant="link">
        <ActionIcon aria-hidden className="shrink-0" size={24} />
        <span className="px-2.5">{actionLabel}</span>
      </Button>
    </div>
  </div>
)
