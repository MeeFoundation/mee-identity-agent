import { Select as SelectPrimitive } from '@base-ui/react/select'

import { cn } from '@/shared/lib/cn'

export const Select = SelectPrimitive.Root

export const SelectPortal = SelectPrimitive.Portal

export const SelectValue = SelectPrimitive.Value

export const SelectLabel = ({ className, ...props }: SelectPrimitive.Label.Props) => (
  <SelectPrimitive.Label className={className} data-slot="select-label" {...props} />
)

export const SelectTrigger = ({ className, ...props }: SelectPrimitive.Trigger.Props) => (
  <SelectPrimitive.Trigger
    className={cn(
      'flex w-full cursor-pointer select-none items-center gap-2 rounded-xl border border-input bg-white text-left text-foreground outline-none transition-[color,box-shadow,border-color] focus-visible:border-brand-700 focus-visible:ring-3 focus-visible:ring-ring data-popup-open:border-brand-700',
      className,
    )}
    data-slot="select-trigger"
    {...props}
  />
)

export const SelectIcon = ({ className, ...props }: SelectPrimitive.Icon.Props) => (
  <SelectPrimitive.Icon className={cn('flex shrink-0', className)} data-slot="select-icon" {...props} />
)

export const SelectPositioner = ({ className, ...props }: SelectPrimitive.Positioner.Props) => (
  <SelectPrimitive.Positioner
    className={cn('pointer-events-auto z-50 outline-none', className)}
    data-slot="select-positioner"
    {...props}
  />
)

export const SelectPopup = ({ className, ...props }: SelectPrimitive.Popup.Props) => (
  <SelectPrimitive.Popup
    className={cn(
      'max-h-(--available-height) min-w-(--anchor-width) overflow-y-auto rounded-xl bg-white p-1 shadow-card outline-none transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0',
      className,
    )}
    data-slot="select-popup"
    {...props}
  />
)

export const SelectItem = ({ className, ...props }: SelectPrimitive.Item.Props) => (
  <SelectPrimitive.Item
    className={cn(
      'flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-base text-gray-800 outline-none data-disabled:cursor-not-allowed data-highlighted:bg-gray-100 data-selected:font-medium data-disabled:text-gray-400',
      className,
    )}
    data-slot="select-item"
    {...props}
  />
)

export const SelectItemText = SelectPrimitive.ItemText
