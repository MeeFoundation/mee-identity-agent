import type { TFunction } from 'i18next'

import type { MedicationRecord } from './model'

type MedicationFieldRow = {
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

export const toMedicationFieldRows = (
  record: MedicationRecord,
  t: TFunction,
  language: string,
): MedicationFieldRow[] => {
  const label = (id: MedicationFieldRow['id']) => t(`pods.ginger.medication.fields.${id}`)
  const dose = new Intl.NumberFormat(language).format(record.dosage.value)

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
      value: record.dosage.unit ? `${dose} ${record.dosage.unit.symbol}` : dose,
    },
    record.doseForm ? { id: 'doseForm', label: label('doseForm'), value: record.doseForm.label } : null,
    { id: 'frequency', label: label('frequency'), value: formatFrequency(record.frequencyPerDay, t) },
    record.startDate
      ? { id: 'startDate', label: label('startDate'), value: formatStartDate(record.startDate, language) }
      : null,
  ]

  return rows.filter((row) => row !== null)
}
