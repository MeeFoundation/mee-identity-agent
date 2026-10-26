import { atom } from 'jotai'

import type { GingerPodComponents } from '../../pods/ginger/model'
import {
  type InviteRole,
  type Member,
  type MemberRole,
  memberCount,
  nextInviteLink,
  type PendingInvite,
} from '../../pods/people/sharing'

export type ScPet006ScreenId =
  | 'info'
  | 'members'
  | 'invite-name'
  | 'invite-share'
  | 'medical'
  | 'give-dose'
  | 'dose-history'

export type ScPet006Components = GingerPodComponents

// What completes the run: sending an invite, reading the dose history, or giving the due dose.
export type ScPet006Goal = 'invite' | 'history' | 'dose'

export type ScPet006InitialState = {
  // The person using the app: Sam, the owner, or Geo, the sitter, with the given access.
  readonly access?: MemberRole
  readonly goal?: ScPet006Goal
}

export const sam: Member = { id: 'sam', joinedDaysAgo: 40, name: 'Sam', role: 'owner' }

const SITTER_NAME = 'Geo'

export const sitter = (role: InviteRole): Member => ({ id: 'geo', joinedDaysAgo: 1, name: SITTER_NAME, role })

export const DEFAULT_ACCESS: MemberRole = 'owner'

export const DEFAULT_INVITE_ROLE: InviteRole = 'logger'

// The day the run started; invite dates count from it.
export const todayAtom = atom(new Date())

export const accessAtom = atom<MemberRole>(DEFAULT_ACCESS)

export const goalAtom = atom<ScPet006Goal>('invite')

export const membersAtom = atom<readonly Member[]>([sam])

export const invitesAtom = atom<readonly PendingInvite[]>([])

// Every link handed out in the run, so a new invite never reuses one.
export const usedLinksAtom = atom<readonly string[]>([])

export const selectedInviteIdAtom = atom<string | null>(null)

export const selectedInviteAtom = atom(
  (get) => get(invitesAtom).find((invite) => invite.id === get(selectedInviteIdAtom)) ?? null,
)

export const memberCountAtom = atom((get) => memberCount(get(membersAtom), get(invitesAtom)))

// The name of the person an invite link was just sent to; shown on Members as a toast.
export const sentToastAtom = atom<string | null>(null)

// The toast on Medical after the dose is given or undone.
export const doseToastAtom = atom<'given' | 'undone' | null>(null)

export const createInviteAtom = atom(null, (get, set, { name, role }: { name: string; role: InviteRole }) => {
  const link = nextInviteLink(get(usedLinksAtom))
  const invite: PendingInvite = { id: link, link, name: name.trim(), role, sentDaysAgo: 0 }
  set(invitesAtom, [...get(invitesAtom), invite])
  set(usedLinksAtom, [...get(usedLinksAtom), link])
  set(selectedInviteIdAtom, invite.id)
})

export const markInviteSentAtom = atom(null, (get, set) => {
  const invite = get(selectedInviteAtom)
  if (invite) set(sentToastAtom, invite.name)
})
