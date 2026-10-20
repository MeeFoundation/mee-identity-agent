import { eio, eo, iso, ph, remap } from '../engine/math'
import { T3 } from '../engine/timeline'
import { CAT_PATHS } from './cat-paths'
import { CAT_CURL_ANCHOR, CAT_SIT_ANCHOR } from './geometry'
import { AnimatedG, FadeG, StaticPaths, svgTransform } from './svg-parts'

const SIT = iso(CAT_SIT_ANCHOR[0], CAT_SIT_ANCHOR[1], CAT_SIT_ANCHOR[2])
const CURL = iso(CAT_CURL_ANCHOR[0], CAT_CURL_ANCHOR[1], CAT_CURL_ANCHOR[2])
const PIVOT = [1, -11.5] as const
const TO_BED = [CURL[0] - SIT[0], CURL[1] - SIT[1]] as const
const LEAN = 0.3
const SETTLE = 1.5

// Details only show once the camera is close enough to see them.
const lod = (z: number) => remap(z, 1.4, 1.8)

// Ginger sits and follows Telli with her head, then curls up on her bed during beat 3.
export const Cat = () => (
  <>
    <AnimatedG
      attrs={(iv) => {
        const t = ph(iv.v3.value * T3, 2050, 2180)
        const k = LEAN * eio(t)
        return { opacity: 1 - t, transform: svgTransform([1, 0, 0, 1, TO_BED[0] * k, TO_BED[1] * k]) }
      }}
    >
      <StaticPaths paths={CAT_PATHS.sitBody} />
      <AnimatedG
        attrs={(iv) => {
          const g = iv.gaze.value
          const a = (8 * g * Math.PI) / 180
          const c = Math.cos(a)
          const s = Math.sin(a)
          const px = SIT[0] + PIVOT[0]
          const py = SIT[1] + PIVOT[1]
          return { transform: svgTransform([c, s, -s, c, px - c * px + s * py + 0.8 * g, py - s * px - c * py]) }
        }}
      >
        <StaticPaths paths={CAT_PATHS.sitHead} />
        <AnimatedG
          attrs={(iv) => ({
            opacity: lod(iv.cam.value.z),
            transform: svgTransform([1, 0, 0, 1, 0.6 * iv.gaze.value, 0]),
          })}
        >
          <StaticPaths paths={CAT_PATHS.sitDetail} />
        </AnimatedG>
      </AnimatedG>
    </AnimatedG>
    <AnimatedG
      attrs={(iv) => {
        const t = ph(iv.v3.value * T3, 2180, 2350)
        return { opacity: t, transform: svgTransform([1, 0, 0, 1, 0, -SETTLE * (1 - eo(t))]) }
      }}
    >
      <StaticPaths paths={CAT_PATHS.curl} />
      <FadeG opacity={(iv) => lod(iv.cam.value.z)}>
        <StaticPaths paths={CAT_PATHS.curlDetail} />
      </FadeG>
    </AnimatedG>
  </>
)
