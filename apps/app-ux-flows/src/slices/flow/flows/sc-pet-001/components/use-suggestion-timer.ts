import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'

import { shouldOfferSuggestionAtom, suggestionReadyAtom } from '../model'

// Long enough to take in the generic pod before the suggestion arrives.
const SUGGESTION_DELAY_MS = 1500

// For pod screens: the suggestion becomes ready once the pod has been on screen for a moment, on either tab.
export const useSuggestionTimer = () => {
  const shouldOfferSuggestion = useAtomValue(shouldOfferSuggestionAtom)
  const suggestionReady = useAtomValue(suggestionReadyAtom)
  const setSuggestionReady = useSetAtom(suggestionReadyAtom)

  useEffect(() => {
    if (!shouldOfferSuggestion || suggestionReady) return
    const timer = setTimeout(() => setSuggestionReady(true), SUGGESTION_DELAY_MS)
    return () => clearTimeout(timer)
  }, [shouldOfferSuggestion, suggestionReady, setSuggestionReady])
}
