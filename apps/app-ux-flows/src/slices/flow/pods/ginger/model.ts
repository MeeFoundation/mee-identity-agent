import { atom } from 'jotai'

import gingerAvatar from './assets/ginger-avatar.png'
import type { HistoryFilter } from './dose-history'
import type { DefaultComponents } from '@/shared/ui/default-components'
import type { PodComponents } from '@/shared/ui/pod-components'

export type GingerPodComponents = DefaultComponents & PodComponents

export type PodTab = 'notes' | 'chat' | 'info'

// Ontology terms keep their IRI next to the label so the record can be swapped for server data later.
// A term typed by a participant has no IRI: the prototype has no ontology lookup.
export type OntologyTerm = {
  iri?: string
  label: string
}

type MeasurementUnit = OntologyTerm & {
  iri: string
  symbol: string
}

// Shaped after `pets:Medication` in the Tellipod Pets ontology.
export type MedicationRecord = {
  activeIngredients: readonly [OntologyTerm, ...OntologyTerm[]]
  brandName?: string
  manufacturer?: string
  dosage: { value: number; unit?: MeasurementUnit }
  doseForm?: OntologyTerm
  frequencyPerDay: string
  // ISO calendar date (YYYY-MM-DD).
  startDate?: string
  // ISO calendar date (YYYY-MM-DD) of the last day of a finished course.
  endDate?: string
}

// A medication the pod has had, current or finished; the id ties dose events to it.
export type MedicationCourse = {
  id: string
  record: MedicationRecord
}

// The course id of the record in `medicationAtom`.
export const CURRENT_MEDICATION_ID = 'current'

export type PodMember = {
  id: string
  name: string
}

// The participant's member id; shown as "You" rather than by name.
export const PARTICIPANT_ID = 'you'

// One scheduled dose of the pod's medication; giving it never changes the medication record.
export type MedicationDose = {
  // ISO date-time.
  scheduledAt: string
  status: 'due' | 'given'
  // ISO date-time, set once the dose is given.
  givenAt?: string
  // Member id of whoever gave it.
  givenBy?: string
}

// A past scheduled dose of one of the pod's medication courses.
export type DoseEvent = {
  id: string
  medicationId: string
  // ISO date-time.
  scheduledAt: string
  status: 'given' | 'missed'
  // ISO date-time, for a given dose.
  givenAt?: string
  // Member id, for a given dose.
  givenBy?: string
}

export type Pod = {
  name: string
  avatarSrc: string
  breadcrumb: readonly string[]
  memberCount: number
}

export const gingerPod: Pod = {
  avatarSrc: gingerAvatar,
  breadcrumb: ['Pets'],
  memberCount: 1,
  name: 'Ginger',
}

export const gingerMedication: MedicationRecord = {
  activeIngredients: [{ iri: 'http://purl.obolibrary.org/obo/CHEBI_2676', label: 'Amoxicillin' }],
  brandName: 'Clavamox',
  dosage: {
    unit: {
      iri: 'https://www.commoncoreontologies.org/ont00001413',
      label: 'Milligram Measurement Unit',
      symbol: 'mg',
    },
    value: 62.5,
  },
  doseForm: { iri: 'http://purl.obolibrary.org/obo/DRON_00000022', label: 'Tablet' },
  frequencyPerDay: '2',
  manufacturer: 'Zoetis',
  startDate: '2026-10-06',
}

export const podAtom = atom<Pod>(gingerPod)

export const medicationAtom = atom<MedicationRecord>(gingerMedication)

export const medicationDoseAtom = atom<MedicationDose>({ scheduledAt: new Date(0).toISOString(), status: 'due' })

// Finished courses; the current medication is `medicationAtom`.
export const medicationCoursesAtom = atom<readonly MedicationCourse[]>([])

export const doseHistoryAtom = atom<readonly DoseEvent[]>([])

// Members other than the participant, by name; the participant is always a member.
export const podMembersAtom = atom<readonly PodMember[]>([])

export const DEFAULT_HISTORY_FILTER: HistoryFilter = { medicationId: 'all', period: '30d' }

export const doseHistoryFilterAtom = atom<HistoryFilter>(DEFAULT_HISTORY_FILTER)

// Records the dose only: the medication and its schedule are left as they are.
export const giveDoseAtom = atom(null, (get, set, now: Date) => {
  set(medicationDoseAtom, {
    ...get(medicationDoseAtom),
    givenAt: now.toISOString(),
    givenBy: PARTICIPANT_ID,
    status: 'given',
  })
})

// Reverts a dose marked as given by mistake: it keeps its scheduled time, and the medication is left as it is.
export const undoDoseAtom = atom(null, (get, set) => {
  set(medicationDoseAtom, { scheduledAt: get(medicationDoseAtom).scheduledAt, status: 'due' })
})

export const medicationFormAddedAtom = atom(false)

// Idempotent, so returning to a screen that adds the form and adding again never duplicates it.
export const addMedicationFormAtom = atom(null, (_get, set) => set(medicationFormAddedAtom, true))
