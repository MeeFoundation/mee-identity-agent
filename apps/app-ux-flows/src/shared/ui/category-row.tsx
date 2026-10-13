import type { ReactNode } from 'react'
import { ChevronRight, type Icon } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { CountBadge } from './count-badge'

type CategoryRowProps = {
  icon: Icon
  label: string
  count: number
  // A line under the label that summarises what the category holds.
  preview?: string
  // Shown before the count, such as a suggestions badge.
  badge?: ReactNode
  onClick: () => void
}

export const CategoryRow = ({ icon: CategoryIcon, label, count, preview, badge, onClick }: CategoryRowProps) => {
  const { t } = useTranslation()

  return (
    <button
      aria-label={
        preview
          ? t('ui.categoryRow.labelWithPreview', { count, label, preview })
          : t('ui.categoryRow.label', { count, label })
      }
      className="flex w-full cursor-pointer items-center gap-2 rounded-2xl bg-white py-2 pr-4 pl-2 text-left shadow-card outline-none transition-colors hover:bg-gray-50 focus-visible:ring-3 focus-visible:ring-ring"
      onClick={onClick}
      type="button"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
        <CategoryIcon aria-hidden className="text-brand-500" size={18} />
      </span>
      {preview ? (
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="font-medium text-base text-gray-900">{label}</span>
          <span className="truncate text-gray-600 text-sm">{preview}</span>
        </span>
      ) : (
        <span className="min-w-0 flex-1 font-medium text-base text-gray-900">{label}</span>
      )}
      {badge}
      <CountBadge count={count} />
      <ChevronRight aria-hidden className="shrink-0 text-gray-700" size={16} />
    </button>
  )
}
