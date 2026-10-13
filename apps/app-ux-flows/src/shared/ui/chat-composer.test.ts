import { describe, expect, it } from 'vitest'

import { shouldSend } from './chat-composer'

describe('shouldSend', () => {
  it('sends text and ignores an empty or blank composer', () => {
    expect(shouldSend('Ginger needs Clavamox twice a day')).toBe(true)
    expect(shouldSend('')).toBe(false)
    expect(shouldSend('   ')).toBe(false)
  })
})
