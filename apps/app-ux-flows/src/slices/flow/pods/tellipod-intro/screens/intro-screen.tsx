// The four beat screens share this one component, so the scene stays mounted and moves continuously between them;
// the route and the scene follow each other.

import {
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

import { useFlowNavigation, useFlowScreen } from '../../../runtime/flow-context'
import { Background, PagerBar, TextDeck, TopBar } from '../chrome/chrome'
import { NextCta } from '../chrome/next-cta'
import { IntroClock, type StoryState } from '../engine/clock'
import { IntroSceneContext, useFrameStyle, useIntroScene } from '../engine/frame'
import { computeLayout } from '../engine/layout'
import { T1_V2 } from '../engine/living'
import { Ticker } from '../engine/runtime'
import { PAN_ACTIVE_X, PAN_FAIL_Y, T1 } from '../engine/timeline'
import { LivingScene } from '../living/living-scene'
import { BEATS, type BeatId, type IntroMode, type IntroScreenId } from '../model'
import { Overlays } from '../overlays/overlays'
import { WorldSvg } from '../scene/world-svg'

// A tap on the last beat only counts once the scene has rested there this long.
const REST_GATE_MS = 300
// Release velocity is measured over the last part of a drag.
const VELOCITY_WINDOW_MS = 100

const beatIndex = (screen: string) => BEATS.indexOf(screen as BeatId)

const stageLabelKey = (beat: number, story: StoryState, mode: IntroMode) => {
  if (beat === 0) return mode === 'living' ? 'pods.tellipodIntro.living.art.rooms' : 'pods.tellipodIntro.art.rooms'
  if (beat === 1)
    return `pods.tellipodIntro.art.demo.${story === 'confirmed' ? 'added' : story === 'suggested' ? 'suggested' : 'before'}`
  if (beat === 2) return 'pods.tellipodIntro.art.paula'
  return 'pods.tellipodIntro.art.welcome'
}

const usePrefersReducedMotion = () => {
  const query = '(prefers-reduced-motion: reduce)'
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setReduced(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return reduced
}

type Size = { w: number; h: number; top: number; bottom: number }

// The screen area and the device insets the frame draws over it (status bar, home indicator).
const useScreenSize = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<Size | null>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const css = getComputedStyle(el)
      const inset = (name: string) => Number.parseFloat(css.getPropertyValue(name)) || 0
      setSize({
        bottom: inset('--home-indicator-h'),
        h: el.clientHeight,
        top: inset('--status-bar-h'),
        w: el.clientWidth,
      })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return { ref, size }
}

type Drag = {
  id: number
  x0: number
  y0: number
  active: boolean
  failed: boolean
  samples: { t: number; x: number }[]
}

export const IntroSceneScreen = ({ mode }: { mode: IntroMode }) => {
  const { t } = useTranslation()
  const navigation = useFlowNavigation<IntroScreenId>()
  const screenId = useFlowScreen<IntroScreenId>()
  const reducedMotion = usePrefersReducedMotion()
  const { ref, size } = useScreenSize()
  const [measured, setMeasured] = useState<{ max: number; first: number } | undefined>(undefined)
  const layout = useMemo(
    () =>
      size
        ? computeLayout(size.w, size.h, { bottom: size.bottom, top: size.top }, 1, measured?.max, mode, measured?.first)
        : null,
    [size, measured, mode],
  )

  const [beat, setBeat] = useState(0)
  const [story, setStory] = useState<StoryState>('pre')
  const [linksLive, setLinksLive] = useState(false)
  const settledAt3 = useRef(Number.POSITIVE_INFINITY)
  const linksTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [engine] = useState(() => {
    const ticker = new Ticker()
    const clock = new IntroClock({
      assemblyMs: mode === 'living' ? T1_V2 : undefined,
      onBeat: setBeat,
      onMotion: () => {
        settledAt3.current = Number.POSITIVE_INFINITY
        if (linksTimer.current) clearTimeout(linksTimer.current)
        setLinksLive(false)
      },
      onSettled: (b) => {
        if (linksTimer.current) clearTimeout(linksTimer.current)
        if (b !== 3) return
        settledAt3.current = Date.now()
        linksTimer.current = setTimeout(() => setLinksLive(true), REST_GATE_MS)
      },
      onStoryState: setStory,
      reducedMotion,
      stage: computeLayout(393, 852, { bottom: 0, top: 0 }, 1, undefined, mode).stage,
      tapLoop: mode === 'tap',
      ticker,
      width: 393,
    })
    return { clock, ticker }
  })
  const { clock, ticker } = engine

  useEffect(() => {
    ticker.resume()
    return () => {
      if (linksTimer.current) clearTimeout(linksTimer.current)
      ticker.pause()
    }
  }, [ticker])

  useLayoutEffect(() => {
    if (layout) clock.setStage(layout.stage, layout.W)
  }, [clock, layout])

  useEffect(() => clock.setReducedMotion(reducedMotion), [clock, reducedMotion])

  // Scene → route: the URL and the briefing follow the beat the scene is on.
  const pushed = useRef<IntroScreenId>(screenId)
  useEffect(() => {
    const target = BEATS[beat]
    if (!target || target === pushed.current) return
    pushed.current = target
    navigation.goToScreen(target)
  }, [beat, navigation])

  // Route → scene: browser navigation or a direct link moves the scene.
  useEffect(() => {
    const index = beatIndex(screenId)
    if (index < 0 || screenId === pushed.current) return
    pushed.current = screenId
    clock.goTo(index)
  }, [screenId, clock])

  const restAt3 = useCallback(
    () =>
      clock.iv.atRest.value === 1 &&
      Math.abs(clock.iv.p.value - 3) < 0.01 &&
      clock.iv.q.value >= 2.95 &&
      Date.now() - settledAt3.current >= REST_GATE_MS,
    [clock],
  )

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return
      if (event.key === 'ArrowRight') clock.next()
      else if (event.key === 'ArrowLeft') clock.back()
      else return
      event.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [clock])

  const drag = useRef<Drag | null>(null)
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    drag.current = {
      active: false,
      failed: false,
      id: event.pointerId,
      samples: [{ t: event.timeStamp, x: event.clientX }],
      x0: event.clientX,
      y0: event.clientY,
    }
  }
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || d.id !== event.pointerId || d.failed) return
    const dx = event.clientX - d.x0
    const dy = event.clientY - d.y0
    d.samples.push({ t: event.timeStamp, x: event.clientX })
    while (d.samples.length > 2 && event.timeStamp - (d.samples[0]?.t ?? 0) > VELOCITY_WINDOW_MS) d.samples.shift()
    if (!d.active) {
      if (Math.abs(dy) > PAN_FAIL_Y) {
        d.failed = true
        return
      }
      if (Math.abs(dx) < PAN_ACTIVE_X) return
      d.active = true
      event.currentTarget.setPointerCapture(event.pointerId)
      clock.dragBegin(dx)
    }
    clock.dragMove(dx)
  }
  const endDrag = (event: ReactPointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const d = drag.current
    drag.current = null
    if (!d || d.id !== event.pointerId || !d.active) return
    if (cancelled) {
      clock.dragCancel()
      return
    }
    const first = d.samples[0]
    const dt = first ? (event.timeStamp - first.t) / 1000 : 0
    const vx = first && dt > 0 ? (event.clientX - first.x) / dt : 0
    clock.dragEnd(event.clientX - d.x0, vx)
  }

  const scene = useMemo(
    () =>
      layout
        ? {
            assemblyMs: mode === 'living' ? T1_V2 : T1,
            clock,
            iv: clock.iv,
            living: mode === 'living',
            reducedMotion,
            stage: layout.stage,
            tap: mode === 'tap',
            ticker,
          }
        : null,
    [clock, ticker, layout, mode, reducedMotion],
  )

  const stageRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="relative isolate -mt-(--status-bar-h) -mb-(--home-indicator-h) h-[calc(100%+var(--status-bar-h)+var(--home-indicator-h))] touch-pan-y select-none overflow-hidden bg-white"
      onPointerCancel={(event) => endDrag(event, true)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={(event) => endDrag(event, false)}
      ref={ref}
    >
      {scene && layout && (
        <IntroSceneContext.Provider value={scene}>
          <Background h={layout.H} w={layout.W} />
          <TopBar layout={layout} />
          <PagerBar beat={beat} layout={layout} />
          <TextDeck
            beat={beat}
            layout={layout}
            onMeasure={(max, first) => setMeasured((m) => (m?.max === max && m.first === first ? m : { first, max }))}
          />
          {!layout.hideStage && <SceneStage label={t(stageLabelKey(beat, story, mode))} stageRef={stageRef} />}
          <NextCta
            beat={beat}
            layout={layout}
            linksLive={linksLive}
            onExistingDevice={() => navigation.goToScreen('existing-device')}
            onGetStarted={() => navigation.goToScreen('telli-handoff')}
            onRestore={() => navigation.goToScreen('restore')}
            restAt3={restAt3}
          />
        </IntroSceneContext.Provider>
      )}
    </div>
  )
}

const SceneStage = ({ label, stageRef }: { label: string; stageRef: RefObject<HTMLDivElement | null> }) => {
  const { clock, living, stage } = useIntroScene()
  useFrameStyle(stageRef, (iv) => ({ opacity: iv.veil.value }))
  return (
    <div
      ref={stageRef}
      style={{ height: stage.h, left: stage.x, overflow: 'hidden', position: 'absolute', top: stage.y, width: stage.w }}
    >
      <div aria-label={label} className="pointer-events-none absolute inset-0" role="img" />
      {living ? (
        <LivingScene actions={{ addAll: clock.addAll, inviteTelli: clock.inviteTelli }} />
      ) : (
        <>
          <WorldSvg />
          <Overlays actions={{ addAll: clock.addAll, inviteTelli: clock.inviteTelli, next: clock.next }} />
        </>
      )}
    </div>
  )
}
