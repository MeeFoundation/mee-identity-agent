import type { FC, ReactNode } from 'react'
import { Pressable, type PressableProps, StyleSheet, Text } from 'react-native'

export type ButtonVariant = 'primary' | 'secondary' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
} & Omit<PressableProps, 'children'>

const colors = {
  danger: '#EF4444',
  dangerText: '#FFFFFF',
  primary: '#4F868E',
  primaryText: '#FFFFFF',
  secondaryBorder: '#4F868E',
  secondaryText: '#4F868E',
}

const sizeStyles = {
  lg: { fontSize: 18, paddingHorizontal: 32, paddingVertical: 16 },
  md: { fontSize: 16, paddingHorizontal: 24, paddingVertical: 12 },
  sm: { fontSize: 14, paddingHorizontal: 16, paddingVertical: 8 },
}

const variantStyles = {
  danger: StyleSheet.create({
    container: { backgroundColor: colors.danger },
    text: { color: colors.dangerText },
  }),
  primary: StyleSheet.create({
    container: { backgroundColor: colors.primary },
    text: { color: colors.primaryText },
  }),
  secondary: StyleSheet.create({
    container: { backgroundColor: 'transparent', borderColor: colors.secondaryBorder, borderWidth: 1.5 },
    text: { color: colors.secondaryText },
  }),
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
})

export const Button: FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', disabled, style, ...rest }) => {
  const { fontSize, paddingHorizontal, paddingVertical } = sizeStyles[size]

  return (
    <Pressable
      disabled={disabled}
      style={(state) => [
        styles.container,
        variantStyles[variant].container,
        { paddingHorizontal, paddingVertical },
        { opacity: disabled ? 0.5 : state.pressed ? 0.8 : 1 },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    >
      <Text style={[styles.text, variantStyles[variant].text, { fontSize }]}>{children}</Text>
    </Pressable>
  )
}
