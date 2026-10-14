import { describe, expect, it } from 'vitest'

import {
  addMedicationFormAtom,
  gingerMedication,
  medicationAtom,
  medicationFormAddedAtom,
} from '../../pods/ginger/model'
import { findFlow, listFlows } from '../../registry'
import { resolveFlow } from '../../runtime/resolve-flow'
import { chatAddMedicationFlow } from './flow'
import { chatStageAtom, nextStage, sendMessageAtom } from './model'

describe('chat-add-medication showcase', () => {
  it('is a registered showcase without variants or a display code', () => {
    expect(chatAddMedicationFlow.kind).toBe('showcase')
    expect(chatAddMedicationFlow.variants).toBeUndefined()
    expect(chatAddMedicationFlow.code).toBeUndefined()
    expect(findFlow('chat-add-medication')).toBe(chatAddMedicationFlow)
    expect(listFlows().map((flow) => flow.id)).toEqual([
      'exp-pet-002',
      'exp-pet-003',
      'exp-pet-004',
      'exp-pet-005',
      'chat-add-medication',
      'exp-demo-001',
      'sc-pet-001',
      'sc-pet-002',
      'sc-pet-003',
      'sc-pet-004',
      'sc-ppl-001',
      'sc-ppl-002',
      'sc-ppl-003',
    ])
  })

  it('starts with an empty chat and the medication not yet added', () => {
    const store = resolveFlow(chatAddMedicationFlow, null).createStore()

    expect(store.get(chatStageAtom)).toBe('draft')
    expect(store.get(medicationFormAddedAtom)).toBe(false)
    expect(store.get(medicationAtom)).toBe(gingerMedication)
  })

  it('sends the scripted message once', () => {
    const store = resolveFlow(chatAddMedicationFlow, null).createStore()

    store.set(sendMessageAtom)
    expect(store.get(chatStageAtom)).toBe('sending')

    store.set(chatStageAtom, 'replied')
    store.set(sendMessageAtom)
    expect(store.get(chatStageAtom)).toBe('replied')
  })

  it('moves from sending to Telli typing to the reply in about 3.3 seconds, then stops', () => {
    expect(nextStage('draft')).toBeNull()
    expect(nextStage('sending')).toEqual({ afterMs: 800, stage: 'typing' })
    expect(nextStage('typing')).toEqual({ afterMs: 2500, stage: 'replied' })
    expect(nextStage('replied')).toBeNull()
  })

  it('adds the medication form idempotently', () => {
    const store = resolveFlow(chatAddMedicationFlow, null).createStore()

    store.set(addMedicationFormAtom)
    store.set(addMedicationFormAtom)

    expect(store.get(medicationFormAddedAtom)).toBe(true)
  })

  it('references a Figma frame for every screen except the Info tab', () => {
    const { designFrames, screens } = resolveFlow(chatAddMedicationFlow, null)

    expect(Object.keys(designFrames).sort()).toEqual(
      Object.keys(screens)
        .filter((screenId) => screenId !== 'ginger-info')
        .sort(),
    )
  })
})
