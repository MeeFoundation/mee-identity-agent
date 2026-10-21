import { useAtomValue } from 'jotai'
import type { ReactNode } from 'react'
import { StyleSheet } from 'react-native'
import { FadeIn, FadeOut, ReduceMotion } from 'react-native-reanimated'

import { chromeAtom } from '@/shared/chrome'
import { AnimatedView, motion, spacing } from '@/shared/ui'

import { BackSearchHeader } from './back-search-header'
import { HeaderSurface } from './header-surface'
import { HomeHeader } from './home-header'
import { PodHeader } from './pod-header'

const entering = FadeIn.duration(motion.headerDuration).reduceMotion(ReduceMotion.System)
const exiting = FadeOut.duration(motion.headerDuration).reduceMotion(ReduceMotion.System)

export const AppHeader = () => {
  const { header, pod } = useAtomValue(chromeAtom)

  let content: ReactNode = null
  switch (header) {
    case 'home':
      content = <HomeHeader />
      break
    case 'back-search':
      content = <BackSearchHeader />
      break
    case 'pod':
      content = pod ? <PodHeader pod={pod} /> : null
      break
  }

  if (!content) {
    return null
  }

  return (
    <HeaderSurface>
      <AnimatedView entering={entering} exiting={exiting} key={header} style={styles.content}>
        {content}
      </AnimatedView>
    </HeaderSurface>
  )
}

const styles = StyleSheet.create({
  content: { gap: spacing[5] },
})
