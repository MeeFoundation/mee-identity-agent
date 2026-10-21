import { createContext, type RefObject, useContext, useLayoutEffect, useRef, useState } from 'react'

import type { IntroClock } from './clock'
import type { Ticker } from './runtime'
import type { IntroValues, Stage } from './values'

type IntroScene = {
  clock: IntroClock
  ticker: Ticker
  iv: IntroValues
  stage: Stage
  reducedMotion: boolean
  // Whether the intro runs in tap mode (the artifact's v1.2), with controls in the scene instead of Next.
  tap: boolean
  // Whether the intro draws the flat living-pod scene (the artifact's v2) instead of the isometric world.
  living: boolean
  // How long beat 1's opening takes, which the first beat's copy fades in over.
  assemblyMs: number
}

export const IntroSceneContext = createContext<IntroScene | null>(null)

export const useIntroScene = () => {
  const scene = useContext(IntroSceneContext)
  if (!scene) throw new Error('useIntroScene must be used inside the intro scene')
  return scene
}

// A transform step as React Native writes it, e.g. `{ translateX: 4 }` or `{ rotate: '90deg' }`.
export type TransformStep = Partial<
  Record<'translateX' | 'translateY' | 'scale' | 'scaleX' | 'scaleY' | 'rotate' | 'skewX' | 'skewY', number | string>
>

// The style keys the ported animations write; numbers are pixels where CSS needs a unit.
export type FrameStyle = {
  opacity?: number
  transform?: readonly TransformStep[]
  width?: number
  height?: number
  left?: number
  top?: number
  right?: number
  bottom?: number
  display?: 'flex' | 'none'
  backgroundColor?: string
  borderColor?: string
  color?: string
  borderRadius?: number
  transformOrigin?: string
}

const px = (v: number | string) => (typeof v === 'number' ? `${v}px` : v)
const deg = (v: number | string) => (typeof v === 'number' ? `${v}deg` : v)

const toCssTransform = (steps: readonly TransformStep[]) =>
  steps
    .map((step) => {
      const [key, value] = Object.entries(step)[0] ?? []
      if (key === undefined || value === undefined) return ''
      if (key === 'translateX' || key === 'translateY') return `${key}(${px(value)})`
      if (key === 'rotate' || key === 'skewX' || key === 'skewY') return `${key}(${deg(value)})`
      return `${key}(${value})`
    })
    .join(' ')

const PX_KEYS = new Set(['width', 'height', 'left', 'top', 'right', 'bottom', 'borderRadius'])

const toCss = (style: FrameStyle): Record<string, string> => {
  const css: Record<string, string> = {}
  for (const [key, value] of Object.entries(style)) {
    if (value === undefined) continue
    if (key === 'transform') css.transform = toCssTransform(value as readonly TransformStep[])
    else if (PX_KEYS.has(key)) css[key] = `${value}px`
    else css[key] = String(value)
  }
  return css
}

const cssName = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

// Writes a style computed from the scene's values to an element every frame, like Reanimated's `useAnimatedStyle`.
export const useFrameStyle = <E extends HTMLElement | SVGElement>(
  ref: RefObject<E | null>,
  compute: (iv: IntroValues) => FrameStyle,
) => {
  const { ticker, iv } = useIntroScene()
  const computeRef = useRef(compute)
  computeRef.current = compute
  useLayoutEffect(() => {
    const last: Record<string, string> = {}
    const apply = () => {
      const el = ref.current
      if (!el) return
      const css = toCss(computeRef.current(iv))
      for (const [key, value] of Object.entries(css)) {
        if (last[key] === value) continue
        last[key] = value
        el.style.setProperty(cssName(key), value)
      }
    }
    apply()
    return ticker.on(2, apply)
  }, [ticker, iv, ref])
}

// Writes attributes computed from the scene's values to an SVG element every frame, like `useAnimatedProps`.
export const useFrameAttrs = <E extends SVGElement>(
  ref: RefObject<E | null>,
  compute: (iv: IntroValues) => Record<string, string | number>,
) => {
  const { ticker, iv } = useIntroScene()
  const computeRef = useRef(compute)
  computeRef.current = compute
  useLayoutEffect(() => {
    const last: Record<string, string> = {}
    const apply = () => {
      const el = ref.current
      if (!el) return
      for (const [key, raw] of Object.entries(computeRef.current(iv))) {
        const value = String(raw)
        if (last[key] === value) continue
        last[key] = value
        el.setAttribute(key, value)
      }
    }
    apply()
    return ticker.on(2, apply)
  }, [ticker, iv, ref])
}

// Re-renders when a value derived from the scene changes, like a reaction that schedules work on the JS thread.
export const useFrameValue = <T extends string | number | boolean>(select: (iv: IntroValues) => T): T => {
  const { ticker, iv } = useIntroScene()
  const selectRef = useRef(select)
  selectRef.current = select
  const [value, setValue] = useState(() => select(iv))
  useLayoutEffect(() => {
    const read = () => setValue(selectRef.current(iv))
    read()
    return ticker.on(2, read)
  }, [ticker, iv])
  return value
}
