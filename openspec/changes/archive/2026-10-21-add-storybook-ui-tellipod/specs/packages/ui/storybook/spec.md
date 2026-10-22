## Purpose

Defines the story coverage expected of the shared `@mee/ui` package so its components can be reviewed in isolation.

## ADDED Requirements

### Requirement: Story per component
Every component exported from `@mee/ui` SHALL have a colocated story file that renders it.

#### Scenario: Existing component covered
- **WHEN** `@mee/ui` exports the `Button` component
- **THEN** a story file next to it renders `Button`

#### Scenario: Story files do not ship in the public API
- **WHEN** a consumer imports from `@mee/ui`
- **THEN** no story, Storybook or story-only dependency is part of the exports

### Requirement: Variant and state coverage
A component's stories SHALL cover each of its visual variants and sizes, and its disabled state where it has one.

#### Scenario: Button variants
- **WHEN** the user views the `Button` stories
- **THEN** the primary, secondary and danger variants and the sm, md and lg sizes can each be viewed, as can the disabled state
