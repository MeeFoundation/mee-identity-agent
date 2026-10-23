import { type FC, type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import {
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  type ScrollViewInstance,
  type StyleProp,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native'
import Animated, { Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

export type TabsSize = 'M' | 'L'

export type TabItem = {
  key: string
  label: string
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

type TabsProps = {
  items: TabItem[]
  value: string
  onValueChange: (key: string) => void
  size?: TabsSize
  fullWidth?: boolean
  style?: StyleProp<ViewStyle>
}

type TabLayout = { x: number; width: number }

const colors = {
  alphaDark5: 'rgba(2, 6, 23, 0.05)',
  alphaDark7: 'rgba(2, 6, 23, 0.07)',
  alphaDark10: 'rgba(2, 6, 23, 0.1)',
  strokeBrandStrong: '#4F868E',
  surfaceDefaultMain: '#FFFFFF',
  surfaceGrayLight: '#F1F5F9',
  surfaceGraySoft: '#F8FAFC',
  textDefaultBody: '#1E293B',
  textGrayOnSoftBackground: '#0F172A',
}

const sizeStyles = {
  L: { containerPadding: 6, containerRadius: 14, height: 44, paddingHorizontal: 16 },
  M: { containerPadding: 4, containerRadius: 12, height: 36, paddingHorizontal: 12 },
}

const FOCUS_BORDER_WIDTH = 2
const TAB_GAP = 1
const CONTAINER_BORDER_WIDTH = 1
const RADIUS = 10
const INDICATOR_DURATION = 250

const indicatorTiming = {
  duration: INDICATOR_DURATION,
  easing: Easing.out(Easing.cubic),
  reduceMotion: ReduceMotion.System,
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    backgroundColor: colors.alphaDark5,
    borderColor: colors.alphaDark10,
    borderWidth: CONTAINER_BORDER_WIDTH,
    flexDirection: 'row',
    maxWidth: '100%',
  },
  containerFill: {
    alignSelf: 'stretch',
  },
  contentFill: {
    width: '100%',
  },
  indicator: {
    backgroundColor: colors.surfaceDefaultMain,
    borderColor: colors.alphaDark10,
    borderRadius: RADIUS,
    borderWidth: 1,
    boxShadow: `0px 0px 3px ${colors.alphaDark7}, 0px 2px 2px ${colors.alphaDark5}`,
    left: 0,
    position: 'absolute',
    top: 0,
  },
  label: {
    color: colors.textGrayOnSoftBackground,
    fontFamily: 'PublicSans_600SemiBold',
    fontSize: 16,
    letterSpacing: 0.08,
    lineHeight: 24,
  },
  labelEmphasis: {
    color: colors.textDefaultBody,
  },
  labelShrink: {
    flexShrink: 1,
  },
  row: {
    flexDirection: 'row',
    gap: TAB_GAP,
  },
  rowFill: {
    flexGrow: 1,
  },
  scroll: {
    flexShrink: 1,
  },
  tab: {
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: RADIUS,
    borderWidth: FOCUS_BORDER_WIDTH,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  tabFill: {
    flex: 1,
    minWidth: 0,
  },
  tabFocused: {
    borderColor: colors.strokeBrandStrong,
  },
  tabFocusedFill: {
    backgroundColor: colors.surfaceGraySoft,
  },
  tabHovered: {
    backgroundColor: colors.surfaceGrayLight,
  },
})

type TabButtonProps = {
  item: TabItem
  selected: boolean
  size: TabsSize
  fullWidth: boolean
  onPress: (key: string) => void
  onLayout: (key: string, event: LayoutChangeEvent) => void
}

const TabButton: FC<TabButtonProps> = ({ item, selected, size, fullWidth, onPress, onLayout }) => {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const { height, paddingHorizontal } = sizeStyles[size]
  const showFill = !selected
  const emphasized = !selected && (hovered || focused)

  return (
    <Pressable
      accessibilityLabel={item.label}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      onBlur={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onLayout={(event) => onLayout(item.key, event)}
      onPress={() => onPress(item.key)}
      style={({ pressed }) => [
        styles.tab,
        { height, paddingHorizontal: paddingHorizontal - FOCUS_BORDER_WIDTH },
        fullWidth && styles.tabFill,
        showFill && (hovered || pressed) && styles.tabHovered,
        showFill && focused && styles.tabFocusedFill,
        focused && styles.tabFocused,
      ]}
    >
      {item.iconLeft}
      <Text
        numberOfLines={1}
        style={[styles.label, fullWidth && styles.labelShrink, emphasized && styles.labelEmphasis]}
      >
        {item.label}
      </Text>
      {item.iconRight}
    </Pressable>
  )
}

export const Tabs: FC<TabsProps> = ({ items, value, onValueChange, size = 'M', fullWidth = false, style }) => {
  const [layouts, setLayouts] = useState<Record<string, TabLayout>>({})
  const scrollRef = useRef<ScrollViewInstance>(null)
  const scrollX = useRef(0)
  const viewportWidth = useRef(0)
  const indicatorPlaced = useRef(false)

  const indicatorX = useSharedValue(0)
  const indicatorWidth = useSharedValue(0)
  const indicatorOpacity = useSharedValue(0)

  const { containerPadding, containerRadius, height } = sizeStyles[size]
  const contentPadding = containerPadding - CONTAINER_BORDER_WIDTH

  const selectedX = layouts[value]?.x
  const selectedWidth = layouts[value]?.width

  const handleTabLayout = useCallback((key: string, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout
    setLayouts((current) => {
      const previous = current[key]
      return previous && previous.x === x && previous.width === width ? current : { ...current, [key]: { width, x } }
    })
  }, [])

  const handlePress = useCallback(
    (key: string) => {
      if (key !== value) onValueChange(key)
    },
    [onValueChange, value],
  )

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollX.current = event.nativeEvent.contentOffset.x
  }, [])

  useEffect(() => {
    if (selectedX === undefined || selectedWidth === undefined) return

    if (indicatorPlaced.current) {
      indicatorX.value = withTiming(selectedX, indicatorTiming)
      indicatorWidth.value = withTiming(selectedWidth, indicatorTiming)
    } else {
      indicatorX.value = selectedX
      indicatorWidth.value = selectedWidth
      indicatorOpacity.value = 1
      indicatorPlaced.current = true
    }

    const tabStart = selectedX + contentPadding
    const tabEnd = tabStart + selectedWidth
    if (tabStart < scrollX.current) {
      scrollRef.current?.scrollTo({ animated: true, x: tabStart - contentPadding })
    } else if (tabEnd > scrollX.current + viewportWidth.current) {
      scrollRef.current?.scrollTo({ animated: true, x: tabEnd + contentPadding - viewportWidth.current })
    }
  }, [selectedX, selectedWidth, contentPadding, indicatorX, indicatorWidth, indicatorOpacity])

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: indicatorOpacity.value,
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
  }))

  return (
    <View style={[styles.container, fullWidth && styles.containerFill, { borderRadius: containerRadius }, style]}>
      <ScrollView
        accessibilityRole="tablist"
        contentContainerStyle={[{ padding: contentPadding }, fullWidth && styles.contentFill]}
        horizontal
        onLayout={(event) => {
          viewportWidth.current = event.nativeEvent.layout.width
        }}
        onScroll={handleScroll}
        ref={scrollRef}
        scrollEnabled={!fullWidth}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
      >
        <View style={[styles.row, fullWidth && styles.rowFill]}>
          <Animated.View pointerEvents="none" style={[styles.indicator, { height }, indicatorStyle]} />
          {items.map((item) => (
            <TabButton
              fullWidth={fullWidth}
              item={item}
              key={item.key}
              onLayout={handleTabLayout}
              onPress={handlePress}
              selected={item.key === value}
              size={size}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
