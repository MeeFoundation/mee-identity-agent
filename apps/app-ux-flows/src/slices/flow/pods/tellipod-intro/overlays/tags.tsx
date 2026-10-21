// Port of the prototype's room tags: Kyoto trip and Sofia beside their rooms, the Ginger tag that docks into the
// pod card, and the member avatars that gather next to it.

import { useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { HL_GAP, HL_SPREAD, HL_STROKE } from '../engine/attention'
import { w2s } from '../engine/camera'
import { useFrameStyle, useFrameValue, useIntroScene } from '../engine/frame'
import { eo, interp, ph, pulse, remap } from '../engine/math'
import { T1, T2, T3 } from '../engine/timeline'
import type { Box, IntroValues } from '../engine/values'
import {
  gingerChipCentre,
  gingerDims,
  gingerIsL,
  gingerStackGeo,
  pillScale,
  place,
  placeTransform,
  TAG_H,
  TAG_H_L,
  TAG_KYOTO,
  TAG_SCALE,
  TAG_SOFIA,
  useAnchor,
  useGingerGeo,
} from './anchors'
import { youCardRect, youCardT } from './sync-cards'
import { TagPill, useDerivedBox, useMeasuredWidth } from './tag-pill'
import { Avatar, avatarSizes, hitTarget } from './ui'

const BOX = [220, 48] as const

// In tap mode Sofia's tag moves up and left on the first beat, clear of the large Ginger tag.
const SOFIA_TAP_NUDGE = [-25, -25] as const

// A tag drops in over 200 ms, starting `at` ms into the home's assembly.
const drop = (a1: number, at: number) => ph(a1 * T1, at, at + 200)

const sideTagOpacity = (q: number) => interp(q, [0, 0.2, 0.5, 2.4, 2.8, 3], [1, 1, 0, 0, 1, 1])

const boxStyle = {
  alignItems: 'center',
  display: 'flex',
  height: BOX[1],
  justifyContent: 'center',
  left: 0,
  pointerEvents: 'none',
  position: 'absolute',
  top: 0,
  width: BOX[0],
} as const

export const SideTag = ({ which }: { which: 'kyoto' | 'sofia' }) => {
  const { t } = useTranslation()
  const { iv, stage, tap } = useIntroScene()
  const ref = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const kyoto = which === 'kyoto'
  const nudge = !kyoto && tap ? SOFIA_TAP_NUDGE : ([0, 0] as const)
  const at = kyoto ? 520 : 400
  const lift = kyoto ? 10 : 0
  const ui = stage.ui
  const chipW = useRef<Box<number>>({ value: kyoto ? 132 : 92 }).current
  useMeasuredWidth(pillRef, chipW)
  useAnchor(ref, stage, kyoto ? TAG_KYOTO : TAG_SOFIA, {
    box: BOX,
    clampH: TAG_H,
    clampW: chipW,
    offset: () => {
      const n = iv.q.value < 1 ? 1 : 0
      return [nudge[0] * ui * n, (nudge[1] * n - lift) * ui - 6 * ui * (1 - eo(drop(iv.a1.value, at)))]
    },
    opacity: () => sideTagOpacity(iv.q.value) * drop(iv.a1.value, at),
  })
  return (
    <div aria-hidden ref={ref} style={boxStyle}>
      <TagPill
        label={t(kyoto ? 'pods.tellipodIntro.pod.tags.kyoto' : 'pods.tellipodIntro.pod.tags.sofia')}
        lead={kyoto ? { icon: 'airplane' } : { initials: t('pods.tellipodIntro.pod.sofiaInitial') }}
        pillRef={pillRef}
      />
    </div>
  )
}

// The ring that pulses around the Ginger tag when Paula's message arrives.
const useMessagePulse = () => {
  const { reducedMotion } = useIntroScene()
  return (iv: IntroValues) => (reducedMotion ? 0 : pulse(ph(iv.v3.value * T3, 1950, 2200)))
}

export const GingerTag = ({ chipW, onEnterPod }: { chipW: Box<number>; onEnterPod: () => void }) => {
  const { t } = useTranslation()
  const { iv, stage, tap } = useIntroScene()
  const geo = useGingerGeo()
  const ui = stage.ui
  const ref = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const hintId = useId()
  const ringOpacity = useMessagePulse()
  const dotScale = useDerivedBox((values) => ph(values.v3.value * T3, 2000, 2150))
  const live = useFrameValue((values) => values.q.value < 0.5)
  const big = useFrameValue((values) => gingerIsL(geo, values.q.value))
  useMeasuredWidth(pillRef, chipW)

  useFrameStyle(ref, (values) => {
    const q = values.q.value
    const c = gingerChipCentre(values.cam.value, values.dockW.value, chipW.value, geo, q)
    const d = drop(values.a1.value, 640)
    return {
      opacity: d * (1 - youCardT(q)),
      transform: placeTransform(
        place(c[0], c[1] - 6 * ui * (1 - eo(d)), BOX[0] / 2, BOX[1] / 2, BOX[0], BOX[1], gingerDims(geo, q).k),
      ),
    }
  })

  const hint = t(tap ? 'pods.tellipodIntro.pod.gingerTagTapHint' : 'pods.tellipodIntro.pod.gingerTagHint')
  return (
    <div ref={ref} style={boxStyle}>
      <button
        aria-describedby={hintId}
        aria-hidden={live ? undefined : true}
        aria-label={t('pods.tellipodIntro.pod.gingerTag')}
        className="cursor-pointer rounded-full border-0 bg-transparent outline-none focus-visible:ring-3 focus-visible:ring-ring"
        disabled={!live}
        onClick={() => {
          if (iv.q.value < 0.5 && (!tap || iv.atRest.value === 1)) onEnterPod()
        }}
        style={{
          ...hitTarget(104, big ? TAG_H_L : TAG_H, big ? pillScale(ui) : ui),
          display: 'flex',
          pointerEvents: live ? 'auto' : 'none',
        }}
        tabIndex={live ? 0 : -1}
        type="button"
      >
        <span aria-hidden style={{ display: 'flex' }}>
          <TagPill
            dotScale={dotScale}
            highlight={tap ? { live: (values) => values.canEnterPod.value } : undefined}
            label={t('pods.tellipodIntro.pod.tags.ginger')}
            lead={{ cat: true }}
            pillRef={pillRef}
            ringOpacity={ringOpacity}
            size={big ? 'L' : 'M'}
            tone="brand"
          />
        </span>
      </button>
      <span className="sr-only" id={hintId}>
        {hint}
      </span>
    </div>
  )
}

const STACK_BOX = [60, 24] as const
const AVATAR_STEP = avatarSizes.XS - 6

export const GingerStack = ({ chipW }: { chipW: Box<number> }) => {
  const { t } = useTranslation()
  const { stage } = useIntroScene()
  const geo = useGingerGeo()
  const tk = stage.ui * TAG_SCALE
  const ref = useRef<HTMLDivElement>(null)
  const youRef = useRef<HTMLSpanElement>(null)
  const telliRef = useRef<HTMLSpanElement>(null)
  const paulaRef = useRef<HTMLSpanElement>(null)
  const telliIn = useDerivedBox((iv) => ph(iv.v2.value * T2, 1950, 2000))
  const pIn = useDerivedBox((iv) => ph(iv.v3.value * T3, 1400, 1480))

  useFrameStyle(ref, (iv) => {
    const q = iv.q.value
    const n = 1 + telliIn.value + pIn.value
    const g = gingerStackGeo(iv.cam.value, iv.dockW.value, chipW.value, n, geo, q)
    return {
      opacity: 1 - youCardT(q),
      transform: placeTransform(place(g.left, g.cy, 0, STACK_BOX[1] / 2, STACK_BOX[0], STACK_BOX[1], tk)),
    }
  })
  useFrameStyle(youRef, (iv) => ({ opacity: iv.seen2.value >= 1 ? 1 : remap(iv.q.value, 0.8, 1) }))
  useFrameStyle(telliRef, () => ({ opacity: telliIn.value }))
  useFrameStyle(paulaRef, (iv) => {
    const m3 = iv.v3.value * T3
    const s = m3 < 1560 ? 1.04 * ph(m3, 1400, 1560) : 1.04 - 0.04 * ph(m3, 1560, 1650)
    return { opacity: pIn.value, transform: [{ scale: s }] }
  })

  const slots = [
    { key: 'you', node: <Avatar icon="person" ring size="XS" tone="person" />, ref: youRef },
    { key: 'telli', node: <Avatar icon="chat-ai-lock" ring size="XS" />, ref: telliRef },
    {
      key: 'paula',
      node: <Avatar initials={t('pods.tellipodIntro.pod.paulaInitial')} ring size="XS" tone="person" />,
      ref: paulaRef,
    },
  ]

  return (
    <div
      aria-hidden
      ref={ref}
      style={{
        height: STACK_BOX[1],
        left: 0,
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        width: STACK_BOX[0],
      }}
    >
      {slots.map((slot, i) => (
        <span
          key={slot.key}
          ref={slot.ref}
          style={{ display: 'block', left: i * AVATAR_STEP, position: 'absolute', top: 0, zIndex: slots.length - i }}
        >
          {slot.node}
        </span>
      ))}
    </div>
  )
}

// Where the Home tag hangs on the world: beside your phone, left of its card in the corner.
const HOME_AT = [166, 342] as const
const HOME_CARD_GAP = 12

const homeTagOpacity = (q: number, v3: number) => ph(v3 * T3, 2150, T3) * (q <= 2 ? 1 : 1 - remap(q, 2, 2.2))

// Tap mode: the way on from the Paula beat, which appears once Paula's message has arrived.
export const HomeTag = ({ onGoHome }: { onGoHome: () => void }) => {
  const { t } = useTranslation()
  const { iv, stage } = useIntroScene()
  const ui = stage.ui
  const k = pillScale(ui)
  const ref = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const hintId = useId()
  const chipW = useRef<Box<number>>({ value: 108 }).current
  const live = useFrameValue((values) => values.canGoHome.value)
  useMeasuredWidth(pillRef, chipW)
  useAnchor(
    ref,
    stage,
    (cam) => {
      const p = w2s(HOME_AT, cam, stage.w, stage.h)
      const r = youCardRect(stage.w, stage.h, ui)
      return [Math.min(p[0], r.left - HOME_CARD_GAP * ui - (chipW.value * k) / 2), p[1]]
    },
    {
      box: BOX,
      clampH: TAG_H_L,
      clampW: chipW,
      edge: HL_GAP + HL_STROKE + HL_SPREAD + 1,
      opacity: () => homeTagOpacity(iv.q.value, iv.v3.value),
      scale: () => k / ui,
    },
  )

  return (
    <div ref={ref} style={boxStyle}>
      <button
        aria-describedby={hintId}
        aria-hidden={live ? undefined : true}
        aria-label={t('pods.tellipodIntro.pod.home')}
        className="cursor-pointer rounded-full border-0 bg-transparent outline-none focus-visible:ring-3 focus-visible:ring-ring"
        disabled={!live}
        onClick={() => {
          if (iv.canGoHome.value) onGoHome()
        }}
        style={{ ...hitTarget(108, TAG_H_L, k), display: 'flex', pointerEvents: live ? 'auto' : 'none' }}
        tabIndex={live ? 0 : -1}
        type="button"
      >
        <span aria-hidden style={{ display: 'flex' }}>
          <TagPill
            highlight={{ live: (values) => values.canGoHome.value }}
            label={t('pods.tellipodIntro.pod.home')}
            lead={{ icon: 'house' }}
            pillRef={pillRef}
            size="L"
          />
        </span>
      </button>
      <span className="sr-only" id={hintId}>
        {t('pods.tellipodIntro.pod.homeHint')}
      </span>
    </div>
  )
}
