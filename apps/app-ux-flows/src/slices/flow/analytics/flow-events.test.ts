import { describe, expect, it } from 'vitest'

import type { FlowAnalytics } from './flow-events'

type FixtureEvents = {
  item_opened: undefined
  item_added: { method: 'manual' | 'suggestion' }
  flow_hijacked: undefined
}

const recorded: unknown[][] = []
const analytics: FlowAnalytics<FixtureEvents> = {
  track: (...args: unknown[]) => {
    recorded.push(args)
  },
}

describe('FlowAnalytics typing', () => {
  it('accepts declared events and rejects everything else at compile time', () => {
    analytics.track('item_opened')
    analytics.track('item_added', { method: 'suggestion' })

    // @ts-expect-error unknown event name
    analytics.track('item_removed')
    // @ts-expect-error missing required props
    analytics.track('item_added')
    // @ts-expect-error prop value outside the declared set
    analytics.track('item_added', { method: 'typed' })
    // @ts-expect-error props on an event that declares none
    analytics.track('item_opened', { method: 'manual' })
    // @ts-expect-error reserved lifecycle name, even when declared
    analytics.track('flow_hijacked')

    expect(recorded[1]).toEqual(['item_added', { method: 'suggestion' }])
  })
})
