import { createStore as createJotaiStore } from 'jotai'

import { defaultComponents } from '@/shared/ui/default-components'

import { defineFlow } from '../../runtime/define-flow'
import type { ScOnb004Components, ScOnb004ScreenId } from './model'
import { DevicesScreen } from './screens/devices-screen'
import { LandingScreen } from './screens/landing-screen'
import { ProfileChooseScreen } from './screens/profile-choose-screen'
import { ProfileFormScreen } from './screens/profile-form-screen'
import { SetupScreen } from './screens/setup-screen'
import { NextScreen, PairingScreen } from './screens/stand-in-screen'
import { TourScreen } from './screens/tour-screen'

const key = (path: string) => `flows.scOnb004.${path}`

type ScOnb004InitialState = Record<string, never>

export const scOnb004Flow = defineFlow<ScOnb004ScreenId, ScOnb004Components, ScOnb004InitialState>({
  code: 'SC-ONB-004',
  components: defaultComponents,
  createStore: () => createJotaiStore(),
  descriptionKey: key('description'),
  goalKey: key('goal'),
  hints: {
    devices: key('hints.devices'),
    landing: key('hints.landing'),
    next: key('hints.next'),
    pairing: key('hints.pairing'),
    'pod-anything': key('hints.podAnything'),
    'profile-choose': key('hints.profileChoose'),
    'profile-form': key('hints.profileForm'),
    setup: key('hints.setup'),
    'share-once': key('hints.shareOnce'),
    'yours-to-keep': key('hints.yoursToKeep'),
  },
  id: 'sc-onb-004',
  initialScreen: 'landing',
  kind: 'showcase',
  questionKeys: [key('questions.tourClearer'), key('questions.skipMissesPod'), key('questions.simulatedContacts')],
  screenNotes: {
    devices: {
      aboutKey: key('screens.devices.about'),
      questionKeys: [key('screens.devices.questions.later')],
    },
    landing: {
      aboutKey: key('screens.landing.about'),
      questionKeys: [key('screens.landing.questions.minute')],
    },
    next: { aboutKey: key('screens.next.about') },
    pairing: { aboutKey: key('screens.pairing.about') },
    'pod-anything': {
      aboutKey: key('screens.podAnything.about'),
      questionKeys: [key('screens.podAnything.questions.examples')],
    },
    'profile-choose': {
      aboutKey: key('screens.profileChoose.about'),
      questionKeys: [key('screens.profileChoose.questions.contactCard')],
    },
    'profile-form': {
      aboutKey: key('screens.profileForm.about'),
      questionKeys: [key('screens.profileForm.questions.extraFields')],
    },
    setup: {
      aboutKey: key('screens.setup.about'),
      questionKeys: [key('screens.setup.questions.pairingEarly')],
    },
    'share-once': {
      aboutKey: key('screens.shareOnce.about'),
      questionKeys: [key('screens.shareOnce.questions.readsAs')],
    },
    'yours-to-keep': {
      aboutKey: key('screens.yoursToKeep.about'),
      questionKeys: [key('screens.yoursToKeep.questions.closing')],
    },
  },
  screens: {
    devices: DevicesScreen,
    landing: LandingScreen,
    next: NextScreen,
    pairing: PairingScreen,
    'pod-anything': TourScreen,
    'profile-choose': ProfileChooseScreen,
    'profile-form': ProfileFormScreen,
    setup: SetupScreen,
    'share-once': TourScreen,
    'yours-to-keep': TourScreen,
  },
  titleKey: key('title'),
})
