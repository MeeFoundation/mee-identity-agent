import { useStore } from 'jotai'
import { useEffect, useLayoutEffect, useRef } from 'react'

import { useFlowNavigation } from '../../../runtime/flow-context'
import { type MedicationDose, medicationDoseAtom } from '../model'

type DoseSheetOptions = {
  // Whether the sheet no longer applies to the dose, such as giving a dose already given. Must be stable.
  isSpent: (dose: MedicationDose) => boolean
  // Records leaving the sheet without confirming or cancelling, such as by browser back. Must be stable.
  recordCancel?: () => void
}

// The lifecycle of a dose sheet shown as its own screen. Call `settle` before confirming or cancelling.
export const useDoseSheet = ({ isSpent, recordCancel }: DoseSheetOptions) => {
  const { back } = useFlowNavigation()
  const store = useStore()
  const settledRef = useRef(false)
  const pendingCancelRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Only on arrival, e.g. by browser back or forward after confirming: stepping back skips the spent sheet
  // without adding a history entry, so the participant can still move further back.
  useLayoutEffect(() => {
    if (!settledRef.current && isSpent(store.get(medicationDoseAtom))) {
      settledRef.current = true
      back()
    }
  }, [store, back, isSpent])

  // Leaving by browser back is a cancellation too. The record is deferred so that React's
  // development-only unmount and remount of an effect does not record one.
  useEffect(() => {
    if (pendingCancelRef.current) clearTimeout(pendingCancelRef.current)
    pendingCancelRef.current = null
    return () => {
      if (settledRef.current || !recordCancel) return
      pendingCancelRef.current = setTimeout(recordCancel)
    }
  }, [recordCancel])

  return {
    settle: () => {
      settledRef.current = true
    },
  }
}
