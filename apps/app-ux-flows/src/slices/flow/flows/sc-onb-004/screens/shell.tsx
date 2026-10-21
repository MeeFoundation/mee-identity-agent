import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/cn'

import '../onboarding-v2.css'

export const FlowPage = ({
  children,
  footer,
  top,
}: {
  children: ReactNode
  footer?: ReactNode
  top?: ReactNode
}) => (
  <div className="flex h-full flex-col bg-gray-50">
    {top}
    <div className="flex min-h-0 flex-1 animate-onb-step-in flex-col overflow-y-auto px-6 py-4">{children}</div>
    {footer ? <div className="shrink-0 px-6 pt-2 pb-4">{footer}</div> : null}
  </div>
)

export const Wordmark = ({ className }: { className?: string }) => (
  <span className={cn('flex items-center gap-2 font-semibold text-brand-700', className)}>
    <span aria-hidden className="grid size-6 place-items-center rounded-md bg-brand-700">
      <span className="size-2.5 rounded-[3px] bg-brand-50 ring-2 ring-brand-700" />
    </span>
    Tellipod
  </span>
)

export const ActionStack = ({ children }: { children: ReactNode }) => (
  <div className="grid gap-3">{children}</div>
)
