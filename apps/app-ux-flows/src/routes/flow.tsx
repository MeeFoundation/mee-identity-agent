import { createRoute, notFound, redirect } from '@tanstack/react-router'
import { getDefaultStore } from 'jotai'

import { findFlow } from '@/slices/flow/registry'
import { startFlowInstance } from '@/slices/flow/runtime'

import { rootRoute } from './root'

export const flowRoute = createRoute({
  beforeLoad: ({ params }) => {
    const flow = findFlow(params.flowId)
    if (!flow) throw notFound()

    const instance = startFlowInstance(getDefaultStore(), flow)
    throw redirect({ params: { flowId: flow.id, screenId: instance.currentScreenId }, to: '/$flowId/$screenId' })
  },
  getParentRoute: () => rootRoute,
  path: '$flowId',
})
