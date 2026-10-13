# app-ux-flows/showcases/sc-ppl-002 Specification

## Purpose

Defines the showcase SC-PPL-002 "Invite someone to Sofia's pod" in `app-ux-flows`. Bogdan, who owns the "About Sofia" pod, invites someone with a one-time link, revokes a pending invite, or removes a member. There is no sharing API, so invites, links and members are local mocks. The showcase is for demos and discussion: it has no variants, records no analytics, and carries its own explanations and open questions.

## Requirements

### Requirement: Showcase identity and screens
The application SHALL register a showcase flow with flow id `sc-ppl-002`, display code `SC-PPL-002`, title "Invite someone to Sofia's pod" and the description "Invite someone to Sofia's pod with a one-time link, take back an invite that is still pending, or remove someone who already joined." It SHALL have the three cases defined in "Cases". It SHALL be listed after the existing flows. `info` SHALL be the initial screen in every case.

The flow SHALL declare these screens:
- `info`: the pod's Info tab;
- `members`: the pod's members and pending invites, including while a toast is shown;
- `invite-name`: the bottom sheet that asks who is being invited;
- `invite-share`: the bottom sheet with an invite's link and share targets;
- `invite-detail`: the bottom sheet for one pending invite;
- `member-detail`: one member's details;
- `remove-confirm`: the bottom sheet that confirms removing a member.

Screens SHALL reference the Figma frames they implement, in Mee – Tellipod App v4.0.3:

| Screen | Figma frame | Node |
|---|---|---|
| `info` | Pod - 6 | 908-19475 |
| `members` | Pod - 7 | 908-19728 |
| `invite-name` | Modal | 908-19751 |
| `invite-share` | Modal | 914-19982 |

The state of `members` after an invite is sent ("Pod - 8", 914-20076) is part of `members`. `invite-detail`, `member-detail` and `remove-confirm` have no Figma frame and SHALL NOT declare one.

#### Scenario: Start a case
- **WHEN** a reviewer chooses case B of "Invite someone to Sofia's pod" on the home page
- **THEN** `info` is shown at `/flows/sc-ppl-002/info?case=b` with case B's mission card

#### Scenario: Catalogue
- **WHEN** a developer opens the development flow catalogue
- **THEN** "Invite someone to Sofia's pod" is listed with the code `SC-PPL-002`, its cases `SC-PPL-002-A` to `SC-PPL-002-C`, and its seven screens

### Requirement: Sofia's shared pod
The pod SHALL be "About Sofia", with the avatar letter "S". The person using the app SHALL be Bogdan, the pod's owner. The pod SHALL hold its members, the pending invites, and Telli, the pod's assistant. Telli SHALL always be listed and SHALL NOT be removable.

The **member count** SHALL be the number of people who are members plus the number of pending invites. Telli SHALL NOT be counted. Every place that shows the count SHALL show the same number.

Dates SHALL be relative to the day the run started ("today"). An invite SHALL expire 7 days after the day it was sent.

#### Scenario: Telli is not counted
- **WHEN** a reviewer starts case A, where the members are Bogdan and Telli
- **THEN** the member count is 1

#### Scenario: A pending invite is counted
- **WHEN** a reviewer in case A sends an invite to Geo
- **THEN** the member count is 2

### Requirement: Info tab
`info` SHALL show the pod top bar with a back control, the avatar, the title "About Sofia", the subtitle "Suggest category" with a tag icon, a menu control, and the tabs Notes, Chat and Info with Info selected. The back control, the menu control, the subtitle, and the Notes and Chat tabs SHALL do nothing.

Below the top bar it SHALL show:
- the section label "FORMS" and a card with the rows "Contact info" and "Medical" and a "Create form" action;
- a divider;
- the rows "Attachments" with the count 0, "Subpods" with the badge "2 suggestions" and the count 0, and "Members" with the member count.

Activating "Members" SHALL show `members`. The other rows and "Create form" SHALL do nothing.

#### Scenario: Open members
- **WHEN** a reviewer in case A activates "Members" on `info`
- **THEN** `members` is shown

### Requirement: Members
`members` SHALL show the pod top bar with a back control, the avatar, the title "About Sofia", the subtitle "Members" followed by the member count in a badge, and a menu control, without tabs. The back control SHALL show `info`. The menu control SHALL do nothing.

Below it SHALL show a card listing, in this order:
1. "Bogdan (You)", with the letter avatar "B", an online dot and the line "2 info shared";
2. every person who is a member, with a letter avatar and the line "Can view";
3. "Telli", with Telli's avatar and the line "Assistant";
4. an "Invite member" button, which SHALL show `invite-name`.

When there is at least one pending invite, a section labelled "PENDING INVITES" SHALL follow, with a row for each pending invite in the order they were sent. Each row SHALL show the invitee's letter avatar, their name and, in the warning tone, "Sent today" when the invite was sent today, or "Pending for 1 day" or "Pending for N days" otherwise.

Activating a member's row SHALL show `member-detail` for that member, and activating a pending invite SHALL show `invite-detail` for that invite. The rows for Bogdan and Telli SHALL do nothing.

#### Scenario: Pending invite from earlier
- **WHEN** a reviewer starts case B and activates "Members"
- **THEN** `members` lists Bogdan and Telli, the badge shows 2, and "PENDING INVITES" lists Geo with "Pending for 2 days"

### Requirement: Toast
A toast SHALL be shown at the bottom of `members` after the actions that say so below. It SHALL use the success style of the design system's toast (Mee – Design System v5.2.2, 28-11001): a check icon, a title, an optional action, and a close control. A toast SHALL stay until it is closed, until another toast replaces it, or until the reviewer leaves `members`.

#### Scenario: Close
- **WHEN** a toast is shown and the reviewer activates its close control
- **THEN** the toast disappears and nothing else changes

### Requirement: Invite someone
`invite-name` SHALL be a bottom sheet over `members` with the title "Add a member to About Sofia" (pod name in bold), the description "Once they join, they can see everything in it and use its chat.", a text field labelled "Who are you inviting?" with the help text "Just a name so you can keep track — you'll send them a link next.", and a "Create invite link" button. The field SHALL take focus when the sheet opens. "Create invite link" SHALL be unavailable while the name, without surrounding spaces, is empty. Pressing Enter in the field SHALL act as the button.

Activating "Create invite link" SHALL create a pending invite with that name, sent today, with a new link, and show `invite-share` for it. Dismissing `invite-name` SHALL go back to `members` without creating anything.

Links SHALL have the form `pod.app/i/xxxx-xxxx`. The first link of a run SHALL be `pod.app/i/x7f2-4k9a`, and every link in a run SHALL be different.

#### Scenario: Name required
- **WHEN** a reviewer on `invite-name` has typed only spaces
- **THEN** "Create invite link" is unavailable

#### Scenario: Create the link
- **WHEN** a reviewer in case A types "Geo" and activates "Create invite link"
- **THEN** `invite-share` is shown with the title "Invite Geo to About Sofia" and the link `pod.app/i/x7f2-4k9a`

### Requirement: Share an invite link
`invite-share` SHALL be a bottom sheet over `members` showing:
- the title "Invite <name> to About Sofia" (pod name in bold);
- the description "This link is the key to your pod. Send it only to <name>, in a way you trust. The link works once and expires <date>.", where the date is the expiry date written like "Sat, Oct 17";
- a field holding the link, with a copy control;
- the share targets "Messages", "Mail" and "Copy", each with an icon.

The copy control SHALL copy the link to the clipboard and show a check for about 1.5 seconds. It SHALL NOT close the sheet. Activating a share target SHALL count as sending: "Copy" SHALL copy the link, and every target SHALL then show `members` with the toast "Invite link sent to <name>". Dismissing the sheet SHALL show `members` with the invite still pending and no toast.

When `invite-share` is opened with no invite to show, for example by a direct link in a new run, `members` SHALL be shown instead.

#### Scenario: Send the link
- **WHEN** a reviewer in case A activates "Messages" on `invite-share` for Geo
- **THEN** `members` is shown with the badge 2, "PENDING INVITES" lists Geo with "Sent today", the toast reads "Invite link sent to Geo", and the briefing shows "Goal reached"

#### Scenario: Close without sending
- **WHEN** a reviewer dismisses `invite-share` for Geo without activating a share target
- **THEN** `members` lists Geo under "PENDING INVITES" and shows no toast

### Requirement: Revoke a pending invite
`invite-detail` SHALL be a bottom sheet over `members` for one pending invite, showing:
- the title "<name>'s invite";
- the line "Sent <date> · Expires <date>", dates written like "Sat, Oct 10";
- the invite's link with a copy control that behaves as on `invite-share`;
- the explanation "Revoking stops the link from working right away. <name> isn't told.";
- a "Send link again" button, which SHALL show `invite-share` for the same invite and the same link;
- a "Revoke invite" button in the destructive tone.

Activating "Revoke invite" SHALL, without asking for confirmation, remove the invite, show `members` and show the toast "<name>'s invite revoked" with the action "Undo". When no invite is pending any more, "PENDING INVITES" SHALL NOT be shown. "Undo" SHALL put the invite back with its link and dates unchanged and close the toast. Dismissing `invite-detail` SHALL go back to `members` with nothing changed.

When `invite-detail` is opened without a pending invite to show, `members` SHALL be shown instead.

#### Scenario: Revoke
- **WHEN** a reviewer in case B opens Geo's invite and activates "Revoke invite"
- **THEN** `members` is shown without "PENDING INVITES", the badge shows 1, the toast reads "Geo's invite revoked" with "Undo", and the briefing shows "Goal reached"

#### Scenario: Undo
- **WHEN** a reviewer activates "Undo" on that toast
- **THEN** Geo is listed under "PENDING INVITES" again with "Pending for 2 days", the badge shows 2, and the toast is gone

#### Scenario: Send again
- **WHEN** a reviewer in case B opens Geo's invite and activates "Send link again"
- **THEN** `invite-share` is shown for Geo with the same link as in `invite-detail`

### Requirement: Remove a member
`member-detail` SHALL show a top bar with a back control to `members`, the member's letter avatar, their name as the title and "Can view" as the subtitle. Below it SHALL show:
- a card with "Joined" and the date they joined, written like "September 21, 2026";
- a card titled "What they can do" with "See notes and info" and "Read and write in the chat";
- a "Remove from pod" button in the destructive tone, which SHALL show `remove-confirm`.

`remove-confirm` SHALL be a bottom sheet over `member-detail` with the title "Remove <name> from About Sofia?", the points "<name> can't open the pod anymore." and "Their messages stay in the chat.", a "Remove <name>" button in the destructive tone and a "Cancel" button. "Cancel" and dismissing the sheet SHALL go back to `member-detail`. Activating "Remove <name>" SHALL remove the member, show `members` and show the toast "<name> was removed from About Sofia" without an action. Removal SHALL NOT be undoable.

When `member-detail` or `remove-confirm` is opened without a member to show, `members` SHALL be shown instead.

#### Scenario: Remove
- **WHEN** a reviewer in case C opens Geo, activates "Remove from pod" and then "Remove Geo"
- **THEN** `members` lists Bogdan and Telli only, the badge shows 1, the toast reads "Geo was removed from About Sofia", and the briefing shows "Goal reached"

#### Scenario: Cancel
- **WHEN** a reviewer on `remove-confirm` activates "Cancel"
- **THEN** `member-detail` for Geo is shown and Geo is still a member

### Requirement: Completion
The run SHALL complete without the completion view, so the briefing shows "Goal reached", the first time any of these happens: an invite link is sent through a share target, a pending invite is revoked, or a member is removed. The reviewer SHALL be able to keep using every screen afterwards.

#### Scenario: Keep going after the goal
- **WHEN** a reviewer in case A has sent Geo's link and then invites "Ana"
- **THEN** `invite-share` shows a link different from Geo's, and the briefing still shows "Goal reached"

### Requirement: Cases
The showcase SHALL declare these cases. They share every screen and differ only in their starting members and invites, goal and notes:

| Case | Code | Name | At start | Goal |
|---|---|---|---|---|
| `a` | SC-PPL-002-A | Invite | members Bogdan and Telli, no invites | Invite Geo to Sofia's pod and send them the link. |
| `b` | SC-PPL-002-B | Revoke an invite | members Bogdan and Telli; Geo invited 2 days ago with `pod.app/i/x7f2-4k9a` | Geo hasn't joined yet. Take back their invite. |
| `c` | SC-PPL-002-C | Remove a member | members Bogdan, Geo (joined 21 days ago) and Telli, no invites | Geo shouldn't see Sofia's pod anymore. Remove them. |

#### Scenario: Case C starts with Geo as a member
- **WHEN** a reviewer starts case C and activates "Members"
- **THEN** `members` lists Bogdan, Geo with "Can view", and Telli, the badge shows 2, and there are no pending invites

### Requirement: Showcase notes
The showcase SHALL declare these explanations and open questions (see `app-ux-flows/flow-briefing`).

**Flow.** The explanation is the flow description. Questions:
- People who join can only view the pod and use its chat. Is that clear to the person sending the invite?
- Should Telli count as a member? Right now it doesn't, but pending invites do.

**Screens:**

| Screen | Explanation | Questions |
|---|---|---|
| `info` | Sofia's pod as its owner sees it. Members is where sharing starts. | none |
| `members` | Who is in the pod, and who was invited but hasn't joined yet. | Is "Pending for N days" useful, or should it show when the invite expires? |
| `invite-name` | The name is only for the owner's own list. Nothing is sent yet. | Is it clear that nothing is sent at this point? |
| `invite-share` | The link is created now and can be used once. Picking any app counts as sending it. | If the sheet is closed without sending, should the invite stay pending? Right now it does. · Is "the key to your pod" the right tone? |
| `invite-detail` | No design. A pending invite can be sent again or revoked. Revoking is instant and can be undone from the toast. | Should "Send link again" make a new link and stop the old one? Right now it reuses it. · Should the invitee be told the invite was revoked? |
| `member-detail` | No design. What the member can do in the pod, and how to remove them. | Should the owner be able to change what a member can do? |
| `remove-confirm` | No design. Removing someone can't be undone, so it asks first. | Should the removed person be told? · Is it right that their chat messages stay? |

**Cases.** Explanations are the case descriptions:

| Case | Explanation | Case questions |
|---|---|---|
| A | Nobody else is in the pod yet. | none |
| B | Geo was invited two days ago and hasn't joined. | Should an unused invite expire on its own, and should the owner see that? |
| C | Geo joined three weeks ago and can view the pod. | none |

#### Scenario: Notes on a screen without design
- **WHEN** a reviewer in case B is on `invite-detail`
- **THEN** "This screen" says the screen has no design and lists its two questions
