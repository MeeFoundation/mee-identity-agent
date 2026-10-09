import { useAtomValue, useSetAtom } from 'jotai'

import { useFlowNavigation } from '../../../runtime/flow-context'
import { PodView } from '../components/pod-view'
import { TemplateSuggestionCard } from '../components/template-suggestion-card'
import { usePod } from '../components/use-pod'
import {
  activeSuggestionAtom,
  applySuggestedTemplateAtom,
  dismissSuggestionAtom,
  type ScPet001ScreenId,
} from '../model'

export const PodTemplateSuggestedScreen = () => {
  const pod = usePod()
  const suggestion = useAtomValue(activeSuggestionAtom)
  const dismissSuggestion = useSetAtom(dismissSuggestionAtom)
  const applySuggestedTemplate = useSetAtom(applySuggestedTemplateAtom)
  const { goToScreen } = useFlowNavigation<ScPet001ScreenId>()

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
