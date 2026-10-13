import { useAtomValue, useSetAtom } from 'jotai'
import { useLayoutEffect } from 'react'

import { useFlowNavigation } from '../../../runtime/flow-context'
import { PodView } from '../components/pod-view'
import { TemplateSuggestionCard } from '../components/template-suggestion-card'
import { usePod } from '../components/use-pod'
import {
  activeSuggestionAtom,
  applySuggestedTemplateAtom,
  dismissSuggestionAtom,
  type ScPet001ScreenId,
  suggestionReadyAtom,
} from '../model'

export const PodTemplateSuggestedScreen = () => {
  const pod = usePod()
  const suggestion = useAtomValue(activeSuggestionAtom)
  const dismissSuggestion = useSetAtom(dismissSuggestionAtom)
  const applySuggestedTemplate = useSetAtom(applySuggestedTemplateAtom)
  const setSuggestionReady = useSetAtom(suggestionReadyAtom)
  const { goToScreen } = useFlowNavigation<ScPet001ScreenId>()

  // Shown directly by URL, the suggestion counts as ready, so Notes marks Info until it is answered.
  useLayoutEffect(() => {
    setSuggestionReady(true)
  }, [setSuggestionReady])

  if (!pod) return null

  const dismiss = () => {
    dismissSuggestion()
    goToScreen('pod-empty')
  }

  const accept = () => {
    applySuggestedTemplate()
    goToScreen('pod-template-applied')
  }

  return (
    <PodView
      pod={pod}
      suggestion={
        suggestion && (
          <TemplateSuggestionCard onAccept={accept} onDismiss={dismiss} podName={pod.name} suggestion={suggestion} />
        )
      }
    />
  )
}
