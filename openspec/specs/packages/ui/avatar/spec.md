# packages/ui/avatar Specification

## Purpose

Defines the shared `Avatar` component of `@mee/ui`: a round or rounded-square identity picture showing either an image or initials, in the sizes and tones defined by the Mee design system.

## Requirements

### Requirement: Content
`Avatar` SHALL show either an image or initials. Image content SHALL fill the avatar and be clipped to its shape. Initials content SHALL show the provided text, centered, on a filled background. `Avatar` SHALL NOT derive initials itself; the caller provides them.

#### Scenario: Image content
- **WHEN** an avatar is rendered with an image source
- **THEN** the image fills the avatar and is clipped to the avatar's shape

#### Scenario: Initials content
- **WHEN** an avatar is rendered with the initials "JD"
- **THEN** "JD" is shown centered on a filled background

### Requirement: Sizes
`Avatar` SHALL support the sizes XL (64), L (48), M (40), S (32), XS (24) and XXS (16), measured in points as width and height, with M as the default. Initials SHALL scale with the size following the design system. At size M, initials SHALL use Public Sans Bold 16 with a 24 line height and 0.08 letter spacing.

#### Scenario: Size L
- **WHEN** an avatar is rendered at size L
- **THEN** it is 48 points wide and 48 points high

#### Scenario: Default size
- **WHEN** an avatar is rendered without a size
- **THEN** it is 40 points wide and 40 points high

### Requirement: Shape
`Avatar` SHALL support a circle shape and a rounded-square shape, with the circle as the default. The shape SHALL apply to both image and initials content.

#### Scenario: Circle
- **WHEN** an avatar is rendered with the circle shape
- **THEN** its image or background is fully round

#### Scenario: Rounded square
- **WHEN** an avatar is rendered with the rounded-square shape
- **THEN** its image or background has rounded corners and is not fully round

### Requirement: Initials tone
Initials content SHALL support a `brand` tone and a `gray` tone, with `brand` as the default. The `brand` tone SHALL use the `surface/brand/light` #DFECEE background and the `surface/brand/main` #4F868E text. The `gray` tone SHALL use the `surface/gray/light` #F1F5F9 background and the `text/default/placeholder` #64748B text.

#### Scenario: Brand tone
- **WHEN** initials are rendered without a tone
- **THEN** the background is #DFECEE and the text is #4F868E

#### Scenario: Gray tone
- **WHEN** initials are rendered with the gray tone
- **THEN** the background is #F1F5F9 and the text is #64748B

### Requirement: Accessibility
An avatar SHALL be hidden from assistive technology unless the caller provides an accessibility label, in which case it SHALL be exposed with that label.

#### Scenario: Decorative avatar
- **WHEN** an avatar is rendered without an accessibility label
- **THEN** it is not exposed to assistive technology

#### Scenario: Labelled avatar
- **WHEN** an avatar is rendered with the accessibility label "Sofia"
- **THEN** assistive technology can read it as "Sofia"
