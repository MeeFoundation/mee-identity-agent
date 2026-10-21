import { memo, useId, useRef } from 'react'

import { cameraMatrix, keyLerp } from '../engine/camera'
import { useFrameAttrs, useIntroScene } from '../engine/frame'
import { ph } from '../engine/math'
import { T1, T2, T3 } from '../engine/timeline'
import type { IntroValues, Stage } from '../engine/values'
import { Cat } from './cat'
import { BOWL_INNER_D } from './cat-paths'
import { Door } from './door'
import { ASM, C, HALO_PEAK } from './geometry'
import { ConnectionLine } from './paula-line'
import { PaulaHome } from './paula-phone'
import { STATIC_SCENE } from './static-scene'
import { AnimatedG, FadeG, StaticPaths, svgTransform } from './svg-parts'

// Height of the soft fade at the stage's top and bottom edges.
const STAGE_FEATHER = 14

const SMOOTH_STOPS = Array.from({ length: 9 }, (_, i) => {
  const o = i / 8
  return [o, o * o * (3 - 2 * o)] as const
})

// The top feather follows the camera keys when a stage asks for different ones per beat.
const KeyedFeather = ({ id, stage }: { id: string; stage: Stage }) => {
  const [f0, f1, f2, f3] = stage.featherTop
  const sh = stage.h
  const fb = Math.min(STAGE_FEATHER, 0.45 * sh)
  const top = (iv: IntroValues) => keyLerp(iv.q.value, [f0, f1, f2, f3])
  const fadeRef = useRef<SVGRectElement>(null)
  const solidRef = useRef<SVGRectElement>(null)
  useFrameAttrs(fadeRef, (iv) => ({ height: top(iv) }))
  useFrameAttrs(solidRef, (iv) => ({ height: Math.max(0, sh - fb - top(iv) + 2), y: top(iv) - 1 }))
  return (
    <>
      <linearGradient id={`${id}t`} x1="0%" x2="0%" y1="0%" y2="100%">
        {SMOOTH_STOPS.map(([offset, opacity]) => (
          <stop key={offset} offset={offset} stopColor="#ffffff" stopOpacity={opacity} />
        ))}
      </linearGradient>
      <linearGradient id={`${id}b`} x1="0%" x2="0%" y1="0%" y2="100%">
        <stop offset={0} stopColor="#ffffff" stopOpacity={1} />
        <stop offset={1} stopColor="#ffffff" stopOpacity={0} />
      </linearGradient>
      <mask height={sh} id={id} maskUnits="userSpaceOnUse" width={stage.w} x={0} y={0}>
        <rect fill={`url(#${id}t)`} height={f0} ref={fadeRef} width={stage.w} x={0} y={0} />
        <rect fill="#ffffff" height={sh - fb - f0 + 2} ref={solidRef} width={stage.w} x={0} y={f0 - 1} />
        <rect fill={`url(#${id}b)`} height={fb} width={stage.w} x={0} y={sh - fb} />
      </mask>
    </>
  )
}

const EvenFeather = ({ id, stage }: { id: string; stage: Stage }) => {
  const o = Math.min(0.45, STAGE_FEATHER / Math.max(1, stage.h))
  return (
    <>
      <linearGradient gradientUnits="userSpaceOnUse" id={`${id}g`} x1={0} x2={0} y1={0} y2={stage.h}>
        <stop offset={0} stopColor="#ffffff" stopOpacity={0} />
        <stop offset={o} stopColor="#ffffff" stopOpacity={1} />
        <stop offset={1 - o} stopColor="#ffffff" stopOpacity={1} />
        <stop offset={1} stopColor="#ffffff" stopOpacity={0} />
      </linearGradient>
      <mask height={stage.h} id={id} maskUnits="userSpaceOnUse" width={stage.w} x={0} y={0}>
        <rect fill={`url(#${id}g)`} height={stage.h} width={stage.w} x={0} y={0} />
      </mask>
    </>
  )
}

// Beat 1's assembly time, and each part's fade-in window in it.
const m1 = (iv: IntroValues) => iv.a1.value * T1
const shellOpacity = (iv: IntroValues) => ph(m1(iv), ASM.shell[0], ASM.shell[1])
const kyotoOpacity = (iv: IntroValues) => iv.dim.value * ph(m1(iv), ASM.kyoto[0], ASM.kyoto[1])
const gingerOpacity = (iv: IntroValues) => ph(m1(iv), ASM.ginger[0], ASM.ginger[1])
const sofiaOpacity = (iv: IntroValues) => iv.dim.value * ph(m1(iv), ASM.sofia[0], ASM.sofia[1])
const emptyOpacity = (iv: IntroValues) => iv.dim.value * ph(m1(iv), ASM.empty[0], ASM.empty[1])
const haloOpacity = (iv: IntroValues) => {
  const m = m1(iv)
  const [a, b, c] = ASM.halo
  return m < b ? HALO_PEAK * ph(m, a, b) : HALO_PEAK * (1 - ph(m, b, c))
}
// The mini card on Ginger's desk appears once the suggested info is added.
const miniCardOpacity = (iv: IntroValues) => ph(iv.v2.value * T2, 2150, 2250)

const layer = (name: string) => STATIC_SCENE[name] ?? []

// The isometric world, drawn through the camera, as in the prototype's `WorldSvg`.
export const WorldSvg = memo(function WorldSvg() {
  const { stage } = useIntroScene()
  const id = `worldFeather${useId().replace(/:/g, '')}`
  const keyed = stage.featherTop.some((f) => f !== STAGE_FEATHER)
  const bowlRef = useRef<SVGPathElement>(null)
  useFrameAttrs(bowlRef, (iv) => ({ opacity: ph(iv.v3.value * T3, 2100, 2300) }))

  return (
    <svg
      aria-hidden="true"
      height={stage.h}
      style={{ left: 0, pointerEvents: 'none', position: 'absolute', top: 0 }}
      width={stage.w}
    >
      <defs>{keyed ? <KeyedFeather id={id} stage={stage} /> : <EvenFeather id={id} stage={stage} />}</defs>
      <g mask={`url(#${id})`}>
        <AnimatedG attrs={(iv) => ({ transform: svgTransform(cameraMatrix(iv.cam.value, stage.w, stage.h)) })}>
          <FadeG opacity={shellOpacity}>
            <StaticPaths paths={layer('phone')} />
          </FadeG>
          <FadeG opacity={kyotoOpacity}>
            <StaticPaths paths={layer('kyotoFloor')} />
          </FadeG>
          <FadeG opacity={gingerOpacity}>
            <StaticPaths paths={layer('gingerFloor')} />
          </FadeG>
          <FadeG opacity={sofiaOpacity}>
            <StaticPaths paths={layer('sofia')} />
          </FadeG>
          <FadeG opacity={emptyOpacity}>
            <StaticPaths paths={layer('empty')} />
          </FadeG>
          <FadeG opacity={haloOpacity}>
            <StaticPaths paths={layer('halo')} />
          </FadeG>
          <FadeG opacity={shellOpacity}>
            <StaticPaths paths={layer('shell')} />
            <Door />
          </FadeG>
          <FadeG opacity={kyotoOpacity}>
            <StaticPaths paths={layer('kyoto')} />
          </FadeG>
          <FadeG opacity={gingerOpacity}>
            <StaticPaths paths={layer('gingerProps')} />
            <FadeG opacity={miniCardOpacity}>
              <StaticPaths paths={layer('miniCard')} />
            </FadeG>
            <path d={BOWL_INNER_D} fill={C.w600} ref={bowlRef} />
            <Cat />
          </FadeG>
          <FadeG opacity={shellOpacity}>
            <StaticPaths paths={layer('curbs')} />
          </FadeG>
          <PaulaHome />
          <ConnectionLine />
        </AnimatedG>
      </g>
    </svg>
  )
})
