import { Input as InputPrimitive } from '@base-ui/react/input'
import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

export const Input = ({ className, ...props }: ComponentProps<'input'>) => (
  <InputPrimitive
    className={cn(
      'h-9 w-full min-w-0 rounded-xl border border-input bg-white px-3 text-foreground text-sm caret-brand-700 outline-none transition-[color,box-shadow,border-color] placeholder:text-gray-500 focus-visible:border-brand-700 focus-visible:ring-3 focus-visible:ring-ring disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400',
      className,
    )}
    data-slot="input"
    {...props}
  />
)
