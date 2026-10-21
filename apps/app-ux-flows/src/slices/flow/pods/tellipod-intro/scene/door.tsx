import { useRef } from 'react'

import { useFrameAttrs } from '../engine/frame'
import { eio, iso, lerpColor, ph } from '../engine/math'
import { T2 } from '../engine/timeline'
import { C, DOOR } from './geometry'
import { STATIC_SCENE } from './static-scene'
import { FadeG, StaticPaths } from './svg-parts'

const KNOB = iso(DOOR.knob[0], DOOR.knob[1], DOOR.knob[2])
const OPEN_EPS = 0.5

// Door angle in degrees at beat 2's story time `m2`: opens for Telli, closes behind it.
export const doorTheta = (m2: number) =>
  m2 < 1950 ? DOOR.maxDeg * eio(ph(m2, 1150, 1450)) : DOOR.maxDeg * (1 - eio(ph(m2, 1950, 2250)))

export const doorLeaf = (theta: number) => {
  const th = (theta * Math.PI) / 180
  const hu = DOOR.hingeU
  const fu = hu + DOOR.width * Math.cos(th)
  const fv = -62 + DOOR.width * Math.sin(th)
  const a = iso(hu, -61.7, 0)
  const b = iso(fu, fv, 0)
  const c = iso(fu, fv, DOOR.height)
  const d = iso(hu, -61.7, DOOR.height)
  return {
    d: `M${a[0]},${a[1]}L${b[0]},${b[1]}L${c[0]},${c[1]}L${d[0]},${d[1]}Z`,
    fill: lerpColor(C.b700, C.b600, theta / DOOR.maxDeg),
  }
}

export const Door = () => {
  const leaf = useRef<SVGPathElement>(null)
  const knob = useRef<SVGCircleElement>(null)
  const isOpen = (v2: number) => (doorTheta(v2 * T2) > OPEN_EPS ? 1 : 0)
  useFrameAttrs(leaf, (iv) => doorLeaf(doorTheta(iv.v2.value * T2)))
  useFrameAttrs(knob, (iv) => ({ opacity: 1 - isOpen(iv.v2.value) }))
  return (
    <>
      <FadeG opacity={(iv) => isOpen(iv.v2.value)}>
        <StaticPaths paths={STATIC_SCENE.doorway ?? []} />
      </FadeG>
      <path fill={C.b700} ref={leaf} />
      <circle cx={KNOB[0]} cy={KNOB[1]} fill={C.w200} r={1} ref={knob} />
    </>
  )
}
