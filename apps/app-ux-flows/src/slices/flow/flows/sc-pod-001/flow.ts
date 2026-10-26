import { createStore as createJotaiStore } from 'jotai'

import { defineFlow } from '../../runtime/define-flow'
import { listingAtom, type ScPod001Components, type ScPod001InitialState, type ScPod001ScreenId } from './model'
import { HomeScreen } from './screens/home-screen'
import { defaultComponents } from '@/shared/ui/default-components'
import { podComponents } from '@/shared/ui/pod-components'

const key = (path: string) => `flows.scPod001.${path}`
const caseKey = (caseId: string, path: string) => key(`cases.${caseId}.${path}`)

const listingCase = (caseId: string, code: string, listing: NonNullable<ScPod001InitialState['listing']>) => ({
  code,
  descriptionKey: caseKey(caseId, 'description'),
  initialState: { listing },
  nameKey: caseKey(caseId, 'name'),
  screenNotes: { home: { aboutKey: caseKey(caseId, 'about') } },
})

export const scPod001Flow = defineFlow<ScPod001ScreenId, ScPod001Components, ScPod001InitialState>({
  cases: {
    a: listingCase('a', 'SC-POD-001-A', 'pods'),
    b: listingCase('b', 'SC-POD-001-B', 'loading'),
    c: listingCase('c', 'SC-POD-001-C', 'empty'),
    d: listingCase('d', 'SC-POD-001-D', 'error'),
  },
  code: 'SC-POD-001',
  components: { ...defaultComponents, ...podComponents },
  createStore(initialState) {
    const store = createJotaiStore()
    store.set(listingAtom, initialState?.listing ?? 'pods')
    return store
  },
  descriptionKey: key('description'),
  id: 'sc-pod-001',
  initialScreen: 'home',
  kind: 'showcase',
  screens: { home: HomeScreen },
  titleKey: key('title'),
})
