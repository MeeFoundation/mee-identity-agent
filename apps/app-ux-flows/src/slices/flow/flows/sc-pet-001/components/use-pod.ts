import { useAtomValue, useSetAtom } from 'jotai'
import { useLayoutEffect } from 'react'

import { createdPodAtom, ensurePodAtom } from '../model'

// For pod screens: a direct link still shows a pod, created before the first paint.
export const usePod = () => {
  const pod = useAtomValue(createdPodAtom)
  const ensurePod = useSetAtom(ensurePodAtom)

  useLayoutEffect(() => {
    ensurePod()
  }, [ensurePod])

  return pod
}
