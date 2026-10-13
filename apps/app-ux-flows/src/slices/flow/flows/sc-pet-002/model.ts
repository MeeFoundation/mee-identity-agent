import { atom } from 'jotai'

import type { GingerPodComponents } from '../../pods/ginger/model'

export type ScPet002ScreenId = 'medical' | 'give-dose' | 'undo-dose' | 'dose-history'

export type ScPet002Components = GingerPodComponents

// The dose each case starts from: overdue since the morning, or marked as given a few minutes ago by mistake.
export type DoseStart = 'overdue' | 'given-by-mistake'

export type ScPet002InitialState = {
  doseStart?: DoseStart
}

export const DEFAULT_DOSE_START: DoseStart = 'overdue'

const MINUTE_MS = 60_000

// Relative to the run's start, so the case reads the same whenever it is shown.
export const doseTimes = (doseStart: DoseStart, now: Date) =>
  doseStart === 'overdue'
    ? { scheduledAt: new Date(now.getTime() - 180 * MINUTE_MS) }
    : { givenAt: new Date(now.getTime() - 10 * MINUTE_MS), scheduledAt: new Date(now.getTime() - 15 * MINUTE_MS) }

// The toast on Medical after the dose is given or undone.
export const toastAtom = atom<'given' | 'undone' | null>(null)
