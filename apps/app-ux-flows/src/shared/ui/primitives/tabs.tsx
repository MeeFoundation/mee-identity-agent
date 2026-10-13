import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'

import { cn } from '@/shared/lib/cn'

export const Tabs = ({ className, ...props }: TabsPrimitive.Root.Props) => (
  <TabsPrimitive.Root className={cn('flex flex-col', className)} data-slot="tabs" {...props} />
)

export const TabsList = ({ className, ...props }: TabsPrimitive.List.Props) => (
  <TabsPrimitive.List className={cn('flex items-center', className)} data-slot="tabs-list" {...props} />
)

export const TabsTab = ({ className, ...props }: TabsPrimitive.Tab.Props) => (
  <TabsPrimitive.Tab
    className={cn(
      'flex flex-1 cursor-pointer select-none items-center justify-center outline-none focus-visible:ring-3 focus-visible:ring-ring',
      className,
    )}
    data-slot="tabs-tab"
    {...props}
  />
)
