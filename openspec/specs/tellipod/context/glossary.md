# Glossary

Use these terms exactly in all Tellipod specs.

| Term | Meaning |
|---|---|
| **Pod** | The atomic unit of information: a secure container with a note, chat, members, attachments, tags and optional tools. |
| **Instance pod** | An actual pod in a user's tree. |
| **Template pod** | A reusable, category-level starting shape cloned into a new pod. Never a pod the user sees in their tree. |
| **Pod id** | Stable, globally unique, opaque identifier of a pod. Not derived from its name. |
| **Category** | A classification of a pod's main topic, chosen from the shipped taxonomy or an extension, fixed at creation. Optional: a pod may have none. |
| **Category type** | Person-rooted, Organization-rooted, or Custom (no category), according to which taxonomy root the category is under, if any. Not itself a category. |
| **Category extension** | Organization-published categories linked to the shipped taxonomy so recipients without it can still file a pod. |
| **Custom pod** | A pod with no category. Its category type is Custom. |
| **Lazy Instantiation** | A pod is created only when the user wants it; creating one for a templated category clones its template. |
| **Tree / parent** | A member's own arrangement of pods. A pod's parent is per-member and never shared. |
| **Member** | A person or a service that belongs to a pod. Organizations are never members. |
| **Creator** | The one person who created a pod. |
| **Owner** | A person with owner role. The creator starts as owner. A pod always has at least one. |
| **Service** | A non-human participant: an agent service (acts for one member), a service provider (acts for an organization), or a website service. Never an owner. |
| **Principal** | The person or organization a service acts for. A service's access equals its principal's access. |
| **Note** | The one rich-text document of a pod, editable by all members, exportable as Markdown. |
| **Pod link** | A note link resolving to a target pod by pod id, never by display text. |
| **Block link** | A note link targeting a tool, graph or attachment; never retargets if the item is removed or renamed. |
| **Wikilink** | A `[[text]]` reference in a note. Without an id it can create a pod; with an id it never does. |
| **Chat** | The shared message stream of a pod. A member's private thread with their own agent is not part of it. |
| **Attachment** | A flat, immutable file received by every member. |
| **Private file** | A file kept by one member and synced only across that member's own devices. |
| **Tool** | A capability a pod can carry, in addition to its note, chat, members and attachments. Kinds: Form, Calendar, Canvas, Contacts, Map, Browser. A pod may carry none, one, or several. A tool is not a member. |
| **Form** | The kind of tool whose content is structured claims whose fields follow a shape. |
| **Shape** | A declaration of the fields a graph's content should have. Forms and member contact info are derived from shapes. |
| **Claim** | A statement in a graph, made by its claimant. |
| **Claimant** | The party responsible for a claim: a person, an organization or a service. |
| **Member graph** | A graph describing a member of a pod, claimed by that member or by another party. |
| **User tag** | A free-text label typed by the user, shared with all members, searchable. |
| **Service tag** | A hidden bookkeeping label written by a module in its own namespace. Never shared, never searchable by text. |
| **Auto-filing** | On receiving a shared pod, the app files it under a best-guess ancestor chain built from its category. |
| **Auto File** | Suggesting a category for an uncategorized pod and filing it on approval. |
| **Divide and Conquer** | Moving parts of a note into new categorized pods, leaving a pod link (or a block link to a new form). |
| **Node** | What the app asks to store pods, share changes with other members and decide what is allowed, and from which it receives changes and denials. It is not part of what this repository builds. |
