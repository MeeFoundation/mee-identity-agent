## Context

EXP-PET-005 owns the Apoquel dose model: a current `MedicationDose`, past `DoseEvent`s and `toDoseStatus`, which already returns `overdue` more than 60 minutes after the scheduled time. Flows can't import each other, so the pieces SC-PET-002 needs were moved to `pods/ginger/` as part of the EXP-PET-005 change.

## Decisions

### 1. A showcase, not more EXP-PET-005 variants
Overdue and undo are dose states, not information-architecture alternatives. Adding them as variants would double the experiment's conditions. A showcase with cases keeps EXP-PET-005 an A/B/C comparison and gives reviewers a briefing, hints and open questions.

### 2. Times relative to the run's start
`doseTimes(doseStart, now)` returns the scheduled time (case A: three hours ago; case B: 15 minutes ago) and, for case B, the time given (10 minutes ago). The history is built back from the scheduled time with `createDoseHistory`, so "Last given … · Sam" stays 12 hours before the current dose in both cases.

### 3. Undo returns the dose to due and keeps its schedule
`undoDoseAtom` keeps `scheduledAt` and drops `givenAt` and `givenBy`. The status then follows `toDoseStatus`: due or overdue depending on how late it is. The history derives the current dose's entry from its status, so the undone dose disappears with no extra bookkeeping.

### 4. Undo asks for confirmation
"Undo" opens a sheet with a destructive "Mark as not given" and a "Keep as given". An immediate undo in the toast was considered; it is listed as an open question instead, because the toast is gone once the participant leaves the screen, and the mistake is often noticed later.

### 5. Completion
Both confirmations call `complete({ showCompletionView: false })`; the runtime completes a run once, so case A's later undo or case B's later give does not complete it again.
