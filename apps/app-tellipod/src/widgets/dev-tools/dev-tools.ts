import { getDefaultStore } from 'jotai'

import { onboardedAtom } from '@/features/onboarding'

const devTools = {
  resetOnboarding: () => getDefaultStore().set(onboardedAtom, false),
}

export type DevTools = typeof devTools

export const registerDevTools = () => {
  if (__DEV__) {
    Object.assign(globalThis, { dev: devTools })
  }
}
