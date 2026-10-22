import { createInstance } from 'i18next'
import { describe, expect, it } from 'vitest'

import { formatAttachmentDate, formatFileSize, toAttachmentDetail } from './format'
import { sofiaAttachments } from './sofia-fixture'
import { en } from '@/app/locales/en'

const i18n = createInstance()
i18n.init({
  initAsync: false,
  interpolation: { escapeValue: false },
  lng: 'en',
  resources: { en: { translation: en } },
})
const { t } = i18n

const now = new Date(2026, 9, 16)

describe('formatFileSize', () => {
  it.each([
    [10_000_000, '10 MB'],
    [1_500_000, '1.5 MB'],
    [143_000, '143 KB'],
    [12_000, '12 KB'],
    [512, '512 B'],
    [2_000_000_000, '2 GB'],
  ])('shows %i bytes as %s', (bytes, expected) => {
    expect(formatFileSize(bytes, t, 'en')).toBe(expected)
  })

  it('moves to the next unit instead of showing 1000 of one', () => {
    expect(formatFileSize(999_999, t, 'en')).toBe('1 MB')
    expect(formatFileSize(999, t, 'en')).toBe('999 B')
  })
})

describe('formatAttachmentDate', () => {
  it('shows the month and day for a date this year', () => {
    expect(formatAttachmentDate('2026-08-07', now, 'en')).toBe('Aug 7')
  })

  it('adds the year for a date in another year', () => {
    expect(formatAttachmentDate('2025-01-23', now, 'en')).toBe('Jan 23, 2025')
  })
})

describe('toAttachmentDetail', () => {
  it('matches the Attachments design for Sofia’s files', () => {
    expect(sofiaAttachments.map((attachment) => toAttachmentDetail(attachment, now, t, 'en'))).toEqual([
      '10 MB · Aug 7',
      '1.5 MB · Jun 19',
      '143 KB · May 11',
      '12 KB · Jan 23',
    ])
  })
})
