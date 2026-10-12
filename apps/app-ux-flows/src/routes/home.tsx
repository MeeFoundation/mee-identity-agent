import { createRoute, useNavigate, useRouter } from '@tanstack/react-router'

import { useAnalytics } from '@/shared/analytics/analytics-provider'

import type { FlowSearch } from './flow-search'
import { rootRoute } from './root'
import { browserRunStorage } from '@/slices/flow/analytics/run-storage'
import { listFlowCatalogue } from '@/slices/flow/catalogue'
import { listFlows } from '@/slices/flow/registry'
import { listCases } from '@/slices/flow/runtime/resolve-flow'
import { browserAssignmentStore } from '@/slices/flow/variants/assignment-store'
import { listVariantChoices } from '@/slices/flow/variants/select-variant'
import type { FlowStartChoice } from '@/slices/home/flow-card'
import { HomePage } from '@/slices/home/home-page'

const toSearch = (choice?: FlowStartChoice): FlowSearch => ({
  ...(choice?.variantId && { variant: choice.variantId }),
  ...(choice?.caseId && { case: choice.caseId }),
})

const HomeRoute = () => {
  const { flows } = homeRoute.useLoaderData()
  const navigate = useNavigate()
  const router = useRouter()
  const analytics = useAnalytics()

  const startNewSession = () => {
    browserAssignmentStore.clear()
    browserRunStorage.clearAll()
    analytics.startNewSession()
    void router.invalidate()
  }

  return (
    <HomePage
      flows={flows}
      onOpenScreen={(href) => navigate({ href })}
      onStartFlow={(flowId, choice) => navigate({ params: { flowId }, search: toSearch(choice), to: '/flows/$flowId' })}
      onStartNewSession={startNewSession}
      screenHref={(flowId, screenId, { variantId, caseId }) =>
        router.buildLocation({
          params: { flowId, screenId },
          search: toSearch({ caseId: caseId ?? undefined, variantId: variantId ?? undefined }),
          to: '/flows/$flowId/$screenId',
        }).href
      }
    />
  )
}

export const homeRoute = createRoute({
  component: HomeRoute,
  getParentRoute: () => rootRoute,
  loader: () => ({
    flows: listFlows().map((flow) => ({
      assignedVariantId: import.meta.env.DEV ? browserAssignmentStore.read(flow.id) : null,
      caseChoices: flow.cases ? listCases(flow) : null,
      catalogue: import.meta.env.DEV ? listFlowCatalogue(flow) : null,
      descriptionKey: flow.descriptionKey ?? null,
      id: flow.id,
      kind: flow.kind,
      titleKey: flow.titleKey,
      variantChoices: listVariantChoices(flow),
    })),
  }),
  path: '/',
})
