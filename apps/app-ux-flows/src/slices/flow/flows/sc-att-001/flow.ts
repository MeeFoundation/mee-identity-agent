import { createStore as createJotaiStore } from 'jotai'

import { defaultComponents } from '@/shared/ui/default-components'
import { podComponents } from '@/shared/ui/pod-components'

import { type DesignFrame, defineFlow } from '../../runtime/define-flow'
import {
  filesAtom,
  goalAtom,
  type ScAtt001Components,
  type ScAtt001InitialState,
  type ScAtt001ScreenId,
  startingFiles,
} from './model'
import { ActionsScreen } from './screens/actions-screen'
import { AddScreen } from './screens/add-screen'
import { FilesScreen } from './screens/files-screen'
import { RenameScreen } from './screens/rename-screen'

const figmaFrame = (name: string, nodeId: string): DesignFrame => ({
  name,
  url: `https://www.figma.com/design/cd6NZmMxZHC7qTOk0SXYVW/Mee---Tellipod-App-v4.0.3?node-id=${nodeId}`,
})

const key = (path: string) => `flows.scAtt001.${path}`
const caseKey = (caseId: string, path: string) => key(`cases.${caseId}.${path}`)

export const scAtt001Flow = defineFlow<ScAtt001ScreenId, ScAtt001Components, ScAtt001InitialState>({
  cases: {
    a: {
      code: 'SC-ATT-001-A',
      descriptionKey: caseKey('a', 'description'),
      goalKey: caseKey('a', 'goal'),
      initialState: { goal: 'add' },
      nameKey: caseKey('a', 'name'),
    },
    b: {
      code: 'SC-ATT-001-B',
      descriptionKey: caseKey('b', 'description'),
      goalKey: caseKey('b', 'goal'),
      initialState: { goal: 'rename' },
      nameKey: caseKey('b', 'name'),
    },
    c: {
      code: 'SC-ATT-001-C',
      descriptionKey: caseKey('c', 'description'),
      goalKey: caseKey('c', 'goal'),
      initialState: { goal: 'delete' },
      nameKey: caseKey('c', 'name'),
    },
  },
  code: 'SC-ATT-001',
  components: { ...defaultComponents, ...podComponents },
  createStore(initialState) {
    const store = createJotaiStore()
    store.set(filesAtom, startingFiles())
    store.set(goalAtom, initialState?.goal ?? 'add')
    return store
  },
  descriptionKey: key('description'),
  designFrames: {
    actions: figmaFrame('SC-ATT-001 - File actions', '486-27239'),
    add: figmaFrame('SC-ATT-001 - Add to Files', '486-27195'),
    files: figmaFrame('SC-ATT-001 - Attachments', '486-24413'),
  },
  hints: {
    actions: key('hints.actions'),
    add: key('hints.add'),
    files: key('hints.files'),
    rename: key('hints.rename'),
  },
  id: 'sc-att-001',
  initialScreen: 'files',
  kind: 'showcase',
  questionKeys: [key('questions.deleteWithoutAsking'), key('questions.everyoneChanges')],
  screenNotes: {
    actions: {
      aboutKey: key('screens.actions.about'),
      questionKeys: [key('screens.actions.questions.confirmDelete')],
    },
    add: { aboutKey: key('screens.add.about'), questionKeys: [key('screens.add.questions.kinds')] },
    files: { aboutKey: key('screens.files.about'), questionKeys: [key('screens.files.questions.sortOrSearch')] },
    rename: {
      aboutKey: key('screens.rename.about'),
      questionKeys: [key('screens.rename.questions.lockExtension')],
    },
  },
  screens: {
    actions: ActionsScreen,
    add: AddScreen,
    files: FilesScreen,
    rename: RenameScreen,
  },
  titleKey: key('title'),
})
