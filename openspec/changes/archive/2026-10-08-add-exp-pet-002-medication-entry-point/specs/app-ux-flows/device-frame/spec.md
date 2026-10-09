## ADDED Requirements

### Requirement: Overlays stay inside the device frame
Overlays that a flow screen opens SHALL be drawn inside the frame's screen area, between the status bar and the home indicator, and SHALL NOT cover the bezel or the page around the frame. This covers bottom sheets, their backdrops and option lists. On phone-sized viewports, where no frame is drawn, they SHALL cover the viewport.

#### Scenario: Bottom sheet in the frame
- **WHEN** a participant opens `/flows/exp-pet-002/add-form` in a desktop browser
- **THEN** the sheet and its backdrop are clipped to the device frame's screen area, and nothing is drawn over the bezel or the page around the frame

#### Scenario: Bottom sheet on a phone
- **WHEN** a participant opens `/flows/exp-pet-002/add-form` in a viewport 390 CSS pixels wide
- **THEN** the sheet rises from the bottom of the viewport and the backdrop covers the whole viewport

## MODIFIED Requirements

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

### Requirement: Full-screen fallback on phone-sized viewports
When the viewport is phone-sized, 480 CSS pixels wide or narrower, the device frame SHALL NOT be drawn. This covers a participant opening the app on a real phone. The bezel, simulated status bar, Dynamic Island and home indicator SHALL NOT be shown. The flow screen SHALL fill the viewport. The chrome outside the frame SHALL NOT be shown at this size.

#### Scenario: Opening a flow on a phone
- **WHEN** a participant opens `/flows/exp-pet-002/ginger-notes` in a viewport 390 CSS pixels wide
- **THEN** the flow screen fills the viewport with no bezel, simulated status bar or home indicator
