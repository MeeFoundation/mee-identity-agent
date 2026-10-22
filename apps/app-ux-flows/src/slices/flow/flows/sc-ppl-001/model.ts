import { atom } from 'jotai'

import {
  applyTidy,
  hasContactLink,
  type NoteBlock,
  previewTidy,
  type RecognisedLine,
  recogniseLines,
} from '../../pods/notes/tidy'
import { type ContactInfoField, type ContactInfoRecord, contactFullName } from '../../pods/people/contact-info'
import type { FlowStore } from '../../runtime/define-flow'
import type { DefaultComponents } from '@/shared/ui/default-components'
import type { PodComponents } from '@/shared/ui/pod-components'

export type ScPpl001ScreenId = 'notes' | 'tidy-confirm' | 'notes-tidied' | 'contact-info'

export type ScPpl001Components = DefaultComponents & PodComponents

export type ScPpl001InitialState = {
  contactInfo?: ContactInfoRecord
  note?: readonly NoteBlock[]
}

// The person the pod is about; recognition looks for her full name.
const sofia = { firstName: 'Sofia', lastName: 'Walker' }

export const knownSofiaContact: ContactInfoRecord = {
  dateOfBirth: '2018-04-08',
  firstName: 'Sofia',
  lastName: 'Walker',
}

// Ends with an empty line, where the caret goes to add the email.
export const DEFAULT_NOTE: readonly NoteBlock[] = [
  { id: 'note', kind: 'text', text: '#family #care\n\nSofia Walker\nBorn 04/08/2018\n' },
]

export const ANALYSIS_DELAY_MS = 1500

export const noteBlocksAtom = atom<readonly NoteBlock[]>(DEFAULT_NOTE)

// Sofia's only Contact info record; the note and the sheet show projections of it.
export const contactInfoAtom = atom<ContactInfoRecord>({})

// The lines the last analysis recognised; empty while there is no suggestion.
export const suggestionAtom = atom<readonly RecognisedLine[]>([])

// Counts edits; the analysis remembers the count it saw, so opening a screen never analyses the note.
export const noteEditsAtom = atom(0)

const analysedEditsAtom = atom(0)

const analysisPendingAtom = atom((get) => get(noteEditsAtom) !== get(analysedEditsAtom))

// Whether a Tidy was confirmed in this run; the Notes tab then opens `notes-tidied`.
export const tidiedAtom = atom(false)

type NotesScreenId = Extract<ScPpl001ScreenId, 'notes' | 'notes-tidied'>

export const notesScreenAtom = atom<NotesScreenId>((get) => (get(tidiedAtom) ? 'notes-tidied' : 'notes'))

// The note the Tidy sheet was opened over.
export const tidyOriginAtom = atom<NotesScreenId>('notes')

// Set when tidied lines joined the existing link, until the link has lit up once.
export const linkPulseAtom = atom(false)

export const contactLinkLabelAtom = atom((get) => contactFullName(get(contactInfoAtom)))

export const noteHasContactLinkAtom = atom((get) => hasContactLink(get(noteBlocksAtom)))

// Values changed in the Tidy sheet; they only exist while the sheet is open and are saved by "Tidy notes".
export const tidyEditsAtom = atom<ContactInfoRecord>({})

export const tidyPreviewAtom = atom((get) => {
  const preview = previewTidy(get(contactInfoAtom), get(suggestionAtom))
  return { ...preview, record: { ...preview.record, ...get(tidyEditsAtom) } }
})

export const openTidyAtom = atom(null, (_get, set, origin: NotesScreenId) => {
  set(tidyEditsAtom, {})
  set(tidyOriginAtom, origin)
})

export const editTidyFieldAtom = atom(null, (get, set, field: ContactInfoField, value: string) => {
  set(tidyEditsAtom, { ...get(tidyEditsAtom), [field]: value })
})

// Any edit drops the current suggestion at once and waits for the next pause.
export const setBlockTextAtom = atom(null, (get, set, blockId: string, text: string) => {
  set(
    noteBlocksAtom,
    get(noteBlocksAtom).map((block) => (block.id === blockId && block.kind === 'text' ? { ...block, text } : block)),
  )
  set(suggestionAtom, [])
  set(noteEditsAtom, get(noteEditsAtom) + 1)
})

export const analyseNoteAtom = atom(null, (get, set) => {
  set(suggestionAtom, recogniseLines(get(noteBlocksAtom), sofia, get(contactInfoAtom)))
  set(analysedEditsAtom, get(noteEditsAtom))
})

// Starts the wait for the pause after an edit; returns how to cancel it, or `null` when nothing was edited.
export const scheduleAnalysis = (store: FlowStore): (() => void) | null => {
  if (!store.get(analysisPendingAtom)) return null
  const timer = setTimeout(() => store.set(analyseNoteAtom), ANALYSIS_DELAY_MS)
  return () => clearTimeout(timer)
}

export const confirmTidyAtom = atom(null, (get, set) => {
  const lines = get(suggestionAtom)
  if (lines.length === 0) return
  const result = applyTidy(get(noteBlocksAtom), get(contactInfoAtom), lines)
  set(noteBlocksAtom, result.blocks)
  set(contactInfoAtom, { ...result.contact, ...get(tidyEditsAtom) })
  set(tidyEditsAtom, {})
  set(suggestionAtom, [])
  set(tidiedAtom, true)
  set(linkPulseAtom, !result.insertedLink)
})
