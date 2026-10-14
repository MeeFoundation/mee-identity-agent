// What a member shares in a pod, and the details other members added about them.
// `Member.role` is a permission; the `role` field here is the family role a member shares, such as "Dad".

import { geo } from './sharing'

export type InfoField = 'firstName' | 'role' | 'email' | 'phone' | 'address'

type SharedDetail = {
  id: string
  field: InfoField
  value: string
}

export type AddedDetail = SharedDetail & {
  // The id of the member who added it.
  addedBy: string
  addedDaysAgo: number
}

export type MemberInfo = {
  shared: readonly SharedDetail[]
  addedByOthers: readonly AddedDetail[]
}

export type AddedByPerson = {
  addedBy: string
  details: readonly AddedDetail[]
}

export type AdoptResult =
  | { kind: 'added'; info: MemberInfo }
  | { kind: 'conflict'; yours: SharedDetail; added: AddedDetail }

const multiValueFields: ReadonlySet<InfoField> = new Set(['email', 'phone'])

export const isMultiValue = (field: InfoField) => multiValueFields.has(field)

export const findAdded = (info: MemberInfo, detailId: string) =>
  info.addedByOthers.find((detail) => detail.id === detailId)

const toShared = ({ id, field, value }: AddedDetail): SharedDetail => ({ field, id, value })

const withoutAdded = (info: MemberInfo, detailId: string) =>
  info.addedByOthers.filter((detail) => detail.id !== detailId)

// The Role line in a member list, or `null` so the caller can fall back to the member's permission.
export const sharedRole = (info: MemberInfo | undefined) =>
  info?.shared.find((detail) => detail.field === 'role')?.value ?? null

// One group per person, in the order of each person's first detail.
export const addedByPerson = (info: MemberInfo): AddedByPerson[] => {
  const groups = new Map<string, AddedDetail[]>()
  for (const detail of info.addedByOthers) {
    const group = groups.get(detail.addedBy)
    if (group) group.push(detail)
    else groups.set(detail.addedBy, [detail])
  }
  return [...groups].map(([addedBy, details]) => ({ addedBy, details }))
}

// Adds the detail to the shared info, unless a detail with its field is already shared.
export const adopt = (info: MemberInfo, detailId: string): AdoptResult | null => {
  const added = findAdded(info, detailId)
  if (!added) return null
  const yours = info.shared.find((detail) => detail.field === added.field)
  if (yours) return { added, kind: 'conflict', yours }
  return {
    info: { addedByOthers: withoutAdded(info, detailId), shared: [...info.shared, toShared(added)] },
    kind: 'added',
  }
}

// Shares the detail next to the existing ones with the same field.
export const keepBoth = (info: MemberInfo, detailId: string): MemberInfo => {
  const added = findAdded(info, detailId)
  if (!added) return info
  const lastSameField = info.shared.reduce((last, detail, index) => (detail.field === added.field ? index : last), -1)
  const at = lastSameField === -1 ? info.shared.length : lastSameField + 1
  return {
    addedByOthers: withoutAdded(info, detailId),
    shared: [...info.shared.slice(0, at), toShared(added), ...info.shared.slice(at)],
  }
}

// Puts the detail in place of the first shared detail with the same field.
export const replace = (info: MemberInfo, detailId: string): MemberInfo => {
  const added = findAdded(info, detailId)
  if (!added) return info
  const first = info.shared.findIndex((detail) => detail.field === added.field)
  if (first === -1) return info
  return {
    addedByOthers: withoutAdded(info, detailId),
    shared: info.shared.map((detail, index) => (index === first ? toShared(added) : detail)),
  }
}

export const removeAdded = (info: MemberInfo, detailId: string): MemberInfo => ({
  ...info,
  addedByOthers: withoutAdded(info, detailId),
})

export const bogdanInfo: MemberInfo = {
  addedByOthers: [],
  shared: [
    { field: 'firstName', id: 'bogdan-first-name', value: 'Bogdan' },
    { field: 'role', id: 'bogdan-role', value: 'Dad' },
    { field: 'email', id: 'bogdan-email', value: 'bhutuleac@swiftinvention.com' },
    { field: 'address', id: 'bogdan-address', value: '318 Fillmore St, Apt 4B' },
  ],
}

export const geoInfo: MemberInfo = {
  addedByOthers: [],
  shared: [{ field: 'role', id: 'geo-role', value: 'Mum' }],
}

export const andrewInfo: MemberInfo = {
  addedByOthers: [],
  shared: [{ field: 'role', id: 'andrew-role', value: 'Uncle' }],
}

export const geoAddedAboutBogdan: readonly AddedDetail[] = [
  { addedBy: geo.id, addedDaysAgo: 1, field: 'email', id: 'geo-bogdan-email', value: 'bogdan@gmail.com' },
  { addedBy: geo.id, addedDaysAgo: 1, field: 'phone', id: 'geo-bogdan-phone', value: '+4244235355' },
]
