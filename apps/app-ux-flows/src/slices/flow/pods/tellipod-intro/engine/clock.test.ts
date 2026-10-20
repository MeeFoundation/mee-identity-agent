import { describe, expect, it } from 'vitest'

import { HL_FROZEN } from './attention'
import { IntroClock } from './clock'
import { computeLayout } from './layout'
import { T1_V2 } from './living'
import { Ticker } from './runtime'

// A ticker driven by hand: `run(ms)` advances time in 16 ms frames and calls `sample` after each one.
const setup = ({
  tapLoop,
  reducedMotion = false,
  assemblyMs,
}: {
  tapLoop: boolean
  reducedMotion?: boolean
  assemblyMs?: number
}) => {
  let pending: ((now: number) => void) | null = null
  let now = 0
  const ticker = new Ticker(
    (cb) => {
      pending = cb
      return 1
    },
    () => {
      pending = null
    },
  )
  const stage = computeLayout(393, 852, { bottom: 0, top: 0 }, 1, undefined, tapLoop ? 'tap' : 'next').stage
  const clock = new IntroClock({ assemblyMs, reducedMotion, stage, tapLoop, ticker, width: 393 })
  let sample: () => void = () => undefined
  ticker.on(2, () => sample())
  const run = (ms: number, onFrame: () => void = () => undefined) => {
    sample = onFrame
    const end = now + ms
    while (now < end) {
      now += 16
      const cb = pending
      pending = null
      cb?.(now)
    }
  }
  return { clock, run }
}

describe('attention loop', () => {
  it('starts once the home has assembled and the Ginger tag can be tapped', () => {
    const { clock, run } = setup({ tapLoop: true })
    run(200)
    expect(clock.iv.canEnterPod.value).toBe(false)
    expect(clock.iv.hl.animating).toBe(false)
    run(3000)
    expect(clock.iv.canEnterPod.value).toBe(true)
    expect(clock.iv.hl.animating).toBe(true)
    const seen = new Set<number>()
    run(1600, () => seen.add(Math.round(clock.iv.hl.value * 10)))
    expect(seen.size).toBeGreaterThan(5)
  })

  it('stops while the scene moves and starts again at the next control', () => {
    const { clock, run } = setup({ tapLoop: true })
    run(3500)
    clock.next()
    run(200)
    expect(clock.iv.canEnterPod.value).toBe(false)
    expect(clock.iv.hl.animating).toBe(false)
    expect(clock.iv.hl.value).toBe(0)
    run(3000)
    expect(clock.iv.canInvite.value).toBe(true)
    expect(clock.iv.hl.animating).toBe(true)
  })

  it('never plays the one-time pulses in tap mode, and does in next mode', () => {
    const peak = (tapLoop: boolean) => {
      const { clock, run } = setup({ tapLoop })
      run(3500)
      clock.next()
      let max = 0
      run(6000, () => {
        max = Math.max(max, clock.iv.pulseInvite.value, clock.iv.pulseAddAll.value)
      })
      return max
    }
    expect(peak(false)).toBeGreaterThan(0)
    expect(peak(true)).toBe(0)
  })

  it('holds the ring still under reduced motion', () => {
    const { clock, run } = setup({ reducedMotion: true, tapLoop: true })
    run(2000)
    expect(clock.iv.canEnterPod.value).toBe(true)
    expect(clock.iv.hl.animating).toBe(false)
    expect(clock.iv.hl.value).toBe(HL_FROZEN)
  })

  it('starts the loop again when reduced motion is switched off', () => {
    const { clock, run } = setup({ reducedMotion: true, tapLoop: true })
    run(500)
    clock.setReducedMotion(false)
    run(100)
    expect(clock.iv.hl.animating).toBe(true)
  })

  it('does not run in next mode', () => {
    const { clock, run } = setup({ tapLoop: false })
    run(4000)
    expect(clock.iv.hl.animating).toBe(false)
    expect(clock.iv.hl.value).toBe(0)
  })
})

describe('opening', () => {
  it('assembles in beat one’s time unless told otherwise', () => {
    const { clock, run } = setup({ tapLoop: false })
    run(300)
    expect(clock.iv.s1.value).toBeLessThan(1)
    run(1800)
    expect(clock.iv.s1.value).toBe(1)
  })

  it('takes as long as asked for, as the living-pod deck does', () => {
    const { clock, run } = setup({ assemblyMs: T1_V2, tapLoop: false })
    run(1800)
    expect(clock.iv.s1.value).toBeLessThan(1)
    run(T1_V2)
    expect(clock.iv.s1.value).toBe(1)
  })
})
