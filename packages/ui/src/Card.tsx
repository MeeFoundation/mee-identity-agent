import { type FC, type ReactNode, useCallback, useEffect, useState } from 'react'
import { type LayoutChangeEvent, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'
import Animated, { Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { ChevronRightIcon } from './icons'
import {
  clipDividerStyle,
  hasContent,
  PanelBody,
  type PanelFooter,
  PanelFooterAction,
  PanelSurface,
} from './PanelParts'

export type CardState = {
  expanded: boolean
  toggle: () => void
}

export type CardProps = {
  header?: (state: CardState) => ReactNode
  children?: ReactNode
  footer?: PanelFooter
  expanded?: boolean
  defaultExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  style?: StyleProp<ViewStyle>
  testID?: string
}

export type CardChevronProps = {
  expanded: boolean
  testID?: string
}

const ANIMATION_DURATION = 250
const EXPANDED_ROTATION = 90

const timing = {
  duration: ANIMATION_DURATION,
  easing: Easing.out(Easing.cubic),
  reduceMotion: ReduceMotion.System,
}

const styles = StyleSheet.create({
  chevronBox: {
    alignItems: 'center',
    height: 16,
    justifyContent: 'center',
    width: 16,
  },
  collapsible: {
    overflow: 'hidden',
  },
  measure: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
})

const Collapsible: FC<{ expanded: boolean; children: ReactNode }> = ({ expanded, children }) => {
  const [measured, setMeasured] = useState(false)
  const progress = useSharedValue(expanded ? 1 : 0)
  const contentHeight = useSharedValue(0)
  const isMeasured = useSharedValue(0)

  useEffect(() => {
    progress.value = withTiming(expanded ? 1 : 0, timing)
  }, [expanded, progress])

  const heightStyle = useAnimatedStyle(() => {
    if (isMeasured.value) return { height: contentHeight.value * progress.value }
    return progress.value ? {} : { height: 0 }
  })

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      contentHeight.value = event.nativeEvent.layout.height
      isMeasured.value = 1
      setMeasured(true)
    },
    [contentHeight, isMeasured],
  )

  return (
    <Animated.View
      accessibilityElementsHidden={!expanded}
      importantForAccessibility={expanded ? 'auto' : 'no-hide-descendants'}
      pointerEvents={expanded ? 'auto' : 'none'}
      style={[styles.collapsible, heightStyle]}
    >
      <View onLayout={onLayout} style={measured ? styles.measure : undefined}>
        {children}
      </View>
    </Animated.View>
  )
}

export const Card: FC<CardProps> = ({
  header,
  children,
  footer,
  expanded: controlledExpanded,
  defaultExpanded = true,
  onExpandedChange,
  style,
  testID,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)
  const expanded = controlledExpanded ?? internalExpanded
  const isControlled = controlledExpanded !== undefined

  const toggle = useCallback(() => {
    const next = !expanded
    if (!isControlled) setInternalExpanded(next)
    onExpandedChange?.(next)
  }, [expanded, isControlled, onExpandedChange])

  const hasBody = hasContent(children)
  const clipHeaderDivider = !(expanded && (hasBody || footer !== undefined))

  return (
    <PanelSurface style={style} testID={testID}>
      <View style={clipHeaderDivider ? clipDividerStyle : undefined} testID={testID ? `${testID}-content` : undefined}>
        {header?.({ expanded, toggle })}
        <Collapsible expanded={expanded}>
          <PanelBody testID={testID ? `${testID}-body` : undefined}>{children}</PanelBody>
          {footer ? <PanelFooterAction footer={footer} testID={testID ? `${testID}-footer` : undefined} /> : null}
        </Collapsible>
      </View>
    </PanelSurface>
  )
}

export const CardChevron: FC<CardChevronProps> = ({ expanded, testID }) => {
  const rotation = useSharedValue(expanded ? EXPANDED_ROTATION : 0)

  useEffect(() => {
    rotation.value = withTiming(expanded ? EXPANDED_ROTATION : 0, timing)
  }, [expanded, rotation])

  const rotationStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }))

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.chevronBox, rotationStyle]}
      testID={testID}
    >
      <ChevronRightIcon />
    </Animated.View>
  )
}
