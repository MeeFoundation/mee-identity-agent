import type { ComponentProps } from 'react'
import { FileEarmarkPlus, Plus } from 'react-bootstrap-icons'

import { Button } from '@/shared/ui/button'
import type { EmptyStateCard } from '@/shared/ui/empty-state-card'

type ProminentEmptyStateCardProps = ComponentProps<typeof EmptyStateCard>

// Variant B of EXP-DEMO-001: same inputs as the standard empty state card, with a highlighted, filled call to action.
export const ProminentEmptyStateCard = ({ title, message, action }: ProminentEmptyStateCardProps) => (
  <div className="flex flex-col items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-5 text-center shadow-card">
    <span className="flex size-12 items-center justify-center rounded-full bg-brand-100 text-brand-700">
      <FileEarmarkPlus aria-hidden size={24} />
    </span>
    <div className="flex flex-col gap-1">
      <h3 className="font-bold text-gray-900 text-xl">{title}</h3>
      <p className="text-base text-gray-700">{message}</p>
    </div>
    {action && (
      <Button className="w-full gap-1.5" onClick={action.onAction} size="l" tone="primary" variant="filled">
        <Plus aria-hidden className="shrink-0" size={24} />
        <span>{action.label}</span>
      </Button>
    )}
  </div>
)
