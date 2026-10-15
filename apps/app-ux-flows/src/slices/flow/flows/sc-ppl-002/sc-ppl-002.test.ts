import { Children, type ReactNode } from 'react'
import { describe, expect, it } from 'vitest'

import { en } from '@/app/locales/en'

import { addedByPerson, bogdanInfo, sharedRole } from '../../pods/people/member-info'
import { FIRST_INVITE_LINK } from '../../pods/people/sharing'
import { findFlow } from '../../registry'
import { renderScreen } from '../../runtime/render-screen'
import { resolveFlow } from '../../runtime/resolve-flow'
import { scPpl002Flow } from './flow'
import {
  addMySharedAtom,
  adoptDetailAtom,
  copyDetailAtom,
  createInviteAtom,
  editMySharedAtom,
  infoOf,
  infoToastAtom,
  invitesAtom,
  keepBothAtom,
  markInviteSentAtom,
  memberCountAtom,
  memberInfoAtom,
  membersAtom,
  myInfoAtom,
  removeDetailAtom,
  removeMemberAtom,
  removeMyDetailAboutAtom,
  replaceDetailAtom,
  revokeInviteAtom,
  saveDetailAboutAtom,
  selectedConflictAtom,
  selectedDetailAtom,
  selectedDetailIdAtom,
  selectedInviteAtom,
  selectedInviteIdAtom,
  selectedMemberAtom,
  selectedMemberIdAtom,
  toastAtom,
  undoRevokeAtom,
} from './model'

// Resolves an i18next key such as `flows.scPpl002.title` against the English strings.
const translate = (key: string): unknown =>
  key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], en)

const caseRun = (caseId: string) => resolveFlow(scPpl002Flow, null, caseId).createStore()

const memberIds = (store: ReturnType<typeof caseRun>) => store.get(membersAtom).map(({ id }) => id)

const sharedValues = (store: ReturnType<typeof caseRun>) =>
  store.get(myInfoAtom).shared.map(({ field, value }) => `${field}:${value}`)

// Only the details added by others that are shown: adopted ones stay stored but hidden.
const addedIds = (store: ReturnType<typeof caseRun>) =>
  addedByPerson(store.get(myInfoAtom)).flatMap(({ details }) => details.map(({ id }) => id))

const shownAbout = (store: ReturnType<typeof caseRun>, memberId: string) =>
  addedByPerson(infoOf(store.get(memberInfoAtom), memberId)).map(({ addedBy, details }) => [
    addedBy,
    details.map(({ field, value }) => `${field}:${value}`),
  ])

// Case D with one of Geo's details selected, as after "More actions" on it.
const caseDWith = (detailId: string) => {
  const store = caseRun('d')
  store.set(selectedDetailIdAtom, detailId)
  return store
}

// The real sheet only renders its content once open in a browser.
const InlineSheet = ({ children }: { children: ReactNode }) => children

// Renders a sheet with its buttons captured, so a test can activate one by its label.
const renderSheet = (screenId: 'suggestion-actions' | 'adopt-conflict', store: ReturnType<typeof caseRun>) => {
  const buttons = new Map<string, () => void>()
  const Button = ({ children, onClick }: { children: ReactNode; onClick: () => void }) => {
    const label = Children.toArray(children)
      .filter((child) => typeof child === 'string')
      .join('')
    if (label) buttons.set(label, onClick)
    return null
  }
  const effects = renderScreen(resolveFlow(scPpl002Flow, null, 'd'), screenId, {
    components: { BottomSheet: InlineSheet, Button },
    store,
  })
  const click = (label: string) => {
    const onClick = buttons.get(label)
    if (!onClick) throw new Error(`No button "${label}"`)
    onClick()
  }
  return { click, effects }
}

// Renders an info screen with its section labels, people and buttons captured.
const renderInfo = (screenId: 'my-info' | 'member-detail', store: ReturnType<typeof caseRun>) => {
  const labels: string[] = []
  const people: string[] = []
  const buttons = new Map<string, () => void>()
  const SectionLabel = ({ children }: { children: string }) => {
    labels.push(children)
    return null
  }
  const MemberRow = ({ name }: { name: string }) => {
    people.push(name)
    return null
  }
  const Button = ({ children, onClick }: { children: ReactNode; onClick: () => void }) => {
    const label = Children.toArray(children)
      .filter((child) => typeof child === 'string')
      .join('')
    if (label) buttons.set(label, onClick)
    return null
  }
  const effects = renderScreen(resolveFlow(scPpl002Flow, null, 'e'), screenId, {
    components: { Button, MemberRow, SectionLabel },
    store,
  })
  return { buttons, effects, labels, people }
}

const openGeo = (caseId: string) => {
  const store = caseRun(caseId)
  store.set(selectedMemberIdAtom, 'geo')
  return store
}

describe('SC-PPL-002 Invite someone to Sofia’s pod', () => {
  it('is a registered showcase with five cases, all starting on Info', () => {
    expect(scPpl002Flow.kind).toBe('showcase')
    expect(scPpl002Flow.code).toBe('SC-PPL-002')
    expect(scPpl002Flow.initialScreen).toBe('info')
    expect(findFlow('sc-ppl-002')).toBe(scPpl002Flow)
    expect(resolveFlow(scPpl002Flow, null).cases.map(({ id, code }) => [id, code])).toEqual([
      ['a', 'SC-PPL-002-A'],
      ['b', 'SC-PPL-002-B'],
      ['c', 'SC-PPL-002-C'],
      ['d', 'SC-PPL-002-D'],
      ['e', 'SC-PPL-002-E'],
    ])
  })

  it('declares its screens and the Figma frames they implement', () => {
    expect(Object.keys(scPpl002Flow.screens).sort()).toEqual([
      'adopt-conflict',
      'info',
      'invite-detail',
      'invite-name',
      'invite-share',
      'member-detail',
      'members',
      'my-info',
      'remove-confirm',
      'suggestion-actions',
    ])
    expect(
      Object.fromEntries(Object.entries(scPpl002Flow.designFrames ?? {}).map(([id, frame]) => [id, frame?.name])),
    ).toEqual({
      info: 'SC-PPL-002-A - About Sofia (info)',
      'invite-detail': "SC-PPL-002-B - Geo's invite (sheet)",
      'invite-name': 'SC-PPL-002-A - Invite name (sheet)',
      'invite-share': 'SC-PPL-002-A - Share invite link (sheet)',
      'member-detail': 'Bogdan (You) - info shared',
      members: 'SC-PPL-002-A - Members',
      'my-info': 'Bogdan (You) - info shared',
      'remove-confirm': 'SC-PPL-002-C - Remove Geo (confirm sheet)',
      'suggestion-actions': 'Shared info actions (modal)',
    })
    expect(scPpl002Flow.designFrames?.['my-info']?.url).toContain('node-id=38-2883')
    expect(scPpl002Flow.designFrames?.['member-detail']?.url).toContain('node-id=38-2883')
    expect(scPpl002Flow.designFrames?.['suggestion-actions']?.url).toContain('node-id=119-9506')
  })

  it('translates every key it declares', () => {
    const resolved = ['a', 'b', 'c', 'd', 'e'].map((caseId) => resolveFlow(scPpl002Flow, null, caseId))
    const keys = resolved.flatMap((flow) => [
      flow.titleKey,
      flow.descriptionKey,
      flow.goalKey,
      flow.caseNameKey,
      ...Object.values(flow.hints),
      ...flow.notes.flow.questionKeys,
      flow.notes.case?.aboutKey,
      ...(flow.notes.case?.questionKeys ?? []),
      ...Object.values(flow.notes.screens).flatMap((note) => [note?.aboutKey, ...(note?.questionKeys ?? [])]),
    ])
    for (const key of keys) expect(typeof translate(key ?? ''), String(key)).toBe('string')
    expect(resolved[0]?.notes.flow.questionKeys).toHaveLength(4)
  })

  it('explains every screen, and lists two questions on invite-detail', () => {
    const caseB = resolveFlow(scPpl002Flow, null, 'b')
    for (const screenId of Object.keys(scPpl002Flow.screens) as (keyof typeof caseB.notes.screens)[]) {
      expect(caseB.notes.screens[screenId]?.aboutKey, screenId).toBeTruthy()
    }
    expect(caseB.notes.screens['invite-detail']?.questionKeys).toHaveLength(2)
  })

  it('starts each case with its own members and invites', () => {
    const a = caseRun('a')
    expect(memberIds(a)).toEqual(['bogdan'])
    expect(a.get(invitesAtom)).toEqual([])
    expect(a.get(memberCountAtom)).toBe(1)

    const b = caseRun('b')
    expect(memberIds(b)).toEqual(['bogdan'])
    expect(b.get(invitesAtom).map(({ name, link, sentDaysAgo }) => [name, link, sentDaysAgo])).toEqual([
      ['Geo', FIRST_INVITE_LINK, 2],
    ])
    expect(b.get(memberCountAtom)).toBe(2)

    const c = caseRun('c')
    expect(memberIds(c)).toEqual(['bogdan', 'geo'])
    expect(c.get(invitesAtom)).toEqual([])
    expect(c.get(memberCountAtom)).toBe(2)

    const d = caseRun('d')
    expect(memberIds(d)).toEqual(['bogdan', 'geo', 'andrew'])
    expect(d.get(invitesAtom)).toEqual([])
    expect(d.get(memberCountAtom)).toBe(3)

    const e = caseRun('e')
    expect(memberIds(e)).toEqual(['bogdan', 'geo', 'andrew'])
    expect(e.get(invitesAtom)).toEqual([])
  })

  it("starts case E with Geo's old email and Andrew's phone number about Geo", () => {
    const store = caseRun('e')
    expect(store.get(myInfoAtom)).toEqual(bogdanInfo)
    expect(infoOf(store.get(memberInfoAtom), 'geo').shared.map(({ field, value }) => `${field}:${value}`)).toEqual([
      'role:Mum',
      'email:geo.old@gmail.com',
    ])
    expect(shownAbout(store, 'geo')).toEqual([['andrew', ['phone:+447700900123']]])
  })

  it("gives Bogdan his own info in every case, and only case D others' Roles and details about him", () => {
    for (const caseId of ['a', 'b', 'c']) {
      const store = caseRun(caseId)
      expect(store.get(myInfoAtom), caseId).toEqual(bogdanInfo)
      expect(sharedRole(store.get(memberInfoAtom).geo), caseId).toBeNull()
    }

    const d = caseRun('d')
    const info = d.get(memberInfoAtom)
    expect(d.get(myInfoAtom).shared).toEqual(bogdanInfo.shared)
    expect(['bogdan', 'geo', 'andrew'].map((id) => sharedRole(info[id]))).toEqual(['Dad', 'Mum', 'Uncle'])
    expect(
      addedByPerson(d.get(myInfoAtom)).map(({ addedBy, details }) => [addedBy, details.map(({ value }) => value)]),
    ).toEqual([['geo', ['bogdan@gmail.com', '+4244235355']]])
  })

  it('copies a detail without changing anything', () => {
    const store = caseDWith('geo-bogdan-phone')
    store.set(copyDetailAtom)
    expect(store.get(myInfoAtom).addedByOthers).toHaveLength(2)
    expect(store.get(infoToastAtom)).toEqual({ field: 'phone', kind: 'copied' })
  })

  it('adds a detail with a new field to the end', () => {
    const store = caseDWith('geo-bogdan-phone')
    expect(store.set(adoptDetailAtom)).toBe('added')
    expect(sharedValues(store).at(-1)).toBe('phone:+4244235355')
    expect(addedIds(store)).toEqual(['geo-bogdan-email'])
    expect(store.get(infoToastAtom)).toEqual({ field: 'phone', kind: 'added' })
  })

  it('leaves an email Bogdan already shares to the conflict sheet', () => {
    const store = caseDWith('geo-bogdan-email')
    expect(store.set(adoptDetailAtom)).toBe('conflict')
    expect(addedIds(store)).toEqual(['geo-bogdan-email', 'geo-bogdan-phone'])
    expect(store.get(selectedConflictAtom)?.yours.value).toBe('bhutuleac@swiftinvention.com')
    expect(store.get(infoToastAtom)).toBeNull()
  })

  it('keeps both emails, the new one right after the old one', () => {
    const store = caseDWith('geo-bogdan-email')
    store.set(keepBothAtom)
    expect(sharedValues(store)).toEqual([
      'firstName:Bogdan',
      'role:Dad',
      'email:bhutuleac@swiftinvention.com',
      'email:bogdan@gmail.com',
      'address:318 Fillmore St, Apt 4B',
    ])
    expect(addedIds(store)).toEqual(['geo-bogdan-phone'])
    expect(store.get(infoToastAtom)).toEqual({ field: 'email', kind: 'added' })
  })

  it('replaces the email in place', () => {
    const store = caseDWith('geo-bogdan-email')
    store.set(replaceDetailAtom)
    expect(sharedValues(store)[2]).toBe('email:bogdan@gmail.com')
    expect(sharedValues(store)).toHaveLength(4)
    expect(addedIds(store)).toEqual(['geo-bogdan-phone'])
    expect(store.get(infoToastAtom)).toEqual({ field: 'email', kind: 'replaced' })
  })

  it('removes a detail and leaves the shared info alone', () => {
    const store = caseDWith('geo-bogdan-email')
    store.set(removeDetailAtom)
    expect(addedIds(store)).toEqual(['geo-bogdan-phone'])
    expect(store.get(myInfoAtom).shared).toEqual(bogdanInfo.shared)
    expect(store.get(infoToastAtom)).toEqual({ addedBy: 'geo', field: 'email', kind: 'removed' })
  })

  it('edits and adds to the info Bogdan shares, with a toast for each', () => {
    const store = caseRun('a')
    store.set(editMySharedAtom, 'bogdan-address', '12 Pine St')
    expect(sharedValues(store)[3]).toBe('address:12 Pine St')
    expect(store.get(infoToastAtom)).toEqual({ field: 'address', kind: 'updated' })

    store.set(addMySharedAtom, 'phone', '+1')
    expect(sharedValues(store).at(-1)).toBe('phone:+1')
    expect(store.get(infoToastAtom)).toEqual({ field: 'phone', kind: 'added' })
  })

  it('hides a detail added by others once Bogdan shares the same value, and shows it again after he changes it', () => {
    const store = caseDWith('geo-bogdan-email')
    store.set(replaceDetailAtom)
    expect(addedIds(store)).toEqual(['geo-bogdan-phone'])

    const emailId = store.get(myInfoAtom).shared[2]?.id ?? ''
    store.set(editMySharedAtom, emailId, 'bhutuleac@swiftinvention.com')
    expect(addedIds(store)).toEqual(['geo-bogdan-email', 'geo-bogdan-phone'])
  })

  it("adds Bogdan's detail about Geo without changing what Geo shares, and a second save updates it", () => {
    const store = caseRun('e')
    expect(store.set(saveDetailAboutAtom, 'geo', 'email', 'geo@swiftinvention.com')).toBe('added')
    expect(infoOf(store.get(memberInfoAtom), 'geo').shared.at(-1)?.value).toBe('geo.old@gmail.com')
    expect(shownAbout(store, 'geo')).toEqual([
      ['andrew', ['phone:+447700900123']],
      ['bogdan', ['email:geo@swiftinvention.com']],
    ])
    expect(store.get(infoToastAtom)).toEqual({ field: 'email', kind: 'addedAbout', memberId: 'geo' })

    store.set(saveDetailAboutAtom, 'geo', 'email', 'geo@mail.com')
    expect(shownAbout(store, 'geo')).toEqual([
      ['andrew', ['phone:+447700900123']],
      ['bogdan', ['email:geo@mail.com']],
    ])
  })

  it("drops Bogdan's detail when Geo already shares the value, and can take one back", () => {
    const store = caseRun('e')
    store.set(saveDetailAboutAtom, 'geo', 'email', 'geo@swiftinvention.com')
    expect(store.set(saveDetailAboutAtom, 'geo', 'email', 'geo.old@gmail.com')).toBe('matches')
    expect(shownAbout(store, 'geo')).toEqual([['andrew', ['phone:+447700900123']]])
    expect(store.get(infoToastAtom)).toEqual({ field: 'email', kind: 'alreadyShared', memberId: 'geo' })

    store.set(saveDetailAboutAtom, 'geo', 'address', '1 Main St')
    store.set(removeMyDetailAboutAtom, 'geo', 'address')
    expect(shownAbout(store, 'geo')).toEqual([['andrew', ['phone:+447700900123']]])
    expect(store.get(infoToastAtom)).toEqual({ field: 'address', kind: 'removedMine', memberId: 'geo' })
  })

  it('adds a detail about a member who shares nothing yet', () => {
    const store = caseRun('c')
    store.set(saveDetailAboutAtom, 'geo', 'firstName', 'Georgiana')
    expect(shownAbout(store, 'geo')).toEqual([['bogdan', ['firstName:Georgiana']]])
  })

  it('has no detail to act on in a new run', () => {
    const store = caseRun('d')
    expect(store.get(selectedDetailAtom)).toBeNull()
    expect(store.get(selectedConflictAtom)).toBeNull()
  })

  it('completes the run on add and remove, but not on copy', () => {
    const copy = renderSheet('suggestion-actions', caseDWith('geo-bogdan-phone'))
    copy.click('Copy value')
    expect(copy.effects).toMatchObject({ completed: false, navigations: ['my-info'] })

    const add = renderSheet('suggestion-actions', caseDWith('geo-bogdan-phone'))
    add.click('Add to info I share')
    expect(add.effects).toMatchObject({ completed: true, navigations: ['my-info'] })

    const remove = renderSheet('suggestion-actions', caseDWith('geo-bogdan-phone'))
    remove.click('This isn’t right, remove it')
    expect(remove.effects).toMatchObject({ completed: true, navigations: ['my-info'] })
  })

  it('opens the conflict sheet for a known field without completing, and completes on Keep both or Replace but not Cancel', () => {
    const add = renderSheet('suggestion-actions', caseDWith('geo-bogdan-email'))
    add.click('Add to info I share')
    expect(add.effects).toMatchObject({ completed: false, navigations: ['adopt-conflict'] })

    const keep = renderSheet('adopt-conflict', caseDWith('geo-bogdan-email'))
    keep.click('Keep both')
    expect(keep.effects).toMatchObject({ completed: true, navigations: ['my-info'] })

    const replace = renderSheet('adopt-conflict', caseDWith('geo-bogdan-email'))
    replace.click('Replace bhutuleac@swiftinvention.com')
    expect(replace.effects).toMatchObject({ completed: true, navigations: ['my-info'] })

    const cancel = renderSheet('adopt-conflict', caseDWith('geo-bogdan-email'))
    cancel.click('Cancel')
    expect(cancel.effects).toMatchObject({ completed: false, navigations: ['my-info'] })
  })

  it('creates an invite with the first link, counts it, and toasts once it is sent', () => {
    const store = caseRun('a')
    store.set(createInviteAtom, '  Geo ')
    const invite = store.get(selectedInviteAtom)
    expect(invite).toMatchObject({ link: FIRST_INVITE_LINK, name: 'Geo', sentDaysAgo: 0 })
    expect(store.get(memberCountAtom)).toBe(2)
    expect(store.get(toastAtom)).toBeNull()

    store.set(markInviteSentAtom)
    expect(store.get(toastAtom)).toEqual({ kind: 'sent', name: 'Geo' })
  })

  it('gives every later invite a new link, even after one was revoked', () => {
    const store = caseRun('b')
    store.set(selectedInviteIdAtom, 'geo')
    store.set(revokeInviteAtom)
    store.set(createInviteAtom, 'Ana')
    expect(store.get(selectedInviteAtom)?.link).not.toBe(FIRST_INVITE_LINK)
  })

  it('revokes a pending invite, and Undo puts it back unchanged', () => {
    const store = caseRun('b')
    const [original] = store.get(invitesAtom)
    store.set(selectedInviteIdAtom, 'geo')
    store.set(revokeInviteAtom)
    expect(store.get(invitesAtom)).toEqual([])
    expect(store.get(memberCountAtom)).toBe(1)
    expect(store.get(toastAtom)).toMatchObject({ kind: 'revoked' })

    store.set(undoRevokeAtom)
    expect(store.get(invitesAtom)).toEqual([original])
    expect(store.get(memberCountAtom)).toBe(2)
    expect(store.get(toastAtom)).toBeNull()
  })

  it('removes a member for good', () => {
    const store = caseRun('c')
    store.set(selectedMemberIdAtom, 'geo')
    expect(store.get(selectedMemberAtom)?.name).toBe('Geo')
    store.set(removeMemberAtom)
    expect(memberIds(store)).toEqual(['bogdan'])
    expect(store.get(memberCountAtom)).toBe(1)
    expect(store.get(toastAtom)).toEqual({ kind: 'removed', name: 'Geo' })
  })

  it("shows Geo's info as Bogdan sees it, with Remove from pod at the bottom", () => {
    const geoScreen = renderInfo('member-detail', openGeo('c'))
    expect(geoScreen.labels).toEqual(['0 info shared by Geo'])
    expect([...geoScreen.buttons.keys()]).toEqual(['Add info about Geo', 'Remove from pod'])
    geoScreen.buttons.get('Remove from pod')?.()
    expect(geoScreen.effects.navigations).toEqual(['remove-confirm'])
  })

  it("lists everyone's details about Geo, with Bogdan as (You)", () => {
    const store = openGeo('e')
    store.set(saveDetailAboutAtom, 'geo', 'email', 'geo@swiftinvention.com')
    const geoScreen = renderInfo('member-detail', store)
    expect(geoScreen.labels).toEqual(['2 info shared by Geo', 'Info about Geo — Added by others'])
    expect(geoScreen.people).toEqual(['Andrew', 'Bogdan (You)'])
  })

  it('never offers to remove Bogdan from his own screen', () => {
    const mine = renderInfo('my-info', caseRun('d'))
    expect(mine.labels).toEqual(['4 info shared in this pod', 'Info about you — Added by others'])
    expect(mine.people).toEqual(['Geo'])
    expect([...mine.buttons.keys()]).toEqual(['Add personal info'])
  })

  it('never lets the owner be opened or removed', () => {
    const store = caseRun('c')
    store.set(selectedMemberIdAtom, 'bogdan')
    expect(store.get(selectedMemberAtom)).toBeNull()
    store.set(removeMemberAtom)
    expect(memberIds(store)).toEqual(['bogdan', 'geo'])
  })
})
