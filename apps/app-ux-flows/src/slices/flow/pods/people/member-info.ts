// What a member shares in a pod, and the details other members added about them.
// `Member.role` is a permission; the `role` field here is the family role a member shares, such as "Dad".

import { andrew, geo } from './sharing'

export const infoFields = ['firstName', 'role', 'email', 'phone', 'address'] as const

export type InfoField = (typeof infoFields)[number]

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

export type DetailAboutOutcome = 'matches' | 'added'

export type AdoptResult =
  | { kind: 'added'; info: MemberInfo }
  | { kind: 'conflict'; yours: SharedDetail; added: AddedDetail }

const multiValueFields: ReadonlySet<InfoField> = new Set(['email', 'phone'])

export const isMultiValue = (field: InfoField) => multiValueFields.has(field)

// A detail added by others stays hidden, not deleted, while its person shares the same value for its field.
export const isShown = (info: MemberInfo, detail: AddedDetail) =>
  !info.shared.some(({ field, value }) => field === detail.field && value === detail.value)

const shownAdded = (info: MemberInfo) => info.addedByOthers.filter((detail) => isShown(info, detail))

export const findAdded = (info: MemberInfo, detailId: string) =>
  shownAdded(info).find((detail) => detail.id === detailId)

// Ids only need to be unique within the info's shared details; a detail can be adopted again after it reappears.
const uniqueSharedId = (info: MemberInfo, base: string) => {
  const used = new Set(info.shared.map(({ id }) => id))
  for (let index = 1; ; index++) {
    const id = index === 1 ? base : `${base}-${index}`
    if (!used.has(id)) return id
  }
}

const toShared = (info: MemberInfo, { id, field, value }: AddedDetail): SharedDetail => ({
  field,
  id: uniqueSharedId(info, `${id}-shared`),
  value,
})

// The Role line in a member list, or `null` so the caller can fall back to the member's permission.
export const sharedRole = (info: MemberInfo | undefined) =>
  info?.shared.find((detail) => detail.field === 'role')?.value ?? null

// One group per person, in the order of each person's first detail.
export const addedByPerson = (info: MemberInfo): AddedByPerson[] => {
  const groups = new Map<string, AddedDetail[]>()
  for (const detail of shownAdded(info)) {
    const group = groups.get(detail.addedBy)
    if (group) group.push(detail)
    else groups.set(detail.addedBy, [detail])
  }
  return [...groups].map(([addedBy, details]) => ({ addedBy, details }))
}

// Adds the detail to the shared info, unless a detail with its field is already shared. The detail is then hidden, as it matches.
export const adopt = (info: MemberInfo, detailId: string): AdoptResult | null => {
  const added = findAdded(info, detailId)
  if (!added) return null
  const yours = info.shared.find((detail) => detail.field === added.field)
  if (yours) return { added, kind: 'conflict', yours }
  return { info: { ...info, shared: [...info.shared, toShared(info, added)] }, kind: 'added' }
}

// Shares the detail next to the existing ones with the same field.
export const keepBoth = (info: MemberInfo, detailId: string): MemberInfo => {
  const added = findAdded(info, detailId)
  if (!added) return info
  const lastSameField = info.shared.reduce((last, detail, index) => (detail.field === added.field ? index : last), -1)
  const at = lastSameField === -1 ? info.shared.length : lastSameField + 1
  return { ...info, shared: [...info.shared.slice(0, at), toShared(info, added), ...info.shared.slice(at)] }
}

// Puts the detail in place of the first shared detail with the same field.
export const replace = (info: MemberInfo, detailId: string): MemberInfo => {
  const added = findAdded(info, detailId)
  if (!added) return info
  const first = info.shared.findIndex((detail) => detail.field === added.field)
  if (first === -1) return info
  return { ...info, shared: info.shared.map((detail, index) => (index === first ? toShared(info, added) : detail)) }
}

// The only way a detail added by others leaves the info: once removed, it never comes back.
export const removeAdded = (info: MemberInfo, detailId: string): MemberInfo => ({
  ...info,
  addedByOthers: info.addedByOthers.filter((detail) => detail.id !== detailId),
})

export const editShared = (info: MemberInfo, detailId: string, value: string): MemberInfo => ({
  ...info,
  shared: info.shared.map((detail) => (detail.id === detailId ? { ...detail, value } : detail)),
})

export const addShared = (info: MemberInfo, field: InfoField, value: string): MemberInfo => ({
  ...info,
  shared: [...info.shared, { field, id: uniqueSharedId(info, field), value }],
})

// Every field for a multi-value one, and single-value ones only while nothing is shared for them.
export const pickableOwnFields = (info: MemberInfo): InfoField[] =>
  infoFields.filter((field) => isMultiValue(field) || !info.shared.some((detail) => detail.field === field))

export const detailBy = (info: MemberInfo, addedBy: string, field: InfoField) =>
  info.addedByOthers.find((detail) => detail.addedBy === addedBy && detail.field === field)

export const removeDetailBy = (info: MemberInfo, addedBy: string, field: InfoField): MemberInfo => ({
  ...info,
  addedByOthers: info.addedByOthers.filter((detail) => detail.addedBy !== addedBy || detail.field !== field),
})

// One detail per person and field: a value the member already shares drops it, anything else creates or updates it.
export const setDetailAbout = (
  info: MemberInfo,
  addedBy: string,
  field: InfoField,
  value: string,
): { info: MemberInfo; outcome: DetailAboutOutcome } => {
  if (info.shared.some((detail) => detail.field === field && detail.value === value))
    return { info: removeDetailBy(info, addedBy, field), outcome: 'matches' }
  const existing = detailBy(info, addedBy, field)
  const detail: AddedDetail = { addedBy, addedDaysAgo: 0, field, id: existing?.id ?? `${addedBy}-${field}`, value }
  return {
    info: {
      ...info,
      addedByOthers: existing
        ? info.addedByOthers.map((other) => (other === existing ? detail : other))
        : [...info.addedByOthers, detail],
    },
    outcome: 'added',
  }
}

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

export const geoInfoWithOldEmail: MemberInfo = {
  addedByOthers: [],
  shared: [...geoInfo.shared, { field: 'email', id: 'geo-email', value: 'geo.old@gmail.com' }],
}

export const andrewAddedAboutGeo: readonly AddedDetail[] = [
  { addedBy: andrew.id, addedDaysAgo: 2, field: 'phone', id: 'andrew-geo-phone', value: '+447700900123' },
]
