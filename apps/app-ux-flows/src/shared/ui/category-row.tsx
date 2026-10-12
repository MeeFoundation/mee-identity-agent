import { ChevronRight, type Icon } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

type CategoryRowProps = {
  icon: Icon
  label: string
  count: number
  // A line under the label that summarises what the category holds.
  preview?: string
  onClick: () => void
}

export const CategoryRow = ({ icon: CategoryIcon, label, count, preview, onClick }: CategoryRowProps) => {
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
      <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-brand-200 bg-brand-50 px-1.5 font-semibold text-brand-700 text-xs">
        {count}
      </span>
      <ChevronRight aria-hidden className="shrink-0 text-gray-700" size={16} />
    </button>
  )
}
