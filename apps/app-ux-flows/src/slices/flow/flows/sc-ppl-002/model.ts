import { atom } from 'jotai'

import type { DefaultComponents } from '@/shared/ui/default-components'
import type { PodComponents } from '@/shared/ui/pod-components'

import { bogdan, type Member, memberCount, nextInviteLink, type PendingInvite } from '../../pods/people/sharing'

export type ScPpl002ScreenId =
  | 'info'
  | 'members'
  | 'invite-name'
  | 'invite-share'
  | 'invite-detail'
  | 'member-detail'
  | 'remove-confirm'

export type ScPpl002Components = DefaultComponents & PodComponents

export type ScPpl002InitialState = {
  members?: readonly Member[]
  invites?: readonly PendingInvite[]
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
