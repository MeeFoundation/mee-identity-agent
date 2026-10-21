import { createStore as createJotaiStore } from 'jotai'

import { defaultComponents } from '@/shared/ui/default-components'

import { createIntroScreens } from '../../pods/tellipod-intro/screens/create-intro-screens'
import { defineFlow } from '../../runtime/define-flow'
import type { ScOnb002Components, ScOnb002ScreenId } from './model'

const { ExistingDeviceScreen, IntroScreen, RestoreScreen, TelliHandoffScreen } = createIntroScreens({ mode: 'tap' })

const key = (path: string) => `flows.scOnb002.${path}`

// The intro tells one story and starts from nothing, so a run takes no initial state.
type ScOnb002InitialState = Record<string, never>

export const scOnb002Flow = defineFlow<ScOnb002ScreenId, ScOnb002Components, ScOnb002InitialState>({
  code: 'SC-ONB-002',
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
  id: 'sc-onb-002',
  initialScreen: 'rooms',
  kind: 'showcase',
  questionKeys: [key('questions.engaging'), key('questions.nextCue'), key('questions.requiredDemo')],
  screenNotes: {
    'existing-device': { aboutKey: key('screens.existingDevice.about') },
    'ginger-pod': {
      aboutKey: key('screens.gingerPod.about'),
      questionKeys: [key('screens.gingerPod.questions.inviteHint'), key('screens.gingerPod.questions.invitePaula')],
    },
    paula: {
      aboutKey: key('screens.paula.about'),
      questionKeys: [key('screens.paula.questions.home')],
    },
    restore: { aboutKey: key('screens.restore.about') },
    rooms: {
      aboutKey: key('screens.rooms.about'),
      questionKeys: [key('screens.rooms.questions.ringCue')],
    },
    'telli-handoff': { aboutKey: key('screens.telliHandoff.about') },
    welcome: {
      aboutKey: key('screens.welcome.about'),
      questionKeys: [key('screens.welcome.questions.ring')],
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
