import { useAtomValue, useSetAtom } from 'jotai'
import { useLayoutEffect } from 'react'

import { useFlowNavigation } from '../../../runtime/flow-context'
import { PodView } from '../components/pod-view'
import { applySuggestedTemplateAtom, createdPodAtom } from '../model'

export const PodTemplateAppliedScreen = () => {
  const pod = useAtomValue(createdPodAtom)
  const applySuggestedTemplate = useSetAtom(applySuggestedTemplateAtom)
  const { complete } = useFlowNavigation()

  // Opening this screen directly by URL also creates Ginger and applies the template, and completes the run in place.
  useLayoutEffect(() => {
    applySuggestedTemplate()
    complete({ showCompletionView: false })
  }, [applySuggestedTemplate, complete])

  return pod ? <PodView pod={pod} /> : null
}
