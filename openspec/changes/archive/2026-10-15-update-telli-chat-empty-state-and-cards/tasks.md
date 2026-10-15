## 1. Translations and shared pieces

- [x] 1.1 In `apps/app-ux-flows/src/app/locales/en.ts`, add these keys under `ui`, and verify with `pnpm check-types`:
  - `chat.telliName` ("@Telli");
  - `chatActionCard.edit` ("Edit {{label}}");
  - `groupChat.empty.title` ("Be the first to write a message.");
  - `groupChat.empty.message` ("Everyone in this pod will see your messages.");
  - `groupChat.empty.hint` ("Tag @Telli if you need help.").
- [x] 1.2 Add `tone?: 'brand' | 'gray'` (default `'brand'`) to `shared/ui/count-badge.tsx`. The gray tone uses `bg-gray-50 border-gray-200 text-gray-700`. Verify that `category-row` and the `sc-ppl-003` members screen still render the brand badge unchanged.

## 2. Telli reply bubble

- [x] 2.1 Restyle Telli's side of `ChatMessage` in `shared/ui/chat-message.tsx` and verify `pnpm check-types` passes:
  - avatar: 32 px `rounded-full border border-brand-100 bg-brand-50`, with `icons/telli-assistant.svg` at 18 px, `aria-hidden`, bottom-aligned with `pb-1`;
  - column: `flex-1 min-w-0 items-start gap-2`.
- [x] 2.2 Rewrite `ChatAgentBubble` and verify it in the `sc-pet-001` Telli tab (`/flows/sc-pet-001/telli`):
  - make it a `<div>`, `rounded-[10px] border border-gray-950/7 bg-white px-3`;
  - padding is `py-1.5`, or `pt-1.5 pb-3` with attachments;
  - head it with `t('ui.chat.telliName')` in `text-xs font-semibold text-brand-500`;
  - put the text in a `<p className="text-base text-gray-800 break-words">`;
  - add an optional `attachments` slot (`flex flex-col gap-2 pt-1.5`). With attachments the bubble is `w-full`.

## 3. Chat action card

- [x] 3.1 Rebuild `shared/ui/chat-action-card.tsx` as the "Card-Cell-Details-Preview" layout from design.md:
  - `w-full rounded-2xl bg-white shadow-card overflow-clip`;
  - header with a 32 px `bg-gray-100` circle holding the icon (18 px) or letter;
  - rows: `px-3` wrapper, `border-t border-gray-100 py-3 pr-2`, label over a medium value;
  - status `<output>`;
  - optional action wrapper `px-2 pt-1 pb-2` with an `h-11 rounded-xl border-gray-300` button.

  Verify `pnpm check-types` passes.
- [x] 3.2 Extend the card's props:
  - `rows[].onEdit` renders a `Pencil` (16 px) button named `t('ui.chatActionCard.edit', { label })`;
  - `action` is optional;
  - `action.count` renders `<CountBadge tone="gray">` after the label.

  Verify `sc-pet-001`'s quick-action cards still show "Create pod" / "Open pod" / unavailable states correctly, and that a card without `action` renders no button.

## 4. Flows

- [x] 4.1 In `slices/flow/flows/sc-pet-001/components/telli-view.tsx`, pass `<QuickActionCard>` through `ChatAgentBubble`'s `attachments` instead of as a sibling. Verify with `pnpm --filter app-ux-flows test` (sc-pet-001 suite) and visually:
  - in case B the "Ginger" card sits inside Telli's bubble;
  - "Create pod" leads to `pod-created`.
- [x] 4.2 Check `chat-add-medication`'s chat (`/flows/chat-add-medication/chat`). Verify that Telli's reply uses the new bubble and the "Add medication" chip still sits under it and works.

## 5. Chat empty state

- [x] 5.1 Add an optional `empty?: ReactNode` to `ChatThread` in `shared/ui/chat-thread.tsx`. When it is set, keep the `role="log"` container and render `empty` centred (`flex-1 items-center justify-center`) instead of the bottom-anchored list. Verify `pnpm check-types` passes.
- [x] 5.2 Add `ChatEmptyState` to `shared/ui/group-chat.tsx` and export it from `group-chat-components.ts`. It is a centred `gap-4` column with:
  - `telli-assistant.svg` at 40 px, `aria-hidden`;
  - the title `<p>` in `text-lg text-gray-900`;
  - the message and hint on two lines in `text-sm text-gray-600`.

  Verify with `pnpm check-types`.
- [x] 5.3 In `slices/flow/flows/sc-pet-003/screens/chat-screen.tsx`, pass `empty={chat.length === 0 ? <ChatEmptyState /> : undefined}` to `ChatThread`. Verify:
  - `/flows/sc-pet-003/chat?case=a` shows the empty state above the composer;
  - sending "Hello" replaces it with the message;
  - case B still opens with Alice's message.
- [x] 5.4 Add a test in `sc-pet-003.test.ts` for the empty state. It should cover: case A's `chat` renders the empty-state title, and after sending a message it does not. Verify that `pnpm --filter app-ux-flows test` passes.

## 6. Quality checks

- [x] 6.1 From the repo root, run `pnpm check-types` and `pnpm lint` and fix every error.
- [x] 6.2 Compare the changed screens against Figma 117-4435 (empty chat) and 919-30381 (Telli reply with cards) in the browser. Note any remaining mismatches outside this change's scope (composer, group chat messages) without fixing them.
