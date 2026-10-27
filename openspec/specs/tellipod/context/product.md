# Tellipod product description

## What it is

Tellipod is a free, open-source app from The Mee Foundation. A person uses it to create **pods**: private, secure
collaboration spaces that other people, and Tellipod-compatible **services**, can join. Organizations take part
only through a service they provide.

## The core idea

A pod is the atomic unit of information. Everything a person keeps or shares (a pet's medical care, a trip, an
employer, a bank, a family member) is a pod. Pods nest into a tree that each member organizes for themselves.

A pod holds:

- an optional **category** saying what kind of information it holds, fixed at creation;
- exactly one **note**, editable by all members;
- one **chat** stream shared by all members;
- **members**: people, or services acting for a person or an organization;
- **attachments**, shared with every member, and **private files**, kept by one member;
- **tags**: user tags (shared, for retrieval) and service tags (hidden bookkeeping);
- optional **tools** (a form, contacts, a browser connection, and others), some of which hold structured **claims**.

Structured data is stored as claims in graphs: **member graphs** (contact information about members) and, when a
pod has a **form**, that form's graphs. Each graph has a **claimant**, the party responsible for it. Members
read everything shared in a pod but write only their own claims.

## Who it is for

- **Individuals** organizing their own lives: pets, health, home, vehicles, documents, travel, finances.
- **Households and small groups** sharing parts of that information with specific people.
- **Organizations** (a society, a provider, a company) reaching people through a service they provide, using category
  extensions for their own filing needs.
- **AI agents and other services** invited by a member to help inside a pod, under the same rules as people.

## What the product promises

1. **Claims belong to their author.** Nobody writes another member's claims; owners can only delete.
2. **Services are not special.** A service has exactly its principal's access and is never an owner.
3. **Structure follows the user.** Categories, templates and shapes are help, not a gate: a pod can start as a note
   and gain structure later (Lazy Instantiation, Divide and Conquer, Auto File).

## Scope of this repository

This repository builds the Tellipod mobile app. The app asks a **node** to store pods and share changes with other
members, and shows what the node reports. Tellipod has no central server, and where the node runs does not matter to the app. Everything in these specs is about what the
app offers, shows and does.

## Where the details live

- Vocabulary: [glossary.md](glossary.md)
- Unresolved questions: [open-questions.md](open-questions.md)
- Capabilities: `../mobile/*`

## Sources

All from https://github.com/MeeFoundation/pod-ontologies (commit 9fb0ad30bb6fa7a80aa4a0aaf6267e8f33b3ddc0, read on 2026-10-27):
`README.md`, `app-behavior.md`, `storage.md`, `example.md`, `other-ontologies.md`. Read for scope only: `core-files.md`,
`pod-databook.md`, `integrity.md`.
