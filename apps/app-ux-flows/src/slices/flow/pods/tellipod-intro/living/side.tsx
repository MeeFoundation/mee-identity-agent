// What happens beside Ginger's card: Telli waiting and flying in on beat 2, and on beat 3 Paula's phone with the
// pod, the one-time link travelling to it, and Paula's avatar landing among the members. Ported from the prototype's
// `SceneV2`.

import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useFrameStyle, useIntroScene } from '../engine/frame'
import {
  BODY3_H,
  BODY3_W,
  CH,
  CW,
  KEY_B,
  keyAt,
  P_SLOT,
  P4,
  PAULA_AV,
  PAULA_CARD,
  PAULA_K,
  TELLI_WAIT,
  telliAt,
} from '../engine/living'
import { eio, eo, lerp, ph, remap, smooth } from '../engine/math'
import { T2, T3 } from '../engine/timeline'
import type { Box, IntroValues } from '../engine/values'
import { useMeasuredWidth } from '../overlays/tag-pill'
import { Avatar, DSText, Icon, shadow } from '../overlays/ui'
import { light, palette } from '../scene/palette'
import { CardHandle } from './deck'
import { SyncBadge } from './members'
import { abs, Bar, C, CARD_SHADOW, CatLine, KeyChipFace, Member, PodTile, StaticStack } from './parts'
import { SharedBody } from './pod-card'

const m2Of = (iv: IntroValues) => iv.v2.value * T2
const m3Of = (iv: IntroValues) => iv.v3.value * T3

const NONE = { pointerEvents: 'none' } as const
const GX = 232
const GW = CW - GX
const RING_COLOR = light['alpha-outline-brand']
const PAULA_R = 24 * PAULA_K

// Paula and her phone: they slide in on beat 3, and shrink into the last pod row's corner on beat 4.
export const PaulaSide = () => {
  const { t } = useTranslation()
  const { reducedMotion } = useIntroScene()
  const rootRef = useRef<HTMLDivElement>(null)
  const pulseRef = useRef<HTMLSpanElement>(null)
  const dotRef = useRef<HTMLSpanElement>(null)
  const phoneRingRef = useRef<HTMLSpanElement>(null)
  const skeletonRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useFrameStyle(rootRef, (v) => {
    const q = v.q.value
    if (q <= 2) {
      const k = eo(remap(q, 1.34, 1.9))
      return { opacity: remap(q, 1.38, 1.76), transform: [{ translateX: 80 * (1 - k) }, { scale: 1 }] }
    }
    const l = smooth(remap(q, 2, 2.46))
    return {
      opacity: 1 - remap(q, 2.08, 2.4),
      transform: [
        { translateX: (300 - (GX + GW / 2)) * l },
        { translateY: (P4.y + 30 - 190) * l },
        { scale: 1 - 0.75 * l },
      ],
    }
  })
  useFrameStyle(pulseRef, (v) => {
    const k = ph(m3Of(v), 1080, 1500)
    return { opacity: reducedMotion ? 0 : Math.sin(Math.PI * k), transform: [{ scale: 1 + 0.35 * k }] }
  })
  useFrameStyle(dotRef, (v) => {
    const k = ph(m3Of(v), 1150, 1300)
    return { opacity: k, transform: [{ scale: 0.4 + 0.6 * eo(k) }] }
  })
  useFrameStyle(phoneRingRef, (v) => {
    const m = m3Of(v)
    return { opacity: ph(m, 1150, 1350) * (1 - 0.7 * ph(m, 1500, 2100)) }
  })
  useFrameStyle(skeletonRef, (v) => ({ opacity: 1 - ph(m3Of(v), 1150, 1300) }))
  useFrameStyle(headerRef, (v) => {
    const k = eo(ph(m3Of(v), 1150, 1330))
    return { opacity: k, transform: [{ translateY: 6 * (1 - k) }] }
  })

  return (
    <div aria-hidden ref={rootRef} style={{ ...abs(GX, 0, { height: CH, width: GW }), ...NONE }}>
      <div style={abs(PAULA_AV.cx - GX - 20, PAULA_AV.cy - 20)}>
        <span
          ref={pulseRef}
          style={abs(-4, -4, {
            border: `3px solid ${palette['brand-300']}`,
            borderRadius: 24,
            boxSizing: 'border-box',
            height: 48,
            width: 48,
          })}
        />
        <Avatar initials={t('pods.tellipodIntro.pod.paulaInitial')} shadow={shadow[2]} size="M" tone="person" />
        <span
          ref={dotRef}
          style={abs(28, 28, {
            backgroundColor: light['surface-success-solid'],
            border: '2px solid #ffffff',
            borderRadius: 7,
            boxSizing: 'border-box',
            height: 13,
            width: 13,
          })}
        />
      </div>
      <div style={abs(PAULA_AV.cx - GX - 50, PAULA_AV.cy + 24, { textAlign: 'center', width: 100 })}>
        <DSText color={C.title} size="xs" weight="semibold">
          {t('pods.tellipodIntro.pod.memberNames.paula')}
        </DSText>
        <DSText color={C.sub} size="2xs" style={{ marginTop: -1 }}>
          {t('pods.tellipodIntro.living.labels.petSitter')}
        </DSText>
      </div>
      <div style={abs(PAULA_CARD.x - GX, PAULA_CARD.y, { height: PAULA_CARD.h, width: PAULA_CARD.w })}>
        <span
          style={abs(0, 0, {
            backgroundColor: C.card,
            border: `1px solid ${C.stroke}`,
            borderRadius: PAULA_R,
            boxShadow: CARD_SHADOW,
            boxSizing: 'border-box',
            height: PAULA_CARD.h,
            width: PAULA_CARD.w,
          })}
        />
        <span
          ref={phoneRingRef}
          style={abs(-3, -3, {
            border: `3px solid ${RING_COLOR}`,
            borderRadius: PAULA_R + 3,
            boxSizing: 'border-box',
            height: PAULA_CARD.h + 6,
            opacity: 0,
            width: PAULA_CARD.w + 6,
          })}
        />
        <div
          style={abs(1, 1, {
            borderRadius: PAULA_R - 1,
            height: PAULA_CARD.h - 2,
            overflow: 'hidden',
            width: PAULA_CARD.w - 2,
          })}
        >
          <div
            style={{
              height: BODY3_H,
              position: 'relative',
              transform: `translate(${(PAULA_CARD.w - 2 - BODY3_W) / 2}px, ${(PAULA_CARD.h - 2 - BODY3_H) / 2}px) scale(${PAULA_K})`,
              width: BODY3_W,
            }}
          >
            <div style={abs(0, 7, { display: 'flex', justifyContent: 'center', width: BODY3_W })}>
              <CardHandle />
            </div>
            <div ref={skeletonRef} style={abs(0, 0, { height: BODY3_H, width: BODY3_W })}>
              <span
                style={abs(15, 19, { backgroundColor: palette['gray-100'], borderRadius: 11, height: 40, width: 40 })}
              />
              <span style={abs(65, 25)}>
                <Bar h={10} w={78} />
              </span>
              <span style={abs(65, 43)}>
                <Bar h={8} w={46} />
              </span>
              <span
                style={abs(14, 92, {
                  backgroundColor: palette['gray-50'],
                  borderRadius: 10,
                  height: 46,
                  width: BODY3_W - 28,
                })}
              />
              <span
                style={abs(14, 144, {
                  backgroundColor: palette['gray-50'],
                  borderRadius: 10,
                  height: 46,
                  width: BODY3_W - 28,
                })}
              />
            </div>
            <div ref={headerRef} style={abs(0, 0, { height: 64, width: BODY3_W })}>
              <span style={abs(15, 19)}>
                <PodTile pod="ginger" />
              </span>
              <span style={abs(65, 19)}>
                <DSText color={C.title} numberOfLines={1} size="base" weight="semibold">
                  {t('pods.tellipodIntro.living.pods.ginger.name')}
                </DSText>
                <CatLine icon="heart" text={t('pods.tellipodIntro.living.pods.ginger.category')} />
              </span>
              <span style={abs(BODY3_W - 13 - 60, 26)}>
                <StaticStack people={['you', 'telli', { initial: t('pods.tellipodIntro.pod.paulaInitial') }]} />
              </span>
            </div>
            <SharedBody mine={false} />
          </div>
        </div>
        <div style={abs(PAULA_CARD.w - 16, -10)}>
          <SyncBadge visible={() => 1} />
        </div>
      </div>
    </div>
  )
}

// Paula's avatar leaves the line and lands among the members on Ginger's card.
export const PaulaChipFlight = () => {
  const { t } = useTranslation()
  const { reducedMotion } = useIntroScene()
  const ref = useRef<HTMLDivElement>(null)
  useFrameStyle(ref, (v) => {
    const q = v.q.value
    const m = m3Of(v)
    const visible = remap(q, 1.9, 2) * (1 - remap(q, 2, 2.06))
    const k = eio(ph(m, 1380, 1620))
    const o = reducedMotion ? 0 : visible * ph(m, 1380, 1420) * (1 - ph(m, 1600, 1640))
    return {
      display: o > 0.001 ? 'flex' : 'none',
      opacity: o,
      transform: [
        { translateX: lerp(KEY_B[0], P_SLOT[0], k) - 12 },
        { translateY: lerp(KEY_B[1], P_SLOT[1], k) - 40 * Math.sin(Math.PI * k) - 12 },
        { scale: lerp(1.6, 1, k) },
      ],
    }
  })
  return (
    <div aria-hidden ref={ref} style={{ ...abs(0, 0, { borderRadius: 12, boxShadow: shadow[3] }), ...NONE }}>
      <Member who={{ initial: t('pods.tellipodIntro.pod.paulaInitial') }} />
    </div>
  )
}

const KEY_DOTS = 18

const KeyDot = ({ i }: { i: number }) => {
  const { reducedMotion } = useIntroScene()
  const ref = useRef<HTMLSpanElement>(null)
  const ti = (i + 0.5) / KEY_DOTS
  const at = keyAt(ti)
  useFrameStyle(ref, (v) => {
    const q = v.q.value
    const m = m3Of(v)
    const on = remap(eio(ph(m, 200, 1100)), ti - 0.04, ti)
    const visible = q < 1.6 ? 0 : 1 - remap(q, 2, 2.12)
    return { opacity: reducedMotion ? 0 : on * visible * (1 - ph(m, 1300, 1700)) * 0.85 }
  })
  return (
    <span
      ref={ref}
      style={abs(at[0] - 2, at[1] - 2, { backgroundColor: palette['brand-400'], borderRadius: 2, height: 4, width: 4 })}
    />
  )
}

// The one-time link: a dotted line from your pod to Paula, and the chip that rides along it.
export const KeyPath = () => {
  const { t } = useTranslation()
  const { reducedMotion } = useIntroScene()
  const chipRef = useRef<HTMLDivElement>(null)
  const faceRef = useRef<HTMLSpanElement>(null)
  const chipW = useRef<Box<number>>({ value: 118 }).current
  useMeasuredWidth(faceRef, chipW)
  useFrameStyle(chipRef, (v) => {
    const q = v.q.value
    const m = m3Of(v)
    const k = eio(ph(m, 200, 1100))
    const p = keyAt(k)
    const s =
      m < 250
        ? lerp(0.6, 1, eo(ph(m, 0, 250)))
        : m < 1100
          ? 1
          : m < 1200
            ? lerp(1, 1.15, ph(m, 1100, 1200))
            : lerp(1.15, 0, ph(m, 1200, 1350))
    const o =
      reducedMotion || q < 1.6 || m <= 0 || m >= 1350
        ? 0
        : ph(m, 0, 150) * (1 - ph(m, 1250, 1350)) * (1 - remap(q, 2, 2.1))
    const tilt = 8 * Math.cos(Math.PI * k) * (k > 0 && k < 1 ? 1 : 0)
    return {
      display: o > 0.001 ? 'flex' : 'none',
      opacity: o,
      transform: [
        { translateX: p[0] - chipW.value / 2 },
        { translateY: p[1] - 12 },
        { rotate: `${-tilt}deg` },
        { scale: s },
      ],
    }
  })
  return (
    <>
      <div aria-hidden style={{ ...abs(0, 0, { height: CH, width: CW }), ...NONE }}>
        {Array.from({ length: KEY_DOTS }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: the dots are a fixed list
          <KeyDot i={i} key={i} />
        ))}
      </div>
      <div aria-hidden ref={chipRef} style={{ ...abs(0, 0), ...NONE }}>
        <span ref={faceRef} style={{ display: 'inline-flex' }}>
          <KeyChipFace label={t('pods.tellipodIntro.pod.oneTimeLink')} />
        </span>
      </div>
    </>
  )
}

// Telli waits above the open pod, bobbing, then flies into the members.
export const Telli = () => {
  const { t } = useTranslation()
  const { reducedMotion } = useIntroScene()
  const flyerRef = useRef<HTMLDivElement>(null)
  const pingRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const waiting = (v: IntroValues) => (v.q.value > 1.02 ? 0 : remap(v.q.value, 0.6, 0.96))
  useFrameStyle(flyerRef, (v) => {
    const m = m2Of(v)
    const vis = waiting(v)
    const op = vis * (1 - ph(m, 1960, 2010))
    let x = TELLI_WAIT[0]
    let y = TELLI_WAIT[1] - 5 * Math.abs(Math.sin(2 * Math.PI * ph(m, 840, 1120)))
    let k = 0.7 + 0.3 * eo(vis)
    let r = 0
    if (m > 1300) {
      const tt = reducedMotion ? (m > 1650 ? 1 : 0) : eio(ph(m, 1300, 2000))
      const p = telliAt(tt)
      x = p[0]
      y = p[1]
      k = lerp(1, 0.75, ph(m, 1640, 2000))
      r = 10 * Math.sin(Math.PI * tt)
    }
    return {
      display: op > 0.001 ? 'flex' : 'none',
      opacity: op,
      transform: [{ translateX: x - 16 }, { translateY: y - 16 }, { rotate: `${r}deg` }, { scale: k }],
    }
  })
  useFrameStyle(pingRef, (v) => {
    const m = m2Of(v)
    const f = m < 1100 ? (m % 550) / 550 : 1
    return {
      opacity: reducedMotion ? 0 : 0.7 * waiting(v) * (1 - f) * (m < 1100 ? 1 : 0),
      transform: [{ scale: 1 + 0.55 * eo(f) }],
    }
  })
  useFrameStyle(labelRef, (v) => ({
    opacity: waiting(v) * (1 - ph(m2Of(v), 1250, 1380)),
    transform: [{ translateX: TELLI_WAIT[0] - 30 }, { translateY: TELLI_WAIT[1] + 18 }],
  }))
  return (
    <>
      <div aria-hidden ref={labelRef} style={{ ...abs(0, 0, { textAlign: 'center', width: 60 }), ...NONE }}>
        <DSText color={palette['brand-700']} size="2xs" weight="semibold">
          {t('pods.tellipodIntro.pod.memberNames.telli')}
        </DSText>
      </div>
      <div aria-hidden ref={flyerRef} style={{ ...abs(0, 0, { height: 32, width: 32 }), ...NONE }}>
        <span
          ref={pingRef}
          style={abs(0, 0, {
            border: `2px solid ${palette['brand-300']}`,
            borderRadius: 16,
            boxSizing: 'border-box',
            height: 32,
            width: 32,
          })}
        />
        <span
          style={abs(0, 0, {
            backgroundColor: '#ffffff',
            borderRadius: 16,
            boxShadow: shadow[3],
            height: 32,
            width: 32,
          })}
        />
        <span
          style={abs(2, 2, {
            alignItems: 'center',
            backgroundColor: light['surface-brand-light'],
            borderRadius: 14,
            display: 'flex',
            height: 28,
            justifyContent: 'center',
            width: 28,
          })}
        >
          <Icon color={light['surface-brand-main']} name="chat-ai-lock" size={16} />
        </span>
      </div>
    </>
  )
}
