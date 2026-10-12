import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui/button'

import { FlowCatalogue, type ScreenHref } from './flow-catalogue'
import type { FlowCatalogue as FlowCatalogueData } from '@/slices/flow/catalogue'
import type { FlowKind } from '@/slices/flow/runtime/define-flow'
import type { CaseChoice } from '@/slices/flow/runtime/resolve-flow'

type VariantChoice = {
  id: string
  nameKey: string
  descriptionKey?: string
}

export type FlowStartChoice = {
  variantId?: string
  caseId?: string
}

export type FlowLauncher = {
  id: string
  kind: FlowKind
  titleKey: string
  descriptionKey: string | null
  variantChoices: readonly VariantChoice[] | null
  caseChoices: readonly CaseChoice[] | null
  assignedVariantId: string | null
  catalogue: FlowCatalogueData | null
}

type FlowCardProps = {
  flow: FlowLauncher
  onStartFlow: (flowId: string, choice?: FlowStartChoice) => void
  screenHref: ScreenHref
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
                <Button onClick={() => onStartFlow(flow.id, { variantId: choice.id })} variant="outlined">
                  {t(choice.nameKey)}
                </Button>
                {choice.descriptionKey && (
                  <span className="text-muted-foreground text-xs">{t(choice.descriptionKey)}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : flow.caseChoices ? (
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground text-sm">{t('home.chooseCase')}</p>
          <ul className="flex flex-col gap-2">
            {flow.caseChoices.map((choice) => (
              <li className="flex flex-col" key={choice.id}>
                <Button
                  className="h-auto flex-col items-start gap-0.5 py-2 text-left"
                  onClick={() => onStartFlow(flow.id, { caseId: choice.id })}
                  variant="outlined"
                >
                  <span className="font-mono text-xs">{choice.code}</span>
                  <span>{t(choice.nameKey)}</span>
                </Button>
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
