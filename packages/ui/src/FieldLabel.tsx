import { type FC, type ReactNode, useLayoutEffect } from 'react'
import { type StyleProp, StyleSheet, Text, View, type ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'

import {
  BOX_BORDER_WIDTH,
  type FieldState,
  FLOATED_FONT_SIZE,
  FLOATED_LINE_HEIGHT,
  fieldColors,
  fieldTextColor,
  type LabelPlacement,
  sizeMetrics,
  useFieldState,
  useRequiredInputGroup,
} from './fieldContext'

export type FieldLabelProps = {
  children: ReactNode
  optional?: string
  placement?: LabelPlacement
  required?: boolean
  style?: StyleProp<ViewStyle>
  testID?: string
  tooltip?: ReactNode
}

const LABEL_PADDING = 2
const EDGE_FLOAT_X = 10
const OPTIONAL_OPACITY = 0.75
const LABEL_ROW_HEIGHT = 16

const styles = StyleSheet.create({
  above: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    paddingHorizontal: LABEL_PADDING,
  },
  floating: {
    alignItems: 'center',
    flexDirection: 'row',
    left: 0,
    paddingHorizontal: LABEL_PADDING,
    position: 'absolute',
    top: 0,
    transformOrigin: 'left center',
  },
  mask: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  optional: {
    opacity: OPTIONAL_OPACITY,
  },
  text: {
    fontFamily: 'PublicSans_400Regular',
  },
  tooltip: {
    paddingLeft: 4,
  },
})

const useRegisterLabelText = (field: FieldState | null, children: ReactNode) => {
  const setLabelText = field?.setLabelText
  const text = typeof children === 'string' ? children : undefined

  useLayoutEffect(() => {
    setLabelText?.(text)
    return () => setLabelText?.(undefined)
  }, [setLabelText, text])
}

const LabelContent: FC<{ children: ReactNode; optional?: string; required?: boolean }> = ({
  children,
  optional,
  required,
}) => (
  <>
    {children}
    {required ? '*' : null}
    {optional ? <Text style={styles.optional}>{optional}</Text> : null}
  </>
)

const AboveLabel: FC<FieldLabelProps> = ({ children, optional, required, style, testID, tooltip }) => {
  const field = useFieldState()
  const { fontSize, labelGap, letterSpacing, lineHeight } = sizeMetrics[field?.size ?? 'M']
  useRegisterLabelText(field, children)
  const overflow = (lineHeight - LABEL_ROW_HEIGHT) / 2

  return (
    <View
      style={[styles.above, { height: lineHeight, marginBottom: labelGap - 2 - overflow, marginTop: -overflow }, style]}
      testID={testID}
    >
      <Text
        style={[
          styles.text,
          { color: fieldTextColor(field, fieldColors.textDefaultBody), fontSize, letterSpacing, lineHeight },
        ]}
      >
        <LabelContent optional={optional} required={required}>
          {children}
        </LabelContent>
      </Text>
      {tooltip ? <View style={styles.tooltip}>{tooltip}</View> : null}
    </View>
  )
}

const FloatingLabel: FC<FieldLabelProps & { placement: 'edge' | 'inside' }> = ({
  children,
  optional,
  placement,
  required,
  style,
  testID,
}) => {
  const group = useRequiredInputGroup('A FieldLabel with placement "edge" or "inside"')
  const { contentX, field, fill, floated, inputX, progress, setLabelPlacement, size } = group
  const { fontSize, insideHeight, insidePadding, boxHeight, letterSpacing, lineHeight } = sizeMetrics[size]
  useRegisterLabelText(field, children)

  useLayoutEffect(() => {
    setLabelPlacement(placement)
    return () => setLabelPlacement('above')
  }, [placement, setLabelPlacement])

  const height = placement === 'inside' ? insideHeight : boxHeight
  const scale = FLOATED_FONT_SIZE / fontSize
  const restY = height / 2 - BOX_BORDER_WIDTH - lineHeight / 2
  const floatY =
    placement === 'edge'
      ? -BOX_BORDER_WIDTH / 2 - lineHeight / 2
      : insidePadding + FLOATED_LINE_HEIGHT / 2 - BOX_BORDER_WIDTH - lineHeight / 2

  const labelStyle = useAnimatedStyle(() => {
    const p = progress.value
    const restX = inputX.value - BOX_BORDER_WIDTH - LABEL_PADDING
    const floatX = (placement === 'edge' ? EDGE_FLOAT_X : contentX.value - LABEL_PADDING) - BOX_BORDER_WIDTH

    return {
      transform: [
        { translateX: restX + (floatX - restX) * p },
        { translateY: restY + (floatY - restY) * p },
        { scale: 1 + (scale - 1) * p },
      ],
    }
  })

  const maskStyle = useAnimatedStyle(() => ({ opacity: progress.value }))

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={[styles.floating, { height: lineHeight }, labelStyle, style]}
      testID={testID}
    >
      {placement === 'edge' ? (
        <Animated.View
          style={[styles.mask, { backgroundColor: fill }, maskStyle]}
          testID={testID ? `${testID}-mask` : undefined}
        />
      ) : null}
      <Text
        numberOfLines={1}
        style={[
          styles.text,
          {
            color: fieldTextColor(field, floated ? fieldColors.textDefaultBody : fieldColors.textDefaultPlaceholder),
            fontSize,
            letterSpacing,
            lineHeight,
          },
        ]}
      >
        <LabelContent optional={optional} required={required}>
          {children}
        </LabelContent>
      </Text>
    </Animated.View>
  )
}

export const FieldLabel: FC<FieldLabelProps> = ({ placement = 'above', ...props }) =>
  placement === 'above' ? <AboveLabel {...props} /> : <FloatingLabel {...props} placement={placement} />
