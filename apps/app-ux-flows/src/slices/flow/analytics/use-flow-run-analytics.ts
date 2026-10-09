import { useEffect, useState } from 'react'

import type { VariantSource } from '@/shared/analytics/analytics-event'
import { useAnalytics } from '@/shared/analytics/analytics-provider'
import { createRandomId } from '@/shared/analytics/random-id'

import { createFlowRunTracker, selectFlowRunTracker } from './flow-run-tracker'
import { browserRunStorage } from './run-storage'

const entryPath = typeof window === 'undefined' ? '' : window.location.pathname

const readNavigationType = () => {
  try {
    const [entry] = performance.getEntriesByType('navigation')
    return entry instanceof PerformanceNavigationTiming ? entry.type : 'navigate'
  } catch {
    return 'navigate'
  }
}

let firstMountAvailable = true

const consumeFirstMount = () => {
  const available = firstMountAvailable
  firstMountAvailable = false
  return available
}

const warnInDev = (message: string) => {
  if (import.meta.env.DEV) console.warn(`[Flow Analytics] ${message}`)
}

type FlowRunAnalyticsInput = {
  // Fixed for the runner's lifetime, because the runner is remounted per flow.
  enabled: boolean
  flowId: string
  variantId: string | null
  variantSource: VariantSource
  screenId: string
  runKey: number
  completed: boolean
  completionViewShowing: boolean
}

export const useFlowRunAnalytics = ({
  enabled,
  flowId,
  variantId,
  variantSource,
  screenId,
  runKey,
  completed,
  completionViewShowing,
}: FlowRunAnalyticsInput) => {
  const sink = useAnalytics()
  const [tracker] = useState(() =>
    selectFlowRunTracker(enabled, () =>
      createFlowRunTracker({
        consumeFirstMount,
        createId: createRandomId,
        entryPath,
        flowId,
        navigationType: readNavigationType(),
        now: Date.now,
        sink,
        storage: browserRunStorage,
        variantId,
        variantSource,
        warn: warnInDev,
      }),
    ),
  )

  useEffect(() => {
    tracker.sync({ completed, completionViewShowing, runKey, screenId })
  }, [tracker, runKey, screenId, completed, completionViewShowing])

  useEffect(() => () => tracker.end(), [tracker])

  return tracker
}
