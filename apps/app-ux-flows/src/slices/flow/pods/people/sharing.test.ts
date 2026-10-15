import { describe, expect, it } from 'vitest'

import {
  bogdan,
  FIRST_INVITE_LINK,
  formatShortDate,
  geo,
  geoInvite,
  inviteExpiresOn,
  inviteSentOn,
  memberCount,
  nextInviteLink,
  pendingLabel,
} from './sharing'

const today = new Date(2026, 9, 12)

describe('memberCount', () => {
  it('counts people and pending invites, never Telli', () => {
    expect(memberCount([bogdan], [])).toBe(1)
    expect(memberCount([bogdan], [geoInvite])).toBe(2)
    expect(memberCount([bogdan, geo], [])).toBe(2)
  })
})

describe('pendingLabel', () => {
  it('says "sent today" on the day the invite was sent', () => {
    expect(pendingLabel({ ...geoInvite, sentDaysAgo: 0 })).toEqual({ key: 'sentToday' })
  })

  it('counts the days the invite has been pending', () => {
    expect(pendingLabel({ ...geoInvite, sentDaysAgo: 1 })).toEqual({ count: 1, key: 'pendingFor' })
    expect(pendingLabel(geoInvite)).toEqual({ count: 2, key: 'pendingFor' })
  })
})

describe('invite dates', () => {
  it('expires seven days after the invite was sent', () => {
    expect(formatShortDate(inviteSentOn(geoInvite, today), 'en')).toBe('Sat, Oct 10')
    expect(formatShortDate(inviteExpiresOn(geoInvite, today), 'en')).toBe('Sat, Oct 17')
    expect(formatShortDate(inviteExpiresOn({ ...geoInvite, sentDaysAgo: 0 }, today), 'en')).toBe('Mon, Oct 19')
  })
})

describe('nextInviteLink', () => {
  it('starts with the link from the design', () => {
    expect(nextInviteLink([])).toBe(FIRST_INVITE_LINK)
    expect(FIRST_INVITE_LINK).toBe('pod.app/i/x7f2-4k9a')
  })

  it('never repeats a link, even past the preset ones', () => {
    const links: string[] = []
    for (let index = 0; index < 8; index++) links.push(nextInviteLink(links))
    expect(new Set(links).size).toBe(8)
    for (const link of links) expect(link).toMatch(/^pod\.app\/i\/[a-z0-9]{4}-[a-z0-9]{4}$/)
  })
})
