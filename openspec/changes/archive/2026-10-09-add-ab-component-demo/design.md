## Context

The variant infrastructure already exists (`app-ux-flows/flow-variants`). A variant's `components` override is merged over the base component environment by `resolveFlow`. Screens read building blocks through `useFlowComponents()`, so they render whatever component the active variant supplies. `variantSelection: 'explicit'` already makes the home page show one button per variant. Analytics already adds the variant to every event.

The Ginger pod building blocks live in `slices/flow/pods/ginger/` (`GingerTopBar`, `GingerFormsSection`, `GingerCategoryRows`, atoms such as `medicationFormAddedAtom` and `addMedicationFormAtom`). `GingerFormsSection` renders `EmptyStateCard` from the flow's component environment, which makes that component the natural override point.

## Goals / Non-Goals

**Goals:**
- Show the existing variant mechanism with the smallest possible diff: the variant overrides one component, and nothing else changes.
- Reuse the Ginger pod building blocks so the demo looks like the real experiments.

**Non-Goals:**
- No change to the runtime, the variant infrastructure, the home page or analytics.
- No in-flow variant switcher UI. Variants are chosen on the home page or by editing `?variant=`.
- No Figma frames and no participant study.

## Decisions

**1. New experiment flow `exp-demo-001` instead of a third variant on EXP-PET-002.**
EXP-PET-002 is a real, automatically assigned experiment. Adding a demo variant would change its assignment distribution and mix demo runs into its analytics. A separate flow keeps the demo isolated, and it can be removed later by deleting one folder and one registry entry.

**2. Override `EmptyStateCard`.**
Alternatives considered: `Button` (changes every button, so it isn't really one component in effect), `SectionLabel`/`Divider` (too subtle to demonstrate), `PodTopBar` (large, but has no link to a conversion action). `EmptyStateCard` is the call to action that decides the outcome, it is visually distinct, and it is already read through `useFlowComponents`. Overriding it therefore needs no screen changes.

**3. `ProminentEmptyStateCard` lives in the flow folder, not in `shared/ui`.**
Path: `flows/exp-demo-001/components/prominent-empty-state-card.tsx`. It is typed as `typeof EmptyStateCard` props (`ComponentProps<typeof EmptyStateCard>`), so the variant's `components: { EmptyStateCard: ProminentEmptyStateCard }` type-checks against `Partial<C>`. It is demo-only. Promoting it to the design system would expand scope. It uses the shared `Button` (`variant="filled"`, `tone="primary"`, `size="l"`, full width) and a `react-bootstrap-icons` icon. The highlighted background uses existing brand Tailwind tokens (`bg-brand-50`/`border-brand-200` or the nearest existing tokens).

**4. Two screens, initial screen `ginger-info`.**
The demo goes straight to the point where the variants differ. One shared `DemoInfoView` (top bar with the Info tab selected and inert tab selection, `GingerFormsSection` with `emptyAction`, `Divider`, `GingerCategoryRows`) serves both screens. `medication-added` passes `medicationFormAdded` and, like the showcase, calls `addMedicationForm()` + `complete({ showCompletionView: false })` in a `useLayoutEffect`.

**5. Analytics: one event, `medication_form_added { method: 'empty_state' }`.**
This follows the naming rule in `flow-analytics`: the same intent gives the same name, and the variant comes only from the automatic context. The type is `ExpDemo001Events` in the flow's `model.ts`.

**6. Variant definitions.**
```ts
variantSelection: 'explicit',
defaultVariant: 'a',
variants: {
  a: { code: 'EXP-DEMO-001-A', nameKey, descriptionKey },
  b: { code: 'EXP-DEMO-001-B', nameKey, descriptionKey,
       components: { EmptyStateCard: ProminentEmptyStateCard } },
}
```
`createStore` seeds `podAtom`, `medicationAtom`, `medicationFormAddedAtom=false` and `noteTextAtom=''`, like the other Ginger flows. It has no variant initial state.

## Risks / Trade-offs

- [The demo flow shows up next to real experiments on the home page] → The title and description say it is a demo. The `EXP-DEMO` code makes it easy to filter out in Matomo.
- [The prominent card could drift from the design system] → It is acceptable for a demo, and it is limited to the flow folder.
- [`exp-demo-001` analytics mix with real data if Matomo is configured] → Filter by flow id. This is documented in the flow description and is not a blocker for a demo.
