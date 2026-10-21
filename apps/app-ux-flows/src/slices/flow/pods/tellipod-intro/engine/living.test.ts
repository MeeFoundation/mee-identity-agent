import { describe, expect, it } from 'vitest'

import {
  DECK_IN,
  DECK_N,
  DECK_STEP,
  deckDepth,
  deckFace,
  deckIn,
  deckPose,
  frameAt,
  keyAt,
  P_SLOT,
  P1,
  P2,
  P3,
  P4,
  T1_V2,
  TELLI_SLOT,
  TELLI_WAIT,
  telliAt,
} from './living'

describe('living deck', () => {
  it('opens in about 2.4 s: the last card lands when the opening ends', () => {
    expect((DECK_N - 1) * DECK_STEP + DECK_IN).toBe(T1_V2)
  })

  it('starts every card hidden, below its place and not yet landed', () => {
    for (let i = 0; i < DECK_N; i++) {
      const pose = deckPose(i, 0, P1.h)
      expect(pose.o).toBe(0)
      expect(deckIn(i, 0)).toBe(0)
    }
    expect(deckPose(0, 0, P1.h).ty).toBeGreaterThan(0)
  })

  it('lands the cards one after another', () => {
    expect(deckIn(0, DECK_IN)).toBe(1)
    expect(deckIn(1, DECK_IN)).toBe(0)
    expect(deckIn(1, DECK_STEP + DECK_IN / 2)).toBeCloseTo(0.5, 5)
  })

  it('ends with the last card in place, fully visible and at full scale, and the first cards stacked behind it', () => {
    const last = deckPose(DECK_N - 1, T1_V2, P1.h)
    expect(last.o).toBe(1)
    expect(last.s).toBe(1)
    expect(last.ty).toBeCloseTo(0, 5)
    const first = deckPose(0, T1_V2, P1.h)
    expect(first.o).toBeCloseTo(0.26, 5)
    expect(first.s).toBeLessThan(1)
    expect(first.ty).toBeLessThan(0)
    expect(deckDepth(0, T1_V2)).toBe(DECK_N - 1)
  })

  it('keeps the last card face, and fades the others as the next card lands on them', () => {
    expect(deckFace(DECK_N - 1, 0)).toBe(1)
    expect(deckFace(0, 0)).toBe(1)
    expect(deckFace(0, DECK_STEP + 160)).toBe(0)
    expect(deckFace(0, T1_V2)).toBe(0)
  })
})

describe('living frames', () => {
  it('rests on each beat at its card', () => {
    expect(frameAt(0)).toEqual(P1)
    expect(frameAt(1, 0)).toEqual(P2)
    expect(frameAt(2)).toEqual(P3)
    expect(frameAt(3)).toEqual(P4)
  })

  it('grows the open pod when suggestions arrive and shrinks it when they are added', () => {
    expect(frameAt(1, 2450).h).toBe(316)
    expect(frameAt(1, 3350).h).toBe(278)
  })
})

describe('living telli', () => {
  it('flies from where it waits to its slot among the members', () => {
    expect(telliAt(0)).toEqual(TELLI_WAIT)
    const end = telliAt(1)
    expect(end[0]).toBeCloseTo(TELLI_SLOT[0], 5)
    expect(end[1]).toBeCloseTo(TELLI_SLOT[1], 5)
  })
})

// Values computed by running the prototype's own v2 geometry module on the same inputs.
describe('living geometry against the prototype', () => {
  it.each([
    [0, 0, { h: 279, r: 28, w: 264, x: 69, y: 58 }],
    [0.5, 0, { h: 304.101169, r: 28, w: 289.635237, x: 56.182382, y: 31.296628 }],
    [1.5, 1000, { h: 312.290897, r: 25.71515, w: 256.021164, x: 27.292409, y: 18.281827 }],
    [2.5, 0, { h: 100.031419, r: 17.323353, w: 330, x: 36, y: 54.375751 }],
    [3, 0, { h: 60, r: 16, w: 330, x: 36, y: 60 }],
  ])('frameAt(%s, %s)', (q, m2, expected) => {
    const frame = frameAt(q, m2)
    for (const key of ['x', 'y', 'w', 'h', 'r'] as const) expect(frame[key]).toBeCloseTo(expected[key], 4)
  })

  it.each([
    [0, 300, { o: 1, s: 0.996971, ty: 3.332044 }],
    [1, 700, { o: 0.875, s: 0.97231, ty: 30.459035 }],
    [0, 2440, { o: 0.26, s: 0.85, ty: -56.925 }],
    [1, 2440, { o: 0.46, s: 0.9, ty: -37.95 }],
  ])('deckPose(%s, %s)', (i, m1, expected) => {
    const pose = deckPose(i, m1, P1.h)
    expect(pose.o).toBeCloseTo(expected.o, 4)
    expect(pose.s).toBeCloseTo(expected.s, 4)
    expect(pose.ty).toBeCloseTo(expected.ty, 3)
  })

  it('places Telli and the one-time link', () => {
    expect(TELLI_WAIT).toEqual([201, -36])
    expect(TELLI_SLOT).toEqual([329, 52])
    expect(telliAt(0.3)[0]).toBeCloseTo(256.872, 3)
    expect(telliAt(0.7)[1]).toBeCloseTo(4.768, 3)
    expect(keyAt(0.5)[0]).toBeCloseTo(245.5, 3)
    expect(keyAt(0.5)[1]).toBeCloseTo(20, 3)
    expect(P_SLOT).toEqual([202, 66])
  })
})
