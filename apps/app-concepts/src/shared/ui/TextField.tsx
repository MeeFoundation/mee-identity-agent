import { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { type ComponentProps, type ElementRef, type FC, useRef, useState } from 'react'
import {
  Animated,
  type TextInput as RNTextInput,
  type StyleProp,
  StyleSheet,
  Text,
  type TextStyle,
  TouchableOpacity,
  useAnimatedValue,
  View,
  type ViewStyle,
} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import type { SvgProps } from 'react-native-svg'

import { colors } from '@/shared/config'

export type InputSize = 'md' | 'lg'

export type TextFieldProps = {
  value: string | undefined
  onChangeText: (text: string) => void
  label?: string
  size?: InputSize
  placeholder?: string
  onFocus?: () => void
  onBlur?: () => void
  RightIcon?: React.FunctionComponent<SvgProps>
  RightIconActive?: React.FunctionComponent<SvgProps>
  errorText?: string
  disabled?: boolean
  isBottomSheetTextInput?: boolean
  isLabelInside?: boolean
  propsStyles?: { container?: StyleProp<ViewStyle>; input?: StyleProp<TextStyle> }
} & ComponentProps<typeof TextInput>

export const TextField: FC<TextFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  propsStyles,
  onFocus,
  onBlur,
  RightIcon,
  RightIconActive,
  size = 'lg',
  errorText,
  disabled,
  isBottomSheetTextInput,
  isLabelInside,
}) => {
  const inputRef = useRef<ElementRef<typeof RNTextInput>>(null)
  const [isFocused, setIsFocused] = useState(false)
  const insideLabelTranslateYValue = useAnimatedValue(value ? 0 : 9)

  const getInputHeight = (sz: InputSize) => {
    if (isLabelInside) {
      return
    }
    if (sz === 'md') {
      return { height: 44 }
    }
    return { height: 50 }
  }
  const getInputIconSize = (sz: InputSize) => {
    if (sz === 'md') {
      return { bottom: 9, right: 16 }
    }
    return { bottom: 13, right: 16 }
  }

  const inputStyle = [
    ...(isFocused ? [textFieldStyles.input, textFieldStyles.inputFocus] : [textFieldStyles.input]),
    getInputHeight(size),
  ]

  const iconStyle = [textFieldStyles.inputIcon, getInputIconSize(size)]

  const focusHandler = () => {
    onFocus?.()
    inputRef.current?.focus()
    setIsFocused(true)

    if (isLabelInside && !value) {
      Animated.timing(insideLabelTranslateYValue, {
        duration: 150,
        toValue: 0,
        useNativeDriver: true,
      }).start()
    }
  }

  const blurHandler = () => {
    onBlur?.()
    inputRef.current?.blur()
    setIsFocused(false)

    if (isLabelInside && !value) {
      Animated.timing(insideLabelTranslateYValue, {
        duration: 150,
        toValue: 9,
        useNativeDriver: true,
      }).start()
    }
  }

  const clearHandler = () => {
    onChangeText('')
  }

  const inputProps = {
    editable: !disabled,
    onBlur: blurHandler,
    onChangeText: onChangeText,
    onFocus: focusHandler,
    onSubmitEditing: blurHandler,
    placeholder: placeholder,
    placeholderTextColor: colors['gray-400'],
    // gesture-handler/bottom-sheet inputs type their ref loosely; at runtime it is the native TextInput instance
    ref: inputRef as never,
    style: [
      inputStyle,
      errorText && textFieldStyles.errorBorder,
      propsStyles?.input,
      isLabelInside && textFieldStyles.labelInsideInput,
      isLabelInside && errorText && { paddingBottom: 22 },
    ] satisfies StyleProp<TextStyle>,
    value: value,
  }

  return (
    <View style={[textFieldStyles.container, propsStyles?.container]}>
      {label && (
        <Animated.Text
          style={[
            textFieldStyles.label,
            isLabelInside && textFieldStyles.labelInsideLabel,
            isLabelInside && {
              transform: [
                {
                  scale: insideLabelTranslateYValue.interpolate({
                    inputRange: [0, 9],
                    outputRange: [1, 1.25],
                  }),
                },
                { translateY: insideLabelTranslateYValue },
              ],
            },
          ]}
        >
          {label}
        </Animated.Text>
      )}
      {isBottomSheetTextInput ? <BottomSheetTextInput {...inputProps} /> : <TextInput {...inputProps} />}
      {errorText && (
        <Text style={[textFieldStyles.errorText, isLabelInside && textFieldStyles.labelInsideError]}>{errorText}</Text>
      )}
      {RightIconActive && inputRef.current?.isFocused() && (
        <TouchableOpacity onPress={clearHandler}>
          <RightIconActive color={'black'} height={24} style={iconStyle} width={24} />
        </TouchableOpacity>
      )}
      {}
      {RightIcon && ((RightIconActive && !inputRef.current?.isFocused()) || !RightIconActive) && (
        <TouchableOpacity onPress={focusHandler}>
          <RightIcon
            color={inputRef.current?.isFocused() ? 'black' : colors['gray-400']}
            height={24}
            style={iconStyle}
            width={24}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

export const textFieldStyles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  errorBorder: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    marginTop: 2,
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors['gray-200'],
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    justifyContent: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  inputFocus: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  inputIcon: {
    position: 'absolute',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },
  label: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    marginBottom: 2,
  },
  labelInsideError: {
    bottom: 8,
    left: 16,
    position: 'absolute',
  },
  labelInsideInput: {
    fontWeight: '500',
    paddingBottom: 6,
    paddingTop: 24,
  },
  labelInsideLabel: {
    color: colors['gray-800'],
    left: 16,
    position: 'absolute',
    top: 8,
    zIndex: 10,
  },
})
