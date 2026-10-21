## Context

**What SC-ONB-001 already has.** `flows/sc-onb-001/` holds a faithful port of the artifact's v1 engine, about 7,000 lines:
- `engine/`: math, timeline, camera, drivers, clock-plan, values, runtime, clock, layout and frame;
- `scene/`, `overlays/` and `chrome/`;
- `screens/intro-screen.tsx`, the one mounted scene for the four beat routes;
- `screens/stand-in-screen.tsx`.

This code is flow-specific in three places only: it imports `ScOnb001ScreenId` and `BEATS` from `../model`, it reads `flows.scOnb001.*` strings (about 60 call sites in chrome, overlays and screens), and it calls `useFlowNavigation<ScOnb001ScreenId>()`.

Some of the port is already ready for tap mode:
- `values.ts` already derives the gates `canEnterPod`, `canInvitePaula` and `canGoHome`;
- `clock.ts` keeps `tapPlaying`;
- `anchors.ts` keeps `clampChip` with an `edge`;
- the overlays take the artifact's geometry.

Left out of the port:
- the clock's `tapLoop` attention loop (`hl`);
- `computeLayout`'s `'tap'` branch (1013 `P`, plus 1017 `TAP_CARD_*` and `tapBtnH`);
- the attention ring (1043 `AttentionRing`, 1044 `HL_*` and `ripple`);
- the large Ginger chip (1047 `gingerIsL`, `GINGER_TAP_NUDGE`, `TAG_H_L`);
- the note card's tap branch (1048: `cardHeight(m2, tap, bh)`, the bottom dock, the Invite Paula row);
- `HomeTag` (1073);
- the Sofia tag offset (1068);
- `telliFlight`'s tap control points (1072);
- the `isTapVersion` branches in 1022, 1071 and 1074.

**The source.** The artifact's bundle is a local copy from the earlier change, with its modules split out. The v1.2 code is the v1 modules running with `isTapVersion(version) === true`, so the source has no separate v1.2 engine. Running it at `?v=1.2&splash=0` through CDP confirms the behaviour in the spec, including that swipe and Skip still work.

**Conventions.** Flows never import from another flow's folder. Building blocks shared by several flows live in `slices/flow/pods/<name>/` (for example `attachments`, `notes`, `catalog`), with their strings under `pods.<name>.*` in `en.ts`.

## Goals / Non-Goals

**Goals:**
- One shared intro, with v1.2 as a mode of it, as in the artifact. Porting the tap branches next to the v1 code keeps both versions faithful to one source.
- SC-ONB-001 behaves and looks exactly as before. Moving the code is a refactor for it.
- The tap-specific logic stays testable: the tap layout, the attention-loop gating and the ripple are pure functions with unit tests.

**Non-Goals:**
- v2 "Living pod", haptics, the launch splash, wheel and trackpad paging, and the artifact's debug harnesses.
- Reworking the engine beyond what tap mode needs.
- Changing SC-ONB-001's strings, notes or questions.

## Decisions

### 1. Shared folder `pods/tellipod-intro/`
Move `engine/`, `scene/`, `overlays/`, `chrome/`, `art/` and both screens from `flows/sc-onb-001/` to `slices/flow/pods/tellipod-intro/`, keeping the same sub-folders and file names, so history and review stay readable. Move the engine and scene tests with their code. sc-onb-001 keeps `flow.ts`, `model.ts` and `sc-onb-001.test.ts`.

The flow-specific dependencies become shared ones:
- `pods/tellipod-intro/model.ts` owns `IntroScreenId` (the seven ids both flows use), `BeatId` and `BEATS`. Each flow's `model.ts` re-exports the screen id as its own type, `ScOnb001ScreenId` or `ScOnb002ScreenId`, so the flows keep their naming.
- Navigation uses `useFlowNavigation<IntroScreenId>()`.

*Alternatives:*
- sc-onb-002 imports from `../sc-onb-001/`. Rejected because it breaks the flow-folder boundary and ties one showcase's life to the other.
- Copying the code. Rejected: that means 7,000 lines in two places that must stay identical except for tap.

### 2. Strings move to `pods.tellipodIntro.*`
Copy used inside the scene moves from `flows.scOnb001.*` to `pods.tellipodIntro.*` with the same sub-keys: `art`, `beats`, `demo`, `intro`, `pod` and `standIns`. Both intros show the same copy there.

The tap-only labels and hints are added under the same keys: `pod.invitePaula`, `pod.invitePaulaHint`, `pod.home`, `pod.homeHint` and `pod.gingerTagTapHint`. Each flow keeps its own `flows.scOnbXXX.{title,description,goal,hints,questions,screens}`.

*Alternative:* a per-flow string namespace passed into the shared code. Rejected because the copy is identical, and a key prefix threaded through every component adds noise for nothing.

### 3. A mode as an option, not a version context
`createIntroScreens({ mode })` in `pods/tellipod-intro/screens/` returns `{ IntroScreen, TelliHandoffScreen, ExistingDeviceScreen, RestoreScreen }`, already bound to the mode. Each flow passes `'next'` (SC-ONB-001) or `'tap'` (SC-ONB-002), and maps the returned components to its screens.

The mode then reaches the rest of the scene in three ways:
- **The scene context.** `IntroSceneContext` gains `tap: boolean`, so overlays and chrome read it as the artifact reads `isTapVersion(useVersion())`.
- **The layout.** `computeLayout(…, mode)` picks the branch.
- **The anchors.** `gingerGeo(stage, tap)` builds the tap geometry (`tap: true` and an edge margin) that `anchors.ts` reads, as in the artifact, so `Stage` itself does not change.

The factory returns stable component identities per flow, so `FlowRunner` keeps the scene mounted across the beat routes as it does today.

*Alternatives:*
- A React context set by each flow's screen wrapper: the same effect with one more component layer.
- Reading the flow id at runtime: couples the shared code to flow ids.

### 4. Port the tap branches next to the v1 code
Each artifact module's tap branch goes into the file that already ports that module:

| File | What it gains | From |
|---|---|---|
| `engine/layout.ts` | `computeTapLayout`. If the stage would be shorter than 180 px, it falls back to the next layout, as the artifact does. | 1013 `P`, 1017 |
| `engine/attention.ts` (new) | `HL_PERIOD_MS` 1500, `HL_RIPPLE_MS` 1100, `HL_FROZEN`, `HL_GAP`, `HL_STROKE`, `HL_SPREAD`, `HL_CLEAR` and `ripple(hl, rm)` | 1044 |
| `engine/clock.ts` | a `tapLoop` option. When on: `runPulse` returns early, and an `hl` source repeats a linear 0→1 timing every `HL_PERIOD_MS` while the availability mask is non-zero. The mask covers enter-pod, invite, add-all, invite-Paula, go-home and rest-on-beat-4. The loop restarts when the mask changes and freezes at `HL_FROZEN` under reduced motion. | 1078, the reactions over `canEnterPod … canGoHome` |
| `overlays/attention-ring.tsx` (new) | the ring and ripple, driven by `hl` and a `live` gate | 1043 |
| `overlays/anchors.ts` | `gingerIsL`, `GINGER_TAP_NUDGE` [-10, 5], `TAG_H_L` and `gingerGeo(stage, tap)` | 1047 |
| `overlays/tags.tsx` | the Ginger tag in size L with a ring, its tap hint and rest-gated press; the Sofia offset; and `HomeTag`, with the opacity `ph(v3·T3, 2150, T3)` faded out by q 2.0–2.2 | 1068, 1073 |
| `overlays/note-card.tsx` | full width (`max(O, w/ui − 32)`), `tapBtnH(ui)` for the button height, the bottom dock (`sh − (TAP_CARD_BOTTOM + h)·ui`), no fold to `H_DONE`, the Invite Paula row fading in over m2 3150–3400, and rings on Invite Telli, Add all and Invite Paula | 1048 |
| `overlays/telli-flyer.tsx`, `scene/paula-line.tsx`, `overlays/sync-cards.tsx` | their small `isTapVersion` geometry branches | 1072, 1022, 1071 |
| `chrome/next-cta.tsx` | `showNext` (false in tap unless the stage is hidden) and a ring on Get Started | 1091 |
| `screens/intro-screen.tsx` | passes `tapLoop` and the layout mode; extends the stage-focus rescue mask with the tap gates | 1074 |

The Invite Paula and Home controls call the controller's `next()`, as the artifact does. The route sync from SC-ONB-001 then updates the URL.

### 5. The SC-ONB-002 flow
`flows/sc-onb-002/flow.ts` declares:
- `kind: 'showcase'`, code `SC-ONB-002`, no cases, no design frames, `initialScreen: 'rooms'`;
- the screens from `createIntroScreens({ mode: 'tap' })`;
- hints, `questionKeys` and `screenNotes` from the spec, under `flows.scOnb002.*`;
- `createStore: () => createJotaiStore()`, as sc-onb-001 does.

It is registered after `scOnb001Flow`. `flow-families.ts` already maps `SC-ONB`.

### 6. Verifying parity
SC-ONB-001 has to look and move the same after the move. The earlier change's CDP tooling, kept in the session scratchpad and outside the repo, can capture the same beats before and after the move for comparison. For SC-ONB-002, compare against the artifact at `?v=1.2`: at rest on every beat, every beat-2 state, mid camera move, and with the ring mid-ripple.

## Risks / Trade-offs

- [The move breaks SC-ONB-001 in small ways, such as a missed string key or a changed import order] → Do the move as its own task, before any tap work. Run SC-ONB-001's tests and type check, then compare screenshots before and after.
- [Tap branches spread `tap ? … : …` through shared files] → Keep each branch next to the v1 line it replaces, as the artifact does. Put the larger tap-only parts (`computeTapLayout`, `AttentionRing`, `HomeTag`) in their own functions or files.
- [The attention loop keeps the ticker awake on a resting beat] → This is expected while a control is available, and the artifact does the same. The loop stops when the mask is zero and under reduced motion, so the ticker sleeps again.
- [The tap layout overflows on short frames] → Port the artifact's 180 px fallback to the next layout, and check the 393×852 frame and a short 390×667 viewport.
- [knip flags the moved files or the new exports] → Run `pnpm --filter app-ux-flows knip` after the move and after the tap port.

## Migration Plan

No data or deployment changes. The move and the new flow ship together in one change. Rolling back means reverting the change.

## Open Questions

- Whether the "Invite Telli" hint should change from "Demo, optional…" in tap mode. The spec keeps the artifact's text and asks reviewers through the screen's open question.
