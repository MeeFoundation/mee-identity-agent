import { useId } from 'react'
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

type ChoiceButtonProps = {
  label: string
  description?: string
  onClick: () => void
}

// The description stays available on hover (title) and to assistive technology, without taking a line.
const ChoiceButton = ({ label, description, onClick }: ChoiceButtonProps) => {
  const descriptionId = useId()

  return (
    <>
      <Button
        aria-describedby={description ? descriptionId : undefined}
        onClick={onClick}
        size="s"
        title={description}
        variant="outlined"
      >
        {label}
      </Button>
      {description && (
        <span className="sr-only" id={descriptionId}>
          {description}
        </span>
      )}
    </>
  )
}

type FlowRowProps = {
  flow: FlowLauncher
  onStartFlow: (flowId: string, choice?: FlowStartChoice) => void
  screenHref: ScreenHref
  onOpenScreen: (href: string) => void
}

export const FlowRow = ({ flow, onStartFlow, screenHref, onOpenScreen }: FlowRowProps) => {
  const { t } = useTranslation()
  const description = flow.descriptionKey ? t(flow.descriptionKey) : null
  const code = flow.catalogue?.code

  return (
    <li className="flex flex-col gap-2 px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex min-w-0 flex-1 basis-64 flex-col gap-0.5">
          <h3 className="flex min-w-0 items-center gap-2 font-semibold text-base text-gray-900">
            {code && (
              <span className="shrink-0 rounded-md bg-gray-100 px-1.5 py-0.5 font-medium font-mono text-gray-600 text-xs">
                {code}
              </span>
            )}
            <span className="truncate">{t(flow.titleKey)}</span>
          </h3>
          {description && (
            <p className="line-clamp-1 text-muted-foreground text-sm" title={description}>
              {description}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {flow.variantChoices ? (
            flow.variantChoices.map((choice) => (
              <ChoiceButton
                description={choice.descriptionKey ? t(choice.descriptionKey) : undefined}
                key={choice.id}
                label={t(choice.nameKey)}
                onClick={() => onStartFlow(flow.id, { variantId: choice.id })}
              />
            ))
          ) : flow.caseChoices ? (
            flow.caseChoices.map((choice) => (
              <ChoiceButton
                key={choice.id}
                label={`${choice.code} · ${t(choice.nameKey)}`}
                onClick={() => onStartFlow(flow.id, { caseId: choice.id })}
              />
            ))
          ) : (
            <Button onClick={() => onStartFlow(flow.id)} size="s">
              {t('home.start')}
            </Button>
          )}
        </div>
      </div>
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
