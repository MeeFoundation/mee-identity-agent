## Purpose

Defines the shared `Badge` component of `@mee/ui`: a small status label, counter or indicator dot in the types, styles, sizes and shapes defined by the Mee design system.

## ADDED Requirements

### Requirement: Types and styles
`Badge` SHALL support the types `primary`, `secondary`, `success`, `danger` and `warning`, and the styles `solid`, `light` and `outlined`, with `primary` and `solid` as the defaults. Every type SHALL be available in every style, size and shape. Colors SHALL follow the design tokens below.

| Type | Solid fill and border | Light fill | Light and outlined border | Text on light and outlined |
|---|---|---|---|---|
| primary | `surface/brand/solid` #3B5B63 | `surface/brand/soft` #F3F8F8 | `stroke/brand/light` #C3DCDE | `text/brand/solid` #3B5B63 |
| secondary | `surface/gray/solid` #334155 | `surface/gray/soft` #F8FAFC | `stroke/gray/light` #E2E8F0 | `text/gray/solid` #334155 |
| success | `surface/success/solid` #3F5932 | `surface/success/soft` #F2F7EE | `stroke/success/light` #C8DBBB | `text/success/solid` #3F5932 |
| danger | `surface/error/solid` #B91C1C | `surface/error/soft` #FEF2F2 | `stroke/error/light` #FECACA | `text/error/solid` #B91C1C |
| warning | `surface/warning/solid` #AE4F0F | `surface/warning/soft` #FEFAEC | `stroke/warning/light` #F9DF89 | `text/warning/solid` #AE4F0F |

#### Scenario: Solid style
- **WHEN** a `primary` badge is rendered in the `solid` style
- **THEN** it has a #3B5B63 fill, a 1px border of the same color and white text

#### Scenario: Light style
- **WHEN** a `danger` badge is rendered in the `light` style
- **THEN** it has a #FEF2F2 fill, a 1px #FECACA border and #B91C1C text

#### Scenario: Outlined style
- **WHEN** a `success` badge is rendered in the `outlined` style
- **THEN** it has no fill, a 1px #C8DBBB border and #3F5932 text

#### Scenario: Defaults
- **WHEN** a badge is rendered without a type or style
- **THEN** it is a `primary` `solid` badge

### Requirement: Sizes
`Badge` SHALL support the sizes `xxs`, `xs`, `s` and `m`, with `m` as the default. Each size SHALL set the badge height, the horizontal padding, the label type style and the size of the dot and icon slots as follows. Label text SHALL use Public Sans SemiBold with a line height equal to its font size, so that the text is visually centered in the badge, and the content SHALL be vertically centered within the fixed height without being clipped, including the 1px border at every size.

| Size | Height | Horizontal padding | Label | Slot size | Rounded radius |
|---|---|---|---|---|---|
| `xxs` | 16px | 4px | 10px | 10px | 4px |
| `xs` | 20px | 4px | 12px | 12px | 4px |
| `s` | 24px | 6px | 14px | 14px | 4px |
| `m` | 28px | 8px | 16px | 16px | 6px |

The label SHALL also carry the same horizontal padding as the badge on each side, so that the space between a slot and the label text equals the size's horizontal padding.

#### Scenario: Medium badge
- **WHEN** a badge is rendered at size `m` with a label
- **THEN** it is 28px high with 8px horizontal padding, and the label is 16px SemiBold

#### Scenario: Extra small badge
- **WHEN** a badge is rendered at size `xxs`
- **THEN** it is 16px high and the label is 10px SemiBold

#### Scenario: Text is not clipped
- **WHEN** a badge is rendered at size `xxs`
- **THEN** the full label, including descenders, is visible inside the 16px height

#### Scenario: Default size
- **WHEN** a badge is rendered without a size
- **THEN** it is size `m`

### Requirement: Shapes
`Badge` SHALL support the shapes `rounded`, `pill`, `circle` and `dot`, with `rounded` as the default. `rounded` SHALL use the size's corner radius, `pill` and `circle` SHALL be fully rounded, and `dot` SHALL be a fully rounded filled disc with no content.

A `circle` badge SHALL show a short value, SHALL be at least as wide as it is high, and SHALL grow in width when the value is longer. A `dot` badge SHALL be a square of 4px at `xxs`, 8px at `xs`, 12px at `s` and 16px at `m`, with the border and fill of its type and style.

#### Scenario: Pill shape
- **WHEN** a badge is rendered with the shape `pill`
- **THEN** its ends are fully rounded and it is otherwise the same as a `rounded` badge of the same size

#### Scenario: Circle with a short value
- **WHEN** a `circle` badge at size `m` is rendered with the value "9"
- **THEN** it is a 28px high fully rounded badge at least 28px wide

#### Scenario: Circle with a longer value
- **WHEN** a `circle` badge at size `m` is rendered with the value "99+"
- **THEN** it is wider than it is high and its ends remain fully rounded

#### Scenario: Dot
- **WHEN** a `dot` badge at size `xs` is rendered
- **THEN** it is an 8px by 8px fully rounded disc with no text

### Requirement: Content slots
`Badge` SHALL render its label from the consumer's content. For the `rounded` and `pill` shapes it SHALL also accept an optional leading dot, an optional leading icon and an optional trailing icon, shown in the order leading dot, leading icon, label, trailing icon in a single row. The leading and trailing icons SHALL be consumer-provided content and `Badge` SHALL NOT bundle icons. A slot that is not provided SHALL NOT reserve space.

#### Scenario: All slots provided
- **WHEN** a badge is given a leading dot, a leading icon, a label and a trailing icon
- **THEN** they are shown left to right in that order, vertically centered

#### Scenario: Label only
- **WHEN** a badge is given only a label
- **THEN** only the label is shown and no space is reserved for icons or the dot

#### Scenario: No placeholder text
- **WHEN** a consumer passes a label
- **THEN** exactly that text is shown and no default text such as "Label" appears

### Requirement: Truncation
Badge text SHALL be shown on a single line and SHALL NOT wrap. When the badge is given less width than its content needs, the label SHALL be truncated with an ellipsis and the dot and icon slots SHALL keep their size.

#### Scenario: Long label in a narrow container
- **WHEN** a badge with a long label is placed in a container narrower than the badge
- **THEN** the label is cut off with an ellipsis on one line and the icons stay visible

### Requirement: Static display
`Badge` SHALL size itself to its content instead of stretching to the width of its container, SHALL be a display-only component and SHALL NOT respond to presses or announce itself as interactive. It SHALL accept a style from the consumer for layout, such as margins, and SHALL apply it to the badge container.

#### Scenario: Not pressable
- **WHEN** a badge is rendered
- **THEN** it is not exposed as a button and has no pressed state

#### Scenario: Consumer layout style
- **WHEN** a consumer passes a margin style
- **THEN** the badge is positioned with that margin and its own size and colors are unchanged

### Requirement: Accessibility
A badge with text SHALL expose that text to assistive technology as normal text. A `dot` badge has no text, so it SHALL be hidden from assistive technology unless the consumer provides an accessibility label, in which case it SHALL expose that label.

#### Scenario: Labeled badge
- **WHEN** a screen reader focuses a badge with the label "New"
- **THEN** it reads "New"

#### Scenario: Count badge
- **WHEN** a screen reader focuses a `circle` badge with the value "9+"
- **THEN** it reads "9+"

#### Scenario: Dot without a label
- **WHEN** a `dot` badge is rendered without an accessibility label
- **THEN** it is not exposed to assistive technology

#### Scenario: Dot with a label
- **WHEN** a `dot` badge is rendered with the accessibility label "Unread"
- **THEN** a screen reader reads "Unread"

### Requirement: Public API
`@mee/ui` SHALL export `Badge` and its prop types from its entry point.

#### Scenario: Import from the package
- **WHEN** a consumer imports `Badge` from `@mee/ui`
- **THEN** the import resolves to the shared component

### Requirement: Stories
`Badge` SHALL have a colocated story file that shows every type, every style, every size and every shape, a badge with all content slots, a count badge, a dot badge and a long label.

#### Scenario: All variants viewable
- **WHEN** the user opens the `Badge` stories
- **THEN** each type, style, size and shape can be viewed, as can a badge with leading dot and both icons, a count badge, a dot badge and a long-label badge
