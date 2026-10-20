## Context

See `proposal.md` for why. The shared intro lives in `slices/flow/pods/tellipod-intro/` (about 7,600 lines: `engine/`, `scene/`, `overlays/`, `chrome/`, `screens/`). `createIntroScreens({ mode })` binds a mode of `'next'` or `'tap'` to the screen components, and `computeLayout(…, mode)` picks the layout.

**The source.** The artifact's bundle (`app.js`, a minified Expo web build, 2.4 MB) is the only reference for v2. It has no readable source for v2, so the findings below come from its modules (ids in brackets) and its worklet source strings, which survive minification. Version `2` is picked by `?v=2`:
- **Chrome and clock are shared.** [1074] `computeLayout` gets `'top'`, and the clock gets `assemblyMs = T1_V2` (2440 ms, instead of `T1`). Everything else in the intro screen, including the beat clock, swipe and Next, runs as in v1.
- **The stage content is replaced.** [1081] The stage renders `SceneV2` instead of `WorldSvg` and `Overlays` when the version is 2. `SceneV2` [1082, about 61 KB] is a flat 2D scene driven by the same shared values (`q` for the camera progress, `v2` and `v3` for the beat-2 and beat-3 stories, `s1` for the deck).
- **The deck** [geometry module]: `DECK_N` 4, `DECK_STEP` 640 ms, `DECK_IN` 520 ms, `DECK_RISE` 12. `deckPose` places card `i` using `deckIn`, `deckDepth`, `DECK_SHRINK`, `DECK_DEPTHS`, `DECK_FADE` and `DECK_FROM`; `deckFace` fades each card's face as the next one lands.
- **The `top` layout** [1013 `S`]: the copy sits under the top bar, the stage starts at the copy's bottom and ends at the Next button, and a `keyBox` gives each beat's key span. It falls back to the `next` layout when a beat's key span does not fit.
- **The pod data** [pods module]: `PODS` (kyoto, sofia, ginger, home with name, category, icon and members) and `PODS[…].people`. These are the same pods as in the isometric rooms.
- **Interactivity.** "Invite Telli" and "Add all suggested info" are pressable and call the controller's `inviteTelli` and `addAll`, gated by `canInvite` and `canAddAll`. The rest of the scene is not.

**Confirmed by running the artifact** at `?v=2&splash=0` (393×852, captures kept in the scratchpad): v2 reuses v1's real pod-card UI, flat (tabs Notes/Chat/Info, the "Invite Telli" and "Add all suggested info" buttons, info rows with plus and edit icons, a typing cursor in the note), its `rooms` copy differs from v1's, each deck card shows a note, a file, a chat message and a message field, `paula` shows two phones with sync badges and "Pet sitter" under Paula, and `welcome` is a four-row pod list with Ginger highlighted. Reduced motion shows the deck assembled and cross-fades between beats. Still to read from the bundle in task 1.2: the exact card frames (`P1` to `P4`, `frameAt`).

**Conventions.** Flows never import from another flow's folder. Shared building blocks live in `pods/<name>/`, with strings under `pods.<name>.*` in `en.ts`. Each flow's `model.ts` re-exports `IntroScreenId` as its own screen id type.

## Goals / Non-Goals

**Goals:**
- One shared intro with v2 as a third mode, so all three versions stay faithful to one source.
- SC-ONB-001 and SC-ONB-002 keep their behaviour and look exactly.
- The v2-specific logic stays testable: the deck pose and fade, the `living` layout and its fallback are pure functions with unit tests.

**Non-Goals:**
- The launch splash, haptics, wheel and trackpad paging, and the artifact's debug harnesses.
- Reworking the engine beyond what the `living` mode needs.
- Making the cards or rows interactive beyond the two demo buttons.

## Decisions

### 1. A third mode, `'living'`
`IntroMode` becomes `'next' | 'tap' | 'living'`, and `createIntroScreens({ mode: 'living' })` returns the components for SC-ONB-003, as for the other two. The scene context already carries `tap: boolean`; it gains `living: boolean`.

*Alternatives:*
- A separate pod folder `tellipod-intro-living/` that copies the clock, runtime and chrome. Rejected: that duplicates the parts v2 shares unchanged (the clock, swipe, chrome, stand-ins), and they would drift.
- A version context as in the artifact. Rejected for the reason given in the SC-ONB-002 design: a mode passed to the factory keeps stable component identities per flow.

### 2. Swap the stage content, keep everything around it
`screens/intro-screen.tsx` renders `LivingScene` in place of `WorldSvg` and `Overlays` when the mode is `living`. The clock, gesture, veil, copy, pager and Next stay as they are. `LivingScene` goes in a new folder `pods/tellipod-intro/living/` so the isometric code does not grow `living ? … : …` branches.

### 3. Deck and geometry go in `engine/`
`DECK_*`, `T1_V2`, `deckIn`, `deckDepth`, `deckPose`, `deckFace` and the pod-card, key and row geometry go in `engine/` next to the existing timeline and layout, as pure functions over the clock's values, with unit tests at the artifact's own numbers. The clock takes `assemblyMs` as an option, which the intro screen sets to `T1_V2` in `living` mode.

### 4. Layout
`computeLayout` gets a `'living'` branch ported from [1013 `S`], with its fallback to the `next` layout. A unit test at 393×852 checks the stage's y and height against values read from the artifact at `?v=2`, and a test at 390×560 checks the fallback.

### 5. Strings
Headlines and sublines for `ginger-pod`, `paula` and `welcome` reuse `pods.tellipodIntro.beats.*`. v2's `rooms` has its own headline and subline ("Pods for every part of life." / "One for a trip, your kid, your cat."), which go under `pods.tellipodIntro.living.*` with the pod card contents (notes, files, messages) and the text alternatives. The flow keeps `flows.scOnb003.{title,description,goal,hints,questions,screens}`.

### 6. The SC-ONB-003 flow
`flows/sc-onb-003/flow.ts` declares what `sc-onb-002/flow.ts` does, with `'living'` as the mode, its own hints, `questionKeys` and `screenNotes`. It is registered after `scOnb002Flow`; `flow-families.ts` already maps `SC-ONB`.

### 7. Verifying parity
Compare SC-ONB-003 with the artifact at `?v=2&splash=0` through CDP, at rest on every beat, mid-deck, mid card morph, and in each beat-2 state. Capture SC-ONB-001 and SC-ONB-002 before and after to check they have not changed.

## Risks / Trade-offs

- [v2 has no readable source, so the port reads minified code] → Treat the running artifact as the reference. Port one beat at a time and compare screenshots and frame values before moving on, as the earlier ports did.
- [The `living` mode adds branches to shared files] → Keep the v2 scene in its own folder, and keep the branches to the stage swap, the layout and the clock option.
- [Spec requirements for card geometry and copy are partly inferred] → The tasks start by reading v2 at runtime and then update the spec for anything that differs, before building on it.
- [The scene is short on small screens] → Port the layout's fallback and check the 393×852 frame and a short 390×667 viewport.
- [knip flags new exports] → Run `pnpm --filter app-ux-flows knip` after each group of tasks.

## Migration Plan

No data or deployment changes. The mode and the new flow ship together in one change. Rolling back means reverting the change.
