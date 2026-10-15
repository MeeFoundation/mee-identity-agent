import type { AnalyticsAdapter } from '@/shared/analytics/analytics-event'
import { createConsoleAdapter } from '@/shared/analytics/console-adapter'
import { createAnalytics } from '@/shared/analytics/fan-out'
import { createMatomoAdapter, type MatomoConfig, type MatomoDimensionIds } from '@/shared/analytics/matomo-adapter'
import { type DevMode, devMode } from '@/shared/lib/dev-mode'

const runtimeConfigKeys = [
  'VITE_ANALYTICS_ENABLED',
  'VITE_ANALYTICS_DEBUG',
  'VITE_MATOMO_URL',
  'VITE_MATOMO_SITE_ID',
  'VITE_MATOMO_DIMENSION_FLOW_ID',
  'VITE_MATOMO_DIMENSION_VARIANT_ID',
  'VITE_MATOMO_DIMENSION_RUN_ID',
  'VITE_MATOMO_DIMENSION_SCREEN_ID',
  'VITE_MATOMO_DIMENSION_VARIANT_SOURCE',
] as const

type AnalyticsEnv = Pick<ImportMetaEnv, (typeof runtimeConfigKeys)[number]>

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

// Dev mode writes events to the console; turned on through the URL, it also keeps reviewers' runs out of Matomo.
export const parseAnalyticsConfig = (env: AnalyticsEnv, mode: DevMode): AnalyticsConfig => {
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
    console: enabled && (mode.on || parseBoolean(env.VITE_ANALYTICS_DEBUG, false)),
    enabled,
    invalid,
    matomo: enabled && !mode.fromUrl && url !== '' && siteId !== undefined ? { dimensions, siteId, url } : null,
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

// A setting the deployment provides wins over the build-time value, even when it is empty.
export const resolveAnalyticsEnv = (
  buildEnv: AnalyticsEnv,
  runtimeConfig: Readonly<Record<string, unknown>> | undefined,
): AnalyticsEnv => {
  const overrides: Partial<Record<(typeof runtimeConfigKeys)[number], string>> = {}
  for (const key of runtimeConfigKeys) {
    const value = runtimeConfig?.[key]
    if (typeof value === 'string') overrides[key] = value
  }
  return { ...buildEnv, ...overrides }
}

const analyticsConfig = parseAnalyticsConfig(
  resolveAnalyticsEnv(import.meta.env, typeof window === 'undefined' ? undefined : window.__UX_FLOWS_CONFIG__),
  devMode,
)

if (import.meta.env.DEV && analyticsConfig.invalid.length > 0) {
  console.warn('[Flow Analytics] Ignoring invalid integer values for', analyticsConfig.invalid.join(', '))
}

export const analytics = createAnalytics(createAnalyticsAdapters(analyticsConfig))
