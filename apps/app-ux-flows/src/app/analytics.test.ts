import { describe, expect, it } from 'vitest'

import { createAnalyticsAdapters, parseAnalyticsConfig, resolveAnalyticsEnv } from './analytics'
import type { AnalyticsAdapter } from '@/shared/analytics/analytics-event'

const productionMode = { fromUrl: false, on: false }
const devBuildMode = { fromUrl: false, on: true }
const urlDevMode = { fromUrl: true, on: true }

const matomoEnv = {
  VITE_MATOMO_DIMENSION_FLOW_ID: '1',
  VITE_MATOMO_DIMENSION_RUN_ID: '3',
  VITE_MATOMO_DIMENSION_SCREEN_ID: '4',
  VITE_MATOMO_DIMENSION_VARIANT_ID: '2',
  VITE_MATOMO_DIMENSION_VARIANT_SOURCE: '5',
  VITE_MATOMO_SITE_ID: '7',
  VITE_MATOMO_URL: 'https://matomo.example.com/',
}

const fakeMatomo: AnalyticsAdapter = { record: () => {}, startNewSession: () => {} }

describe('parseAnalyticsConfig', () => {
  it('uses Matomo when enabled by default with a URL and site id', () => {
    expect(parseAnalyticsConfig(matomoEnv, productionMode)).toEqual({
      console: false,
      enabled: true,
      invalid: [],
      matomo: {
        dimensions: { flowId: 1, runId: 3, screenId: 4, variantId: 2, variantSource: 5 },
        siteId: 7,
        url: 'https://matomo.example.com/',
      },
    })
  })

  it('skips Matomo when the URL or site id is missing', () => {
    expect(parseAnalyticsConfig({ ...matomoEnv, VITE_MATOMO_URL: '' }, productionMode).matomo).toBeNull()
    expect(parseAnalyticsConfig({ ...matomoEnv, VITE_MATOMO_SITE_ID: undefined }, productionMode).matomo).toBeNull()
  })

  it('ignores invalid integers and reports them', () => {
    const config = parseAnalyticsConfig(
      {
        ...matomoEnv,
        VITE_MATOMO_DIMENSION_RUN_ID: 'abc',
        VITE_MATOMO_SITE_ID: '1.5',
      },
      productionMode,
    )

    expect(config.matomo).toBeNull()
    expect(config.invalid).toEqual(['VITE_MATOMO_SITE_ID', 'VITE_MATOMO_DIMENSION_RUN_ID'])
  })

  it('leaves an unset dimension id undefined', () => {
    const config = parseAnalyticsConfig({ ...matomoEnv, VITE_MATOMO_DIMENSION_RUN_ID: undefined }, productionMode)

    expect(config.matomo?.dimensions.runId).toBeUndefined()
    expect(config.matomo?.dimensions.flowId).toBe(1)
  })

  it('turns console output on in dev mode or with debug enabled', () => {
    expect(parseAnalyticsConfig({}, devBuildMode).console).toBe(true)
    expect(parseAnalyticsConfig({}, urlDevMode).console).toBe(true)
    expect(parseAnalyticsConfig({ VITE_ANALYTICS_DEBUG: 'true' }, productionMode).console).toBe(true)
    expect(parseAnalyticsConfig({}, productionMode).console).toBe(false)
  })

  it('keeps Matomo out when dev mode was turned on through the URL, but not in a development build', () => {
    expect(parseAnalyticsConfig(matomoEnv, urlDevMode)).toMatchObject({ console: true, matomo: null })
    expect(parseAnalyticsConfig(matomoEnv, devBuildMode).matomo).not.toBeNull()
  })

  it('turns everything off when disabled', () => {
    expect(parseAnalyticsConfig({ ...matomoEnv, VITE_ANALYTICS_ENABLED: 'false' }, devBuildMode)).toMatchObject({
      console: false,
      enabled: false,
      matomo: null,
    })
  })
})

describe('createAnalyticsAdapters', () => {
  it('builds Matomo and console adapters from the config', () => {
    expect(createAnalyticsAdapters(parseAnalyticsConfig(matomoEnv, devBuildMode), () => fakeMatomo)).toHaveLength(2)
    expect(createAnalyticsAdapters(parseAnalyticsConfig(matomoEnv, productionMode), () => fakeMatomo)).toEqual([
      fakeMatomo,
    ])
    expect(
      createAnalyticsAdapters(parseAnalyticsConfig({ ...matomoEnv, VITE_ANALYTICS_ENABLED: 'false' }, productionMode)),
    ).toEqual([])
  })
})

describe('resolveAnalyticsEnv', () => {
  it('uses build-time values when there is no runtime config', () => {
    expect(resolveAnalyticsEnv(matomoEnv, undefined)).toEqual(matomoEnv)
    expect(resolveAnalyticsEnv(matomoEnv, {})).toEqual(matomoEnv)
  })

  it('lets a runtime value override the build-time value', () => {
    const env = resolveAnalyticsEnv(matomoEnv, {
      VITE_ANALYTICS_ENABLED: 'false',
      VITE_MATOMO_URL: 'https://runtime.example.com/',
    })
    expect(env.VITE_MATOMO_URL).toBe('https://runtime.example.com/')
    expect(parseAnalyticsConfig(env, productionMode).enabled).toBe(false)
  })

  it('lets an empty runtime value override a set build-time value', () => {
    expect(
      parseAnalyticsConfig(resolveAnalyticsEnv(matomoEnv, { VITE_MATOMO_URL: '' }), productionMode).matomo,
    ).toBeNull()
  })

  it('ignores non-string runtime values and unknown keys', () => {
    expect(resolveAnalyticsEnv(matomoEnv, { OTHER: 'x', VITE_MATOMO_SITE_ID: 9 })).toEqual(matomoEnv)
  })
})
