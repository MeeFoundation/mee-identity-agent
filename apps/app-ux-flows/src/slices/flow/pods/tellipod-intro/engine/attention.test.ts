import { describe, expect, it } from 'vitest'

import { HL_FROZEN, HL_PERIOD_MS, HL_RIPPLE_MS, ripple } from './attention'

describe('ripple', () => {
  it('starts at 0, grows over the ripple window and rests for the rest of the period', () => {
    expect(ripple(0, false)).toBe(0)
    expect(ripple(HL_RIPPLE_MS / 2 / HL_PERIOD_MS, false)).toBeCloseTo(0.5, 6)
    expect(ripple(HL_RIPPLE_MS / HL_PERIOD_MS, false)).toBe(-1)
    expect(ripple(0.9, false)).toBe(-1)
  })

  it('repeats every period', () => {
    expect(ripple(3.25, false)).toBeCloseTo(ripple(0.25, false), 6)
    expect(ripple(1, false)).toBe(0)
  })

  it('has no ripple under reduced motion, wherever the loop is held', () => {
    expect(ripple(0, true)).toBe(-1)
    expect(ripple(HL_FROZEN, true)).toBe(-1)
  })

  it('holds the frozen position inside the ripple window', () => {
    expect(HL_FROZEN * HL_PERIOD_MS).toBeLessThan(HL_RIPPLE_MS)
    expect(ripple(HL_FROZEN, false)).toBeGreaterThan(0)
  })
})
