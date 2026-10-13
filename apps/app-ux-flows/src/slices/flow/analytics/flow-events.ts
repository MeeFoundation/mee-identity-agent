import type { AnalyticsProps } from '@/shared/analytics/analytics-event'

// Each flow declares its interaction events as `event name → props`, or `undefined` for an event without props.
export type FlowEventMap = Record<string, AnalyticsProps | undefined>

// Lifecycle names belong to the runtime and cannot be recorded as interactions.
type ReservedName = `flow_${string}` | `screen_${string}`

export const isReservedEventName = (name: string) => name.startsWith('flow_') || name.startsWith('screen_')

type TrackArgs<P> = [P] extends [undefined] ? [] : [props: P]

export type FlowAnalytics<E extends FlowEventMap> = {
  track<K extends Exclude<keyof E & string, ReservedName>>(event: K, ...args: TrackArgs<E[K]>): void
}

// The untyped form the runtime provides; `useFlowAnalytics<E>()` narrows it per flow.
export type FlowEventSink = {
  track(event: string, props?: AnalyticsProps): void
}
