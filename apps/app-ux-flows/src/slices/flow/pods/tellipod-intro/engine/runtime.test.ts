import { describe, expect, it } from 'vitest'

import { cancelAnimation, Ticker, withDelay, withRepeat, withSequence, withSpring, withTiming } from './runtime'

// A ticker driven by hand: `run(ms)` advances time in 16 ms frames.
const fakeTicker = () => {
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
  const run = (ms: number) => {
    const end = now + ms
    while (now < end) {
      now += 16
      const cb = pending
      pending = null
      cb?.(now)
    }
  }
  return { run, ticker }
}

describe('SC-ONB-001 animation runtime', () => {
  it('runs a timing to its end and reports it finished', () => {
    const { ticker, run } = fakeTicker()
    const sv = ticker.sv(0)
    const done: boolean[] = []
    sv.value = withTiming(10, { duration: 160 }, (finished) => done.push(finished))
    run(80)
    expect(sv.value).toBeGreaterThan(0)
    expect(sv.value).toBeLessThan(10)
    run(200)
    expect(sv.value).toBe(10)
    expect(done).toEqual([true])
  })

  it('reports a replaced or cancelled animation as not finished', () => {
    const { ticker, run } = fakeTicker()
    const sv = ticker.sv(0)
    const done: string[] = []
    sv.value = withTiming(10, { duration: 500 }, (finished) => done.push(`a:${finished}`))
    run(48)
    sv.value = withTiming(-5, { duration: 100 }, (finished) => done.push(`b:${finished}`))
    run(48)
    cancelAnimation(sv)
    const stopped = sv.value
    run(200)
    expect(sv.value).toBe(stopped)
    expect(done).toEqual(['a:false', 'b:false'])
  })

  it('writing a plain value stops the running animation', () => {
    const { ticker, run } = fakeTicker()
    const sv = ticker.sv(0)
    const done: boolean[] = []
    sv.value = withTiming(10, { duration: 500 }, (finished) => done.push(finished))
    run(32)
    sv.value = 3
    run(600)
    expect(sv.value).toBe(3)
    expect(done).toEqual([false])
  })

  it('holds through a delay, then plays a sequence step by step', () => {
    const { ticker, run } = fakeTicker()
    const sv = ticker.sv(0)
    const done: string[] = []
    sv.value = withSequence(
      withDelay(
        100,
        withTiming(1, { duration: 100 }, (f) => done.push(`one:${f}`)),
      ),
      withTiming(0, { duration: 100 }, (f) => done.push(`two:${f}`)),
    )
    run(64)
    expect(sv.value).toBe(0)
    // Animations start on the next frame (16 ms), so the first step ends 100 ms after its delay, at 228 ms.
    run(180)
    expect(done).toEqual(['one:true'])
    run(200)
    expect(sv.value).toBe(0)
    expect(done).toEqual(['one:true', 'two:true'])
  })

  it('tells every unfinished step of a cancelled sequence', () => {
    const { ticker, run } = fakeTicker()
    const sv = ticker.sv(0)
    const done: string[] = []
    sv.value = withSequence(
      withTiming(1, { duration: 100 }, (f) => done.push(`one:${f}`)),
      withTiming(2, { duration: 100 }, (f) => done.push(`two:${f}`)),
    )
    run(48)
    cancelAnimation(sv)
    expect(done).toEqual(['one:false', 'two:false'])
  })

  it('settles a spring on its target', () => {
    const { ticker, run } = fakeTicker()
    const sv = ticker.sv(0.6)
    const done: boolean[] = []
    sv.value = withSpring(1, { damping: 34.6, energyThreshold: 1e-4, mass: 1, stiffness: 300, velocity: 0 }, (f) =>
      done.push(f),
    )
    run(2000)
    expect(sv.value).toBe(1)
    expect(done).toEqual([true])
  })

  it('runs derived values, reactions and styles each frame, in that order', () => {
    const { ticker, run } = fakeTicker()
    const sv = ticker.sv(0)
    const order: string[] = []
    ticker.on(2, () => order.push('style'))
    ticker.on(0, () => order.push('derive'))
    ticker.on(1, () => order.push('react'))
    order.length = 0
    sv.value = 1
    run(16)
    expect(order).toEqual(['derive', 'react', 'style'])
  })

  it('repeats a timing from where it started, forever or a set number of times', () => {
    const { ticker, run } = fakeTicker()
    const forever = ticker.sv(0)
    forever.value = withRepeat(withTiming(1, { duration: 160 }), -1)
    const seen: number[] = []
    for (let i = 0; i < 40; i++) {
      run(16)
      seen.push(forever.value)
    }
    expect(forever.animating).toBe(true)
    expect(seen.filter((v, k) => k > 0 && v < (seen[k - 1] ?? 0)).length).toBeGreaterThanOrEqual(3)
    cancelAnimation(forever)
    const twice = ticker.sv(0)
    twice.value = withRepeat(withTiming(1, { duration: 160 }), 2)
    run(1000)
    expect(twice.animating).toBe(false)
    expect(twice.value).toBe(1)
  })
})
