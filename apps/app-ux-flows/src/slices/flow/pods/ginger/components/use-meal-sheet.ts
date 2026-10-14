import { useStore } from 'jotai'
import { useLayoutEffect, useRef } from 'react'

import { useFlowNavigation } from '../../../runtime/flow-context'
import { type Meal, selectedMealAtom } from '../feeding'

// The lifecycle of a meal sheet shown as its own screen, like `useDoseSheet`. Call `settle` before confirming or
// cancelling. `isSpent` says whether the sheet no longer applies to its meal, and must be stable.
export const useMealSheet = (isSpent: (meal: Meal | undefined) => boolean) => {
  const { back } = useFlowNavigation()
  const store = useStore()
  const settledRef = useRef(false)

  // Only on arrival, e.g. by browser back or forward after confirming: stepping back skips the spent sheet.
  useLayoutEffect(() => {
    if (!settledRef.current && isSpent(store.get(selectedMealAtom))) {
      settledRef.current = true
      back()
    }
  }, [store, back, isSpent])

  return {
    settle: () => {
      settledRef.current = true
    },
  }
}
