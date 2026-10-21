import { LinearGradient } from 'expo-linear-gradient'
import type { ReactNode } from 'react'
import { StyleSheet } from 'react-native'
import { Easing, FadeIn, FadeOut, LinearTransition, ReduceMotion } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { AnimatedView, colors, motion, radii, spacing } from '@/shared/ui'

type HeaderSurfaceProps = {
  children: ReactNode
}

const easing = Easing.out(Easing.quad)
const layout = LinearTransition.duration(motion.headerDuration).easing(easing).reduceMotion(ReduceMotion.System)
const entering = FadeIn.duration(motion.headerDuration).reduceMotion(ReduceMotion.System)
const exiting = FadeOut.duration(motion.headerDuration).reduceMotion(ReduceMotion.System)

export const HeaderSurface = ({ children }: HeaderSurfaceProps) => {
  const insets = useSafeAreaInsets()

  return (
    <AnimatedView entering={entering} exiting={exiting} layout={layout} style={styles.shadow}>
      <LinearGradient colors={[colors.surfaceBrandLight, colors.surfaceDefaultMain]} style={styles.surface}>
        <AnimatedView layout={layout} style={[styles.content, { paddingTop: insets.top + spacing[2.5] }]}>
          {children}
        </AnimatedView>
      </LinearGradient>
    </AnimatedView>
  )
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing[5], paddingHorizontal: spacing[5] },
  shadow: {
    backgroundColor: colors.surfaceDefaultMain,
    borderBottomLeftRadius: radii['3xl'],
    borderBottomRightRadius: radii['3xl'],
    elevation: 6,
    shadowColor: colors.alphaDark15,
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 7.5,
  },
  surface: {
    borderBottomLeftRadius: radii['3xl'],
    borderBottomRightRadius: radii['3xl'],
    borderBottomWidth: 1,
    borderColor: colors.strokeDefaultMain,
    overflow: 'hidden',
  },
})
