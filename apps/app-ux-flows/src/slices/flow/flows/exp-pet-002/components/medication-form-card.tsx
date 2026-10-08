import { useAtomValue } from 'jotai'
import { Capsule, Plus } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { useFlowComponents } from '../../../runtime/flow-context'
import { toMedicationFieldRows } from '../medication-fields'
import { type ExpPet002Components, medicationAtom } from '../model'

const noop = () => {}

export const MedicationFormCard = () => {
  const { t, i18n } = useTranslation()
  const { Button, FieldRow, FormCard } = useFlowComponents<ExpPet002Components>()
  const medication = useAtomValue(medicationAtom)

  return (
    <FormCard
      footer={
        <Button className="w-full px-4" onClick={noop} size="l" tone="tertiary" variant="outlined">
          <Plus aria-hidden className="shrink-0" size={24} />
          <span className="px-2.5">{t('flows.expPet002.forms.addContactInfo')}</span>
        </Button>
      }
      icon={Capsule}
      title={t('flows.expPet002.medication.formTitle')}
    >
      {toMedicationFieldRows(medication, t, i18n.language).map((row) => (
        <FieldRow key={row.id} label={row.label} onEdit={noop} value={row.value} />
      ))}
    </FormCard>
  )
}
