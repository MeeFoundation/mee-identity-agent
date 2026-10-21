## 1. SC-PET-005 for "Add medication from chat"

- [x] 1.1 Add `code: 'SC-PET-005'` to `chatAddMedicationFlow` in `src/slices/flow/flows/chat-add-medication/flow.ts`. Update the identity test to expect that code instead of `undefined`, and verify `pnpm --filter app-ux-flows test chat-add-medication` passes.
- [x] 1.2 Move `chatAddMedicationFlow` to just after `scPet004Flow` in `src/slices/flow/registry.ts`. Update the registry-order assertion in `chat-add-medication.test.ts` to match, and verify the test passes.

## 2. Grouping logic

- [x] 2.1 Add `codeFamily(code: string | null): string | null` and `groupFlowsByFamily` to `src/slices/home/group-flows.ts` (design decision 3). Add tests in `group-flows.test.ts` covering:
  - families of two or more flows become groups;
  - a single-flow family and a flow without a code stay plain rows;
  - a group takes the position of its first flow;
  - order is kept inside a group;
  - `EXP-DEMO-001` → `EXP-DEMO` and `SC-PET-005` → `SC-PET`.

  Verify the tests pass.
- [x] 2.2 Add `src/slices/home/flow-families.ts` with `familyTitleKeys` (`SC-PET` and `EXP-PET` → `home.families.pets`, `SC-PPL` → `home.families.people`). Add a test that builds the dev registry with `createRegistry(..., true)`, groups each section, and checks that every resulting group has a title key. Verify it passes.
- [x] 2.3 Add `src/slices/home/open-groups.ts` with `createOpenGroupsStorage(getStorage)` and `browserOpenGroupsStorage` (key `ux-flows:home-open-groups`, `try/catch` around every access, invalid JSON reads as empty). Add tests for: round trip, missing storage, a throwing storage and invalid stored data. Verify they pass.

## 3. Home page UI

- [x] 3.1 Add the locale keys `home.families.pets` ("Pet care"), `home.families.people` ("People") and `home.group.title` ("{{title}} ({{count}})") to `src/app/locales/en.ts`, and verify `pnpm check-types` passes.
- [x] 3.2 Add `FlowGroup` in `src/slices/home/flow-group.tsx` (design decision 6). It renders:
  - a disclosure button with `aria-expanded` and `aria-controls`;
  - a `lucide-react` chevron;
  - the title with count;
  - the family badge, only when `showCodes`;
  - `HiddenBadge` when every flow is hidden;
  - the flow rows, only when expanded.

  Verify it with the home page tests in 3.4.
- [x] 3.3 Add `code: string | null` to `FlowLauncher` and set it in the `src/routes/home.tsx` loader in every mode. In `HomePage`, render each section with `groupFlowsByFamily`. Add the `showCodes`, `openGroups` and `onToggleGroup` props. Verify `pnpm check-types` passes.
- [x] 3.4 Extend `src/slices/home/home-page.test.ts`. Use SC-PET and SC-PPL fixtures to check:
  - groups are collapsed by default (no start actions rendered for grouped flows);
  - an id in `openGroups` renders that group's rows;
  - the family badge appears only with `showCodes`;
  - section counts include grouped flows;
  - a lone-family flow renders as a plain row.

  Verify the tests pass.
- [x] 3.5 In `HomeRoute`, keep the open group ids in state seeded from `browserOpenGroupsStorage.read()`. Write through on toggle, and pass `showCodes={devMode.on}`. Verify in the dev server (`pnpm --filter app-ux-flows dev`) that:
  - the "Pet care" groups start collapsed;
  - expanding one leaves the others collapsed;
  - after starting a flow and pressing back, the same group is still expanded;
  - SC-PET-005 shows on "Add medication from chat".

## 4. Verification

- [x] 4.1 Run `pnpm --filter app-ux-flows test`, `pnpm check-types` and `pnpm lint` from the repo root, and confirm all pass with no errors.
- [x] 4.2 Run `openspec validate group-home-flows-by-family --strict` and confirm it passes.
