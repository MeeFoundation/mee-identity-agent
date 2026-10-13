import { FolderPlus } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { useFlowComponents } from '../../../runtime/flow-context'
import type { GingerPodComponents } from '../model'
import { MedicationFormCard } from './medication-form-card'

const noop = () => {}

type GingerFormsSectionProps = {
  medicationFormAdded: boolean
  // The "+ action" of the empty state; without it the empty state has no button.
  emptyAction?: { label: string; onAction: () => void }
}

export const GingerFormsSection = ({ medicationFormAdded, emptyAction }: GingerFormsSectionProps) => {
  const { t } = useTranslation()
  const { CardWithAction, EmptyStateCard, SectionLabel } = useFlowComponents<GingerPodComponents>()

  return (
    <section className="flex flex-col gap-3">
      <SectionLabel>{t('pods.ginger.forms.title')}</SectionLabel>
      {medicationFormAdded ? (
        <CardWithAction
          actionIcon={FolderPlus}
          actionLabel={t('pods.ginger.forms.createForm')}
          actionTone="tertiary"
          onAction={noop}
        >
          <MedicationFormCard />
        </CardWithAction>
      ) : (
        <EmptyStateCard
          action={emptyAction}
          message={t('pods.ginger.forms.emptyMessage')}
          title={t('pods.ginger.forms.emptyTitle')}
        />
      )}
    </section>
  )
}
