import { type ElementRef, type FC, useRef, useState } from 'react'
import {
  type TextInput as RNTextInput,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import type { SvgProps } from 'react-native-svg'

import { colors } from '@/shared/config'

const LINE_HEIGHT = 20
const PADDING_VERTICAL = 12

type ActionButton = {
  Icon: React.FunctionComponent<SvgProps>
  onPress: () => void
}

type MultilineTextFieldProps = {
  value: string | undefined
  onChangeText: (text: string) => void
  numberOfLines: number
  placeholder?: string
  onFocus?: () => void
  onBlur?: () => void
  action?: ActionButton
  disabled?: boolean
  propsStyles?: { container?: StyleProp<ViewStyle>; input?: StyleProp<TextStyle> }
}

export const MultilineTextField: FC<MultilineTextFieldProps> = ({
  value,
  onChangeText,
  numberOfLines,
  placeholder,
  onFocus,
  onBlur,
  action,
  disabled,
  propsStyles,
}) => {
  const inputRef = useRef<ElementRef<typeof RNTextInput>>(null)
  const [isFocused, setIsFocused] = useState(false)

  const focusHandler = () => {
    onFocus?.()
    inputRef.current?.focus()
    setIsFocused(true)
  }

  const blurHandler = () => {
    onBlur?.()
    inputRef.current?.blur()
    setIsFocused(false)
  }

  return (
    <View style={[styles.container, isFocused && styles.containerFocused, propsStyles?.container]}>
      <TextInput
        editable={!disabled}
        multiline
        numberOfLines={numberOfLines}
        onBlur={blurHandler}
        onChangeText={onChangeText}
        onFocus={focusHandler}
        placeholder={placeholder}
        placeholderTextColor={colors['gray-400']}
        ref={inputRef as never}
        style={
          [
            styles.input,
            { height: LINE_HEIGHT * numberOfLines + PADDING_VERTICAL * 2 },
            propsStyles?.input,
          ] satisfies StyleProp<TextStyle>
        }
        textAlignVertical="top"
        value={value}
      />
      {action && (
        <TouchableOpacity onPress={action.onPress} style={styles.actionButton}>
          <action.Icon color={colors.primary} height={20} width={20} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    marginLeft: 8,
    padding: 6,
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors['gray-200'],
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  containerFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  input: {
    color: colors['gray-800'],
    flex: 1,
    fontSize: 16,
    lineHeight: LINE_HEIGHT,
    paddingVertical: PADDING_VERTICAL,
    textAlignVertical: 'top',
  },
})
