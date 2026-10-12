import { useSetAtom } from 'jotai'
import { useState } from 'react'

import type { ContactInfoField } from '../../../pods/people/contact-info'
import { useFlowComponents } from '../../../runtime/flow-context'
import { editTidyFieldAtom, type ScPpl001Components } from '../model'

type ContactFieldEditorProps = {
  field: ContactInfoField
  label: string
  // As stored: an ISO date for Date of birth.
  value: string
  onClose: () => void
}

// Changes a value in the Tidy sheet only; "Tidy notes" saves it to Contact info.
export const ContactFieldEditor = ({ field, label, value, onClose }: ContactFieldEditorProps) => {
  const { InlineFieldEditor, TextField } = useFlowComponents<ScPpl001Components>()
  const editTidyField = useSetAtom(editTidyFieldAtom)
  const [draft, setDraft] = useState(value)

  const save = () => {
    editTidyField(field, draft.trim())
    onClose()
  }

  return (
    <InlineFieldEditor onCancel={onClose} onSave={save} saveDisabled={draft.trim() === '' || draft.trim() === value}>
      <TextField label={label} onChange={setDraft} type={field === 'dateOfBirth' ? 'date' : 'text'} value={draft} />
    </InlineFieldEditor>
  )
}
