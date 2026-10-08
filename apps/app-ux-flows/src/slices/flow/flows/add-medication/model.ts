import { atom } from 'jotai'
import type { ComponentType } from 'react'

import type { DefaultComponents } from '@/shared/ui/default-components'

export type AddMedicationScreenId = 'home' | 'medication-form' | 'confirmation'

export type Pet = {
  id: string
  name: string
  species: string
  ageYears: number
}

export type Medication = {
  id: string
  name: string
  dosage: string
  withFood: boolean
}

type MedicationDraft = Omit<Medication, 'id'>

export const gingerFixture: Pet = { ageYears: 4, id: 'ginger', name: 'Ginger', species: 'Cat' }

export const emptyMedicationDraft: MedicationDraft = { dosage: '', name: '', withFood: false }

export type AddMedicationInitialState = {
  pet?: Pet
  medications?: Medication[]
  showMedicationHint?: boolean
}

export type PetCardProps = {
  pet: Pet
}

export type QuickActionProps = {
  label: string
  description: string
  onClick: () => void
}

export type AddMedicationComponents = DefaultComponents & {
  PetCard: ComponentType<PetCardProps>
  QuickAction: ComponentType<QuickActionProps>
}

export const petAtom = atom<Pet>(gingerFixture)

export const medicationsAtom = atom<Medication[]>([])

export const medicationDraftAtom = atom<MedicationDraft>(emptyMedicationDraft)

export const showMedicationHintAtom = atom(false)
