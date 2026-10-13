import type { AnalyticsAdapter, AnalyticsDimensions, AnalyticsEvent, AnalyticsProps } from './analytics-event'

type MatomoArg = string | number | Readonly<Record<string, string>> | undefined

export type MatomoCommand = readonly [string, ...MatomoArg[]]

export type MatomoDimensionIds = Partial<Record<keyof AnalyticsDimensions, number>>

export type MatomoConfig = {
  url: string
  siteId: number
  dimensions: MatomoDimensionIds
}

export type MatomoEnv = {
  push(command: MatomoCommand): void
  origin: string
  loadScript(src: string): void
}

type MatomoQueue = { push(...commands: MatomoCommand[]): unknown }

// Reads `_paq` on every push because matomo.js replaces the array with its own queue once loaded.
const createBrowserMatomoEnv = (): MatomoEnv => {
  const host = window as Window & { _paq?: MatomoQueue }
  host._paq ??= []
  return {
    loadScript: (src) => {
      const script = document.createElement('script')
      script.async = true
      script.src = src
      // A blocked or unreachable tracker must never surface to the participant.
      script.onerror = () => {}
      document.head.append(script)
    },
    origin: window.location.origin,
    push: (command) => {
      host._paq ??= []
      host._paq.push(command)
    },
  }
}

const encodeProps = (props: AnalyticsProps) => {
  const entries = Object.keys(props)
    .sort()
    .map((key) => `${key}=${String(props[key])}`)
  return entries.length > 0 ? entries.join(';') : undefined
}

const buildCustomData = (dimensions: AnalyticsDimensions, ids: MatomoDimensionIds) => {
  const data: Record<string, string> = {}
  for (const key of Object.keys(ids) as (keyof AnalyticsDimensions)[]) {
    const id = ids[key]
    const value = dimensions[key]
    if (id !== undefined && value !== null) data[`dimension${id}`] = value
  }
  return data
}

export const createMatomoAdapter = (
  config: MatomoConfig,
  env: MatomoEnv = createBrowserMatomoEnv(),
): AnalyticsAdapter => {
  const baseUrl = config.url.endsWith('/') ? config.url : `${config.url}/`
  let newVisitPending = false

  env.push(['setTrackerUrl', `${baseUrl}matomo.php`])
  env.push(['setSiteId', String(config.siteId)])
  env.push(['enableHeartBeatTimer'])
  env.loadScript(`${baseUrl}matomo.js`)

  const track = (event: AnalyticsEvent) => {
    const customData = buildCustomData(event.dimensions, config.dimensions)

    if (event.kind === 'screen_view' && event.page) {
      if (event.page.referrerPath !== null) env.push(['setReferrerUrl', env.origin + event.page.referrerPath])
      env.push(['setCustomUrl', env.origin + event.page.path])
      env.push(['setDocumentTitle', event.page.title])
      env.push(['trackPageView', event.page.title, customData])
      return
    }

    const category = event.kind === 'interaction' ? 'flow_interaction' : 'flow_lifecycle'
    env.push(['trackEvent', category, event.name, encodeProps(event.props), event.value, customData])
  }

  return {
    record: (event) => {
      track(event)
      if (newVisitPending) {
        newVisitPending = false
        env.push(['appendToTrackingUrl', ''])
      }
    },
    startNewSession: () => {
      env.push(['deleteCookies'])
      env.push(['appendToTrackingUrl', 'new_visit=1'])
      newVisitPending = true
    },
  }
}
