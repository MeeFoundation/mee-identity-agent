import { atom } from 'jotai'

import type { DefaultComponents } from '@/shared/ui/default-components'
import type { PodComponents } from '@/shared/ui/pod-components'

import {
  addShared,
  adopt,
  bogdanInfo,
  editShared,
  findAdded,
  type InfoField,
  keepBoth,
  type MemberInfo,
  removeAdded,
  removeDetailBy,
  replace,
  setDetailAbout,
} from '../../pods/people/member-info'
import { bogdan, type Member, memberCount, nextInviteLink, type PendingInvite } from '../../pods/people/sharing'

export type ScPpl002ScreenId =
  | 'info'
  | 'members'
  | 'invite-name'
  | 'invite-share'
  | 'invite-detail'
  | 'member-detail'
  | 'remove-confirm'
  | 'my-info'
  | 'suggestion-actions'
  | 'adopt-conflict'

export type ScPpl002Components = DefaultComponents & PodComponents

export type ScPpl002InitialState = {
  members?: readonly Member[]
  invites?: readonly PendingInvite[]
  // Keyed by member id. Bogdan's own info is added in every case.
  memberInfo?: Readonly<Record<string, MemberInfo>>
}

// Bogdan owns the pod; Telli is always listed and never counted.
export const DEFAULT_MEMBERS: readonly Member[] = [bogdan]

// The day the run started; every date on screen counts from it.
export const todayAtom = atom(new Date())

export const membersAtom = atom<readonly Member[]>(DEFAULT_MEMBERS)

export const invitesAtom = atom<readonly PendingInvite[]>([])

// Every link handed out in the run, revoked ones included, so a new invite never reuses one.
export const usedLinksAtom = atom<readonly string[]>([])

export const memberCountAtom = atom((get) => memberCount(get(membersAtom), get(invitesAtom)))

export const selectedInviteIdAtom = atom<string | null>(null)

export const selectedInviteAtom = atom(
  (get) => get(invitesAtom).find((invite) => invite.id === get(selectedInviteIdAtom)) ?? null,
)

export const selectedMemberIdAtom = atom<string | null>(null)

// Only people who were invited can be opened; the owner cannot remove themselves.
export const selectedMemberAtom = atom(
  (get) =>
    get(membersAtom).find((member) => member.role === 'viewer' && member.id === get(selectedMemberIdAtom)) ?? null,
)

export type MembersToast =
  | { kind: 'sent'; name: string }
  | { kind: 'revoked'; invite: PendingInvite; index: number }
  | { kind: 'removed'; name: string }

export const toastAtom = atom<MembersToast | null>(null)

export const createInviteAtom = atom(null, (get, set, name: string) => {
  const link = nextInviteLink(get(usedLinksAtom))
  const invite: PendingInvite = { id: link, link, name: name.trim(), sentDaysAgo: 0 }
  set(invitesAtom, [...get(invitesAtom), invite])
  set(usedLinksAtom, [...get(usedLinksAtom), link])
  set(selectedInviteIdAtom, invite.id)
})

export const markInviteSentAtom = atom(null, (get, set) => {
  const invite = get(selectedInviteAtom)
  if (invite) set(toastAtom, { kind: 'sent', name: invite.name })
})

export const revokeInviteAtom = atom(null, (get, set) => {
  const invites = get(invitesAtom)
  const index = invites.findIndex((invite) => invite.id === get(selectedInviteIdAtom))
  const invite = invites[index]
  if (!invite) return
  set(
    invitesAtom,
    invites.filter((_, position) => position !== index),
  )
  set(selectedInviteIdAtom, null)
  set(toastAtom, { index, invite, kind: 'revoked' })
})

export const undoRevokeAtom = atom(null, (get, set) => {
  const toast = get(toastAtom)
  if (toast?.kind !== 'revoked') return
  const invites = [...get(invitesAtom)]
  invites.splice(toast.index, 0, toast.invite)
  set(invitesAtom, invites)
  set(toastAtom, null)
})

export const removeMemberAtom = atom(null, (get, set) => {
  const member = get(selectedMemberAtom)
  if (!member) return
  set(
    membersAtom,
    get(membersAtom).filter(({ id }) => id !== member.id),
  )
  set(selectedMemberIdAtom, null)
  set(toastAtom, { kind: 'removed', name: member.name })
})

export const memberInfoAtom = atom<Readonly<Record<string, MemberInfo>>>({ [bogdan.id]: bogdanInfo })

const noInfo: MemberInfo = { addedByOthers: [], shared: [] }

export const infoOf = (memberInfo: Readonly<Record<string, MemberInfo>>, memberId: string) =>
  memberInfo[memberId] ?? noInfo

// What Bogdan, the person using the app, shares and what others added about him.
export const myInfoAtom = atom(
  (get) => get(memberInfoAtom)[bogdan.id] ?? bogdanInfo,
  (get, set, info: MemberInfo) => set(memberInfoAtom, { ...get(memberInfoAtom), [bogdan.id]: info }),
)

export const selectedDetailIdAtom = atom<string | null>(null)

export const selectedDetailAtom = atom((get) => {
  const detailId = get(selectedDetailIdAtom)
  return detailId === null ? null : (findAdded(get(myInfoAtom), detailId) ?? null)
})

// The shared detail an adopted one would clash with, or `null` when there is no clash.
export const selectedConflictAtom = atom((get) => {
  const detailId = get(selectedDetailIdAtom)
  if (detailId === null) return null
  const result = adopt(get(myInfoAtom), detailId)
  return result?.kind === 'conflict' ? result : null
})

export type InfoToast =
  | { kind: 'copied' | 'added' | 'replaced' | 'updated'; field: InfoField }
  | { kind: 'removed'; field: InfoField; addedBy: string }
  | { kind: 'addedAbout' | 'alreadyShared' | 'removedMine'; field: InfoField; memberId: string }

export const infoToastAtom = atom<InfoToast | null>(null)

export const copyDetailAtom = atom(null, (get, set) => {
  const detail = get(selectedDetailAtom)
  if (!detail) return
  set(selectedDetailIdAtom, null)
  set(infoToastAtom, { field: detail.field, kind: 'copied' })
})

// Adds the detail when Bogdan shares nothing with its field; otherwise leaves everything as is for the conflict sheet.
export const adoptDetailAtom = atom(null, (get, set) => {
  const detail = get(selectedDetailAtom)
  if (!detail) return null
  const result = adopt(get(myInfoAtom), detail.id)
  if (result?.kind !== 'added') return result?.kind ?? null
  set(myInfoAtom, result.info)
  set(selectedDetailIdAtom, null)
  set(infoToastAtom, { field: detail.field, kind: 'added' })
  return result.kind
})

const resolveConflictAtom = atom(null, (get, set, how: 'keep-both' | 'replace') => {
  const conflict = get(selectedConflictAtom)
  if (!conflict) return
  const info = get(myInfoAtom)
  const { added } = conflict
  set(myInfoAtom, how === 'keep-both' ? keepBoth(info, added.id) : replace(info, added.id))
  set(selectedDetailIdAtom, null)
  set(infoToastAtom, { field: added.field, kind: how === 'keep-both' ? 'added' : 'replaced' })
})

export const keepBothAtom = atom(null, (_get, set) => set(resolveConflictAtom, 'keep-both'))

export const replaceDetailAtom = atom(null, (_get, set) => set(resolveConflictAtom, 'replace'))

export const removeDetailAtom = atom(null, (get, set) => {
  const detail = get(selectedDetailAtom)
  if (!detail) return
  set(myInfoAtom, removeAdded(get(myInfoAtom), detail.id))
  set(selectedDetailIdAtom, null)
  set(infoToastAtom, { addedBy: detail.addedBy, field: detail.field, kind: 'removed' })
})

export const editMySharedAtom = atom(null, (get, set, detailId: string, value: string) => {
  const detail = get(myInfoAtom).shared.find(({ id }) => id === detailId)
  if (!detail) return
  set(myInfoAtom, editShared(get(myInfoAtom), detailId, value))
  set(infoToastAtom, { field: detail.field, kind: 'updated' })
})

export const addMySharedAtom = atom(null, (get, set, field: InfoField, value: string) => {
  set(myInfoAtom, addShared(get(myInfoAtom), field, value))
  set(infoToastAtom, { field, kind: 'added' })
})

// Bogdan's own detail about another member; their shared info never changes.
export const saveDetailAboutAtom = atom(null, (get, set, memberId: string, field: InfoField, value: string) => {
  const memberInfo = get(memberInfoAtom)
  const result = setDetailAbout(infoOf(memberInfo, memberId), bogdan.id, field, value)
  set(memberInfoAtom, { ...memberInfo, [memberId]: result.info })
  set(infoToastAtom, { field, kind: result.outcome === 'added' ? 'addedAbout' : 'alreadyShared', memberId })
  return result.outcome
})

export const removeMyDetailAboutAtom = atom(null, (get, set, memberId: string, field: InfoField) => {
  const memberInfo = get(memberInfoAtom)
  set(memberInfoAtom, { ...memberInfo, [memberId]: removeDetailBy(infoOf(memberInfo, memberId), bogdan.id, field) })
  set(infoToastAtom, { field, kind: 'removedMine', memberId })
})
