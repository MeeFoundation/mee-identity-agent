import { describe, expect, it } from 'vitest'

import {
  type AddedDetail,
  addedByPerson,
  addShared,
  adopt,
  andrewAddedAboutGeo,
  andrewInfo,
  bogdanInfo,
  editShared,
  findAdded,
  geoAddedAboutBogdan,
  geoInfo,
  geoInfoWithOldEmail,
  isMultiValue,
  isShown,
  keepBoth,
  type MemberInfo,
  pickableOwnFields,
  removeAdded,
  removeDetailBy,
  replace,
  setDetailAbout,
  sharedRole,
} from './member-info'
import { andrew } from './sharing'

const [geoEmail, geoPhone] = geoAddedAboutBogdan as [AddedDetail, AddedDetail]

const caseD: MemberInfo = { ...bogdanInfo, addedByOthers: geoAddedAboutBogdan }

const values = (info: MemberInfo) => info.shared.map(({ field, value }) => `${field}:${value}`)

const shownIds = (info: MemberInfo) => addedByPerson(info).flatMap(({ details }) => details.map(({ id }) => id))

const addedValues = (info: MemberInfo) =>
  info.addedByOthers.map(({ addedBy, field, value }) => `${addedBy}:${field}:${value}`)

describe('member info fixtures', () => {
  it('has Bogdan share his first name, Role "Dad", work email and address, in that order', () => {
    expect(values(bogdanInfo)).toEqual([
      'firstName:Bogdan',
      'role:Dad',
      'email:bhutuleac@swiftinvention.com',
      'address:318 Fillmore St, Apt 4B',
    ])
    expect(bogdanInfo.addedByOthers).toEqual([])
  })

  it('has Geo share Role "Mum" and Andrew share Role "Uncle"', () => {
    expect(sharedRole(geoInfo)).toBe('Mum')
    expect(sharedRole(andrewInfo)).toBe('Uncle')
  })

  it('has Andrew as a viewer who joined three days ago', () => {
    expect(andrew).toEqual({ id: 'andrew', joinedDaysAgo: 3, name: 'Andrew', role: 'viewer' })
  })

  it('has Geo add an email and a phone number about Bogdan, a day ago', () => {
    expect(
      geoAddedAboutBogdan.map(({ addedBy, addedDaysAgo, field, value }) => [addedBy, addedDaysAgo, field, value]),
    ).toEqual([
      ['geo', 1, 'email', 'bogdan@gmail.com'],
      ['geo', 1, 'phone', '+4244235355'],
    ])
  })

  it('has Geo share an old email for case E, and Andrew add a phone number about Geo two days ago', () => {
    expect(values(geoInfoWithOldEmail)).toEqual(['role:Mum', 'email:geo.old@gmail.com'])
    expect(
      andrewAddedAboutGeo.map(({ addedBy, addedDaysAgo, field, value }) => [addedBy, addedDaysAgo, field, value]),
    ).toEqual([['andrew', 2, 'phone', '+447700900123']])
  })
})

describe('isShown', () => {
  it('hides a detail while the same field and value are shared, and shows it again once they differ', () => {
    const matching = addShared(caseD, 'phone', '+4244235355')
    expect(isShown(matching, geoPhone)).toBe(false)
    expect(shownIds(matching)).toEqual([geoEmail.id])
    expect(findAdded(matching, geoPhone.id)).toBeUndefined()

    const phoneId = matching.shared.at(-1)?.id ?? ''
    const changed = editShared(matching, phoneId, '+4244235356')
    expect(isShown(changed, geoPhone)).toBe(true)
    expect(shownIds(changed)).toEqual([geoEmail.id, geoPhone.id])
  })

  it('compares values exactly', () => {
    expect(isShown(addShared(caseD, 'phone', '+42 4423 5355'), geoPhone)).toBe(true)
  })
})

describe('isMultiValue', () => {
  it('allows more than one email or phone, and one of everything else', () => {
    expect(isMultiValue('email')).toBe(true)
    expect(isMultiValue('phone')).toBe(true)
    expect(isMultiValue('firstName')).toBe(false)
    expect(isMultiValue('role')).toBe(false)
    expect(isMultiValue('address')).toBe(false)
  })
})

describe('sharedRole', () => {
  it('is null for a member who shares no Role, or has no info', () => {
    expect(sharedRole({ addedByOthers: [], shared: [] })).toBeNull()
    expect(sharedRole(undefined)).toBeNull()
  })
})

describe('adopt', () => {
  it('adds a detail with a field not yet shared to the end, which hides it', () => {
    const result = adopt(caseD, geoPhone.id)

    expect(result?.kind).toBe('added')
    if (result?.kind !== 'added') return
    expect(values(result.info).at(-1)).toBe('phone:+4244235355')
    expect(result.info.shared).toHaveLength(5)
    expect(result.info.addedByOthers).toEqual(geoAddedAboutBogdan)
    expect(shownIds(result.info)).toEqual([geoEmail.id])
  })

  it('can adopt a detail again after it reappears, without repeating a shared id', () => {
    const first = adopt(caseD, geoPhone.id)
    if (first?.kind !== 'added') throw new Error('expected added')
    const phoneId = first.info.shared.at(-1)?.id ?? ''
    const reappeared = editShared(first.info, phoneId, '+1')
    const again = keepBoth(reappeared, geoPhone.id)
    const ids = again.shared.map(({ id }) => id)

    expect(values(again).slice(-2)).toEqual(['phone:+1', 'phone:+4244235355'])
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('reports a conflict with the first shared detail of the same field, changing nothing', () => {
    expect(adopt(caseD, geoEmail.id)).toEqual({ added: geoEmail, kind: 'conflict', yours: bogdanInfo.shared[2] })
  })

  it('returns null for a detail that is not there', () => {
    expect(adopt(caseD, 'missing')).toBeNull()
  })
})

describe('keepBoth', () => {
  it('inserts the detail after the last shared detail with the same field', () => {
    const twoEmails: MemberInfo = {
      ...caseD,
      shared: [
        ...bogdanInfo.shared.slice(0, 3),
        { field: 'email', id: 'second', value: 'b@x.com' },
        ...bogdanInfo.shared.slice(3),
      ],
    }
    const info = keepBoth(twoEmails, geoEmail.id)

    expect(values(info)).toEqual([
      'firstName:Bogdan',
      'role:Dad',
      'email:bhutuleac@swiftinvention.com',
      'email:b@x.com',
      'email:bogdan@gmail.com',
      'address:318 Fillmore St, Apt 4B',
    ])
    expect(shownIds(info)).toEqual([geoPhone.id])
  })
})

describe('replace', () => {
  it('puts the detail in place of the first shared value, keeping its position', () => {
    const info = replace(caseD, geoEmail.id)

    expect(values(info)).toEqual([
      'firstName:Bogdan',
      'role:Dad',
      'email:bogdan@gmail.com',
      'address:318 Fillmore St, Apt 4B',
    ])
    expect(shownIds(info)).toEqual([geoPhone.id])
  })
})

describe('removeAdded', () => {
  it('drops the detail and leaves the shared info alone', () => {
    const info = removeAdded(caseD, geoPhone.id)

    expect(info.shared).toBe(caseD.shared)
    expect(info.addedByOthers).toEqual([geoEmail])
  })

  it('keeps a removed detail away, even when a shared value stops matching it', () => {
    const removed = removeAdded(caseD, geoPhone.id)
    const matching = addShared(removed, 'phone', '+4244235355')
    const changed = editShared(matching, matching.shared.at(-1)?.id ?? '', '+4244235356')

    expect(shownIds(changed)).toEqual([geoEmail.id])
  })
})

describe('editShared', () => {
  it('changes a value in place', () => {
    expect(values(editShared(bogdanInfo, 'bogdan-address', '12 Pine St'))).toEqual([
      'firstName:Bogdan',
      'role:Dad',
      'email:bhutuleac@swiftinvention.com',
      'address:12 Pine St',
    ])
  })
})

describe('addShared', () => {
  it('adds to the end with an id no other shared detail has', () => {
    const once = addShared(bogdanInfo, 'email', 'a@x.com')
    const twice = addShared(once, 'email', 'b@x.com')
    const ids = twice.shared.map(({ id }) => id)

    expect(values(twice).slice(-2)).toEqual(['email:a@x.com', 'email:b@x.com'])
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('pickableOwnFields', () => {
  it('leaves out single-value fields already shared', () => {
    expect(pickableOwnFields(bogdanInfo)).toEqual(['email', 'phone'])
    expect(pickableOwnFields({ addedByOthers: [], shared: [] })).toEqual([
      'firstName',
      'role',
      'email',
      'phone',
      'address',
    ])
  })
})

describe('setDetailAbout', () => {
  const caseE: MemberInfo = { ...geoInfoWithOldEmail, addedByOthers: andrewAddedAboutGeo }

  it('creates a detail at the end, added today', () => {
    const { info, outcome } = setDetailAbout(caseE, 'bogdan', 'email', 'geo@swiftinvention.com')

    expect(outcome).toBe('added')
    expect(addedValues(info)).toEqual(['andrew:phone:+447700900123', 'bogdan:email:geo@swiftinvention.com'])
    expect(info.addedByOthers.at(-1)?.addedDaysAgo).toBe(0)
    expect(info.shared).toBe(caseE.shared)
  })

  it('updates the same detail on a second save, keeping its position', () => {
    const first = setDetailAbout(caseE, 'bogdan', 'email', 'geo@swiftinvention.com').info
    const withAddress = setDetailAbout(first, 'bogdan', 'address', '1 Main St').info
    const { info } = setDetailAbout(withAddress, 'bogdan', 'email', 'geo@mail.com')

    expect(addedValues(info)).toEqual([
      'andrew:phone:+447700900123',
      'bogdan:email:geo@mail.com',
      'bogdan:address:1 Main St',
    ])
  })

  it('drops the detail when the member already shares the value', () => {
    const first = setDetailAbout(caseE, 'bogdan', 'email', 'geo@swiftinvention.com').info
    const { info, outcome } = setDetailAbout(first, 'bogdan', 'email', 'geo.old@gmail.com')

    expect(outcome).toBe('matches')
    expect(addedValues(info)).toEqual(['andrew:phone:+447700900123'])
  })
})

describe('removeDetailBy', () => {
  it("removes only that person's detail for that field", () => {
    const info = setDetailAbout(
      { ...geoInfoWithOldEmail, addedByOthers: andrewAddedAboutGeo },
      'bogdan',
      'phone',
      '+1',
    ).info

    expect(addedValues(removeDetailBy(info, 'bogdan', 'phone'))).toEqual(['andrew:phone:+447700900123'])
  })
})

describe('addedByPerson', () => {
  it('groups details by who added them, in the order each person first added one', () => {
    const andrewAddress: AddedDetail = {
      addedBy: 'andrew',
      addedDaysAgo: 0,
      field: 'address',
      id: 'andrew-address',
      value: '1 Main St',
    }
    const info: MemberInfo = { ...bogdanInfo, addedByOthers: [andrewAddress, geoEmail, geoPhone] }

    expect(addedByPerson(info)).toEqual([
      { addedBy: 'andrew', details: [andrewAddress] },
      { addedBy: 'geo', details: [geoEmail, geoPhone] },
    ])
  })

  it('has no groups when nothing was added', () => {
    expect(addedByPerson(bogdanInfo)).toEqual([])
  })
})
