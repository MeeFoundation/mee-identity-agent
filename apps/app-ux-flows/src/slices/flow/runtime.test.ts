import { createStore } from 'jotai'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Flow } from './model'
import { advanceFlowInstance, readFlowInstance, setFlowValue, startFlowInstance } from './runtime'

const createTestFlow = (id: string): Flow => ({
  createInitialData: () => ({ name: `initial-${id}` }),
  id,
  screens: [
    { blocks: [], id: 'first' },
    { blocks: [], id: 'second' },
    { blocks: [], id: 'third' },
  ],
  titleKey: id,
})

describe('flow runtime', () => {
  beforeEach(() => {
    const memory = new Map<string, string>()
    vi.stubGlobal('sessionStorage', {
      getItem: (key: string) => memory.get(key) ?? null,
      removeItem: (key: string) => memory.delete(key),
      setItem: (key: string, value: string) => memory.set(key, value),
    })
  })

  it('seeds a fresh instance from the initial-data factory', () => {
    const flow = createTestFlow('seed')

    expect(readFlowInstance(createStore(), flow)).toEqual({
      currentScreenId: 'first',
      data: { name: 'initial-seed' },
      status: 'in-progress',
    })
  })

  it('advances through every screen and then completes', () => {
    const store = createStore()
    const flow = createTestFlow('advance')

    expect(advanceFlowInstance(store, flow).currentScreenId).toBe('second')
    expect(advanceFlowInstance(store, flow).currentScreenId).toBe('third')
    expect(advanceFlowInstance(store, flow).status).toBe('completed')
    expect(() => advanceFlowInstance(store, flow)).not.toThrow()
    expect(readFlowInstance(store, flow).status).toBe('completed')
  })

  it('keeps instances of different flows isolated', () => {
    const store = createStore()
    const flowA = createTestFlow('isolation-a')
    const flowB = createTestFlow('isolation-b')
    startFlowInstance(store, flowA)
    startFlowInstance(store, flowB)

    setFlowValue(store, flowA, 'name', 'changed')

    expect(readFlowInstance(store, flowA).data).toEqual({ name: 'changed' })
    expect(readFlowInstance(store, flowB).data).toEqual({ name: 'initial-isolation-b' })
  })

  it('resets to the initial data when a flow is started again', () => {
    const store = createStore()
    const flow = createTestFlow('restart')
    setFlowValue(store, flow, 'name', 'changed')
    advanceFlowInstance(store, flow)
    advanceFlowInstance(store, flow)
    advanceFlowInstance(store, flow)

    startFlowInstance(store, flow)

    expect(readFlowInstance(store, flow)).toEqual({
      currentScreenId: 'first',
      data: flow.createInitialData(),
      status: 'in-progress',
    })
  })
})
