import { useTranslation } from 'react-i18next'

type PodCardSkeletonListProps = {
  count: number
}

export const PodCardSkeletonList = ({ count }: PodCardSkeletonListProps) => {
  const { t } = useTranslation()

  return (
    <output
      aria-busy="true"
      aria-label={t('ui.podsSection.loading')}
      className="flex animate-pulse flex-col gap-3 motion-reduce:animate-none"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          aria-hidden
          className="flex items-center gap-2.5 rounded-2xl bg-white py-2.5 pr-4 pl-2.5 shadow-card"
          // biome-ignore lint/suspicious/noArrayIndexKey: placeholders are identical and never reorder
          key={index}
        >
          <span className="size-10 shrink-0 rounded-full bg-gray-100" />
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="h-4 w-[55%] rounded-full bg-gray-100" />
            <span className="h-3 w-[35%] rounded-full bg-gray-100" />
          </span>
        </div>
      ))}
    </output>
  )
}
