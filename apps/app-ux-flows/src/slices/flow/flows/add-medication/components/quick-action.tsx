import { ChevronRightIcon, PlusIcon } from 'lucide-react'

import type { QuickActionProps } from '../model'

export const QuickAction = ({ label, description, onClick }: QuickActionProps) => (
  <button
    className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-left outline-none transition-colors hover:bg-gray-50 focus-visible:ring-3 focus-visible:ring-ring"
    onClick={onClick}
    type="button"
  >
    <span
      aria-hidden
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700"
    >
      <PlusIcon className="size-5" />
    </span>
    <span className="flex min-w-0 flex-1 flex-col">
      <strong className="font-semibold text-base text-gray-900">{label}</strong>
      <span className="text-muted-foreground text-sm">{description}</span>
    </span>
    <ChevronRightIcon aria-hidden className="size-5 shrink-0 text-gray-400" />
  </button>
)
