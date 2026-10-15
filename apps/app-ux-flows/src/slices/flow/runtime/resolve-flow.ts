import type {
  AnyFlow,
  ComponentEnvironment,
  DesignFrame,
  FlowDefinition,
  FlowKind,
  FlowStore,
  ScreenComponent,
  ScreenNote,
} from './define-flow'

export type CaseChoice = {
  id: string
  code: string
  nameKey: string
  hidden: boolean
}

// An explanation and the open questions about one part of a showcase.
export type ResolvedNote = {
  aboutKey: string | null
  questionKeys: readonly string[]
}

type ResolvedNotes<S extends string> = {
  flow: ResolvedNote
  // `null` when the run is not in a case.
  case: ResolvedNote | null
  screens: Partial<Record<S, ResolvedNote>>
}

export type ResolvedFlow<S extends string, C extends ComponentEnvironment, I extends object> = {
  flowId: string
  kind: FlowKind
  variantId: string | null
  caseId: string | null
  code: string | null
  variantCode: string | null
  caseCode: string | null
  caseNameKey: string | null
  // Every case of the flow in declaration order, empty when it has none.
  cases: readonly CaseChoice[]
  goalKey: string | null
  hints: Partial<Record<S, string>>
  notes: ResolvedNotes<S>
  titleKey: string
  descriptionKey: string | null
  initialScreen: S
  screens: Partial<Record<S, ScreenComponent>>
  components: C
  designFrames: Partial<Record<S, DesignFrame>>
  createStore(initialState?: I): FlowStore
}

const cache = new WeakMap<object, Map<string, unknown>>()

export const listCases = (flow: AnyFlow): CaseChoice[] =>
  Object.entries(flow.cases ?? {}).map(([id, { code, nameKey, hidden }]) => ({
    code,
    hidden: hidden === true,
    id,
    nameKey,
  }))

export const isCaseOf = (flow: AnyFlow, caseId: string) => flow.cases !== undefined && Object.hasOwn(flow.cases, caseId)

// Without a requested case, a flow with cases runs its first case.
const effectiveCaseId = (flow: AnyFlow, caseId: string | null) => {
  if (caseId === null) return Object.keys(flow.cases ?? {})[0] ?? null
  if (!isCaseOf(flow, caseId)) throw new Error(`Flow "${flow.id}" has no case "${caseId}"`)
  return caseId
}

// Later layers win field by field; with no layer at all the flow builds its own defaults.
const mergeState = <I extends object>(...layers: (I | undefined)[]): I | undefined => {
  const defined = layers.filter((layer) => layer !== undefined)
  return defined.length === 0 ? undefined : Object.assign({}, ...defined)
}

const toNote = (aboutKey: string | undefined, questionKeys: readonly string[] | undefined): ResolvedNote => ({
  aboutKey: aboutKey ?? null,
  questionKeys: questionKeys ?? [],
})

// A case's explanation of a screen replaces the flow's; its questions follow the flow's.
const resolveScreenNotes = <S extends string>(
  flowNotes: Partial<Record<S, ScreenNote>> = {},
  caseNotes: Partial<Record<S, ScreenNote>> = {},
) => {
  const resolved: Partial<Record<S, ResolvedNote>> = {}
  const screenIds = new Set([...Object.keys(flowNotes), ...Object.keys(caseNotes)] as S[])
  for (const screenId of screenIds) {
    const flowNote = flowNotes[screenId]
    const caseNote = caseNotes[screenId]
    resolved[screenId] = toNote(caseNote?.aboutKey ?? flowNote?.aboutKey, [
      ...(flowNote?.questionKeys ?? []),
      ...(caseNote?.questionKeys ?? []),
    ])
  }
  return resolved
}

const resolveScreens = <S extends string>(screens: Record<S, ScreenComponent | null>) => {
  const resolved: Partial<Record<S, ScreenComponent>> = {}
  for (const [screenId, screen] of Object.entries<ScreenComponent | null>(screens)) {
    if (screen) resolved[screenId as S] = screen
  }
  return resolved
}

const createResolvedFlow = <S extends string, C extends ComponentEnvironment, I extends object>(
  flow: FlowDefinition<S, C, I>,
  variantId: string | null,
  caseId: string | null,
): ResolvedFlow<S, C, I> => {
  const { variants, cases } = flow
  const hasVariants = variants !== undefined && Object.keys(variants).length > 0

  if (variantId === null && hasVariants) {
    throw new Error(`Flow "${flow.id}" declares variants, so a variant id is required`)
  }
  if (variantId !== null && !(variants && Object.hasOwn(variants, variantId))) {
    throw new Error(`Flow "${flow.id}" has no variant "${variantId}"`)
  }

  const variant = variantId === null ? undefined : variants?.[variantId]
  const screens = resolveScreens({ ...flow.screens, ...variant?.screens })

  if (!Object.hasOwn(screens, flow.initialScreen)) {
    throw new Error(
      `Flow "${flow.id}" variant "${variantId}" does not implement its initial screen "${flow.initialScreen}"`,
    )
  }

  const activeCase = caseId === null ? undefined : cases?.[caseId]

  return {
    caseCode: activeCase?.code ?? null,
    caseId,
    caseNameKey: activeCase?.nameKey ?? null,
    cases: listCases(flow),
    code: flow.code ?? null,
    components: { ...flow.components, ...variant?.components },
    createStore: (initialState) =>
      flow.createStore(mergeState(variant?.initialState, activeCase?.initialState, initialState)),
    descriptionKey: flow.descriptionKey ?? null,
    designFrames: { ...flow.designFrames, ...variant?.designFrames },
    flowId: flow.id,
    goalKey: activeCase?.goalKey ?? flow.goalKey ?? null,
    hints: { ...flow.hints, ...activeCase?.hints },
    initialScreen: flow.initialScreen,
    kind: flow.kind,
    notes: {
      case: activeCase ? toNote(activeCase.descriptionKey, activeCase.questionKeys) : null,
      flow: toNote(flow.descriptionKey, flow.questionKeys),
      screens: resolveScreenNotes(flow.screenNotes, activeCase?.screenNotes),
    },
    screens,
    titleKey: flow.titleKey,
    variantCode: variant?.code ?? null,
    variantId,
  }
}

export const resolveFlow = <S extends string, C extends ComponentEnvironment, I extends object>(
  flow: FlowDefinition<S, C, I>,
  variantId: string | null,
  caseId: string | null = null,
): ResolvedFlow<S, C, I> => {
  let byKey = cache.get(flow)
  if (!byKey) {
    byKey = new Map()
    cache.set(flow, byKey)
  }

  const activeCaseId = effectiveCaseId(flow, caseId)
  // JSON keeps `null` apart from an id spelled "null".
  const key = JSON.stringify([variantId, activeCaseId])
  const cached = byKey.get(key)
  if (cached) return cached as ResolvedFlow<S, C, I>

  const resolved = createResolvedFlow(flow, variantId, activeCaseId)
  byKey.set(key, resolved)
  return resolved
}
