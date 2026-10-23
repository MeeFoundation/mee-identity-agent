## 1. Icons

- [x] 1.1 Download the `search`, `exclamation-circle` and `question-circle` outline SVGs from Figma (nodes inside `2703:174617` and `2703:168787`) and add `search.tsx`, `exclamation-circle.tsx` and `question-circle.tsx` under `packages/ui/src/icons/` matching `chevron-down.tsx`; verify each exports `SearchIcon`, `ExclamationCircleIcon`, `QuestionCircleIcon` with `size` and `color`
- [x] 1.2 Export the new icons from `icons/index.ts`, add them to the design-size, custom-size and custom-colour cases in `icons.test.tsx` (search 16, exclamation-circle 14, question-circle 16) and to `icons.stories.tsx`; verify the icon tests pass with `pnpm --filter app-tellipod test` (the `@mee/ui` tests run through app-tellipod's jest config)

## 2. Field state and parts

- [x] 2.1 Implement `Field` with `invalid` and `disabled`, the shared context (focused, filled, label text) and a hook for parts to read it; verify a unit test shows invalid/disabled reach a nested part without being repeated
- [x] 2.2 Implement `FieldLabel` for the `above` placement with `required`, `optional` text and tooltip slot, registering its text with the field; verify tests for "Email*", the optional text, the tooltip slot and absence of optional text
- [x] 2.3 Implement `FieldDescription`, `FieldCounter`, `FieldFooter` and `FieldError` (error visible only while invalid, live region, red text when invalid); verify tests for the three scenarios in the helper-text requirement

## 3. InputGroup

- [x] 3.1 Implement `InputGroup` with sizes S/M/L (30/36/44 box, 14/16/20 icons, text sizes), box fill, border and radius, and standalone state when no `Field` is present; verify tests for the box height per size and standalone rendering
- [x] 3.2 Implement `InputGroupInput` with props pass-through, focus and filled tracking for controlled and uncontrolled use, accessible name, error hint, `aria-disabled` and focus on box press; verify tests for filled tracking, handler pass-through, press-to-focus and disabled
- [x] 3.3 Implement `InputGroupAddon` (start/end, 8px gap) and `InputGroupText`, with the automatic exclamation-circle icon at the start of the trailing group when invalid; verify tests for ordering and the invalid icon
- [x] 3.4 Implement the box states: focus border and 3px ring (brand, error when invalid), invalid border, disabled fill, text colours; verify tests assert the style values for each state

## 4. Floating labels

- [x] 4.1 Add `edge` and `inside` placements to `FieldLabel` (absolute over the box, resting like a placeholder, floated at 12px/16px) with the masking background for `edge` and the text line moving down 8px for `inside`; verify tests for resting vs floated positions and that the box height is unchanged (30/36/44 for `edge`, 40/48/56 for `inside`) between resting and floated
- [x] 4.2 Animate the float with Reanimated (progress value, `ReduceMotion.System`, no animation on first render with a value) and show the placeholder only while floated and empty; verify tests with the Reanimated mock used in `Tabs.test.tsx` cover the initial-render, placeholder and reduce-motion scenarios
- [x] 4.3 Throw a descriptive error when a floating `FieldLabel` is rendered outside an `InputGroup`; verify a test asserts the error message

## 5. Exports, stories and checks

- [x] 5.1 Export all new parts and their prop types from `packages/ui/src/index.ts`; verify consumers can import them from `@mee/ui`
- [ ] 5.2 Add colocated stories covering the three placements x sizes S/M/L x default, focus, filled, alert and disabled, plus adornments, counter and error; verify the stories render in Storybook (`pnpm tellipod:storybook:ios`) and compare against the Figma sheet
- [ ] 5.3 Check the `edge` label is not clipped on Android and that S and L text sizes and the above-label gaps match the Figma S and L variants; resolve the open questions in design.md and adjust the spec if needed
- [x] 5.4 Run `pnpm lint` and `pnpm check-types` from the repo root and `pnpm --filter app-tellipod test`; verify all pass with no errors
- [x] 5.5 Let `InputGroupInput` render a different text input component (`component` prop) and use the new field parts with `BottomSheetTextInput` in `Sheet.stories.tsx` instead of its hand-styled inputs; verify a test covers the override and `pnpm --filter @mee/ui check-types` passes
