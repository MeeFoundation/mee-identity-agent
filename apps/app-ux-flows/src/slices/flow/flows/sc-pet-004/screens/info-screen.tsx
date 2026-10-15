import { useAtomValue, useSetAtom } from 'jotai'

import { CareFeedingInfoView } from '../../../pods/ginger/components/care-feeding-info-view'
import { GingerTopBar } from '../../../pods/ginger/components/ginger-top-bar'
import { mealsAtom } from '../../../pods/ginger/feeding'
import { useFlowNavigation } from '../../../runtime/flow-context'
import { goalAtom, type ScPet004ScreenId, toastAtom } from '../model'

const noop = () => {}

export const InfoScreen = () => {
  const { complete, goToScreen } = useFlowNavigation<ScPet004ScreenId>()
  const meals = useAtomValue(mealsAtom)
  const goal = useAtomValue(goalAtom)
  const setToast = useSetAtom(toastAtom)

  const openCareFeeding = () => {
    setToast(null)
    goToScreen('care-feeding')
    // Case B is about noticing Sam's breakfast, which Care & Feeding shows as soon as it opens.
    if (goal === 'notice') complete({ showCompletionView: false })
  }

  return (
    <CareFeedingInfoView
      careFeedingCount={meals.length}
      onOpenCareFeeding={openCareFeeding}
      topBar={<GingerTopBar onTabSelect={noop} tab="info" />}
    />
  )
}
