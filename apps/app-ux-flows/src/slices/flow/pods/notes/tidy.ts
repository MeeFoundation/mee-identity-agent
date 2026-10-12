import type { ContactInfoField, ContactInfoRecord } from '../people/contact-info'

// A note is editable text with links to forms between the text; each text block holds one or more lines.
export type NoteBlock = { kind: 'text'; id: string; text: string } | { kind: 'contact-link'; id: string }

type Person = { firstName: string; lastName: string }

type RecognisedKind = 'name' | 'birth' | 'email'

// `known` when Contact info already holds every value the line gives.
export type RecognisedStatus = 'known' | 'new'

export type RecognisedLine = {
  blockId: string
  lineIndex: number
  kind: RecognisedKind
  values: ContactInfoRecord
  status: RecognisedStatus
}

const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/
const birthPattern = /^born\s+(\d{1,2})\/(\d{1,2})\/(\d{4})$/i

const pad = (value: number) => String(value).padStart(2, '0')

// Read as a US date, MM/DD/YYYY; an impossible date such as 02/30 is not a date of birth.
const parseBirthDate = (line: string) => {
  const match = birthPattern.exec(line)
  if (!match) return null
  const [month, day, year] = [Number(match[1]), Number(match[2]), Number(match[3])]
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null
  return `${year}-${pad(month)}-${pad(day)}`
}

const recogniseLine = (line: string, person: Person): Pick<RecognisedLine, 'kind' | 'values'> | null => {
  const trimmed = line.trim()
  const email = emailPattern.exec(trimmed)?.[0]
  if (email) return { kind: 'email', values: { email } }

  const dateOfBirth = parseBirthDate(trimmed)
  if (dateOfBirth) return { kind: 'birth', values: { dateOfBirth } }

  if (trimmed.toLowerCase() === `${person.firstName} ${person.lastName}`.toLowerCase())
    return { kind: 'name', values: { firstName: person.firstName, lastName: person.lastName } }

  return null
}

const valueEntries = (values: ContactInfoRecord) => Object.entries(values) as [ContactInfoField, string | undefined][]

export const recogniseLines = (
  blocks: readonly NoteBlock[],
  person: Person,
  contact: ContactInfoRecord,
): RecognisedLine[] =>
  blocks.flatMap((block) => {
    if (block.kind !== 'text') return []
    return block.text.split('\n').flatMap((line, lineIndex) => {
      const recognised = recogniseLine(line, person)
      if (!recognised) return []
      const known = valueEntries(recognised.values).every(([field, value]) => contact[field] === value)
      return [{ ...recognised, blockId: block.id, lineIndex, status: known ? 'known' : 'new' } as const]
    })
  })

export const hasContactLink = (blocks: readonly NoteBlock[]) => blocks.some((block) => block.kind === 'contact-link')

const mergeValues = (contact: ContactInfoRecord, lines: readonly RecognisedLine[]) =>
  Object.assign({}, contact, ...lines.map((line) => line.values)) as ContactInfoRecord

// What Contact info will hold after tidying, and which fields come from new lines.
export const previewTidy = (contact: ContactInfoRecord, lines: readonly RecognisedLine[]) => ({
  newFields: new Set(
    lines.filter((line) => line.status === 'new').flatMap((line) => valueEntries(line.values).map(([field]) => field)),
  ),
  record: mergeValues(contact, lines),
})

// Drops the given lines; where lines were removed between two empty lines, only one empty line stays.
const removeLines = (lines: readonly string[], removed: ReadonlySet<number>) => {
  const kept: string[] = []
  let removedBefore = false
  lines.forEach((line, index) => {
    if (removed.has(index)) {
      removedBefore = true
      return
    }
    if (removedBefore && line === '' && kept.at(-1) === '') return
    removedBefore = false
    kept.push(line)
  })
  return kept
}

export type TidyResult = {
  blocks: NoteBlock[]
  contact: ContactInfoRecord
  // `false` when the lines joined a link that was already in the note.
  insertedLink: boolean
}

// Moves the recognised lines into Contact info. Without a link yet, one takes the place of the first line.
export const applyTidy = (
  blocks: readonly NoteBlock[],
  contact: ContactInfoRecord,
  lines: readonly RecognisedLine[],
): TidyResult => {
  const insertLink = !hasContactLink(blocks)
  const firstLine = lines[0]

  const tidied = blocks.flatMap<NoteBlock>((block) => {
    if (block.kind !== 'text') return [block]
    const removed = new Set(lines.filter((line) => line.blockId === block.id).map((line) => line.lineIndex))
    if (removed.size === 0) return [block]

    const blockLines = block.text.split('\n')
    if (!insertLink || firstLine?.blockId !== block.id) {
      return [{ ...block, text: removeLines(blockLines, removed).join('\n') }]
    }

    // The text after the link keeps its own block, so there is always a place to type below the link.
    const before = blockLines.slice(0, firstLine.lineIndex)
    const after = removeLines(blockLines, removed).slice(before.length)
    return [
      ...(before.length > 0 ? [{ id: `${block.id}.a`, kind: 'text' as const, text: before.join('\n') }] : []),
      { id: `${block.id}.link`, kind: 'contact-link' as const },
      { id: `${block.id}.b`, kind: 'text' as const, text: after.join('\n') },
    ]
  })

  return {
    blocks: tidied,
    contact: mergeValues(contact, lines),
    insertedLink: insertLink && firstLine !== undefined,
  }
}
