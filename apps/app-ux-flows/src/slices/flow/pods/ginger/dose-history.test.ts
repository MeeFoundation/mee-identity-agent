import { createInstance } from 'i18next'
import { describe, expect, it } from 'vitest'

import { en } from '@/app/locales/en'

import { formatDayLabel, groupByDay, lastGivenDose, memberName, toDoseHistory } from './dose-history'
import { CURRENT_MEDICATION_ID, type DoseEvent, type MedicationDose, PARTICIPANT_ID } from './model'

const now = new Date('2026-10-13T10:00:00')
const daysAgo = (days: number, hour = 8) => {
  const date = new Date(now)
  date.setDate(now.getDate() - days)
  date.setHours(hour, 0, 0, 0)
  return date.toISOString()
}

const event = (
  id: string,
  medicationId: string,
  scheduledAt: string,
  status: DoseEvent['status'] = 'given',
): DoseEvent => ({
  ...(status === 'given' ? { givenAt: scheduledAt, givenBy: 'sam' } : {}),
  id,
  medicationId,
  scheduledAt,
  status,
})

const past: DoseEvent[] = [
  event('a', CURRENT_MEDICATION_ID, daysAgo(0, 8)),
  event('b', CURRENT_MEDICATION_ID, daysAgo(1, 20), 'missed'),
  event('c', CURRENT_MEDICATION_ID, daysAgo(6)),
  event('d', CURRENT_MEDICATION_ID, daysAgo(20)),
  event('e', 'clavamox-2025', daysAgo(200)),
  event('f', 'metacam-2024', daysAgo(500)),
]

const due: MedicationDose = { scheduledAt: now.toISOString(), status: 'due' }
const given: MedicationDose = {
  givenAt: now.toISOString(),
  givenBy: PARTICIPANT_ID,
  scheduledAt: now.toISOString(),
  status: 'given',
}

const ids = (doses: DoseEvent[]) => doses.map((dose) => dose.id)

describe('toDoseHistory', () => {
  it('keeps each period to its window, newest first', () => {
    expect(ids(toDoseHistory(due, past, { medicationId: 'all', period: '7d' }, now))).toEqual(['a', 'b', 'c'])
    expect(ids(toDoseHistory(due, past, { medicationId: 'all', period: '30d' }, now))).toEqual(['a', 'b', 'c', 'd'])
    expect(ids(toDoseHistory(due, past, { medicationId: 'all', period: '1y' }, now))).toEqual(['a', 'b', 'c', 'd', 'e'])
    expect(ids(toDoseHistory(due, past, { medicationId: 'all', period: 'all' }, now))).toEqual([
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
    ])
  })

  it('filters by course', () => {
    expect(ids(toDoseHistory(due, past, { medicationId: 'clavamox-2025', period: 'all' }, now))).toEqual(['e'])
    expect(toDoseHistory(due, past, { medicationId: 'metacam-2024', period: '30d' }, now)).toEqual([])
  })

  it('lists the current dose only once given, as the newest entry', () => {
    expect(ids(toDoseHistory(given, past, { medicationId: CURRENT_MEDICATION_ID, period: '7d' }, now))[0]).toBe(
      'current-dose',
    )
    expect(ids(toDoseHistory(due, past, { medicationId: CURRENT_MEDICATION_ID, period: '7d' }, now))).not.toContain(
      'current-dose',
    )
    expect(toDoseHistory(given, past, { medicationId: 'clavamox-2025', period: 'all' }, now)).toHaveLength(1)
  })
})

describe('groupByDay', () => {
  it('groups consecutive doses by local day', () => {
    const days = groupByDay([
      event('x', 'm', daysAgo(0, 20)),
      event('y', 'm', daysAgo(0, 8)),
      event('z', 'm', daysAgo(1, 20)),
    ])
    expect(days.map((day) => day.doses.map((dose) => dose.id))).toEqual([['x', 'y'], ['z']])
  })
})

describe('lastGivenDose', () => {
  it('skips missed doses and other courses', () => {
    expect(lastGivenDose(past, CURRENT_MEDICATION_ID)?.id).toBe('a')
    expect(lastGivenDose([past[1] as DoseEvent], CURRENT_MEDICATION_ID)).toBeUndefined()
  })
})

describe('labels', async () => {
  const i18n = createInstance()
  await i18n.init({ interpolation: { escapeValue: false }, lng: 'en', resources: { en: { translation: en } } })

  it('names days relative to now', () => {
    expect(formatDayLabel('2026-10-13', now, i18n.t, 'en')).toBe('Today')
    expect(formatDayLabel('2026-10-12', now, i18n.t, 'en')).toBe('Yesterday')
    expect(formatDayLabel('2026-10-05', now, i18n.t, 'en')).toBe('Mon, Oct 5')
    expect(formatDayLabel('2025-03-02', now, i18n.t, 'en')).toBe('Sun, Mar 2, 2025')
  })

  it('names the participant You and others by name', () => {
    const members = [{ id: 'sam', name: 'Sam' }]
    expect(memberName(PARTICIPANT_ID, members, i18n.t)).toBe('You')
    expect(memberName('sam', members, i18n.t)).toBe('Sam')
  })
})
