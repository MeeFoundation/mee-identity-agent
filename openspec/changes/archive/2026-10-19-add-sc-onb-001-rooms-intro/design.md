## Context

See proposal.md for the motivation and the spec for the behaviour. A first version shipped static per-beat art with entry zooms. The requester then asked for the artifact's real animation, including swipe-scrub, which is what this design covers.

**The source prototype.** The "Tellipod Intro" artifact is an Expo web build: one minified `app.js` of 2.4 MB using react-native-web, Reanimated and react-native-svg, with no source in this repo. Its v1 · Rooms engine is split into clean modules, and Reanimated keeps every worklet's source as a readable string, so the logic can be recovered exactly:

| Artifact module | What it holds |
|---|---|
| 1007 `math` | `clamp`, `remap`, `ph`, `lerp`, `smooth`, `eio`, `eo`, `interp`, `pulse`, `iso` (isometric projection), quadratic Béziers, `lerpColor` |
| 1018 `timeline` | beat count, story durations (`T1` 1100 ms, `T2` 3400 ms, `T3` 2400 ms), story gates, camera timing and bezier, pan and spring constants |
| 1080 | reduced-motion and pan constants |
| 1006 `camera` | four camera key framings (`KEYS`) and `camera(q, …)`, a zoom-correct interpolation between them; `w2s` world→screen |
| 1028 `drivers` | values derived from progress: `q`, `V2`, `V3`, `A1`, `dv`, `dim`, `gaze`, `dockW`, `cardW` |
| 1027 `values` | the source values (`p`, `t2`, `t3`, `s1`, `t2From`, `seen2`, `veil`, pulses) and every derived value, including the `can*` gates |
| 1079 `clockPlan` | planning a move as camera legs and story legs, the press-window time warp, rubber band and fling targets |
| 1078 `useIntroClock` | the controller: `goTo`, `next`, `back`, `skip`, invite and add-all, settle, pulses, reduced-motion fades, and the pan gesture |
| 1013 `layout` | layout of chrome, stage, copy and actions for a given screen size |
| 1014, 1016, 1020, 1021, 1019, 1022, 1024, 1025, 1010 | world geometry, the static scene, and the animated world parts (rooms assembling, door, the line to Paula, Paula's phone), drawn into one SVG with the camera matrix and an edge feather |
| 1047, 1031, 1032, 1036–1044, 1068–1073 | world anchors and the overlays: tags, Ginger stack, Telli flyer, key chip, sync cards, attention ring |
| 1048, 1058, 1062–1065 | the note card: tabs, note line, suggested rows, buttons |
| 1084–1091 | top bar, pager, copy and actions |

Modules for v1.2 "Tap through", v2 "Living pod", the debug harnesses (1008, 1026, 1029) and the frozen-URL mode are out of scope.

**`app-ux-flows`.** `FlowRunner` keys the screen element by run id only, so if the four beat screens share one component, React keeps it mounted across screen changes. Screens currently can't read the current screen id.

## Goals / Non-Goals

**Goals:**
- Port the v1 engine faithfully: the same functions, constants, timings and easing, so the scene moves exactly like the artifact.
- Keep everything inside the flow folder apart from one small runtime hook.
- Keep the engine testable: the math, camera, drivers and move planning are pure modules with unit tests.

**Non-Goals:**
- Haptics, the wheel and trackpad paging, and the tap-version attention loop. These are device or other-version features.
- A design-reference link to the artifact.
- Making the engine reusable for other flows.

## Decisions

### 1. One mounted scene for four routes
`rooms`, `ginger-pod`, `paula` and `welcome` all map to the same `IntroScreen` component. A new `useFlowScreen()` hook in `runtime/flow-context.ts` returns the current screen id from the runtime context, and `FlowRunner` already knows it. The scene and the route sync in both directions:
- when the scene's nearest beat (the prototype's `beat`, its rounded `q`) changes to *b*, the screen calls `goToScreen(beatScreen[b])`, unless the route already shows it;
- when the route changes to a beat the controller isn't heading to (browser back, a direct link), the screen calls the controller's `goTo(b)`.

Back calls the controller's `back()` rather than `navigation.back()`, as in the artifact. The stand-ins stay separate screens.

*Alternative:* a single `intro` screen id. Rejected because the briefing's notes and hints must follow the beat.

### 2. A small Reanimated stand-in: `engine/runtime.ts`
The artifact's code is written against Reanimated: shared values, timing, delay, sequence, spring, repeat, cancel, and finish callbacks. Its exact semantics, such as a callback getting `false` when cancelled or overwritten, carry the controller's logic. A web runtime of about 200 lines reproduces them:
- `SharedValue<T>` with `.value`. Assigning an animation descriptor starts it, and assigning a plain value cancels any running animation (its callback gets `false`).
- `withTiming(to, { duration, easing }, cb)`, `withDelay`, `withSequence`, `withRepeat`, `withSpring` (a damped spring with the artifact's `SNAP_SPRING` and an energy threshold), and `cancelAnimation`.
- One `requestAnimationFrame` ticker per scene. It steps the running animations, recomputes the derived values once (`computeIntroValues`, the port of 1027), runs reactions (the `useAnimatedReaction` equivalents) and then frame subscribers. It stops when nothing is animating and restarts when a value is set.
- `useFrameStyle(ref, (iv) => style)` and `useFrameAttrs(ref, (iv) => attrs)`, the equivalents of `useAnimatedStyle` and `useAnimatedProps`. They write to the DOM directly and never re-render React. An RN-style `transform` array is converted to a CSS transform string.
- `useFrameState(select)` re-renders React only when a selected value changes, the equivalent of `useAnimatedReaction` plus `scheduleOnRN`. It drives the current beat for the copy and URL, the demo state for text alternatives, and which controls are enabled.

Worklet bodies are ported almost verbatim, with `x.value` and the same math, which keeps fidelity easy to check against the source.

*Alternatives:* adding Reanimated or react-native-web, which is a heavy dependency set for one showcase; or rewriting the motion with CSS transitions, which can't scrub and wouldn't match the timings.

### 3. Engine module layout
In `sc-onb-001/engine/`:
- `math.ts`, `timeline.ts` (1018 + 1080), `camera.ts`, `drivers.ts`, `clock-plan.ts` and `values.ts` are pure and unit-tested.
- `runtime.ts` is the stand-in from decision 2.
- `clock.ts` ports `useIntroClock` (1078) for v1 only, with haptics removed.
- `layout.ts` ports the non-tap branch of `computeLayout` (1013) for the frame's screen area.

In `sc-onb-001/scene/`:
- `geometry.ts` (1014, 1016, 1047 anchors)
- `scene-layer.ts` (1020 path building)
- `static-scene.ts` (1019)
- the animated parts (`door.tsx`, `paula-line.tsx`, `paula-phone.tsx`)
- `world-svg.tsx` (1010)

In `sc-onb-001/overlays/`: the tags, Ginger stack, Telli flyer, key chip, note card, sync cards and attention ring, each a port of its module.

In `sc-onb-001/chrome/`: the top bar, copy, actions and pager.

### 4. Drawing
The world is one inline `<svg>` sized to the stage. The static scene is built once as path strings. The camera is a `matrix(…)` on the world group, set every frame through `useFrameAttrs`. The feather masks are ported as SVG masks. Overlays are absolutely positioned HTML positioned from `w2s(anchor, cam)` each frame, so they track the world. Colours come from the artifact's own palette (1015), kept in `scene/palette.ts`, because the world uses shades the app tokens don't have. The overlay UI keeps using app tokens where they match.

### 5. Gestures
A pointer-event pan on the stage and copy area mirrors the artifact's gesture setup:
- It activates after 12 px of horizontal movement and fails after 16 px vertical (`PAN_ACTIVE_X`, `PAN_FAIL_Y`).
- It uses pointer capture, and `touch-action: pan-y` on touch.
- It calls the controller's `dragBegin`, `dragMove` and `dragEnd`, passing the translation and the velocity measured over the last 100 ms.
- A drag that never activates leaves the click to the control under it.

### 6. Reduced motion
`prefers-reduced-motion` is read through `matchMedia` and kept live, and passed in as `rmSV`. The artifact's reduced-motion path (veil fades, `rmGo`, `rmStory`) is ported as is.

### 7. What goes away
The first version's per-beat SVG snapshots, `IntroLayout`'s entry animation, `entryScale`, the `intro-enter` keyframes in `styles.css`, the flow-local demo atoms (`demoAtom`, `addRowAtom`, …) and the per-row add buttons are removed. `intro-fade` stays at 300 ms for the stand-in screens, matching the prototype's handoff fade. The demo state now lives in the engine's sources (`t2`), which survive moving between beats and reset with a new run. That is because the scene's sources are created per run in the flow's store.

### 8. Identity, strings, family
These are unchanged from the first version (`SC-ONB-001`, `flows.scOnb001.*`, `SC-ONB` → "Onboarding"), apart from strings that the removed per-row controls used.

## Risks / Trade-offs

- [The port drifts from the artifact in small ways, such as a sign or an easing] → Compare frame by frame. The artifact runs locally through CDP, so screenshots of the same beat and progress can be put side by side, at rest on every beat and mid-move.
- [Per-frame DOM writes for many overlays could jank the frame] → Frame subscribers write only changed properties, and the ticker sleeps at rest. Profile the camera move in the browser.
- [The pointer pan conflicts with buttons inside the scene, such as Invite Telli] → The pan activates only after a 12 px horizontal move, and a click without activation goes through, as in the artifact.
- [The controller is about 35 KB of intricate state] → Port it verbatim. Unit-test move planning, and walk every spec scenario in the browser, including interrupting a move with another tap or a drag.
- [The scene's stage size depends on the frame and the phone width] → `layout.ts` computes it from the measured screen area, as the artifact does from the window.

## Open Questions

- Whether to keep the artifact's haptic moments as a subtle visual cue on the web. That can be decided after review without changing the port.
