import { createRoute, notFound, redirect, useNavigate, useRouter } from '@tanstack/react-router'
import { ChevronLeftIcon } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui/button'

import { validateFlowSearch } from './flow-search'
import { rootRoute } from './root'
import { DeviceFrame } from '@/slices/device-frame/device-frame'
import { BriefingButton } from '@/slices/flow/briefing/briefing-button'
import { BriefingPanel } from '@/slices/flow/briefing/briefing-panel'
import { findFlow, hasScreen } from '@/slices/flow/registry'
import { FlowRunner, type FlowRunState } from '@/slices/flow/runtime/flow-runner'
import { isCaseOf, resolveFlow } from '@/slices/flow/runtime/resolve-flow'
import { browserAssignmentStore } from '@/slices/flow/variants/assignment-store'
import { isVariantOf, selectVariant } from '@/slices/flow/variants/select-variant'

const FlowScreenRoute = () => {
  const { t } = useTranslation()
  const { flow, variantSource } = flowScreenRoute.useLoaderData()
  const { screenId } = flowScreenRoute.useParams()
  const navigate = useNavigate()
  const router = useRouter()
  const [run, setRun] = useState<FlowRunState | null>(null)

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

  const tryCase = (caseId: string) =>
    navigate({
      params: { flowId: flow.flowId, screenId: flow.initialScreen },
      search: (previous) => ({ ...previous, case: caseId }),
      to: '/flows/$flowId/$screenId',
    })

  const briefing = flow.kind === 'showcase' && { flow, onTryCase: tryCase, run, screenId }

  return (
    <main className="relative flex h-dvh flex-col items-center gap-4 overflow-hidden bg-gray-100 px-4 py-6 max-[480px]:block max-[480px]:p-0 lg:py-3">
      <header className="grid w-full max-w-3xl shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 max-[480px]:hidden lg:absolute lg:top-6 lg:bottom-6 lg:left-6 lg:flex lg:w-64 lg:flex-col lg:items-start lg:gap-1 lg:overflow-y-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
        <div>
          <Button onClick={exit} size="s" tone="tertiary" variant="link">
            <ChevronLeftIcon aria-hidden className="-ml-1 size-4" />
            {t('flow.chrome.allFlows')}
          </Button>
        </div>
        <h1 className="font-semibold text-gray-900 text-lg">{t(flow.titleKey)}</h1>
        {import.meta.env.DEV && flow.variantId && (
          <p className="justify-self-end text-muted-foreground text-xs">
            {t('flow.chrome.variant', { variant: flow.variantId })}
          </p>
        )}
        {briefing && <BriefingPanel {...briefing} />}
      </header>
      {briefing && <BriefingButton {...briefing} />}
      <DeviceFrame screenKey={screenId}>
        <FlowRunner
          exit={exit}
          flow={flow}
          goBack={goBack}
          key={`${flow.flowId}:${flow.variantId ?? ''}:${flow.caseId ?? ''}`}
          navigateToScreen={navigateToScreen}
          onRunChange={setRun}
          screenId={screenId}
          variantSource={variantSource}
        />
      </DeviceFrame>
    </main>
  )
}

export const flowScreenRoute = createRoute({
  beforeLoad: ({ params, search }) => {
    const definition = findFlow(params.flowId)
    if (!definition) throw notFound()

    if (search.variant !== undefined && !isVariantOf(definition, search.variant)) {
      const { variant: _unknownVariant, ...rest } = search
      throw redirect({
        params: { flowId: definition.id, screenId: params.screenId },
        replace: true,
        search: rest,
        to: '/flows/$flowId/$screenId',
      })
    }

    if (search.case !== undefined && !isCaseOf(definition, search.case)) {
      const { case: _unknownCase, ...rest } = search
      throw redirect({
        params: { flowId: definition.id, screenId: params.screenId },
        replace: true,
        search: rest,
        to: '/flows/$flowId/$screenId',
      })
    }

    const { variantId, source: variantSource } = selectVariant(definition, search.variant, browserAssignmentStore)
    const flow = resolveFlow(definition, variantId, search.case ?? null)

    if (!hasScreen(flow, params.screenId)) {
      throw redirect({
        params: { flowId: flow.flowId, screenId: flow.initialScreen },
        replace: true,
        search,
        to: '/flows/$flowId/$screenId',
      })
    }

    return { flow, variantSource }
  },
  component: FlowScreenRoute,
  getParentRoute: () => rootRoute,
  loader: ({ context }) => ({ flow: context.flow, variantSource: context.variantSource }),
  path: 'flows/$flowId/$screenId',
  validateSearch: validateFlowSearch,
})
