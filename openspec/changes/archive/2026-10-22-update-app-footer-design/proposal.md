## Why

The app-tellipod footer is a plain row of text labels. The Figma design (Mee - Tellipod App v4.0.3, node 13:1056) specifies a frosted, rounded-top bar with icon-over-label tabs, a filled active icon and a brand-colored active state. Tab switching should also feel responsive: the active color should transition smoothly instead of snapping.

## What Changes

- Restyle the footer surface per design: 80%-opaque white, white top/side border, 28pt top corner radius, upward soft shadow, 8pt side padding, and the home-indicator safe area below the tabs.
- Show each tab as a 24pt icon above a 10pt Medium label (Home, Telli Guide, Notifications, Navigation). Inactive: outline icon with slate label; active: filled icon with brand-colored label.
- Rename the second tab's visible label from "Ask Telli" to "Telli Guide" to match the design (route name unchanged).
- Restyle the Notifications unread indicator as the design's 8pt red dot with a 2pt white ring, placed at the top-right of the bell.
- Animate tab selection as a color transition: the active color (icon and label) fades in when a tab becomes active and fades back out when it becomes inactive. Icon and label do not scale or move. Honors the device's reduce-motion setting.
- Add the new icons (outline and filled variants for the four tabs) to the shared icon set, and update the footer's tests and stories.

## Capabilities

### New Capabilities

### Modified Capabilities
- `app-tellipod/app-shell`: the "Four-tab footer" requirement changes (label, icon-over-label presentation, active appearance); new requirements for the footer surface and the tab selection color transition; the unread indicator appearance is specified.

## Impact

- `apps/app-tellipod/src/widgets/app-footer/` (component, tests, stories)
- `apps/app-tellipod/src/shared/ui/` (new icons, tokens for brand text color and footer motion)
- `apps/app-tellipod/src/shared/i18n/en.ts` (`footer.ask-telli` label text)
- No new dependencies: the animation uses the already-installed `react-native-reanimated`, and the background blur is not implemented (see design, Decision 4).
