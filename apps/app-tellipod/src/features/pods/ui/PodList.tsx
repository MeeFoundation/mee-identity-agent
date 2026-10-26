import type { PodSummary } from '../model/pod-summary'
import type { PodListParams } from '../store/pods-store'
import { usePodList } from '../store/use-pod-list'
import { PodListView } from './PodListView'

type PodListProps = {
  readonly params: PodListParams
  readonly limit: number
  readonly onPodPress: (pod: PodSummary) => void
  readonly testID?: string
}

export const PodList = ({ params, limit, onPodPress, testID }: PodListProps) => {
  const { hasLoaded, pods, retry, status } = usePodList(params, limit)
  const handleRetry = () => {
    retry()
  }

  return (
    <PodListView
      hasLoaded={hasLoaded}
      limit={limit}
      onPodPress={onPodPress}
      onRetry={handleRetry}
      pods={pods}
      status={status}
      testID={testID}
    />
  )
}
