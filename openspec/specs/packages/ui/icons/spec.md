# packages/ui/icons Specification

## Purpose

Defines the shared icon set of `@mee/ui`: outline icons from the Mee design system, drawn as vector graphics so they stay sharp at any size and can take any colour.

## Requirements

### Requirement: Icon set
`@mee/ui` SHALL export the icons `PencilIcon`, `PlusIcon`, `FolderPlusIcon`, `PaperclipIcon`, `Diagram3Icon`, `PeopleIcon`, `PersonVideoIcon`, `ChevronDownIcon` and `ChevronRightIcon`, each drawn to match the corresponding "icon / outline" glyph of the Mee design system. Each icon SHALL accept an optional `size` (in pixels, applied to both width and height) and an optional `color`.

#### Scenario: Default size and colour
- **WHEN** an icon is rendered without props
- **THEN** it is shown at its design size (pencil, chevron-down and chevron-right 16px; plus and folder-plus 24px; paperclip, diagram-3, people and person-video 18px) in its design colour

#### Scenario: Custom size
- **WHEN** an icon is rendered with a `size` of 32
- **THEN** it is shown 32px wide and 32px high with its proportions unchanged

#### Scenario: Custom colour
- **WHEN** an icon is rendered with a `color`
- **THEN** every filled part of the glyph uses that colour

#### Scenario: Glyph matches the design
- **WHEN** an icon is compared with its design glyph at the same size
- **THEN** its shape, orientation and proportions match, for example the pencil points towards the top right with its tip at the bottom left

### Requirement: Icons in slots
An icon SHALL be usable as a `CellInfo` leading or trailing icon, a `Card` or `Panel` footer action icon, and a header trailing icon, without wrapper styling beyond the consumer's own layout.

#### Scenario: Footer icon
- **WHEN** a footer action is given `PlusIcon` as its icon
- **THEN** the icon is shown before the label at 24px

#### Scenario: Trailing icon of a row
- **WHEN** a `CellInfo` is given `PencilIcon` as its trailing content
- **THEN** the pencil is shown at the right end of the row at 16px
