import { useTranslation } from 'react-i18next'

import { Tabs, TabsList, TabsTab } from './primitives/tabs'

type SegmentedTab<T extends string> = {
  value: T
  label: string
  // Marks something waiting on this tab.
  dot?: boolean
}

type SegmentedTabsProps<T extends string> = {
  value: NoInfer<T>
  items: readonly SegmentedTab<T>[]
  onSelect: (value: T) => void
}

export const SegmentedTabs = <T extends string>({ value, items, onSelect }: SegmentedTabsProps<T>) => {
  const { t } = useTranslation()

  return (
    <Tabs onValueChange={(next: T) => onSelect(next)} value={value}>
      <TabsList className="gap-px rounded-xl border border-gray-950/10 bg-gray-950/5 p-1 backdrop-blur-[15px]">
        {items.map((item) => (
          <TabsTab
            className="h-9 rounded-2lg border border-transparent px-3 py-2 font-semibold text-base text-gray-900 data-active:border-gray-950/10 data-active:bg-white data-active:shadow-tab"
            key={item.value}
            value={item.value}
          >
            {item.label}
            {item.dot && (
              <>
                <span aria-hidden className="ml-1.5 inline-block size-2 shrink-0 rounded-full bg-brand-600" />
                <span className="sr-only">{`, ${t('ui.segmentedTabs.dot')}`}</span>
              </>
            )}
          </TabsTab>
        ))}
      </TabsList>
    </Tabs>
  )
}
