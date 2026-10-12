import { describe, expect, it } from 'vitest'

import { gingerMedication, gingerPod, type MedicationRecord, medicationAtom, podAtom } from '../../pods/ginger/model'
import { resolveFlow } from '../../runtime/resolve-flow'
import { expPet003Flow } from './flow'
import { hasMedicalScreen, medicalPresentationAtom, podOpensOnAtom } from './model'

const variantIds = Object.keys(expPet003Flow.variants ?? {})

const metacam: MedicationRecord = { ...gingerMedication, brandName: 'Metacam', frequencyPerDay: '1' }

describe('exp-pet-003 flow', () => {
  it('is an experiment whose three variants are chosen explicitly, with unique codes', () => {
    expect(expPet003Flow.kind).toBe('experiment')
    expect(expPet003Flow.variantSelection).toBe('explicit')
    expect(variantIds).toEqual(['a', 'b', 'c'])
    expect(variantIds.map((id) => resolveFlow(expPet003Flow, id).variantCode)).toEqual([
      'EXP-PET-003-A',
      'EXP-PET-003-B',
      'EXP-PET-003-C',
    ])
  })

  it('gives each variant its own way of presenting Medical', () => {
    expect(variantIds.map((id) => resolveFlow(expPet003Flow, id).createStore().get(medicalPresentationAtom))).toEqual([
      'row',
      'row-with-preview',
      'inline',
    ])
  })

  it('has a Medical screen exactly in the variants whose Info tab links to one', () => {
    for (const id of variantIds) {
      const flow = resolveFlow(expPet003Flow, id)
      const presentation = flow.createStore().get(medicalPresentationAtom)

      expect(Object.hasOwn(flow.screens, 'medical')).toBe(hasMedicalScreen(presentation))
    }
  })

  it('starts on Home with Ginger, her medication, and pods opening on Info', () => {
    const flow = resolveFlow(expPet003Flow, 'a')
    const store = flow.createStore()

    expect(flow.initialScreen).toBe('home')
    expect(store.get(podAtom)).toBe(gingerPod)
    expect(store.get(medicationAtom)).toBe(gingerMedication)
    expect(store.get(podOpensOnAtom)).toBe('info')
  })

  it('uses a medication record and opening tab supplied when the run starts, keeping the variant', () => {
    const store = resolveFlow(expPet003Flow, 'c').createStore({ medication: metacam, podOpensOn: 'notes' })

    expect(store.get(medicationAtom)).toBe(metacam)
    expect(store.get(podOpensOnAtom)).toBe('notes')
    expect(store.get(medicalPresentationAtom)).toBe('inline')
  })

  it('briefs no one: the task is read by the moderator', () => {
    const flow = resolveFlow(expPet003Flow, 'a')

    expect(flow.goalKey).toBeNull()
    expect(flow.hints).toEqual({})
  })
})
