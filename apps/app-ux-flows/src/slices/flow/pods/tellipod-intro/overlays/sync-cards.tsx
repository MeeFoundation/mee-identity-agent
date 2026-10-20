// Port of the prototype's SyncCards: on beat 3 the Ginger pod card flies out of the room to each phone's corner,
// and both show the same rows, a turning sync icon and Paula's message.

import { type CSSProperties, type ReactNode, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { w2s } from '../engine/camera'
import { type FrameStyle, useFrameStyle, useIntroScene } from '../engine/frame'
import { eo, lerp, ph, pulse, remap, smooth } from '../engine/math'
import { T3 } from '../engine/timeline'
import type { Box, IntroValues } from '../engine/values'
import { light, palette } from '../scene/palette'
import { gingerChipCentre, paulaGinger, place, placeTransform, TAG_SCALE, useGingerGeo } from './anchors'
import { CatAvatar } from './tag-pill'
import { Avatar, DSText, LinearGradient } from './ui'

const SC_W = 182
const HEAD_H = 24 * TAG_SCALE
const TITLE_H = 22 * TAG_SCALE
const CHAT_H = 24 * TAG_SCALE
const BODY_H = 6 + TITLE_H + 48 + 4 + CHAT_H + 6
const SC_H = HEAD_H + 3 + BODY_H

// How far your phone's card has flown from Ginger's room into the corner.
export const youCardT = (q: number) => (q <= 2 ? smooth(remap(q, 1.65, 1.98)) : 1 - smooth(remap(q, 2.02, 2.32)))

const paulaCardT = (q: number, v3: number) => {
  const m3 = v3 * T3
  return q <= 2 ? eo(ph(m3, 1150, 1450)) * remap(q, 1.8, 2) : 1 - smooth(remap(q, 2, 2.25))
}

const fitK = (ui: number, sh: number) => Math.min(ui, (sh - 18) / (2 * SC_H + 6))

// Where your phone's card ends up in the corner of the stage; the Home tag keeps clear of it.
export const youCardRect = (sw: number, sh: number, ui: number) => {
  const k = fitK(ui, sh)
  return { k, left: sw - 8 - SC_W * k, top: sh - 6 - SC_H * k }
}

// Draws a `px` box at the tag scale, as the prototype's `Scaled` wrapper does.
const Scaled = ({ px, children }: { px: number; children: ReactNode }) => {
  const o = (px * (TAG_SCALE - 1)) / 2
  return (
    <span style={{ display: 'block', flexShrink: 0, height: px * TAG_SCALE, width: px * TAG_SCALE }}>
      <span
        style={{
          display: 'block',
          height: px,
          transform: `translateX(${o}px) translateY(${o}px) scale(${TAG_SCALE})`,
          width: px,
        }}
      >
        {children}
      </span>
    </span>
  )
}

const SyncGlyph = ({ size = 12, color = '#ffffff' }: { size?: number; color?: string }) => (
  <svg aria-hidden="true" height={size} viewBox="0 0 24 24" width={size}>
    <path d="M20 12a8 8 0 0 0-13.7-5.6" fill="none" stroke={color} strokeLinecap="round" strokeWidth={2.6} />
    <path
      d="M5.2 3.2v3.9h3.9"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.6}
    />
    <path d="M4 12a8 8 0 0 0 13.7 5.6" fill="none" stroke={color} strokeLinecap="round" strokeWidth={2.6} />
    <path
      d="M18.8 20.8v-3.9h-3.9"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.6}
    />
  </svg>
)

const syncTurns = (m3: number) => [ph(m3, 1600, 1900), ph(m3, 1950, 2250)] as const

const SyncIcon = () => {
  const spinRef = useRef<HTMLSpanElement>(null)
  const ringRef = useRef<HTMLSpanElement>(null)
  useFrameStyle(spinRef, (iv) => {
    const [a, b] = syncTurns(iv.v3.value * T3)
    return { transform: [{ rotate: -180 * (eo(a) + eo(b)) }, { scale: 1 + 0.18 * Math.max(pulse(a), pulse(b)) }] }
  })
  useFrameStyle(ringRef, (iv) => {
    const [a, b] = syncTurns(iv.v3.value * T3)
    return { opacity: Math.max(pulse(a), pulse(b)) }
  })
  return (
    <span style={{ display: 'block', height: 22, position: 'relative', width: 22 }}>
      <span
        ref={ringRef}
        style={{
          border: `3px solid ${light['alpha-outline-brand']}`,
          borderRadius: 14,
          height: 28,
          left: -3,
          position: 'absolute',
          top: -3,
          width: 28,
        }}
      />
      <span
        ref={spinRef}
        style={{
          alignItems: 'center',
          backgroundColor: palette['brand-700'],
          borderRadius: 11,
          display: 'flex',
          height: 22,
          justifyContent: 'center',
          width: 22,
        }}
      >
        <SyncGlyph />
      </span>
    </span>
  )
}

const InfoRow = ({ label, value, divider }: { label: string; value: string; divider?: boolean }) => (
  <span
    style={{
      alignItems: 'center',
      borderBottom: divider ? `1px solid ${light['stroke-gray-soft']}` : undefined,
      display: 'flex',
      height: 24,
      justifyContent: 'space-between',
    }}
  >
    <DSText color={light['text-default-subtle']} size="xs">
      {label}
    </DSText>
    <DSText color={light['text-default-body']} size="xs" weight="medium">
      {value}
    </DSText>
  </span>
)

// The rows' placeholder before Paula's phone has synced.
const SkeletonRow = ({ w }: { w: number }) => (
  <span style={{ alignItems: 'center', display: 'flex', height: 24, justifyContent: 'space-between' }}>
    <span style={{ backgroundColor: palette['gray-100'], borderRadius: 4, height: 8, width: 34 }} />
    <span style={{ backgroundColor: palette['gray-100'], borderRadius: 4, height: 8, width: w }} />
  </span>
)

const Composer = ({ placeholder }: { placeholder: string }) => (
  <span
    style={{
      backgroundColor: palette['gray-50'],
      border: `1px solid ${light['stroke-gray-light']}`,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      height: 24,
      justifyContent: 'center',
      padding: '0 8px',
    }}
  >
    <DSText color={light['text-default-placeholder']} size="xs">
      {placeholder}
    </DSText>
  </span>
)

const SentMessage = ({ text, time }: { text: string; time: string }) => (
  <span
    style={{
      alignItems: 'baseline',
      alignSelf: 'flex-end',
      borderRadius: 10,
      display: 'flex',
      gap: 6,
      overflow: 'hidden',
      padding: '3px 9px',
      position: 'relative',
    }}
  >
    <LinearGradient colors={[palette['gray-900'], palette['brand-900']]} />
    <DSText color="#ffffff" size="xs" style={{ position: 'relative' }} weight="medium">
      {text}
    </DSText>
    <DSText color="#ffffff99" size="2xs" style={{ position: 'relative' }}>
      {time}
    </DSText>
  </span>
)

const ReceivedMessage = ({ text, time, initial }: { text: string; time: string; initial: string }) => (
  <span style={{ alignItems: 'center', display: 'flex', gap: 5 }}>
    <Scaled px={24}>
      <Avatar initials={initial} size="XS" tone="person" />
    </Scaled>
    <span
      style={{
        alignItems: 'baseline',
        backgroundColor: '#ffffff',
        border: `1px solid ${light['alpha-dark-7']}`,
        borderRadius: 10,
        display: 'flex',
        gap: 6,
        padding: '3px 9px',
      }}
    >
      <DSText color={light['text-default-body']} size="xs" weight="medium">
        {text}
      </DSText>
      <DSText color={light['alpha-dark-60']} size="2xs">
        {time}
      </DSText>
    </span>
  </span>
)

// A layer whose opacity (and transform) follows the scene.
const Layer = ({
  style,
  compute,
  children,
}: {
  style: CSSProperties
  compute: (iv: IntroValues) => FrameStyle
  children: ReactNode
}) => {
  const ref = useRef<HTMLSpanElement>(null)
  useFrameStyle(ref, compute)
  return (
    <span ref={ref} style={{ display: 'block', position: 'absolute', ...style }}>
      {children}
    </span>
  )
}

const m3Of = (iv: IntroValues) => iv.v3.value * T3

const PodCard = ({ who }: { who: 'paula' | 'you' }) => {
  const { t } = useTranslation()
  const isP = who === 'paula'
  const pInRef = useRef<HTMLSpanElement>(null)
  useFrameStyle(pInRef, (iv) => {
    const m3 = m3Of(iv)
    return { opacity: ph(m3, 1400, 1480), transform: [{ scale: 0.6 + 0.4 * eo(ph(m3, 1400, 1560)) }] }
  })
  const text = t('pods.tellipodIntro.pod.message')
  const time = t('pods.tellipodIntro.pod.messageTime')
  const paulaInitial = t('pods.tellipodIntro.pod.paulaInitial')

  return (
    <span style={{ display: 'block', height: SC_H, width: SC_W }}>
      <span style={{ alignItems: 'center', display: 'flex', gap: 6, height: HEAD_H, paddingLeft: 2 }}>
        {isP ? (
          <Scaled px={24}>
            <Avatar initials={paulaInitial} ring size="XS" tone="person" />
          </Scaled>
        ) : (
          <span style={{ display: 'flex', width: 90 }}>
            <Scaled px={24}>
              <Avatar icon="person" ring size="XS" tone="person" />
            </Scaled>
            <span style={{ marginLeft: -9 }}>
              <Scaled px={24}>
                <Avatar icon="chat-ai-lock" ring size="XS" />
              </Scaled>
            </span>
            <span ref={pInRef} style={{ display: 'block', marginLeft: -9 }}>
              <Scaled px={24}>
                <Avatar initials={paulaInitial} ring size="XS" tone="person" />
              </Scaled>
            </span>
          </span>
        )}
        <DSText color={light['text-default-subtle']} size="xs" weight="semibold">
          {t(isP ? 'pods.tellipodIntro.pod.paulaPhone' : 'pods.tellipodIntro.pod.yourPhone')}
        </DSText>
      </span>
      <span
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 16,
          boxShadow: '0px 1px 20px 0px #0206170d, 0px 0px 0px 1px #0206170d',
          display: 'block',
          height: BODY_H,
          marginTop: 3,
          padding: '6px 10px',
        }}
      >
        <span style={{ alignItems: 'center', display: 'flex', gap: 6, height: TITLE_H, marginRight: -3 }}>
          <Scaled px={16}>
            <CatAvatar />
          </Scaled>
          <DSText color={light['text-default-title']} size="sm" style={{ flex: 1 }} weight="semibold">
            {t('pods.tellipodIntro.pod.tags.ginger')}
          </DSText>
          <Scaled px={22}>
            <SyncIcon />
          </Scaled>
        </span>
        <span style={{ display: 'block', height: 48, position: 'relative' }}>
          <Layer
            compute={(iv) => ({ opacity: isP ? 1 - ph(m3Of(iv), 1400, 1560) : 0 })}
            style={{ left: 0, right: 0, top: 0 }}
          >
            <SkeletonRow w={78} />
          </Layer>
          <Layer
            compute={(iv) => ({ opacity: isP ? 1 - ph(m3Of(iv), 1500, 1660) : 0 })}
            style={{ left: 0, right: 0, top: 24 }}
          >
            <SkeletonRow w={64} />
          </Layer>
          <Layer
            compute={(iv) => ({ opacity: isP ? ph(m3Of(iv), 1400, 1560) : 1 })}
            style={{ left: 0, right: 0, top: 0 }}
          >
            <InfoRow divider label={t('pods.tellipodIntro.pod.meals')} value={t('pods.tellipodIntro.pod.mealsValue')} />
          </Layer>
          <Layer
            compute={(iv) => ({ opacity: isP ? ph(m3Of(iv), 1500, 1660) : 1 })}
            style={{ left: 0, right: 0, top: 24 }}
          >
            <InfoRow label={t('pods.tellipodIntro.pod.portion')} value={t('pods.tellipodIntro.pod.portionValue')} />
          </Layer>
        </span>
        <span style={{ display: 'block', height: CHAT_H, marginTop: 4, position: 'relative' }}>
          <Layer
            compute={(iv) => ({ opacity: 1 - ph(m3Of(iv), 1950, 2050) })}
            style={{
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              left: 0,
              right: 0,
              top: 0,
            }}
          >
            <Composer placeholder={t('pods.tellipodIntro.pod.messagePlaceholder')} />
          </Layer>
          <Layer
            compute={(iv) => {
              const a = ph(m3Of(iv), 1950, 2150)
              return { opacity: a, transform: [{ translateY: 6 * (1 - eo(a)) }, { scale: 0.96 + 0.04 * a }] }
            }}
            style={{
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              left: 0,
              right: 0,
              top: 0,
            }}
          >
            {isP ? (
              <SentMessage text={text} time={time} />
            ) : (
              <ReceivedMessage initial={paulaInitial} text={text} time={time} />
            )}
          </Layer>
        </span>
      </span>
    </span>
  )
}

export const SyncCards = ({ chipW }: { chipW: Box<number> }) => {
  const { stage } = useIntroScene()
  const geo = useGingerGeo()
  const ui = stage.ui
  const sw = stage.w
  const sh = stage.h
  const youRef = useRef<HTMLDivElement>(null)
  const paulaRef = useRef<HTMLDivElement>(null)

  useFrameStyle(youRef, (iv) => {
    const q = iv.q.value
    const t = youCardT(q)
    const k = fitK(ui, sh)
    const src = gingerChipCentre(iv.cam.value, iv.dockW.value, chipW.value, geo, q)
    const x = lerp(src[0], sw - 8 - (SC_W * k) / 2, t)
    const y = lerp(src[1], sh - 6 - (SC_H * k) / 2, t)
    const op = Math.min(1, t * 4)
    return {
      display: op > 0.001 ? 'flex' : 'none',
      opacity: op,
      transform: placeTransform(place(x, y, SC_W / 2, SC_H / 2, SC_W, SC_H, k * lerp(0.25, 1, t))),
    }
  })

  useFrameStyle(paulaRef, (iv) => {
    const q = iv.q.value
    const t = paulaCardT(q, iv.v3.value)
    const k = fitK(ui, sh)
    const src = w2s(paulaGinger(iv.dv.value), iv.cam.value, sw, sh)
    const x = lerp(src[0], 8 + (SC_W * k) / 2, t)
    const y = lerp(src[1], 6 + (SC_H * k) / 2, t)
    const op = Math.min(1, t * 3)
    return {
      display: op > 0.001 ? 'flex' : 'none',
      opacity: op,
      transform: placeTransform(place(x, y, SC_W / 2, SC_H / 2, SC_W, SC_H, k * lerp(0.2, 1, t))),
    }
  })

  return (
    <div aria-hidden style={{ height: sh, left: 0, pointerEvents: 'none', position: 'absolute', top: 0, width: sw }}>
      <div ref={paulaRef} style={{ height: SC_H, left: 0, position: 'absolute', top: 0, width: SC_W }}>
        <PodCard who="paula" />
      </div>
      <div ref={youRef} style={{ height: SC_H, left: 0, position: 'absolute', top: 0, width: SC_W }}>
        <PodCard who="you" />
      </div>
    </div>
  )
}
