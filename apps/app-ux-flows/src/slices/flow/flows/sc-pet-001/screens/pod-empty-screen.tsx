import { useAtomValue } from 'jotai'
import { useEffect } from 'react'

import { useFlowNavigation } from '../../../runtime/flow-context'
import { PodView } from '../components/pod-view'
import { usePod } from '../components/use-pod'
import { useSuggestionTimer } from '../components/use-suggestion-timer'
import { infoHasDotAtom, type ScPet001ScreenId } from '../model'

export const PodEmptyScreen = () => {
  const pod = usePod()
  const suggestionReady = useAtomValue(infoHasDotAtom)
  const { goToScreen } = useFlowNavigation<ScPet001ScreenId>()

  useSuggestionTimer()

  // Once the suggestion is ready it takes this screen's place.
  useEffect(() => {
    if (suggestionReady) goToScreen('pod-template-suggested')
  }, [suggestionReady, goToScreen])

  return pod ? <PodView pod={pod} /> : null
}
