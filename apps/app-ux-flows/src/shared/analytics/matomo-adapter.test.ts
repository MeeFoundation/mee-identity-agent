import { describe, expect, it } from 'vitest'

import type { AnalyticsDimensions, AnalyticsEvent } from './analytics-event'
import { createMatomoAdapter, type MatomoCommand, type MatomoConfig, type MatomoEnv } from './matomo-adapter'

const config: MatomoConfig = {
  dimensions: { flowId: 1, runId: 3, screenId: 4, variantId: 2, variantSource: 5 },
  siteId: 7,
  url: 'https://matomo.example.com',
}

const dimensions: AnalyticsDimensions = {
  flowId: 'exp-pet-002',
  runId: 'run-1',
  screenId: 'add-form',
  variantId: 'b',
  variantSource: 'assigned',
}

const allDimensions = {
  dimension1: 'exp-pet-002',
  dimension2: 'b',
  dimension3: 'run-1',
  dimension4: 'add-form',
  dimension5: 'assigned',
}

const createFakeEnv = () => {
  const paq: MatomoCommand[] = []
  const scripts: string[] = []
  const env: MatomoEnv = {
    loadScript: (src) => {
      scripts.push(src)
    },
    origin: 'https://flows.example.com',
    push: (command) => {
      paq.push(command)
    },
  }
  return { env, paq, scripts }
}

const setup = (overrides: Partial<MatomoConfig> = {}) => {
  const fake = createFakeEnv()
  const adapter = createMatomoAdapter({ ...config, ...overrides }, fake.env)
  fake.paq.length = 0
  return { ...fake, adapter }
}

const screenView: AnalyticsEvent = {
  dimensions,
  kind: 'screen_view',
  name: 'screen_viewed',
  page: {
    path: '/flows/exp-pet-002/add-form',
    referrerPath: '/flows/exp-pet-002/ginger-info',
    title: 'exp-pet-002/add-form',
  },
  props: {},
}

describe('createMatomoAdapter', () => {
  it('configures the tracker and loads the script without an initial page view', () => {
    const { env, paq, scripts } = createFakeEnv()

    createMatomoAdapter({ ...config, url: 'https://matomo.example.com/' }, env)

    expect(paq).toEqual([
      ['setTrackerUrl', 'https://matomo.example.com/matomo.php'],
      ['setSiteId', '7'],
      ['enableHeartBeatTimer'],
    ])
    expect(scripts).toEqual(['https://matomo.example.com/matomo.js'])
  })

  it('sends a screen view as one page view on a normalized URL with every dimension', () => {
    const { adapter, paq } = setup()

    adapter.record(screenView)

    expect(paq).toEqual([
      ['setReferrerUrl', 'https://flows.example.com/flows/exp-pet-002/ginger-info'],
      ['setCustomUrl', 'https://flows.example.com/flows/exp-pet-002/add-form'],
      ['setDocumentTitle', 'exp-pet-002/add-form'],
      ['trackPageView', 'exp-pet-002/add-form', allDimensions],
    ])
    expect(paq.filter(([name]) => name === 'trackPageView')).toHaveLength(1)
  })

  it('skips the referrer for the first screen of a run', () => {
    const { adapter, paq } = setup()

    adapter.record({ ...screenView, page: { path: '/flows/exp-pet-002/ginger-notes', referrerPath: null, title: 't' } })

    expect(paq.map(([name]) => name)).toEqual(['setCustomUrl', 'setDocumentTitle', 'trackPageView'])
  })

  it('maps an interaction to a flow_interaction event with sorted encoded props', () => {
    const { adapter, paq } = setup()

    adapter.record({
      dimensions,
      kind: 'interaction',
      name: 'add_form_clicked',
      props: { confirmed: true, entry_point: 'medical_section' },
    })

    expect(paq).toEqual([
      [
        'trackEvent',
        'flow_interaction',
        'add_form_clicked',
        'confirmed=true;entry_point=medical_section',
        undefined,
        allDimensions,
      ],
    ])
  })

  it('maps flow_completed to a flow_lifecycle event with the duration as value', () => {
    const { adapter, paq } = setup()

    adapter.record({
      dimensions,
      kind: 'lifecycle',
      name: 'flow_completed',
      props: { duration_seconds: 95, visited_screen_count: 3 },
      value: 95,
    })

    expect(paq).toEqual([
      [
        'trackEvent',
        'flow_lifecycle',
        'flow_completed',
        'duration_seconds=95;visited_screen_count=3',
        95,
        allDimensions,
      ],
    ])
  })

  it('omits the event name when there are no props', () => {
    const { adapter, paq } = setup()

    adapter.record({ dimensions, kind: 'lifecycle', name: 'flow_resumed', props: {} })

    expect(paq).toEqual([['trackEvent', 'flow_lifecycle', 'flow_resumed', undefined, undefined, allDimensions]])
  })

  it('omits a dimension whose id is not configured', () => {
    const { adapter, paq } = setup({ dimensions: { flowId: 1, screenId: 4, variantId: 2, variantSource: 5 } })

    adapter.record({ dimensions, kind: 'interaction', name: 'medical_opened', props: {} })

    const { dimension3: _run, ...withoutRun } = allDimensions
    expect(paq).toEqual([['trackEvent', 'flow_interaction', 'medical_opened', undefined, undefined, withoutRun]])
  })

  it('starts a new visit once, then clears the new-visit flag after the next tracking call', () => {
    const { adapter, paq } = setup()

    adapter.startNewSession()
    adapter.record({ dimensions, kind: 'lifecycle', name: 'flow_resumed', props: {} })
    adapter.record({ dimensions, kind: 'lifecycle', name: 'flow_resumed', props: {} })

    expect(paq.map(([name, arg]) => (name === 'appendToTrackingUrl' ? `${name}:${String(arg)}` : name))).toEqual([
      'deleteCookies',
      'appendToTrackingUrl:new_visit=1',
      'trackEvent',
      'appendToTrackingUrl:',
      'trackEvent',
    ])
  })
})
