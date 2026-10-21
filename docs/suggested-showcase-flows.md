# Suggested next showcase flows

Sources: `pod-ontologies/example.md` (Alice Walker dataset) and `pod-ontologies/app-behavior.md` (app behavior spec).

## Already covered in `app-ux-flows`

| Area | Showcases |
|---|---|
| Onboarding | SC-ONB-001/002/003 (Rooms, Tap through, Living pod) |
| Pets (Ginger) | SC-PET-001 create pod + template, SC-PET-002 medication doses, SC-PET-003 care instructions, SC-PET-004 meals, EXP-PET-002…005 medication experiments, chat-add-medication |
| People (Sofia) | SC-PPL-001 tidy notes (Divide and Conquer, contact details only), SC-PPL-002 invite/revoke/remove, SC-PPL-003 shared-with-me (read-only member + chat) |

## Not yet covered: top 10 basic flows

Ranked by how central they are to the pod model in `app-behavior.md` and how much they change what a stakeholder understands about the product.

### 1. Receive a shared pod: auto-filing
*app-behavior: Auto-Filing on Receipt; Naming and Sharing (bare two-member exception)*
Paula accepts Alice's Ginger pod. The app builds the guessed parent chain (People > Others > Alice > Pets > Ginger), and a bare two-member pod is named from the sender's member graph ("Alice"). The user then drags it elsewhere.
Why first: every sharing flow ends here, and SC-PPL-003 only shows the pod after it has arrived.
Cases: three-plus members (name synced) vs bare two-member (name local); name collision gets silent `1` suffix.

### 2. Auto File: suggest a category for an uncategorized pod
*Organize > Auto File; Pod Contents > Category types*
A Custom pod (no category) gets a suggested category. One tap confirms and files it into the tree. Category is fixed after creation, so the flow also shows what is and isn't reversible.
Why: complements SC-PET-001, where the template is applied from inside the pod. This is the general, non-pet version.

### 3. Wikilinks in the note: pod links, block links and stub creation
*Pod Contents > Note; Wikilink-Triggered Pod Creation*
User types `[[Hilton]]` in a note, taps the unresolved link and a new Custom single-member pod appears with a blank note, bound by id. Variants: link to a pod the recipient lacks (shown as unresolved, fails closed), a block link to a form in the same pod.
Why: the main way a note turns into structure without a form.

### 4. Search by tag and by property
*Search*
Find "my Hilton number" without remembering which pod holds it. Search by user tag returns a flat list of pod links. Search by property (loyalty number) finds pods whose form carries that field. Hidden service tags never appear.
Why: the payoff of the whole data model, and nothing in the app shows it yet.

### 5. Add Tool: pick a form and fill it
*Adding Tools; UI Form Derivation*
Open any pod, tap Add Tool, choose a form type (default Contact Info), and fill a form whose fields, input types and dropdowns come from the shape. Show a cascading dropdown (RAV4: make filters model) and a closed `sh:in` list.
Example data: Vehicles > RAV4, Banking > Citibank account.
Why: SC-PPL-001 and SC-PET-001 produce forms indirectly; this is the direct, manual path (also for Sophia, who has no app instance).

### 6. Pod permissions: owner vs member vs service
*Permissions*
One pod seen by an owner, a member and an invited agent. Owner: remove member, promote/demote owner, delete pod for everyone. Member: add own attachment, edit note, leave. Show what is blocked and why (cannot delete another member's claim, services never become owners, a pod always keeps one owner). Surfaces open issue 1 (who can rename) and 2 (leave vs delete locally).
Why: SC-PPL-002/003 show only one owner action and one read-only view.

### 7. Attachments vs private files
*Pod Contents > Attachments, Private files*
Add a PDF as an attachment (shared, immutable, everyone gets it). Move one of your own to private (🔒 badge, syncs across your devices, never reaches others). Show that nobody can move someone else's attachment to private. Example: Boston Hub Society membership form shared, draft kept private.
Why: privacy semantics are the most likely thing to be misunderstood. Builds on the existing attachment components.

### 8. Invite an AI agent into a pod
*Inviting Services; Chat and Note Areas; Services and the Pod Interface*
Alice invites a travel agent into Kyoto Trip 2027. It joins as a regular member (counts toward member total, never owner), answers when @-mentioned, and edits its own graph in place over successive turns. A private 1:1 thread stays invisible to others, but committed results show in the pod.
Why: central to the product pitch. SC-PPL-003 only shows Telli answering questions, not an agent acting on the pod.

### 9. Credential issuance and presentation (browser extension wallet)
*Tools > Browser Extension; example.md: PRIVO over-18, Facenook*
Alice gets an over-18 credential from PRIVO and it lands as an unmodified attachment. Later she presents it to Facenook, which creates or finds a site pod by domain, classifies it by business type and receives a copy. Only her key can present it.
Why: the strongest differentiator for a wallet, and a short, easy-to-follow story.

### 10. Backup service: Arca joins a pod
*example.md: Service accounts, Arca; app-behavior: Pod Storage*
Alice joins Arca as a backup member of a chosen pod. Coverage is per pod and travels with the member list. Show where a pod lives (devices only, encrypted, never on The Mee Foundation) and the state of backup per pod. Note: app-behavior marks backup-service invitation as not yet specified, so this flow doubles as a way to get decisions.
Why: answers the first question stakeholders ask, "where is my data?".

## Considered and left out of the top 10

- **Contacts import/export (Apple Contacts):** valuable, but needs native-style permissions UI and hidden tag detail that read poorly in a prototype.
- **Divide and Conquer for non-contact data** (Paula's credit card into BankingPayments): extend SC-PPL-001 later instead of a new flow.
- **Note editor behaviors** (find/replace, undo, markdown export): behavior detail, not a story.
- **Trip/Hilton loyalty, Government documents, Vehicles, Homes:** good data for flows 4 and 5 rather than separate flows.

## Suggested order

1 → 5 → 3 → 4 first: they form one story (receive a pod, fill a form, link it from a note, find it again) using only local mocks. Then 6 and 7 for trust and privacy, then 8, 9, 10 for the services story.
