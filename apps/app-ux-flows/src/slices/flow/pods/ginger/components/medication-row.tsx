import { useAtomValue } from 'jotai'
import type { ComponentProps } from 'react'
import { Capsule } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { useFlowComponents } from '../../../runtime/flow-context'
import { toMedicationSummary } from '../medication-fields'
import { type GingerPodComponents, medicationAtom } from '../model'

type MedicationRowProps = {
  onOpen: () => void
  action?: ComponentProps<GingerPodComponents['RecordRow']>['action']
}

// The pod's one medication record, summarised so the list answers "what and how often" without opening it.
export const MedicationRow = ({ onOpen, action }: MedicationRowProps) => {
  const { t, i18n } = useTranslation()
  const { RecordRow } = useFlowComponents<GingerPodComponents>()
  const summary = toMedicationSummary(useAtomValue(medicationAtom), t, i18n.language)

  return (
    <RecordRow
      action={action}
      description={t('pods.ginger.medication.summary', { dose: summary.dose, frequency: summary.frequency })}
      icon={Capsule}
      meta={summary.startDate ? t('pods.ginger.medication.started', { date: summary.startDate }) : undefined}
      onClick={onOpen}
      title={summary.name}
    />
  )
}
