import { useEffect, useReducer, useRef } from 'react'
import { View } from 'react-native'

export const withTiming = jest.fn((target: number, _config?: object) => target)

type Store = { listeners: Set<() => void>; version: number }

let tracker: Set<Store> | null = null

export const mockReanimated = {
  __esModule: true,
  default: { View },
  Easing: { cubic: undefined, out: () => undefined },
  ReduceMotion: { System: 'system' },
  useAnimatedStyle: (factory: () => object) => {
    const [, rerender] = useReducer((count: number) => count + 1, 0)
    const read = new Set<Store>()
    const previous = tracker
    tracker = read
    let style: object
    try {
      style = factory()
    } finally {
      tracker = previous
    }
    const seen = new Map([...read].map((store) => [store, store.version]))

    useEffect(() => {
      let stale = false
      for (const [store, version] of seen) {
        if (store.version !== version) stale = true
        store.listeners.add(rerender)
      }
      if (stale) rerender()
      return () => {
        for (const store of seen.keys()) store.listeners.delete(rerender)
      }
    })

    return style
  },
  useSharedValue: (initial: number) => {
    const holder = useRef<{ value: number } | null>(null)
    if (!holder.current) {
      let current = initial
      const store: Store = { listeners: new Set(), version: 0 }
      holder.current = {
        get value() {
          tracker?.add(store)
          return current
        },
        set value(next: number) {
          if (next === current) return
          current = next
          store.version += 1
          for (const listener of store.listeners) listener()
        },
      }
    }
    return holder.current
  },
  withTiming,
}
