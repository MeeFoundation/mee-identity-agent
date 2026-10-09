import { useAtomValue } from 'jotai'
import { useEffect } from 'react'

import { useFlowNavigation } from '../../../runtime/flow-context'
import { PodView } from '../components/pod-view'
import { usePod } from '../components/use-pod'
import { type ScPet001ScreenId, shouldOfferSuggestionAtom } from '../model'

// Long enough to take in the generic pod before the suggestion replaces it.
const SUGGESTION_DELAY_MS = 1500

export const PodEmptyScreen = () => {
  const pod = usePod()
  const shouldOfferSuggestion = useAtomValue(shouldOfferSuggestionAtom)
  const { goToScreen } = useFlowNavigation<ScPet001ScreenId>()

  useEffect(() => {
    if (!shouldOfferSuggestion) return
    const timer = setTimeout(() => goToScreen('pod-template-suggested'), SUGGESTION_DELAY_MS)
    return () => clearTimeout(timer)
  }, [shouldOfferSuggestion, goToScreen])

  return pod ? <PodView pod={pod} /> : null
}
