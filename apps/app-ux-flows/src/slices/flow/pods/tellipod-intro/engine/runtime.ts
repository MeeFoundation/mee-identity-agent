// A small stand-in for the parts of Reanimated the prototype uses: shared values that run timing, delay, sequence,
// repeat and spring animations on one frame loop, with Reanimated's finish-callback semantics (`true` when an
// animation completes, `false` when it is cancelled or replaced).

type Callback = (finished: boolean) => void
export type Easing = (t: number) => number

export type Animation = {
  start(from: number, now: number): void
  // Advances to `now`; returns whether the animation has finished.
  step(now: number): boolean
  current: number
  // Tells every callback that hasn't fired yet that the animation was cancelled.
  cancel(): void
}

const linear: Easing = (t) => t

export const withTiming = (
  to: number,
  config: { duration: number; easing?: Easing } = { duration: 300 },
  callback?: Callback,
): Animation => {
  let from = 0
  let t0 = 0
  let done = false
  const easing = config.easing ?? linear
  const duration = Math.max(0, config.duration)
  const anim: Animation = {
    cancel: () => {
      if (!done) {
        done = true
        callback?.(false)
      }
    },
    current: to,
    start: (value, now) => {
      from = value
      t0 = now
      done = false
      anim.current = value
    },
    step: (now) => {
      const t = duration === 0 ? 1 : Math.min(1, (now - t0) / duration)
      anim.current = t >= 1 ? to : from + (to - from) * easing(t)
      if (t >= 1 && !done) {
        done = true
        callback?.(true)
      }
      return t >= 1
    },
  }
  return anim
}

export const withDelay = (ms: number, inner: Animation): Animation => {
  let t0 = 0
  let started = false
  let from = 0
  const anim: Animation = {
    cancel: () => inner.cancel(),
    current: 0,
    start: (value, now) => {
      t0 = now
      from = value
      started = false
      anim.current = value
    },
    step: (now) => {
      if (now - t0 < ms) {
        anim.current = from
        return false
      }
      if (!started) {
        started = true
        inner.start(from, now)
      }
      const finished = inner.step(now)
      anim.current = inner.current
      return finished
    },
  }
  return anim
}

export const withSequence = (...steps: Animation[]): Animation => {
  let index = 0
  let stepStarted = false
  const anim: Animation = {
    cancel: () => {
      for (let i = index; i < steps.length; i++) steps[i]?.cancel()
    },
    current: 0,
    start: (value) => {
      index = 0
      stepStarted = false
      anim.current = value
    },
    step: (now) => {
      while (index < steps.length) {
        const current = steps[index] as Animation
        if (!stepStarted) {
          current.start(anim.current, now)
          stepStarted = true
        }
        const finished = current.step(now)
        anim.current = current.current
        if (!finished) return false
        index += 1
        stepStarted = false
      }
      return true
    },
  }
  return anim
}

// Plays `inner` `repetitions` times (forever when -1), each time from where the whole animation started.
export const withRepeat = (inner: Animation, repetitions = -1): Animation => {
  let from = 0
  let count = 0
  const anim: Animation = {
    cancel: () => inner.cancel(),
    current: 0,
    start: (value, now) => {
      from = value
      count = 0
      inner.start(value, now)
      anim.current = value
    },
    step: (now) => {
      const finished = inner.step(now)
      anim.current = inner.current
      if (!finished) return false
      count += 1
      if (repetitions > 0 && count >= repetitions) return true
      inner.start(from, now)
      anim.current = from
      return false
    },
  }
  return anim
}

type SpringConfig = {
  damping: number
  stiffness: number
  mass: number
  velocity?: number
  // Stops once the spring's energy falls below this fraction of its starting energy.
  energyThreshold?: number
}

// A damped spring with overshoot clamping, as the prototype's snap uses.
export const withSpring = (to: number, config: SpringConfig, callback?: Callback): Animation => {
  let x = 0
  let v = 0
  let last = 0
  let e0 = 0
  let done = false
  const { damping, stiffness: k, mass: m } = config
  const anim: Animation = {
    cancel: () => {
      if (!done) {
        done = true
        callback?.(false)
      }
    },
    current: to,
    start: (value, now) => {
      x = value - to
      v = config.velocity ?? 0
      last = now
      done = false
      e0 = 0.5 * k * x * x + 0.5 * m * v * v
      anim.current = value
    },
    step: (now) => {
      const startSign = Math.sign(x)
      let remaining = Math.min(64, now - last) / 1000
      last = now
      while (remaining > 0) {
        const dt = Math.min(remaining, 0.001)
        const a = (-k * x - damping * v) / m
        v += a * dt
        x += v * dt
        remaining -= dt
      }
      const energy = 0.5 * k * x * x + 0.5 * m * v * v
      const overshot = startSign !== 0 && Math.sign(x) !== startSign
      const settled = e0 <= 0 || energy <= (config.energyThreshold ?? 1e-6) * e0
      if (overshot || settled) {
        anim.current = to
        if (!done) {
          done = true
          callback?.(true)
        }
        return true
      }
      anim.current = to + x
      return false
    },
  }
  return anim
}

export class SharedValue {
  private raw: number
  private animation: Animation | null = null
  private started = false

  constructor(
    initial: number,
    private readonly ticker: Ticker,
  ) {
    this.raw = initial
  }

  get value(): number {
    return this.raw
  }

  set value(next: number | Animation) {
    const wasAnimating = this.animation !== null
    this.cancel()
    if (typeof next === 'number') {
      // Writing the same value again must not keep the frame loop awake.
      if (next === this.raw && !wasAnimating) return
      this.raw = next
      this.ticker.wake()
      return
    }
    this.animation = next
    this.started = false
    this.ticker.track(this)
  }

  get animating() {
    return this.animation !== null
  }

  cancel() {
    const running = this.animation
    if (!running) return
    this.animation = null
    this.ticker.untrack(this)
    running.cancel()
  }

  // Called by the ticker once per frame while animating.
  advance(now: number) {
    const running = this.animation
    if (!running) return
    if (!this.started) {
      this.started = true
      running.start(this.raw, now)
    }
    const finished = running.step(now)
    if (this.animation !== running) return
    this.raw = running.current
    if (finished) {
      this.animation = null
      this.ticker.untrack(this)
    }
  }
}

export const cancelAnimation = (sv: SharedValue) => sv.cancel()

type FrameCallback = (now: number) => void

// Drives every animation of one scene: steps shared values, then runs derived values, reactions and subscribers.
export class Ticker {
  private readonly active = new Set<SharedValue>()
  private readonly phases: FrameCallback[][] = [[], [], []]
  private handle: number | null = null
  private running = false
  // A value changed while a frame was running; derived values must catch up on the next one.
  private pending = false
  private paused = false

  constructor(
    private readonly schedule: (cb: (now: number) => void) => number = (cb) => requestAnimationFrame(cb),
    private readonly unschedule: (handle: number) => void = (handle) => cancelAnimationFrame(handle),
  ) {}

  sv(initial: number) {
    return new SharedValue(initial, this)
  }

  track(sv: SharedValue) {
    this.active.add(sv)
    this.wake()
  }

  untrack(sv: SharedValue) {
    this.active.delete(sv)
  }

  // Phase 0 derives values, 1 runs reactions, 2 applies styles.
  on(phase: 0 | 1 | 2, cb: FrameCallback) {
    const list = this.phases[phase] as FrameCallback[]
    list.push(cb)
    this.wake()
    return () => {
      const i = list.indexOf(cb)
      if (i >= 0) list.splice(i, 1)
    }
  }

  wake() {
    if (this.running) {
      this.pending = true
      return
    }
    if (this.handle !== null || this.paused) return
    this.handle = this.schedule((now) => this.frame(now))
  }

  // Runs one frame now, without waiting, so the first paint already shows the right state.
  flush(now = performance.now()) {
    if (this.handle !== null) {
      this.unschedule(this.handle)
      this.handle = null
    }
    this.frame(now)
  }

  get busy() {
    return this.active.size > 0
  }

  // Stops scheduling frames while the scene is unmounted; animations keep their state and continue on resume.
  pause() {
    this.paused = true
    if (this.handle !== null) this.unschedule(this.handle)
    this.handle = null
  }

  resume() {
    this.paused = false
    this.wake()
  }

  private frame(now: number) {
    this.handle = null
    this.running = true
    this.pending = false
    try {
      for (const sv of [...this.active]) sv.advance(now)
      for (const phase of this.phases) for (const cb of [...phase]) cb(now)
    } finally {
      this.running = false
    }
    if (this.active.size > 0 || this.pending) {
      this.pending = false
      this.wake()
    }
  }
}
