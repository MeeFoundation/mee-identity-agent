import { atom } from 'jotai'

import type { GingerPodComponents, MedicationRecord, Pod, PodTab } from '../../pods/ginger/model'

export type ExpPet003ScreenId = 'home' | 'ginger-notes' | 'ginger-info' | 'medical' | 'medication'

export type ExpPet003Components = GingerPodComponents

export type ExpPet003Events = {
  pod_opened: { tab: PodOpeningTab }
  pod_tab_selected: { tab: PodTab }
  app_tab_selected: { tab: 'telli' | 'notifications' | 'navigation' }
  search_selected: undefined
  info_row_selected: { row: 'pet_form' | 'attachments' | 'subpods' | 'members' }
  medical_opened: undefined
  medication_opened: { entry_point: MedicationEntryPoint }
  add_medication_selected: { entry_point: MedicationEntryPoint }
}

// Where the participant found the medication list: the Medical screen, or Medical inline on Ginger's Info tab.
export type MedicationEntryPoint = 'medical_screen' | 'ginger_info'

// How Medical presents the pod's medication on the Info tab; the only thing the variants change.
export type MedicalPresentation = 'row' | 'row-with-preview' | 'inline'

export type PodOpeningTab = 'info' | 'notes'

export type ExpPet003InitialState = {
  pod?: Pod
  medication?: MedicationRecord
  medicalPresentation?: MedicalPresentation
  podOpensOn?: PodOpeningTab
}

export const DEFAULT_MEDICAL_PRESENTATION: MedicalPresentation = 'row'

export const DEFAULT_POD_OPENING_TAB: PodOpeningTab = 'notes'

export const medicalPresentationAtom = atom<MedicalPresentation>(DEFAULT_MEDICAL_PRESENTATION)

export const podOpensOnAtom = atom<PodOpeningTab>(DEFAULT_POD_OPENING_TAB)

// Only `inline` shows the medication on Info itself, so only the other presentations need the Medical screen.
export const hasMedicalScreen = (presentation: MedicalPresentation) => presentation !== 'inline'
