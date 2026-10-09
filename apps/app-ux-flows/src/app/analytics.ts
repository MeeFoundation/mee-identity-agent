import type { AnalyticsAdapter } from '@/shared/analytics/analytics-event'
import { createConsoleAdapter } from '@/shared/analytics/console-adapter'
import { createAnalytics } from '@/shared/analytics/fan-out'
import { createMatomoAdapter, type MatomoConfig, type MatomoDimensionIds } from '@/shared/analytics/matomo-adapter'

type AnalyticsEnv = Pick<
  ImportMetaEnv,
  | 'DEV'
  | 'VITE_ANALYTICS_ENABLED'
  | 'VITE_ANALYTICS_DEBUG'
  | 'VITE_MATOMO_URL'
  | 'VITE_MATOMO_SITE_ID'
  | 'VITE_MATOMO_DIMENSION_FLOW_ID'
  | 'VITE_MATOMO_DIMENSION_VARIANT_ID'
  | 'VITE_MATOMO_DIMENSION_RUN_ID'
  | 'VITE_MATOMO_DIMENSION_SCREEN_ID'
  | 'VITE_MATOMO_DIMENSION_VARIANT_SOURCE'
>

export type AnalyticsConfig = {
  enabled: boolean
  console: boolean
  matomo: MatomoConfig | null
  // Variables that were set but are not valid positive integers.
  invalid: string[]
}

const parseBoolean = (value: string | undefined, fallback: boolean) => {
  const normalized = value?.trim().toLowerCase()
  if (normalized === 'true' || normalized === '1') return true
  if (normalized === 'false' || normalized === '0') return false
  return fallback
}

export const parseAnalyticsConfig = (env: AnalyticsEnv): AnalyticsConfig => {
  const invalid: string[] = []

  const parseId = (name: keyof AnalyticsEnv) => {
    const value = env[name]
    if (typeof value !== 'string' || value.trim() === '') return undefined
    const trimmed = value.trim()
    if (/^[1-9]\d*$/.test(trimmed)) return Number(trimmed)
    invalid.push(name)
    return undefined
  }

  const enabled = parseBoolean(env.VITE_ANALYTICS_ENABLED, true)
  const url = env.VITE_MATOMO_URL?.trim() ?? ''
  const siteId = parseId('VITE_MATOMO_SITE_ID')
  const dimensions: MatomoDimensionIds = {
    flowId: parseId('VITE_MATOMO_DIMENSION_FLOW_ID'),
    runId: parseId('VITE_MATOMO_DIMENSION_RUN_ID'),
    screenId: parseId('VITE_MATOMO_DIMENSION_SCREEN_ID'),
    variantId: parseId('VITE_MATOMO_DIMENSION_VARIANT_ID'),
    variantSource: parseId('VITE_MATOMO_DIMENSION_VARIANT_SOURCE'),
  }

  return {
    console: enabled && (env.DEV || parseBoolean(env.VITE_ANALYTICS_DEBUG, false)),
    enabled,
    invalid,
    matomo: enabled && url !== '' && siteId !== undefined ? { dimensions, siteId, url } : null,
  }
}

export const createAnalyticsAdapters = (
  config: AnalyticsConfig,
  createMatomo: (matomo: MatomoConfig) => AnalyticsAdapter = createMatomoAdapter,
): AnalyticsAdapter[] => {
  const adapters: AnalyticsAdapter[] = []
  if (config.matomo) adapters.push(createMatomo(config.matomo))
  if (config.console) adapters.push(createConsoleAdapter())
  return adapters
}

const analyticsConfig = parseAnalyticsConfig(import.meta.env)

if (import.meta.env.DEV && analyticsConfig.invalid.length > 0) {
  console.warn('[Flow Analytics] Ignoring invalid integer values for', analyticsConfig.invalid.join(', '))
}

export const analytics = createAnalytics(createAnalyticsAdapters(analyticsConfig))
