import { type createStore, useAtomValue, useStore } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { useMemo } from 'react'

import type { Flow, FlowInstance } from './model'

type Store = ReturnType<typeof createStore>

const storage = createJSONStorage<FlowInstance>(() => sessionStorage)

const createInstance = (flow: Flow): FlowInstance => ({
  currentScreenId: flow.screens[0].id,
  data: flow.createInitialData(),
  status: 'in-progress',
})

const createInstanceAtom = (flow: Flow) =>
  atomWithStorage(`ux-flows:${flow.id}`, createInstance(flow), storage, { getOnInit: true })

const instanceAtoms = new Map<string, ReturnType<typeof createInstanceAtom>>()

const getInstanceAtom = (flow: Flow) => {
  const existing = instanceAtoms.get(flow.id)
  if (existing) return existing

  const created = createInstanceAtom(flow)
  instanceAtoms.set(flow.id, created)
  return created
}

const writeInstance = (store: Store, flow: Flow, instance: FlowInstance) => {
  store.set(getInstanceAtom(flow), instance)
  return instance
}

export const readFlowInstance = (store: Store, flow: Flow) => store.get(getInstanceAtom(flow))

export const startFlowInstance = (store: Store, flow: Flow) => writeInstance(store, flow, createInstance(flow))

export const openFlowScreen = (store: Store, flow: Flow, screenId: string) => {
  const instance = readFlowInstance(store, flow)
  if (instance.status === 'completed' || instance.currentScreenId === screenId) return instance

  return writeInstance(store, flow, { ...instance, currentScreenId: screenId })
}

export const advanceFlowInstance = (store: Store, flow: Flow) => {
  const instance = readFlowInstance(store, flow)
  if (instance.status === 'completed') return instance

  const nextScreen = flow.screens[flow.screens.findIndex((screen) => screen.id === instance.currentScreenId) + 1]
  if (!nextScreen) return writeInstance(store, flow, { ...instance, status: 'completed' })

  return writeInstance(store, flow, { ...instance, currentScreenId: nextScreen.id })
}

export const setFlowValue = (store: Store, flow: Flow, key: string, value: string) => {
  const instance = readFlowInstance(store, flow)
  return writeInstance(store, flow, { ...instance, data: { ...instance.data, [key]: value } })
}

export const useFlowInstance = (flow: Flow) => useAtomValue(getInstanceAtom(flow))

export const useFlowActions = (flow: Flow) => {
  const store = useStore()

  return useMemo(
    () => ({
      advance: () => advanceFlowInstance(store, flow),
      restart: () => startFlowInstance(store, flow),
      setValue: (key: string, value: string) => setFlowValue(store, flow, key, value),
    }),
    [store, flow],
  )
}
