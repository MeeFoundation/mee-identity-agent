## MODIFIED Requirements

### Requirement: Styled home page
The home page SHALL use the design system:
- a page header with the app title
- one section per flow kind that has flows, "Showcases" first and "Experiments" second, each with a section heading that shows its flow count
- inside each section, one dense list row per registered flow, separated by dividers within one bordered surface rather than drawn as separate cards
- in each row: the flow's display code in development builds, its title, its description when declared, shortened to a single line, and its start, variant-choice or case-choice actions as small design-system Buttons laid out side by side
- in development builds, the flow's catalogue inside its row, collapsed until opened
- the "Start new test session" action as a design-system Button

At widths where the actions do not fit beside the title, they SHALL wrap below it inside the same row, without horizontal scrolling. The full description SHALL be available on demand when it is shortened.

The home page SHALL NOT be drawn inside the device frame. It SHALL keep the variant visibility rules of the flow runtime: variant choice only for explicit flows, and variant information and the catalogue only in development builds.

#### Scenario: Home page shows flow cards
- **WHEN** a participant opens the home page
- **THEN** each registered flow appears as a row in its kind's section, with its title, a one-line description and its start actions, styled with the design system, and the page is not wrapped in a device frame

#### Scenario: Rows stay compact
- **WHEN** a development build shows a flow with three variants and a catalogue
- **THEN** its row, with the catalogue collapsed, is no taller than two lines of text plus the actions, and the variant descriptions are not shown until requested

#### Scenario: Narrow screens
- **WHEN** the home page is shown 375 pixels wide
- **THEN** each row's actions wrap below its title and the page does not scroll horizontally

#### Scenario: Automatic flow card hides variant information
- **WHEN** a production build shows the home page and a flow uses automatic variant assignment
- **THEN** that flow's row shows a single start action and no variant names, assignment or catalogue

### Requirement: Segmented tabs component
The shared segmented tabs SHALL show two or more equal-width tabs in a rounded track, with the selected tab raised on a white surface. Exactly one tab SHALL be selected, as decided by the flow. Activating a tab SHALL report that tab to the flow. The tabs SHALL be operable with the keyboard, and SHALL expose the tab role and selected state to assistive technology.

The flow SHALL be able to mark any tab with a dot, meaning something is waiting on that tab. The dot SHALL be drawn beside the tab's label in the primary action colour and SHALL be announced to assistive technology as part of the tab's name. A tab without a mark SHALL look as it does today.

#### Scenario: Activating a tab
- **WHEN** a participant activates a tab that is not selected
- **THEN** the flow is told which tab was activated

#### Scenario: Keyboard navigation
- **WHEN** a tab has keyboard focus and the participant presses the right arrow key
- **THEN** focus moves to the next tab

#### Scenario: Marked tab
- **WHEN** the flow marks the Info tab
- **THEN** a dot is shown beside "Info", assistive technology announces that something new is waiting there, and the other tabs are unchanged
