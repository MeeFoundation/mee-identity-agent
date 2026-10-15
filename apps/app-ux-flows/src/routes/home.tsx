import { createRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useState } from 'react'

import { useAnalytics } from '@/shared/analytics/analytics-provider'
import { devMode } from '@/shared/lib/dev-mode'

import type { FlowSearch } from './flow-search'
import { rootRoute } from './root'
import { browserRunStorage } from '@/slices/flow/analytics/run-storage'
import { listFlowCatalogue } from '@/slices/flow/catalogue'
import { listFlows } from '@/slices/flow/registry'
import { listCases } from '@/slices/flow/runtime/resolve-flow'
import { browserAssignmentStore } from '@/slices/flow/variants/assignment-store'
import { listVariantChoices } from '@/slices/flow/variants/select-variant'
import type { FlowStartChoice } from '@/slices/home/flow-row'
import { HomePage } from '@/slices/home/home-page'
import { browserOpenGroupsStorage } from '@/slices/home/open-groups'

const toSearch = (choice?: FlowStartChoice): FlowSearch => ({
  ...(choice?.variantId && { variant: choice.variantId }),
  ...(choice?.caseId && { case: choice.caseId }),
})

const HomeRoute = () => {
  const { flows } = homeRoute.useLoaderData()
  const navigate = useNavigate()
  const router = useRouter()
  const analytics = useAnalytics()
  const [openGroups, setOpenGroups] = useState(() => browserOpenGroupsStorage.read())

  const toggleGroup = (groupId: string) => {
    const next = new Set(openGroups)
    if (!next.delete(groupId)) next.add(groupId)
    browserOpenGroupsStorage.write(next)
    setOpenGroups(next)
  }

  const startNewSession = () => {
    browserAssignmentStore.clear()
    browserRunStorage.clearAll()
    analytics.startNewSession()
    void router.invalidate()
  }

  return (
    <HomePage
      devModeNote={devMode.fromUrl}
      flows={flows}
      onOpenScreen={(href) => navigate({ href })}
      onStartFlow={(flowId, choice) => navigate({ params: { flowId }, search: toSearch(choice), to: '/flows/$flowId' })}
      onStartNewSession={startNewSession}
      onToggleGroup={toggleGroup}
      onTurnOffDevMode={() => window.location.assign('/?mode=off')}
      openGroups={openGroups}
      screenHref={(flowId, screenId, { variantId, caseId }) =>
        router.buildLocation({
          params: { flowId, screenId },
          search: toSearch({ caseId: caseId ?? undefined, variantId: variantId ?? undefined }),
          to: '/flows/$flowId/$screenId',
        }).href
      }
      showCodes={devMode.on}
    />
  )
}

export const homeRoute = createRoute({
  component: HomeRoute,
  getParentRoute: () => rootRoute,
  loader: () => ({
    flows: listFlows().map((flow) => ({
      assignedVariantId: devMode.on ? browserAssignmentStore.read(flow.id) : null,
      caseChoices: flow.cases ? listCases(flow) : null,
      catalogue: devMode.on ? listFlowCatalogue(flow) : null,
      code: flow.code ?? null,
      descriptionKey: flow.descriptionKey ?? null,
      hidden: flow.hidden === true,
      id: flow.id,
      kind: flow.kind,
      titleKey: flow.titleKey,
      variantChoices: listVariantChoices(flow),
    })),
  }),
  path: '/',
})
