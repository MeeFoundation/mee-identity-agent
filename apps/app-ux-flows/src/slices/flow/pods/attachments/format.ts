import type { TFunction } from 'i18next'

import type { Attachment } from './model'

// Decimal units, as file sizes are shown on phones.
const sizeUnits = [
  { bytes: 1, key: 'pods.attachments.size.b' },
  { bytes: 1e3, key: 'pods.attachments.size.kb' },
  { bytes: 1e6, key: 'pods.attachments.size.mb' },
  { bytes: 1e9, key: 'pods.attachments.size.gb' },
] as const

// "10 MB", "1.5 MB", "143 KB": one decimal below 10, whole numbers from 10 up.
export const formatFileSize = (bytes: number, t: TFunction, language: string) => {
  // A size that would round up to 1000 of a unit is shown in the next one, so 999,999 bytes reads "1 MB".
  const unit = sizeUnits.reduce((found, candidate) => (bytes >= candidate.bytes * 0.9995 ? candidate : found))
  const value = bytes / unit.bytes
  const fractionDigits = unit.bytes > 1 && value < 9.95 ? 1 : 0
  const number = new Intl.NumberFormat(language, { maximumFractionDigits: fractionDigits }).format(value)
  return t(unit.key, { value: number })
}

// "Aug 7" this year, "Jan 23, 2025" in any other.
export const formatAttachmentDate = (iso: string, now: Date, language: string) => {
  const [year = 0, month = 1, day = 1] = iso.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return new Intl.DateTimeFormat(language, {
    day: 'numeric',
    month: 'short',
    ...(year !== now.getFullYear() && { year: 'numeric' }),
  }).format(date)
}

// "10 MB · Aug 7": the line under an attachment's name.
export const toAttachmentDetail = (attachment: Attachment, now: Date, t: TFunction, language: string) =>
  t('pods.attachments.detail', {
    date: formatAttachmentDate(attachment.addedAt, now, language),
    size: formatFileSize(attachment.sizeBytes, t, language),
  })
