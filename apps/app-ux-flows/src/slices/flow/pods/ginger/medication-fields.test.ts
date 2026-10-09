import { createInstance } from 'i18next'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'

import { en } from '@/app/locales/en'

import { toMedicationFieldRows } from './medication-fields'
import { gingerMedication, type MedicationRecord } from './model'

const i18n = createInstance()

beforeAll(async () => {
  await i18n.init({ interpolation: { escapeValue: false }, lng: 'en', resources: { en: { translation: en } } })
})

const originalTimeZone = process.env.TZ

afterEach(() => {
  process.env.TZ = originalTimeZone
})

const rowsOf = (record: MedicationRecord) => toMedicationFieldRows(record, i18n.t, 'en')
const fieldValue = (record: MedicationRecord, id: string) => rowsOf(record).find((row) => row.id === id)?.value

describe('toMedicationFieldRows', () => {
  it('formats the default record as the seven rows of the Figma frame, in order', () => {
    expect(rowsOf(gingerMedication).map(({ label, value }) => [label, value])).toEqual([
      ['Medication / Active ingredient', 'Amoxicillin'],
      ['Brand name', 'Clavamox'],
      ['Manufacturer', 'Zoetis'],
      ['Dose', '62.5 mg'],
      ['Dose form', 'Tablet'],
      ['Frequency', '2 times per day'],
      ['Start date', 'Oct 6, 2026'],
    ])
  })

  it('shows a frequency of 1 as once per day', () => {
    expect(fieldValue({ ...gingerMedication, frequencyPerDay: '1' }, 'frequency')).toBe('Once per day')
  })

  it('passes a free-text frequency through unchanged', () => {
    expect(fieldValue({ ...gingerMedication, frequencyPerDay: 'as needed' }, 'frequency')).toBe('as needed')
  })

  it('shows only the value when the dose has no unit', () => {
    expect(fieldValue({ ...gingerMedication, dosage: { value: 1 } }, 'dose')).toBe('1')
  })

  it('joins several active ingredients', () => {
    const record: MedicationRecord = {
      ...gingerMedication,
      activeIngredients: [
        { iri: 'http://purl.obolibrary.org/obo/CHEBI_2676', label: 'Amoxicillin' },
        { iri: 'http://purl.obolibrary.org/obo/CHEBI_48947', label: 'Clavulanic acid' },
      ],
    }

    expect(fieldValue(record, 'activeIngredient')).toBe('Amoxicillin, Clavulanic acid')
  })

  it('leaves out missing optional fields', () => {
    const {
      brandName: _brandName,
      manufacturer: _manufacturer,
      doseForm: _doseForm,
      startDate: _startDate,
      ...rest
    } = gingerMedication

    expect(rowsOf(rest).map((row) => row.id)).toEqual(['activeIngredient', 'dose', 'frequency'])
  })

  it('does not shift the start date in a time zone west of UTC', () => {
    process.env.TZ = 'America/Sao_Paulo'

    expect(fieldValue(gingerMedication, 'startDate')).toBe('Oct 6, 2026')
  })
})
