import { useLayoutEffect } from 'react'

import { useFlowNavigation } from '../../../runtime/flow-context'
import { PodNotesView } from '../components/pod-notes-view'
import { usePod } from '../components/use-pod'
import { useSuggestionTimer } from '../components/use-suggestion-timer'

// Every way into the pod lands here; a waiting suggestion only marks the Info tab.
export const PodNotesScreen = () => {
  const pod = usePod()
  const { complete } = useFlowNavigation()
  const hasCategory = Boolean(pod?.category)

  useSuggestionTimer()

  // A pod that already has its Pet structure reaches the goal as soon as it is open.
  useLayoutEffect(() => {
    if (hasCategory) complete({ showCompletionView: false })
  }, [hasCategory, complete])

  if (!pod) return null

  return <PodNotesView pod={pod} />
}
