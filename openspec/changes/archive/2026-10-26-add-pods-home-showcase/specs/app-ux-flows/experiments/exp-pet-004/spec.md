## MODIFIED Requirements

### Requirement: Home, Ginger tabs and Ginger Info
`home` SHALL be shown as in EXP-PET-003: the Home top bar defined by `app-ux-flows/design-system`, with the greeting "Welcome, Alice", the initial "A", the sharing line and the search field, then the "Recent Pods" section with one Ginger pod card, and the app tab bar with Home active. Activating the Ginger card SHALL show `ginger-notes`. Ask Telli, Notifications, Navigation and the search field SHALL be recorded and do nothing else.

`ginger-notes` and `ginger-info` SHALL show the Ginger pod top bar and tabs as in EXP-PET-003:
- back SHALL show `home`;
- Notes and Info SHALL switch tabs;
- Chat SHALL be recorded and do nothing else;
- the menu control SHALL be recorded and do nothing else;
- the breadcrumb SHALL do nothing.

`ginger-info` SHALL show the layout of EXP-PET-003 variant A in every variant: a "Forms" section with the Pet form row, a divider, then the category rows Medical (count 1, no preview line), Attachments 0, Subpods 0 and Members 1. Activating Medical SHALL show `medical`. The Pet row and the other category rows SHALL be recorded and do nothing else.

#### Scenario: Ginger opens on Notes
- **WHEN** a participant on `home` activates the Ginger card
- **THEN** `ginger-notes` is shown with the Notes tab selected, and `pod_opened` is recorded

#### Scenario: Same path in every variant
- **WHEN** participants in variants A, B and C each open Ginger from Home and select the Info tab
- **THEN** each sees the same `ginger-info`, with a Medical row that shows count 1 and no preview of the medication

#### Scenario: Menu is recorded
- **WHEN** a participant on `ginger-info` activates the menu control
- **THEN** the activation is recorded and `ginger-info` stays shown

#### Scenario: Notifications is inert
- **WHEN** a participant on `home` activates the Notifications tab
- **THEN** `app_tab_selected` is recorded with `tab` `notifications` and `home` stays shown

#### Scenario: Search is recorded
- **WHEN** a participant on `home` activates the search field
- **THEN** `search_selected` is recorded and `home` stays shown
