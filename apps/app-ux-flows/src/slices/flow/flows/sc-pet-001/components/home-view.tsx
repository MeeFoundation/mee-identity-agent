import { useAtomValue, useSetAtom } from 'jotai'
import { ArrowRight, Calendar4Week, Grid, HeartPulse, type Icon, People, Plus } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import {
  firstPodCardDismissedAtom,
  openNewPodFromHomeAtom,
  type ScPet001Components,
  type ScPet001ScreenId,
} from '../model'

const noop = () => {}

const homeCategories: readonly { icon: Icon; labelKey: string }[] = [
  { icon: People, labelKey: 'flows.scPet001.home.categories.people' },
  { icon: HeartPulse, labelKey: 'flows.scPet001.home.categories.health' },
  { icon: Calendar4Week, labelKey: 'flows.scPet001.home.categories.events' },
  { icon: Grid, labelKey: 'flows.scPet001.home.categories.all' },
]

// Home as in the Figma "Home - 1" frame: a greeting, the call to add a first pod, and the still empty categories.
export const HomeView = () => {
  const { t } = useTranslation()
  const { AppTabBar, Button, HomeTopBar, PodScreen } = useFlowComponents<ScPet001Components>()
  const { goToScreen } = useFlowNavigation<ScPet001ScreenId>()
  const openNewPodFromHome = useSetAtom(openNewPodFromHomeAtom)
  const firstPodCardDismissed = useAtomValue(firstPodCardDismissedAtom)
  const dismissFirstPodCard = useSetAtom(firstPodCardDismissedAtom)

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
      topBar={<HomeTopBar greeting={t('flows.scPet001.home.welcome')} initial={t('flows.scPet001.home.userInitial')} />}
    >
      <div className="flex flex-col gap-8">
        {!firstPodCardDismissed && (
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
            <Button
              className="w-full"
              onClick={() => dismissFirstPodCard(true)}
              size="l"
              tone="secondary"
              variant="link"
            >
              {t('flows.scPet001.home.maybeLater')}
            </Button>
          </section>
        )}
        <section className="flex flex-col gap-3 pt-2">
          <div className="flex items-center gap-2.5">
            <h2 className="flex-1 font-semibold text-gray-600 text-xs uppercase tracking-[0.06px]">
              {t('flows.scPet001.home.categories.title')}
            </h2>
            <button className="flex items-center gap-2 text-brand-700 text-sm" onClick={noop} type="button">
              {t('flows.scPet001.home.categories.browse')}
              <ArrowRight aria-hidden size={16} />
            </button>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {homeCategories.map(({ icon: CategoryIcon, labelKey }) => (
              <li className="flex flex-col items-start gap-2 rounded-2xl bg-white p-3 shadow-card" key={labelKey}>
                <span className="flex items-center rounded-full bg-gray-100 p-3">
                  <CategoryIcon aria-hidden className="text-brand-500" size={24} />
                </span>
                <div className="flex w-full flex-col px-1 pb-1">
                  <span className="font-medium text-base text-gray-900">{t(labelKey)}</span>
                  <span className="text-gray-600 text-sm">{t('flows.scPet001.home.categories.empty')}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PodScreen>
  )
}
