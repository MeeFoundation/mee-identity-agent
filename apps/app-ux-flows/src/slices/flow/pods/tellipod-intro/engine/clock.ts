// Port of the prototype's `useIntroClock` (v1 · Rooms): plays moves between beats, beat 2's demo, Skip, the
// reduced-motion fades and the drag gesture. Bodies follow the source closely; haptics, the wheel and the
// tap-version loop are left out.

import { HL_FROZEN, HL_PERIOD_MS } from './attention'
import { dqdp, type Leg, legProgress, panTarget, planMove, rubber } from './clock-plan'
import { qOf, storyEndOf } from './drivers'
import { clamp } from './math'
import {
  type Animation,
  cancelAnimation,
  type SharedValue,
  type Ticker,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from './runtime'
import {
  ADDALL_PLAY_MS,
  G1_T,
  G2_T,
  LATCH_S1_Q,
  LATCH_T3_Q,
  NOTE_DONE_T,
  PAN_BEAT_WIDTH,
  PAN_MOVED_BEATS,
  PULSE_DELAY_MS,
  PULSE_HALF_MS,
  RM_ADDALL_IN_MS,
  RM_ADDALL_OUT_MS,
  RM_CONFIRM_HOLD_MS,
  RM_CONFIRM_IN_MS,
  RM_CONFIRM_OUT_MS,
  RM_IN_MS,
  RM_INVITE_BTN_MS,
  RM_INVITE_IN_MS,
  RM_INVITE_OUT_MS,
  RM_OUT_MS,
  RM_PAN_FRACTION,
  SETTLE_DELAY_MS,
  SKIP_IN_MS,
  SKIP_OUT_MS,
  SNAP_REST_EPS,
  SNAP_SPRING,
  T1,
  T2,
  T3,
} from './timeline'
import { createIntroSources, createIntroValues, deriveIntroValues, type IntroValues, type Stage } from './values'

export type StoryState = 'pre' | 'suggested' | 'confirmed'

const STORY_STATES: readonly StoryState[] = ['pre', 'suggested', 'confirmed']

const storyStateOf = (v2: number) => (v2 >= 1 - 1e-4 ? 2 : v2 >= G2_T - 1e-4 ? 1 : 0)

const FADE_PAGE = 1
const FADE_SKIP = 2
const FADE_STORY = 3
// A tap right after a drag belongs to the drag.
const PAN_CONSUME_MS = 350
// Added to the attention mask while reduced motion is on, so switching it re-syncs the loop.
const ATTENTION_FROZEN_BIT = 64

const tm = (to: number, ms: number, cb?: (finished: boolean) => void) =>
  withTiming(to, { duration: Math.max(0, ms) }, cb)

const dl = (ms: number, anim: Animation) => withDelay(ms, anim)

type ClockEvents = {
  // The beat the camera is nearest to.
  onBeat?: (beat: number) => void
  onStoryState?: (state: StoryState) => void
  // A move came to rest on `beat`.
  onSettled?: (beat: number) => void
  // The scene left a resting beat.
  onMotion?: () => void
}

type ClockOptions = ClockEvents & {
  ticker: Ticker
  stage: Stage
  // The column width a beat's drag is measured against.
  width: number
  reducedMotion: boolean
  // Tap mode: the controls that lead on are ringed in a loop, and the one-time pulses don't play.
  tapLoop?: boolean
  // How long beat 1's opening takes; the living-pod scene's deck takes longer than the isometric home.
  assemblyMs?: number
}

type Reaction = { read: () => number; react: (now: number, prev: number | null) => void; prev: number | null }

export class IntroClock {
  readonly iv: IntroValues
  private stage: Stage
  private readonly ticker: Ticker
  private readonly events: ClockEvents
  private readonly reactions: Reaction[] = []

  private readonly target: SharedValue
  private readonly animating: SharedValue
  private readonly finger: SharedValue
  private readonly fading: SharedValue
  private readonly tapPlaying: SharedValue
  private readonly commitT2: SharedValue
  private readonly fadeKind: SharedValue
  private readonly pendingT: SharedValue
  private readonly pendingSkip: SharedValue
  private readonly panMaxPx: SharedValue
  private readonly panLive: SharedValue
  private readonly settling3: SharedValue
  private readonly t2Goal: SharedValue
  private readonly seq: SharedValue
  private readonly panStart: SharedValue
  private readonly panStartBeat: SharedValue
  private readonly panTx0: SharedValue
  private readonly panIgnore: SharedValue
  private readonly pulsedInvite: SharedValue
  private readonly pulsedAddAll: SharedValue
  private readonly rmKick: SharedValue
  private readonly flushKick: SharedValue
  readonly textVeil: SharedValue
  private readonly colW: SharedValue
  private readonly rmSV: SharedValue
  private readonly dir = 1
  private readonly tapLoop: boolean
  private readonly assemblyMs: number
  private panActive = false
  private panMovedAt = Number.NEGATIVE_INFINITY

  constructor({ ticker, stage, width, reducedMotion, tapLoop = false, assemblyMs = T1, ...events }: ClockOptions) {
    this.ticker = ticker
    this.tapLoop = tapLoop
    this.assemblyMs = assemblyMs
    this.stage = stage
    this.events = events
    const sources = createIntroSources(ticker)
    sources.s1.value = reducedMotion ? 1 : 0
    this.iv = createIntroValues(sources, stage)
    this.target = ticker.sv(0)
    this.animating = ticker.sv(0)
    this.finger = ticker.sv(0)
    this.fading = ticker.sv(0)
    this.tapPlaying = ticker.sv(0)
    this.commitT2 = ticker.sv(0)
    this.fadeKind = ticker.sv(0)
    this.pendingT = ticker.sv(-1)
    this.pendingSkip = ticker.sv(0)
    this.panMaxPx = ticker.sv(0)
    this.panLive = ticker.sv(0)
    this.settling3 = ticker.sv(0)
    this.t2Goal = ticker.sv(G1_T)
    this.seq = ticker.sv(0)
    this.panStart = ticker.sv(0)
    this.panStartBeat = ticker.sv(0)
    this.panTx0 = ticker.sv(0)
    this.panIgnore = ticker.sv(0)
    this.pulsedInvite = ticker.sv(0)
    this.pulsedAddAll = ticker.sv(0)
    this.rmKick = ticker.sv(0)
    this.flushKick = ticker.sv(0)
    this.textVeil = ticker.sv(1)
    this.colW = ticker.sv(width)
    this.rmSV = ticker.sv(reducedMotion ? 1 : 0)

    const iv = this.iv
    ticker.on(0, () => deriveIntroValues(iv, this.stage))
    ticker.on(1, () => this.runReactions())

    this.reaction(
      () => Math.max(0, Math.min(3, Math.round(iv.q.value))),
      (now, prev) => {
        if (now !== prev) this.events.onBeat?.(now)
      },
    )
    this.reaction(
      () => storyStateOf(iv.v2.value),
      (now, prev) => {
        if (now !== prev) this.events.onStoryState?.(STORY_STATES[now] ?? 'pre')
      },
    )
    this.reaction(
      () => (iv.q.value >= 0.99 ? 1 : 0),
      (now) => {
        if (now && iv.seen2.value < 1) iv.seen2.value = 1
      },
    )
    this.reaction(
      () => iv.q.value,
      (qq) => {
        if (qq >= LATCH_S1_Q && iv.s1.value < 1) {
          cancelAnimation(iv.s1)
          iv.s1.value = 1
        }
        if (qq >= LATCH_T3_Q && iv.t3.value < 1) {
          cancelAnimation(iv.t3)
          iv.t3.value = 1
          this.settling3.value = 0
        }
      },
    )
    this.reaction(
      () => iv.v2.value,
      (vv) => {
        if (this.commitT2.value === 1 && vv >= this.t2Goal.value - 1e-6 && iv.t2.value < this.t2Goal.value) {
          iv.t2.value = this.t2Goal.value
          this.commitT2.value = 0
        }
      },
    )
    if (tapLoop) {
      this.reaction(
        () => this.attentionMask() + (this.rmSV.value ? ATTENTION_FROZEN_BIT : 0),
        (now) => this.syncAttention(now % ATTENTION_FROZEN_BIT),
      )
    }
    this.reaction(
      () => this.rmKick.value,
      (now, prev) => {
        if (prev != null && now !== prev) this.rmFadeTo(0)
      },
    )
    this.reaction(
      () => this.flushKick.value,
      (now, prev) => {
        if (prev != null && now !== prev) this.flushPending()
      },
    )

    // The home assembles when the intro opens.
    this.startBeatSettle(0, 0)
    ticker.wake()
  }

  setStage(stage: Stage, width: number) {
    this.stage = stage
    this.colW.value = width
    this.ticker.wake()
  }

  setReducedMotion(on: boolean) {
    this.rmSV.value = on ? 1 : 0
  }

  get reducedMotion() {
    return this.rmSV.value === 1
  }

  // Whether a tap should be ignored because it ends a drag.
  consumedByPan() {
    return this.panActive || Date.now() - this.panMovedAt < PAN_CONSUME_MS
  }

  next = () => {
    if (!this.consumedByPan()) this.step(1)
  }

  back = () => {
    if (!this.consumedByPan()) this.step(-1)
  }

  skip = () => {
    if (!this.consumedByPan()) this.skipW()
  }

  inviteTelli = () => {
    if (!this.consumedByPan()) this.invite()
  }

  addAll = () => {
    if (!this.consumedByPan()) this.addAllW()
  }

  goTo = (beat: number) => this.goToW(clamp(Math.round(beat), 0, 3), true)

  // Where the scene is heading, for the copy and the URL.
  get targetBeat() {
    return this.target.value
  }

  private reaction(read: () => number, react: (now: number, prev: number | null) => void) {
    this.reactions.push({ prev: null, react, read })
  }

  private runReactions() {
    for (const r of this.reactions) {
      const now = r.read()
      if (now !== r.prev) {
        const prev = r.prev
        r.prev = now
        r.react(now, prev)
      }
    }
  }

  private cancelPulses() {
    const { pulseInvite, pulseAddAll } = this.iv
    cancelAnimation(pulseInvite)
    cancelAnimation(pulseAddAll)
    pulseInvite.value = 0
    pulseAddAll.value = 0
  }

  private motionStart(keepTap = 0) {
    const { p, t2, t3, s1, t2From, atRest } = this.iv
    const userPlay = this.tapPlaying.value === 1 || this.commitT2.value === 1
    cancelAnimation(p)
    cancelAnimation(t2)
    cancelAnimation(t3)
    cancelAnimation(s1)
    this.cancelPulses()
    if (userPlay) {
      if (keepTap) {
        this.commitT2.value = 1
      } else {
        t2.value = Math.max(t2.value, this.t2Goal.value)
        this.commitT2.value = 0
      }
    }
    this.tapPlaying.value = 0
    this.settling3.value = 0
    if (p.value <= 1 + 1e-6) t2From.value = t2.value
    if (atRest.value === 1) this.events.onMotion?.()
    atRest.value = 0
  }

  // Which controls are available, one bit each: enter pod, invite Telli, add all, invite Paula, go home, and resting on
  // the last beat.
  private attentionMask() {
    const { canEnterPod, canInvite, canAddAll, canInvitePaula, canGoHome, atRest, p } = this.iv
    return (
      (canEnterPod.value ? 1 : 0) +
      (canInvite.value ? 2 : 0) +
      (canAddAll.value ? 4 : 0) +
      (canInvitePaula.value ? 8 : 0) +
      (canGoHome.value ? 16 : 0) +
      (atRest.value === 1 && Math.abs(p.value - 3) < 0.01 ? 32 : 0)
    )
  }

  // Restarts the ring's loop when the set of available controls changes; reduced motion holds it still.
  private syncAttention(mask: number) {
    const { hl } = this.iv
    cancelAnimation(hl)
    if (this.rmSV.value) {
      hl.value = HL_FROZEN
      return
    }
    hl.value = 0
    if (mask) hl.value = withRepeat(tm(1, HL_PERIOD_MS))
  }

  private runPulse(which: 0 | 1) {
    if (this.rmSV.value || this.tapLoop) return
    const sv = which === 0 ? this.iv.pulseInvite : this.iv.pulseAddAll
    const done = which === 0 ? this.pulsedInvite : this.pulsedAddAll
    if (done.value) return
    done.value = 1
    sv.value = withSequence(dl(PULSE_DELAY_MS, tm(1, 4 * PULSE_HALF_MS)), tm(0, 0))
  }

  private onT2Gate(goal: number) {
    const { atRest, p } = this.iv
    if (atRest.value !== 1 || Math.abs(p.value - 1) > 0.01) return
    if (Math.abs(goal - G1_T) < 1e-6) this.runPulse(0)
    else if (Math.abs(goal - G2_T) < 1e-6) this.runPulse(1)
  }

  private t2Ms(from: number, goal: number) {
    if (goal > G2_T + 1e-6)
      return (Math.max(0, goal - Math.max(from, G2_T)) / (1 - G2_T)) * ADDALL_PLAY_MS + Math.max(0, G2_T - from) * T2
    return Math.max(0, goal - from) * T2
  }

  // Plays the story of the beat the scene just settled on, from where it was left.
  private startBeatSettle(b: number, delay: number) {
    const rm = this.rmSV.value === 1
    const { s1, t2, t3 } = this.iv
    if (b === 0 && s1.value < 1) {
      s1.value = rm ? 1 : dl(delay, tm(1, (1 - s1.value) * this.assemblyMs))
    } else if (b === 1) {
      const goal = this.t2Goal.value
      const from = t2.value
      if (from < goal - 1e-6) {
        const ms = rm ? RM_INVITE_BTN_MS : this.t2Ms(from, goal)
        if (goal > G1_T + 1e-6) this.tapPlaying.value = 1
        t2.value = dl(
          delay,
          tm(goal, ms, (fin) => {
            this.tapPlaying.value = 0
            if (fin) this.onT2Gate(goal)
          }),
        )
      } else {
        this.onT2Gate(goal)
      }
    } else if (b === 2 && t3.value < 1) {
      if (rm) {
        t3.value = 1
      } else {
        this.settling3.value = 1
        t3.value = dl(
          delay,
          tm(1, (1 - t3.value) * T3, () => {
            this.settling3.value = 0
          }),
        )
      }
    }
  }

  private settle(b: number) {
    this.animating.value = 0
    this.iv.atRest.value = 1
    this.target.value = b
    this.events.onSettled?.(b)
    this.startBeatSettle(b, SETTLE_DELAY_MS)
  }

  private playLegs(legs: Leg[], T: number) {
    this.seq.value += 1
    const id = this.seq.value
    if (legs.length === 0) {
      this.settle(T)
      return
    }
    this.animating.value = 1
    const anims = legs.map((leg, i) =>
      withTiming(
        leg.p1,
        { duration: Math.max(1, leg.ms), easing: (t) => legProgress(leg, t) },
        i === legs.length - 1
          ? (fin) => {
              if (fin && this.seq.value === id) this.settle(T)
            }
          : undefined,
      ),
    )
    this.iv.p.value = anims.length === 1 ? (anims[0] as Animation) : withSequence(...anims)
  }

  // Reduced motion: swaps the scene to the target beat's end state behind the veil.
  private rmSwap() {
    const { t2From, t2, p, s1, t3 } = this.iv
    const T = this.target.value
    t2From.value = t2.value
    p.value = T
    if (T === 0) s1.value = 1
    if (T === 1) t2.value = this.t2Goal.value > G1_T + 1e-6 ? this.t2Goal.value : Math.max(t2.value, NOTE_DONE_T)
    if (T === 2) t3.value = 1
    if (T === 3) {
      t3.value = 1
      s1.value = 1
    }
  }

  private holdStep(T: number) {
    this.pendingSkip.value = 0
    this.pendingT.value = T
  }

  private rmFadeTo(delay: number) {
    const { veil, p } = this.iv
    this.fading.value = 1
    this.fadeKind.value = FADE_PAGE
    this.animating.value = 1
    veil.value = dl(
      delay,
      tm(0, RM_OUT_MS, (fin) => {
        if (!fin) return
        this.rmSwap()
        veil.value = tm(1, RM_IN_MS, (fin2) => {
          if (!fin2) return
          if (Math.round(p.value) !== this.target.value) {
            this.rmKick.value += 1
            return
          }
          this.fading.value = 0
          this.fadeKind.value = 0
          this.settle(this.target.value)
          this.flushKick.value += 1
        })
      }),
    )
  }

  private rmGo(T: number) {
    const { p, atRest, t2From, veil } = this.iv
    if (this.fading.value) {
      if (this.fadeKind.value === FADE_PAGE) this.target.value = T
      else this.holdStep(T)
      return
    }
    this.target.value = T
    if (Math.round(p.value) === T && atRest.value === 1) return
    this.motionStart()
    const se = storyEndOf(t2From.value)
    // Leaving beat 2 with its story unfinished shows the finished story first.
    if (Math.round(p.value) === 1 && T >= 2 && se > 1 + 1e-6) {
      this.fading.value = 1
      this.fadeKind.value = FADE_PAGE
      this.animating.value = 1
      veil.value = tm(0, RM_CONFIRM_OUT_MS, (fin) => {
        if (!fin) return
        p.value = se
        veil.value = tm(1, RM_CONFIRM_IN_MS, (fin2) => {
          if (fin2) this.rmFadeTo(RM_CONFIRM_HOLD_MS)
        })
      })
      return
    }
    this.rmFadeTo(0)
  }

  private goToW(T: number, retarget: boolean) {
    if (this.finger.value) return
    const { atRest, p, t2From } = this.iv
    const Tc = Math.max(0, Math.min(3, T))
    if (this.rmSV.value) {
      this.rmGo(Tc)
      return
    }
    if (this.fading.value) {
      this.holdStep(Tc)
      return
    }
    if (!retarget && atRest.value === 1 && Math.abs(p.value - Tc) < 0.01) return
    if (this.animating.value === 1 && Tc === this.target.value) return
    const keepTap = this.tapPlaying.value === 1 && Tc > p.value + 0.01 ? 1 : 0
    this.motionStart(keepTap)
    this.target.value = Tc
    const se = storyEndOf(t2From.value)
    this.playLegs(planMove(p.value, Tc, se, t2From.value, retarget), Tc)
  }

  private step(d: number) {
    const { p } = this.iv
    const moving = this.animating.value === 1 || this.fading.value === 1
    const retarget = moving || Math.abs(p.value - Math.round(p.value)) > 0.01
    const base = moving ? this.target.value : Math.round(p.value)
    this.goToW(base + d, retarget)
  }

  private skipW() {
    if (this.finger.value) return
    const iv = this.iv
    if (this.fading.value) {
      if (this.fadeKind.value !== FADE_SKIP) {
        this.pendingT.value = -1
        this.pendingSkip.value = 1
      }
      return
    }
    if (iv.q.value > 2.5) return
    this.motionStart()
    this.seq.value += 1
    this.animating.value = 1
    this.fading.value = 1
    this.fadeKind.value = FADE_SKIP
    this.target.value = 3
    const outMs = this.rmSV.value ? RM_OUT_MS : SKIP_OUT_MS
    const inMs = this.rmSV.value ? RM_IN_MS : SKIP_IN_MS
    this.textVeil.value = withSequence(tm(0, outMs), tm(1, inMs))
    iv.veil.value = tm(0, outMs, (fin) => {
      if (!fin) return
      iv.s1.value = 1
      iv.t2.value = 1
      iv.t3.value = 1
      this.t2Goal.value = 1
      iv.t2From.value = 1
      iv.seen2.value = 1
      iv.p.value = 3
      iv.veil.value = tm(1, inMs, (fin2) => {
        this.fading.value = 0
        this.fadeKind.value = 0
        if (fin2) {
          this.settle(3)
          this.flushKick.value += 1
        }
      })
    })
  }

  private rmStory(val: number, outMs: number, inMs: number) {
    const { veil, t2 } = this.iv
    this.fading.value = 1
    this.fadeKind.value = FADE_STORY
    veil.value = tm(0, outMs, (fin) => {
      if (!fin) return
      t2.value = val
      veil.value = tm(1, inMs, () => {
        this.fading.value = 0
        this.fadeKind.value = 0
        this.flushKick.value += 1
      })
    })
  }

  private invite() {
    const { canInvite, t2, pulseInvite } = this.iv
    if (!canInvite.value) return
    cancelAnimation(t2)
    cancelAnimation(pulseInvite)
    pulseInvite.value = 0
    this.pulsedInvite.value = 1
    this.t2Goal.value = G2_T
    if (this.rmSV.value) {
      this.rmStory(G2_T, RM_INVITE_OUT_MS, RM_INVITE_IN_MS)
      return
    }
    this.tapPlaying.value = 1
    t2.value = tm(G2_T, this.t2Ms(t2.value, G2_T), (fin) => {
      this.tapPlaying.value = 0
      if (fin) this.onT2Gate(G2_T)
    })
  }

  private addAllW() {
    const { canAddAll, t2, pulseAddAll } = this.iv
    if (!canAddAll.value) return
    cancelAnimation(t2)
    cancelAnimation(pulseAddAll)
    pulseAddAll.value = 0
    this.pulsedAddAll.value = 1
    this.t2Goal.value = 1
    if (this.rmSV.value) {
      this.rmStory(1, RM_ADDALL_OUT_MS, RM_ADDALL_IN_MS)
      return
    }
    this.tapPlaying.value = 1
    t2.value = tm(1, ADDALL_PLAY_MS, () => {
      this.tapPlaying.value = 0
    })
  }

  private flushPending() {
    if (this.pendingSkip.value) {
      this.pendingSkip.value = 0
      this.pendingT.value = -1
      this.skipW()
      return
    }
    const T = this.pendingT.value
    if (T < 0) return
    this.pendingT.value = -1
    this.goToW(T, false)
  }

  private panOver(tx: number) {
    if (!this.panLive.value) return
    this.panLive.value = 0
    const px = Math.max(this.panMaxPx.value, Math.abs(tx - this.panTx0.value))
    this.panMaxPx.value = 0
    this.onPan(false, px > PAN_MOVED_BEATS * PAN_BEAT_WIDTH * this.colW.value)
  }

  private onPan(active: boolean, moved: boolean) {
    this.panActive = active
    if (moved) this.panMovedAt = Date.now()
  }

  dragBegin = (tx0: number) => {
    const iv = this.iv
    this.panMaxPx.value = 0
    this.panTx0.value = tx0
    this.panLive.value = 1
    this.onPan(true, false)
    if (this.fading.value && !this.rmSV.value) {
      this.panIgnore.value = 1
      return
    }
    this.panIgnore.value = 0
    this.finger.value = 1
    this.panStartBeat.value = Math.max(0, Math.min(3, Math.round(iv.q.value)))
    if (this.rmSV.value) return
    this.motionStart()
    this.seq.value += 1
    this.animating.value = 0
    this.panStart.value = iv.p.value
  }

  dragMove = (tx: number) => {
    if (this.panLive.value) this.panMaxPx.value = Math.max(this.panMaxPx.value, Math.abs(tx - this.panTx0.value))
    if (this.panIgnore.value || this.rmSV.value || !this.finger.value) return
    const raw = this.panStart.value - (this.dir * (tx - this.panTx0.value)) / (PAN_BEAT_WIDTH * this.colW.value)
    this.iv.p.value = rubber(raw)
  }

  dragEnd = (tx: number, vx: number) => {
    const iv = this.iv
    this.panOver(tx)
    if (this.panIgnore.value || !this.finger.value) {
      this.finger.value = 0
      return
    }
    this.finger.value = 0
    const dx = tx - this.panTx0.value
    if (this.rmSV.value) {
      if (Math.abs(dx) > RM_PAN_FRACTION * this.colW.value) {
        const fwd = -this.dir * dx > 0 ? 1 : -1
        const base = this.fading.value ? this.target.value : Math.round(iv.p.value)
        this.rmGo(Math.max(0, Math.min(3, base + fwd)))
      }
      return
    }
    const se = storyEndOf(iv.t2From.value)
    const qNow = qOf(iv.p.value, se)
    const vp = (-this.dir * vx) / (PAN_BEAT_WIDTH * this.colW.value)
    const T = panTarget(this.panStartBeat.value, qNow, vp * dqdp(iv.p.value, se))
    this.target.value = T
    this.animating.value = 1
    this.seq.value += 1
    const id = this.seq.value
    const k = SNAP_SPRING.stiffness
    const x0 = iv.p.value - T
    const e0 = 0.5 * k * x0 * x0 + 0.5 * SNAP_SPRING.mass * vp * vp
    const energyThreshold = e0 > 0 ? Math.min(1, (k * SNAP_REST_EPS * SNAP_REST_EPS) / e0) : 1
    iv.p.value = withSpring(T, { ...SNAP_SPRING, energyThreshold, velocity: vp }, (fin) => {
      if (fin && this.seq.value === id) this.settle(T)
    })
  }

  dragCancel = () => {
    if (this.finger.value && !this.panIgnore.value) this.dragEnd(this.panTx0.value, 0)
    else this.panOver(this.panTx0.value)
    this.finger.value = 0
  }
}
