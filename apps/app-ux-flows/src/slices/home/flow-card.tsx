import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui/button'

import { FlowCatalogue } from './flow-catalogue'
import type { FlowCatalogue as FlowCatalogueData } from '@/slices/flow/catalogue'
import type { FlowKind } from '@/slices/flow/runtime/define-flow'

type VariantChoice = {
  id: string
  nameKey: string
  descriptionKey?: string
}

export type FlowLauncher = {
  id: string
  kind: FlowKind
  titleKey: string
  descriptionKey: string | null
  variantChoices: readonly VariantChoice[] | null
  assignedVariantId: string | null
  catalogue: FlowCatalogueData | null
}

type FlowCardProps = {
  flow: FlowLauncher
  onStartFlow: (flowId: string, variantId?: string) => void
  screenHref: (flowId: string, screenId: string, variantId: string | null) => string
  onOpenScreen: (href: string) => void
}

export const FlowCard = ({ flow, onStartFlow, screenHref, onOpenScreen }: FlowCardProps) => {
  const { t } = useTranslation()

  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-gray-900 text-lg">{t(flow.titleKey)}</h3>
        {flow.descriptionKey && <p className="text-muted-foreground text-sm">{t(flow.descriptionKey)}</p>}
      </div>
      {flow.variantChoices ? (
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground text-sm">{t('home.chooseVariant')}</p>
          <ul className="flex flex-col gap-3">
            {flow.variantChoices.map((choice) => (
              <li className="flex flex-col gap-1" key={choice.id}>
                <Button onClick={() => onStartFlow(flow.id, choice.id)} variant="outlined">
                  {t(choice.nameKey)}
                </Button>
                {choice.descriptionKey && (
                  <span className="text-muted-foreground text-xs">{t(choice.descriptionKey)}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <Button className="self-start" onClick={() => onStartFlow(flow.id)}>
          {t('home.start')}
        </Button>
      )}
      {flow.catalogue ? (
        <FlowCatalogue
          assignedVariantId={flow.assignedVariantId}
          catalogue={flow.catalogue}
          onOpenScreen={onOpenScreen}
          screenHref={screenHref}
        />
      ) : (
        flow.assignedVariantId && (
          <small className="text-muted-foreground text-xs">
            {t('home.assignedVariant', { variant: flow.assignedVariantId })}
          </small>
        )
      )}
    </li>
  )
}
