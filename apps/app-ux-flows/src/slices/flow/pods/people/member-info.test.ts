import { describe, expect, it } from 'vitest'

import {
  type AddedDetail,
  addedByPerson,
  adopt,
  andrewInfo,
  bogdanInfo,
  geoAddedAboutBogdan,
  geoInfo,
  isMultiValue,
  keepBoth,
  type MemberInfo,
  removeAdded,
  replace,
  sharedRole,
} from './member-info'
import { andrew } from './sharing'

const [geoEmail, geoPhone] = geoAddedAboutBogdan as [AddedDetail, AddedDetail]

const caseD: MemberInfo = { ...bogdanInfo, addedByOthers: geoAddedAboutBogdan }

const values = (info: MemberInfo) => info.shared.map(({ field, value }) => `${field}:${value}`)

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
  it('adds a detail with a field not yet shared to the end, and takes it out of the added list', () => {
    const result = adopt(caseD, geoPhone.id)

    expect(result?.kind).toBe('added')
    if (result?.kind !== 'added') return
    expect(values(result.info).at(-1)).toBe('phone:+4244235355')
    expect(result.info.shared).toHaveLength(5)
    expect(result.info.addedByOthers).toEqual([geoEmail])
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
    expect(info.addedByOthers).toEqual([geoPhone])
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
    expect(info.addedByOthers).toEqual([geoPhone])
  })
})

describe('removeAdded', () => {
  it('drops the detail and leaves the shared info alone', () => {
    const info = removeAdded(caseD, geoPhone.id)

    expect(info.shared).toBe(caseD.shared)
    expect(info.addedByOthers).toEqual([geoEmail])
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
