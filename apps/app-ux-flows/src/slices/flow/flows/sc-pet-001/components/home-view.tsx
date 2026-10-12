import { useSetAtom } from 'jotai'
import { Grid, Plus } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { openNewPodFromHomeAtom, type ScPet001Components, type ScPet001ScreenId } from '../model'

const noop = () => {}

// Home as in the Figma "Home - 1" frame: a greeting and the call to add a first pod.
export const HomeView = () => {
  const { t } = useTranslation()
  const { AppTabBar, Button, PodScreen } = useFlowComponents<ScPet001Components>()
  const { goToScreen } = useFlowNavigation<ScPet001ScreenId>()
  const openNewPodFromHome = useSetAtom(openNewPodFromHomeAtom)

  const addPod = () => {
    openNewPodFromHome()
    goToScreen('new-pod')
  }

  return (
    <PodScreen
      bottomBar={
        <AppTabBar
          active="home"
          onSelect={(tab) => {
            if (tab === 'telli') goToScreen('telli')
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
              {t('flows.scPet001.home.userInitial')}
            </span>
            <h1 className="font-semibold text-gray-900 text-xl">{t('flows.scPet001.home.welcome')}</h1>
          </div>
        </header>
      }
    >
      <section className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-card">
        <span className="flex size-12 items-center justify-center rounded-full bg-gray-100">
          <Grid aria-hidden className="text-brand-700" size={22} />
        </span>
        <h2 className="font-semibold text-2xl text-gray-900">{t('flows.scPet001.home.title')}</h2>
        <p className="text-base text-gray-700">{t('flows.scPet001.home.message')}</p>
        <Button className="w-full" onClick={addPod} size="l">
          <Plus aria-hidden className="shrink-0" size={24} />
          <span className="px-1">{t('flows.scPet001.home.addPod')}</span>
        </Button>
        <Button className="w-full" onClick={noop} size="l" tone="secondary" variant="link">
          {t('flows.scPet001.home.maybeLater')}
        </Button>
      </section>
    </PodScreen>
  )
}
