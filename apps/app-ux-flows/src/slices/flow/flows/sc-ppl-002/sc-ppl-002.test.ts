import { describe, expect, it } from 'vitest'

import { en } from '@/app/locales/en'

import { FIRST_INVITE_LINK } from '../../pods/people/sharing'
import { findFlow } from '../../registry'
import { resolveFlow } from '../../runtime/resolve-flow'
import { scPpl002Flow } from './flow'
import {
  createInviteAtom,
  invitesAtom,
  markInviteSentAtom,
  memberCountAtom,
  membersAtom,
  removeMemberAtom,
  revokeInviteAtom,
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

describe('SC-PPL-002 Invite someone to Sofia’s pod', () => {
  it('is a registered showcase with three cases, all starting on Info', () => {
    expect(scPpl002Flow.kind).toBe('showcase')
    expect(scPpl002Flow.code).toBe('SC-PPL-002')
    expect(scPpl002Flow.initialScreen).toBe('info')
    expect(findFlow('sc-ppl-002')).toBe(scPpl002Flow)
    expect(resolveFlow(scPpl002Flow, null).cases.map(({ id, code }) => [id, code])).toEqual([
      ['a', 'SC-PPL-002-A'],
      ['b', 'SC-PPL-002-B'],
      ['c', 'SC-PPL-002-C'],
    ])
  })

  it('declares its screens and the Figma frames they implement', () => {
    expect(Object.keys(scPpl002Flow.screens).sort()).toEqual([
      'info',
      'invite-detail',
      'invite-name',
      'invite-share',
      'member-detail',
      'members',
      'remove-confirm',
    ])
    expect(
      Object.fromEntries(Object.entries(scPpl002Flow.designFrames ?? {}).map(([id, frame]) => [id, frame?.name])),
    ).toEqual({ info: 'Pod - 6', 'invite-name': 'Modal', 'invite-share': 'Modal', members: 'Pod - 7' })
  })

  it('translates every key it declares', () => {
    const resolved = ['a', 'b', 'c'].map((caseId) => resolveFlow(scPpl002Flow, null, caseId))
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

  it('never lets the owner be opened or removed', () => {
    const store = caseRun('c')
    store.set(selectedMemberIdAtom, 'bogdan')
    expect(store.get(selectedMemberAtom)).toBeNull()
    store.set(removeMemberAtom)
    expect(memberIds(store)).toEqual(['bogdan', 'geo'])
  })
})
