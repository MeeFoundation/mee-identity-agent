import {
  type ComponentType,
  type FC,
  type ReactNode,
  type Ref,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  type LayoutChangeEvent,
  Pressable,
  type StyleProp,
  StyleSheet,
  Text,
  TextInput,
  type TextInputInstance,
  type TextInputProps,
  View,
  type ViewStyle,
} from 'react-native'
import Animated, { Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import {
  ADDON_GAP,
  alertIconSizeFor,
  BOX_BORDER_WIDTH,
  BOX_PADDING_HORIZONTAL,
  DEFAULT_CONTENT_X,
  FieldContext,
  type FieldSize,
  fieldColors,
  InputGroupContext,
  type InputGroupState,
  type LabelPlacement,
  sizeMetrics,
  useFieldStateValue,
  useRequiredInputGroup,
} from './fieldContext'
import { ExclamationCircleIcon } from './icons'

export type InputGroupProps = {
  children?: ReactNode
  size?: FieldSize
  style?: StyleProp<ViewStyle>
  testID?: string
}

export type InputGroupAddonProps = {
  align?: 'start' | 'end'
  children?: ReactNode
  style?: StyleProp<ViewStyle>
  testID?: string
}

export type InputGroupInputProps = Omit<TextInputProps, 'editable'> & {
  component?: ComponentType<TextInputProps>
  ref?: Ref<TextInputInstance>
}

const colors = fieldColors

const FLOATED_TEXT_SHIFT = 8
const FOCUS_RING_WIDTH = 3
const PREFIX_GAP = 2
const FLOAT_DURATION = 150

const floatTiming = {
  duration: FLOAT_DURATION,
  easing: Easing.out(Easing.cubic),
  reduceMotion: ReduceMotion.System,
}

const styles = StyleSheet.create({
  addon: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ADDON_GAP,
  },
  addonEnd: {
    marginLeft: ADDON_GAP,
  },
  addonStart: {
    marginRight: ADDON_GAP,
  },
  alert: {
    marginLeft: ADDON_GAP,
  },
  box: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 12,
    borderWidth: BOX_BORDER_WIDTH,
    flexDirection: 'row',
    paddingHorizontal: BOX_PADDING_HORIZONTAL,
  },
  input: {
    flex: 1,
    includeFontPadding: false,
    margin: 0,
    minWidth: 1,
    padding: 0,
    textAlignVertical: 'center',
  },
  inputHolder: {
    flex: 1,
    minWidth: 1,
  },
  text: {
    fontFamily: 'PublicSans_400Regular',
    paddingRight: PREFIX_GAP,
  },
})

const boxBorderColor = (focused: boolean, invalid: boolean) => {
  if (invalid) return colors.strokeErrorSolid
  if (focused) return colors.strokeBrandSolid
  return colors.strokeGrayAccent
}

export const InputGroup: FC<InputGroupProps> = ({ children, size, style, testID }) => {
  const parent = useContext(FieldContext)
  const resolvedSize = size ?? parent?.size ?? 'M'
  const local = useFieldStateValue({ disabled: false, invalid: false, size: resolvedSize })
  const base = parent ?? local
  const field = useMemo(
    () => (base.size === resolvedSize ? base : { ...base, size: resolvedSize }),
    [base, resolvedSize],
  )
  const [labelPlacement, setLabelPlacement] = useState<LabelPlacement>('above')
  const inputRef = useRef<TextInputInstance | null>(null)
  const skipAnimation = useRef(false)
  const progress = useSharedValue(0)
  const inputX = useSharedValue(DEFAULT_CONTENT_X)
  const contentX = useSharedValue(DEFAULT_CONTENT_X)

  const floated = field.focused || field.filled
  const fill = field.disabled ? colors.surfaceGrayLight : colors.surfaceDefaultMain
  const { boxHeight, insideHeight } = sizeMetrics[resolvedSize]

  useEffect(() => {
    if (floated && skipAnimation.current) {
      progress.value = 1
      skipAnimation.current = false
    } else {
      progress.value = withTiming(floated ? 1 : 0, floatTiming)
    }
  }, [floated, progress])

  const value = useMemo<InputGroupState>(
    () => ({
      contentX,
      field,
      fill,
      floated,
      inputRef,
      inputX,
      labelPlacement,
      progress,
      setLabelPlacement,
      size: resolvedSize,
      skipAnimation,
    }),
    [contentX, field, fill, floated, inputX, labelPlacement, progress, resolvedSize],
  )

  const ring = field.focused
    ? `0px 0px 0px ${FOCUS_RING_WIDTH}px ${field.invalid ? colors.alphaOutlineError : colors.alphaOutlineBrand}`
    : undefined

  return (
    <InputGroupContext.Provider value={value}>
      <Pressable
        accessible={false}
        disabled={field.disabled}
        onPress={() => inputRef.current?.focus()}
        style={[
          styles.box,
          {
            backgroundColor: fill,
            borderColor: boxBorderColor(field.focused, field.invalid),
            boxShadow: ring,
            height: labelPlacement === 'inside' ? insideHeight : boxHeight,
          },
          style,
        ]}
        testID={testID}
      >
        {children}
      </Pressable>
    </InputGroupContext.Provider>
  )
}

export const InputGroupAddon: FC<InputGroupAddonProps> = ({ align = 'start', children, style, testID }) => {
  const { contentX } = useRequiredInputGroup('InputGroupAddon')

  useLayoutEffect(() => {
    if (align !== 'start') return
    return () => {
      contentX.value = DEFAULT_CONTENT_X
    }
  }, [align, contentX])

  const handleLayout = (event: LayoutChangeEvent) => {
    if (align !== 'start') return
    const { width, x } = event.nativeEvent.layout
    contentX.value = x + width + ADDON_GAP
  }

  return (
    <View
      onLayout={handleLayout}
      style={[styles.addon, align === 'start' ? styles.addonStart : styles.addonEnd, style]}
      testID={testID}
    >
      {children}
    </View>
  )
}

export const InputGroupText: FC<{ children?: ReactNode; testID?: string }> = ({ children, testID }) => {
  const { field, size } = useRequiredInputGroup('InputGroupText')
  const { fontSize, letterSpacing, lineHeight } = sizeMetrics[size]

  return (
    <Text
      style={[
        styles.text,
        {
          color: field.disabled ? colors.textDefaultDisabled : colors.textDefaultPlaceholder,
          fontSize,
          letterSpacing,
          lineHeight,
        },
      ]}
      testID={testID}
    >
      {children}
    </Text>
  )
}

export const InputGroupInput: FC<InputGroupInputProps> = ({
  accessibilityHint,
  accessibilityLabel,
  component: Input = TextInput,
  defaultValue,
  onBlur,
  onChangeText,
  onFocus,
  placeholder,
  ref,
  style,
  value,
  ...rest
}) => {
  const { field, floated, inputRef, inputX, labelPlacement, progress, size, skipAnimation } =
    useRequiredInputGroup('InputGroupInput')
  const { fontSize, letterSpacing, lineHeight } = sizeMetrics[size]
  const [typed, setTyped] = useState(value ?? defaultValue ?? '')
  const filled = (value ?? typed).length > 0
  const initialised = useRef(false)
  const { setFilled, setFocused } = field

  useLayoutEffect(() => {
    if (!initialised.current) {
      initialised.current = true
      if (filled) skipAnimation.current = true
    }
    setFilled(filled)
  }, [filled, setFilled, skipAnimation])

  useLayoutEffect(() => () => setFilled(false), [setFilled])

  useEffect(() => {
    if (value !== undefined) setTyped(value)
  }, [value])

  const consumerRef = useRef(ref)
  consumerRef.current = ref

  const setRef = useCallback(
    (node: TextInputInstance | null) => {
      if (node) {
        const clear = node.clear.bind(node)
        const setNativeProps = node.setNativeProps.bind(node)
        node.clear = () => {
          clear()
          setTyped('')
        }
        node.setNativeProps = (props: { text?: string }) => {
          setNativeProps(props)
          if (typeof props.text === 'string') setTyped(props.text)
        }
      }
      inputRef.current = node
      const current = consumerRef.current
      if (typeof current === 'function') current(node)
      else if (current) current.current = node
    },
    [inputRef],
  )

  const shiftStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: labelPlacement === 'inside' ? progress.value * FLOATED_TEXT_SHIFT : 0 }],
  }))

  const hidePlaceholder = labelPlacement !== 'above' && !floated
  const disabledOrBody = field.disabled ? colors.textDefaultDisabled : colors.textDefaultBody
  const placeholderColor = field.disabled ? colors.textDefaultDisabled : colors.textDefaultPlaceholder

  return (
    <>
      <Animated.View
        onLayout={(event) => {
          inputX.value = event.nativeEvent.layout.x
        }}
        style={[styles.inputHolder, shiftStyle]}
      >
        <Input
          {...rest}
          accessibilityHint={accessibilityHint ?? (field.invalid ? field.errorText : undefined)}
          accessibilityLabel={accessibilityLabel ?? field.labelText}
          aria-disabled={field.disabled}
          defaultValue={value === undefined ? defaultValue : undefined}
          editable={!field.disabled}
          onBlur={(event) => {
            setFocused(false)
            onBlur?.(event)
          }}
          onChangeText={(text) => {
            setTyped(text)
            onChangeText?.(text)
          }}
          onFocus={(event) => {
            setFocused(true)
            onFocus?.(event)
          }}
          placeholder={hidePlaceholder ? undefined : placeholder}
          placeholderTextColor={placeholderColor}
          {...{ ref: setRef }}
          style={[
            styles.input,
            {
              color: disabledOrBody,
              fontFamily: 'PublicSans_400Regular',
              fontSize,
              height: lineHeight,
              letterSpacing,
            },
            style,
          ]}
          value={value}
        />
      </Animated.View>
      {field.invalid ? (
        <View style={styles.alert}>
          <ExclamationCircleIcon size={alertIconSizeFor(size)} />
        </View>
      ) : null}
    </>
  )
}
