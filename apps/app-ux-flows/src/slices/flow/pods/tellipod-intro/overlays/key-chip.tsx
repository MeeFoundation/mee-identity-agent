// Port of the prototype's KeyChip: the one-time link that travels along the line to Paula's phone on beat 3.

import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { w2s } from '../engine/camera'
import { useIntroScene } from '../engine/frame'
import { lerp, ph } from '../engine/math'
import { T3 } from '../engine/timeline'
import type { Box } from '../engine/values'
import { keyTOf, linePoint, TAG_H, useAnchor } from './anchors'
import { TagPill, useMeasuredWidth } from './tag-pill'

const BOX = [220, 48] as const

// Pops in, rides the line, swells at Paula's phone and vanishes.
const keyScale = (m3: number) => {
  if (m3 < 250) return lerp(0.6, 1, ph(m3, 0, 250))
  if (m3 < 1100) return 1
  if (m3 < 1200) return lerp(1, 1.15, ph(m3, 1100, 1200))
  return lerp(1.15, 0, ph(m3, 1200, 1350))
}

export const KeyChip = () => {
  const { t } = useTranslation()
  const { iv, stage, reducedMotion } = useIntroScene()
  const ref = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const chipW = useRef<Box<number>>({ value: 160 }).current
  useMeasuredWidth(pillRef, chipW)
  useAnchor(ref, stage, (cam) => w2s(linePoint(iv.dv.value, keyTOf(iv.v3.value)), cam, stage.w, stage.h), {
    box: BOX,
    clampH: TAG_H,
    clampW: chipW,
    opacity: () => {
      const m3 = iv.v3.value * T3
      if (reducedMotion || iv.q.value < 1.5 || m3 <= 0 || m3 >= 1350) return 0
      return ph(m3, 0, 150) * (1 - ph(m3, 1250, 1350))
    },
    scale: () => keyScale(iv.v3.value * T3),
  })
  return (
    <div
      aria-hidden
      ref={ref}
      style={{
        alignItems: 'center',
        display: 'flex',
        height: BOX[1],
        justifyContent: 'center',
        left: 0,
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        width: BOX[0],
      }}
    >
      <TagPill label={t('pods.tellipodIntro.pod.oneTimeLink')} lead={{ icon: 'key' }} pillRef={pillRef} />
    </div>
  )
}
