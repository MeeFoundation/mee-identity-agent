import type { TFunction } from 'i18next'

import type { MedicationRecord } from './model'

export type MedicationFieldRow = {
  id: 'activeIngredient' | 'brandName' | 'manufacturer' | 'dose' | 'doseForm' | 'frequency' | 'startDate'
  label: string
  value: string
}

const wholeNumberPattern = /^\d+$/
const isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/

const formatFrequency = (frequencyPerDay: string, t: TFunction) => {
  const trimmed = frequencyPerDay.trim()
  if (!wholeNumberPattern.test(trimmed) || Number(trimmed) === 0) return frequencyPerDay
  return t('pods.ginger.medication.frequency', { count: Number(trimmed) })
}

// Parsed as a local calendar date: `new Date('2026-10-06')` is UTC midnight and shows the previous day west of UTC.
const formatStartDate = (startDate: string, language: string) => {
  const match = isoDatePattern.exec(startDate)
  if (!match) return startDate
  const [, year, month, day] = match
  return new Intl.DateTimeFormat(language, { dateStyle: 'medium' }).format(
    new Date(Number(year), Number(month) - 1, Number(day)),
  )
}

const formatDose = (dosage: MedicationRecord['dosage'], language: string) => {
  const value = new Intl.NumberFormat(language).format(dosage.value)
  return dosage.unit ? `${value} ${dosage.unit.symbol}` : value
}

// The brand a pet owner knows the medication by, or its ingredients when it has none.
const medicationName = (record: MedicationRecord) =>
  record.brandName ?? record.activeIngredients.map((ingredient) => ingredient.label).join(', ')

export type MedicationSummary = {
  name: string
  dose: string
  frequency: string
  startDate?: string
}

// What a list shows of a medication before its details are opened.
export const toMedicationSummary = (record: MedicationRecord, t: TFunction, language: string): MedicationSummary => ({
  dose: formatDose(record.dosage, language),
  frequency: formatFrequency(record.frequencyPerDay, t),
  name: medicationName(record),
  ...(record.startDate ? { startDate: formatStartDate(record.startDate, language) } : {}),
})

export const toMedicationFieldRows = (
  record: MedicationRecord,
  t: TFunction,
  language: string,
): MedicationFieldRow[] => {
  const label = (id: MedicationFieldRow['id']) => t(`pods.ginger.medication.fields.${id}`)

  const rows: (MedicationFieldRow | null)[] = [
    {
      id: 'activeIngredient',
      label: label('activeIngredient'),
      value: record.activeIngredients.map((ingredient) => ingredient.label).join(', '),
    },
    record.brandName ? { id: 'brandName', label: label('brandName'), value: record.brandName } : null,
    record.manufacturer ? { id: 'manufacturer', label: label('manufacturer'), value: record.manufacturer } : null,
    {
      id: 'dose',
      label: label('dose'),
      value: formatDose(record.dosage, language),
    },
    record.doseForm ? { id: 'doseForm', label: label('doseForm'), value: record.doseForm.label } : null,
    { id: 'frequency', label: label('frequency'), value: formatFrequency(record.frequencyPerDay, t) },
    record.startDate
      ? { id: 'startDate', label: label('startDate'), value: formatStartDate(record.startDate, language) }
      : null,
  ]

  return rows.filter((row) => row !== null)
}
