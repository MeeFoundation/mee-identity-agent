import type { FC, ReactNode } from 'react'
import { StyleSheet, Text, View, type ViewStyle } from 'react-native'

export type BadgeType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
export type BadgeVariant = 'solid' | 'light' | 'outlined'
export type BadgeSize = 'xxs' | 'xs' | 's' | 'm'
export type BadgeShape = 'rounded' | 'pill' | 'circle' | 'dot'

export type BadgeProps = {
  type?: BadgeType
  variant?: BadgeVariant
  size?: BadgeSize
  shape?: BadgeShape
  children?: ReactNode
  dot?: boolean
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  accessibilityLabel?: string
  style?: ViewStyle
  testID?: string
}

type BadgeColors = { solid: string; soft: string; light: string; text: string }

const colors: Record<BadgeType, BadgeColors> = {
  danger: { light: '#FECACA', soft: '#FEF2F2', solid: '#B91C1C', text: '#B91C1C' },
  primary: { light: '#C3DCDE', soft: '#F3F8F8', solid: '#3B5B63', text: '#3B5B63' },
  secondary: { light: '#E2E8F0', soft: '#F8FAFC', solid: '#334155', text: '#334155' },
  success: { light: '#C8DBBB', soft: '#F2F7EE', solid: '#3F5932', text: '#3F5932' },
  warning: { light: '#F9DF89', soft: '#FEFAEC', solid: '#AE4F0F', text: '#AE4F0F' },
}

const textOnSolid = '#FFFFFF'
const fullRadius = 9999
const circlePadding = 2

type SizeSpec = {
  dotSize: number
  fontSize: number
  height: number
  letterSpacing: number
  padding: number
  radius: number
  slotSize: number
}

const sizes: Record<BadgeSize, SizeSpec> = {
  m: {
    dotSize: 16,
    fontSize: 16,
    height: 28,
    letterSpacing: 0.08,
    padding: 8,
    radius: 6,
    slotSize: 16,
  },
  s: {
    dotSize: 12,
    fontSize: 14,
    height: 24,
    letterSpacing: 0.07,
    padding: 6,
    radius: 4,
    slotSize: 14,
  },
  xs: {
    dotSize: 8,
    fontSize: 12,
    height: 20,
    letterSpacing: 0.06,
    padding: 4,
    radius: 4,
    slotSize: 12,
  },
  xxs: {
    dotSize: 4,
    fontSize: 10,
    height: 16,
    letterSpacing: 0.05,
    padding: 4,
    radius: 4,
    slotSize: 10,
  },
}

const resolveColors = (type: BadgeType, variant: BadgeVariant) => {
  const palette = colors[type]
  switch (variant) {
    case 'solid':
      return { backgroundColor: palette.solid, borderColor: palette.solid, textColor: textOnSolid }
    case 'light':
      return { backgroundColor: palette.soft, borderColor: palette.light, textColor: palette.text }
    case 'outlined':
      return { backgroundColor: 'transparent', borderColor: palette.light, textColor: palette.text }
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  dotShape: {
    borderRadius: fullRadius,
    borderWidth: 1,
  },
  label: {
    flexShrink: 1,
    fontFamily: 'PublicSans_600SemiBold',
  },
  labelBox: {
    alignItems: 'center',
    flexShrink: 1,
    justifyContent: 'center',
  },
  slot: {
    alignItems: 'center',
    flexShrink: 0,
    justifyContent: 'center',
  },
})

export const Badge: FC<BadgeProps> = ({
  type = 'primary',
  variant = 'solid',
  size = 'm',
  shape = 'rounded',
  children,
  dot,
  leadingIcon,
  trailingIcon,
  accessibilityLabel,
  style,
  testID,
}) => {
  const spec = sizes[size]
  const { backgroundColor, borderColor, textColor } = resolveColors(type, variant)

  if (shape === 'dot') {
    return (
      <View
        accessibilityLabel={accessibilityLabel}
        accessible={Boolean(accessibilityLabel)}
        importantForAccessibility={accessibilityLabel ? 'auto' : 'no-hide-descendants'}
        style={[styles.dotShape, { backgroundColor, borderColor, height: spec.dotSize, width: spec.dotSize }, style]}
        testID={testID}
      />
    )
  }

  const isCircle = shape === 'circle'
  const showSlots = !isCircle
  const containerStyle: ViewStyle = {
    backgroundColor,
    borderColor,
    borderRadius: shape === 'rounded' ? spec.radius : fullRadius,
    height: spec.height,
    paddingHorizontal: isCircle ? circlePadding : spec.padding,
    ...(isCircle ? { minWidth: spec.height } : null),
  }
  const slotBox = { height: spec.slotSize, width: spec.slotSize }

  return (
    <View style={[styles.container, containerStyle, style]} testID={testID}>
      {showSlots && dot ? (
        <View style={[styles.slot, slotBox]}>
          <View
            style={{
              backgroundColor: textColor,
              borderRadius: fullRadius,
              height: spec.slotSize / 2,
              width: spec.slotSize / 2,
            }}
          />
        </View>
      ) : null}
      {showSlots && leadingIcon ? <View style={[styles.slot, slotBox]}>{leadingIcon}</View> : null}
      <View style={[styles.labelBox, { paddingHorizontal: spec.padding }]}>
        <Text
          numberOfLines={1}
          style={[
            styles.label,
            {
              color: textColor,
              fontSize: spec.fontSize,
              letterSpacing: spec.letterSpacing,
              lineHeight: spec.fontSize,
            },
          ]}
        >
          {children}
        </Text>
      </View>
      {showSlots && trailingIcon ? <View style={[styles.slot, slotBox]}>{trailingIcon}</View> : null}
    </View>
  )
}
