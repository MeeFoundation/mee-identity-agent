## Why

Two gaps against Mee – Tellipod App v4.0.3:
- A pod chat with no messages shows a blank area above the composer. The design ("Cell - Chat - 2", 117-4435) has an empty state that invites the first message and mentions @Telli.
- Telli's interactive replies don't match "Pod / Chat - 5" (919-30381). In the design, the reply is one bubble with an "@Telli" name, and the form cards sit inside that bubble. The cards have a header row, label/value rows with an edit pencil, and an outlined button with a count badge. Today the card is a separate box under the bubble, with a brand-tinted square avatar and a fixed width.

## What Changes

- Add a chat empty state to the shared group chat components: a 40 px Telli chat icon, "Be the first to write a message." and "Everyone in this pod will see your messages. Tag @Telli if you need help.", centred in the content area above the composer.
- Show it in pod group chats while their thread has no messages. Today that is `sc-pet-003` cases A and D (the owner's chat starts empty). It disappears once the first message is sent.
- Restyle the Telli reply in the shared Telli chat components (`ChatMessage` for Telli, `ChatAgentBubble`) after "Pod / Chat - 5":
  - a 32 px round brand-soft avatar with the Telli chat icon, aligned to the bottom of the message;
  - a white bubble with a 10 px radius and a hairline border, headed by "@Telli" in small semibold brand text, with 16 px body text;
  - an optional attachment area inside the bubble, below the text, where cards stack with 8 px gaps. A bubble with attachments fills the row.
- Restyle `ChatActionCard` to the design's "Card-Cell-Details-Preview":
  - a white card with a 16 px radius and the card shadow, filling the bubble's width;
  - a header row with a 32 px round gray holder (icon or letter) and the title;
  - rows separated by hairlines, with a small muted label over a medium value, and an optional edit pencil per row;
  - an optional full-width outlined button that can carry a count badge.

  The status line keeps its role and moves above the button.
- `sc-pet-001`'s Telli tab places its quick-action cards inside Telli's reply bubble. Its behaviour (which card acts, "Create pod" / "Open pod", unavailable actions) is unchanged.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `app-ux-flows/design-system`: The Chat components requirement changes how Telli's message looks and adds the attachment area inside the bubble. The Chat action card requirement gets the new layout, optional row edit, optional action and count badge. A new requirement covers the chat empty state.
- `app-ux-flows/showcases/sc-pet-003`: In cases A and D, the owner's empty chat shows the empty state until the first message.

`app-ux-flows/showcases/sc-pet-001` already requires quick actions "inside the Telli reply that carries it". The new bubble layout delivers that, so the showcase spec needs no change.

## Impact

- `apps/app-ux-flows/src/shared/ui/`: `chat-message.tsx`, `chat-action-card.tsx`, `group-chat.tsx` (new `ChatEmptyState`), `group-chat-components.ts`, reusing `icons/telli-assistant.svg` and `count-badge.tsx`.
- `apps/app-ux-flows/src/slices/flow/flows/sc-pet-003/screens/chat-screen.tsx`: renders the empty state.
- `apps/app-ux-flows/src/slices/flow/flows/sc-pet-001/components/telli-view.tsx`: passes the quick-action card as the bubble's attachment.
- `apps/app-ux-flows/src/slices/flow/flows/chat-add-medication/`: picks up the restyled Telli bubble. Its suggestion chip stays under the bubble.
- `apps/app-ux-flows/src/app/locales/en.ts`: new strings for the empty state and the "@Telli" label.
- No new dependencies. The group chat message (`GroupChatMessage`) in `sc-pet-003` and `sc-ppl-003` is not restyled.
