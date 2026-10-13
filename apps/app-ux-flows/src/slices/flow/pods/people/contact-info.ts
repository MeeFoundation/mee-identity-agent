import type { TFunction } from 'i18next'

// A person's contact details, shaped after the ontology's `ContactInfoShape`. Dates are ISO `YYYY-MM-DD`.
export type ContactInfoRecord = {
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  email?: string
}

export type ContactInfoField = keyof ContactInfoRecord

const contactInfoFields: readonly ContactInfoField[] = ['firstName', 'lastName', 'dateOfBirth', 'email']

export type ContactInfoFieldRow = {
  id: ContactInfoField
  label: string
  value: string
}

const isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/

// Parsed as a local calendar date: `new Date('2018-04-08')` is UTC midnight and shows the previous day west of UTC.
const formatDate = (date: string, language: string) => {
  const match = isoDatePattern.exec(date)
  if (!match) return date
  const [, year, month, day] = match
  return new Intl.DateTimeFormat(language, { dateStyle: 'long' }).format(
    new Date(Number(year), Number(month) - 1, Number(day)),
  )
}

export const contactFullName = (record: ContactInfoRecord) =>
  [record.firstName, record.lastName].filter(Boolean).join(' ')

// One row per field that has a value, in the order of the Contact info form.
export const toContactInfoFieldRows = (
  record: ContactInfoRecord,
  t: TFunction,
  language: string,
): ContactInfoFieldRow[] =>
  contactInfoFields.flatMap((id) => {
    const value = record[id]
    if (!value) return []
    return [
      {
        id,
        label: t(`pods.people.contactInfo.fields.${id}`),
        value: id === 'dateOfBirth' ? formatDate(value, language) : value,
      },
    ]
  })
