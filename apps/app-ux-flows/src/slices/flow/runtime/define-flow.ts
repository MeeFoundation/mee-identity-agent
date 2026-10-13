import type { createStore } from 'jotai'
import type { ComponentType, JSXElementConstructor } from 'react'

export type ScreenComponent = ComponentType

export type ComponentEnvironment = Record<string, JSXElementConstructor<never>>

export type FlowStore = ReturnType<typeof createStore>

export type DesignFrame = {
  name: string
  url: string
}

type DesignFrames<S extends string> = Partial<Record<S, DesignFrame>>

type VariantDefinition<S extends string, C extends ComponentEnvironment, I extends object> = {
  nameKey: string
  descriptionKey?: string
  // Design identifier such as `EXP-PET-002-A`, shown verbatim.
  code?: string
  components?: Partial<C>
  screens?: Partial<Record<S, ScreenComponent>>
  initialState?: I
  designFrames?: DesignFrames<S>
}

type Hints<S extends string> = Partial<Record<S, string>>

// What a screen is for and what reviewers should consider about it; shown with the briefing.
export type ScreenNote = {
  aboutKey?: string
  questionKeys?: readonly string[]
}

type ScreenNotes<S extends string> = Partial<Record<S, ScreenNote>>

// A task the tester is told to carry out; it shares every screen and differs only in its briefing and starting data.
type CaseDefinition<S extends string, I extends object> = {
  // Design identifier such as `SC-PET-001-B`, shown verbatim.
  code: string
  nameKey: string
  descriptionKey?: string
  goalKey?: string
  hints?: Hints<S>
  initialState?: I
  // Open questions about the case; its description is its explanation.
  questionKeys?: readonly string[]
  // A screen's explanation here replaces the flow's, and its questions follow the flow's.
  screenNotes?: ScreenNotes<S>
}

type VariantSelection = 'explicit' | 'automatic'

// An experiment is studied with participants and may compare variants; a showcase demonstrates one UX and is not tracked.
export type FlowKind = 'experiment' | 'showcase'

type FlowBase<S extends string, C extends ComponentEnvironment, I extends object> = {
  id: string
  // Design identifier such as `EXP-PET-002` or `SC-PET-001`, shown verbatim.
  code?: string
  titleKey: string
  descriptionKey?: string
  initialScreen: NoInfer<S>
  // `null` marks a screen that only some variants implement.
  screens: Record<S, ScreenComponent | null>
  components: C
  designFrames?: DesignFrames<NoInfer<S>>
  goalKey?: string
  hints?: Hints<NoInfer<S>>
  // Method syntax keeps concrete flows assignable to the registry's erased flow type.
  createStore(initialState?: I): FlowStore
}

type ExperimentDefinition<S extends string, C extends ComponentEnvironment, I extends object> = FlowBase<S, C, I> & {
  kind: 'experiment'
  variants?: Readonly<Record<string, VariantDefinition<NoInfer<S>, NoInfer<C>, NoInfer<I>>>>
  variantSelection?: VariantSelection
  // Explicit selection falls back to this variant, or to the first variant key when omitted.
  defaultVariant?: string
  cases?: never
  questionKeys?: never
  screenNotes?: never
}

// `never` members keep these fields readable on the union while forbidding them on showcases.
type ShowcaseDefinition<S extends string, C extends ComponentEnvironment, I extends object> = FlowBase<S, C, I> & {
  kind: 'showcase'
  variants?: never
  variantSelection?: never
  defaultVariant?: never
  cases?: Readonly<Record<string, CaseDefinition<NoInfer<S>, NoInfer<I>>>>
  // Open questions about the flow; its description is its explanation.
  questionKeys?: readonly string[]
  screenNotes?: ScreenNotes<NoInfer<S>>
}

export type FlowDefinition<S extends string, C extends ComponentEnvironment, I extends object> =
  | ExperimentDefinition<S, C, I>
  | ShowcaseDefinition<S, C, I>

export type AnyFlow = FlowDefinition<string, ComponentEnvironment, object>

// Overloads keep each flow's kind in its type, so spreading a flow into another stays the same kind.
export function defineFlow<S extends string, C extends ComponentEnvironment, I extends object>(
  flow: ExperimentDefinition<S, C, I>,
): ExperimentDefinition<S, C, I>
export function defineFlow<S extends string, C extends ComponentEnvironment, I extends object>(
  flow: ShowcaseDefinition<S, C, I>,
): ShowcaseDefinition<S, C, I>
export function defineFlow<S extends string, C extends ComponentEnvironment, I extends object>(
  flow: FlowDefinition<S, C, I>,
) {
  return flow
}
