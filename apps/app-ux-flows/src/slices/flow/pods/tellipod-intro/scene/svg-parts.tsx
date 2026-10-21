import { memo, type ReactNode, useRef } from 'react'

import { useFrameAttrs } from '../engine/frame'
import type { IntroValues } from '../engine/values'
import type { StaticPath } from './static-scene'

export type Matrix = readonly [number, number, number, number, number, number]

export const svgTransform = (m: Matrix) => `matrix(${m.join(' ')})`

export const StaticPaths = memo(function StaticPaths({ paths }: { paths: readonly StaticPath[] }) {
  return (
    <>
      {paths.map((path, i) => (
        <path
          d={path.d}
          fill={path.fill ?? 'none'}
          fillOpacity={path.fillOpacity}
          key={`${path.key}-${i}`}
          stroke={path.stroke}
          strokeDasharray={path.strokeDasharray?.join(' ')}
          strokeLinecap={path.strokeLinecap}
          strokeLinejoin={path.strokeLinejoin}
          strokeOpacity={path.strokeOpacity}
          strokeWidth={path.strokeWidth}
          vectorEffect={path.hair ? 'non-scaling-stroke' : undefined}
        />
      ))}
    </>
  )
})

// A group whose opacity follows the scene every frame.
export const FadeG = ({ opacity, children }: { opacity: (iv: IntroValues) => number; children: ReactNode }) => {
  const ref = useRef<SVGGElement>(null)
  useFrameAttrs(ref, (iv) => ({ opacity: opacity(iv) }))
  return <g ref={ref}>{children}</g>
}

// A group whose attributes (transform, opacity) follow the scene every frame.
export const AnimatedG = ({
  attrs,
  children,
}: {
  attrs: (iv: IntroValues) => Record<string, string | number>
  children: ReactNode
}) => {
  const ref = useRef<SVGGElement>(null)
  useFrameAttrs(ref, attrs)
  return <g ref={ref}>{children}</g>
}
