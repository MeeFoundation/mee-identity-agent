import {
  CURRENT_MEDICATION_ID,
  type DoseEvent,
  gingerPod,
  type MedicationCourse,
  type MedicationDose,
  type MedicationRecord,
  PARTICIPANT_ID,
  type Pod,
  type PodMember,
} from './model'

// Shaped after `pets:Medication`; Ginger takes it twice a day, so one dose is always scheduled.
export const apoquelMedication: MedicationRecord = {
  activeIngredients: [{ iri: 'http://purl.obolibrary.org/obo/CHEBI_750506', label: 'Oclacitinib' }],
  brandName: 'Apoquel',
  dosage: {
    unit: {
      iri: 'https://www.commoncoreontologies.org/ont00001413',
      label: 'Milligram Measurement Unit',
      symbol: 'mg',
    },
    value: 16,
  },
  doseForm: { iri: 'http://purl.obolibrary.org/obo/DRON_00000022', label: 'Tablet' },
  frequencyPerDay: '2',
  manufacturer: 'Zoetis',
  startDate: '2026-09-14',
}

const mg = {
  iri: 'https://www.commoncoreontologies.org/ont00001413',
  label: 'Milligram Measurement Unit',
  symbol: 'mg',
}
const tablet = { iri: 'http://purl.obolibrary.org/obo/DRON_00000022', label: 'Tablet' }

// Finished courses: Ginger is an older cat with years of history.
export const pastCourses: readonly MedicationCourse[] = [
  {
    id: 'clavamox-2025',
    record: {
      activeIngredients: [{ iri: 'http://purl.obolibrary.org/obo/CHEBI_2676', label: 'Amoxicillin' }],
      brandName: 'Clavamox',
      dosage: { unit: mg, value: 62.5 },
      doseForm: tablet,
      endDate: '2025-03-11',
      frequencyPerDay: '2',
      manufacturer: 'Zoetis',
      startDate: '2025-03-02',
    },
  },
  {
    id: 'metacam-2024',
    record: {
      activeIngredients: [{ label: 'Meloxicam' }],
      brandName: 'Metacam',
      dosage: { unit: mg, value: 0.5 },
      doseForm: { label: 'Liquid' },
      endDate: '2024-06-23',
      frequencyPerDay: '1',
      manufacturer: 'Boehringer Ingelheim',
      startDate: '2024-06-10',
    },
  },
  {
    id: 'felimazole-2023',
    record: {
      activeIngredients: [{ label: 'Methimazole' }],
      brandName: 'Felimazole',
      dosage: { unit: mg, value: 2.5 },
      doseForm: tablet,
      endDate: '2024-01-09',
      frequencyPerDay: '2',
      manufacturer: 'Dechra',
      startDate: '2023-01-10',
    },
  },
  {
    id: 'prednisolone-2021',
    record: {
      activeIngredients: [{ label: 'Prednisolone' }],
      brandName: 'Prednisolone',
      dosage: { unit: mg, value: 5 },
      doseForm: tablet,
      endDate: '2021-11-14',
      frequencyPerDay: '1',
      startDate: '2021-11-01',
    },
  },
]

const SAM_ID = 'sam'

export const gingerMembers: readonly PodMember[] = [{ id: SAM_ID, name: 'Sam' }]

// The participant and Sam share Ginger's pod.
export const gingerSharedPod: Pod = { ...gingerPod, memberCount: 1 + gingerMembers.length }

const HOUR_MS = 3_600_000

const toEvent = (medicationId: string, index: number, slot: Date): DoseEvent => {
  const id = `${medicationId}-${index}`
  const scheduledAt = slot.toISOString()
  if (index % 23 === 22) return { id, medicationId, scheduledAt, status: 'missed' }
  const lateMinutes = index === 0 ? 2 : (index * 7) % 25
  return {
    givenAt: new Date(slot.getTime() + lateMinutes * 60_000).toISOString(),
    // Sam gave the previous dose; after that the two take turns unevenly.
    givenBy: index === 0 || index % 3 !== 0 ? SAM_ID : PARTICIPANT_ID,
    id,
    medicationId,
    scheduledAt,
    status: 'given',
  }
}

const localDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year ?? 0, (month ?? 1) - 1, day ?? 1)
}

// Doses at fixed local times on each day of a finished course, newest first.
const courseEvents = ({ id, record }: MedicationCourse): DoseEvent[] => {
  if (!record.startDate || !record.endDate) return []
  const hours = record.frequencyPerDay === '2' ? [20, 8] : [8]
  const slots: Date[] = []
  for (let day = localDate(record.endDate); day >= localDate(record.startDate); day.setDate(day.getDate() - 1))
    for (const hour of hours) slots.push(new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour))
  return slots.map((slot, index) => toEvent(id, index, slot))
}

// The current medication every 12 hours back from the current dose to its start date, then the past courses.
export const createDoseHistory = (
  currentScheduledAt: Date,
  medication: MedicationRecord = apoquelMedication,
): DoseEvent[] => {
  const start = medication.startDate ? localDate(medication.startDate).getTime() : currentScheduledAt.getTime()
  const scheduled = currentScheduledAt.getTime()
  const current: DoseEvent[] = []
  for (let index = 0; scheduled - (index + 1) * 12 * HOUR_MS >= start; index++)
    current.push(toEvent(CURRENT_MEDICATION_ID, index, new Date(scheduled - (index + 1) * 12 * HOUR_MS)))
  return [...current, ...pastCourses.flatMap(courseEvents)]
}

// The current dose; given by the participant at `givenAt` when supplied.
export const createScheduledDose = (scheduledAt: Date, givenAt?: Date): MedicationDose =>
  givenAt
    ? {
        givenAt: givenAt.toISOString(),
        givenBy: PARTICIPANT_ID,
        scheduledAt: scheduledAt.toISOString(),
        status: 'given',
      }
    : { scheduledAt: scheduledAt.toISOString(), status: 'due' }
