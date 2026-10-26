import { useRouter } from 'expo-router'
import { useAtom } from 'jotai'
import { ScrollView, StyleSheet } from 'react-native'

import { PodsSection, podsEmptyCardDismissedAtom, type PodSummary } from '@/features/pods'
import { spacing } from '@/shared/ui'

const POD_PARAMS = { sort: 'last_activity' } as const
const RECENT_PODS_LIMIT = 2

export const HomePods = () => {
  const router = useRouter()
  const [dismissed, setDismissed] = useAtom(podsEmptyCardDismissedAtom)

  const openPod = (pod: PodSummary) => {
    router.push({ params: { id: pod.id }, pathname: '/pods/[id]' })
  }

  const dismissEmpty = () => {
    setDismissed(true)
  }

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.scroll}>
      <PodsSection
        hideEmpty={dismissed}
        limit={RECENT_PODS_LIMIT}
        onDismissEmpty={dismissEmpty}
        onPodPress={openPod}
        params={POD_PARAMS}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: { padding: spacing[5] },
  scroll: { flex: 1 },
})
