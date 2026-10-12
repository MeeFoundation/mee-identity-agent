import { useAtomValue } from 'jotai'
import { Capsule } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { toMedicationSummary } from '../../../pods/ginger/medication-fields'
import { medicationAtom } from '../../../pods/ginger/model'
import { useFlowComponents } from '../../../runtime/flow-context'
import type { ExpPet003Components } from '../model'

type MedicationRowProps = {
  onOpen: () => void
}

// The pod's one medication record, summarised so the list answers "what and how often" without opening it.
export const MedicationRow = ({ onOpen }: MedicationRowProps) => {
  const { t, i18n } = useTranslation()
  const { RecordRow } = useFlowComponents<ExpPet003Components>()
  const summary = toMedicationSummary(useAtomValue(medicationAtom), t, i18n.language)

  return (
    <RecordRow
      description={t('flows.expPet003.medication.summary', { dose: summary.dose, frequency: summary.frequency })}
      icon={Capsule}
      meta={summary.startDate ? t('flows.expPet003.medication.started', { date: summary.startDate }) : undefined}
      onClick={onOpen}
      title={summary.name}
    />
  )
}
