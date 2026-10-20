import { type Camera, camera, type KeyValues } from './camera'
import { A1of, cardWOf, dimOf, dockWOf, dvOf, gazeOf, qOf, storyEndOf, V2of, V3of } from './drivers'
import type { SharedValue, Ticker } from './runtime'
import { ADDALL_FROM_T, G1_T, G2_T, INVITE_FROM_T } from './timeline'

export type Box<T> = { value: T }

// The stage's box in the screen and how the camera keys fit into it.
export type Stage = {
  x: number
  y: number
  w: number
  h: number
  // UI scale for overlays drawn on the stage.
  ui: number
  compact: boolean
  stageCompact: boolean
  endInset: number
  keyInsets: KeyValues
  keyShift: KeyValues
  featherTop: KeyValues
  // In the living layout, the stage's top and bottom edge of each beat's box, instead of `keyInsets`.
  keyBox?: readonly (readonly [number, number])[]
}

// What the controller animates.
export type IntroSources = {
  // Progress through the intro, 0..3; beat 2's story is stretched between 1 and its story end.
  p: SharedValue
  // Beat 2's story, 0..1, as far as the reviewer has played it.
  t2: SharedValue
  // Beat 3's story, 0..1.
  t3: SharedValue
  // Beat 1's assembly, 0..1.
  s1: SharedValue
  // Where beat 2's story was when the current move started.
  t2From: SharedValue
  // Whether beat 2 has been reached in this run.
  seen2: SharedValue
  // Scene opacity, for fades.
  veil: SharedValue
  pulseInvite: SharedValue
  pulseAddAll: SharedValue
  // Position, in turns, of the attention ring's loop in tap mode.
  hl: SharedValue
  // Whether the scene rests on a beat.
  atRest: SharedValue
}

export type IntroValues = IntroSources & {
  q: Box<number>
  v2: Box<number>
  v3: Box<number>
  a1: Box<number>
  cam: Box<Camera>
  dv: Box<number>
  dim: Box<number>
  gaze: Box<number>
  dockW: Box<number>
  cardW: Box<number>
  canInvite: Box<boolean>
  canAddAll: Box<boolean>
  canEnterPod: Box<boolean>
  canInvitePaula: Box<boolean>
  canGoHome: Box<boolean>
}

export const createIntroSources = (ticker: Ticker): IntroSources => ({
  atRest: ticker.sv(1),
  hl: ticker.sv(0),
  p: ticker.sv(0),
  pulseAddAll: ticker.sv(0),
  pulseInvite: ticker.sv(0),
  s1: ticker.sv(0),
  seen2: ticker.sv(0),
  t2: ticker.sv(0),
  t2From: ticker.sv(0),
  t3: ticker.sv(0),
  veil: ticker.sv(1),
})

export const createIntroValues = (sources: IntroSources, stage: Stage): IntroValues => {
  const values: IntroValues = {
    ...sources,
    a1: { value: 0 },
    cam: { value: { x: 0, y: 0, z: 1 } },
    canAddAll: { value: false },
    canEnterPod: { value: false },
    canGoHome: { value: false },
    canInvite: { value: false },
    canInvitePaula: { value: false },
    cardW: { value: 0 },
    dim: { value: 1 },
    dockW: { value: 0 },
    dv: { value: 0 },
    gaze: { value: 0 },
    q: { value: 0 },
    v2: { value: 0 },
    v3: { value: 0 },
  }
  deriveIntroValues(values, stage)
  return values
}

// Recomputes every derived value from the sources, once per frame.
export const deriveIntroValues = (iv: IntroValues, stage: Stage) => {
  const se = storyEndOf(iv.t2From.value)
  const p = iv.p.value
  const q = qOf(p, se)
  iv.q.value = q
  iv.v2.value = V2of(p, iv.t2.value, iv.t2From.value, se)
  iv.v3.value = V3of(q, iv.t3.value)
  iv.a1.value = A1of(q, iv.s1.value)
  iv.cam.value = camera(q, stage.w, stage.h, stage.keyInsets, stage.keyShift)
  iv.dv.value = dvOf(q)
  iv.dim.value = dimOf(q)
  iv.gaze.value = gazeOf(q, iv.v2.value)
  iv.dockW.value = dockWOf(q)
  iv.cardW.value = cardWOf(q)
  const rest = iv.atRest.value === 1
  const t2 = iv.t2.value
  const atBeat2 = rest && Math.abs(p - 1) < 0.01
  iv.canInvite.value = atBeat2 && t2 >= INVITE_FROM_T && t2 <= G1_T + 1e-6
  iv.canAddAll.value = atBeat2 && t2 >= ADDALL_FROM_T && t2 <= G2_T + 1e-6
  iv.canEnterPod.value = rest && Math.abs(p) < 0.01 && iv.s1.value >= 1 - 1e-6
  iv.canInvitePaula.value = atBeat2 && t2 >= 1 - 1e-6
  iv.canGoHome.value = rest && Math.abs(p - 2) < 0.01 && iv.t3.value >= 1 - 1e-6
}
