import { useAtomValue, useStore } from 'jotai'
import { useEffect } from 'react'

import { noteEditsAtom, scheduleAnalysis } from '../model'

// Analyses the note once typing has paused; every edit restarts the wait.
export const useAnalysisTimer = () => {
  const store = useStore()
  const edits = useAtomValue(noteEditsAtom)

  useEffect(() => (edits > 0 ? (scheduleAnalysis(store) ?? undefined) : undefined), [store, edits])
}
