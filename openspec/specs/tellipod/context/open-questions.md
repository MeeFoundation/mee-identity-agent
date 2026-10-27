# Open questions

Gaps the sources leave open. Do not specify behavior for these until decided; link the decision into the capability once made.
Owner: **Mobile** = decided here; **Product** = needs a product decision first.

## Open

| # | Question | Owner | Source | Affects |
|---|---|---|---|---|
| 1 | Who may rename a pod for all members: any member, or owners only? | Product | app-behavior.md, Permissions | `mobile/received-pods` |
| 8 | Calendar, Canvas and Map are kinds of tool with no content model yet (the roadmap adds calendar slices, free/busy or full details). What does each hold? Form, Contacts and Browser are settled in `mobile/pods`, `mobile/contacts-integration` and `mobile/credential-wallet`. | Product | README.md, app-behavior.md Adding a Tool; Mee roadmap | `mobile/pods` |
| 10 | Tool-owned files: a third kind besides attachments and private files, and its propagation | Product | pod-databook.md | not yet assigned |
| 14 | Which actions work offline or while the other member is offline, and what is queued? | Mobile | Mee roadmap | `mobile/received-pods`, `mobile/pod-chat` |
| 16 | Access delegation: passing credentials or health and emergency info to a spouse or caregiver so they hold it when it matters. Not modeled in the pod sources | Product | Mee roadmap; identity-agents paper §3.11, §4.2.2: users can delegate access to part of their data; guardians for minors | not yet assigned |
| 17 | Non-member contact sharing: what a QR code carries and how the other person's native address book is updated afterwards when they have no node | Product, Mobile | Mee roadmap | not yet assigned |
| 18 | Family groups ("mutually aware" members): a pod, a category, or a separate concept? | Product | Mee roadmap; identity-agents paper §5.5: a group is replicated to all members who are mutually aware, with shared attributes such as calendar and group chat; a collection is private. Suggests the answer, not yet decided | not yet assigned |
| 26 | How is an unknown category-extension category labeled when the app still files the received pod under the nearest shipped broader category? | Product | README.md Category Extensions; app-behavior.md Pod Contents | `mobile/pod-categories` |
| 29 | Auto File "suggests a category and files it": does approval record the category on a Custom pod, which would conflict with "fixed at creation", or only place it in the tree? | Product | app-behavior.md Organize; README.md Pod categories | `mobile/pod-organization`, `mobile/pod-categories` |
| 31 | Where does a pod created by Divide and Conquer sit in the tree, and who are its members when the source pod is shared? | Product | app-behavior.md Organize | `mobile/pod-organization` |
| 32 | What happens to a pod's children when the person deletes or leaves the parent? | Product | not specified | `mobile/pod-organization`, `mobile/pods` |
| 35 | How does a person name or pick the property to search for, for example a loyalty program id? | Product | app-behavior.md Finding Pods | `mobile/pod-tags-and-discovery` |
| 36 | How are shape violations shown when a form is filled in: blocking, warning, or only on save? | Mobile | app-behavior.md Form Fields from SHACL Shapes | `mobile/claims-and-forms` |
| 39 | Several record fields are highly sensitive (passwords, card numbers and verification codes, account and passport numbers). Do they need masking, reveal-on-demand or extra authentication? Not specified in the sources | Product | other-ontologies.md; Mee roadmap | `mobile/claims-and-forms` |
| 40 | May the last owner leave a pod? The source says only that the last owner cannot be demoted | Product | app-behavior.md Permissions | `mobile/members`, `mobile/pods` |
| 44 | Can a message be edited or deleted after it is sent, and by whom? | Product | app-behavior.md Chat Area (not specified); Naming, Renaming, and Sharing says chat "stays freely editable by every member", which may mean only posting | `mobile/pod-chat` |
| 45 | Does a member who joins a pod see the chat from before they joined? | Product | app-behavior.md Chat Area (not specified) | `mobile/pod-chat`, `mobile/members` |
| 46 | What happens to a person's private thread with their agent when the agent is removed from the pod? | Product | app-behavior.md Chat Area (not specified) | `mobile/pod-chat` |
| 47 | Whose claims does an agent write when the person asks it to add information about a member, and may the person then edit them? | Product | Figma chat screens; app-behavior.md Services | `mobile/pod-chat`, `mobile/claims-and-forms` |
| 48 | Is there a limit on the size or kind of file that can be attached, and what does the person see when a file exceeds it? | Product | app-behavior.md Attachments (not specified) | `mobile/pod-attachments` |
| 49 | Who may add a tool to a pod: any member, or owners only? | Product | app-behavior.md Adding a Tool, Permissions (not specified) | `mobile/pods` |
| 50 | Does the person approve each presentation of a credential to a site, and what is shown about what will be sent? | Product | app-behavior.md Browser Extension (not specified) | `mobile/credential-wallet` |
| 51 | How are the app and the browser extension connected, and what does the person do to set that up? | Product, Mobile | app-behavior.md Browser Extension (not specified) | `mobile/credential-wallet` |
| 52 | Sharing a pod that holds a credential shares what it says about its holder: is the person warned before sharing such a pod? | Product | app-behavior.md Browser Extension | `mobile/credential-wallet`, `mobile/members` |
| 53 | Which contacts does a sync cover: all of the address book, or only ones the person picks? | Product | app-behavior.md Apple Contacts (not specified) | `mobile/contacts-integration` |
| 54 | What happens when the same contact was changed on both sides since the last sync? | Product | app-behavior.md Apple Contacts (not specified) | `mobile/contacts-integration` |
| 55 | Where is an imported contact filed in the person's tree? | Product | app-behavior.md Apple Contacts (not specified) | `mobile/contacts-integration` |
| 56 | Who sees a pending invitation besides the invitee: only the person who sent it, every member, or owners only? | Product | app-behavior.md Permissions (invite is specified; pending visibility is not) | `mobile/members` |
| 57 | When an agent offers things the person could add to a pod, must the person choose from a list before anything is added, and may they ask for more? | Product | Figma chat screens; app-behavior.md Chat Area and Iterative Prompt/Response Loop (not specified) | `mobile/pod-chat` |
| 58 | When a bare two-member pod gains a tool or a third member its name becomes shared. Which name wins, the creator's, the recipient's or a new one? | Product | app-behavior.md Naming, Renaming, and Sharing (not specified) | `mobile/received-pods` |
| 59 | How is a received pod filed for a person who already uses the app? The source describes auto-filing only for a recipient who installs the app from the invitation | Product | app-behavior.md Auto-Filing on Receipt | `mobile/received-pods` |
| 60 | How does the app know which member a credential was issued to, and what is shown for a credential with no holder binding? | Product, Mobile | app-behavior.md Browser Extension | `mobile/credential-wallet` |
| 61 | Does leaving a pod also delete it locally, or are they distinct actions? Kept as separate actions pending an answer | Product | app-behavior.md Pod Container Permissions, Open Issue 2 | `mobile/pods` |
