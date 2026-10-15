import { useTranslation } from 'react-i18next'

import searchIcon from './icons/search.svg'
import shieldLockIcon from './icons/shield-lock.svg'

type HomeTopBarProps = {
  greeting: string
  initial: string
  onSearchSelect?: () => void
}

// After the Figma `home-topbar`. The search field is a stand-in: it takes no text and only reports activation.
export const HomeTopBar = ({ greeting, initial, onSearchSelect }: HomeTopBarProps) => {
  const { t } = useTranslation()

  return (
    <header className="rounded-3xl border-white border-b bg-linear-to-b from-brand-100 to-white pt-(--status-bar-h) drop-shadow-topbar">
      <div className="flex flex-col gap-5 px-5 pt-2.5 pb-5">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-white bg-gray-100 font-bold text-gray-500 text-lg shadow-tab"
          >
            {initial}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h1 className="font-semibold text-gray-900 text-xl">{greeting}</h1>
            <p className="flex items-center gap-1 text-gray-600 text-xs">
              <img alt="" aria-hidden className="shrink-0" height={14} src={shieldLockIcon} width={14} />
              {t('ui.homeTopBar.sharing')}
            </p>
          </div>
        </div>
        <button
          className="flex h-11 w-full cursor-pointer items-center gap-2 rounded-xl border border-gray-300 bg-white p-3 text-left text-base text-gray-500 outline-none focus-visible:ring-3 focus-visible:ring-ring"
          onClick={onSearchSelect}
          type="button"
        >
          <img alt="" aria-hidden className="shrink-0" height={20} src={searchIcon} width={20} />
          <span className="truncate">{t('ui.homeTopBar.search')}</span>
        </button>
      </div>
    </header>
  )
}
