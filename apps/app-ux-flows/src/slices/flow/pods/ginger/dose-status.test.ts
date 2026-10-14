import { describe, expect, it } from 'vitest'

import { formatDoseTime, toDoseStatus } from './dose-status'
import type { MedicationDose } from './model'

const scheduledAt = '2026-10-13T10:00:00'
const due: MedicationDose = { scheduledAt, status: 'due' }
const at = (time: string) => new Date(`2026-10-13T${time}`)

describe('toDoseStatus', () => {
  it('is upcoming before the due window opens', () => {
    expect(toDoseStatus(due, at('08:59:59'))).toBe('upcoming')
  })

  it('is due at both edges of the window', () => {
    expect(toDoseStatus(due, at('09:00:00'))).toBe('due')
    expect(toDoseStatus(due, at('10:00:00'))).toBe('due')
    expect(toDoseStatus(due, at('11:00:00'))).toBe('due')
  })

  it('is overdue once the window has passed', () => {
    expect(toDoseStatus(due, at('11:00:01'))).toBe('overdue')
  })

  it('honours a custom window', () => {
    expect(toDoseStatus(due, at('10:16:00'), { dueWindowMinutes: 15 })).toBe('overdue')
  })

  it('is given whatever the time', () => {
    const given: MedicationDose = { givenAt: scheduledAt, scheduledAt, status: 'given' }
    expect(toDoseStatus(given, at('06:00:00'))).toBe('given')
    expect(toDoseStatus(given, at('18:00:00'))).toBe('given')
  })
})

describe('formatDoseTime', () => {
  it('uses the short time format of the language', () => {
    expect(formatDoseTime('2026-10-13T10:32:00', 'en')).toBe('10:32 AM')
  })
})
