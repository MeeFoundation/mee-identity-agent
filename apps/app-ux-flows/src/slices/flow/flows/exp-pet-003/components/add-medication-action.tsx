import { Plus } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { useFlowAnalytics, useFlowComponents } from '../../../runtime/flow-context'
import type { ExpPet003Components, ExpPet003Events, MedicationEntryPoint } from '../model'

type AddMedicationActionProps = {
  entryPoint: MedicationEntryPoint
}

// Shown so the list looks as in the product; this scenario only checks the medication, so a tap is just recorded.
export const AddMedicationAction = ({ entryPoint }: AddMedicationActionProps) => {
  const { t } = useTranslation()
  const { Button } = useFlowComponents<ExpPet003Components>()
  const { track } = useFlowAnalytics<ExpPet003Events>()

  return (
    <Button
      className="w-full px-4"
      onClick={() => track('add_medication_selected', { entry_point: entryPoint })}
      size="l"
      tone="tertiary"
      variant="outlined"
    >
      <Plus aria-hidden className="shrink-0" size={24} />
      <span className="px-2.5">{t('flows.expPet003.medication.add')}</span>
    </Button>
  )
}
