import { describe, expect, it } from 'vitest'

import { addMedicationFlow } from './flows/add-medication/flow'
import { findFlow, hasScreen, listFlows } from './registry'

describe('flow registry', () => {
  it('lists every registered flow', () => {
    expect(listFlows()).toContain(addMedicationFlow)
  })

  it('resolves a known flow id', () => {
    expect(findFlow(addMedicationFlow.id)).toBe(addMedicationFlow)
  })

  it('returns undefined for an unknown flow id instead of throwing', () => {
    expect(findFlow('does-not-exist')).toBeUndefined()
    expect(findFlow('constructor')).toBeUndefined()
  })

  it('checks screen ids against the flow screens', () => {
    expect(hasScreen(addMedicationFlow, 'medication-form')).toBe(true)
    expect(hasScreen(addMedicationFlow, 'does-not-exist')).toBe(false)
    expect(hasScreen(addMedicationFlow, 'constructor')).toBe(false)
  })
})
