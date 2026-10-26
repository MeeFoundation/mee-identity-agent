import type { ReactNode } from 'react'

import type { PodSummary } from '../model/pod-summary'
import type { PodListParams } from '../store/pods-store'
import { usePodList } from '../store/use-pod-list'
import { PodListView } from './PodListView'

type PodListProps = {
  readonly params: PodListParams
  readonly limit: number
  readonly onPodPress: (pod: PodSummary) => void
  readonly empty?: ReactNode
  readonly testID?: string
}

export const PodList = ({ params, limit, onPodPress, empty, testID }: PodListProps) => {
  const { hasLoaded, pods, retry, status } = usePodList(params, limit)
  const handleRetry = () => {
    retry()
  }

  return (
    <PodListView
      empty={empty}
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
