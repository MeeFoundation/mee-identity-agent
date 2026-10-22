import { type ComponentType, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { AnimatedView, colors, type IconProps, motion, radii, spacing, typography } from '@/shared/ui'

export type FooterTabIcons = {
  outline: ComponentType<IconProps>
  filled: ComponentType<IconProps>
}

type FooterTabProps = {
  focused: boolean
  icons: FooterTabIcons
  label: string
  showBadge: boolean
  unreadLabel: string
}

type TabContentProps = {
  active: boolean
  icons: FooterTabIcons
  label: string
}

export const timing = {
  duration: motion.footerDuration,
  easing: Easing.out(Easing.cubic),
  reduceMotion: ReduceMotion.System,
}

const TabContent = ({ active, icons, label }: TabContentProps) => {
  const Icon = active ? icons.filled : icons.outline
  const color = active ? colors.textBrandMain : colors.textGraySolid

  return (
    <View style={styles.content}>
      <Icon color={color} size={24} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  )
}

export const FooterTab = ({ focused, icons, label, showBadge, unreadLabel }: FooterTabProps) => {
  const progress = useSharedValue(focused ? 1 : 0)

  useEffect(() => {
    progress.value = withTiming(focused ? 1 : 0, timing)
  }, [focused, progress])

  const activeStyle = useAnimatedStyle(() => ({ opacity: progress.value }))

  return (
    <View>
      <TabContent active={false} icons={icons} label={label} />
      <AnimatedView
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, activeStyle]}
        testID="footer-tab-active-layer"
      >
        <TabContent active icons={icons} label={label} />
      </AnimatedView>
      {showBadge && <View accessibilityLabel={unreadLabel} style={styles.badge} />}
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.surfaceErrorSolid,
    borderColor: colors.strokeDefaultMain,
    borderRadius: radii.full,
    borderWidth: 2,
    height: 8,
    left: '50%',
    marginLeft: 2.5,
    position: 'absolute',
    top: spacing[4] + 1,
    width: 8,
  },
  content: {
    alignItems: 'center',
    gap: spacing[0.5],
    paddingBottom: spacing[2.5],
    paddingTop: spacing[4],
  },
  label: { ...typography.xxsMedium, textAlign: 'center' },
})
