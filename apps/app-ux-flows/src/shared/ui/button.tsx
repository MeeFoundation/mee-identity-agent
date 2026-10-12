import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/cn'

import { Button as ButtonPrimitive } from './primitives/button'

const buttonVariants = cva('', {
  compoundVariants: [
    {
      className:
        'border-brand-500 bg-linear-101/srgb from-brand-700 to-brand-500 text-white hover:border-brand-800 hover:bg-brand-800 hover:bg-none focus-visible:border-brand-800 focus-visible:bg-brand-700 focus-visible:bg-none disabled:border-brand-700 disabled:bg-brand-700 disabled:bg-none',
      tone: 'primary',
      variant: 'filled',
    },
    {
      className:
        'border-brand-300 bg-brand-50 text-brand-700 hover:bg-brand-100 hover:text-brand-800 focus-visible:border-brand-500',
      tone: 'secondary',
      variant: 'filled',
    },
    {
      className:
        'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-800 focus-visible:border-gray-500',
      tone: 'tertiary',
      variant: 'filled',
    },
    {
      className:
        'border-error-700 bg-error-700 text-white hover:border-error-800 hover:bg-error-800 focus-visible:border-error-800',
      tone: 'danger',
      variant: 'filled',
    },
    {
      className:
        'border-brand-700 text-brand-700 hover:border-brand-800 hover:bg-brand-50 hover:text-brand-800 focus-visible:border-brand-800',
      tone: 'primary',
      variant: 'outlined',
    },
    {
      className:
        'border-brand-300 text-brand-700 hover:bg-brand-50 hover:text-brand-800 focus-visible:border-brand-500',
      tone: 'secondary',
      variant: 'outlined',
    },
    {
      className: 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-800 focus-visible:border-gray-500',
      tone: 'tertiary',
      variant: 'outlined',
    },
    {
      className:
        'border-error-700 text-error-700 hover:border-error-800 hover:bg-error-50 hover:text-error-800 focus-visible:border-error-800',
      tone: 'danger',
      variant: 'outlined',
    },
    { className: 'text-brand-700 hover:text-brand-800', tone: 'primary', variant: 'link' },
    { className: 'text-brand-700 hover:text-brand-800', tone: 'secondary', variant: 'link' },
    { className: 'text-gray-700 hover:text-gray-800', tone: 'tertiary', variant: 'link' },
    { className: 'text-error-700 hover:text-error-800', tone: 'danger', variant: 'link' },
    { className: 'px-[10px]', size: 's', variant: 'link' },
    { className: 'px-3', size: 'm', variant: 'link' },
    { className: 'px-3.5', size: 'l', variant: 'link' },
    { className: 'px-3.5', size: 'xxl', variant: 'link' },
  ],
  defaultVariants: {
    size: 'm',
    tone: 'primary',
    variant: 'filled',
  },
  variants: {
    size: {
      l: 'h-11 rounded-xl px-[26px] text-base',
      m: 'h-9 rounded-xl px-[22px] text-sm',
      s: 'h-[30px] rounded-xl px-[18px] text-xs',
      xxl: 'h-14 rounded-2xl px-[34px] text-xl',
    },
    tone: {
      danger: 'focus-visible:ring-error-500/40',
      primary: 'focus-visible:ring-brand-500/40',
      secondary: 'focus-visible:ring-brand-500/40',
      tertiary: 'focus-visible:ring-gray-500/40',
    },
    variant: {
      filled: '',
      link: 'border-transparent',
      outlined: 'bg-transparent',
    },
  },
})

type ButtonProps = VariantProps<typeof buttonVariants> & {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  className?: string
  title?: string
  'aria-describedby'?: string
}

export const Button = ({
  children,
  onClick,
  disabled = false,
  size,
  variant,
  tone,
  className,
  title,
  'aria-describedby': ariaDescribedBy,
}: ButtonProps) => (
  <ButtonPrimitive
    aria-describedby={ariaDescribedBy}
    className={cn(buttonVariants({ size, tone, variant }), className)}
    disabled={disabled}
    onClick={onClick}
    title={title}
    type="button"
  >
    {children}
  </ButtonPrimitive>
)
