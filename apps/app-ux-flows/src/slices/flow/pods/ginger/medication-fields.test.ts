import { createInstance } from 'i18next'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'

import { toMedicationFieldRows, toMedicationSummary } from './medication-fields'
import { gingerMedication, type MedicationRecord } from './model'
import { en } from '@/app/locales/en'

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

describe('toMedicationSummary', () => {
  const summaryOf = (record: MedicationRecord) => toMedicationSummary(record, i18n.t, 'en')

  it('summarises the default record by brand name, dose, frequency and start date', () => {
    expect(summaryOf(gingerMedication)).toEqual({
      dose: '62.5 mg',
      frequency: '2 times per day',
      name: 'Clavamox',
      startDate: 'Oct 6, 2026',
    })
  })

  it('names a medication without a brand by its active ingredients', () => {
    const { brandName: _brandName, ...unbranded } = gingerMedication
    const record: MedicationRecord = {
      ...unbranded,
      activeIngredients: [
        { iri: 'http://purl.obolibrary.org/obo/CHEBI_2676', label: 'Amoxicillin' },
        { iri: 'http://purl.obolibrary.org/obo/CHEBI_48947', label: 'Clavulanic acid' },
      ],
    }

    expect(summaryOf(record).name).toBe('Amoxicillin, Clavulanic acid')
  })

  it('formats the dose with or without a unit', () => {
    expect(summaryOf(gingerMedication).dose).toBe('62.5 mg')
    expect(summaryOf({ ...gingerMedication, dosage: { value: 1 } }).dose).toBe('1')
  })

  it('formats the frequency as the field rows do', () => {
    expect(summaryOf({ ...gingerMedication, frequencyPerDay: '1' }).frequency).toBe('Once per day')
    expect(summaryOf({ ...gingerMedication, frequencyPerDay: 'as needed' }).frequency).toBe('as needed')
  })

  it('leaves out the start date when the record has none', () => {
    const { startDate: _startDate, ...undated } = gingerMedication

    expect(summaryOf(undated)).not.toHaveProperty('startDate')
  })
})
