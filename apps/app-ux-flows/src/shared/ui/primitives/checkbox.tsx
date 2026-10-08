import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'
import { CheckIcon } from 'lucide-react'

import { cn } from '@/shared/lib/cn'

export const Checkbox = ({ className, ...props }: CheckboxPrimitive.Root.Props) => (
  <CheckboxPrimitive.Root
    className={cn(
      'flex size-5 shrink-0 items-center justify-center rounded-[4px] border border-gray-400 bg-white text-white outline-none transition-colors hover:border-gray-500 focus-visible:ring-3 focus-visible:ring-gray-500/40 data-disabled:pointer-events-none data-checked:border-brand-800 data-checked:bg-brand-700 data-disabled:opacity-35 data-checked:focus-visible:border-brand-900 data-checked:focus-visible:ring-ring data-checked:hover:border-brand-900 data-checked:hover:bg-brand-800',
      className,
    )}
    data-slot="checkbox"
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex" data-slot="checkbox-indicator">
      <CheckIcon className="size-4" strokeWidth={2.5} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
)
