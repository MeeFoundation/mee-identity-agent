import { useAtomValue, useSetAtom } from 'jotai'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { medicationAtom } from '../../../pods/ginger/model'
import { useFlowAnalytics, useFlowComponents } from '../../../runtime/flow-context'
import {
  type ExpPet004Components,
  type ExpPet004Events,
  type FormEntryPoint,
  isValidFieldDraft,
  type OtherMedicationField,
  saveFieldAtom,
  toFieldDraft,
} from '../model'

const inputTypes: Record<OtherMedicationField, 'text' | 'number' | 'date'> = {
  activeIngredient: 'text',
  brandName: 'text',
  dose: 'number',
  doseForm: 'text',
  manufacturer: 'text',
  startDate: 'date',
}

type MedicationFieldEditorProps = {
  field: OtherMedicationField
  label: string
  entryPoint: FormEntryPoint
  onClose: () => void
}

// Any field but the schedule in edit mode; saving updates the record and leaves the participant where they are.
export const MedicationFieldEditor = ({ field, label, entryPoint, onClose }: MedicationFieldEditorProps) => {
  const { t } = useTranslation()
  const { InlineFieldEditor, TextField } = useFlowComponents<ExpPet004Components>()
  const { track } = useFlowAnalytics<ExpPet004Events>()
  const medication = useAtomValue(medicationAtom)
  const saveField = useSetAtom(saveFieldAtom)
  const [draft, setDraft] = useState(() => toFieldDraft(medication, field))

  const unit = field === 'dose' ? medication.dosage.unit?.symbol : undefined

  const save = () => {
    track('medication_field_saved', { entry_point: entryPoint, field })
    saveField({ draft, field })
    onClose()
  }

  const cancel = () => {
    track('medication_field_edit_cancelled', { entry_point: entryPoint, field })
    onClose()
  }

  return (
    <InlineFieldEditor
      onCancel={cancel}
      onSave={save}
      saveDisabled={draft.trim() === toFieldDraft(medication, field) || !isValidFieldDraft(field, draft)}
    >
      <TextField
        label={unit ? t('flows.expPet004.editor.doseLabel', { label, unit }) : label}
        onChange={setDraft}
        type={inputTypes[field]}
        value={draft}
      />
    </InlineFieldEditor>
  )
}
