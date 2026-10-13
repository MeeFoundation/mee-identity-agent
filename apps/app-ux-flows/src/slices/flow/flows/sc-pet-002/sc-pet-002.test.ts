import { describe, expect, it } from 'vitest'

import { en } from '@/app/locales/en'

import { apoquelMedication } from '../../pods/ginger/apoquel-fixture'
import { toDoseHistory } from '../../pods/ginger/dose-history'
import { toDoseStatus } from '../../pods/ginger/dose-status'
import {
  CURRENT_MEDICATION_ID,
  doseHistoryAtom,
  giveDoseAtom,
  medicationAtom,
  medicationDoseAtom,
  PARTICIPANT_ID,
  undoDoseAtom,
} from '../../pods/ginger/model'
import { findFlow } from '../../registry'
import { resolveFlow } from '../../runtime/resolve-flow'
import { scPet002Flow } from './flow'
import { doseTimes, toastAtom } from './model'

// Resolves an i18next key such as `flows.scPet002.title` against the English strings.
const translate = (key: string): unknown =>
  key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], en)

const caseRun = (caseId: string) => resolveFlow(scPet002Flow, null, caseId).createStore()

describe('SC-PET-002 Medication doses', () => {
  it('is a registered showcase with two cases, both starting on Medical', () => {
    expect(scPet002Flow.kind).toBe('showcase')
    expect(scPet002Flow.code).toBe('SC-PET-002')
    expect(scPet002Flow.initialScreen).toBe('medical')
    expect(findFlow('sc-pet-002')).toBe(scPet002Flow)
    expect(resolveFlow(scPet002Flow, null).cases.map(({ id, code }) => [id, code])).toEqual([
      ['a', 'SC-PET-002-A'],
      ['b', 'SC-PET-002-B'],
    ])
  })

  it('declares its screens and the Figma frames they implement', () => {
    expect(Object.keys(scPet002Flow.screens).sort()).toEqual(['dose-history', 'give-dose', 'medical', 'undo-dose'])
    expect(
      Object.fromEntries(Object.entries(scPet002Flow.designFrames ?? {}).map(([id, frame]) => [id, frame?.name])),
    ).toEqual({
      'dose-history': 'SC-PET-002-B - Dose history',
      'give-dose': 'SC-PET-002-A - Give dose (sheet over Medical)',
      medical: 'SC-PET-002-A - Medical (dose overdue)',
      'undo-dose': 'SC-PET-002-B - Undo dose (sheet over Medical)',
    })
  })

  it('translates every key it declares', () => {
    const keys = ['a', 'b'].flatMap((caseId) => {
      const flow = resolveFlow(scPet002Flow, null, caseId)
      return [
        flow.titleKey,
        flow.descriptionKey,
        flow.goalKey,
        flow.caseNameKey,
        ...Object.values(flow.hints),
        ...flow.notes.flow.questionKeys,
        flow.notes.case?.aboutKey,
        ...(flow.notes.case?.questionKeys ?? []),
        ...Object.values(flow.notes.screens).flatMap((note) => [note?.aboutKey, ...(note?.questionKeys ?? [])]),
      ]
    })
    for (const key of keys) expect(typeof translate(key ?? ''), String(key)).toBe('string')
  })

  it('starts case A with Apoquel overdue since three hours before the run', () => {
    const now = new Date('2026-10-13T10:30:00')
    expect(doseTimes('overdue', now)).toEqual({ scheduledAt: new Date('2026-10-13T07:30:00') })

    const store = caseRun('a')
    expect(store.get(medicationAtom)).toBe(apoquelMedication)
    expect(store.get(medicationDoseAtom).status).toBe('due')
    expect(toDoseStatus(store.get(medicationDoseAtom), new Date())).toBe('overdue')
    expect(store.get(toastAtom)).toBeNull()
  })

  it('starts case B with the dose given by the participant a few minutes ago', () => {
    const now = new Date('2026-10-13T10:30:00')
    expect(doseTimes('given-by-mistake', now)).toEqual({
      givenAt: new Date('2026-10-13T10:20:00'),
      scheduledAt: new Date('2026-10-13T10:15:00'),
    })

    const dose = caseRun('b').get(medicationDoseAtom)
    expect(dose).toMatchObject({ givenBy: PARTICIPANT_ID, status: 'given' })
    expect(toDoseStatus(dose, new Date())).toBe('given')
  })

  it('builds the history back from the scheduled dose, with Sam giving the previous one', () => {
    const store = caseRun('a')
    const [previous] = store.get(doseHistoryAtom)
    const scheduled = new Date(store.get(medicationDoseAtom).scheduledAt).getTime()
    expect(previous).toMatchObject({ givenBy: 'sam', medicationId: CURRENT_MEDICATION_ID, status: 'given' })
    expect(new Date(previous?.scheduledAt ?? '').getTime()).toBe(scheduled - 12 * 3_600_000)
  })

  it('gives the overdue dose late, and undoing a mistaken dose removes it from the history', () => {
    const a = caseRun('a')
    a.set(giveDoseAtom, new Date())
    expect(a.get(medicationDoseAtom).status).toBe('given')

    const b = caseRun('b')
    const all = { medicationId: 'all', period: 'all' } as const
    const before = toDoseHistory(b.get(medicationDoseAtom), b.get(doseHistoryAtom), all, new Date())
    b.set(undoDoseAtom)
    const after = toDoseHistory(b.get(medicationDoseAtom), b.get(doseHistoryAtom), all, new Date())

    expect(toDoseStatus(b.get(medicationDoseAtom), new Date())).toBe('due')
    expect(after).toHaveLength(before.length - 1)
    expect(after[0]?.givenBy).toBe('sam')
  })
})
