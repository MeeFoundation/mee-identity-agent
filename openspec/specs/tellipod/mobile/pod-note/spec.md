# tellipod/mobile/pod-note Specification

## Purpose

Defines how the Tellipod mobile app lets a person write a pod's note: its formatting, links, simultaneous editing and export. The note is the one rich-text document of a pod. Changes reach other members through the node; the app sends them and shows what the node reports (`mobile/received-pods`, Show changes reported by the node). Resolving links by pod id is in `mobile/pods`, and unresolved links in `mobile/received-pods`.

## Requirements

### Requirement: One note, editable by every member
The app SHALL show at most one note for a pod and SHALL NOT offer a second one. It SHALL let every member, owner or not, a service included, edit it, with no review step. The app SHALL let every member delete the note and, when the pod has none, create it, and SHALL NOT offer commenting or suggested edits.

#### Scenario: Non-owner edits
- **GIVEN** a shared pod and a member who is not an owner
- **WHEN** they edit the note
- **THEN** the edit is accepted and shown to the other members as an ordinary change, with no review step

#### Scenario: Deleted and recreated
- **GIVEN** a pod whose note a member deleted
- **WHEN** a member creates the note
- **THEN** the pod has one blank note and no second note is offered

#### Scenario: No comments
- **GIVEN** a note in a shared pod
- **WHEN** the person looks for a way to comment on a passage
- **THEN** none is offered

### Requirement: Formatting
The app SHALL let a person format the note with headings, bold, italic and strikethrough, inline code and code blocks, block quotes, bulleted, numbered and nested lists, checklist items and tables. The app SHALL accept Markdown typed into the note as a shortcut for the same formatting, and SHALL show a preview of an image or embed in the note.

#### Scenario: Typed Markdown
- **GIVEN** a person editing a note
- **WHEN** they type `# ` at the start of a line followed by text
- **THEN** the line becomes a heading

### Requirement: Saved as the person writes
The app SHALL save the note continuously as the person writes and SHALL NOT offer or require an explicit save.

#### Scenario: Leaving without saving
- **GIVEN** a person who has just typed into a note
- **WHEN** they leave the pod
- **THEN** the text is kept

### Requirement: Several members at once
The app SHALL let several members edit the note at the same time and SHALL show the note with their changes merged, without one member's edit replacing another's.

#### Scenario: Concurrent edits
- **GIVEN** Alice and Dave editing different parts of the same note
- **WHEN** both save
- **THEN** each sees both changes

### Requirement: Links
The app SHALL let a person put three kinds of link in a note: an ordinary web address, a pod link to any pod in their own tree, and a block link to a tool, a graph or an attachment of the note's own pod. While the person types a pod link, the app SHALL offer the pods of their own tree to choose from, and while they type a block link, the app SHALL offer the pod's own tools, graphs and attachments to choose from.

A block link SHALL resolve by the id of its target, never by the target's name or position, and SHALL be shown as unresolved, never retargeted, when its target is later removed.

#### Scenario: Target removed
- **GIVEN** a block link to an attachment
- **WHEN** the attachment is deleted
- **THEN** the link is shown as unresolved and does not open another item

#### Scenario: Tool renamed
- **GIVEN** a block link to a tool
- **WHEN** the tool is renamed or the pod's tools are reordered
- **THEN** the link still opens the same tool

#### Scenario: Link to a private file
- **GIVEN** a block link to one of Alice's private files in a pod shared with Bob
- **WHEN** Bob views it
- **THEN** it is shown as unresolved to Bob and opens the file for Alice

#### Scenario: Linking to a pod
- **GIVEN** a person typing `[[` in a note
- **WHEN** they start typing a name
- **THEN** pods in their own tree matching the name are offered, and the one chosen becomes a pod link to it

#### Scenario: Linking to an attachment
- **GIVEN** a pod with an attachment
- **WHEN** the person adds a block link
- **THEN** the pod's attachments are among the choices

### Requirement: A new wikilink creates a pod
When a person opens a wikilink that has no target id because nothing of that name has ever been made into a pod, the app SHALL ask the node to create a Custom pod named after the link text, with a blank note and the person as its only member, placed directly under the top of their tree. The app SHALL then give the link the new pod's id, leaving its text unchanged, and SHALL keep the pod's name unique among its siblings (`mobile/received-pods`, Unique sibling names). The app SHALL NOT create a pod for a link that already carries an id.

#### Scenario: New wikilink
- **GIVEN** a note with the wikilink `[[foo]]` that has no id
- **WHEN** the person opens it
- **THEN** a Custom pod named "foo" appears at the top of their tree with a blank note, and the link opens it from then on

#### Scenario: Name already used at the top
- **GIVEN** a pod named "foo" already at the top of the person's tree
- **WHEN** the person opens a new wikilink `[[foo]]`
- **THEN** the new pod is named "foo1"

#### Scenario: Link with an id
- **GIVEN** a link with an id to a pod the person cannot access
- **WHEN** the person opens it
- **THEN** it is shown as unresolved and no pod is created

### Requirement: Find and undo
The app SHALL let a person find and replace text in a note and undo and redo their edits.

#### Scenario: Replace
- **GIVEN** a note that contains the word "Ginger" three times
- **WHEN** the person replaces it with "Max"
- **THEN** all three occurrences read "Max"

### Requirement: Export as Markdown
The app SHALL let any member export a pod's note as a Markdown file they can save outside the app. A pod link SHALL be exported with its pod id and its text, a wikilink with no id yet SHALL be exported as its text alone, and a block link, which has no Markdown form, SHALL be exported as its display text.

#### Scenario: Exported links
- **GIVEN** a note with a pod link and a block link
- **WHEN** a member exports it
- **THEN** the file holds the pod link with its id and text, and the block link as plain text
