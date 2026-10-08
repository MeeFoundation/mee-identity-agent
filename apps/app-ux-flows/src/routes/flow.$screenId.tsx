import { createRoute, notFound, useNavigate } from '@tanstack/react-router'
import { getDefaultStore } from 'jotai'
import { useCallback } from 'react'

import { FlowPage } from '@/slices/flow/flow-page'
import { findFlow, hasScreen } from '@/slices/flow/registry'
import { openFlowScreen, useFlowInstance } from '@/slices/flow/runtime'

import { rootRoute } from './root'

const FlowScreenRoute = () => {
  const { flow } = flowScreenRoute.useLoaderData()
  const { screenId } = flowScreenRoute.useParams()
  const instance = useFlowInstance(flow)
  const navigate = useNavigate()

  const navigateToScreen = useCallback(
    (nextScreenId: string) => navigate({ params: { flowId: flow.id, screenId: nextScreenId }, to: '/$flowId/$screenId' }),
    [navigate, flow.id],
  )

  return <FlowPage flow={flow} instance={instance} navigateToScreen={navigateToScreen} screenId={screenId} />
}

export const flowScreenRoute = createRoute({
  component: FlowScreenRoute,
  getParentRoute: () => rootRoute,
  loader: ({ params }) => {
    const flow = findFlow(params.flowId)
    if (!flow || !hasScreen(flow, params.screenId)) throw notFound()

    openFlowScreen(getDefaultStore(), flow, params.screenId)
    return { flow }
  },
  path: '$flowId/$screenId',
})
