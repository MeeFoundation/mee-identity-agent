import { StyleSheet, View } from 'react-native'

import type { PodSummary } from '../model/pod-summary'
import { EmptyPodsCard } from './EmptyPodsCard'
import { PodListView } from './PodListView'
import { PodsSectionHeader } from './PodsSectionHeader'
import type { ListStatus } from '@/shared/list'
import { spacing } from '@/shared/ui'

type PodsSectionViewProps = {
  readonly pods: ReadonlyArray<PodSummary>
  readonly hasLoaded: boolean
  readonly status: ListStatus
  readonly limit: number
  readonly onPodPress: (pod: PodSummary) => void
  readonly onRetry: () => void
  readonly onDismissEmpty: () => void
  readonly onSeeAll?: () => void
  readonly onAddPod?: () => void
  readonly hideEmpty?: boolean
  readonly testID?: string
}

export const PodsSectionView = ({
  pods,
  hasLoaded,
  status,
  limit,
  onPodPress,
  onRetry,
  onSeeAll,
  onAddPod,
  onDismissEmpty,
  hideEmpty = false,
  testID,
}: PodsSectionViewProps) => {
  const childTestID = (suffix: string) => (testID ? `${testID}-${suffix}` : undefined)
  const isEmpty = pods.length === 0 && hasLoaded && status === 'idle'

  if (isEmpty && hideEmpty) {
    return null
  }

  return (
    <View style={styles.section} testID={testID}>
      {isEmpty ? null : <PodsSectionHeader onSeeAll={onSeeAll} testID={childTestID('header')} />}
      <PodListView
        empty={<EmptyPodsCard onAddPod={onAddPod} onDismiss={onDismissEmpty} testID={childTestID('empty')} />}
        hasLoaded={hasLoaded}
        limit={limit}
        onPodPress={onPodPress}
        onRetry={onRetry}
        pods={pods}
        status={status}
        testID={childTestID('list')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  section: { alignSelf: 'stretch', gap: spacing[3] },
})
