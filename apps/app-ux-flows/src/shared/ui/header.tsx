import { ChevronLeftIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type HeaderProps = {
  title: string
  onBack?: () => void
}

export const Header = ({ title, onBack }: HeaderProps) => {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-10 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-b-[14px] bg-white/80 pr-3 pb-2.5 shadow-[0_2px_16px_0_rgb(2_6_23/0.07)] backdrop-blur-[5px]">
      <div className="flex items-center">
        {onBack && (
          <button
            aria-label={t('ui.header.back')}
            className="flex size-11 items-center justify-center rounded-xl text-gray-900 outline-none hover:bg-gray-100 focus-visible:ring-3 focus-visible:ring-ring"
            onClick={onBack}
            type="button"
          >
            <ChevronLeftIcon aria-hidden className="size-6" strokeWidth={1.5} />
          </button>
        )}
      </div>
      <h1 className="min-h-11 content-center text-center font-semibold text-gray-900 text-lg">{title}</h1>
    </header>
  )
}
