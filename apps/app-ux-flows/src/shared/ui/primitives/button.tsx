import { Button as ButtonPrimitive } from '@base-ui/react/button'

import { cn } from '@/shared/lib/cn'

export const Button = ({ className, ...props }: ButtonPrimitive.Props) => (
  <ButtonPrimitive
    className={cn(
      'inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap border font-semibold outline-none transition-colors focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-60',
      className,
    )}
    data-slot="button"
    {...props}
  />
)
