import { ArrowRight } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { Button } from './button'
import { EmptyPodsCard } from './empty-pods-card'
import { PodCard } from './pod-card'
import { PodCardSkeletonList } from './pod-card-skeleton-list'
import type { PodSummary } from './pod-summary'

type PodsSectionStatus = 'loading' | 'ready' | 'error'

type PodsSectionProps = {
  status: PodsSectionStatus
  pods?: readonly PodSummary[]
  // At most this many pods, and this many placeholders while loading.
  limit?: number
  onPodPress?: (pod: PodSummary) => void
  // Without it the header has no link.
  onSeeAll?: () => void
  // Without it the empty card has no "Add Pod" button.
  onAddPod?: () => void
  onDismissEmpty?: () => void
  onRetry?: () => void
}

const DEFAULT_LIMIT = 2

const noop = () => {}

// Home's list of recent pods as app-tellipod shows it; the owner decides the status and what each handler does.
export const PodsSection = ({
  status,
  pods = [],
  limit = DEFAULT_LIMIT,
  onPodPress,
  onSeeAll,
  onAddPod,
  onDismissEmpty,
  onRetry = noop,
}: PodsSectionProps) => {
  const { t } = useTranslation()

  if (status === 'ready' && pods.length === 0) {
    return <EmptyPodsCard onAddPod={onAddPod} onDismiss={onDismissEmpty} />
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5 pt-2">
        <h2 className="flex-1 font-semibold text-gray-600 text-xs uppercase">{t('ui.podsSection.recent')}</h2>
        {onSeeAll && (
          <button className="flex items-center gap-2 text-brand-700 text-sm" onClick={onSeeAll} type="button">
            {t('ui.podsSection.seeAll')}
            <ArrowRight aria-hidden size={16} />
          </button>
        )}
      </div>
      {status === 'loading' && <PodCardSkeletonList count={limit} />}
      {status === 'error' && (
        <div className="flex flex-col items-center gap-3 py-5">
          <p className="text-center text-base text-gray-600">{t('ui.podsSection.error')}</p>
          <Button onClick={onRetry} size="s" tone="secondary" variant="outlined">
            {t('ui.podsSection.retry')}
          </Button>
        </div>
      )}
      {status === 'ready' && (
        <div className="flex flex-col gap-3">
          {pods.slice(0, limit).map((pod) => (
            <PodCard key={pod.id} onPress={onPodPress} pod={pod} />
          ))}
        </div>
      )}
    </section>
  )
}
