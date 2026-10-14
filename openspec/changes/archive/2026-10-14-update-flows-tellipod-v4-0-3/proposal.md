## Why

Mee – Tellipod App v4.0.3 changes four things the prototype already shows: the bottom nav gains a Notifications tab, members can now see and act on info other members added about them, the New Pod sheet takes a profile image, and creating a pod ends on a "created" sheet with an invite link. The flows in `app-ux-flows` still show the older design. Reviewers and test participants would be looking at screens the team has moved on from.

## What Changes

- **App tab bar: four tabs.** Home, Ask Telli, Notifications and Navigation, after Figma 905-15153. Notifications carries a red badge dot and does nothing in every flow. This applies to every screen that shows the bar: SC-PET-001 and EXP-PET-003, EXP-PET-004 and EXP-PET-005.
  - **BREAKING (analytics):** in EXP-PET-003/004/005, `app_tab_selected.tab` gains the value `notifications`. Runs before and after this change see a different bar.
- **SC-PPL-002: case D "Info others added about me"**, with Bogdan, Geo (Mum) and Andrew (Uncle) as members, and Geo having added an email and a phone number about Bogdan:
  - new screen `my-info` (Figma 38-2883): "INFO SHARED IN THIS POD", which is Bogdan's own fields, read-only for now, and "INFO ABOUT YOU — ADDED BY OTHERS", grouped by the person who added it;
  - new sheet `suggestion-actions` (Figma 119-9506): "Copy value", "Add to info I share" and "This isn't right, remove it";
  - new sheet `adopt-conflict` (no Figma frame): when Bogdan already shares that field, "Replace" or "Keep both" for multi-value fields (email, phone), only "Replace" for single-value fields, plus "Cancel";
  - every action on a suggestion shows a toast without "Undo"; the actions can't be undone.
- **SC-PPL-002: member list redesign** (Figma 760-18097), in every case: each person's line shows the Role they share ("Dad", "Mum"), falling back to "Can view", and Bogdan's own row opens `my-info`.
- **SC-PPL-002 identity** is aligned with the Figma frames the code already declares, since the spec still lists the older ones.
- **SC-PET-001: profile image on New Pod** (Figma 905-15244). An optional image picker; the chosen image becomes the pod's avatar.
- **SC-PET-001: new screen `pod-created`** (Figma 1435-44400). It is shown after every pod creation, from the sheet or from a Telli quick action, with the pod's invite link, a copy control and "Go to <pod>".

Out of scope:
- the redesigned Home header (avatar, "Welcome, Bogdan", the privacy line, search);
- a Notifications screen or any notification data;
- editing Bogdan's own info (the pencils and "+ Add personal info" are shown but inert);
- SC-PPL-003 (Geo's read-only view);
- making the Telli entry in the member list match Figma, which omits it. SC-PPL-002 keeps Telli listed.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `app-ux-flows/design-system`: the app tab bar has four tabs, including Notifications with a badge dot.
- `app-ux-flows/showcases/sc-pet-001`: the profile image on New Pod, the `pod-created` screen after every creation, and the inert Notifications tab on `home` and `telli`.
- `app-ux-flows/showcases/sc-ppl-002`: case D, `my-info`, `suggestion-actions`, `adopt-conflict`, the Role line in the member list, Bogdan's row opening `my-info`, toasts on `my-info`, and Figma frames aligned with the code.
- `app-ux-flows/experiments/exp-pet-003`: Notifications is recorded and does nothing else; `app_tab_selected.tab` adds `notifications`.
- `app-ux-flows/experiments/exp-pet-004`: same as EXP-PET-003.
- `app-ux-flows/experiments/exp-pet-005`: same as EXP-PET-003.

## Impact

- `apps/app-ux-flows/src/shared/ui/app-tab-bar.tsx`: a fourth tab with a badge dot.
- `apps/app-ux-flows/src/slices/flow/pods/ginger/components/ginger-home-view.tsx` and the `*Events` types in `flows/exp-pet-003|004|005/model.ts`.
- `apps/app-ux-flows/src/slices/flow/pods/people/`: a member-info model (shared fields and suggestions about a member), and the invite-link field and clipboard helper moved here from `flows/sc-ppl-002/components/` so SC-PET-001 can reuse them.
- `apps/app-ux-flows/src/slices/flow/flows/sc-ppl-002/**`: case D, three new screens, the member list change, and the toast cases.
- `apps/app-ux-flows/src/slices/flow/flows/sc-pet-001/**`: image state and picker, the `pod-created` screen, avatar source, and the creation paths.
- `apps/app-ux-flows/src/slices/flow/pods/catalog/create-pod.ts`: `PodInstance` can carry an image.
- `apps/app-ux-flows/src/app/locales/en.ts`: new strings.
- Tests for SC-PET-001, SC-PPL-002, EXP-PET-003/004/005 and the tab bar.
