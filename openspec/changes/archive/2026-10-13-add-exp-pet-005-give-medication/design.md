## Context

EXP-PET-004 already builds the baseline path this experiment needs, typed against its own events:
- `home` on `GingerHomeView`;
- `ginger-notes` and `ginger-info` with `ExpPet004TopBar`;
- `medical` with `MedicalView` and `MedicationRow`;
- `medication` with details.

Flows don't import from each other (`AGENTS.md`), so EXP-PET-005 copies these thin screens into its own folder and reuses the shared pod pieces underneath them.

Three existing patterns shape this design:
- **Sheets are their own screens.** EXP-PET-002's `add-form` and SC-PPL-001's `tidy-confirm` render the origin view and then a `BottomSheet` over it. An origin atom picks the view, and dismissing calls `back()`.
- **Silent completion.** EXP-PET-004's `medication-updated` calls `complete({ showCompletionView: false })`.
- **Toasts are flow state.** SC-PPL-002 keeps the toast in a `toastAtom` and renders `Toast` from the view that owns it.

The pod's data model has no dose concept. `MedicationRecord` carries no status, and `AGENTS.md` says each record has one owner, read through projections.

See `proposal.md` for motivation and `specs/app-ux-flows/experiments/exp-pet-005/spec.md` for behaviour.

## Goals / Non-Goals

**Goals:**
- The only thing that varies is the promoted surface. Every surface renders the same `DueDoseCard`, and every confirmation uses the same `give-dose` screen.
- A dose is a record of its own. "Mark as given" writes only the dose.
- Baseline screens are byte-identical across variants apart from the promoted slot.

**Non-Goals:**
- Computing schedules (next dose, missed doses).
- Making `DueDoseCard` a design-system component. It's a Ginger pod piece until a second pod type needs it.
- A second dose, or a second medication.

## Decisions

### 1. The variant chooses the surface through initial state

`ExpPet005InitialState.doseSurface: 'medical' | 'pod' | 'home'` is stored in `doseSurfaceAtom`, and variants set it to `medical`, `pod` and `home`:
- the pod band reads it in `ExpPet005TopBar`'s screens (`ginger-notes`, `ginger-info`);
- Home reads it to fill `GingerHomeView`'s new optional slot.

`medical` always means "no promoted surface", because the baseline exists everywhere.
- **Why:** it follows the `AGENTS.md` rule ("variants that differ in one block use an initial-state flag") and mirrors EXP-PET-004's `medicationShortcut`. No screens are overridden and no screen is `null`.
- **Alternative considered:** per-variant screen overrides of `home`, `ginger-notes` and `ginger-info`. That spreads the variable over six components that would have to stay identical.

### 2. The dose record lives in the Ginger pod, next to the medication

In `pods/ginger/model.ts`:

```ts
type MedicationDose = { scheduledAt: string; status: 'due' | 'given'; givenAt?: string } // ISO date-times
medicationDoseAtom = atom<MedicationDose>(…)
```

In `pods/ginger/dose-status.ts` (the projection, next to `medication-fields.ts`):

```ts
type DoseStatus = 'upcoming' | 'due' | 'overdue' | 'given'
toDoseStatus(dose, now, { dueWindowMinutes }): DoseStatus
```

- **Given** wins.
- **Upcoming** applies before the window opens.
- **Due** applies within ± the window.
- **Overdue** applies after it.

`formatDoseTime(iso, language)` formats times with `Intl.DateTimeFormat(language, { timeStyle: 'short' })`.

The flow's `createStore` sets `scheduledAt` to `new Date().toISOString()` when the store is built, so the default always reads "Due now". `doseGiven: true` in initial state builds the given state, with `givenAt` equal to `scheduledAt`. `giveDoseAtom` (a write atom in the flow model) sets `{ status: 'given', givenAt: now }` on `medicationDoseAtom` only. A test asserts that `medicationAtom` is referentially unchanged.
- **Why the pod and not the flow:** a dose is pod data, like the medication. The projection and card are what later dose flows would reuse. Only the fixture values are flow-specific.
- **Why a time window and not equality:** the store is built at run start, and participants reach Medical minutes later. A 60-minute window keeps "Due now" true for the whole session without a clock in the UI. Overdue stays unreachable in this flow, but the projection is tested for it.
- **Alternative considered:** `status: 'due'` read directly with no projection. It's simpler, but it leaves the upcoming and overdue visuals untested and undefined.

### 3. `DueDoseCard` is one component with a `pet` option

`pods/ginger/components/due-dose-card.tsx`:
- reads `medicationAtom` and `medicationDoseAtom`;
- uses `toMedicationSummary` for "{dose} · {frequency}" and `toDoseStatus` for the state;
- renders a `section` with `aria-labelledby` on its heading and a `Button` for the action.

Its props are `onGive: () => void` and `showPet?: boolean`. `showPet` renders the pod avatar and name above the line, and is used only on Home. The card fires no analytics itself; the screen that hosts it passes `onGive`.

The treatments use existing tokens:

| State | Treatment | Action |
|---|---|---|
| upcoming | gray surface | none |
| due | `brand-50` surface, `brand-200` border | yes |
| overdue | `warning-*` surface, with the time | yes |
| given | `success-50` surface, `CheckCircleFill`, "Given · {time}" | none |

The `success` and `brand` tokens are already used by EXP-PET-004's confirmation and `Toast`. During implementation, check that the warning tokens exist in the theme. If they don't, use the nearest existing amber token, without adding new tokens.
- **Why not `RecordRow`'s action slot** (suggested during exploration): that slot is a link-tone text button under a record's lines. Using it on Medical would make A's surface look different from the B and C card, which breaks "same card everywhere". It would also echo EXP-PET-004's "Edit medication" in the same spot, which would push participants toward reading the action as an edit.

### 4. `give-dose` is a sheet screen with an origin atom

`doseOriginAtom: 'home' | 'ginger-notes' | 'ginger-info' | 'medical' | 'medication'` defaults to `medical`. A card's `onGive` (in each host screen):
1. records `medication_give_started { entry_point }`;
2. sets the origin to the current screen id;
3. calls `goToScreen('give-dose')`.

`GiveDoseScreen` renders the origin's view (the same view component its screen uses, without the toast), then `BottomSheet`. It derives `entry_point` from the origin:

| Origin | `entry_point` |
|---|---|
| `home` | `home` |
| `ginger-notes`, `ginger-info` | `pod` |
| `medical`, `medication` | `medical` |

On confirm, the screen:
1. records `medication_give_confirmed`;
2. calls `giveDoseAtom`;
3. sets `toastAtom` to `{ screen: origin }`;
4. calls `goToScreen(origin)`, as SC-PPL-001 and SC-PPL-002 do after their sheets;
5. calls `complete({ showCompletionView: false })`.

On Cancel or dismiss, it records `medication_give_cancelled` and calls `back()`.

Leaving the sheet by browser back is a cancellation too. The unmount cleanup records it, deferred by one task so that React's development-only unmount and remount of effects doesn't record a false one. A ref marks the sheet as settled after confirm or cancel, so neither is recorded twice.

If the dose is already given when the screen mounts (browser back or forward after confirming), the screen renders the origin view without the sheet and calls `back()` once, guarded by the same ref.
- `back()` rather than `goToScreen` skips the spent entry without pushing a new one. An earlier `goToScreen(origin)` guard trapped browser back between details and the sheet.

- **Why a screen and not local sheet state:** this is the established pattern. It also gives `screen_viewed` for `give-dose` for free, which separates "opened the sheet" from "confirmed" in page-view funnels.
- **Why `goToScreen(origin)` after confirm, not `back()`:** a direct link to `give-dose` has no flow history behind it, so `back()` would leave the flow.
- **Alternative considered:** a `dose-given` terminal screen, like `medication-updated`. Rejected because the participant has to stay where they acted (Home, pod or Medical) for the given state to show in place.

The toast belongs to the origin screen. Every view that can host it mounts `DoseToast` for its own screen id. Arriving on any other such view clears `toastAtom` in a layout effect, so the toast never follows the participant.
- **Alternative considered:** clearing it on unmount. That is unsafe because StrictMode's simulated unmount would clear it on arrival.
- The sheet's background view doesn't mount `DoseToast`.

The card's copy (`Due now`, `Given · {time}`, `Mark as given`, upcoming, overdue) lives under `pods.ginger.dose.*` with the card. The flow's own copy lives under `flows.expPet005.*`.

### 5. Baseline screens are copied thin, shared pieces reused

These go in `flows/exp-pet-005/`:
- `HomeScreen` (`GingerHomeView` plus the variant C slot);
- `ExpPet005TopBar`;
- `GingerNotesScreen` and `GingerInfoScreen`, each with the variant B band slot above its content;
- `MedicalView`, with the card above the "Medications" label and `MedicationRow` with no action;
- `MedicationDetailsView`, with the card above a `FormCard` of read-only `FieldRow`s from `toMedicationFieldRows`, with no `onEdit`.

All of these are copied from EXP-PET-004 and typed against `ExpPet005Events`. In EXP-PET-004 these screens are wrappers of 15–90 lines, so copying them costs little and keeps the flows independent.
- **`GingerHomeView` change:** an optional `beforePods?: ReactNode`, rendered above the "Pods" section. Without it the markup is unchanged, so EXP-PET-003 and EXP-PET-004 render identically. A browser check is part of the task.

### 6. Analytics map directly onto the spec

`ExpPet005Events` declares the spec's table. `entry_point` is derived in one function next to `doseOriginAtom`, so the start, confirm and cancel events can't disagree. There's no `medication_due_viewed`. Discovery is measured from `flow_started` to `medication_give_started`, with `screen_viewed` for the path.

### 7. Dose history: past courses, past doses and members

These records are added to the Ginger pod model, next to the medication.

**Medication courses:** `MedicationRecord` gains an optional `endDate` (ISO date). A finished course is a record with an end date. `medicationCoursesAtom: MedicationCourse[]`, where `MedicationCourse = { id: string; record: MedicationRecord }`, holds the past courses. The current medication stays in `medicationAtom`, so EXP-PET-002 to EXP-PET-004 are untouched. Its course id is the constant `CURRENT_MEDICATION_ID`.
- **Why not a list replacing `medicationAtom`:** every earlier flow reads the single record. A list would ripple through all of them for no gain in this experiment.

**Past doses:** `doseHistoryAtom: DoseEvent[]`. Each event is `{ id, medicationId, scheduledAt, status: 'given' | 'missed', givenAt?, givenBy? }`. `MedicationDose` (the current dose) gains `givenBy?`, and `giveDoseAtom` sets it to the participant.
- **Why:** the history is a projection, `toDoseHistory(current, past, filters)` in `pods/ginger/dose-history.ts`. It puts the given current dose first, then the past events filtered by period and medication, newest first. It also groups the result by local day.
- The current dose is never copied into the history atom, so it keeps one owner.

**Members:** `podMembersAtom: { id: string; name: string }[]` in the pod model, defaulting to the participant alone. The flow sets You and Sam, and `memberCount` comes from the list. A member id is shown as "You" when it equals `PARTICIPANT_ID`.

**Fixture generator:** `createDoseHistory(now)` in the flow model. Apoquel slots run every 12 hours back from `now`, down to the start date. The previous slot is given by Sam, about 2 minutes late. Later slots alternate between Sam and You through a fixed pattern, with every 23rd slot missed, and given minutes are offset deterministically. Past courses get slots at fixed local times (8:00 and 20:00, or 8:00) between their start and end dates. It's deterministic for a given `now`, so the variants are identical. Apoquel since 2026-09-14 plus the three courses come to several hundred events.

**Screen:** `dose-history` is a flow screen. `doseHistoryFilterAtom: { period: '7d' | '30d' | '1y' | 'all'; medicationId: 'all' | string }` holds the filters. Each entry point sets the filter before navigating. How many rows are shown is local `useState` (50, then +50), reset when a filter changes, so the long list never renders in full. The period uses `SegmentedTabs` and the medication uses `SelectField`, both from the kit.
- **Why "Show more" and not virtualisation or infinite scroll:** it's simple, accessible, and the analytics can see how deep people dig.

**Card:** `DueDoseCard` takes `onHistory` and reads the last given past event of its medication for "Last given …". The flow wires `onHistory` to set the filter and record `dose_history_opened { source: 'card' }`.

Analytics never carry medication names. `dose_history_filtered.medication` is `all`, `current` or `past`.

## Risks / Trade-offs

- **[C has a ceiling effect]** The task words "Ginger" and "Apoquel" are on Home's first screen, so C's discovery time is close to zero by construction. → Report C's discovery separately, and weight checking after confirmation (screens viewed after `medication_give_confirmed`) and cancel rate for C. The limitation is recorded in the proposal.
- **[One pet and one task]** Nothing here tests whether Home or the pod band scales with several pets or doses. → Plan a follow-up experiment with a richer fixture. Don't generalise C's result.
- **[The band competes with Notes]** The Notes textarea is `flex-1`. The band takes vertical space and could be skimmed as a banner. → Keep the band compact (one card, no extra copy). Moderator notes capture whether participants saw it.
- **[Real clock]** `givenAt` uses the device clock, so session recordings show different times. → No event carries the time, so analytics are unaffected.
- **[Window edge]** A session longer than 60 minutes would turn the dose overdue mid-run. → The sessions are much shorter. The window is one constant.
- **[Card is busier]** The card's "Last given" line and History link add information on every promoted surface. → They're identical on every surface and in every variant, so the comparison still isolates placement.
- **[`AGENTS.md` data limits]** That note says records have no end date and a pod holds one medication. → This change adds `endDate` and past courses, and updates that note.
- **[Copied screens drift]** EXP-PET-004 and EXP-PET-005 baseline screens can drift apart over time. → This is accepted by the "flows don't import each other" rule. The spec fixes the layout each one must keep.
