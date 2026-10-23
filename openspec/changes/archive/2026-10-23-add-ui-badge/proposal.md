## Why

The Mee design system (Figma "Badge", node 4:8701) defines a full Badge component, but `@mee/ui` has none. The only badge in the codebase is a private, hardcoded NEW pill inside `CellInfo`, so screens that need status labels, counters or indicator dots have nothing to reuse and would each recreate the styling.

## What Changes

- Add a shared `Badge` component to `@mee/ui` that covers the design's matrix: 5 types (primary, secondary, success, danger, warning), 3 styles (solid, light, outlined), 4 sizes (XXS, XS, S, M) and 4 shapes (rounded, pill, circle, dot).
- Support an optional leading dot, leading icon and trailing icon on label badges (rounded and pill), supplied by the consumer; `Badge` does not bundle icons.
- Support a count form (circle shape) that shows a short value such as "9+", and a bare dot form with no text.
- Export `Badge` and its prop types from the `@mee/ui` entry point.
- Add a colocated Storybook story file and unit tests for the component.
- Out of scope: replacing the private NEW badge in `CellInfo`; it keeps its current look and is migrated in a separate change.

## Capabilities

### New Capabilities
- `packages/ui/badge`: the shared `Badge` component of `@mee/ui` — types, styles, sizes, shapes, slots, count and dot forms, typography, accessibility and stories.

### Modified Capabilities

None.

## Impact

- `packages/ui/src/`: new `Badge.tsx`, `Badge.stories.tsx`, `Badge.test.tsx`; `index.ts` gains an export.
- New spec `openspec/specs/packages/ui/badge/spec.md` once the change is archived.
- No new dependencies, no changes to apps, and no change to existing components.
