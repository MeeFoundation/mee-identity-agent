import { createInstance } from 'i18next'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'

import { type ContactInfoRecord, contactFullName, toContactInfoFieldRows } from './contact-info'
import { en } from '@/app/locales/en'

const i18n = createInstance()

beforeAll(async () => {
  await i18n.init({ interpolation: { escapeValue: false }, lng: 'en', resources: { en: { translation: en } } })
})

const originalTimeZone = process.env.TZ

afterEach(() => {
  process.env.TZ = originalTimeZone
})

const rowsOf = (record: ContactInfoRecord) =>
  toContactInfoFieldRows(record, i18n.t, 'en').map(({ label, value }) => [label, value])

describe('toContactInfoFieldRows', () => {
  it('shows every field in form order with the date written out', () => {
    expect(
      rowsOf({ dateOfBirth: '2018-04-08', email: 'sofia@example.com', firstName: 'Sofia', lastName: 'Walker' }),
    ).toEqual([
      ['First name', 'Sofia'],
      ['Last name', 'Walker'],
      ['Date of birth', 'April 8, 2018'],
      ['Email', 'sofia@example.com'],
    ])
  })

  it('leaves out empty fields', () => {
    expect(rowsOf({ email: 'sofia@example.com', firstName: '' })).toEqual([['Email', 'sofia@example.com']])
    expect(rowsOf({})).toEqual([])
  })

  it('keeps the calendar date west of UTC', () => {
    process.env.TZ = 'America/Los_Angeles'
    expect(rowsOf({ dateOfBirth: '2018-04-08' })).toEqual([['Date of birth', 'April 8, 2018']])
  })
})

describe('contactFullName', () => {
  it('joins the names that are set', () => {
    expect(contactFullName({ firstName: 'Sofia', lastName: 'Walker' })).toBe('Sofia Walker')
    expect(contactFullName({ firstName: 'Sofia' })).toBe('Sofia')
    expect(contactFullName({})).toBe('')
  })
})
