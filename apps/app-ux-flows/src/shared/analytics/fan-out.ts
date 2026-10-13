import type { Analytics, AnalyticsAdapter } from './analytics-event'

type FanOutOptions = {
  onFirstFailure?: (error: unknown) => void
}

const warnInDev = (error: unknown) => {
  if (import.meta.env.DEV) console.warn('[Flow Analytics] An analytics destination failed', error)
}

export const createAnalytics = (
  adapters: readonly AnalyticsAdapter[],
  { onFirstFailure = warnInDev }: FanOutOptions = {},
): Analytics => {
  let reported = false

  const each = (call: (adapter: AnalyticsAdapter) => void) => {
    for (const adapter of adapters) {
      try {
        call(adapter)
      } catch (error) {
        if (!reported) {
          reported = true
          onFirstFailure(error)
        }
      }
    }
  }

  return {
    record: (event) => each((adapter) => adapter.record(event)),
    startNewSession: () => each((adapter) => adapter.startNewSession()),
  }
}

export const noopAnalytics: Analytics = createAnalytics([])
