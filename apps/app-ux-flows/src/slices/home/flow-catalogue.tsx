import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { HiddenBadge } from './hidden-badge'
import type { CatalogueEntry, FlowCatalogue as FlowCatalogueData } from '@/slices/flow/catalogue'

export type ScreenHref = (
  flowId: string,
  screenId: string,
  entry: Pick<CatalogueEntry, 'variantId' | 'caseId'>,
) => string

type FlowCatalogueProps = {
  catalogue: FlowCatalogueData
  assignedVariantId: string | null
  screenHref: ScreenHref
  onOpenScreen: (href: string) => void
}

const isPlainClick = (event: MouseEvent) =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey

export const FlowCatalogue = ({ catalogue, assignedVariantId, screenHref, onOpenScreen }: FlowCatalogueProps) => {
  const { t } = useTranslation()

  return (
    <details className="group text-sm">
      <summary className="w-fit cursor-pointer select-none rounded-md text-gray-500 text-xs outline-none hover:text-gray-700 focus-visible:ring-3 focus-visible:ring-ring">
        {t('home.catalogue.title')}
      </summary>
      <div className="mt-2 flex flex-col gap-4 rounded-xl border border-gray-200 border-dashed bg-gray-50 px-3 py-3">
        {assignedVariantId && (
          <p className="text-muted-foreground text-xs">{t('home.assignedVariant', { variant: assignedVariantId })}</p>
        )}
        {catalogue.entries.map((entry) => (
          <section className="flex flex-col gap-2" key={`${entry.variantId ?? ''}:${entry.caseId ?? ''}`}>
            <header className="flex flex-col gap-0.5">
              <h4 className="flex flex-wrap items-center gap-x-2 font-semibold text-gray-900">
                {entry.code && <span className="font-mono text-xs">{entry.code}</span>}
                {entry.nameKey ? t(entry.nameKey) : t('home.catalogue.baseFlow')}
                {entry.hidden && <HiddenBadge />}
              </h4>
              {entry.descriptionKey && <p className="text-muted-foreground text-xs">{t(entry.descriptionKey)}</p>}
            </header>
            <ul className="flex flex-col gap-1.5">
              {entry.screens.map((screen) => {
                const href = screenHref(catalogue.flowId, screen.screenId, entry)

                return (
                  <li className="flex flex-col" key={screen.screenId}>
                    <a
                      className="w-fit font-mono text-brand-700 text-xs underline-offset-2 hover:underline"
                      href={href}
                      onClick={(event) => {
                        if (!isPlainClick(event)) return
                        event.preventDefault()
                        onOpenScreen(href)
                      }}
                    >
                      {screen.screenId}
                    </a>
                    {screen.frame ? (
                      <a
                        className="w-fit text-gray-600 text-xs underline-offset-2 hover:underline"
                        href={screen.frame.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {screen.frame.name}
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-xs">{t('home.catalogue.noFrame')}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </details>
  )
}
