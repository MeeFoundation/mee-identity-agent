import { createRoute, notFound, redirect, useNavigate, useRouter } from '@tanstack/react-router'
import { useCallback } from 'react'

import { findFlow, hasScreen } from '@/slices/flow/registry'
import { FlowRunner } from '@/slices/flow/runtime/flow-runner'
import { resolveFlow } from '@/slices/flow/runtime/resolve-flow'
import { browserAssignmentStore } from '@/slices/flow/variants/assignment-store'
import { isVariantOf, selectVariant } from '@/slices/flow/variants/select-variant'

import { validateFlowSearch } from './flow-search'
import { rootRoute } from './root'

const FlowScreenRoute = () => {
  const { flow } = flowScreenRoute.useLoaderData()
  const { screenId } = flowScreenRoute.useParams()
  const navigate = useNavigate()
  const router = useRouter()

  const navigateToScreen = useCallback(
    (nextScreenId: string) =>
      navigate({
        params: { flowId: flow.flowId, screenId: nextScreenId },
        search: (previous) => previous,
        to: '/flows/$flowId/$screenId',
      }),
    [navigate, flow.flowId],
  )

  const goBack = useCallback(() => {
    if (router.history.canGoBack()) {
      router.history.back()
      return
    }
    navigate({
      params: { flowId: flow.flowId, screenId: flow.initialScreen },
      replace: true,
      search: (previous) => previous,
      to: '/flows/$flowId/$screenId',
    })
  }, [router, navigate, flow.flowId, flow.initialScreen])

  const exit = useCallback(() => navigate({ to: '/' }), [navigate])

  return (
    <FlowRunner
      exit={exit}
      flow={flow}
      goBack={goBack}
      key={`${flow.flowId}:${flow.variantId ?? ''}`}
      navigateToScreen={navigateToScreen}
      screenId={screenId}
    />
  )
}

export const flowScreenRoute = createRoute({
  beforeLoad: ({ params, search }) => {
    const definition = findFlow(params.flowId)
    if (!definition) throw notFound()

    if (search.variant !== undefined && !isVariantOf(definition, search.variant)) {
      throw redirect({
        params: { flowId: definition.id, screenId: params.screenId },
        replace: true,
        search: {},
        to: '/flows/$flowId/$screenId',
      })
    }

    const flow = resolveFlow(definition, selectVariant(definition, search.variant, browserAssignmentStore))

    if (!hasScreen(flow, params.screenId)) {
      throw redirect({
        params: { flowId: flow.flowId, screenId: flow.initialScreen },
        replace: true,
        search,
        to: '/flows/$flowId/$screenId',
      })
    }

    return { flow }
  },
  component: FlowScreenRoute,
  getParentRoute: () => rootRoute,
  loader: ({ context }) => ({ flow: context.flow }),
  path: 'flows/$flowId/$screenId',
  validateSearch: validateFlowSearch,
})
