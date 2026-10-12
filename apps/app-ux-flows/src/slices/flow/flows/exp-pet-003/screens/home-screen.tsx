import { useAtomValue } from 'jotai'
import { ChevronRight } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { podAtom } from '../../../pods/ginger/model'
import { useFlowAnalytics, useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { type ExpPet003Components, type ExpPet003Events, type ExpPet003ScreenId, podOpensOnAtom } from '../model'

export const HomeScreen = () => {
  const { t } = useTranslation()
  const { AppTabBar, PodScreen, SectionLabel } = useFlowComponents<ExpPet003Components>()
  const { goToScreen } = useFlowNavigation<ExpPet003ScreenId>()
  const { track } = useFlowAnalytics<ExpPet003Events>()
  const pod = useAtomValue(podAtom)
  const podOpensOn = useAtomValue(podOpensOnAtom)

  const openPod = () => {
    track('pod_opened', { tab: podOpensOn })
    goToScreen(podOpensOn === 'notes' ? 'ginger-notes' : 'ginger-info')
  }

  return (
    <PodScreen
      bottomBar={
        <AppTabBar
          active="home"
          onSelect={(tab) => {
            if (tab !== 'home') track('app_tab_selected', { tab })
          }}
        />
      }
      topBar={
        <header className="rounded-3xl border-white border-b bg-linear-to-b from-brand-100 to-white pt-(--status-bar-h) drop-shadow-topbar">
          <div className="flex flex-col gap-4 px-5 pt-2.5 pb-5">
            <span
              aria-hidden
              className="flex size-11 items-center justify-center rounded-full border border-gray-200 bg-white font-medium text-gray-700"
            >
              {t('flows.expPet003.home.userInitial')}
            </span>
            <h1 className="font-semibold text-gray-900 text-xl">{t('flows.expPet003.home.welcome')}</h1>
          </div>
        </header>
      }
    >
      <section className="flex flex-col gap-3">
        <SectionLabel>{t('flows.expPet003.home.pods')}</SectionLabel>
        <button
          className="flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-white py-2 pr-4 pl-2 text-left shadow-card outline-none transition-colors hover:bg-gray-50 focus-visible:ring-3 focus-visible:ring-ring"
          onClick={openPod}
          type="button"
        >
          <img alt="" className="size-12 shrink-0 rounded-full object-cover" src={pod.avatarSrc} />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="font-medium text-base text-gray-900">{pod.name}</span>
            <span className="text-gray-600 text-sm">{pod.breadcrumb.join(' › ')}</span>
          </span>
          <ChevronRight aria-hidden className="shrink-0 text-gray-700" size={16} />
        </button>
      </section>
    </PodScreen>
  )
}
