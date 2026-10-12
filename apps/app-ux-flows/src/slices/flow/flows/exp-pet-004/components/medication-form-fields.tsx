import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { toMedicationFieldRows } from '../../../pods/ginger/medication-fields'
import { medicationAtom } from '../../../pods/ginger/model'
import { useFlowAnalytics, useFlowComponents } from '../../../runtime/flow-context'
import {
  type ExpPet004Components,
  type ExpPet004Events,
  type FormEntryPoint,
  type MedicationFieldId,
  startEditAtom,
} from '../model'
import { MedicationFieldEditor } from './medication-field-editor'
import { ScheduleField } from './schedule-field'

type MedicationFormFieldsProps = {
  entryPoint: FormEntryPoint
  onScheduleSaved: () => void
}

// The medication's fields with a pencil each, as in the app's other forms; one field at a time is edited in place.
export const MedicationFormFields = ({ entryPoint, onScheduleSaved }: MedicationFormFieldsProps) => {
  const { t, i18n } = useTranslation()
  const { FieldRow } = useFlowComponents<ExpPet004Components>()
  const { track } = useFlowAnalytics<ExpPet004Events>()
  const medication = useAtomValue(medicationAtom)
  const startEdit = useSetAtom(startEditAtom)
  const [editing, setEditing] = useState<MedicationFieldId | null>(null)
  const [closedField, setClosedField] = useState<MedicationFieldId | null>(null)
  const rowsRef = useRef<HTMLDivElement>(null)

  // Back on the pencil of the field just closed, so keyboard users keep their place.
  useEffect(() => {
    if (editing || !closedField) return
    rowsRef.current?.querySelector<HTMLElement>(`[data-field="${closedField}"] button`)?.focus()
  }, [editing, closedField])

  const open = (field: MedicationFieldId) => {
    if (field === 'frequency') {
      // In variant B the edit started when the form was expanded.
      if (entryPoint === 'details_edit') track('medication_edit_started', { entry_point: entryPoint })
      startEdit(entryPoint)
    } else {
      track('medication_field_edit_selected', { entry_point: entryPoint, field })
    }
    setEditing(field)
  }

  const close = () => {
    setClosedField(editing)
    setEditing(null)
  }

  return (
    <div className="contents" ref={rowsRef}>
      {toMedicationFieldRows(medication, t, i18n.language).map((row) => (
        <div className="contents" data-field={row.id} key={row.id}>
          <FieldRow
            editor={
              editing !== row.id ? undefined : row.id === 'frequency' ? (
                <ScheduleField onCancel={close} onSaved={onScheduleSaved} />
              ) : (
                <MedicationFieldEditor entryPoint={entryPoint} field={row.id} label={row.label} onClose={close} />
              )
            }
            label={row.label}
            // While one field is edited the others offer no pencil, so only one edit is ever open.
            onEdit={editing ? undefined : () => open(row.id)}
            value={row.value}
          />
        </div>
      ))}
    </div>
  )
}
