import { useAtomValue } from 'jotai'
import { useEffect } from 'react'

import { DoseHistoryView } from '../../../pods/ginger/components/dose-history-view'
import { useFlowNavigation } from '../../../runtime/flow-context'
import { goalAtom } from '../model'

const noop = () => {}

export const DoseHistoryScreen = () => {
  const { complete } = useFlowNavigation()
  const goal = useAtomValue(goalAtom)

  useEffect(() => {
    if (goal === 'history') complete({ showCompletionView: false })
  }, [goal, complete])

  return <DoseHistoryView onFilter={noop} onMenu={noop} onMoreShown={noop} />
}
