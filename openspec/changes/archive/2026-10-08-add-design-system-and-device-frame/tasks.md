## 1. Tooling and dependencies

- [x] 1.1 Ask the user to approve, then run in `apps/app-ux-flows`:
  - `pnpm add tailwindcss @tailwindcss/vite class-variance-authority clsx tailwind-merge lucide-react @fontsource-variable/public-sans`
  - Base UI is added by the shadcn CLI in 1.4.

  Verify the packages appear in `apps/app-ux-flows/package.json` and `pnpm --filter app-ux-flows build` still succeeds.
- [x] 1.2 Add `@tailwindcss/vite` to `vite.config.ts`. Create `src/app/styles.css` with `@import "tailwindcss";`. Import it and `@fontsource-variable/public-sans` from `src/main.tsx`. Verify that `pnpm --filter app-ux-flows dev` serves a page where a temporary `className="bg-red-500"` applies, then remove it.
- [x] 1.3 Run `pnpm lint` with the new CSS file present. If Biome 2.2.4 fails to parse Tailwind at-rules, stop and ask the user whether to bump Biome at the root or exclude the stylesheet (design, Risks). Verify `pnpm lint` passes.
- [x] 1.4 Create `apps/app-ux-flows/components.json` (Base UI style, `tsx: true`, css `src/app/styles.css`) with these aliases:
  - `components` → `@/shared/ui`
  - `ui` → `@/shared/ui/primitives`
  - `utils` → `@/shared/lib/cn`
  - `lib` → `@/shared/lib`

  Ask the user to approve, then run `pnpm dlx shadcn@latest init` in that folder. Verify:
  - `src/shared/lib/cn.ts` exists,
  - a Base UI package is in `package.json`,
  - `git diff` shows no unintended changes to `tsconfig.json` or `vite.config.ts`.

## 2. Theme tokens

- [x] 2.1 In `src/app/styles.css`, add the `@theme` primitives from Figma:
  - Clear Tailwind's default colours, then add the brand, gray, error, warning, success, orange and purple 50–950 scales, plus white and black. Fetch `brand-700` with `get_variable_defs` on a node that uses it.
  - Text sizes XS–7XL with their Figma line heights.
  - `--font-sans` set to Public Sans, and 0.5% (0.005em) tracking.
  - Radius 2px, 8px, 12px and 16px.

  Verify on a scratch element in dev that `bg-brand-500` renders `#4f868e` and `text-xl` renders 20px/30px. Remove the scratch element.
- [x] 2.2 Add the semantic roles in `:root` (`--background`, `--foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--destructive`, `--muted`, `--muted-foreground`, `--border`, `--input`, `--ring`, `--radius`) and the `@theme inline` mapping. Set the base styles: `body` uses `bg-background text-foreground font-sans text-base`. Verify in dev that the unstyled home page now renders in Public Sans, 16/24, colour `#1e293b`.

## 3. Shared components

- [x] 3.1 Read the Button symbols with `get_design_context` / `get_variable_defs`. Cover each size, plus the filled, outlined and link styles in every tone, in their default, hover, focus and disabled states, under `4:9462`. Add the shadcn `button` primitive. Rewrite `src/shared/ui/button.tsx` as a CVA wrapper with `size` (s/m/l/xxl → 30/36/44/56px), `variant` (filled/outlined/link) and `tone` (primary/secondary/tertiary/danger). Defaults are m/filled/primary and the existing props are kept. Verify:
  - `pnpm check-types` passes with no change in flow screens,
  - in dev, the add-medication form's Save button is a 36px button with the brand gradient with a 3px focus ring on Tab,
  - it does nothing while disabled.
- [x] 3.2 Read the Text Field default, hover, focus and disabled states from `4:10661`. Add the shadcn `input` and `label` primitives, and rewrite `text-field.tsx` (same props). Verify in dev on the medication form:
  - clicking the label focuses the input,
  - typing updates the value,
  - the focused state matches Figma.
- [x] 3.3 Read the Checkbox states from `4:10498`. Add the shadcn Base UI `checkbox` primitive, and rewrite `checkbox.tsx` (same props, `onChange(checked: boolean)`). Verify in dev:
  - "Give with food" toggles by clicking the box, by clicking the label, and with Space,
  - the checked state uses the Figma fill.
- [x] 3.4 Read the App Topbar `For=Regular Page` (`6463:3081`). Rewrite `header.tsx` without the status bar: a centred title, and a leading back control using a lucide chevron with `aria-label` `t('ui.header.back')`, shown only when `onBack` is given. Verify in dev:
  - the medication form shows the back chevron and it navigates back,
  - the home screen header has no back control.
- [x] 3.5 Restyle `PetCard`, `QuickAction` and `ProminentQuickAction` (remove the inline style, use the XXL Button styling), and restyle the medication list and `alternative-home-screen.tsx` markup where needed, using only tokens. Verify in dev that all three variants (`?variant=control|prominent-action|alternative-home`) render styled, and that `pnpm --filter app-ux-flows test` passes.
- [x] 3.6 Restyle `src/slices/flow/runtime/completion-view.tsx` with design-system Buttons: "Start again" as primary, "Back to all flows" as outlined. Verify in dev that finishing a flow shows the styled completion view, and both actions still work.

## 4. Device frame

- [x] 4.1 Export the Dynamic Island status bar's glyphs (signal, Wi-Fi, battery) and measurements from `5726:3310` with the Figma MCP. Create `src/slices/device-frame/status-bar.tsx`, with inline SVG using `currentColor`, the time "9:41", the Dynamic Island pill and `aria-hidden`. Create `home-indicator.tsx`, also `aria-hidden`. Verify both render in dev, and that Tab never focuses them.
- [x] 4.2 Create `src/slices/device-frame/device-frame.tsx`:
  - a bezel and a 393×852 screen with rounded corners,
  - a flex column of status bar, then a scroll area (`overflow-y-auto overscroll-contain`, keyed by a `screenKey` prop), then the home indicator,
  - the `max-[480px]:` fallback, which hides the bezel, status bar and home indicator and makes the screen `w-full h-dvh rounded-none`.

  Verify in dev:
  - at 1280×900 the screen area measures 393×852 in devtools,
  - at a 390px-wide viewport, no bezel or simulated bars appear.
- [x] 4.3 Add a `useFrameScale` hook in the device-frame slice. It computes `min(1, availableHeight / frameHeight, availableWidth / frameWidth)` from the window size, minus the chrome and margins, updates on resize, and is forced to 1 at 480px wide or less. Apply it as `transform: scale()`, with a wrapper sized to the scaled box. Verify in dev that at 1280×720 the whole device is visible without page scroll, keeps its proportions, and is never larger than full size on big windows.
- [x] 4.4 In `routes/flow.$screenId.tsx`, wrap `FlowRunner` in `DeviceFrame` with `screenKey={screenId}`, and render the outside chrome:
  - a "Back to all flows" link (`navigate({ to: '/' })`),
  - the flow title from `flow.titleKey`,
  - when `import.meta.env.DEV`, the active `flow.variantId`.

  Hide the chrome at 480px wide or less. Add new strings to `src/app/locales/en.ts`. Verify in dev:
  - the link returns to `/`,
  - the variant id shows in dev,
  - `pnpm --filter app-ux-flows build && pnpm --filter app-ux-flows preview` shows no variant id for `add-medication`.
- [x] 4.5 Verify scrolling and screen changes in dev:
  - temporarily add enough medications that the confirmation screen overflows, then confirm it scrolls inside the frame while the page doesn't scroll,
  - after scrolling down, navigating to another screen shows it from the top,
  - the completion view renders inside the frame.

## 5. Home page and root layout

- [x] 5.1 Change `routes/root.tsx` to render `<Outlet />` without the bare `<main>` wrapper. Give `home-page.tsx` and the flow route their own `<main>`. Verify that `pnpm check-types` passes and both pages still render.
- [x] 5.2 Restyle `src/slices/home/home-page.tsx` (props unchanged):
  - a page header with the title and "Start new test session" as an outlined Button,
  - a responsive grid of flow cards with the title, start or variant Buttons, and the dev-only assigned-variant label as muted text.

  Verify in dev:
  - starting a flow, picking a variant (temporarily set `add-medication` to `explicit` to check, then revert) and "Start new test session" all behave as before,
  - there's no device frame on `/`.

## 6. Final checks

- [x] 6.1 Run `pnpm lint`, `pnpm check-types`, `pnpm --filter app-ux-flows test` and `pnpm --filter app-ux-flows knip`. Fix every reported issue, adding a narrowly scoped knip `ignoreDependencies` entry only if `tailwindcss` is flagged because it is imported only from CSS. Verify all four commands exit successfully.
- [x] 6.2 Visual pass against Figma in dev:
  - compare the button, input, checkbox, header and status bar side by side with the Figma screenshots of their nodes,
  - walk through `add-medication` in all three variants at 1440×900, 1280×720 and 390×844,
  - confirm every scenario in `specs/app-ux-flows/design-system` and `specs/app-ux-flows/device-frame` holds.
