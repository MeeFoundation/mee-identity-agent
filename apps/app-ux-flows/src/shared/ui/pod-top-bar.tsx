import { Fragment, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, type Icon, ThreeDotsVertical } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

// A pod without a photo shows the first letter of its name instead.
type PodAvatar = { src: string } | { letter: string }

type PodTopBarProps = {
  title: string
  avatar: PodAvatar
  breadcrumb: readonly string[]
  breadcrumbIcon?: Icon
  // Ends the breadcrumb with a chevron, as on sub-pods that link back to their parent.
  breadcrumbTrailingChevron?: boolean
  onBack: () => void
  onMenu: () => void
  tabs?: ReactNode
}

const iconButtonClassName =
  'flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl outline-none transition-colors hover:bg-gray-950/5 focus-visible:ring-3 focus-visible:ring-ring'

export const PodTopBar = ({
  title,
  avatar,
  breadcrumb,
  breadcrumbIcon: BreadcrumbIcon,
  breadcrumbTrailingChevron = false,
  onBack,
  onMenu,
  tabs,
}: PodTopBarProps) => {
  const { t } = useTranslation()

  return (
    <header className="flex flex-col rounded-3xl border-white border-b bg-linear-to-b from-brand-100 to-white pt-(--status-bar-h) drop-shadow-topbar">
      <div className="flex flex-col gap-5 px-5 pt-2.5 pb-5">
        <div className="flex items-center gap-2">
          <button aria-label={t('ui.podTopBar.back')} className={iconButtonClassName} onClick={onBack} type="button">
            <ChevronLeft aria-hidden className="text-gray-700" size={24} />
          </button>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {'src' in avatar ? (
              <img
                alt=""
                className="size-12 shrink-0 rounded-full object-cover"
                height={48}
                src={avatar.src}
                width={48}
              />
            ) : (
              <span
                aria-hidden
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-50 font-medium text-brand-700 text-lg"
              >
                {avatar.letter}
              </span>
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <h1 className="truncate font-medium text-base text-gray-900">{title}</h1>
              <p className="flex h-4 items-center gap-1 text-brand-700 text-xs">
                {BreadcrumbIcon && <BreadcrumbIcon aria-hidden className="shrink-0" size={14} />}
                {breadcrumb.map((segment, index) => (
                  <Fragment key={segment}>
                    <span className="whitespace-nowrap">{segment}</span>
                    {(index < breadcrumb.length - 1 || breadcrumbTrailingChevron) && (
                      <ChevronRight aria-hidden className="mx-0.5 shrink-0" size={10} />
                    )}
                  </Fragment>
                ))}
              </p>
            </div>
          </div>
          <button aria-label={t('ui.podTopBar.menu')} className={iconButtonClassName} onClick={onMenu} type="button">
            <ThreeDotsVertical aria-hidden className="text-gray-700" size={24} />
          </button>
        </div>
        {tabs}
      </div>
    </header>
  )
}
