import { atom } from 'jotai'

import type { HistoryPeriod } from '../../pods/ginger/dose-history'
import type { GingerPodComponents, MedicationRecord, Pod, PodTab } from '../../pods/ginger/model'

export type ExpPet005ScreenId =
  | 'home'
  | 'ginger-notes'
  | 'ginger-info'
  | 'medical'
  | 'medication'
  | 'give-dose'
  | 'undo-dose'
  | 'dose-history'

export type ExpPet005Components = GingerPodComponents

// Where a variant promotes the due dose before Medical; `medical` promotes it nowhere, as Medical shows it in every variant.
export type DoseSurface = 'medical' | 'pod' | 'home'

// The screen a confirmation sheet was opened from, and is shown over.
export type DoseOrigin = Exclude<ExpPet005ScreenId, 'give-dose' | 'undo-dose' | 'dose-history'>

export type DoseEntryPoint = DoseSurface

type MenuScreen = 'ginger-notes' | 'ginger-info' | 'medical' | 'medication' | 'dose-history'

// Which control opened the dose history.
export type HistorySource = 'medical' | 'card' | 'details'

export type ExpPet005Events = {
  medication_give_started: { entry_point: DoseEntryPoint }
  medication_give_confirmed: { entry_point: DoseEntryPoint }
  medication_give_cancelled: { entry_point: DoseEntryPoint }
  medication_undo_started: { entry_point: DoseEntryPoint }
  medication_undo_confirmed: { entry_point: DoseEntryPoint }
  medication_undo_cancelled: { entry_point: DoseEntryPoint }
  pod_opened: undefined
  pod_tab_selected: { tab: PodTab }
  app_tab_selected: { tab: 'telli' | 'notifications' | 'navigation' }
  search_selected: undefined
  info_row_selected: { row: 'pet_form' | 'attachments' | 'subpods' | 'members' }
  medical_opened: undefined
  medication_viewed: undefined
  add_medication_selected: undefined
  pod_menu_selected: { screen: MenuScreen }
  dose_history_opened: { source: HistorySource }
  dose_history_filtered: { period: HistoryPeriod; medication: 'all' | 'current' | 'past' }
  dose_history_more_shown: { shown: number }
}

export type ExpPet005InitialState = {
  pod?: Pod
  medication?: MedicationRecord
  doseSurface?: DoseSurface
  // Starts the run with the dose already given, to show the end state.
  doseGiven?: boolean
}

export const DEFAULT_DOSE_SURFACE: DoseSurface = 'medical'

// A direct link to the sheet shows it over Medical, which every variant has.
export const DEFAULT_DOSE_ORIGIN: DoseOrigin = 'medical'

export const toEntryPoint = (origin: DoseOrigin): DoseEntryPoint => {
  switch (origin) {
    case 'home':
      return 'home'
    case 'ginger-notes':
    case 'ginger-info':
      return 'pod'
    case 'medical':
    case 'medication':
      return 'medical'
  }
}

export const doseSurfaceAtom = atom<DoseSurface>(DEFAULT_DOSE_SURFACE)

export const doseOriginAtom = atom<DoseOrigin>(DEFAULT_DOSE_ORIGIN)

// The toast after giving or undoing the dose, tied to the screen it belongs to.
export const toastAtom = atom<{ screen: DoseOrigin; kind: 'given' | 'undone' } | null>(null)
