# app-ux-flows/showcases/sc-ppl-002 Specification

## Purpose

Defines the showcase SC-PPL-002 "Invite someone to Sofia's pod" in `app-ux-flows`. Bogdan, who owns the "About Sofia" pod, invites someone with a one-time link, revokes a pending invite, or removes a member. There is no sharing API, so invites, links and members are local mocks. The showcase is for demos and discussion: it has no variants, records no analytics, and carries its own explanations and open questions.

## Requirements

### Requirement: Showcase identity and screens
The application SHALL register a showcase flow with flow id `sc-ppl-002`, display code `SC-PPL-002`, title "Invite someone to Sofia's pod" and the description "Invite someone to Sofia's pod with a one-time link, take back an invite that is still pending, remove someone who already joined, sort out what others added about you, or add what you know about someone else." It SHALL have the five cases defined in "Cases". It SHALL be listed after the existing flows. `info` SHALL be the initial screen in every case.

The flow SHALL declare these screens:
- `info`: the pod's Info tab;
- `members`: the pod's members and pending invites, including while a toast is shown;
- `invite-name`: the bottom sheet that asks who is being invited;
- `invite-share`: the bottom sheet with an invite's link and share targets;
- `invite-detail`: the bottom sheet for one pending invite;
- `member-detail`: what another member shares in the pod, what others added about them, and how to remove them;
- `remove-confirm`: the bottom sheet that confirms removing a member;
- `my-info`: what Bogdan shares in the pod, and what others added about him;
- `suggestion-actions`: the bottom sheet with the actions for one detail someone else added;
- `adopt-conflict`: the bottom sheet that asks how to add a detail Bogdan already shares.

Screens SHALL reference the Figma frames they implement, in Mee – Tellipod App v4.0.3:

| Screen | Figma frame | Node |
|---|---|---|
| `info` | SC-PPL-002-A - About Sofia (info) | 1348-27324 |
| `members` | SC-PPL-002-A - Members | 1348-27346 |
| `invite-name` | SC-PPL-002-A - Invite name (sheet) | 1348-27356 |
| `invite-share` | SC-PPL-002-A - Share invite link (sheet) | 1348-27367 |
| `invite-detail` | SC-PPL-002-B - Geo's invite (sheet) | 1348-27418 |
| `member-detail` | Bogdan (You) - info shared | 38-2883 |
| `remove-confirm` | SC-PPL-002-C - Remove Geo (confirm sheet) | 1348-27509 |
| `my-info` | Bogdan (You) - info shared | 38-2883 |
| `suggestion-actions` | Shared info actions (modal) | 119-9506 |

`member-detail` has no frame of its own and follows the layout of `my-info`. The member list's Role line follows the frame "Members" (760-18097). `adopt-conflict` has no Figma frame and SHALL NOT declare one.

#### Scenario: Start a case
- **WHEN** a reviewer chooses case B of "Invite someone to Sofia's pod" on the home page
- **THEN** `info` is shown at `/flows/sc-ppl-002/info?case=b` with case B's mission card

#### Scenario: Catalogue
- **WHEN** a developer opens the development flow catalogue
- **THEN** "Invite someone to Sofia's pod" is listed with the code `SC-PPL-002`, its cases `SC-PPL-002-A` to `SC-PPL-002-E`, and its ten screens

### Requirement: Sofia's shared pod
The pod SHALL be "About Sofia", with the avatar letter "S". The person using the app SHALL be Bogdan, the pod's owner. The pod SHALL hold its members, the pending invites, and Telli, the pod's assistant. Telli SHALL always be listed and SHALL NOT be removable.

The **member count** SHALL be the number of people who are members plus the number of pending invites. Telli SHALL NOT be counted. Every place that shows the count SHALL show the same number.

Each person who is a member SHALL have the **info they share** in the pod: an ordered list of details, each with a field and a value. The fields are First name, Role, Email, Phone and Address. Email and Phone are **multi-value**: a person can share more than one of each. The others are **single-value**. Only the person themselves SHALL be able to change the info they share. Bogdan SHALL share, at the start of every case and in this order: First name "Bogdan", Role "Dad", Email "bhutuleac@swiftinvention.com" and Address "318 Fillmore St, Apt 4B".

A member MAY have **details added by others**: details another member added about them, each with the field, the value, who added it and how many days before today. A person SHALL have at most one detail per field about each other member. Only the person who added a detail SHALL be able to change it or take it back. The person it is about SHALL be able to copy it, add it to the info they share, or remove it. Every member SHALL see the details added about every member.

A detail added by others SHALL be **shown** only while the person it is about shares no detail with the same field and exactly the same value. A detail that is not shown SHALL be kept, and SHALL be shown again as soon as it no longer matches. A person with no shown details about a member SHALL NOT have a card for that member.

Dates SHALL be relative to the day the run started ("today"). An invite SHALL expire 7 days after the day it was sent.

#### Scenario: Telli is not counted
- **WHEN** a reviewer starts case A, where the members are Bogdan and Telli
- **THEN** the member count is 1

#### Scenario: A pending invite is counted
- **WHEN** a reviewer in case A sends an invite to Geo
- **THEN** the member count is 2

#### Scenario: Bogdan's shared info
- **WHEN** a reviewer in any case opens `my-info` before changing anything
- **THEN** "4 INFO SHARED IN THIS POD" lists First name "Bogdan", Role "Dad", Email "bhutuleac@swiftinvention.com" and Address "318 Fillmore St, Apt 4B"

#### Scenario: A matching detail is hidden and comes back
- **WHEN** a reviewer in case D adds Geo's Email by "Replace", and then edits his Email back to "bhutuleac@swiftinvention.com"
- **THEN** Geo's Email "bogdan@gmail.com" is hidden after "Replace" and is shown again in Geo's card after the edit

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
1. "Bogdan (You)", with the letter avatar "B", an online dot and the Role he shares ("Dad");
2. every person who is a member, with a letter avatar and the Role they share, or "Can view" when they share no Role;
3. "Telli", with Telli's avatar and the line "Assistant";
4. an "Invite member" button, which SHALL show `invite-name`.

When there is at least one pending invite, a section labelled "PENDING INVITES" SHALL follow, with a row for each pending invite in the order they were sent. Each row SHALL show the invitee's letter avatar, their name and, in the warning tone, "Sent today" when the invite was sent today, or "Pending for 1 day" or "Pending for N days" otherwise.

Activating Bogdan's row SHALL show `my-info`. Activating another member's row SHALL show `member-detail` for that member, and activating a pending invite SHALL show `invite-detail` for that invite. Telli's row SHALL do nothing.

#### Scenario: Pending invite from earlier
- **WHEN** a reviewer starts case B and activates "Members"
- **THEN** `members` lists Bogdan and Telli, the badge shows 2, and "PENDING INVITES" lists Geo with "Pending for 2 days"

#### Scenario: Roles in the list
- **WHEN** a reviewer starts case D and activates "Members"
- **THEN** `members` lists "Bogdan (You)" with "Dad", Geo with "Mum", Andrew with "Uncle" and Telli with "Assistant", and the badge shows 3

#### Scenario: Open my own info
- **WHEN** a reviewer in any case activates "Bogdan (You)" on `members`
- **THEN** `my-info` is shown

### Requirement: Toast
A toast SHALL be shown at the bottom of `members`, `my-info` or `member-detail` after the actions that say so below. It SHALL use the success style of the design system's toast (Mee – Design System v5.2.2, 28-11001): a check icon, a title, an optional action, and a close control. A toast SHALL stay until it is closed, until another toast replaces it, or until the reviewer leaves the screen it is shown on. Opening a sheet or an editor over `my-info` or `member-detail` SHALL close its toast.

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
`member-detail` SHALL show a "Remove from pod" button in the destructive tone at the bottom of the screen, after every section, only when the person using the app owns the pod. It SHALL show `remove-confirm`. `my-info` SHALL NOT show it.

`remove-confirm` SHALL be a bottom sheet over `member-detail` with the title "Remove <name> from About Sofia?", the points "<name> can't open the pod anymore." and "Their messages stay in the chat.", a "Remove <name>" button in the destructive tone and a "Cancel" button. "Cancel" and dismissing the sheet SHALL go back to `member-detail`. Activating "Remove <name>" SHALL remove the member, show `members` and show the toast "<name> was removed from About Sofia" without an action. Removal SHALL NOT be undoable.

When `member-detail` or `remove-confirm` is opened without a member to show, `members` SHALL be shown instead.

#### Scenario: Remove
- **WHEN** a reviewer in case C opens Geo, activates "Remove from pod" and then "Remove Geo"
- **THEN** `members` lists Bogdan and Telli only, the badge shows 1, the toast reads "Geo was removed from About Sofia", and the briefing shows "Goal reached"

#### Scenario: Cancel
- **WHEN** a reviewer on `remove-confirm` activates "Cancel"
- **THEN** `member-detail` for Geo is shown and Geo is still a member

### Requirement: Completion
The run SHALL complete without the completion view, so the briefing shows "Goal reached", the first time any of these happens: an invite link is sent through a share target, a pending invite is revoked, a member is removed, a detail someone else added is added to the info Bogdan shares (directly, by "Replace" or by "Keep both"), such a detail is removed, or Bogdan saves a detail about another member. Copying a detail, editing the info Bogdan shares, and taking back one of Bogdan's details about someone SHALL NOT complete the run. The reviewer SHALL be able to keep using every screen afterwards.

#### Scenario: Keep going after the goal
- **WHEN** a reviewer in case A has sent Geo's link and then invites "Ana"
- **THEN** `invite-share` shows a link different from Geo's, and the briefing still shows "Goal reached"

#### Scenario: Editing my own info does not complete
- **WHEN** a reviewer in case A changes Bogdan's Address on `my-info`
- **THEN** the briefing does not show "Goal reached"

### Requirement: Cases
The showcase SHALL declare these cases. They share every screen and differ only in their starting members, invites, shared info and details added by others, goal and notes. In cases A to C no one shares a Role except Bogdan, and no one has added details about anyone:

| Case | Code | Name | At start | Goal |
|---|---|---|---|---|
| `a` | SC-PPL-002-A | Invite | members Bogdan and Telli, no invites | Invite Geo to Sofia's pod and send them the link. |
| `b` | SC-PPL-002-B | Revoke an invite | members Bogdan and Telli; Geo invited 2 days ago with `pod.app/i/x7f2-4k9a` | Geo hasn't joined yet. Take back their invite. |
| `c` | SC-PPL-002-C | Remove a member | members Bogdan, Geo (joined 21 days ago) and Telli, no invites | Geo shouldn't see Sofia's pod anymore. Remove them. |
| `d` | SC-PPL-002-D | Info others added about me | members Bogdan, Geo (joined 21 days ago, shares Role "Mum"), Andrew (joined 3 days ago, shares Role "Uncle") and Telli, no invites; Geo added about Bogdan, 1 day ago: Email "bogdan@gmail.com" and Phone "+4244235355" | Geo added some of your details to Sofia's pod. Keep what's right and remove what isn't. |
| `e` | SC-PPL-002-E | Add info about someone else | members Bogdan, Geo (joined 21 days ago, shares Role "Mum" and Email "geo.old@gmail.com"), Andrew (joined 3 days ago, shares Role "Uncle") and Telli, no invites; Andrew added about Geo, 2 days ago: Phone "+447700900123" | Geo's email in the pod is out of date. Add the one you know: geo@swiftinvention.com. |

#### Scenario: Case C starts with Geo as a member
- **WHEN** a reviewer starts case C and activates "Members"
- **THEN** `members` lists Bogdan, Geo with "Can view", and Telli, the badge shows 2, and there are no pending invites

#### Scenario: Case D starts with details added by Geo
- **WHEN** a reviewer starts case D, activates "Members" and then "Bogdan (You)"
- **THEN** `my-info` shows Bogdan's four details, and under "INFO ABOUT YOU — ADDED BY OTHERS" Geo's card with Email "bogdan@gmail.com" and Phone "+4244235355"

#### Scenario: Case E starts with a detail added by Andrew
- **WHEN** a reviewer starts case E, activates "Members" and then Geo
- **THEN** `member-detail` shows "2 INFO SHARED BY GEO" with Role "Mum" and Email "geo.old@gmail.com", and under "INFO ABOUT GEO — ADDED BY OTHERS" Andrew's card with Phone "+447700900123"

### Requirement: Showcase notes
The showcase SHALL declare these explanations and open questions (see `app-ux-flows/flow-briefing`).

**Flow.** The explanation is the flow description. Questions:
- People who join can only view the pod and use its chat. Is that clear to the person sending the invite?
- Should Telli count as a member? Right now it doesn't, but pending invites do.
- Should Bogdan be told when someone adds a detail about him?
- A detail someone added is hidden once its person shares the same value. If that person later changes their value, should the detail come back? Right now it does.

**Screens:**

| Screen | Explanation | Questions |
|---|---|---|
| `info` | Sofia's pod as its owner sees it. Members is where sharing starts. | none |
| `members` | Who is in the pod, and who was invited but hasn't joined yet. Each person shows the Role they share. | Is "Pending for N days" useful, or should it show when the invite expires? · What do the coloured dots on the avatars mean? · The design leaves Telli out of this list. Should it be listed? |
| `invite-name` | The name is only for the owner's own list. Nothing is sent yet. | Is it clear that nothing is sent at this point? |
| `invite-share` | The link is created now and can be used once. Picking any app counts as sending it. | If the sheet is closed without sending, should the invite stay pending? Right now it does. · Is "the key to your pod" the right tone? |
| `invite-detail` | No design. A pending invite can be sent again or revoked. Revoking is instant and can be undone from the toast. | Should "Send link again" make a new link and stop the old one? Right now it reuses it. · Should the invitee be told the invite was revoked? |
| `member-detail` | No design; follows Bogdan's own info screen. What the member shares and what others added about them. Bogdan can't change their info: his edits are added as his own info about them. The owner can remove them here. | Should the member be told when someone adds info about them? · Should the owner still see when the member joined and what they can do? |
| `remove-confirm` | No design. Removing someone can't be undone, so it asks first. | Should the removed person be told? · Is it right that their chat messages stay? |
| `my-info` | What Bogdan shares in the pod, and what others added about him. He can edit what he shares. He can't change what others added, only take it over or remove it. | Should Bogdan be able to stop sharing a detail? · Should the person who added a detail be told when it is removed? |
| `suggestion-actions` | What Bogdan can do with a detail someone else added. | Is it clear that "Add to info I share" moves the detail out of Geo's list? |
| `adopt-conflict` | No design. Bogdan already shares this kind of detail, so he picks whether to replace his or keep both. | When both are kept, should one be the main one? |

**Cases.** Explanations are the case descriptions:

| Case | Explanation | Case questions |
|---|---|---|
| A | Nobody else is in the pod yet. | none |
| B | Geo was invited two days ago and hasn't joined. | Should an unused invite expire on its own, and should the owner see that? |
| C | Geo joined three weeks ago and can view the pod. | none |
| D | Geo added Bogdan's personal email and phone number. Bogdan already shares his work email. | none |
| E | Geo shares an old email. Andrew already added a phone number for Geo. | Should Geo see who added each detail before deciding? |

#### Scenario: Notes on a screen without design
- **WHEN** a reviewer in case B is on `invite-detail`
- **THEN** "This screen" says the screen has no design and lists its two questions

### Requirement: My info
`my-info` SHALL show a top bar with a back control to `members`, the letter avatar "B", the title "Bogdan (You)", the subtitle "About Sofia" and a menu control that does nothing.

Below it SHALL show:
1. the section label "<N> INFO SHARED IN THIS POD", where N is the number of details Bogdan shares, with the line "Everyone in About Sofia can see these." (pod name in bold);
2. a card with one row per detail Bogdan shares, in order, each with the field as the label, the value, and an edit control; then a "+ Add personal info" button. These SHALL behave as in "Editing my own info";
3. when at least one detail added about Bogdan by others is shown, the section label "INFO ABOUT YOU — ADDED BY OTHERS", with the line "Only the person who added a detail can change it but you are allowed to remove the info that isn't right or merge it with your own info if it is right.", followed by one card per person with at least one shown detail, in the order they first added one. Each card SHALL show the person's letter avatar, their name and the Role they share, then one row per shown detail they added, each with the field as the label, the value and a "More actions" control.

Activating a detail's "More actions" control SHALL show `suggestion-actions` for that detail. A card SHALL NOT be shown once its person has no shown details left, and the section SHALL NOT be shown once no card is left.

When `my-info` is opened from a direct link, it SHALL show the case's starting data.

#### Scenario: Nothing added by others
- **WHEN** a reviewer in case A opens `my-info`
- **THEN** "4 INFO SHARED IN THIS POD" is shown with Bogdan's four details, and "INFO ABOUT YOU — ADDED BY OTHERS" is not shown

#### Scenario: Edit controls are inert
- **WHEN** a reviewer activates the menu control in the top bar of `my-info`
- **THEN** `my-info` stays shown and nothing changes; only the edit controls and "+ Add personal info" open an editor

#### Scenario: Open a detail's actions
- **WHEN** a reviewer in case D activates "More actions" on Geo's Email
- **THEN** `suggestion-actions` is shown for Email "bogdan@gmail.com"

### Requirement: Actions on a detail added by someone else
`suggestion-actions` SHALL be a bottom sheet over `my-info` for one detail added by someone else, showing:
- the title "<Field>: <value>", with the value in bold;
- the line "Shared by <name> today", "Shared by <name> yesterday" or "Shared by <name> N days ago";
- "Copy value", with a copy icon;
- "Add to info I share", with a plus icon;
- "This isn't right, remove it", with a trash icon, in the destructive tone.

"Copy value" SHALL copy the value to the clipboard, show `my-info` and show the toast "<Field> copied" without an action. A blocked clipboard SHALL NOT stop the flow. Nothing else SHALL change.

"Add to info I share" SHALL:
- when Bogdan shares no detail with that field: add the value to the end of the info Bogdan shares, so the detail is no longer shown, show `my-info` and show the toast "<Field> added to the info you share" without an action;
- otherwise show `adopt-conflict` for the detail.

"This isn't right, remove it" SHALL, without asking for confirmation, delete the detail, so it is never shown again, show `my-info` and show the toast "<Name>'s <field> removed" without an action. These actions SHALL NOT be undoable.

Dismissing `suggestion-actions` SHALL go back to `my-info` with nothing changed. When `suggestion-actions` is opened without a shown detail to show, `my-info` SHALL be shown instead.

#### Scenario: Copy
- **WHEN** a reviewer in case D activates "Copy value" for Geo's Email
- **THEN** "bogdan@gmail.com" is on the clipboard, `my-info` is shown unchanged with the toast "Email copied", and the run is not completed

#### Scenario: Add a new kind of detail
- **WHEN** a reviewer in case D activates "Add to info I share" for Geo's Phone
- **THEN** `my-info` shows "5 INFO SHARED IN THIS POD" with Phone "+4244235355" last, Geo's card shows only Email, the toast reads "Phone added to the info you share" with no action, and the briefing shows "Goal reached"

#### Scenario: Remove
- **WHEN** a reviewer in case D activates "This isn't right, remove it" for Geo's Phone
- **THEN** `my-info` shows Geo's card with only Email, Bogdan still shares 4 details, the toast reads "Geo's phone removed" with no action, and the briefing shows "Goal reached"

#### Scenario: Removed stays removed
- **WHEN** a reviewer in case D removes Geo's Phone and then adds Phone "+4244235355" to his info and edits it to "+4244235356"
- **THEN** Geo's Phone is not shown again

#### Scenario: Last detail gone
- **WHEN** a reviewer in case D removes Geo's Phone and then adds Geo's Email by "Keep both"
- **THEN** Geo's card and the "INFO ABOUT YOU — ADDED BY OTHERS" section are no longer shown

### Requirement: Adding a detail Bogdan already shares
`adopt-conflict` SHALL be a bottom sheet over `my-info` for a detail added by someone else whose field Bogdan already shares. It SHALL show:
- the title "You already share <a field>", for example "You already share an email";
- the value Bogdan shares, labelled "Yours", and the value that was added, labelled "Added by <name>";
- for a multi-value field: a "Keep both" button, a "Replace <your value>" button and a "Cancel" button;
- for a single-value field: a "Replace <your value>" button and a "Cancel" button.

When Bogdan shares more than one value for that field, "Yours" SHALL show the first one and "Replace" SHALL replace the first one.

"Keep both" SHALL add the value to the info Bogdan shares, directly after the last detail with the same field. "Replace" SHALL put the added value in place of Bogdan's value, keeping its position. Either way the detail is no longer shown. Both SHALL then show `my-info` and show a toast without an action: "<Field> added to the info you share" for "Keep both", "<Field> replaced" for "Replace".

"Cancel" and dismissing the sheet SHALL go back to `my-info` with nothing changed. When `adopt-conflict` is opened without a shown detail to show, or for a detail whose field Bogdan doesn't share, `my-info` SHALL be shown instead.

#### Scenario: Conflict on email
- **WHEN** a reviewer in case D activates "Add to info I share" for Geo's Email
- **THEN** `adopt-conflict` shows "You already share an email", "Yours" with "bhutuleac@swiftinvention.com", "Added by Geo" with "bogdan@gmail.com", and the buttons "Keep both", "Replace bhutuleac@swiftinvention.com" and "Cancel"

#### Scenario: Keep both
- **WHEN** a reviewer activates "Keep both"
- **THEN** `my-info` shows "5 INFO SHARED IN THIS POD" with Email "bhutuleac@swiftinvention.com" followed by Email "bogdan@gmail.com", Geo's card shows only Phone, the toast reads "Email added to the info you share", and the briefing shows "Goal reached"

#### Scenario: Replace
- **WHEN** a reviewer activates "Replace bhutuleac@swiftinvention.com"
- **THEN** `my-info` shows "4 INFO SHARED IN THIS POD" with Email "bogdan@gmail.com" in third place, Geo's card shows only Phone, and the toast reads "Email replaced"

#### Scenario: Cancel
- **WHEN** a reviewer on `adopt-conflict` activates "Cancel"
- **THEN** `my-info` is shown with nothing changed

### Requirement: Editing my own info
On `my-info`, activating the edit control on a detail Bogdan shares SHALL replace that row with an inline editor: a text field labelled with the field, holding the current value and taking focus, with "Save" and "Cancel". "Save" SHALL be unavailable while the value, without surrounding spaces, is empty or unchanged. "Save" SHALL put the new value in place of the old one, keeping its position, close the editor and show the toast "<Field> updated" without an action. "Cancel" SHALL close the editor with nothing changed. Only one editor SHALL be open at a time; opening another SHALL cancel the open one.

Activating "+ Add personal info" SHALL open an inline editor at the end of the card with a field picker and a text field. The picker SHALL offer First name, Role, Email, Phone and Address, leaving out every single-value field Bogdan already shares, and SHALL start on the first field it offers. "Save" SHALL be unavailable while the value, without surrounding spaces, is empty. "Save" SHALL add the detail to the end of the info Bogdan shares, close the editor and show the toast "<Field> added to the info you share" without an action.

Saving a value SHALL apply the rule for shown details: a detail added by others whose field and value now match is no longer shown, and one that no longer matches is shown again.

#### Scenario: Edit a detail
- **WHEN** a reviewer in case A edits Bogdan's Address to "12 Pine St" and activates "Save"
- **THEN** `my-info` shows Address "12 Pine St" in fourth place and the toast "Address updated"

#### Scenario: Add a detail
- **WHEN** a reviewer in case A activates "+ Add personal info"
- **THEN** the picker offers Email, Phone and Address, and starts on Email

#### Scenario: Matching a detail added by others
- **WHEN** a reviewer in case D adds Phone "+4244235355" through "+ Add personal info"
- **THEN** Geo's card shows only Email

### Requirement: Someone else's info
`member-detail` SHALL show a top bar with a back control to `members`, the member's letter avatar, their name as the title, the subtitle "About Sofia" and a menu control that does nothing.

Below it SHALL show:
1. the section label "<N> INFO SHARED BY <NAME>", where N is the number of details the member shares, with the line "Only <name> can change these. What you edit is added below as your info about <name>.";
2. a card with one row per detail the member shares, in order, each with the field as the label, the value and an edit control, or the line "<name> hasn't shared any info yet." when they share none; then a "+ Add info about <name>" button. These SHALL behave as in "Adding info about someone else";
3. when at least one detail added about the member is shown, the section label "INFO ABOUT <NAME> — ADDED BY OTHERS", with the line "Everyone in About Sofia can see these. Only the person who added a detail can change it.", followed by one card per person with at least one shown detail, in the order they first added one. Each card SHALL show the person's letter avatar, their name ("Bogdan (You)" for Bogdan) and the Role they share, then one row per shown detail they added, with the field as the label and the value. Bogdan's rows SHALL also have an edit control and a "Remove" control. Other people's rows SHALL have no controls;
4. the "Remove from pod" button described in "Remove a member".

A card SHALL NOT be shown once its person has no shown details left, and the section SHALL NOT be shown once no card is left. Telli SHALL have no info screen.

#### Scenario: Geo shares nothing
- **WHEN** a reviewer in case C opens Geo
- **THEN** `member-detail` shows "0 INFO SHARED BY GEO", "Geo hasn't shared any info yet.", "+ Add info about Geo", no "INFO ABOUT GEO — ADDED BY OTHERS" section, and "Remove from pod"

#### Scenario: Someone else's detail is read-only
- **WHEN** a reviewer in case E opens Geo
- **THEN** Andrew's Phone "+447700900123" has no edit or remove control

### Requirement: Adding info about someone else
On `member-detail`, nothing Bogdan does SHALL change the info the member shares. Bogdan SHALL have at most one detail per field about the member.

Activating the edit control on a detail the member shares SHALL replace that row with an inline editor like the one in "Editing my own info", labelled with the field. It SHALL start with Bogdan's detail about the member for that field if he has one, otherwise with the shared value. Activating the edit control on one of Bogdan's rows under "INFO ABOUT <NAME> — ADDED BY OTHERS" SHALL open the same editor in that row, starting with its value. "+ Add info about <name>" SHALL open an inline editor at the end of the card with a picker offering all five fields, starting on First name, and a text field.

"Save" SHALL be unavailable while the value, without surrounding spaces, is empty or equal to the value the editor started with. "Save" SHALL close the editor and then:
- when the member shares a detail with that field and exactly that value: delete Bogdan's detail about the member for that field, if any, and show the toast "<Name> already shares this <field>";
- otherwise: give Bogdan's detail about the member for that field the new value, added today, creating it when he has none, and show the toast "<Field> added about <name>".

The detail is then shown in Bogdan's card under "INFO ABOUT <NAME> — ADDED BY OTHERS", unless it matches. A new detail SHALL go at the end of Bogdan's card, and an updated one SHALL keep its position.

Activating "Remove" on one of Bogdan's rows SHALL, without asking for confirmation, delete that detail and show the toast "Your <field> about <name> removed" without an action.

#### Scenario: Add the right email
- **WHEN** a reviewer in case E activates the edit control on Geo's Email, types "geo@swiftinvention.com" and activates "Save"
- **THEN** Geo still shares Email "geo.old@gmail.com", "INFO ABOUT GEO — ADDED BY OTHERS" shows Andrew's card with Phone and then "Bogdan (You)" with "Dad" and Email "geo@swiftinvention.com", the toast reads "Email added about Geo", and the briefing shows "Goal reached"

#### Scenario: A second edit updates the same detail
- **WHEN** the reviewer then edits Geo's Email again
- **THEN** the editor starts with "geo@swiftinvention.com", and after saving "geo@mail.com" Bogdan's card shows one Email, "geo@mail.com"

#### Scenario: The same value as shared
- **WHEN** a reviewer in case E adds Email "geo.old@gmail.com" through "+ Add info about Geo"
- **THEN** no card for Bogdan is shown and the toast reads "Geo already shares this email"

#### Scenario: Take back a detail
- **WHEN** a reviewer activates "Remove" on Bogdan's Email about Geo
- **THEN** Bogdan's card is no longer shown and the toast reads "Your email about Geo removed"
