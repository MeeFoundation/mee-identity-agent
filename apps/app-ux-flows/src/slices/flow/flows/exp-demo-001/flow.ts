import { createStore as createJotaiStore } from 'jotai'

import { defaultComponents } from '@/shared/ui/default-components'
import { podComponents } from '@/shared/ui/pod-components'

import { gingerMedication, gingerPod, medicationAtom, medicationFormAddedAtom, podAtom } from '../../pods/ginger/model'
import { noteTextAtom } from '../../pods/notes/model'
import { defineFlow } from '../../runtime/define-flow'
import { ProminentEmptyStateCard } from './components/prominent-empty-state-card'
import type { ExpDemo001Components, ExpDemo001InitialState, ExpDemo001ScreenId } from './model'
import { GingerInfoScreen } from './screens/ginger-info-screen'
import { GingerNotesScreen } from './screens/ginger-notes-screen'
import { MedicationAddedScreen } from './screens/medication-added-screen'

export const expDemo001Flow = defineFlow<ExpDemo001ScreenId, ExpDemo001Components, ExpDemo001InitialState>({
  code: 'EXP-DEMO-001',
  components: { ...defaultComponents, ...podComponents },
  createStore(initialState) {
    const store = createJotaiStore()
    store.set(podAtom, initialState?.pod ?? gingerPod)
    store.set(medicationAtom, initialState?.medication ?? gingerMedication)
    store.set(medicationFormAddedAtom, false)
    store.set(noteTextAtom, '')
    return store
  },
  defaultVariant: 'a',
  descriptionKey: 'flows.expDemo001.description',
  id: 'exp-demo-001',
  initialScreen: 'ginger-notes',
  kind: 'experiment',
  screens: {
    'ginger-info': GingerInfoScreen,
    'ginger-notes': GingerNotesScreen,
    'medication-added': MedicationAddedScreen,
  },
  titleKey: 'flows.expDemo001.title',
  variantSelection: 'explicit',
  variants: {
    a: {
      code: 'EXP-DEMO-001-A',
      descriptionKey: 'flows.expDemo001.variants.a.description',
      nameKey: 'flows.expDemo001.variants.a.name',
    },
    b: {
      code: 'EXP-DEMO-001-B',
      components: { EmptyStateCard: ProminentEmptyStateCard },
      descriptionKey: 'flows.expDemo001.variants.b.description',
      nameKey: 'flows.expDemo001.variants.b.name',
    },
  },
})
