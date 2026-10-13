import { atom } from 'jotai'

import type { GingerPodComponents, MedicationRecord, Pod, PodTab } from '../../pods/ginger/model'

export type ExpPet002ScreenId = 'ginger-notes' | 'ginger-info' | 'medical' | 'add-form' | 'medication-added'

export type ExpPet002Components = GingerPodComponents

export type ExpPet002Events = {
  pod_tab_selected: { tab: PodTab }
  medical_opened: undefined
  add_form_clicked: { entry_point: 'forms_section' | 'medical_section' }
  add_form_dismissed: undefined
  medication_form_added: { method: 'add_form' | 'ai_suggestion' }
}

export type ExpPet002InitialState = {
  pod?: Pod
  medication?: MedicationRecord
  showAiSuggestion?: boolean
}

type SheetOrigin = 'ginger-info' | 'medical'

export const showAiSuggestionAtom = atom(false)

export const sheetOriginAtom = atom<SheetOrigin>('ginger-info')
