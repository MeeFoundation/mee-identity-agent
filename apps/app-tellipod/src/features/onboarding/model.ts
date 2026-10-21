import { atomWithStorage, createJSONStorage } from 'jotai/utils'

import { mmkvStorage } from '@/shared/storage'

export const onboardedAtom = atomWithStorage(
  'onboarding.completed',
  false,
  createJSONStorage(() => mmkvStorage),
  {
    getOnInit: true,
  },
)
