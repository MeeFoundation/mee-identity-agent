import type { createStore } from 'jotai'
import type { ComponentType, JSXElementConstructor } from 'react'

export type ScreenComponent = ComponentType

export type ComponentEnvironment = Record<string, JSXElementConstructor<never>>

export type FlowStore = ReturnType<typeof createStore>

export type FlowDefinition<S extends string, C extends ComponentEnvironment, I> = {
  id: string
  titleKey: string
  initialScreen: NoInfer<S>
  screens: Record<S, ScreenComponent>
  components: C
  // Method syntax keeps concrete flows assignable to the registry's erased flow type.
  createStore(initialState?: I): FlowStore
}

export const defineFlow = <S extends string, C extends ComponentEnvironment, I>(flow: FlowDefinition<S, C, I>) => flow
