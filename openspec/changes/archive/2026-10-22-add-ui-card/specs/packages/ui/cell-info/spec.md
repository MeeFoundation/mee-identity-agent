## ADDED Requirements

### Requirement: Accessibility state
A pressable `CellInfo` SHALL accept an accessibility state from the consumer (for example `expanded`, `selected` or `disabled`) and SHALL expose it to assistive technology together with its button role and accessible name. A static `CellInfo` SHALL NOT expose an accessibility state.

#### Scenario: Expanded state on a pressable row
- **WHEN** a pressable `mini-group` row is rendered with the accessibility state `expanded` set to true
- **THEN** assistive technology reports the row as a button that is expanded

#### Scenario: State changes with the consumer
- **WHEN** the consumer re-renders the pressable row with `expanded` set to false
- **THEN** assistive technology reports the row as collapsed

#### Scenario: No accessibility state
- **WHEN** a pressable row is rendered without an accessibility state
- **THEN** the row's role and accessible name are unchanged and no state is reported

#### Scenario: Static row ignores state
- **WHEN** a row without a press handler is rendered with an accessibility state
- **THEN** the row is static and does not report that state
