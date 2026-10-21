## Why

The home page of `app-ux-flows` is one flat list per section. It already holds five SC-PET showcases and four EXP-PET experiments, and more are coming, so reaching a flow means scrolling past every other pet flow. Also, "Add medication from chat" is a pet showcase but has no display code, so in dev mode it shows no code badge and doesn't sort with the other SC-PET flows.

## What Changes

- "Add medication from chat" (`chat-add-medication`) gets the display code `SC-PET-005`. Its flow id, URLs, screens and behavior stay the same. In the registry it moves after SC-PET-004.
- On the home page, flows within a section are grouped by **code family**: the display code without its trailing number (`SC-PET-003` → `SC-PET`). A family with two or more listed flows becomes an expandable group. A flow without a code, or alone in its family, stays a plain row.
- Each group has a translated title ("Pet care", "People") and a count of its flows. In dev mode the group also shows its family code as a badge, such as `SC-PET`. Production shows the title and count but no code.
- Groups start collapsed. Whether each group is open is remembered for the browser tab, so it stays the same after opening a flow and coming back.
- Section headings keep counting flows, not groups.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `app-ux-flows/flow-runtime`: the "Home page lists available flows" requirement adds grouping by code family, expandable groups, group titles, counts, the dev-mode family badge and remembered open state. The `chat-add-medication` catalogue scenario now expects `SC-PET-005`.
- `app-ux-flows/showcases/chat-add-medication`: "Showcase identity and screens" gives the showcase the display code `SC-PET-005` in place of "no display code".

## Impact

- `apps/app-ux-flows/src/slices/flow/flows/chat-add-medication/` (flow code, test).
- `apps/app-ux-flows/src/slices/flow/registry.ts` and the tests that assert registry order.
- `apps/app-ux-flows/src/slices/home/` (grouping logic, a new group component, home page, tests).
- `apps/app-ux-flows/src/routes/home.tsx` (the loader passes each flow's code in every mode).
- `apps/app-ux-flows/src/app/locales/en.ts` (group titles, group count).
- No change to analytics, flow ids or URLs. Saved links and recorded runs are unaffected.
