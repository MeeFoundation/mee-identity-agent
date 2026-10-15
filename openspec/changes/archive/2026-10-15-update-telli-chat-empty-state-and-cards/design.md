## Context

`app-ux-flows` has two chat kits in `src/shared/ui/`:
- **Telli chat kit** (`chat-components.ts`): `ChatMessage`, `ChatAgentBubble`, `ChatActionCard`, `ChatSuggestionChip`, `ChatComposer`, `ChatThread`, etc. `sc-pet-001`'s Telli tab uses it, and so does `chat-add-medication`.
  - A Telli message renders `ChatMessage author="agent"` as a 28 px `telli-avatar.svg` (top-aligned) next to a column.
  - In that column, `ChatAgentBubble` (a `<p>`, `rounded-2xl`, 15 px text) and any card or chip are siblings.
  - `ChatActionCard` is a fixed `w-67.5` box with a brand-tinted square avatar and a mandatory action.
- **Group chat kit** (`group-chat-components.ts`): `GroupChatMessage`, `ChatNotice`, `GroupChatComposer`, plus the shared `ChatThread` and `ChatTypingIndicator`. `sc-pet-003` and `sc-ppl-003` use it. `sc-pet-003` cases A and D seed an empty `chatAtom`. Today `ChatThread` then renders an empty `role="log"`, so the area above the composer is blank.

Design sources (Mee – Tellipod App v4.0.3, file `cd6NZmMxZHC7qTOk0SXYVW`):
- empty state: "Cell - Chat - 2" `117:4435`;
- Telli reply with cards: "Pod / Chat - 5" `919:30381`. Telli message group: `919:30516`. Card: "Card-Cell-Details-Preview".

Values read from `get_design_context`, mapped to existing tokens in `app/styles.css`:

| Element | Design | Tailwind / token |
|---|---|---|
| Telli avatar | 32 px circle, surface brand/soft `#f3f8f8`, stroke brand/soft `#dfecee`, 18 px chat-ai-lock icon, bottom-aligned, 4 px bottom padding | `size-8 rounded-full border border-brand-100 bg-brand-50`, `icons/telli-assistant.svg` at 18 |
| Telli bubble | white, 1 px `rgba(2,6,23,.07)`, radius 10, `px-3`, `pt-1.5`, `pb-3` with attachments / `py-1.5` without | `rounded-[10px] border border-gray-950/7 bg-white` |
| "@Telli" | 12/16 semibold, text brand/main `#4f868e` | `text-xs font-semibold text-brand-500` |
| Bubble text | 16/24 regular, `#1e293b` | `text-base text-gray-800` |
| Attachment slot | `pt-1.5`, cards gap 8 | `flex flex-col gap-2 pt-1.5` |
| Card | white, radius 16, shadow "1st level" | `rounded-2xl bg-white shadow-card overflow-clip` (the `--shadow-card` value is identical) |
| Card header | `pl-2 pr-4 py-2 gap-2`. 32 px circle surface gray/light `#f1f5f9`, 18 px icon. Title 16/24 medium `#0f172a` | `bg-gray-100`, `text-gray-900 font-medium` |
| Card row | wrapper `px-3`. Row `border-t` stroke gray/soft `#f1f5f9`, `py-3 pr-2 gap-3`. Label 12/16 `#475569` (−2 px gap). Value 16/24 medium `#1e293b`. 16 px pencil | `border-gray-100`, `text-xs text-gray-600`, `text-base font-medium text-gray-800`, `Pencil` from `react-bootstrap-icons` |
| Card action | wrapper `px-2 pt-1 pb-2`. Button h-44, radius 12, 1 px stroke gray/accent `#cbd5e1`, label 16 semibold `#334155`. Badge 20 px, surface gray/soft, stroke gray/light, 12 semibold `#334155` | `h-11 rounded-xl border-gray-300 text-gray-700 font-semibold` |
| Empty state | centred column, gap 16. Icon 40 px chat-ai-lock. Title 18/28 regular `#0f172a`. Message 14/20 `#475569`, two lines | `text-lg text-gray-900`, `text-sm text-gray-600` |

`icons/telli-assistant.svg` is the same `icon / custom / outline / chat-ai-lock` vector (brand fill `#4F868E`) that the design uses for both the Telli avatar and the empty state, so no new asset is downloaded.

## Goals / Non-Goals

**Goals:**
- Match the two frames with the existing tokens and components, keeping the component contracts flows already use: `ChatMessage`, `ChatAgentBubble` and `ChatActionCard` stay; only optional props are added.
- Keep the empty state and the log in one accessible structure, so the first message is announced.

**Non-Goals:**
- Restyling `GroupChatMessage` (sc-pet-003 / sc-ppl-003), `ChatComposer` or `GroupChatComposer`. The composer in 117-4435 is a multi-line textarea; that is a separate change.
- New flow content using "Contact info" / "Medical" preview cards. The kit supports them (editable rows, optional action, count), but no showcase sends them yet.
- Inline links inside the Telli bubble text. Flows already pass `Trans` children, so a flow can add them later.

## Decisions

### 1. Empty state shown by `ChatThread` through an `empty` prop
`ChatThread` gets an optional `empty?: ReactNode`. When present, the `role="log"` container stays mounted and shows `empty` centred (`flex-1 items-center justify-center`) instead of the bottom-anchored list. A new `ChatEmptyState` (in `group-chat.tsx`, exported from `groupChatComponents`) renders the icon and the two texts from `ui.groupChat.empty.*`. `sc-pet-003`'s chat screen passes `empty={chat.length === 0 ? <ChatEmptyState /> : undefined}`.

- *Alternative: render `ChatEmptyState` instead of `ChatThread`.* Rejected: the log would mount together with the first message, and screen readers often don't announce content that arrives in a newly mounted live region.
- *Alternative: make `ChatThread` detect empty children.* Rejected: children include conditional `false` nodes (e.g. the typing indicator), so `Children.count` is unreliable. An explicit prop also leaves the decision with the flow, as the spec requires.

### 2. Attachments go inside `ChatAgentBubble`
`ChatAgentBubble` becomes a `<div>` (cards contain headings and buttons, which can't sit in a `<p>`). It has the "@Telli" name (`ui.chat.telliName`), the text in a `<p>`, and an optional `attachments?: ReactNode` rendered below in a `flex flex-col gap-2 pt-1.5` slot. With attachments the bubble is `w-full`. Without them it hugs its content up to the row width.

`ChatMessage author="agent"` switches to the 32 px brand-soft avatar with `items-end`, and its column becomes `flex-1 min-w-0`. Extra children (e.g. `ChatSuggestionChip` in `chat-add-medication`) still stack under the bubble.

- *Alternative: a new `TelliReply` component.* Rejected: it duplicates the bubble, and two flows would need migrating for no behavioural gain.

### 3. `ChatActionCard` contract widened, not replaced
New props:
- `rows[].onEdit?: () => void` renders a 16 px `Pencil` button labelled `t('ui.chatActionCard.edit', { label })`;
- `action` becomes optional;
- `action.count?: number` renders a badge after the label.

The fixed `w-67.5` becomes `w-full`, since the bubble sets the width. The header circle holds either `icon` (18 px) or `avatarLetter` (`text-sm font-medium text-gray-700`), so the existing `QuickActionCard` (letter or `Grid` icon) keeps working. `status` stays as an `<output>` line, now inside the card above the action with `px-3`. The card keeps `aria-label={title}` on its `<section>` and an `<h3>` title.

### 4. Count badge: add a gray tone to `CountBadge`
The design badge is gray (`bg-gray-50 border-gray-200 text-gray-700`, `px-0.5` around a `px-1` label). The existing `CountBadge` is brand-tinted and used by `category-row` and `sc-ppl-003` members. Add `tone?: 'brand' | 'gray'` (default `'brand'`) rather than a second badge component, so existing call sites don't change.

### 5. `sc-pet-001` quick actions move into the bubble
`telli-view.tsx` passes `<QuickActionCard …/>` as `attachments` of the reply's `ChatAgentBubble` instead of as a sibling. `QuickActionCard`'s logic is unchanged. The `sc-pet-001` test stubs `ChatActionCard` by its `action.onAction`, which stays valid.

## Risks / Trade-offs

- [Restyled Telli bubble also changes `chat-add-medication` and `sc-pet-001` text size (15 → 16 px) and avatar] → Intended: the spec's chat components follow 919-30381. Check both flows visually after the change.
- [`ChatAgentBubble` changes from `<p>` to `<div>`] → No flow styles or queries depend on the element. Text keeps its own `<p>`.
- [Bubble without attachments hugging its content vs. the design's full-width "Something else…" bubble] → The design only shows full-width bubbles with short trailing timestamps, which the 1:1 kit doesn't have. Hugging keeps short replies compact. Revisit if design review asks for full width.
- [`ChatThread` `empty` prop is unused by the Telli kit] → Harmless: it is optional, and the Telli tab always starts with Telli's greeting.
