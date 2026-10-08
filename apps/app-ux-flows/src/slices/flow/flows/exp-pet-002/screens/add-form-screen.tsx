import { useAtomValue, useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'

import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { MedicalView } from '../components/medical-view'
import { PodInfoView } from '../components/pod-info-view'
import { addMedicationFormAtom, type ExpPet002Components, type ExpPet002ScreenId, sheetOriginAtom } from '../model'

type FormTemplate = 'medication' | 'pet' | 'petCareAndFeeding' | 'contactInfo'

export const AddFormScreen = () => {
  const { t } = useTranslation()
  const { BottomSheet, Button, SelectField } = useFlowComponents<ExpPet002Components>()
  const { back, goToScreen } = useFlowNavigation<ExpPet002ScreenId>()
  const origin = useAtomValue(sheetOriginAtom)
  const addMedicationForm = useSetAtom(addMedicationFormAtom)

  const save = () => {
    addMedicationForm()
    goToScreen('medication-added')
  }

  return (
    <>
      {origin === 'medical' ? <MedicalView /> : <PodInfoView />}
      <BottomSheet
        description={t('flows.expPet002.addForm.description.medication')}
        onDismiss={back}
        title={t('flows.expPet002.addForm.title')}
      >
        <div className="flex flex-col gap-6">
          <SelectField<FormTemplate>
            label={t('flows.expPet002.addForm.templateLabel')}
            // Only the Medication template exists in this experiment; the others show what the real dialog offers.
            onChange={() => {}}
            options={[
              { label: t('flows.expPet002.addForm.templates.medication'), value: 'medication' },
              { disabled: true, label: t('flows.expPet002.addForm.templates.pet'), value: 'pet' },
              {
                disabled: true,
                label: t('flows.expPet002.addForm.templates.petCareAndFeeding'),
                value: 'petCareAndFeeding',
              },
              { disabled: true, label: t('flows.expPet002.addForm.templates.contactInfo'), value: 'contactInfo' },
            ]}
            value="medication"
          />
          <Button className="w-full" onClick={save} size="l">
            {t('flows.expPet002.addForm.save')}
          </Button>
        </div>
      </BottomSheet>
    </>
  )
}
