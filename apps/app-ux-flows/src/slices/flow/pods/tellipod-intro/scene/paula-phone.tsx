import { useFrameValue } from '../engine/frame'
import { ph, remap } from '../engine/math'
import { T3 } from '../engine/timeline'
import { STATIC_SCENE } from './static-scene'
import { AnimatedG, FadeG, StaticPaths, svgTransform } from './svg-parts'

const S3 = 0.8660254

export const paulaOpacity = (q: number) => (q <= 2 ? remap(q, 1.45, 1.6) : 1 - remap(q, 2.15, 2.45))

const PaulaPhone = () => (
  <AnimatedG
    attrs={(iv) => {
      const dv = iv.dv.value
      return { opacity: paulaOpacity(iv.q.value), transform: svgTransform([1, 0, 0, 1, -S3 * dv, 0.5 * dv]) }
    }}
  >
    <StaticPaths paths={STATIC_SCENE.paulaBase ?? []} />
    <FadeG opacity={(iv) => ph(iv.v3.value * T3, 1150, 1400)}>
      <StaticPaths paths={STATIC_SCENE.paulaLit ?? []} />
    </FadeG>
    <StaticPaths paths={STATIC_SCENE.paulaShell ?? []} />
    <FadeG opacity={(iv) => ph(iv.v3.value * T3, 1200, 1450)}>
      <StaticPaths paths={STATIC_SCENE.paulaDesk ?? []} />
    </FadeG>
    <StaticPaths paths={STATIC_SCENE.paulaCurbs ?? []} />
  </AnimatedG>
)

// Paula's phone is only mounted while it can be seen.
export const PaulaHome = () => {
  const visible = useFrameValue((iv) => paulaOpacity(iv.q.value) > 0)
  return visible ? <PaulaPhone /> : null
}
