import { ChatSquareHeart, House, type Icon, List } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/lib/cn'

type AppTab = 'home' | 'telli' | 'navigation'

type AppTabBarProps = {
  active: AppTab
  onSelect: (tab: AppTab) => void
}

const tabs: readonly { tab: AppTab; icon: Icon; labelKey: string }[] = [
  { icon: House, labelKey: 'ui.appTabBar.home', tab: 'home' },
  { icon: ChatSquareHeart, labelKey: 'ui.appTabBar.telli', tab: 'telli' },
  { icon: List, labelKey: 'ui.appTabBar.navigation', tab: 'navigation' },
]

// After the Figma `bottom-menu`: a rounded bar pinned above the home indicator.
export const AppTabBar = ({ active, onSelect }: AppTabBarProps) => {
  const { t } = useTranslation()

  return (
    <nav
      aria-label={t('ui.appTabBar.label')}
      className="shrink-0 rounded-t-3xl border-gray-950/5 border-t bg-white px-5 pt-2 pb-[calc(0.5rem+var(--home-indicator-h))] shadow-sheet"
    >
      <ul className="grid grid-cols-3">
        {tabs.map(({ tab, icon: TabIcon, labelKey }) => {
          const isActive = tab === active
          return (
            <li className="flex justify-center" key={tab}>
              <button
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex cursor-pointer flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-xs outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring',
                  isActive ? 'text-brand-500' : 'text-gray-700 hover:text-gray-900',
                )}
                onClick={() => onSelect(tab)}
                type="button"
              >
                <TabIcon aria-hidden size={22} />
                {t(labelKey)}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
