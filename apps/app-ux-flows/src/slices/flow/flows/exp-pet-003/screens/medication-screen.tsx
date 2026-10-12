import { useAtomValue } from 'jotai'
import { Capsule } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { SubScreenTopBar } from '../../../pods/ginger/components/sub-screen-top-bar'
import { toMedicationFieldRows, toMedicationSummary } from '../../../pods/ginger/medication-fields'
import { medicationAtom } from '../../../pods/ginger/model'
import { useFlowComponents } from '../../../runtime/flow-context'
import type { ExpPet003Components } from '../model'

// Read-only: this scenario only checks the medication, so no field offers editing.
export const MedicationScreen = () => {
  const { t, i18n } = useTranslation()
  const { FieldRow, FormCard, PodScreen } = useFlowComponents<ExpPet003Components>()
  const medication = useAtomValue(medicationAtom)

  return (
    <PodScreen
      topBar={
        <SubScreenTopBar
          title={toMedicationSummary(medication, t, i18n.language).name}
          trail={[t('flows.expPet003.medical.title')]}
        />
      }
    >
      <FormCard icon={Capsule} title={t('pods.ginger.medication.formTitle')}>
        {toMedicationFieldRows(medication, t, i18n.language).map((row) => (
          <FieldRow key={row.id} label={row.label} value={row.value} />
        ))}
      </FormCard>
    </PodScreen>
  )
}
