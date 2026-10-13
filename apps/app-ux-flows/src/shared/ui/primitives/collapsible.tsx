import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible'

import { cn } from '@/shared/lib/cn'

export const Collapsible = CollapsiblePrimitive.Root

export const CollapsibleTrigger = ({ className, ...props }: CollapsiblePrimitive.Trigger.Props) => (
  <CollapsiblePrimitive.Trigger
    className={cn('cursor-pointer outline-none focus-visible:ring-3 focus-visible:ring-ring', className)}
    data-slot="collapsible-trigger"
    {...props}
  />
)

export const CollapsiblePanel = ({ className, ...props }: CollapsiblePrimitive.Panel.Props) => (
  <CollapsiblePrimitive.Panel
    className={cn(
      'h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0',
      className,
    )}
    data-slot="collapsible-panel"
    {...props}
  />
)
