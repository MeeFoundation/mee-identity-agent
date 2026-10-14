import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'

import { GingerHomeView } from '../../../pods/ginger/components/ginger-home-view'
import { useFlowAnalytics, useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { doseSurfaceAtom, type ExpPet005Components, type ExpPet005Events, type ExpPet005ScreenId } from '../model'
import { DoseToast } from './dose-toast'
import { FlowDoseCard } from './flow-dose-card'

type ViewProps = {
  // Off while a confirmation sheet is shown over this view.
  showToast?: boolean
}

export const HomeView = ({ showToast = false }: ViewProps) => {
  const { t } = useTranslation()
  const { SectionLabel } = useFlowComponents<ExpPet005Components>()
  const { goToScreen } = useFlowNavigation<ExpPet005ScreenId>()
  const { track } = useFlowAnalytics<ExpPet005Events>()
  const surface = useAtomValue(doseSurfaceAtom)

  const openPod = () => {
    track('pod_opened')
    goToScreen('ginger-notes')
  }

  return (
    <GingerHomeView
      beforePods={
        <>
          {showToast && <DoseToast screen="home" />}
          {surface === 'home' && (
            <section className="flex flex-col gap-3">
              <SectionLabel>{t('flows.expPet005.today')}</SectionLabel>
              <FlowDoseCard origin="home" showPet />
            </section>
          )}
        </>
      }
      onAppTabSelect={(tab) => track('app_tab_selected', { tab })}
      onOpenPod={openPod}
    />
  )
}
