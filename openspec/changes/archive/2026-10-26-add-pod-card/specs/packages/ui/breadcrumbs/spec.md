## Purpose

Defines the shared `Breadcrumbs` component of `@mee/ui`: a single-line trail of labels separated by chevrons, showing where an item sits in a hierarchy, in the Simple style and small size defined by the Mee design system.

## ADDED Requirements

### Requirement: Items and delimiters
`Breadcrumbs` SHALL render an ordered list of items on a single line, each with a label and an optional leading icon supplied by the caller. A 10-point chevron SHALL separate consecutive items. There SHALL be no chevron after the last item. An empty list SHALL render nothing.

#### Scenario: Two items
- **WHEN** breadcrumbs are rendered with the labels "People" and "Immediate Family"
- **THEN** the labels appear in that order with one chevron between them and none after "Immediate Family"

#### Scenario: Single item
- **WHEN** breadcrumbs are rendered with one item
- **THEN** the label is shown with no chevron

#### Scenario: No items
- **WHEN** breadcrumbs are rendered with no items
- **THEN** nothing is rendered

### Requirement: Item appearance
Each item SHALL be 16 points high, with 2 points of horizontal padding and 4 points between its icon, label and chevron. Labels SHALL use Public Sans Regular 12 with a 16 line height and 0.06 letter spacing. A leading icon SHALL occupy a 14-point slot. Items SHALL use the `text/brand/solid` #3B5B63 color by default, and an item marked as current SHALL use the `text/gray/solid` #334155 color.

#### Scenario: Default item color
- **WHEN** an item is rendered without being marked current
- **THEN** its label is #3B5B63

#### Scenario: Current item
- **WHEN** the last item is marked current
- **THEN** its label is #334155

#### Scenario: Leading icon
- **WHEN** an item is given an icon
- **THEN** the icon appears before the label in a 14-point slot

### Requirement: Truncation
Labels SHALL stay on one line. When the trail is wider than the space available, labels SHALL truncate with an ellipsis instead of wrapping, and the chevrons and icons SHALL remain visible.

#### Scenario: Narrow container
- **WHEN** the labels do not fit in the available width
- **THEN** they are shortened with an ellipsis and the trail stays on one line

### Requirement: Accessibility
Breadcrumbs SHALL be readable by assistive technology as the item labels in order. Chevron delimiters SHALL be hidden from assistive technology.

#### Scenario: Reading order
- **WHEN** assistive technology reads breadcrumbs with the items "People" and "Immediate Family"
- **THEN** it reads "People" then "Immediate Family" and does not announce the chevron
