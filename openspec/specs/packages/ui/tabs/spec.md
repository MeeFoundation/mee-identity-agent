# packages/ui/tabs Specification

## Purpose

Defines the shared `Tabs` component of `@mee/ui`: a horizontal tab bar with one selected tab, whose selection is shown by an indicator that slides between tabs.

## Requirements

### Requirement: Tab items and selection
`Tabs` SHALL render a horizontal row of tabs, each with a label and an optional left icon and right icon, and SHALL show exactly one tab as selected. Selecting a tab SHALL report its key to the consumer, and the selected tab SHALL be controlled by the consumer.

#### Scenario: Tab renders label and icons
- **WHEN** a tab is given a label, a left icon and a right icon
- **THEN** the tab shows the left icon, the label and the right icon in that order, in a single row with an 8px gap

#### Scenario: Tab without icons
- **WHEN** a tab is given only a label
- **THEN** the tab shows the label alone with no empty space reserved for icons

#### Scenario: Pressing an unselected tab
- **WHEN** the user presses a tab that is not selected
- **THEN** the consumer is notified with that tab's key

#### Scenario: Pressing the selected tab
- **WHEN** the user presses the tab that is already selected
- **THEN** the selection does not change

### Requirement: Sizes
`Tabs` SHALL support size M (tab height 36px, horizontal padding 12px) and size L (tab height 44px, horizontal padding 16px), with size M as the default. Label text SHALL use Public Sans SemiBold at 16px with a 24px line height, and icons SHALL be 24px.

#### Scenario: Default size
- **WHEN** `Tabs` is rendered without a size
- **THEN** each tab is 36px high

#### Scenario: Large size
- **WHEN** `Tabs` is rendered with size L
- **THEN** each tab is 44px high with 16px horizontal padding

### Requirement: Container
`Tabs` SHALL render its tabs inside a container with a `alpha/dark/5` fill, a 1px `alpha/dark/10` border and a 1px gap between tabs. For size M the container SHALL have 4px padding and a 12px corner radius; for size L, 6px padding and a 14px corner radius. The container SHALL fit its tabs, up to the available width.

#### Scenario: Container height follows size
- **WHEN** `Tabs` is rendered with size M or size L
- **THEN** the container is 44px high (M) or 56px high (L)

#### Scenario: Container fits content
- **WHEN** `Tabs` has few tabs in a wide parent
- **THEN** the container is only as wide as its tabs

### Requirement: Visual states
Each tab SHALL show the visual state defined by the design: default with no fill or border; hover with a `surface/gray/light` fill; focus with a `surface/gray/soft` fill and a 2px `stroke/brand/strong` border; selected with a white surface, a 1px `alpha/dark/10` border and the `shadow-2` elevation. All states SHALL use a 10px corner radius.

#### Scenario: Unselected tab at rest
- **WHEN** a tab is not selected, not hovered and not focused
- **THEN** the tab has no fill and no border

#### Scenario: Hovered tab
- **WHEN** a pointer hovers over an unselected tab
- **THEN** the tab shows the hover fill

#### Scenario: Focused tab
- **WHEN** an unselected tab receives keyboard or accessibility focus
- **THEN** the tab shows the focus fill and the 2px focus border

#### Scenario: Selected tab
- **WHEN** a tab is selected
- **THEN** the selected surface, border and shadow are shown behind that tab's content

### Requirement: Animated selection indicator
The selected-state surface SHALL be a single indicator shared by all tabs. When the selection changes, the indicator SHALL move and resize from the previously selected tab to the newly selected tab with an animation, rather than disappearing from one tab and appearing on another. The indicator SHALL be placed without animation on first render, and SHALL follow its tab when tab widths change (for example after a label change).

#### Scenario: Selection changes
- **WHEN** the selected tab changes from the first tab to the third tab
- **THEN** the indicator slides to the third tab's position and takes its width

#### Scenario: Tabs of different widths
- **WHEN** the selection moves between tabs with different label lengths
- **THEN** the indicator's width animates to match the newly selected tab

#### Scenario: Initial render
- **WHEN** `Tabs` is first rendered with a selected tab
- **THEN** the indicator is already at that tab's position and does not animate in from another position

#### Scenario: Reduced motion
- **WHEN** the device has reduced motion enabled
- **THEN** the indicator moves to the new tab without an animated transition

### Requirement: Accessibility
Each tab SHALL be exposed to assistive technology with the tab role, its label as the accessible name and its selected state, and the tab row SHALL be exposed as a tab list.

#### Scenario: Screen reader announces a tab
- **WHEN** a screen reader focuses the selected tab
- **THEN** it announces the label and that the tab is selected

### Requirement: Full width
`Tabs` SHALL support a full-width mode in which the container fills the available width, the tabs share that width equally, and a label that does not fit is truncated to one line with an ellipsis. In this mode the row SHALL NOT scroll.

#### Scenario: Three tabs fill the container
- **WHEN** `Tabs` is rendered full width with three tabs
- **THEN** the container spans its parent's width and each tab takes one third of the inner width

#### Scenario: Long label is truncated
- **WHEN** a full-width tab's label is wider than its share
- **THEN** the label is cut to one line with an ellipsis and the tab keeps its width

### Requirement: Overflow
When the tabs do not fit the available width, the tab row SHALL scroll horizontally, and the selected tab SHALL be kept in view.

#### Scenario: Many tabs
- **WHEN** the combined tab widths exceed the container width
- **THEN** the row scrolls horizontally and no tab label is truncated or wrapped

#### Scenario: Selecting an off-screen tab
- **WHEN** the selection changes to a tab that is partly or fully outside the visible area
- **THEN** the row scrolls so that tab is fully visible
