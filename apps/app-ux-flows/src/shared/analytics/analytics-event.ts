type AnalyticsValue = string | number | boolean

export type AnalyticsProps = Readonly<Record<string, AnalyticsValue>>

export type VariantSource = 'url' | 'stored' | 'assigned' | 'default' | 'none'

export type AnalyticsDimensions = {
  flowId: string
  variantId: string | null
  screenId: string
  runId: string
  variantSource: VariantSource
}

export type AnalyticsEvent = {
  kind: 'screen_view' | 'lifecycle' | 'interaction'
  name: string
  props: AnalyticsProps
  dimensions: AnalyticsDimensions
  // Set only for `screen_view` events.
  page?: { path: string; title: string; referrerPath: string | null }
  value?: number
}

export type AnalyticsAdapter = {
  record(event: AnalyticsEvent): void
  startNewSession(): void
}

export type Analytics = AnalyticsAdapter
