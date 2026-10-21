## ADDED Requirements

### Requirement: Header transitions between variants
When the header variant changes because the user moved to another screen, the header SHALL transition rather than switch abruptly: the outgoing content SHALL fade out while the incoming content fades in, and the header surface SHALL animate its height to that of the incoming variant. The transition SHALL complete within 300 milliseconds. A change from `none` SHALL grow the header from no height, and a change to `none` SHALL shrink it to no height. When the device's reduce-motion setting is on, the header SHALL change variant without fade or height animation.

#### Scenario: Home to back-search
- **WHEN** the user moves from a screen declaring `home` to one declaring `back-search`
- **THEN** the home content fades out, the back-search content fades in, and the header height animates from one to the other with no instantaneous jump

#### Scenario: Header appears from none
- **WHEN** the user moves from a screen declaring `none` to one declaring `home`
- **THEN** the header grows from no height while its content fades in

#### Scenario: Header disappears
- **WHEN** the user moves from a screen declaring `pod` to one declaring `none`
- **THEN** the header content fades out and the header shrinks to no height

#### Scenario: Surface persists
- **WHEN** the variant changes between `home`, `back-search` and `pod`
- **THEN** the gradient, rounded corners, border and shadow stay in place and are not faded out and back in

#### Scenario: Same variant
- **WHEN** the user moves between two screens that declare the same variant
- **THEN** the header does not animate

#### Scenario: Content updates within a variant
- **WHEN** the content of the current variant changes without the variant changing, such as the selected pod tab or the greeting
- **THEN** the header does not fade or resize

#### Scenario: Under the safe area during transition
- **WHEN** a transition is in progress on a device with a top inset
- **THEN** no header control or text is displayed under that inset

#### Scenario: Outgoing content not interactive
- **WHEN** a transition is in progress
- **THEN** only the incoming content responds to presses

#### Scenario: Reduce motion
- **WHEN** the device's reduce-motion setting is on and the variant changes
- **THEN** the header shows the new variant at its final height with no fade or height animation
