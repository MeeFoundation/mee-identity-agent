import { Stars } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import type { TemplateSuggestion } from '../../../pods/catalog/suggestions'
import { useFlowComponents } from '../../../runtime/flow-context'
import type { ScPet001Components } from '../model'

type TemplateSuggestionCardProps = {
  suggestion: TemplateSuggestion
  podName: string
  onDismiss: () => void
  onAccept: () => void
}

export const TemplateSuggestionCard = ({ suggestion, podName, onDismiss, onAccept }: TemplateSuggestionCardProps) => {
  const { t } = useTranslation()
  const { Button } = useFlowComponents<ScPet001Components>()

  return (
    <section
      aria-label={t(suggestion.titleKey, { name: podName })}
      className="mt-2 flex flex-col gap-3 rounded-2xl border border-brand-300 bg-brand-100 p-4"
    >
      <div className="flex items-start gap-2">
        <Stars aria-hidden className="mt-0.5 shrink-0 text-gray-700" size={24} />
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="font-semibold text-base text-gray-900">{t(suggestion.titleKey, { name: podName })}</h3>
          <p className="text-gray-700 text-sm">{t(suggestion.messageKey)}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={onDismiss} tone="tertiary" variant="outlined">
          {t('flows.scPet001.suggestion.notNow')}
        </Button>
        <Button onClick={onAccept}>{t('flows.scPet001.suggestion.useTemplate')}</Button>
      </div>
    </section>
  )
}
