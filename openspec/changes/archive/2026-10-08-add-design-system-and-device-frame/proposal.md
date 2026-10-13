## Why

`app-ux-flows` is used to show UX flows to test participants, but it has no styling at all. Screens render as unstyled browser HTML on a desktop-sized page, so participants judge raw markup instead of something that looks like the Mee mobile app. The Mee Design System v5.2.2 in Figma already defines the colours, typography, spacing and components, and an iPhone-shaped frame around flow screens would make a session feel like using the real app.

## What Changes

- Add a design-system foundation to `app-ux-flows`. It uses Tailwind CSS v4 and the shadcn component approach on Base UI primitives. Its theme tokens come from the Figma file (`MX0vkzAw7MfoG7ZMQUmfhu`):
  - Colours: the brand, gray, error, warning, success, orange and purple scales from 50 to 950, plus white and black. These are mapped onto shadcn's semantic names (`background`, `foreground`, `primary`, `destructive`, `border`, `ring`, …).
  - Typography: Public Sans, the XS to 7XL size and line-height pairs, and 0.5% letter-spacing.
  - Spacing on the 4px scale, plus radius tokens and the 3px focus ring.
- Rebuild the shared flow components in `src/shared/ui` from the Figma components: `Button` (sizes S/M/L/XXL, styles filled/outlined/link, tones primary/secondary/tertiary/danger), `TextField`, `Checkbox`, and `Header` (built from the mobile "App Topbar / Regular Page"). The props that flows already use stay compatible, so flow screens do not change.
- Style the `add-medication` example flow's own components (`PetCard`, `QuickAction`, `ProminentQuickAction`) and `CompletionView` with the same tokens. Figma has no card or list-row design, so these are composed from the tokens.
- Add a **device frame** shown only on flow routes (`/flows/$flowId/$screenId`). The frame looks like an iPhone at a 393×852 logical size. It has a bezel, the Figma iOS status bar with a Dynamic Island, and a home indicator. The flow screen, including the completion view, renders inside it and scrolls inside it. Outside the frame there is a "Back to all flows" link and the flow title. On narrow viewports, such as a real phone, the frame is not drawn and the screen fills the viewport.
- Restyle the home page (`/`) as a normal web page using the design system, with a page header and one card per flow. The card keeps today's behaviour: variant choice for explicit flows, a single start action for automatic flows, assigned variant shown only in dev builds, and the "Start new test session" action. Assumption: no new home-page content (thumbnails, screen counts, descriptions) is added in this change.
- New dependencies in `app-ux-flows` only: Tailwind v4 with its Vite plugin, Base UI, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react` (icons), and a self-hosted Public Sans font package.

Out of scope: dark mode, new home-page content, changes to flow behaviour or navigation, a Figma runtime dependency or Code Connect mappings, and sharing these components with the React Native `@mee/ui` package.

## Capabilities

### New Capabilities
- `app-ux-flows/design-system`: theme tokens taken from the Mee Design System, the shared UI components and their visual states, and the rule that all app UI (home page, frame chrome, flow components) uses them.
- `app-ux-flows/device-frame`: flow routes render inside an iPhone-like frame with a status bar and home indicator, the screen scrolls inside the frame, chrome outside the frame leads back to the flow list, and the frame falls back to full screen on narrow viewports.

### Modified Capabilities
<!-- None: flow runtime, variant and home-page behaviour requirements are unchanged; only their presentation changes. -->

## Impact

- Code (all in `apps/app-ux-flows`):
  - `vite.config.ts` (Tailwind plugin), `index.html`, new global stylesheet with the theme tokens in `src/app/`, and `components.json` for the shadcn CLI.
  - `src/shared/ui/*`: rebuilt `Button`, `TextField`, `Checkbox`, `Header`, new shadcn primitives, and a `cn` helper in `src/shared/lib`.
  - New device-frame slice with the frame, status bar and home indicator. Changes to `routes/flow.$screenId.tsx` to wrap `FlowRunner` in it.
  - `slices/home/home-page.tsx`, the `add-medication` components and `runtime/completion-view.tsx` are restyled.
  - `src/app/locales/en.ts`: new strings for the frame chrome.
- Dependencies: the new packages above in `apps/app-ux-flows/package.json`. Installing them needs `pnpm install`, which the user runs or approves.
- Tooling: Biome must accept the Tailwind v4 CSS at-rules. Knip must recognise the new dependencies as used.
- No changes to other apps, `@mee/core` or `@mee/ui`.
