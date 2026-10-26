## Purpose

Defines the pod row of app-tellipod: a pressable card that presents one pod summary, as the building block of screens that list pods.

## ADDED Requirements

### Requirement: Row content
The pod card SHALL present a pod summary as a single row containing, from left to right: the pod's avatar, the pod name above the category breadcrumb, and a trailing chevron. The card SHALL have a white background, rounded corners of 16 points and the first-level shadow of the design system. It SHALL have 10 points of padding at the top, bottom and left, 16 points at the right, and 10 points between its parts. The name SHALL use Public Sans Medium 16 in `text/default/title` #0F172A.

#### Scenario: Pod with subcategory
- **WHEN** a pod named "About Sofia" in the People category and Immediate Family subcategory is rendered
- **THEN** the row shows the avatar, "About Sofia", a breadcrumb reading People then Immediate Family, and a trailing chevron

#### Scenario: Long name
- **WHEN** a pod name does not fit in the available width
- **THEN** it is shortened with an ellipsis on a single line and the trailing chevron stays visible

### Requirement: Avatar and row height
When the pod has an avatar URL the card SHALL show it as a 48-point circular photo. When the pod has no avatar URL the card SHALL show the first character of the pod name, uppercased, as a 40-point circular avatar with gray-toned initials. The row height SHALL follow the avatar, giving 68 points with a photo and 60 points with initials.

#### Scenario: Pod with a photo
- **WHEN** a pod with an avatar URL is rendered
- **THEN** a 48-point circular photo is shown and the row is 68 points high

#### Scenario: Pod without a photo
- **WHEN** a pod named "Maya" with no avatar URL is rendered
- **THEN** a 40-point circular avatar showing "M" is shown and the row is 60 points high

### Requirement: Category breadcrumb
The card SHALL show the pod's category as the first breadcrumb item and, when the pod has a subcategory, the subcategory as the second item. The category item SHALL carry the category's icon when the app has one for it; the subcategory item SHALL have no icon. Every item SHALL use the brand color, including the last. Labels SHALL be localized and resolved from the category identifiers. A category identifier with no localized label SHALL be shown as its raw identifier.

#### Scenario: Category with icon
- **WHEN** a pod in the People category is rendered
- **THEN** the first breadcrumb item shows the People icon and the localized label "People"

#### Scenario: Pet pod
- **WHEN** a pod in the Pets category with no subcategory is rendered
- **THEN** the breadcrumb shows a single item with the Hearts icon and the label "Pets", and no chevron

#### Scenario: Category without an icon
- **WHEN** a pod's category has no icon defined in the app
- **THEN** the breadcrumb shows the category label without an icon

### Requirement: Unread indicator
When the pod has unread content the card SHALL show a 12-point dot in `surface/error/solid` #B91C1C with a 2-point white border, positioned 10 points from the card's top and left edges so that it overlaps the avatar's top-left corner. When the pod has no unread content no dot SHALL be shown.

#### Scenario: Unread pod
- **WHEN** a pod with unread content is rendered
- **THEN** a red dot with a white border appears over the top-left corner of the avatar

#### Scenario: Read pod
- **WHEN** a pod with no unread content is rendered
- **THEN** no dot is shown

### Requirement: Pressing the card
The whole card SHALL be pressable and SHALL report the pressed pod to its owner. While the card is held down it SHALL change its background from white to `surface/gray/light` #F1F5F9, and SHALL return to white when the press ends or is cancelled. The card SHALL be exposed to assistive technology as a button labelled with the pod name and its category labels, and SHALL add a localized "unread" description when the pod has unread content.

#### Scenario: Press
- **WHEN** the user presses anywhere on the card
- **THEN** the owner is told which pod was pressed

#### Scenario: Pressed feedback
- **WHEN** the user touches the card and holds
- **THEN** the card background is #F1F5F9 until the touch is released, and then it is white again

#### Scenario: Accessibility label
- **WHEN** assistive technology reads the card for "About Sofia" in People and Immediate Family with unread content
- **THEN** it reads a button with the pod name, both category labels and the unread description
