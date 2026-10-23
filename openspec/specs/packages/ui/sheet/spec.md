# packages/ui/sheet Specification

## Purpose

Defines the shared `Sheet` component of `@mee/ui`: a modal bottom sheet with a grabber, a title block and a content slot, which the user can dismiss in several ways, used for edit dialogs such as "Edit form info".

## Requirements

### Requirement: Layout
`Sheet` SHALL present a white surface anchored to the bottom edge of the screen with rounded top corners, showing in order: a grabber (while dismissible), a title, an optional description, and the content passed as children. The title and description SHALL be left-aligned with 16px side padding. `Sheet` SHALL NOT draw the device home indicator, and SHALL keep its content above the bottom safe-area inset.

#### Scenario: Title, description and content
- **WHEN** `Sheet` is visible with a title, a description and children
- **THEN** the grabber, the title, the description and the children are shown top to bottom

#### Scenario: No description
- **WHEN** `Sheet` is visible with a title and no description
- **THEN** no description row is shown and no empty space is reserved for it

#### Scenario: Bottom safe area
- **WHEN** `Sheet` is visible on a device with a bottom safe-area inset
- **THEN** the last child is not covered by the home indicator area

### Requirement: Content slot
`Sheet` SHALL render its children as the content below the header without styling, wrapping or interpreting them. When the content is taller than the space available, `Sheet` SHALL keep the header in place and let the content scroll.

#### Scenario: Arbitrary content
- **WHEN** `Sheet` is given a form made of fields and a button as children
- **THEN** the fields and the button are shown unchanged below the header

#### Scenario: Content taller than the screen
- **WHEN** the children are taller than the available height
- **THEN** the sheet does not grow past the screen and the content can be scrolled

### Requirement: Controlled visibility
`Sheet` SHALL be shown while `visible` is `true` and hidden while it is `false`, animating in and out. `Sheet` SHALL call `onDismiss` when the user asks to close it and SHALL NOT keep itself open or closed against `visible`: the consumer decides by changing `visible`.

#### Scenario: Opening
- **WHEN** `visible` changes from `false` to `true`
- **THEN** the sheet slides up over the current screen and its content is shown

#### Scenario: Closing by the consumer
- **WHEN** `visible` changes from `true` to `false`
- **THEN** the sheet slides down and its content is no longer shown

#### Scenario: Presented over the screen chrome
- **WHEN** the sheet is visible
- **THEN** it is shown above the screen content and any footer or header of the app

### Requirement: Dismissal
By default `Sheet` SHALL ask to close, by calling `onDismiss` once, when the user drags it down past its dismissal threshold, taps the backdrop outside it, or presses the Android back button. A drag released before the threshold SHALL return the sheet to its open position without calling `onDismiss`.

#### Scenario: Drag down to dismiss
- **WHEN** the user drags the sheet down past the dismissal threshold and releases it
- **THEN** `onDismiss` is called once

#### Scenario: Short drag
- **WHEN** the user drags the sheet down a short distance and releases it
- **THEN** the sheet returns to its open position and `onDismiss` is not called

#### Scenario: Backdrop tap
- **WHEN** the user taps the dimmed area outside the sheet
- **THEN** `onDismiss` is called once

#### Scenario: Android back button
- **WHEN** the sheet is visible on Android and the user presses the back button
- **THEN** `onDismiss` is called once and the screen behind the sheet does not navigate back

### Requirement: Protected dismissal
`Sheet` SHALL accept `dismissible`, which is `true` by default. While `dismissible` is `false`, dragging the sheet down and tapping the backdrop SHALL NOT dismiss it and SHALL NOT call `onDismiss`, and the sheet SHALL stay open. While `dismissible` is `false`, `Sheet` SHALL NOT show the grabber bar and SHALL NOT offer the grabber's dismiss action, because neither a drag nor a bare dismiss is available; the header SHALL keep the same height so the title does not move. The Android back button SHALL still call `onDismiss` so the consumer can decide, for example by asking for confirmation.

#### Scenario: Drag while protected
- **WHEN** `dismissible` is `false` and the user drags the sheet down past the threshold
- **THEN** the sheet returns to its open position and `onDismiss` is not called

#### Scenario: Backdrop tap while protected
- **WHEN** `dismissible` is `false` and the user taps the backdrop
- **THEN** the sheet stays open and `onDismiss` is not called

#### Scenario: Back button while protected
- **WHEN** `dismissible` is `false` and the user presses the Android back button
- **THEN** `onDismiss` is called and the sheet stays open until the consumer sets `visible` to `false`

#### Scenario: No grabber while protected
- **WHEN** `Sheet` is visible with `dismissible` set to `false`
- **THEN** no grabber bar is shown, no "Dismiss" button is exposed to assistive technology, and the title is at the same position as when `dismissible` is `true`

### Requirement: Keyboard
While a text field inside `Sheet` is focused and the keyboard is shown, `Sheet` SHALL move up so the focused field is not covered, and SHALL return to its position when the keyboard is hidden.

#### Scenario: Focusing a field
- **WHEN** the user focuses a text field near the bottom of the sheet
- **THEN** the sheet moves up and the field is visible above the keyboard

#### Scenario: Hiding the keyboard
- **WHEN** the keyboard is dismissed
- **THEN** the sheet returns to its previous position

### Requirement: Accessibility
While `dismissible` is `true`, the grabber SHALL be exposed as a button named "Dismiss" and activating it SHALL call `onDismiss`, so the sheet can be closed without a gesture. While the sheet is visible, the content behind it SHALL NOT be reachable by assistive technology.

#### Scenario: Screen reader dismiss
- **WHEN** a screen-reader user activates the grabber
- **THEN** `onDismiss` is called

#### Scenario: Content behind the sheet
- **WHEN** the sheet is visible and a screen reader moves through the screen
- **THEN** only the sheet's content is reachable
