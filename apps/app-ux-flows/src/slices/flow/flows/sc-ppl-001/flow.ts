import { createStore as createJotaiStore } from 'jotai'

import type { NoteBlock } from '../../pods/notes/tidy'
import { type DesignFrame, defineFlow } from '../../runtime/define-flow'
import {
  contactInfoAtom,
  DEFAULT_NOTE,
  knownSofiaContact,
  linkPulseAtom,
  noteBlocksAtom,
  noteEditsAtom,
  type ScPpl001Components,
  type ScPpl001InitialState,
  type ScPpl001ScreenId,
  suggestionAtom,
  tidiedAtom,
  tidyEditsAtom,
  tidyOriginAtom,
} from './model'
import { ContactInfoScreen } from './screens/contact-info-screen'
import { NotesScreen } from './screens/notes-screen'
import { NotesTidiedScreen } from './screens/notes-tidied-screen'
import { TidyConfirmScreen } from './screens/tidy-confirm-screen'
import { defaultComponents } from '@/shared/ui/default-components'
import { podComponents } from '@/shared/ui/pod-components'

const figmaFrame = (name: string, nodeId: string): DesignFrame => ({
  name,
  url: `https://www.figma.com/design/cd6NZmMxZHC7qTOk0SXYVW/Mee---Tellipod-App-v4.0.3?node-id=${nodeId}`,
})

const key = (path: string) => `flows.scPpl001.${path}`
const caseKey = (caseId: string, path: string) => key(`cases.${caseId}.${path}`)

const linkedNote: readonly NoteBlock[] = [
  { id: 'top', kind: 'text', text: '#family #care\n' },
  { id: 'link', kind: 'contact-link' },
  { id: 'bottom', kind: 'text', text: 'Piano on Tuesdays\n' },
]

const unrecognisedNote: readonly NoteBlock[] = [
  { id: 'note', kind: 'text', text: '#family #care\n\nPiano on Tuesdays\nHates broccoli\n' },
]

export const scPpl001Flow = defineFlow<ScPpl001ScreenId, ScPpl001Components, ScPpl001InitialState>({
  cases: {
    a: {
      code: 'SC-PPL-001-A',
      descriptionKey: caseKey('a', 'description'),
      goalKey: caseKey('a', 'goal'),
      initialState: { contactInfo: {}, note: DEFAULT_NOTE },
      nameKey: caseKey('a', 'name'),
    },
    b: {
      code: 'SC-PPL-001-B',
      descriptionKey: caseKey('b', 'description'),
      goalKey: caseKey('b', 'goal'),
      initialState: { contactInfo: knownSofiaContact, note: linkedNote },
      nameKey: caseKey('b', 'name'),
      questionKeys: [caseKey('b', 'questions.nameNeeded')],
      screenNotes: {
        'notes-tidied': {
          aboutKey: caseKey('b', 'screens.notesTidied.about'),
          questionKeys: [
            caseKey('b', 'screens.notesTidied.questions.wentIntoLink'),
            caseKey('b', 'screens.notesTidied.questions.lightUp'),
          ],
        },
        'tidy-confirm': { questionKeys: [caseKey('b', 'screens.tidyConfirm.questions.newOrSaved')] },
      },
    },
    c: {
      code: 'SC-PPL-001-C',
      descriptionKey: caseKey('c', 'description'),
      goalKey: caseKey('c', 'goal'),
      initialState: { contactInfo: {}, note: unrecognisedNote },
      nameKey: caseKey('c', 'name'),
      questionKeys: [caseKey('c', 'questions.nothingHappens')],
    },
  },
  code: 'SC-PPL-001',
  components: { ...defaultComponents, ...podComponents },
  createStore(initialState) {
    const store = createJotaiStore()
    store.set(noteBlocksAtom, initialState?.note ?? DEFAULT_NOTE)
    store.set(contactInfoAtom, initialState?.contactInfo ?? {})
    store.set(suggestionAtom, [])
    store.set(noteEditsAtom, 0)
    store.set(tidiedAtom, false)
    store.set(tidyOriginAtom, 'notes')
    store.set(tidyEditsAtom, {})
    store.set(linkPulseAtom, false)
    return store
  },
  descriptionKey: key('description'),
  designFrames: {
    notes: figmaFrame('Pod / Notes - 3 - 3', '975-19788'),
    'notes-tidied': figmaFrame('Pod / Notes - 3 - 4', '975-20502'),
    'tidy-confirm': figmaFrame('Modal', '975-20740'),
  },
  hints: {
    'contact-info': key('hints.contactInfo'),
    notes: key('hints.notes'),
    'notes-tidied': key('hints.notesTidied'),
    'tidy-confirm': key('hints.tidyConfirm'),
  },
  id: 'sc-ppl-001',
  initialScreen: 'notes',
  kind: 'showcase',
  questionKeys: [key('questions.existingContact'), key('questions.reversible'), key('questions.whenAnalysed')],
  screenNotes: {
    'contact-info': {
      aboutKey: key('screens.contactInfo.about'),
      questionKeys: [key('screens.contactInfo.questions.source')],
    },
    notes: {
      aboutKey: key('screens.notes.about'),
      questionKeys: [
        key('screens.notes.questions.dismiss'),
        key('screens.notes.questions.colours'),
        key('screens.notes.questions.pause'),
      ],
    },
    'notes-tidied': {
      aboutKey: key('screens.notesTidied.about'),
      questionKeys: [key('screens.notesTidied.questions.linkTarget'), key('screens.notesTidied.questions.moved')],
    },
    'tidy-confirm': {
      aboutKey: key('screens.tidyConfirm.about'),
      questionKeys: [
        key('screens.tidyConfirm.questions.conflict'),
        key('screens.tidyConfirm.questions.editable'),
        key('screens.tidyConfirm.questions.confirmLabel'),
      ],
    },
  },
  screens: {
    'contact-info': ContactInfoScreen,
    notes: NotesScreen,
    'notes-tidied': NotesTidiedScreen,
    'tidy-confirm': TidyConfirmScreen,
  },
  titleKey: key('title'),
})
