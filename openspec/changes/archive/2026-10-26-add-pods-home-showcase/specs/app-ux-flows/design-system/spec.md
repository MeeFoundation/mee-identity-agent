## ADDED Requirements

### Requirement: Pods section component
The design system SHALL provide a pods section for Home screens, following the pods section of app-tellipod (`app-tellipod/pods-section`). It SHALL take a state, the pods to show, and optional handlers for pressing a pod, "See all pods", "Add Pod", "Maybe later" and "Retry". It SHALL NOT fetch data or navigate. The state SHALL be one of `loading`, `ready` and `error`. A `ready` state with no pods is the first-run empty state.

With pods, in the `ready` state, the section SHALL show a header row above the pod cards. The header SHALL hold the label "Recent Pods" in uppercase at the left and, when a "See all pods" handler is supplied, a "See all pods" link with a trailing arrow at the right. The header and the cards SHALL be separated by 12 px, and the cards by 12 px. The section SHALL show at most the number of pods its limit allows, defaulting to 2.

Each pod card SHALL be one control on a white, rounded surface with the first-level shadow, showing from left to right:
- the pod's avatar image, or, when it has none, a gray circle with the first letter of the pod's name;
- the pod's name on one line, truncated when too long, with under it the pod's category breadcrumb: the category's icon and name, followed by the subcategory's name when the pod has one;
- a trailing chevron;
- a red unread dot on the card's top left corner, only when the pod has unread activity.

The card SHALL be announced as a button named with the pod's name, its category names and, when unread, "Unread". Pressing it SHALL call the pod handler with the pod.

In the `loading` state the section SHALL show the header and as many placeholder cards as its limit allows, each with a circular avatar block and two text blocks of different widths. The placeholders SHALL pulse, unless the participant's system asks for reduced motion, in which case they SHALL stay still. They SHALL be hidden from assistive technology and announced as a single busy region named "Loading pods".

In the `error` state the section SHALL show the header, the message "Couldn't load your pods." and a "Retry" button. Pressing "Retry" SHALL call the retry handler.

In the `ready` state with no pods the section SHALL show no header and no cards, and a "Create your first Pod" card instead. The card SHALL have a white rounded surface with the first-level shadow, and hold from top to bottom: a circular icon holder with a cookie icon; the title "Create your first Pod" above the explanation "A Pod is a private little room for any info — your kid, a trip, a project."; a full-width primary "Add Pod" button with a leading plus icon; and a full-width text button "Maybe later". When no "Add Pod" handler is supplied, the primary button SHALL NOT be shown. The icons SHALL be hidden from assistive technology.

Every string of the section SHALL come from the app's translations.

#### Scenario: Pods with a header
- **WHEN** a screen renders the section as `ready` with two pods and a "See all pods" handler
- **THEN** the header "RECENT PODS" and "See all pods" is shown above two pod cards

#### Scenario: No See all pods handler
- **WHEN** the section is rendered as `ready` with pods and no "See all pods" handler
- **THEN** the header shows "RECENT PODS" and no link

#### Scenario: Pod card contents
- **WHEN** the section shows the pod "Maya" in Pets, with an avatar image and unread activity
- **THEN** its card shows the avatar image, the name "Maya", the breadcrumb with the Pets icon and "Pets", a chevron and the unread dot

#### Scenario: Pod with a subcategory
- **WHEN** the section shows a pod in People with the subcategory Immediate family
- **THEN** its breadcrumb shows the People icon, "People" and "Immediate family"

#### Scenario: Pod without an avatar image
- **WHEN** the section shows the pod "About Sofia" with no avatar image
- **THEN** its card shows a gray circle with "A"

#### Scenario: Limit
- **WHEN** the section is given five pods and a limit of 2
- **THEN** two pod cards are shown

#### Scenario: Pod pressed
- **WHEN** a participant activates a pod card
- **THEN** the pod handler is called with that pod

#### Scenario: Loading
- **WHEN** the section is rendered as `loading` with a limit of 2
- **THEN** the header and two pulsing placeholder cards are shown, no pod, message or empty card is shown, and a screen reader hears one busy "Loading pods" region and none of the placeholders

#### Scenario: Loading with reduced motion
- **WHEN** the section is rendered as `loading` and the system asks for reduced motion
- **THEN** the placeholder cards are shown and do not pulse

#### Scenario: Error and retry
- **WHEN** the section is rendered as `error` and a participant activates "Retry"
- **THEN** the header, the message "Couldn't load your pods." and the "Retry" button are shown, and the retry handler is called

#### Scenario: First-run empty card
- **WHEN** the section is rendered as `ready` with no pods
- **THEN** no header and no pod card are shown, and the "Create your first Pod" card is shown with "Add Pod" and "Maybe later"

#### Scenario: Empty card without an Add Pod handler
- **WHEN** the empty card is shown and no "Add Pod" handler is supplied
- **THEN** the card shows the title, the explanation and "Maybe later", and no "Add Pod" button
