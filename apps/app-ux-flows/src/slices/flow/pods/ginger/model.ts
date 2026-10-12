import { atom } from 'jotai'

import type { DefaultComponents } from '@/shared/ui/default-components'
import type { PodComponents } from '@/shared/ui/pod-components'

import gingerAvatar from './assets/ginger-avatar.png'

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

export const medicationFormAddedAtom = atom(false)

export const noteTextAtom = atom('')

// Idempotent, so returning to a screen that adds the form and adding again never duplicates it.
export const addMedicationFormAtom = atom(null, (_get, set) => set(medicationFormAddedAtom, true))
