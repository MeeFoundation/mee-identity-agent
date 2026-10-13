// People who joined a pod and invites that are not used yet. Telli is the pod's assistant, not a member.
// Dates are kept as whole days before the day the run started, so fixtures stay true on any day.

type MemberRole = 'owner' | 'viewer'

export type Member = {
  id: string
  name: string
  role: MemberRole
  joinedDaysAgo: number
}

export type PendingInvite = {
  id: string
  name: string
  link: string
  sentDaysAgo: number
}

const INVITE_LIFETIME_DAYS = 7

const LINK_PREFIX = 'pod.app/i/'

// The first link matches the design; later ones only need to differ.
const presetCodes = ['x7f2-4k9a', 'm3q8-2t6w', 'h5k1-9p3d', 'r8v4-6c2n', 'b2j7-5y9e']

const derivedCode = (index: number) => {
  const digits = ((index + 1) * 2654435761).toString(36).padStart(8, '0').slice(-8)
  return `${digits.slice(0, 4)}-${digits.slice(4)}`
}

export const nextInviteLink = (usedLinks: readonly string[]) => {
  const used = new Set(usedLinks)
  for (let index = 0; ; index++) {
    const link = `${LINK_PREFIX}${presetCodes[index] ?? derivedCode(index)}`
    if (!used.has(link)) return link
  }
}

export const FIRST_INVITE_LINK = `${LINK_PREFIX}${presetCodes[0]}`

export const memberCount = (members: readonly Member[], invites: readonly PendingInvite[]) =>
  members.length + invites.length

export const memberInitial = (name: string) => name.trim().charAt(0).toUpperCase()

export const daysBefore = (today: Date, days: number) =>
  new Date(today.getFullYear(), today.getMonth(), today.getDate() - days)

export const inviteSentOn = (invite: PendingInvite, today: Date) => daysBefore(today, invite.sentDaysAgo)

export const inviteExpiresOn = (invite: PendingInvite, today: Date) =>
  daysBefore(today, invite.sentDaysAgo - INVITE_LIFETIME_DAYS)

export const memberJoinedOn = (member: Member, today: Date) => daysBefore(today, member.joinedDaysAgo)

export type PendingLabel = { key: 'sentToday' } | { key: 'pendingFor'; count: number }

export const pendingLabel = (invite: PendingInvite): PendingLabel =>
  invite.sentDaysAgo === 0 ? { key: 'sentToday' } : { count: invite.sentDaysAgo, key: 'pendingFor' }

// "Sat, Oct 17" in English.
export const formatShortDate = (date: Date, language: string) =>
  new Intl.DateTimeFormat(language, { day: 'numeric', month: 'short', weekday: 'short' }).format(date)

// "September 21, 2026" in English.
export const formatLongDate = (date: Date, language: string) =>
  new Intl.DateTimeFormat(language, { dateStyle: 'long' }).format(date)

export const bogdan: Member = { id: 'bogdan', joinedDaysAgo: 60, name: 'Bogdan', role: 'owner' }

export const geo: Member = { id: 'geo', joinedDaysAgo: 21, name: 'Geo', role: 'viewer' }

export const geoInvite: PendingInvite = { id: 'geo', link: FIRST_INVITE_LINK, name: 'Geo', sentDaysAgo: 2 }
