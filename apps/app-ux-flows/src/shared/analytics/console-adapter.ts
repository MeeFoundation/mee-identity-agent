import type { AnalyticsAdapter } from './analytics-event'

export const createConsoleAdapter = (): AnalyticsAdapter => ({
  record: ({ name, kind, dimensions, props }) => {
    console.info('[Flow Analytics]', name, {
      flow: dimensions.flowId,
      kind,
      props,
      run: dimensions.runId,
      screen: dimensions.screenId,
      source: dimensions.variantSource,
      variant: dimensions.variantId,
    })
  },
  startNewSession: () => {
    console.info('[Flow Analytics]', 'new session')
  },
})
