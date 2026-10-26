import { Button } from '@mee/ui'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

import type { PodSummary } from '../model/pod-summary'
import { PodCard } from './PodCard'
import { PodCardSkeletonList } from './PodCardSkeletonList'
import type { ListStatus } from '@/shared/list'
import { colors, spacing, typography } from '@/shared/ui'

type PodListViewProps = {
  readonly pods: ReadonlyArray<PodSummary>
  readonly hasLoaded: boolean
  readonly status: ListStatus
  readonly limit: number
  readonly onPodPress: (pod: PodSummary) => void
  readonly onRetry: () => void
  readonly empty?: ReactNode
  readonly testID?: string
}

type ErrorBlockProps = {
  readonly onRetry: () => void
  readonly testID?: string
}

const ErrorBlock = ({ onRetry, testID }: ErrorBlockProps) => {
  const { t } = useTranslation()

  return (
    <View style={styles.message} testID={testID}>
      <Text style={styles.messageText}>{t('pod.list.error')}</Text>
      <Button onPress={onRetry} size="sm" variant="secondary">
        {t('pod.list.retry')}
      </Button>
    </View>
  )
}

export const PodListView = ({
  pods,
  hasLoaded,
  status,
  limit,
  onPodPress,
  onRetry,
  empty,
  testID,
}: PodListViewProps) => {
  const { t } = useTranslation()
  const shown = pods.slice(0, limit)
  const childTestID = (suffix: string) => (testID ? `${testID}-${suffix}` : undefined)

  if (shown.length === 0) {
    if (status === 'error') {
      return <ErrorBlock onRetry={onRetry} testID={childTestID('error')} />
    }
    if (hasLoaded && status === 'idle') {
      if (empty) {
        return <>{empty}</>
      }
      return (
        <View style={styles.message} testID={childTestID('empty')}>
          <Text style={styles.messageText}>{t('pod.list.empty')}</Text>
        </View>
      )
    }
    return <PodCardSkeletonList count={limit} testID={childTestID('pending')} />
  }

  return (
    <View style={styles.list} testID={testID}>
      {shown.map((pod) => (
        <PodCard key={pod.id} onPress={onPodPress} pod={pod} testID={childTestID(`card-${pod.id}`)} />
      ))}
      {status === 'error' ? <ErrorBlock onRetry={onRetry} testID={childTestID('error')} /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  list: { alignSelf: 'stretch', gap: spacing[3] },
  message: { alignItems: 'center', alignSelf: 'stretch', gap: spacing[3], paddingVertical: spacing[5] },
  messageText: { ...typography.baseRegular, color: colors.textDefaultSubtle, textAlign: 'center' },
})
