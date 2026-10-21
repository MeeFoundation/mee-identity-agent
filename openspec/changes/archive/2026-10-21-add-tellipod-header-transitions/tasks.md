## 1. Test setup

- [x] 1.1 Mock `react-native-reanimated` in `apps/app-tellipod/jest.setup.ts`; verify the existing `pnpm --filter app-tellipod test` suite still passes unchanged

## 2. Persistent surface

- [x] 2.1 Remove the `HeaderSurface` wrapper from `HomeHeader`, `BackSearchHeader` and `PodHeader`, and render `HeaderSurface` once in `AppHeader` around the selected variant content (none renders no surface); verify `app-header.test.tsx` passes with content and variants unchanged and that no variant file imports `HeaderSurface`
- [x] 2.2 Add `motion` tokens (`header` duration 200, height easing) to `src/shared/ui/tokens.ts` and export them from `shared/ui`; verify a type-checked import in the header

## 3. Transitions

- [x] 3.1 Wrap variant content in an `Animated.View` keyed by variant with `FadeIn`/`FadeOut` using `ReduceMotion.System` and `pointerEvents="none"` while exiting, and give the surface `LinearTransition` plus fade `entering`/`exiting` so it grows from and collapses to nothing; verify tests that the surface is one instance across `home`, `back-search` and `pod`, that content is keyed per variant, and that `none` renders nothing
- [x] 3.2 Verify a test that re-rendering the same variant with changed content (pod tab, user name) does not remount the keyed content

## 4. Verification

- [x] 4.1 Run `pnpm lint` and `pnpm check-types` from the repo root; verify both report no errors
- [x] 4.2 On the iOS simulator, navigate Home → Navigation → Pod info → back and none ↔ home; verify the fade and height morph run without a jump, nothing sits under the top inset mid-transition, the shadow and corners stay intact, and a rapid double back leaves no half-faded header
- [x] 4.3 With Reduce Motion turned on in the simulator accessibility settings, repeat the navigation; verify the header changes with no animation
