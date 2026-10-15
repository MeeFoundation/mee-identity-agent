import { atom } from 'jotai'

import type { MedicationFieldRow } from '../../pods/ginger/medication-fields'
import {
  type GingerPodComponents,
  type MedicationRecord,
  medicationAtom,
  type OntologyTerm,
  type Pod,
  type PodTab,
} from '../../pods/ginger/model'

export type ExpPet004ScreenId =
  | 'home'
  | 'ginger-notes'
  | 'ginger-info'
  | 'medical'
  | 'medication'
  | 'medication-updated'

export type ExpPet004Components = GingerPodComponents

// Which control started the edit: the details screen's Frequency pencil, variant B's list action or variant C's inline action.
export type EditEntryPoint = 'details_edit' | 'list_edit' | 'inline_schedule'

// Where a whole medication form is edited field by field: the details screen, or variant B's expanded list item.
export type FormEntryPoint = Extract<EditEntryPoint, 'details_edit' | 'list_edit'>

export type MedicationFieldId = MedicationFieldRow['id']

// Every field but the schedule: editable in place, but saving one does not complete the task.
export type OtherMedicationField = Exclude<MedicationFieldId, 'frequency'>

type MenuScreen = 'ginger-notes' | 'ginger-info' | 'medical' | 'medication'

export const SCHEDULE_FREQUENCIES = ['1', '2', '3'] as const

export type ScheduleFrequency = (typeof SCHEDULE_FREQUENCIES)[number]

export type ExpPet004Events = {
  pod_opened: undefined
  pod_tab_selected: { tab: PodTab }
  app_tab_selected: { tab: 'telli' | 'notifications' | 'navigation' }
  search_selected: undefined
  info_row_selected: { row: 'pet_form' | 'attachments' | 'subpods' | 'members' }
  pod_menu_selected: { screen: MenuScreen }
  medical_opened: undefined
  medication_viewed: undefined
  add_medication_selected: undefined
  medication_field_edit_selected: { entry_point: FormEntryPoint; field: OtherMedicationField }
  medication_field_saved: { entry_point: FormEntryPoint; field: OtherMedicationField }
  medication_field_edit_cancelled: { entry_point: FormEntryPoint; field: OtherMedicationField }
  medication_edit_started: { entry_point: EditEntryPoint }
  medication_schedule_changed: { entry_point: EditEntryPoint; from: string; to: string }
  medication_edit_cancelled: { entry_point: EditEntryPoint; changed: boolean }
  medication_update_saved: { entry_point: EditEntryPoint; from: string; to: string }
}

// The shortcut under the medication item on the Medical screen; the only thing the variants change.
export type MedicationShortcut = 'none' | 'edit' | 'change-schedule'

export type ExpPet004InitialState = {
  pod?: Pod
  medication?: MedicationRecord
  medicationShortcut?: MedicationShortcut
}

// Shaped after `pets:Medication`; the participant is asked to change it from once to twice a day.
export const apoquelMedication: MedicationRecord = {
  activeIngredients: [{ iri: 'http://purl.obolibrary.org/obo/CHEBI_750506', label: 'Oclacitinib' }],
  brandName: 'Apoquel',
  dosage: {
    unit: {
      iri: 'https://www.commoncoreontologies.org/ont00001413',
      label: 'Milligram Measurement Unit',
      symbol: 'mg',
    },
    value: 16,
  },
  doseForm: { iri: 'http://purl.obolibrary.org/obo/DRON_00000022', label: 'Tablet' },
  frequencyPerDay: '1',
  manufacturer: 'Zoetis',
  startDate: '2026-09-14',
}

// The schedule the task asks for, applied when the confirmation screen is opened without a save.
export const TASK_TARGET_FREQUENCY: ScheduleFrequency = '2'

export const DEFAULT_MEDICATION_SHORTCUT: MedicationShortcut = 'none'

export const DEFAULT_EDIT_ENTRY_POINT: EditEntryPoint = 'details_edit'

export const medicationShortcutAtom = atom<MedicationShortcut>(DEFAULT_MEDICATION_SHORTCUT)

export const editEntryPointAtom = atom<EditEntryPoint>(DEFAULT_EDIT_ENTRY_POINT)

export const scheduleDraftAtom = atom('')

export const scheduleSavedAtom = atom(false)

// Every way into editing the schedule starts from the record as stored, so an earlier selection never carries over.
export const startEditAtom = atom(null, (get, set, entryPoint: EditEntryPoint) => {
  set(editEntryPointAtom, entryPoint)
  set(scheduleDraftAtom, get(medicationAtom).frequencyPerDay)
})

// Updates the existing record in place; there is only ever one medication.
export const saveScheduleAtom = atom(null, (get, set, frequencyPerDay: string) => {
  set(medicationAtom, { ...get(medicationAtom), frequencyPerDay })
  set(scheduleSavedAtom, true)
})

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/

// The text a field's input starts with: what the record holds, in the input's own format.
export const toFieldDraft = (record: MedicationRecord, field: OtherMedicationField): string => {
  switch (field) {
    case 'activeIngredient':
      return record.activeIngredients.map((ingredient) => ingredient.label).join(', ')
    case 'brandName':
      return record.brandName ?? ''
    case 'manufacturer':
      return record.manufacturer ?? ''
    case 'dose':
      return String(record.dosage.value)
    case 'doseForm':
      return record.doseForm?.label ?? ''
    case 'startDate':
      return record.startDate ?? ''
  }
}

export const isValidFieldDraft = (field: OtherMedicationField, draft: string) => {
  const value = draft.trim()
  if (field === 'dose') return value !== '' && Number.isFinite(Number(value)) && Number(value) > 0
  if (field === 'startDate') return isoDatePattern.test(value)
  return value !== ''
}

// A typed term keeps its IRI only when it names a term the record already had.
const toTerm = (label: string, previous: readonly OntologyTerm[]): OntologyTerm =>
  previous.find((term) => term.label === label) ?? { label }

export const applyFieldDraft = (
  record: MedicationRecord,
  field: OtherMedicationField,
  draft: string,
): MedicationRecord => {
  const value = draft.trim()
  switch (field) {
    case 'activeIngredient': {
      const [first, ...rest] = value
        .split(',')
        .map((label) => label.trim())
        .filter((label) => label !== '')
      if (!first) return record
      return {
        ...record,
        activeIngredients: [
          toTerm(first, record.activeIngredients),
          ...rest.map((label) => toTerm(label, record.activeIngredients)),
        ],
      }
    }
    case 'brandName':
      return { ...record, brandName: value }
    case 'manufacturer':
      return { ...record, manufacturer: value }
    case 'dose':
      return { ...record, dosage: { ...record.dosage, value: Number(value) } }
    case 'doseForm':
      return { ...record, doseForm: toTerm(value, record.doseForm ? [record.doseForm] : []) }
    case 'startDate':
      return { ...record, startDate: value }
  }
}

export const saveFieldAtom = atom(null, (get, set, edit: { field: OtherMedicationField; draft: string }) => {
  set(medicationAtom, applyFieldDraft(get(medicationAtom), edit.field, edit.draft))
})
