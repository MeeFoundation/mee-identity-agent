import type { PodSummary } from '../model/pod-summary'
import type { PodListParams } from '../store/pods-store'
import { usePodList } from '../store/use-pod-list'
import { PodsSectionView } from './PodsSectionView'

type PodsSectionProps = {
  readonly params: PodListParams
  readonly limit: number
  readonly onPodPress: (pod: PodSummary) => void
  readonly onDismissEmpty: () => void
  readonly onSeeAll?: () => void
  readonly onAddPod?: () => void
  readonly hideEmpty?: boolean
  readonly testID?: string
}

export const PodsSection = ({
  params,
  limit,
  onPodPress,
  onSeeAll,
  onAddPod,
  onDismissEmpty,
  hideEmpty,
  testID,
}: PodsSectionProps) => {
  const { hasLoaded, pods, retry, status } = usePodList(params, limit)
  const handleRetry = () => {
    retry()
  }

  return (
    <PodsSectionView
      hasLoaded={hasLoaded}
      hideEmpty={hideEmpty}
      limit={limit}
      onAddPod={onAddPod}
      onDismissEmpty={onDismissEmpty}
      onPodPress={onPodPress}
      onRetry={handleRetry}
      onSeeAll={onSeeAll}
      pods={pods}
      status={status}
      testID={testID}
    />
  )
}
