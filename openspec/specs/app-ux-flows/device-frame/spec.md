# app-ux-flows/device-frame Specification

## Purpose

Presents flow screens inside an iPhone-like device frame, so participants experience a flow as a mobile app even when the session runs in a desktop browser.

## Requirements

### Requirement: Flow screens render inside a device frame
Every flow screen route SHALL render the flow inside a device frame drawn to look like a modern iPhone. This includes the flow's completion view. The frame's screen area SHALL have a logical size of 393×852 CSS pixels. It SHALL have rounded corners and a bezel. Routes other than flow screen routes, including the home page and the not-found page, SHALL NOT render a device frame.

#### Scenario: Flow screen in a desktop browser
- **WHEN** a participant opens `/flows/exp-pet-002/ginger-notes` in a desktop browser window at least 1280×900 CSS pixels in size
- **THEN** the flow's initial screen is shown inside a device frame whose screen area is 393×852 CSS pixels, centred in the page

#### Scenario: Completion view stays in the frame
- **WHEN** a participant completes a flow
- **THEN** the completion view is shown inside the same device frame

#### Scenario: Home page has no frame
- **WHEN** a participant opens `/`
- **THEN** no device frame is rendered

### Requirement: Device status bar and home indicator
The device frame SHALL show an iOS-style status bar at the top of its screen area, following the Mee Design System's mobile screen elements: a fixed time of 9:41, a Dynamic Island, and signal, Wi-Fi and battery indicators. It SHALL show a home indicator bar at the bottom of its screen area. These elements are decorative. They SHALL NOT be focusable or announced to assistive technology, and they SHALL NOT react to input.

#### Scenario: Status bar is visible
- **WHEN** any flow screen is shown inside the device frame
- **THEN** the status bar with the time 9:41 and the Dynamic Island is shown above the screen content, and the home indicator is shown below it

#### Scenario: Decorative elements are skipped by keyboard
- **WHEN** a participant tabs through a flow screen inside the frame
- **THEN** keyboard focus never lands on the status bar, the Dynamic Island or the home indicator

### Requirement: Screen content scrolls inside the frame
Flow screen content SHALL be laid out within the frame's screen area, between the status bar and the home indicator. When the content is taller than that area, it SHALL scroll inside the frame. The status bar, the home indicator and the frame SHALL stay in place, and the browser page itself SHALL NOT scroll because of flow content. Navigating to another screen SHALL show the new screen scrolled to its top.

#### Scenario: Long screen scrolls inside the device
- **WHEN** a flow screen's content is taller than the frame's screen area and the participant scrolls over it
- **THEN** the content scrolls inside the frame while the status bar, home indicator and frame stay fixed

#### Scenario: New screen starts at the top
- **WHEN** a participant scrolls down on one flow screen and then navigates to another screen
- **THEN** the new screen is shown from its top

### Requirement: Frame fits the browser window
When the browser window is too short or too narrow to show the whole frame at full size, the frame SHALL be scaled down uniformly, keeping its proportions, so that the whole device is visible without page scrolling. The frame SHALL NOT be scaled above its full size.

#### Scenario: Short laptop screen
- **WHEN** a flow screen is opened in a desktop browser window 1280 CSS pixels wide and 720 CSS pixels tall
- **THEN** the entire device frame, including its bezel, is visible without scrolling the page, with its 393:852 screen proportions kept

### Requirement: Full-screen fallback on phone-sized viewports
When the viewport is phone-sized, 480 CSS pixels wide or narrower, the device frame SHALL NOT be drawn. This covers a participant opening the app on a real phone. The bezel, simulated status bar, Dynamic Island and home indicator SHALL NOT be shown. The flow screen SHALL fill the viewport. The chrome outside the frame SHALL NOT be shown at this size.

#### Scenario: Opening a flow on a phone
- **WHEN** a participant opens `/flows/exp-pet-002/ginger-notes` in a viewport 390 CSS pixels wide
- **THEN** the flow screen fills the viewport with no bezel, simulated status bar or home indicator

### Requirement: Chrome outside the frame
Outside the frame, flow screen routes SHALL show:
- a "Back to all flows" control that navigates to the home page
- the flow's title

All of this text SHALL come from the app's translations. The chrome SHALL follow the variant visibility rules of the flow runtime. In development builds it MAY show the active variant id. In production builds it SHALL NOT show the variant of a flow that uses automatic assignment.

#### Scenario: Return to the flow list
- **WHEN** a participant on a flow screen activates "Back to all flows" outside the frame
- **THEN** the home page is shown

#### Scenario: Automatic variant hidden in production
- **WHEN** a production build shows a flow screen of a flow that uses automatic variant assignment
- **THEN** the chrome outside the frame shows the flow's title and no variant name or id

### Requirement: Overlays stay inside the device frame
Overlays that a flow screen opens SHALL be drawn inside the frame's screen area, between the status bar and the home indicator, and SHALL NOT cover the bezel or the page around the frame. This covers bottom sheets, their backdrops and option lists. On phone-sized viewports, where no frame is drawn, they SHALL cover the viewport.

#### Scenario: Bottom sheet in the frame
- **WHEN** a participant opens `/flows/exp-pet-002/add-form` in a desktop browser
- **THEN** the sheet and its backdrop are clipped to the device frame's screen area, and nothing is drawn over the bezel or the page around the frame

#### Scenario: Bottom sheet on a phone
- **WHEN** a participant opens `/flows/exp-pet-002/add-form` in a viewport 390 CSS pixels wide
- **THEN** the sheet rises from the bottom of the viewport and the backdrop covers the whole viewport
