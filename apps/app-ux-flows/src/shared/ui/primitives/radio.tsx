import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'

import { cn } from '@/shared/lib/cn'

export const RadioGroup = <Value,>({ className, ...props }: RadioGroupPrimitive.Props<Value>) => (
  <RadioGroupPrimitive<Value> className={cn('flex flex-col', className)} data-slot="radio-group" {...props} />
)

export const Radio = ({ className, ...props }: RadioPrimitive.Root.Props) => (
  <RadioPrimitive.Root
    className={cn(
      'flex size-5 shrink-0 items-center justify-center rounded-full border border-gray-400 bg-white outline-none transition-colors hover:border-gray-500 focus-visible:ring-3 focus-visible:ring-gray-500/40 data-disabled:pointer-events-none data-checked:border-brand-700 data-disabled:opacity-35 data-checked:focus-visible:border-brand-900 data-checked:focus-visible:ring-ring data-checked:hover:border-brand-800',
      className,
    )}
    data-slot="radio"
    {...props}
  >
    <RadioPrimitive.Indicator className="size-2.5 rounded-full bg-brand-700" data-slot="radio-indicator" />
  </RadioPrimitive.Root>
)
