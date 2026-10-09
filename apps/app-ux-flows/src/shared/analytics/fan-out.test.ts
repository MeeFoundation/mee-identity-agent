import { describe, expect, it, vi } from 'vitest'

import type { AnalyticsAdapter, AnalyticsEvent } from './analytics-event'
import { createAnalytics } from './fan-out'

const event: AnalyticsEvent = {
  dimensions: { flowId: 'flow', runId: 'run', screenId: 'screen', variantId: null, variantSource: 'none' },
  kind: 'interaction',
  name: 'button_clicked',
  props: {},
}

const createRecordingAdapter = () => {
  const recorded: AnalyticsEvent[] = []
  let sessions = 0
  const adapter: AnalyticsAdapter = {
    record: (next) => {
      recorded.push(next)
    },
    startNewSession: () => {
      sessions += 1
    },
  }
  return { adapter, recorded, sessions: () => sessions }
}

const throwingAdapter: AnalyticsAdapter = {
  record: () => {
    throw new Error('record failed')
  },
  startNewSession: () => {
    throw new Error('session failed')
  },
}

describe('createAnalytics', () => {
  it('delivers to every adapter when one throws, without throwing to the caller', () => {
    const before = createRecordingAdapter()
    const after = createRecordingAdapter()
    const analytics = createAnalytics([before.adapter, throwingAdapter, after.adapter], { onFirstFailure: () => {} })

    expect(() => analytics.record(event)).not.toThrow()
    expect(() => analytics.startNewSession()).not.toThrow()

    expect(before.recorded).toEqual([event])
    expect(after.recorded).toEqual([event])
    expect(before.sessions()).toBe(1)
    expect(after.sessions()).toBe(1)
  })

  it('reports only the first failure', () => {
    const onFirstFailure = vi.fn()
    const analytics = createAnalytics([throwingAdapter, throwingAdapter], { onFirstFailure })

    analytics.record(event)
    analytics.startNewSession()

    expect(onFirstFailure).toHaveBeenCalledTimes(1)
  })
})
