import { createInstance } from 'i18next'
import { describe, expect, it } from 'vitest'

import { toMedicationFieldRows } from '../../pods/ginger/medication-fields'
import { gingerPod, type MedicationRecord, medicationAtom, podAtom } from '../../pods/ginger/model'
import { renderScreen } from '../../runtime/render-screen'
import { resolveFlow } from '../../runtime/resolve-flow'
import { expPet004Flow } from './flow'
import {
  apoquelMedication,
  applyFieldDraft,
  editEntryPointAtom,
  isValidFieldDraft,
  medicationShortcutAtom,
  saveFieldAtom,
  saveScheduleAtom,
  scheduleDraftAtom,
  scheduleSavedAtom,
  startEditAtom,
  toFieldDraft,
} from './model'
import { en } from '@/app/locales/en'

const variantIds = Object.keys(expPet004Flow.variants ?? {})

const screenIds = ['home', 'ginger-notes', 'ginger-info', 'medical', 'medication', 'medication-updated']

const metacam: MedicationRecord = { ...apoquelMedication, brandName: 'Metacam', frequencyPerDay: '3' }

describe('exp-pet-004 flow', () => {
  it('is an experiment whose three variants are chosen explicitly, with unique codes', () => {
    expect(expPet004Flow.kind).toBe('experiment')
    expect(expPet004Flow.variantSelection).toBe('explicit')
    expect(variantIds).toEqual(['a', 'b', 'c'])
    expect(variantIds.map((id) => resolveFlow(expPet004Flow, id).variantCode)).toEqual([
      'EXP-PET-004-A',
      'EXP-PET-004-B',
      'EXP-PET-004-C',
    ])
  })

  it('gives each variant its own shortcut into editing and nothing else', () => {
    expect(variantIds.map((id) => resolveFlow(expPet004Flow, id).createStore().get(medicationShortcutAtom))).toEqual([
      'none',
      'edit',
      'change-schedule',
    ])
  })

  it('implements every screen in every variant', () => {
    for (const id of variantIds) {
      const flow = resolveFlow(expPet004Flow, id)

      for (const screenId of screenIds) expect(flow.screens).toHaveProperty(screenId)
    }
  })

  it('starts on Home with Ginger taking Apoquel once a day, nothing saved', () => {
    const flow = resolveFlow(expPet004Flow, 'a')
    const store = flow.createStore()

    expect(flow.initialScreen).toBe('home')
    expect(store.get(podAtom)).toBe(gingerPod)
    expect(store.get(medicationAtom)).toBe(apoquelMedication)
    expect(store.get(scheduleSavedAtom)).toBe(false)
  })

  it('shows Apoquel as once per day, started Sep 14, 2026', async () => {
    const i18n = createInstance()
    await i18n.init({ interpolation: { escapeValue: false }, lng: 'en', resources: { en: { translation: en } } })
    const rows = toMedicationFieldRows(apoquelMedication, i18n.t, 'en')

    expect(rows.find((row) => row.id === 'frequency')?.value).toBe('Once per day')
    expect(rows.find((row) => row.id === 'startDate')?.value).toBe('Sep 14, 2026')
  })

  it('uses a medication record supplied when the run starts, keeping the variant', () => {
    const store = resolveFlow(expPet004Flow, 'c').createStore({ medication: metacam })

    expect(store.get(medicationAtom)).toBe(metacam)
    expect(store.get(medicationShortcutAtom)).toBe('change-schedule')
  })

  it('starts every edit from the stored schedule, discarding an earlier selection', () => {
    const store = resolveFlow(expPet004Flow, 'b').createStore()
    store.set(scheduleDraftAtom, '3')

    store.set(startEditAtom, 'list_edit')

    expect(store.get(scheduleDraftAtom)).toBe('1')
    expect(store.get(editEntryPointAtom)).toBe('list_edit')
  })

  it('saves by updating the one existing record', () => {
    const store = resolveFlow(expPet004Flow, 'a').createStore()

    store.set(saveScheduleAtom, '2')

    expect(store.get(medicationAtom)).toEqual({ ...apoquelMedication, frequencyPerDay: '2' })
    expect(store.get(scheduleSavedAtom)).toBe(true)
  })

  it("starts each field input from the record, in the input's format", () => {
    expect(toFieldDraft(apoquelMedication, 'activeIngredient')).toBe('Oclacitinib')
    expect(toFieldDraft(apoquelMedication, 'dose')).toBe('16')
    expect(toFieldDraft(apoquelMedication, 'startDate')).toBe('2026-09-14')
  })

  it('accepts only usable field values', () => {
    expect(isValidFieldDraft('brandName', '  ')).toBe(false)
    expect(isValidFieldDraft('dose', '0')).toBe(false)
    expect(isValidFieldDraft('dose', 'abc')).toBe(false)
    expect(isValidFieldDraft('dose', '8.5')).toBe(true)
    expect(isValidFieldDraft('startDate', 'Sep 14')).toBe(false)
    expect(isValidFieldDraft('startDate', '2026-10-01')).toBe(true)
  })

  it('applies a field edit to the one record, keeping IRIs only for unchanged terms', () => {
    expect(applyFieldDraft(apoquelMedication, 'dose', ' 8.5 ').dosage).toEqual({
      ...apoquelMedication.dosage,
      value: 8.5,
    })
    expect(applyFieldDraft(apoquelMedication, 'doseForm', 'Tablet').doseForm).toBe(apoquelMedication.doseForm)
    expect(applyFieldDraft(apoquelMedication, 'doseForm', 'Chewable tablet').doseForm).toEqual({
      label: 'Chewable tablet',
    })
    expect(applyFieldDraft(apoquelMedication, 'activeIngredient', 'Oclacitinib, Lokivetmab').activeIngredients).toEqual(
      [apoquelMedication.activeIngredients[0], { label: 'Lokivetmab' }],
    )
  })

  it('saves a field other than the schedule without completing the task', () => {
    const store = resolveFlow(expPet004Flow, 'a').createStore()

    store.set(saveFieldAtom, { draft: 'Elanco', field: 'manufacturer' })

    expect(store.get(medicationAtom)).toEqual({ ...apoquelMedication, manufacturer: 'Elanco' })
    expect(store.get(scheduleSavedAtom)).toBe(false)
  })

  it('records Notifications on Home and stays there, in every variant', () => {
    for (const id of variantIds) {
      let selectTab: ((tab: string) => void) | undefined
      const effects = renderScreen(resolveFlow(expPet004Flow, id), 'home', {
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
      const effects = renderScreen(resolveFlow(expPet004Flow, id), 'home', {
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

  it('briefs no one: the task is read by the moderator', () => {
    const flow = resolveFlow(expPet004Flow, 'a')

    expect(flow.goalKey).toBeNull()
    expect(flow.hints).toEqual({})
  })
})
