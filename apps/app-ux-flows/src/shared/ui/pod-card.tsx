import { ChevronRight } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import type { PodSummary } from './pod-summary'

type PodCardProps = {
  pod: PodSummary
  onPress?: (pod: PodSummary) => void
}

export const PodCard = ({ pod, onPress }: PodCardProps) => {
  const { t } = useTranslation()
  const CategoryIcon = pod.category.icon
  const labels = [pod.category.label, ...(pod.subcategory ? [pod.subcategory.label] : [])]
  const name = [pod.name, ...labels, ...(pod.hasUnread ? [t('ui.podsSection.unread')] : [])].join(', ')

  return (
    <button
      aria-label={name}
      className="relative flex w-full cursor-pointer items-center gap-2.5 rounded-2xl bg-white py-2.5 pr-4 pl-2.5 text-left shadow-card outline-none transition-colors hover:bg-gray-50 focus-visible:ring-3 focus-visible:ring-ring"
      onClick={() => onPress?.(pod)}
      type="button"
    >
      {pod.avatarSrc ? (
        <img alt="" aria-hidden className="size-12 shrink-0 rounded-full object-cover" src={pod.avatarSrc} />
      ) : (
        <span
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-700 text-sm"
        >
          {Array.from(pod.name)[0]?.toUpperCase()}
        </span>
      )}
      <span aria-hidden className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-medium text-base text-gray-900">{pod.name}</span>
        <span className="flex items-center gap-1 text-gray-600 text-sm">
          {CategoryIcon && <CategoryIcon className="shrink-0" size={16} />}
          {labels.map((label, index) => (
            <span className="flex items-center gap-1" key={label}>
              {index > 0 && <ChevronRight size={10} />}
              {label}
            </span>
          ))}
        </span>
      </span>
      <ChevronRight aria-hidden className="shrink-0 text-gray-700" size={16} />
      {pod.hasUnread && (
        <span
          aria-hidden
          className="absolute top-2.5 left-2.5 size-3 rounded-full border-2 border-white bg-error-700"
        />
      )}
    </button>
  )
}
