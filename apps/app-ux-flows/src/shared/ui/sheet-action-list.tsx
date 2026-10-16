import type { Icon } from 'react-bootstrap-icons'

import { cn } from '@/shared/lib/cn'

type SheetAction = {
  icon: Icon
  label: string
  // Danger marks an action that destroys something, such as deleting a file.
  tone?: 'default' | 'danger'
  onClick: () => void
}

type SheetActionListProps = {
  actions: readonly SheetAction[]
}

// The choices inside a bottom sheet, one per line.
export const SheetActionList = ({ actions }: SheetActionListProps) => (
  <ul className="-mx-2 flex flex-col">
    {actions.map(({ icon: ActionIcon, label, tone = 'default', onClick }) => (
      <li key={label}>
        <button
          className={cn(
            'flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-4 text-left font-medium text-base outline-none transition-colors hover:bg-gray-50 focus-visible:ring-3 focus-visible:ring-ring',
            tone === 'danger' ? 'text-error-700' : 'text-gray-700',
          )}
          onClick={onClick}
          type="button"
        >
          <ActionIcon aria-hidden className="shrink-0" size={24} />
          {label}
        </button>
      </li>
    ))}
  </ul>
)
