## MODIFIED Requirements

### Requirement: Icon set
`@mee/ui` SHALL export the icons `PencilIcon`, `PlusIcon`, `FolderPlusIcon`, `PaperclipIcon`, `Diagram3Icon`, `PeopleIcon`, `PersonVideoIcon`, `ChevronDownIcon`, `ChevronRightIcon`, `SearchIcon`, `ExclamationCircleIcon`, `QuestionCircleIcon`, `InfoCircleIcon`, `CheckCircleIcon`, `ExclamationOctagonIcon`, `ExclamationTriangleIcon` and `XIcon`, each drawn to match the corresponding "icon / outline" glyph of the Mee design system. Each icon SHALL accept an optional `size` (in pixels, applied to both width and height) and an optional `color`.

#### Scenario: Default size and colour
- **WHEN** an icon is rendered without props
- **THEN** it is shown at its design size (pencil, chevron-down, chevron-right, search and question-circle, info-circle, check-circle, exclamation-octagon and exclamation-triangle 16px; x 20px; exclamation-circle 14px; plus and folder-plus 24px; paperclip, diagram-3, people and person-video 18px) in its design colour

#### Scenario: Custom size
- **WHEN** an icon is rendered with a `size` of 32
- **THEN** it is shown 32px wide and 32px high with its proportions unchanged

#### Scenario: Custom colour
- **WHEN** an icon is rendered with a `color`
- **THEN** every filled part of the glyph uses that colour

#### Scenario: Glyph matches the design
- **WHEN** an icon is compared with its design glyph at the same size
- **THEN** its shape, orientation and proportions match, for example the pencil points towards the top right with its tip at the bottom left
