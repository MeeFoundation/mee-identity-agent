import { useRef } from 'react'

import { useFrameAttrs, useIntroScene } from '../engine/frame'
import { bezierQ, eio, iso, type Point, ph, remap, splitQ } from '../engine/math'
import { T3 } from '../engine/timeline'
import { C, LINE } from './geometry'

const P0 = iso(LINE.p0[0], LINE.p0[1], LINE.p0[2])

// The connection from Ginger's door to Ginger's room on Paula's phone, which hangs `dv` below.
const lineCurve = (dv: number): readonly [Point, Point, Point] => {
  const p2 = iso(LINE.p2[0], LINE.p2[1] + dv, LINE.p2[2])
  const c: Point = [(P0[0] + p2[0]) / 2 + LINE.ctrlDx, Math.min(P0[1], p2[1]) + LINE.ctrlDy]
  return [P0, c, p2]
}

// How much of the line is drawn, at beat position `q` and beat 3's story time `m3`.
export const lineT = (q: number, m3: number) => {
  if (q < 1.5) return 0
  return m3 >= 1100 ? 1 : eio(ph(m3, 200, 1100))
}

const r2 = (n: number) => Math.round(n * 100) / 100

export const lineD = (dv: number, t: number) => {
  const [a, b, c] = lineCurve(dv)
  const s = splitQ(a, b, c, Math.max(t, 0.0001))
  return `M${r2(s[0][0])},${r2(s[0][1])}Q${r2(s[1][0])},${r2(s[1][1])} ${r2(s[2][0])},${r2(s[2][1])}`
}

export const ConnectionLine = () => {
  const { tap } = useIntroScene()
  const line = useRef<SVGPathElement>(null)
  const pulse = useRef<SVGCircleElement>(null)
  useFrameAttrs(line, (iv) => {
    const t = lineT(iv.q.value, iv.v3.value * T3)
    // In tap mode the line fades away as the camera returns home.
    const fade = tap ? 1 - remap(iv.q.value, 2, 2.4) : 1
    return { d: lineD(iv.dv.value, t), opacity: t > 0.0005 ? fade : 0 }
  })
  useFrameAttrs(pulse, (iv) => {
    const ms = iv.v3.value * T3
    const [a, b, c] = lineCurve(iv.dv.value)
    const p = bezierQ(a, b, c, 1 - eio(ph(ms, 1650, 1950)))
    return { cx: p[0], cy: p[1], opacity: ms > 1650 && ms < 1950 && iv.q.value >= 1.5 ? 1 : 0 }
  })
  return (
    <>
      <path
        fill="none"
        ref={line}
        stroke={C.b500}
        strokeDasharray={LINE.dash.join(' ')}
        strokeLinecap="round"
        strokeWidth={LINE.width}
      />
      <circle fill={C.b500} r={LINE.pulseR} ref={pulse} />
    </>
  )
}
