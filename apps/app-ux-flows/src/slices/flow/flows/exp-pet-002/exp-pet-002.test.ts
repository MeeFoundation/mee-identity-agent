import { describe, expect, it } from 'vitest'

import {
  addMedicationFormAtom,
  gingerMedication,
  gingerPod,
  type MedicationRecord,
  medicationAtom,
  medicationFormAddedAtom,
  podAtom,
} from '../../pods/ginger/model'
import { resolveFlow } from '../../runtime/resolve-flow'
import { expPet002Flow } from './flow'
import { showAiSuggestionAtom } from './model'

const baytril: MedicationRecord = { ...gingerMedication, brandName: 'Baytril' }

describe('exp-pet-002 flow', () => {
  it('starts a run from the Ginger pod and the server-provided medication, not yet added', () => {
    const store = resolveFlow(expPet002Flow, 'a').createStore()

    expect(store.get(podAtom)).toBe(gingerPod)
    expect(store.get(medicationAtom)).toBe(gingerMedication)
    expect(store.get(medicationFormAddedAtom)).toBe(false)
  })

  it('uses a medication record supplied when the run starts', () => {
    const store = resolveFlow(expPet002Flow, 'a').createStore({ medication: baytril })

    expect(store.get(medicationAtom).brandName).toBe('Baytril')
  })

  it('turns the AI suggestion on only in variant B', () => {
    expect(resolveFlow(expPet002Flow, 'a').createStore().get(showAiSuggestionAtom)).toBe(false)
    expect(resolveFlow(expPet002Flow, 'b').createStore().get(showAiSuggestionAtom)).toBe(true)
  })

  it('keeps the variant B flag when the run start supplies other fields', () => {
    const store = resolveFlow(expPet002Flow, 'b').createStore({ medication: baytril })

    expect(store.get(showAiSuggestionAtom)).toBe(true)
    expect(store.get(medicationAtom)).toBe(baytril)
  })

  it('adds the medication form idempotently', () => {
    const store = resolveFlow(expPet002Flow, 'a').createStore()

    store.set(addMedicationFormAtom)
    store.set(addMedicationFormAtom)

    expect(store.get(medicationFormAddedAtom)).toBe(true)
  })

  it('references the Figma frame of every screen, with variant B overriding its own two', () => {
    const a = resolveFlow(expPet002Flow, 'a')
    const b = resolveFlow(expPet002Flow, 'b')

    expect(Object.keys(a.designFrames).sort()).toEqual(Object.keys(a.screens).sort())
    expect(b.designFrames['ginger-info']?.name).toBe('EXP-PET-002-B - Ginger (with quick add)')
    expect(b.designFrames['medication-added']?.name).toBe('EXP-PET-002-B - Medication added')
    expect(b.designFrames.medical).toBe(a.designFrames.medical)
    expect([a.variantCode, b.variantCode]).toEqual(['EXP-PET-002-A', 'EXP-PET-002-B'])
  })
})
