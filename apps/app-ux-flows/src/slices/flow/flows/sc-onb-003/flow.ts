import { createStore as createJotaiStore } from 'jotai'

import { createIntroScreens } from '../../pods/tellipod-intro/screens/create-intro-screens'
import { defineFlow } from '../../runtime/define-flow'
import type { ScOnb003Components, ScOnb003ScreenId } from './model'
import { defaultComponents } from '@/shared/ui/default-components'

const { ExistingDeviceScreen, IntroScreen, RestoreScreen, TelliHandoffScreen } = createIntroScreens({ mode: 'living' })

const key = (path: string) => `flows.scOnb003.${path}`

// The intro tells one story and starts from nothing, so a run takes no initial state.
type ScOnb003InitialState = Record<string, never>

export const scOnb003Flow = defineFlow<ScOnb003ScreenId, ScOnb003Components, ScOnb003InitialState>({
  code: 'SC-ONB-003',
  components: defaultComponents,
  // The intro's state lives in its scene, which a new run mounts afresh.
  createStore: () => createJotaiStore(),
  descriptionKey: key('description'),
  goalKey: key('goal'),
  hints: {
    'existing-device': key('hints.existingDevice'),
    'ginger-pod': key('hints.gingerPod'),
    paula: key('hints.paula'),
    restore: key('hints.restore'),
    rooms: key('hints.rooms'),
    'telli-handoff': key('hints.telliHandoff'),
    welcome: key('hints.welcome'),
  },
  id: 'sc-onb-003',
  initialScreen: 'rooms',
  kind: 'showcase',
  questionKeys: [key('questions.flatClearer'), key('questions.deckReads'), key('questions.samePod')],
  screenNotes: {
    'existing-device': { aboutKey: key('screens.existingDevice.about') },
    'ginger-pod': {
      aboutKey: key('screens.gingerPod.about'),
      questionKeys: [key('screens.gingerPod.questions.enoughShown')],
    },
    paula: {
      aboutKey: key('screens.paula.about'),
      questionKeys: [key('screens.paula.questions.deviceToDevice')],
    },
    restore: { aboutKey: key('screens.restore.about') },
    rooms: {
      aboutKey: key('screens.rooms.about'),
      questionKeys: [key('screens.rooms.questions.separatePods')],
    },
    'telli-handoff': { aboutKey: key('screens.telliHandoff.about') },
    welcome: {
      aboutKey: key('screens.welcome.about'),
      questionKeys: [key('screens.welcome.questions.oneOfMany')],
    },
  },
  screens: {
    'existing-device': ExistingDeviceScreen,
    // The four beats are one scene; sharing a component keeps it mounted between them.
    'ginger-pod': IntroScreen,
    paula: IntroScreen,
    restore: RestoreScreen,
    rooms: IntroScreen,
    'telli-handoff': TelliHandoffScreen,
    welcome: IntroScreen,
  },
  titleKey: key('title'),
})
