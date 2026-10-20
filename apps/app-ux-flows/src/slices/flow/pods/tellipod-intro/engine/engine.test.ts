import { describe, expect, it } from 'vitest'

import { camera } from './camera'
import { easeCam, legProgress, panTarget, planMove, rubber } from './clock-plan'
import { dvOf, gazeOf, qOf, V2of, V3of } from './drivers'

// Values computed by running the prototype's own camera, drivers and clock-plan modules on the same inputs.
const GOLDEN = {
  camera: [
    { x: 201, y: 180, z: 1.045213 },
    { x: 218.243459, y: 180, z: 1.533026 },
    { x: 230, y: 180, z: 2.248507 },
    { x: 268.428101, y: 135.659884, z: 1.125057 },
    { x: 295, y: 105, z: 0.83617 },
    { x: 254.866749, y: 144.721623, z: 0.914237 },
    { x: 201, y: 199.13486, z: 1.045213 },
  ],
  dv: [-440, -256.25, -230, -335, -440],
  easeCam: [0.187651, 0.762251, 0.958638],
  gaze: [0.3, -0.6, 0.1],
  legProgress: [
    [0.062827, 0.5, 0.871789],
    [0.020153, 0.762251, 0.994321],
  ],
  panTarget: [2, 1, 0, 3],
  planBack: [
    { kind: 0, ms: 800, p0: 2, p1: 1.42, se: 1.42, warp: [] },
    { kind: 1, ms: 800, p0: 1.42, p1: 1, se: 1.42, warp: [] },
  ],
  planFwd: [{ kind: 0, ms: 800, p0: 0, p1: 1, se: 1.42, warp: [] }],
  planNoStory: [{ kind: 0, ms: 800, p0: 1, p1: 2, se: 1, warp: [] }],
  planOverStory: [
    {
      kind: 1,
      ms: 1256.470588,
      p0: 1,
      p1: 1.42,
      se: 1.42,
      warp: [0, 0, 0.026217, 0.033613, 0.185393, 0.096639, 0.726124, 0.789916, 0.8853, 0.852941, 1, 1],
    },
    { kind: 0, ms: 800, p0: 1.42, p1: 2, se: 1.42, warp: [] },
  ],
  qOf: [0.5, 1, 1.5, 2.5],
  rubber: [-0.15, 1.5, 3.1],
  V2of: [0.3, 0.633333, 1],
  V3of: [0, 1, 0.571429],
}

type Numeric = number | readonly Numeric[] | { readonly [key: string]: Numeric }

// Compares to six decimals, as the golden values were rounded.
const close = (actual: unknown, expected: unknown): void => {
  if (typeof expected === 'number') {
    expect(actual as number).toBeCloseTo(expected, 5)
    return
  }
  if (Array.isArray(expected)) {
    expect((actual as unknown[]).length).toBe(expected.length)
    for (const [i, value] of expected.entries()) close((actual as unknown[])[i], value)
    return
  }
  for (const [key, value] of Object.entries(expected as Record<string, Numeric>)) {
    close((actual as Record<string, unknown>)[key], value)
  }
}

describe('SC-ONB-001 engine matches the prototype', () => {
  it('frames each beat and moves the camera between them', () => {
    close(
      [0, 0.5, 1, 1.7, 2, 2.4, 3].map((q) => camera(q, 393, 460, [0, 0, 0, 40], [0, 0, 0, 0])),
      GOLDEN.camera,
    )
  })

  it('derives the story drivers', () => {
    close(
      (
        [
          [0.5, 1.6],
          [1.3, 1.6],
          [1.8, 1.6],
          [2.5, 1.6],
        ] as const
      ).map(([p, se]) => qOf(p, se)),
      GOLDEN.qOf,
    )
    close(
      (
        [
          [0.5, 0.3, 0.3, 1.42],
          [1.2, 0.3, 0.3, 1.42],
          [1.5, 0.9, 0.3, 1.42],
        ] as const
      ).map(([p, t2, from, se]) => V2of(p, t2, from, se)),
      GOLDEN.V2of,
    )
    close(
      (
        [
          [1.8, 0],
          [2, 1],
          [2.2, 0],
        ] as const
      ).map(([q, t3]) => V3of(q, t3)),
      GOLDEN.V3of,
    )
    close([1.5, 1.75, 2, 2.25, 2.5].map(dvOf), GOLDEN.dv)
    close(
      (
        [
          [0.9, 0.2],
          [1, 0.6],
          [1.8, 1],
        ] as const
      ).map(([q, v2]) => gazeOf(q, v2)),
      GOLDEN.gaze,
    )
  })

  it('plans moves as camera and story legs', () => {
    close(planMove(0, 1, 1.42, 0.3, false), GOLDEN.planFwd)
    close(planMove(1, 2, 1.42, 0.3, false), GOLDEN.planOverStory)
    close(planMove(2, 1, 1.42, 0.3, false), GOLDEN.planBack)
    close(planMove(1, 2, 1, 1, false), GOLDEN.planNoStory)
    close(
      planMove(1, 2, 1.42, 0.3, false).map((leg) => [0.1, 0.5, 0.9].map((t) => legProgress(leg, t))),
      GOLDEN.legProgress,
    )
    close([0.25, 0.5, 0.75].map(easeCam), GOLDEN.easeCam)
  })

  it('resists past the ends and settles drags at most one beat away', () => {
    close([-1, 1.5, 3.4].map(rubber), GOLDEN.rubber)
    expect(
      (
        [
          [1, 1.3, 2],
          [1, 1.3, -3],
          [0, 0.4, 0],
          [2, 2.6, 9],
        ] as const
      ).map(([b, q, v]) => panTarget(b, q, v)),
    ).toEqual(GOLDEN.panTarget)
  })
})
