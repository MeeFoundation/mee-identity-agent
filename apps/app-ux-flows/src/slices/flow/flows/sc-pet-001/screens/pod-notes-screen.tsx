import { useLayoutEffect } from 'react'

import { NotesArea } from '../../../pods/notes/notes-area'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { PodHeader } from '../components/pod-header'
import { usePod } from '../components/use-pod'
import { useSuggestionTimer } from '../components/use-suggestion-timer'
import type { ScPet001Components } from '../model'

// Every way into the pod lands here; a waiting suggestion only marks the Info tab.
export const PodNotesScreen = () => {
  const pod = usePod()
  const { PodScreen } = useFlowComponents<ScPet001Components>()
  const { complete } = useFlowNavigation()
  const hasCategory = Boolean(pod?.category)

  useSuggestionTimer()

  // A pod that already has its Pet structure reaches the goal as soon as it is open.
  useLayoutEffect(() => {
    if (hasCategory) complete({ showCompletionView: false })
  }, [hasCategory, complete])

  if (!pod) return null

  return (
    <PodScreen topBar={<PodHeader pod={pod} tab="notes" />}>
      <NotesArea />
    </PodScreen>
  )
}
