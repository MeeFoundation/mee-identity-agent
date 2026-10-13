import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

export const Label = ({ className, ...props }: ComponentProps<'label'>) => (
  // biome-ignore lint/a11y/noLabelWithoutControl: callers associate the control through htmlFor or nesting
  <label className={cn('select-none text-foreground text-sm', className)} data-slot="label" {...props} />
)
