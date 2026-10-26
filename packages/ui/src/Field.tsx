import { type FC, type ReactNode, useLayoutEffect } from 'react'
import { type StyleProp, StyleSheet, Text, type TextStyle, View, type ViewStyle } from 'react-native'

import {
  FieldContext,
  type FieldSize,
  fieldColors,
  fieldTextColor,
  useFieldState,
  useFieldStateValue,
} from './fieldContext'

export type { FieldSize } from './fieldContext'

export type FieldProps = {
  children?: ReactNode
  disabled?: boolean
  invalid?: boolean
  size?: FieldSize
  style?: StyleProp<ViewStyle>
  testID?: string
}

type FieldTextProps = {
  children?: ReactNode
  style?: StyleProp<TextStyle>
  testID?: string
}

const styles = StyleSheet.create({
  counter: {
    flexShrink: 0,
    textAlign: 'right',
  },
  description: {
    flex: 1,
    minWidth: 1,
  },
  field: {
    alignSelf: 'stretch',
    gap: 2,
  },
  footer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  text: {
    fontFamily: 'PublicSans_400Regular',
    fontSize: 12,
    letterSpacing: 0.06,
    lineHeight: 16,
  },
})

export const Field: FC<FieldProps> = ({ children, disabled = false, invalid = false, size = 'M', style, testID }) => {
  const state = useFieldStateValue({ disabled, invalid, size })

  return (
    <FieldContext.Provider value={state}>
      <View style={[styles.field, style]} testID={testID}>
        {children}
      </View>
    </FieldContext.Provider>
  )
}

const useHelperColor = () => fieldTextColor(useFieldState(), fieldColors.textDefaultSubtle)

export const FieldFooter: FC<{ children?: ReactNode; style?: StyleProp<ViewStyle>; testID?: string }> = ({
  children,
  style,
  testID,
}) => (
  <View style={[styles.footer, style]} testID={testID}>
    {children}
  </View>
)

export const FieldDescription: FC<FieldTextProps> = ({ children, style, testID }) => {
  const color = useHelperColor()

  return (
    <Text style={[styles.text, styles.description, { color }, style]} testID={testID}>
      {children}
    </Text>
  )
}

export const FieldCounter: FC<FieldTextProps> = ({ children, style, testID }) => {
  const color = useHelperColor()

  return (
    <Text style={[styles.text, styles.counter, { color }, style]} testID={testID}>
      {children}
    </Text>
  )
}

export const FieldError: FC<FieldTextProps> = ({ children, style, testID }) => {
  const field = useFieldState()
  const setErrorText = field?.setErrorText
  const invalid = field?.invalid ?? false
  const text = typeof children === 'string' && invalid ? children : undefined

  useLayoutEffect(() => {
    setErrorText?.(text)
    return () => setErrorText?.(undefined)
  }, [setErrorText, text])

  if (!invalid) return null

  return (
    <Text
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[styles.text, { color: fieldColors.textErrorSolid }, style]}
      testID={testID}
    >
      {children}
    </Text>
  )
}
