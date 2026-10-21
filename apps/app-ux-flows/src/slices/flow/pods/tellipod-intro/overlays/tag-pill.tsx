// Port of the prototype's TagPill: the rounded label that names a pod on the world, with an optional pulse ring
// and new-message dot.

import { type RefObject, useLayoutEffect, useRef, useState } from 'react'

import { useFrameStyle, useIntroScene } from '../engine/frame'
import type { Box, IntroValues } from '../engine/values'
import { buttonGradient, light, palette } from '../scene/palette'
import { AttentionRing } from './attention-ring'
import type { IconName } from './icons'
import { Avatar, CatHead, DotBadge, DSText, Icon, LinearGradient } from './ui'

const sizes = {
  L: { cat: 26, h: 44, icon: 20, inset: 5, lead: 34, padR: 16 },
  M: { cat: 22, h: 36, icon: 16, inset: 4, lead: 28, padR: 14 },
} as const

const shadows = {
  brand: '0px 1px 2px 0px #0206171f, 0px 10px 28px -6px #3b5b6373',
  light: '0px 1px 2px 0px #0206170f, 0px 10px 28px -6px #02061724, 0px 0px 0px 1px #0206170d',
} as const

type PillLead = { icon: IconName } | { initials: string } | { cat: true }

// A value derived from the scene each frame, before styles are applied, for components that share it.
export const useDerivedBox = (compute: (iv: IntroValues) => number): Box<number> => {
  const { ticker, iv } = useIntroScene()
  const computeRef = useRef(compute)
  computeRef.current = compute
  const [box] = useState(() => ({ value: compute(iv) }))
  useLayoutEffect(
    () =>
      ticker.on(1, () => {
        box.value = computeRef.current(iv)
      }),
    [ticker, iv, box],
  )
  return box
}

// Keeps `box` at the element's laid-out width, as the prototype's `onLayout` handlers do.
export const useMeasuredWidth = (ref: RefObject<HTMLElement | null>, box: Box<number>) => {
  const { ticker } = useIntroScene()
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const w = el.offsetWidth
      if (w > 0 && w !== box.value) {
        box.value = w
        ticker.wake()
      }
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, box, ticker])
}

export const CatAvatar = () => (
  <Avatar holder={palette['orange-200']} size="XXS">
    <CatHead size={16} />
  </Avatar>
)

const Lead = ({ lead, size }: { lead: PillLead; size: keyof typeof sizes }) => {
  const l = sizes[size]
  const cat = 'cat' in lead
  return (
    <span
      style={{
        alignItems: 'center',
        backgroundColor: cat ? palette['orange-200'] : light['surface-brand-light'],
        borderRadius: l.lead / 2,
        display: 'flex',
        flexShrink: 0,
        height: l.lead,
        justifyContent: 'center',
        position: 'relative',
        width: l.lead,
      }}
    >
      {cat ? (
        <CatHead size={l.cat} />
      ) : 'icon' in lead ? (
        <Icon color={light['surface-brand-main']} name={lead.icon} size={l.icon} />
      ) : (
        <DSText color={light['text-brand-solid']} size="sm" weight="semibold">
          {lead.initials}
        </DSText>
      )}
    </span>
  )
}

type TagPillProps = {
  label: string
  lead: PillLead
  tone?: 'light' | 'brand'
  size?: keyof typeof sizes
  // Opacity of the pulse ring around the pill.
  ringOpacity?: (iv: IntroValues) => number
  dotScale?: Box<number>
  // Rings the pill while `live`, to mark it as the control to tap next.
  highlight?: { live: (iv: IntroValues) => boolean }
  pillRef?: RefObject<HTMLSpanElement | null>
}

export const TagPill = ({
  label,
  lead,
  tone = 'light',
  size = 'M',
  ringOpacity,
  dotScale,
  highlight,
  pillRef,
}: TagPillProps) => {
  const brand = tone === 'brand'
  const k = sizes[size]
  const radius = k.h / 2
  const ringRef = useRef<HTMLSpanElement>(null)
  useFrameStyle(ringRef, (iv) => {
    const o = ringOpacity ? ringOpacity(iv) : 0
    return { display: o > 0.001 ? 'flex' : 'none', opacity: o }
  })

  return (
    <span ref={pillRef} style={{ alignSelf: 'center', display: 'flex', position: 'relative' }}>
      {highlight ? <AttentionRing live={highlight.live} radius={radius} /> : null}
      {ringOpacity ? (
        <span
          ref={ringRef}
          style={{
            border: '3px solid #4f868e66',
            borderRadius: radius + 3,
            bottom: -3,
            left: -3,
            pointerEvents: 'none',
            position: 'absolute',
            right: -3,
            top: -3,
          }}
        />
      ) : null}
      <span style={{ borderRadius: radius, boxShadow: shadows[tone], display: 'flex' }}>
        <span
          style={{
            alignItems: 'center',
            backgroundColor: brand ? undefined : light['surface-default-main'],
            borderRadius: radius,
            display: 'flex',
            height: k.h,
            overflow: 'hidden',
            paddingLeft: k.inset,
            paddingRight: k.padR,
            position: 'relative',
          }}
        >
          {brand ? <LinearGradient angle={96} colors={buttonGradient} /> : null}
          <Lead lead={lead} size={size} />
          <DSText
            color={brand ? '#ffffff' : light['text-default-title']}
            numberOfLines={1}
            style={{ paddingLeft: 8, position: 'relative' }}
            weight="semibold"
          >
            {label}
          </DSText>
        </span>
      </span>
      {dotScale ? <DotBadge scale={dotScale} style={{ position: 'absolute', right: -1, top: -1 }} /> : null}
    </span>
  )
}
