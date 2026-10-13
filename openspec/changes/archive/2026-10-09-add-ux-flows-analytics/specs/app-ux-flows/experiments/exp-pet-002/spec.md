## ADDED Requirements

### Requirement: Experiment analytics events
EXP-PET-002 SHALL declare and record these interaction events. Both variants SHALL use the same event names wherever the participant's intent is the same:

| Event | Recorded when | Properties |
|---|---|---|
| `pod_tab_selected` | the participant selects a pod tab | `tab`: `notes`, `chat` or `info` |
| `medical_opened` | the participant opens the Medical category | none |
| `add_form_clicked` | the participant opens the Add form sheet | `entry_point`: `forms_section` or `medical_section` |
| `add_form_dismissed` | the participant dismisses the Add form sheet without saving | none |
| `medication_form_added` | the participant adds the Medication form | `method`: `add_form` or `ai_suggestion` |

The notes area SHALL NOT record any event that contains, or is derived from, the typed text. Opening `medication-added` directly by URL SHALL NOT record `medication_form_added`, because the participant did not perform the action.

#### Scenario: Manual path in variant A
- **WHEN** a participant in variant `a` opens Info, taps "Add form" and saves
- **THEN** `pod_tab_selected` (`tab: info`), `add_form_clicked` (`entry_point: forms_section`) and `medication_form_added` (`method: add_form`) are recorded, followed by the run's completion

#### Scenario: AI suggestion in variant B
- **WHEN** a participant in variant `b` taps the AI suggestion on Info
- **THEN** `medication_form_added` with `method: ai_suggestion` is recorded, with the same event name variant A uses

#### Scenario: Medical path
- **WHEN** a participant opens Medical and taps "Add medication"
- **THEN** `medical_opened`, then `add_form_clicked` with `entry_point: medical_section` are recorded

### Requirement: Experiment completion
Reaching `medication-added` SHALL complete the run silently. The `medication-added` screen stays visible with the added form, and no completion view is shown. This SHALL apply in both variants and when `medication-added` is opened directly by URL. The run's completion is then recorded exactly once.

#### Scenario: Saving completes the run
- **WHEN** a participant saves the Add form sheet, or accepts the AI suggestion
- **THEN** the `medication-added` screen is shown as before and the run is recorded as completed once

#### Scenario: Revisiting the result
- **WHEN** after completion the participant goes back and returns to `medication-added`
- **THEN** no second completion is recorded
