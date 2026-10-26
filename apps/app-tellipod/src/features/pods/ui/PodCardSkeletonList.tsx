import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'

import { PodCardSkeleton } from './PodCardSkeleton'
import { AnimatedView, motion, spacing } from '@/shared/ui'

type PodCardSkeletonListProps = {
  readonly count: number
  readonly testID?: string
}

const PULSE_LOW_OPACITY = 0.5

export const PodCardSkeletonList = ({ count, testID }: PodCardSkeletonListProps) => {
  const { t } = useTranslation()
  const opacity = useSharedValue(1)

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(PULSE_LOW_OPACITY, {
        duration: motion.skeletonPulseDuration,
        easing: Easing.out(Easing.quad),
        reduceMotion: ReduceMotion.System,
      }),
      -1,
      true,
      undefined,
      ReduceMotion.System,
    )
  }, [opacity])

  const pulse = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <AnimatedView
      accessibilityLabel={t('pod.list.loading')}
      accessibilityState={{ busy: true }}
      accessible
      style={[styles.list, pulse]}
      testID={testID}
    >
      {Array.from({ length: count }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: placeholders are identical and never reorder
        <PodCardSkeleton key={index} testID={testID ? `${testID}-row-${index}` : undefined} />
      ))}
    </AnimatedView>
  )
}

const styles = StyleSheet.create({
  list: { alignSelf: 'stretch', gap: spacing[3] },
})
