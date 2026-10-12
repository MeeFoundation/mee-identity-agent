import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'

import { medicationAtom } from '../../../pods/ginger/model'
import { useFlowAnalytics, useFlowComponents } from '../../../runtime/flow-context'
import {
  type ExpPet004Components,
  type ExpPet004Events,
  editEntryPointAtom,
  SCHEDULE_FREQUENCIES,
  saveScheduleAtom,
  scheduleDraftAtom,
} from '../model'

type ScheduleFieldProps = {
  onSaved: () => void
  onCancel: () => void
}

// The Frequency field in edit mode; the same control behind every entry point, so variants differ only in how it is reached.
export const ScheduleField = ({ onSaved, onCancel }: ScheduleFieldProps) => {
  const { t } = useTranslation()
  const { InlineFieldEditor, SelectField } = useFlowComponents<ExpPet004Components>()
  const { track } = useFlowAnalytics<ExpPet004Events>()
  const medication = useAtomValue(medicationAtom)
  const entryPoint = useAtomValue(editEntryPointAtom)
  const [draft, setDraft] = useAtom(scheduleDraftAtom)
  const saveSchedule = useSetAtom(saveScheduleAtom)

  const select = (next: string) => {
    if (next === draft) return
    track('medication_schedule_changed', { entry_point: entryPoint, from: draft, to: next })
    setDraft(next)
  }

  const save = () => {
    track('medication_update_saved', { entry_point: entryPoint, from: medication.frequencyPerDay, to: draft })
    saveSchedule(draft)
    onSaved()
  }

  const cancel = () => {
    track('medication_edit_cancelled', { changed: draft !== medication.frequencyPerDay, entry_point: entryPoint })
    setDraft(medication.frequencyPerDay)
    onCancel()
  }

  return (
    <InlineFieldEditor onCancel={cancel} onSave={save} saveDisabled={draft === medication.frequencyPerDay}>
      <SelectField<string>
        label={t('pods.ginger.medication.fields.frequency')}
        onChange={select}
        options={SCHEDULE_FREQUENCIES.map((frequency) => ({
          label: t('pods.ginger.medication.frequency', { count: Number(frequency) }),
          value: frequency,
        }))}
        value={draft}
      />
    </InlineFieldEditor>
  )
}
