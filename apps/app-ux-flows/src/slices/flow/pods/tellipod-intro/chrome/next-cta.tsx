// Port of the prototype's `NextCta` (1091) and `LinkRow`: Next on beats 1–3, Get Started and the two links on beat 4.

import { useId, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFrameStyle, useFrameValue, useIntroScene } from '../engine/frame'
import type { IntroLayout } from '../engine/layout'
import { remap, smooth } from '../engine/math'
import type { IntroValues } from '../engine/values'
import { AttentionRing } from '../overlays/attention-ring'
import { ButtonFace } from '../overlays/button-face'
import { light } from '../scene/palette'

const NEXT_GONE_Q = 2.65
const GET_STARTED_RADIUS = 16
// Whether the scene rests on the last beat, where Get Started is the control to tap.
const restingAtEnd = (iv: IntroValues) => iv.atRest.value === 1 && Math.abs(iv.p.value - 3) < 0.01

const LinkRow = ({ label, live, onPress }: { label: string; live: boolean; onPress: () => void }) => (
  <button
    aria-hidden={!live}
    className="flex min-h-11 w-full cursor-pointer items-center justify-center px-4 font-semibold text-sm outline-none focus-visible:underline"
    disabled={!live}
    onClick={onPress}
    style={{ color: light['text-brand-solid'], letterSpacing: 0.07 }}
    tabIndex={live ? 0 : -1}
    type="button"
  >
    {label}
  </button>
)

// A real button drawn with `ButtonFace`, tracking its own pressed and keyboard-focus states.
const FaceButton = ({
  label,
  hint,
  variant,
  live,
  onPress,
  ring,
}: {
  label: string
  hint: string
  variant: 'primary' | 'secondary'
  live: boolean
  onPress: () => void
  // Rings the button while this holds, to mark it as the control to tap next.
  ring?: (iv: IntroValues) => boolean
}) => {
  const [pressed, setPressed] = useState(false)
  const [focused, setFocused] = useState(false)
  const hintId = useId()
  return (
    <>
      {ring ? <AttentionRing live={ring} radius={GET_STARTED_RADIUS} /> : null}
      <button
        aria-describedby={hintId}
        aria-hidden={!live}
        aria-label={label}
        className="block w-full cursor-pointer outline-none"
        disabled={!live}
        onBlur={() => setFocused(false)}
        onClick={onPress}
        onFocus={(event) => setFocused(event.currentTarget.matches(':focus-visible'))}
        onPointerCancel={() => setPressed(false)}
        onPointerDown={() => setPressed(true)}
        onPointerLeave={() => setPressed(false)}
        onPointerUp={() => setPressed(false)}
        tabIndex={live ? 0 : -1}
        type="button"
      >
        <ButtonFace block focused={focused} label={label} pressedStatic={pressed} size="XXL" variant={variant} />
      </button>
      <span className="hidden" id={hintId}>
        {hint}
      </span>
    </>
  )
}

type NextCtaProps = {
  layout: IntroLayout
  beat: number
  // Whether the scene has rested on the last beat long enough for its actions to take taps.
  restAt3: () => boolean
  linksLive: boolean
  onGetStarted: () => void
  onExistingDevice: () => void
  onRestore: () => void
}

export const NextCta = ({
  layout,
  beat,
  restAt3,
  linksLive,
  onGetStarted,
  onExistingDevice,
  onRestore,
}: NextCtaProps) => {
  const { t } = useTranslation()
  const { clock, iv, ticker, tap } = useIntroScene()
  const { next, start, links, W } = layout
  // In tap mode the controls in the scene lead on, so Next only appears when there is no stage.
  const showNext = !tap || layout.hideStage
  const nextRef = useRef<HTMLDivElement>(null)
  const startRef = useRef<HTMLDivElement>(null)
  const existingRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<HTMLDivElement>(null)
  useFrameStyle(nextRef, () => {
    const k = smooth(remap(iv.q.value, 2.4, NEXT_GONE_Q))
    return { opacity: (1 - k) * clock.textVeil.value, transform: [{ translateY: 14 * k }, { scale: 1 - 0.04 * k }] }
  })
  useFrameStyle(startRef, () => {
    const k = smooth(remap(iv.q.value, 2.6, 2.92))
    return { opacity: k * clock.textVeil.value, transform: [{ translateY: 28 * (1 - k) }, { scale: 0.96 + 0.04 * k }] }
  })
  useFrameStyle(existingRef, () => {
    const k = smooth(remap(iv.q.value, 2.7, 2.97))
    return { opacity: k * clock.textVeil.value, transform: [{ translateY: 12 * (1 - k) }] }
  })
  useFrameStyle(restoreRef, () => {
    const k = smooth(remap(iv.q.value, 2.76, 3))
    return { opacity: k * clock.textVeil.value, transform: [{ translateY: 12 * (1 - k) }] }
  })
  const nextLive = useFrameValue(() => iv.q.value < NEXT_GONE_Q)
  // Which way `p` last moved: Next on the way back from the last beat still works.
  const pDir = useRef(0)
  useLayoutEffect(() => {
    let prev: number | null = null
    return ticker.on(1, () => {
      const now = iv.p.value
      if (prev !== null && Math.abs(now - prev) > 1e-5) pDir.current = now > prev ? 1 : -1
      prev = now
    })
  }, [ticker, iv])
  const atEnd = beat === 3
  const guard = (action: () => void) => () => {
    if (!clock.consumedByPan() && restAt3()) action()
  }

  return (
    <>
      <div
        aria-hidden={!atEnd}
        style={{
          height: links.h,
          left: 0,
          pointerEvents: linksLive ? 'auto' : 'none',
          position: 'absolute',
          top: links.y,
          width: W,
        }}
      >
        <div ref={existingRef}>
          <LinkRow
            label={t('pods.tellipodIntro.intro.existingDevice')}
            live={linksLive}
            onPress={guard(onExistingDevice)}
          />
        </div>
        <div ref={restoreRef}>
          <LinkRow label={t('pods.tellipodIntro.intro.restore')} live={linksLive} onPress={guard(onRestore)} />
        </div>
      </div>
      <div
        ref={startRef}
        style={{
          height: start.h,
          left: start.x,
          pointerEvents: atEnd ? 'auto' : 'none',
          position: 'absolute',
          top: start.y,
          width: start.w,
        }}
      >
        <FaceButton
          hint={t('pods.tellipodIntro.intro.getStartedHint')}
          label={t('pods.tellipodIntro.intro.getStarted')}
          live={atEnd}
          onPress={guard(onGetStarted)}
          ring={tap ? restingAtEnd : undefined}
          variant="primary"
        />
      </div>
      {showNext ? (
        <div
          ref={nextRef}
          style={{
            height: next.h,
            left: next.x,
            pointerEvents: nextLive ? 'auto' : 'none',
            position: 'absolute',
            top: next.y,
            width: next.w,
          }}
        >
          <FaceButton
            hint={t('pods.tellipodIntro.intro.step', { step: beat + 1 })}
            label={t('pods.tellipodIntro.intro.next')}
            live={nextLive}
            onPress={() => {
              if (clock.consumedByPan()) return
              if (iv.q.value < 2.5 || (iv.atRest.value === 0 && pDir.current < 0)) clock.next()
            }}
            variant="secondary"
          />
        </div>
      ) : null}
    </>
  )
}
