import { createRoute, notFound, redirect, useNavigate, useRouter } from '@tanstack/react-router'
import { useCallback } from 'react'

import { findFlow, hasScreen } from '@/slices/flow/registry'
import { FlowRunner } from '@/slices/flow/runtime/flow-runner'

import { rootRoute } from './root'

const FlowScreenRoute = () => {
  const { flow } = flowScreenRoute.useLoaderData()
  const { screenId } = flowScreenRoute.useParams()
  const navigate = useNavigate()
  const router = useRouter()

  const navigateToScreen = useCallback(
    (nextScreenId: string) =>
      navigate({ params: { flowId: flow.id, screenId: nextScreenId }, to: '/flows/$flowId/$screenId' }),
    [navigate, flow.id],
  )

  const goBack = useCallback(() => {
    if (router.history.canGoBack()) {
      router.history.back()
      return
    }
    navigate({
      params: { flowId: flow.id, screenId: flow.initialScreen },
      replace: true,
      to: '/flows/$flowId/$screenId',
    })
  }, [router, navigate, flow.id, flow.initialScreen])

  const exit = useCallback(() => navigate({ to: '/' }), [navigate])

  return (
    <FlowRunner
      exit={exit}
      flow={flow}
      goBack={goBack}
      key={flow.id}
      navigateToScreen={navigateToScreen}
      screenId={screenId}
    />
  )
}

export const flowScreenRoute = createRoute({
  beforeLoad: ({ params }) => {
    const flow = findFlow(params.flowId)
    if (!flow) throw notFound()

    if (!hasScreen(flow, params.screenId)) {
      throw redirect({
        params: { flowId: flow.id, screenId: flow.initialScreen },
        replace: true,
        to: '/flows/$flowId/$screenId',
      })
    }

    return { flow }
  },
  component: FlowScreenRoute,
  getParentRoute: () => rootRoute,
  loader: ({ context }) => ({ flow: context.flow }),
  path: 'flows/$flowId/$screenId',
})
