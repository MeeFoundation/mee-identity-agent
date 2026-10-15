import { createInstance } from 'i18next'
import { describe, expect, it } from 'vitest'

import { en } from '@/app/locales/en'

import { apoquelMedication, createDoseHistory, gingerSharedPod, pastCourses } from '../../pods/ginger/apoquel-fixture'
import { toDoseStatus } from '../../pods/ginger/dose-status'
import { toMedicationSummary } from '../../pods/ginger/medication-fields'
import {
  CURRENT_MEDICATION_ID,
  doseHistoryAtom,
  doseHistoryFilterAtom,
  giveDoseAtom,
  medicationAtom,
  medicationCoursesAtom,
  medicationDoseAtom,
  PARTICIPANT_ID,
  podAtom,
  podMembersAtom,
  undoDoseAtom,
} from '../../pods/ginger/model'
import { renderScreen } from '../../runtime/render-screen'
import { resolveFlow } from '../../runtime/resolve-flow'
import { expPet005Flow } from './flow'
import { type DoseOrigin, doseOriginAtom, doseSurfaceAtom, toastAtom, toEntryPoint } from './model'

const variantIds = Object.keys(expPet005Flow.variants ?? {})

const screenIds = [
  'home',
  'ginger-notes',
  'ginger-info',
  'medical',
  'medication',
  'give-dose',
  'undo-dose',
  'dose-history',
]

describe('exp-pet-005 flow', () => {
  it('is an experiment whose three variants are chosen explicitly, with unique codes', () => {
    expect(expPet005Flow.kind).toBe('experiment')
    expect(expPet005Flow.variantSelection).toBe('explicit')
    expect(variantIds).toEqual(['a', 'b', 'c'])
    expect(variantIds.map((id) => resolveFlow(expPet005Flow, id).variantCode)).toEqual([
      'EXP-PET-005-A',
      'EXP-PET-005-B',
      'EXP-PET-005-C',
    ])
  })

  it('gives each variant its own promoted surface and nothing else', () => {
    expect(variantIds.map((id) => resolveFlow(expPet005Flow, id).createStore().get(doseSurfaceAtom))).toEqual([
      'medical',
      'pod',
      'home',
    ])
  })

  it('implements every screen in every variant', () => {
    for (const id of variantIds) {
      const flow = resolveFlow(expPet005Flow, id)
      expect(Object.keys(flow.screens).sort()).toEqual([...screenIds].sort())
      for (const screenId of screenIds) expect(flow.screens[screenId as keyof typeof flow.screens]).toBeTruthy()
    }
  })

  it('starts on Home with Ginger, Apoquel twice a day and one dose due now', async () => {
    const i18n = createInstance()
    await i18n.init({ interpolation: { escapeValue: false }, lng: 'en', resources: { en: { translation: en } } })
    const store = expPet005Flow.createStore()
    expect(expPet005Flow.initialScreen).toBe('home')
    expect(store.get(podAtom)).toBe(gingerSharedPod)
    expect(store.get(podAtom).memberCount).toBe(2)
    expect(store.get(podMembersAtom).map((member) => member.name)).toEqual(['Sam'])
    expect(store.get(medicationCoursesAtom)).toBe(pastCourses)
    expect(store.get(doseHistoryFilterAtom)).toEqual({ medicationId: 'all', period: '30d' })
    expect(store.get(medicationAtom)).toBe(apoquelMedication)
    expect(toMedicationSummary(apoquelMedication, i18n.t, 'en')).toMatchObject({
      dose: '16 mg',
      frequency: '2 times per day',
      name: 'Apoquel',
    })
    expect(store.get(medicationDoseAtom).status).toBe('due')
    expect(toDoseStatus(store.get(medicationDoseAtom), new Date())).toBe('due')
    expect(store.get(doseOriginAtom)).toBe('medical')
    expect(store.get(toastAtom)).toBeNull()
  })

  it('can start with the dose already given', () => {
    const dose = expPet005Flow.createStore({ doseGiven: true }).get(medicationDoseAtom)
    expect(dose.status).toBe('given')
    expect(dose.givenAt).toBe(dose.scheduledAt)
  })

  it('records the dose without touching the medication', () => {
    const store = expPet005Flow.createStore()
    const medication = store.get(medicationAtom)
    const { scheduledAt } = store.get(medicationDoseAtom)
    const now = new Date('2026-10-13T10:32:00Z')

    store.set(giveDoseAtom, now)

    expect(store.get(medicationDoseAtom)).toEqual({
      givenAt: now.toISOString(),
      givenBy: PARTICIPANT_ID,
      scheduledAt,
      status: 'given',
    })
    expect(store.get(medicationAtom)).toBe(medication)
  })

  it('undoes a dose given by mistake, back to due at its scheduled time, leaving the medication alone', () => {
    const store = expPet005Flow.createStore()
    const medication = store.get(medicationAtom)
    const scheduled = store.get(medicationDoseAtom)

    store.set(giveDoseAtom, new Date())
    store.set(undoDoseAtom)

    expect(store.get(medicationDoseAtom)).toEqual({ scheduledAt: scheduled.scheduledAt, status: 'due' })
    expect(toDoseStatus(store.get(medicationDoseAtom), new Date())).toBe('due')
    expect(store.get(medicationAtom)).toBe(medication)
  })

  it('links every screen of every variant to a Figma frame', () => {
    for (const id of variantIds) {
      const { designFrames } = resolveFlow(expPet005Flow, id)
      for (const screenId of screenIds) {
        const frame = designFrames[screenId as keyof typeof designFrames]
        expect(frame?.url).toMatch(/^https:\/\/www\.figma\.com\/design\/.+node-id=\d+-\d+$/)
      }
    }
    expect(resolveFlow(expPet005Flow, 'c').designFrames.home?.name).toBe('EXP-PET-005-C - Home (Today, dose due)')
  })

  it('maps every origin to its entry point', () => {
    const origins: DoseOrigin[] = ['home', 'ginger-notes', 'ginger-info', 'medical', 'medication']
    expect(origins.map(toEntryPoint)).toEqual(['home', 'pod', 'pod', 'medical', 'medical'])
  })

  it('records Notifications on Home and stays there, in every variant', () => {
    for (const id of variantIds) {
      let selectTab: ((tab: string) => void) | undefined
      const effects = renderScreen(resolveFlow(expPet005Flow, id), 'home', {
        components: {
          AppTabBar: ({ onSelect }: { onSelect: (tab: string) => void }) => {
            selectTab = onSelect
            return null
          },
        },
      })
      selectTab?.('notifications')

      expect(effects.tracked).toEqual([{ event: 'app_tab_selected', props: { tab: 'notifications' } }])
      expect(effects.navigations).toEqual([])
    }
  })

  it('records the Home search field and stays there, in every variant', () => {
    for (const id of variantIds) {
      let selectSearch: (() => void) | undefined
      const effects = renderScreen(resolveFlow(expPet005Flow, id), 'home', {
        components: {
          HomeTopBar: ({ onSearchSelect }: { onSearchSelect?: () => void }) => {
            selectSearch = onSearchSelect
            return null
          },
        },
      })
      selectSearch?.()

      expect(selectSearch).toBeDefined()
      expect(effects.tracked).toEqual([{ event: 'search_selected' }])
      expect(effects.navigations).toEqual([])
    }
  })

  it('keeps runs isolated from each other', () => {
    const first = expPet005Flow.createStore()
    first.set(giveDoseAtom, new Date())
    expect(expPet005Flow.createStore().get(medicationDoseAtom).status).toBe('due')
  })

  describe('dose history fixture', () => {
    const now = new Date('2026-10-13T10:00:00')
    const history = createDoseHistory(now)

    it('starts with Sam giving the previous Apoquel dose 12 hours earlier', () => {
      const [previous] = history
      expect(previous).toMatchObject({ givenBy: 'sam', medicationId: CURRENT_MEDICATION_ID, status: 'given' })
      expect(new Date(previous?.scheduledAt ?? '').getTime()).toBe(now.getTime() - 12 * 3_600_000)
    })

    it('is long, includes missed doses, and covers every past course', () => {
      expect(history.length).toBeGreaterThan(500)
      expect(history.some((dose) => dose.status === 'missed')).toBe(true)
      for (const course of pastCourses) expect(history.some((dose) => dose.medicationId === course.id)).toBe(true)
      expect(new Set(history.map((dose) => dose.id)).size).toBe(history.length)
    })

    it('keeps Apoquel doses within the course, from its start date', () => {
      const apoquel = history.filter((dose) => dose.medicationId === CURRENT_MEDICATION_ID)
      expect(apoquel.every((dose) => new Date(dose.scheduledAt) >= new Date(2026, 8, 14))).toBe(true)
    })

    it('is identical in every variant for the same moment', () => {
      expect(createDoseHistory(now)).toEqual(history)
      for (const id of variantIds)
        expect(resolveFlow(expPet005Flow, id).createStore().get(doseHistoryAtom).length).toBeGreaterThan(500)
    })
  })
})
