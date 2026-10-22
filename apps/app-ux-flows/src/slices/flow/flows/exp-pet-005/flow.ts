import { createStore as createJotaiStore } from 'jotai'

import {
  apoquelMedication,
  createDoseHistory,
  createScheduledDose,
  gingerMembers,
  gingerSharedPod,
  pastCourses,
} from '../../pods/ginger/apoquel-fixture'
import {
  DEFAULT_HISTORY_FILTER,
  doseHistoryAtom,
  doseHistoryFilterAtom,
  medicationAtom,
  medicationCoursesAtom,
  medicationDoseAtom,
  podAtom,
  podMembersAtom,
} from '../../pods/ginger/model'
import { noteTextAtom } from '../../pods/notes/model'
import { type DesignFrame, defineFlow } from '../../runtime/define-flow'
import {
  DEFAULT_DOSE_ORIGIN,
  DEFAULT_DOSE_SURFACE,
  doseOriginAtom,
  doseSurfaceAtom,
  type ExpPet005Components,
  type ExpPet005InitialState,
  type ExpPet005ScreenId,
  toastAtom,
} from './model'
import { DoseHistoryScreen } from './screens/dose-history-screen'
import { GingerInfoScreen } from './screens/ginger-info-screen'
import { GingerNotesScreen } from './screens/ginger-notes-screen'
import { GiveDoseScreen } from './screens/give-dose-screen'
import { HomeScreen } from './screens/home-screen'
import { MedicalScreen } from './screens/medical-screen'
import { MedicationScreen } from './screens/medication-screen'
import { UndoDoseScreen } from './screens/undo-dose-screen'
import { defaultComponents } from '@/shared/ui/default-components'
import { podComponents } from '@/shared/ui/pod-components'

const figmaFrame = (name: string, nodeId: string): DesignFrame => ({
  name,
  url: `https://www.figma.com/design/cd6NZmMxZHC7qTOk0SXYVW/Mee---Tellipod-App-v4.0.3?node-id=${nodeId}`,
})

export const expPet005Flow = defineFlow<ExpPet005ScreenId, ExpPet005Components, ExpPet005InitialState>({
  code: 'EXP-PET-005',
  components: { ...defaultComponents, ...podComponents },
  createStore(initialState) {
    const store = createJotaiStore()
    const now = new Date()
    const medication = initialState?.medication ?? apoquelMedication
    store.set(podAtom, initialState?.pod ?? gingerSharedPod)
    store.set(podMembersAtom, gingerMembers)
    store.set(medicationAtom, medication)
    store.set(medicationCoursesAtom, pastCourses)
    // Scheduled when the run starts, so the dose reads "Due now" for the whole session.
    store.set(medicationDoseAtom, createScheduledDose(now, initialState?.doseGiven ? now : undefined))
    store.set(doseHistoryAtom, createDoseHistory(now, medication))
    store.set(doseHistoryFilterAtom, DEFAULT_HISTORY_FILTER)
    store.set(doseSurfaceAtom, initialState?.doseSurface ?? DEFAULT_DOSE_SURFACE)
    store.set(doseOriginAtom, DEFAULT_DOSE_ORIGIN)
    store.set(toastAtom, null)
    store.set(noteTextAtom, '')
    return store
  },
  descriptionKey: 'flows.expPet005.description',
  // Variant A's frames; B and C override the screens their promoted surface changes.
  designFrames: {
    'dose-history': figmaFrame('EXP-PET-005-A - Dose history', '1390-39955'),
    'ginger-info': figmaFrame('EXP-PET-005-A - Ginger (info)', '1390-39818'),
    'ginger-notes': figmaFrame('EXP-PET-005-A - Ginger (notes)', '1390-39776'),
    'give-dose': figmaFrame('EXP-PET-005-A - Give dose (sheet over Medical)', '1390-39873'),
    home: figmaFrame('EXP-PET-005-A - Home', '1390-39755'),
    medical: figmaFrame('EXP-PET-005-A - Medical', '1390-39843'),
    medication: figmaFrame('EXP-PET-005-A - Medication details (Apoquel)', '1390-39936'),
    'undo-dose': figmaFrame('EXP-PET-005-A - Undo dose (sheet over Medical)', '1390-39989'),
  },
  hidden: true,
  id: 'exp-pet-005',
  initialScreen: 'home',
  kind: 'experiment',
  screens: {
    'dose-history': DoseHistoryScreen,
    'ginger-info': GingerInfoScreen,
    'ginger-notes': GingerNotesScreen,
    'give-dose': GiveDoseScreen,
    home: HomeScreen,
    medical: MedicalScreen,
    medication: MedicationScreen,
    'undo-dose': UndoDoseScreen,
  },
  titleKey: 'flows.expPet005.title',
  variantSelection: 'explicit',
  variants: {
    a: {
      code: 'EXP-PET-005-A',
      descriptionKey: 'flows.expPet005.variants.a.description',
      initialState: { doseSurface: 'medical' },
      nameKey: 'flows.expPet005.variants.a.name',
    },
    b: {
      code: 'EXP-PET-005-B',
      descriptionKey: 'flows.expPet005.variants.b.description',
      designFrames: {
        'ginger-info': figmaFrame('EXP-PET-005-B - Ginger (info, dose given)', '1390-40210'),
        'ginger-notes': figmaFrame('EXP-PET-005-B - Ginger (notes, dose due)', '1390-40075'),
        'give-dose': figmaFrame('EXP-PET-005-B - Give dose (sheet over Notes)', '1390-40119'),
        home: figmaFrame('EXP-PET-005-B - Home', '1390-40054'),
      },
      initialState: { doseSurface: 'pod' },
      nameKey: 'flows.expPet005.variants.b.name',
    },
    c: {
      code: 'EXP-PET-005-C',
      descriptionKey: 'flows.expPet005.variants.c.description',
      designFrames: {
        'give-dose': figmaFrame('EXP-PET-005-C - Give dose (sheet over Home)', '1390-40265'),
        home: figmaFrame('EXP-PET-005-C - Home (Today, dose due)', '1390-40239'),
      },
      initialState: { doseSurface: 'home' },
      nameKey: 'flows.expPet005.variants.c.name',
    },
  },
})
