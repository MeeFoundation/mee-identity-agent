# Tellipod product specifications

Product-first specifications for the Tellipod **mobile app**, written before implementation. The app asks a **node** to store
pods and share changes with other members, and shows what the node reports.
Only what the app offers, shows and does is specified here.

## Layout

| Path | Contents | Format |
|---|---|---|
| `context/` | Product description, glossary, open questions | Plain markdown |
| `mobile/<capability>/spec.md` | What the mobile app does and what the person sees | OpenSpec: SHALL + Given/When/Then |

## Current state

- Written: `context/*`; `mobile/pods`, `mobile/members`, `mobile/received-pods`, `mobile/pod-categories`, `mobile/pod-organization`, `mobile/pod-tags-and-discovery`, `mobile/claims-and-forms`, `mobile/pod-chat`, `mobile/pod-attachments`, `mobile/credential-wallet`, `mobile/pod-note`, `mobile/contacts-integration`.
- Not yet specified: what the sources leave open, in [`context/open-questions.md`](context/open-questions.md).

## Rules

- Every requirement uses SHALL and has at least one `#### Scenario:` with GIVEN/WHEN/THEN.
- `mobile/` states what the app does: asking the node, offering, showing, handling denials.
- A capability is a reusable rule set. A UX scenario is not a capability.
- No tasks, no framework, screen layout, library or component names. Technology choices stay out of these specs.
- Anything the sources do not settle goes to `context/open-questions.md` with an owner, never guessed.
- Sources: https://github.com/MeeFoundation/pod-ontologies (README, app-behavior, storage, example, other-ontologies), the Mee roadmap and the Figma chat screens (agent replies, message state and the Divide and Conquer preview come from these, not from the repository).
  `integrity.md`, `core-files.md` and `pod-databook.md` describe repository scaffolding and are not product scope.

## From product spec to implementation

1. A product change adds or updates requirements here. It produces no tasks.
2. An implementation change in the mobile app's own spec tree (`specs/<app>/<domain>`, name decided when the app is created) lists `Implements: tellipod/mobile/<capability> - <Requirement>` in its proposal and owns the tasks.
3. Until the node exists, the app is built against a mock of what it asks of the node.
4. A gap found while implementing returns as a new product change, not as an edit to the implementation spec.
