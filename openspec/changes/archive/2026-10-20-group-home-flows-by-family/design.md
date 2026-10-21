## Context

- `HomePage` (`src/slices/home/home-page.tsx`) splits flows into sections with `groupFlowsByKind`, then renders one `FlowRow` per flow.
- A flow's display code reaches the home page only through `catalogue`, which the loader in `src/routes/home.tsx` builds only in dev mode. Production has no code, so it can't group by code today.
- `FlowRow` shows the code badge from `flow.catalogue?.code`. `chat-add-medication` declares no `code`, so it never gets a badge.
- Per-tab storage already follows one pattern: `dev-mode.ts` and `run-storage.ts` read `sessionStorage` through a getter and wrap every access in `try/catch`.
- `lucide-react` is a dependency and can supply a chevron icon.

## Goals / Non-Goals

**Goals:**
- Grouping is a pure function that is easy to test, separate from rendering.
- Group titles are maintained in one place, and a test fails when a new family of two or more flows has no title.

**Non-Goals:**
- No "expand all" or "collapse all" control, and no search.
- No change to `FlowRow`, the catalogue, or how a flow is started.
- "Start new test session" doesn't reset the open groups. It clears study state, and this is display state.
- No change to the `flow_id` used in analytics or URLs for `chat-add-medication`.

## Decisions

**1. Code family is derived from the display code, not declared.**
`codeFamily(code)` drops the last `-` segment (`SC-PET-005` → `SC-PET`). A code with no `-` has no family, so its flow is a plain row.
*Alternative:* add a `group` field to each flow definition. That adds a second identifier that can drift from the code. The codes already follow `<KIND>-<AREA>-<NNN>`.

**2. Pass `code` on `FlowLauncher` in every mode.**
The loader adds `code: flow.code ?? null`, so production can group. Only rendering checks dev mode: `FlowRow` keeps reading its badge from the catalogue, which exists only in dev mode. The group header shows the family badge only when `showCodes` (passed from `devMode.on`) is true.
*Alternative:* group only when the catalogue exists. That breaks the choice to group in production.

**3. Pure grouping in `group-flows.ts`.**
Add `groupFlowsByFamily(flows)`, which returns an ordered list of items: `{ type: 'flow', flow }` or `{ type: 'group', family, flows }`. It runs on each section's flows after `groupFlowsByKind`, so families never span sections. It works in two passes:
1. Count the flows in each family.
2. Walk the flows in registry order. When a family has two or more flows, emit a group the first time the family appears, and append to it after that. Every other flow becomes a plain row.

The input is already filtered for hidden flows in production, so a family that hiding reduces to one flow becomes a plain row on its own.

**4. Titles in a small map in the home slice.**
`familyTitleKeys: Record<string, string>` in `src/slices/home/flow-families.ts` maps `SC-PET` and `EXP-PET` to `home.families.pets`, and `SC-PPL` to `home.families.people`. A test runs `createRegistry(allDefinitions, true)`, groups each section, and checks that every group's family has a title key. If a key were missing, the header would fall back to the family code, but the test keeps that from shipping.
*Alternative:* put titles on the flow definitions. Then several flows would carry the same group-level text.

**5. Open state: a tab-scoped store, read once on mount.**
`src/slices/home/open-groups.ts` exports `createOpenGroupsStorage(getStorage)` with `read(): ReadonlySet<string>` and `write(ids)`. It stores a JSON string array under `ux-flows:home-open-groups`. Every access goes through `try/catch`, and a missing or invalid value reads as an empty set. Group ids are `<kind>:<family>`, so the two "Pet care" groups are independent. `HomePage` takes `openGroups` and `onToggleGroup` props. The route keeps the set in component state, seeded from storage, and writes through on each toggle. Keeping storage out of `HomePage` lets the server-rendered tests stay deterministic.
*Alternative:* a Jotai atom with `atomWithStorage`. The home page has no Jotai store of its own, and nothing outside the home page reads this state.

**6. Group UI: a disclosure button, not `<details>`.**
`FlowGroup` (`src/slices/home/flow-group.tsx`) renders an `<li>` holding:
- a full-width `<button aria-expanded aria-controls>` with a chevron, the title, the count, the dev-mode family badge (styled like the existing code badge) and `HiddenBadge` when every flow in the group is hidden;
- when expanded, a nested `<ul>` with the same divider styles, holding a `FlowRow` per flow.

Collapsed rows aren't rendered. A controlled `<button>` avoids keeping a `<details>` element's own open state in sync with storage.

**7. Registry order.**
`chatAddMedicationFlow` moves to just after `scPet004Flow` in `registry.ts`, so its group lists SC-PET-001 to 005 in order. The registry-order assertion in `chat-add-medication.test.ts` changes to match. Other tests use `chat-add-medication` by id only.

## Risks / Trade-offs

- [A future code that doesn't follow `<AREA>-<NNN>`, such as `SC-PET-001A`, falls into an unexpected family.] → Families still come from the last `-` segment. The title-coverage test catches a new family without a title.
- [Collapsed by default hides flows from a first-time participant in production.] → Each header shows its title and count. This follows the choice made for this change.
- [The `chat-add-medication` title doesn't match its code's convention (its id isn't `sc-pet-005`).] → Flow ids stay stable so links keep working. Only the code changes.
