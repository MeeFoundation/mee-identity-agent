import { atom } from 'jotai'

import type { DefaultComponents } from '@/shared/ui/default-components'
import type { PodComponents } from '@/shared/ui/pod-components'

export type ScPod001ScreenId = 'home'

export type ScPod001Components = DefaultComponents & PodComponents

// The state the pod list is in; each case starts the run in one of them.
export type PodListing = 'pods' | 'loading' | 'empty' | 'error'

export type ScPod001InitialState = {
  listing?: PodListing
}

export const listingAtom = atom<PodListing>('pods')
