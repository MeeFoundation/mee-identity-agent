import { useAtom, useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'

import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import {
  type AddMedicationComponents,
  type AddMedicationScreenId,
  emptyMedicationDraft,
  medicationDraftAtom,
  medicationsAtom,
} from '../model'

export const MedicationFormScreen = () => {
  const { t } = useTranslation()
  const { Button, Checkbox, Header, TextField } = useFlowComponents<AddMedicationComponents>()
  const { back, goToScreen } = useFlowNavigation<AddMedicationScreenId>()
  const [draft, setDraft] = useAtom(medicationDraftAtom)
  const setMedications = useSetAtom(medicationsAtom)

  const canSave = draft.name.trim() !== '' && draft.dosage.trim() !== ''

  const save = () => {
    setMedications((medications) => [...medications, { ...draft, id: crypto.randomUUID() }])
    setDraft(emptyMedicationDraft)
    goToScreen('confirmation')
  }

  return (
    <section>
      <Header onBack={back} title={t('flows.addMedication.form.title')} />
      <TextField
        label={t('flows.addMedication.form.nameLabel')}
        onChange={(name) => setDraft({ ...draft, name })}
        value={draft.name}
      />
      <TextField
        label={t('flows.addMedication.form.dosageLabel')}
        onChange={(dosage) => setDraft({ ...draft, dosage })}
        value={draft.dosage}
      />
      <Checkbox
        checked={draft.withFood}
        label={t('flows.addMedication.form.withFoodLabel')}
        onChange={(withFood) => setDraft({ ...draft, withFood })}
      />
      <Button disabled={!canSave} onClick={save}>
        {t('flows.addMedication.form.save')}
      </Button>
    </section>
  )
}
