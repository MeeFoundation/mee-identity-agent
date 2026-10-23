import { createContext, type MutableRefObject, type RefObject, useContext, useMemo, useState } from 'react'
import type { TextInputInstance } from 'react-native'
import type { SharedValue } from 'react-native-reanimated'

export type FieldSize = 'S' | 'M' | 'L'
export type LabelPlacement = 'above' | 'edge' | 'inside'

export const sizeMetrics = {
  L: {
    boxHeight: 44,
    fontSize: 16,
    insideHeight: 56,
    insidePadding: 8,
    labelGap: 8,
    letterSpacing: 0.08,
    lineHeight: 24,
  },
  M: {
    boxHeight: 36,
    fontSize: 14,
    insideHeight: 48,
    insidePadding: 6,
    labelGap: 6,
    letterSpacing: 0.07,
    lineHeight: 20,
  },
  S: {
    boxHeight: 30,
    fontSize: 12,
    insideHeight: 40,
    insidePadding: 4,
    labelGap: 2,
    letterSpacing: 0.06,
    lineHeight: 16,
  },
}

export const FLOATED_FONT_SIZE = 12
export const FLOATED_LINE_HEIGHT = 16
export const BOX_BORDER_WIDTH = 1
export const BOX_PADDING_HORIZONTAL = 11
export const ADDON_GAP = 8
export const DEFAULT_CONTENT_X = BOX_BORDER_WIDTH + BOX_PADDING_HORIZONTAL

export const fieldColors = {
  alphaOutlineBrand: '#4F868E66',
  alphaOutlineError: '#EF444466',
  strokeBrandSolid: '#3B5B63',
  strokeErrorSolid: '#B91C1C',
  strokeGrayAccent: '#CBD5E1',
  surfaceDefaultMain: '#FFFFFF',
  surfaceGrayLight: '#F1F5F9',
  textDefaultBody: '#1E293B',
  textDefaultDisabled: '#94A3B8',
  textDefaultPlaceholder: '#64748B',
  textDefaultSubtle: '#475569',
  textErrorSolid: '#B91C1C',
}

export const alertIconSizeFor = (size: FieldSize): number => (size === 'L' ? 20 : 14)

export type FieldState = {
  disabled: boolean
  errorText: string | undefined
  filled: boolean
  focused: boolean
  invalid: boolean
  labelText: string | undefined
  setErrorText: (value: string | undefined) => void
  setFilled: (value: boolean) => void
  setFocused: (value: boolean) => void
  setLabelText: (value: string | undefined) => void
  size: FieldSize
}

export type InputGroupState = {
  contentX: SharedValue<number>
  field: FieldState
  fill: string
  floated: boolean
  inputRef: RefObject<TextInputInstance | null>
  inputX: SharedValue<number>
  labelPlacement: LabelPlacement
  progress: SharedValue<number>
  setLabelPlacement: (placement: LabelPlacement) => void
  size: FieldSize
  skipAnimation: MutableRefObject<boolean>
}

export const FieldContext = createContext<FieldState | null>(null)
export const InputGroupContext = createContext<InputGroupState | null>(null)

type FieldStateOptions = { disabled: boolean; invalid: boolean; size: FieldSize }

export const useFieldStateValue = ({ disabled, invalid, size }: FieldStateOptions): FieldState => {
  const [focused, setFocused] = useState(false)
  const [filled, setFilled] = useState(false)
  const [labelText, setLabelText] = useState<string | undefined>(undefined)
  const [errorText, setErrorText] = useState<string | undefined>(undefined)

  return useMemo(
    () => ({
      disabled,
      errorText,
      filled,
      focused: focused && !disabled,
      invalid,
      labelText,
      setErrorText,
      setFilled,
      setFocused,
      setLabelText,
      size,
    }),
    [disabled, errorText, filled, focused, invalid, labelText, size],
  )
}

export const fieldTextColor = (field: FieldState | null, base: string): string => {
  if (field?.invalid) return fieldColors.textErrorSolid
  if (field?.disabled) return fieldColors.textDefaultDisabled
  return base
}

export const useInputGroup = (): InputGroupState | null => useContext(InputGroupContext)

export const useFieldState = (): FieldState | null => {
  const group = useContext(InputGroupContext)
  const field = useContext(FieldContext)
  return group?.field ?? field
}

export const useRequiredInputGroup = (part: string): InputGroupState => {
  const group = useContext(InputGroupContext)
  if (!group) throw new Error(`${part} must be placed inside an InputGroup`)
  return group
}
