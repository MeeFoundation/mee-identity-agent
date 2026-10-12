import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

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
    <details className="group rounded-xl border border-gray-200 border-dashed bg-gray-50 text-sm">
      <summary className="cursor-pointer select-none px-3 py-2 font-medium text-gray-700 outline-none focus-visible:ring-3 focus-visible:ring-ring">
        {t('home.catalogue.title')}
        {catalogue.code && <span className="ml-2 font-mono text-gray-500 text-xs">{catalogue.code}</span>}
      </summary>
      <div className="flex flex-col gap-4 border-gray-200 border-t border-dashed px-3 py-3">
        {assignedVariantId && (
          <p className="text-muted-foreground text-xs">{t('home.assignedVariant', { variant: assignedVariantId })}</p>
        )}
        {catalogue.entries.map((entry) => (
          <section className="flex flex-col gap-2" key={`${entry.variantId ?? ''}:${entry.caseId ?? ''}`}>
            <header className="flex flex-col gap-0.5">
              <h4 className="font-semibold text-gray-900">
                {entry.code && <span className="mr-2 font-mono text-xs">{entry.code}</span>}
                {entry.nameKey ? t(entry.nameKey) : t('home.catalogue.baseFlow')}
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
