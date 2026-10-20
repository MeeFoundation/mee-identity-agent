import { describe, expect, it } from 'vitest'

import { computeLayout } from './layout'

const NO_INSETS = { bottom: 0, top: 0 }

// Values computed by running the prototype's own `computeLayout` ("tap" layout) on the same inputs.
const GOLDEN = [
  {
    args: [393, 852, NO_INSETS, 1, undefined, 'tap', undefined],
    pager: 828,
    stage: {
      endInset: 148,
      featherTop: [14, 107.53731, 14, 14],
      h: 584,
      keyInsets: [-9.68354, 273.73134, 0, 148],
      keyShift: [0, 39.10448, 0, 0],
      ui: 0.97761,
      y: 232,
    },
    start: { h: 56, w: 361, x: 16, y: 684 },
    text: { h: 144, y: 72 },
  },
  {
    args: [393, 852, NO_INSETS, 1, 120, 'tap', 100],
    pager: 828,
    stage: {
      endInset: 148,
      featherTop: [14, 107.53731, 14, 14],
      h: 584,
      keyInsets: [34.31646, 273.73134, 0, 148],
      keyShift: [0, 39.10448, 0, 0],
      ui: 0.97761,
      y: 232,
    },
    start: { h: 56, w: 361, x: 16, y: 684 },
    text: { h: 144, y: 72 },
  },
  {
    args: [390, 667, NO_INSETS, 1, undefined, 'tap', undefined],
    pager: 643,
    stage: {
      endInset: 150,
      featherTop: [14, 71.10403, 14, 14],
      h: 437,
      keyInsets: [-14.54092, 271.64179, 0, 150],
      keyShift: [0, 38.80597, 0, 0],
      ui: 0.97015,
      y: 196,
    },
    start: { h: 56, w: 358, x: 16, y: 499 },
    text: { h: 120, y: 66 },
  },
  {
    args: [390, 560, NO_INSETS, 1, undefined, 'tap', undefined],
    pager: 536,
    stage: {
      endInset: 150,
      featherTop: [14, 68.8, 14, 14],
      h: 330,
      keyInsets: [-14.54092, 170, 0, 150],
      keyShift: [0, 0, 0, 0],
      ui: 0.97015,
      y: 196,
    },
    start: { h: 56, w: 358, x: 16, y: 392 },
    text: { h: 120, y: 66 },
  },
] as const

describe('tap layout', () => {
  it.each(GOLDEN)('matches the prototype at $args.0×$args.1 with text $args.4', (golden) => {
    const [w, h, insets, scale, textH, mode, firstH] = golden.args
    const layout = computeLayout(w, h, insets, scale, textH, mode, firstH)
    expect(layout.stage.y).toBe(golden.stage.y)
    expect(layout.stage.h).toBe(golden.stage.h)
    expect(layout.stage.ui).toBeCloseTo(golden.stage.ui, 4)
    expect(layout.stage.endInset).toBeCloseTo(golden.stage.endInset, 4)
    layout.stage.keyInsets.forEach((v, i) => {
      expect(v).toBeCloseTo(golden.stage.keyInsets[i] ?? 0, 4)
    })
    layout.stage.keyShift.forEach((v, i) => {
      expect(v).toBeCloseTo(golden.stage.keyShift[i] ?? 0, 4)
    })
    layout.stage.featherTop.forEach((v, i) => {
      expect(v).toBeCloseTo(golden.stage.featherTop[i] ?? 0, 4)
    })
    expect(layout.text).toEqual(golden.text)
    expect(layout.pager.y).toBe(golden.pager)
    expect(layout.start).toEqual(golden.start)
    expect(layout.next).toEqual(golden.start)
    expect(layout.hideStage).toBe(false)
  })

  it('caps the stage at 600 px', () => {
    expect(computeLayout(430, 1100, NO_INSETS, 1, undefined, 'tap').stage.h).toBe(600)
  })

  it('falls back to the next layout when the stage would be shorter than 180 px', () => {
    expect(computeLayout(390, 380, NO_INSETS, 1, undefined, 'tap')).toEqual(
      computeLayout(390, 380, NO_INSETS, 1, undefined, 'next'),
    )
  })

  it('keeps the next layout unchanged', () => {
    const next = computeLayout(393, 852, NO_INSETS)
    expect(next.stage.y).toBe(112)
    expect(next.stage.h).toBe(460)
    expect(next.text.y).toBe(584)
  })
})

// Values computed by running the prototype's own `computeLayout` ("top" layout, the artifact's v2) on the same inputs.
const LIVING_GOLDEN = [
  {
    args: [393, 852, NO_INSETS, 1, undefined, 'living', undefined],
    keyBox: [
      [0, 543],
      [0, 543],
      [0, 543],
      [0, 473],
    ],
    next: { h: 56, w: 361, x: 16, y: 754 },
    pager: 828,
    stage: { h: 543, ui: 0.977612, y: 211 },
    start: { h: 56, w: 361, x: 16, y: 684 },
    text: { h: 144, y: 72 },
  },
  {
    args: [393, 852, NO_INSETS, 1, 120, 'living', 100],
    keyBox: [
      [0, 587],
      [44, 587],
      [44, 587],
      [44, 517],
    ],
    next: { h: 56, w: 361, x: 16, y: 754 },
    pager: 828,
    stage: { h: 587, ui: 0.977612, y: 167 },
    start: { h: 56, w: 361, x: 16, y: 684 },
    text: { h: 144, y: 72 },
  },
  {
    args: [393, 852, { bottom: 34, top: 47 }, 1, undefined, 'living', undefined],
    keyBox: [
      [0, 490],
      [0, 490],
      [0, 490],
      [0, 414],
    ],
    next: { h: 56, w: 361, x: 16, y: 732 },
    pager: 806,
    stage: { h: 490, ui: 0.977612, y: 242 },
    start: { h: 56, w: 361, x: 16, y: 656 },
    text: { h: 144, y: 103 },
  },
  {
    args: [390, 667, NO_INSETS, 1, undefined, 'living', undefined],
    keyBox: [
      [0, 391],
      [0, 391],
      [0, 391],
      [0, 317],
    ],
    next: { h: 56, w: 358, x: 16, y: 573 },
    pager: 643,
    stage: { h: 391, ui: 0.970149, y: 182 },
    start: { h: 56, w: 358, x: 16, y: 499 },
    text: { h: 120, y: 66 },
  },
  {
    args: [390, 560, NO_INSETS, 1, undefined, 'living', undefined],
    keyBox: [
      [0, 284],
      [0, 284],
      [0, 284],
      [0, 210],
    ],
    next: { h: 56, w: 358, x: 16, y: 466 },
    pager: 536,
    stage: { h: 284, ui: 0.945205, y: 182 },
    start: { h: 56, w: 358, x: 16, y: 392 },
    text: { h: 120, y: 66 },
  },
] as const

describe('living layout', () => {
  it.each(LIVING_GOLDEN)('matches the prototype at $args.0×$args.1 with text $args.4', (golden) => {
    const [w, h, insets, scale, textH, mode, firstH] = golden.args
    const layout = computeLayout(w, h, insets, scale, textH, mode, firstH)
    expect(layout.stage.y).toBe(golden.stage.y)
    expect(layout.stage.h).toBe(golden.stage.h)
    expect(layout.stage.ui).toBeCloseTo(golden.stage.ui, 4)
    expect(layout.stage.keyBox).toEqual(golden.keyBox)
    expect(layout.text).toEqual(golden.text)
    expect(layout.pager.y).toBe(golden.pager)
    expect(layout.next).toEqual(golden.next)
    expect(layout.start).toEqual(golden.start)
    expect(layout.hideStage).toBe(false)
  })

  it('falls back to the next layout when a beat would not fit its content', () => {
    expect(computeLayout(390, 500, NO_INSETS, 1, undefined, 'living')).toEqual(
      computeLayout(390, 500, NO_INSETS, 1, undefined, 'next'),
    )
  })
})
