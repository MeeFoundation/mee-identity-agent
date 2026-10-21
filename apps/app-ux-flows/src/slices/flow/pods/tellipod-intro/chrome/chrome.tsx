// Ports of the prototype's intro chrome: Background (1075), TopBar (1084), PagerBar (1086/1087), TextDeck (1089).

import { useId, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import logo from '../art/logo.svg'
import { useFrameStyle, useFrameValue, useIntroScene } from '../engine/frame'
import type { IntroLayout } from '../engine/layout'
import { interp, lerpColor, remap, smooth } from '../engine/math'
import { withTiming } from '../engine/runtime'
import { RM_PAGER_MS, RM_TEXT_MS } from '../engine/timeline'
import type { Box } from '../engine/values'
import { Icon } from '../overlays/ui'
import { light, palette } from '../scene/palette'

const BACK_LIVE_Q = 0.02
const SKIP_LIVE_Q = 2.5
const LOGO_FADE_MS = 200

// `q`, eased towards its new value under reduced motion so the copy cross-fades instead of jumping.
const useSoftQ = (ms: number): Box<number> => {
  const { ticker, iv, reducedMotion } = useIntroScene()
  const [soft] = useState(() => ticker.sv(iv.q.value))
  useLayoutEffect(() => {
    let prev: number | null = null
    return ticker.on(1, () => {
      const now = iv.q.value
      if (now === prev) return
      soft.value = reducedMotion && prev !== null ? withTiming(now, { duration: ms }) : now
      prev = now
    })
  }, [ticker, iv, reducedMotion, soft, ms])
  return soft
}

const WARM_Q = [0, 0.8, 1.2, 1.8, 3]
const WARM_A = [0.15, 0.25, 0.25, 0.15, 0.15]
const TEAL_A = [0.15, 0.1, 0.1, 0.15, 0.15]
const GLOW_STOPS = [
  { a: 0.5, o: 0 },
  { a: 0.25, o: 0.55 },
  { a: 0, o: 1 },
]

const Glow = ({
  color,
  cx,
  cy,
  rx,
  ry,
  w,
  h,
}: {
  color: string
  cx: number
  cy: number
  rx: number
  ry: number
  w: number
  h: number
}) => {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  return (
    <svg aria-hidden="true" height={h} style={{ inset: 0, position: 'absolute' }} width={w}>
      <defs>
        <radialGradient
          cx={0}
          cy={0}
          fx={0}
          fy={0}
          gradientTransform={`matrix(${rx} 0 0 ${ry} ${cx} ${cy})`}
          gradientUnits="userSpaceOnUse"
          id={id}
          r={1}
        >
          {GLOW_STOPS.map((stop) => (
            <stop key={stop.o} offset={stop.o} stopColor={color} stopOpacity={stop.a} />
          ))}
        </radialGradient>
      </defs>
      <rect fill={`url(#${id})`} height={h} width={w} x={0} y={0} />
    </svg>
  )
}

// A warm glow at the top and a teal one at the bottom, shifting as the intro moves.
export const Background = ({ w, h }: { w: number; h: number }) => {
  const warm = useRef<HTMLDivElement>(null)
  const teal = useRef<HTMLDivElement>(null)
  useFrameStyle(warm, (iv) => ({ opacity: interp(iv.q.value, WARM_Q, WARM_A) }))
  useFrameStyle(teal, (iv) => ({ opacity: interp(iv.q.value, WARM_Q, TEAL_A) }))
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundColor: palette.white }}>
      <div className="absolute inset-0" ref={warm}>
        <Glow color={palette['warning-200']} cx={0.896 * w} cy={120} h={h} rx={330} ry={520} w={w} />
      </div>
      <div className="absolute inset-0" ref={teal}>
        <Glow color={palette['brand-500']} cx={0.945 * w} cy={h - 114} h={h} rx={380} ry={460} w={w} />
      </div>
    </div>
  )
}

// Whether a control is live follows `q`, so it changes as soon as the scene moves past it.
const useQFlag = (test: (q: number) => boolean) => useFrameValue((iv) => test(iv.q.value))

export const TopBar = ({ layout }: { layout: IntroLayout }) => {
  const { t } = useTranslation()
  const { clock, ticker } = useIntroScene()
  const { W, chrome } = layout
  const back = useRef<HTMLDivElement>(null)
  const skip = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  // The logo fades in once when the intro opens.
  const [logoT] = useState(() => ticker.sv(0))
  useLayoutEffect(() => {
    logoT.value = withTiming(1, { duration: LOGO_FADE_MS })
  }, [logoT])
  useFrameStyle(back, (iv) => ({
    opacity: (iv.q.value > BACK_LIVE_Q ? remap(iv.q.value, BACK_LIVE_Q, 0.4) : 0) * clock.textVeil.value,
  }))
  useFrameStyle(skip, (iv) => ({ opacity: (1 - remap(iv.q.value, 2.4, 2.8)) * clock.textVeil.value }))
  useFrameStyle(logoRef, () => ({ opacity: logoT.value }))
  const backLive = useQFlag((q) => q > BACK_LIVE_Q)
  const skipLive = useQFlag((q) => q <= SKIP_LIVE_Q)
  const hintId = useId()

  return (
    <>
      <div
        aria-hidden={!backLive}
        ref={back}
        style={{ left: 12, pointerEvents: backLive ? 'auto' : 'none', position: 'absolute', top: chrome.y }}
      >
        <button
          aria-label={t('pods.tellipodIntro.intro.back')}
          className="flex size-11 cursor-pointer items-center justify-center rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring"
          disabled={!backLive}
          onClick={() => {
            if (!clock.consumedByPan()) clock.back()
          }}
          tabIndex={backLive ? 0 : -1}
          type="button"
        >
          <Icon color={light['text-default-body']} name="chevron-left" size={24} />
        </button>
      </div>
      <div
        ref={logoRef}
        style={{ height: 28, left: W / 2 - 14, position: 'absolute', top: chrome.y + 22 - 14, width: 28 }}
      >
        <img alt={t('pods.tellipodIntro.intro.logo')} height={28} src={logo} width={28} />
      </div>
      <div
        aria-hidden={!skipLive}
        ref={skip}
        style={{
          height: 44,
          pointerEvents: skipLive ? 'auto' : 'none',
          position: 'absolute',
          right: 8,
          top: chrome.y + (chrome.h - 44) / 2,
        }}
      >
        <button
          aria-describedby={hintId}
          aria-label={t('pods.tellipodIntro.intro.skipLabel')}
          className="flex h-11 min-w-14 cursor-pointer items-center justify-end rounded-xl pr-2 pl-3 font-semibold text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring"
          disabled={!skipLive}
          onClick={() => {
            if (!clock.consumedByPan()) clock.skip()
          }}
          style={{ color: light['text-gray-solid'], letterSpacing: 0.07 }}
          tabIndex={skipLive ? 0 : -1}
          type="button"
        >
          {t('pods.tellipodIntro.intro.skip')}
        </button>
        <span className="sr-only" id={hintId}>
          {t('pods.tellipodIntro.intro.skipHint')}
        </span>
      </div>
    </>
  )
}

const DOT = 6
const GROW = 26

const PagerDot = ({ index, progress }: { index: number; progress: Box<number> }) => {
  const ref = useRef<HTMLSpanElement>(null)
  useFrameStyle(ref, () => {
    const d = Math.abs(progress.value - index)
    return {
      backgroundColor: lerpColor(palette['brand-500'], palette['gray-300'], Math.min(d, 1)),
      width: DOT + GROW * Math.max(0, 1 - d),
    }
  })
  return <span className="block rounded-full" ref={ref} style={{ height: DOT }} />
}

export const PagerBar = ({ layout, beat }: { layout: IntroLayout; beat: number }) => {
  const { t } = useTranslation()
  const { clock } = useIntroScene()
  const soft = useSoftQ(RM_PAGER_MS)
  const ref = useRef<HTMLDivElement>(null)
  useFrameStyle(ref, () => {
    const k = smooth(remap(soft.value, 2.35, 2.6))
    return { opacity: (1 - k) * clock.textVeil.value, transform: [{ translateY: 6 * k }, { scale: 1 - 0.2 * k }] }
  })
  const label = t('pods.tellipodIntro.intro.step', { step: beat + 1 })
  return (
    <div
      aria-hidden={beat === 3}
      className="pointer-events-none flex justify-center"
      ref={ref}
      style={{ height: 6, left: 0, position: 'absolute', top: layout.pager.y, width: layout.W }}
    >
      <div
        aria-label={label}
        aria-valuemax={4}
        aria-valuemin={1}
        aria-valuenow={beat + 1}
        className="flex items-center gap-1"
        role="progressbar"
      >
        {[0, 1, 2, 3].map((i) => (
          <PagerDot index={i} key={i} progress={soft} />
        ))}
      </div>
    </div>
  )
}

const BEAT_KEYS = ['rooms', 'gingerPod', 'paula', 'welcome'] as const
const SUBLINE_BREAK_MIN_W = 280

const TextCard = ({
  i,
  soft,
  layout,
  beat,
  onHeight,
}: {
  i: number
  soft: Box<number>
  layout: IntroLayout
  beat: number
  onHeight: (i: number, h: number) => void
}) => {
  const { t } = useTranslation()
  const { assemblyMs, clock, living, reducedMotion } = useIntroScene()
  const ref = useRef<HTMLDivElement>(null)
  useFrameStyle(ref, (iv) => {
    const q = soft.value
    const op = reducedMotion
      ? Math.max(0, 1 - Math.abs(q - i))
      : interp(q, [i - 0.5, i - 0.15, i + 0.15, i + 0.5], [0, 1, 1, 0])
    const x = reducedMotion ? 0 : interp(q, [i - 0.5, i, i + 0.5], [24, 0, -24])
    const assembly = i === 0 ? remap(iv.a1.value * assemblyMs, 300, 600) : 1
    return { opacity: op * assembly * clock.textVeil.value, transform: [{ translateX: x }] }
  })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(() => onHeight(i, el.offsetHeight))
    observer.observe(el)
    return () => observer.disconnect()
  }, [i, onHeight])
  const key = (path: string) =>
    i === 0 && living
      ? `pods.tellipodIntro.living.beats.rooms.${path}`
      : `pods.tellipodIntro.beats.${BEAT_KEYS[i]}.${path}`
  const subline = t(key('subline'))
  const compact = layout.compact
  return (
    <div
      aria-hidden={beat !== i}
      className="pointer-events-none text-center"
      ref={ref}
      style={{
        left: layout.textCol.x,
        position: 'absolute',
        top: i === 3 ? layout.text4.y - layout.text.y : 0,
        width: layout.textCol.w,
      }}
    >
      <h1
        className={compact ? 'font-semibold text-2xl' : 'font-semibold text-3xl'}
        style={{ color: light['text-default-title'], letterSpacing: 0.005 * layout.type.h, whiteSpace: 'pre-line' }}
      >
        {t(key('headline.lead'))}
        <span style={{ color: palette['brand-500'] }}>{t(key('headline.accent'))}</span>
        {t(key('headline.tail'))}
      </h1>
      <p
        className={compact ? 'mt-2 text-base' : 'mt-2 text-lg'}
        style={{ color: light['text-default-subtle'], letterSpacing: 0.005 * layout.type.s, whiteSpace: 'pre-line' }}
      >
        {layout.textCol.w < SUBLINE_BREAK_MIN_W ? subline.replace(/\n/g, ' ') : subline}
      </p>
    </div>
  )
}

// All four beats' copy, stacked; each slides and fades with `q`.
export const TextDeck = ({
  layout,
  beat,
  onMeasure,
}: {
  layout: IntroLayout
  beat: number
  // The tallest beat's copy height and the first beat's.
  onMeasure: (maxH: number, firstH: number) => void
}) => {
  const soft = useSoftQ(RM_TEXT_MS)
  const heights = useRef([0, 0, 0, 0])
  const onHeight = useRef((i: number, h: number) => {
    heights.current[i] = h
    if (heights.current.every((x) => x > 0))
      onMeasure(Math.ceil(Math.max(...heights.current)), Math.ceil(heights.current[0] ?? 0))
  }).current
  return (
    <div
      className="pointer-events-none"
      style={{ height: layout.text.h, left: 0, position: 'absolute', top: layout.text.y, width: layout.W }}
    >
      {[0, 1, 2, 3].map((i) => (
        <TextCard beat={beat} i={i} key={i} layout={layout} onHeight={onHeight} soft={soft} />
      ))}
    </div>
  )
}
