import { useAtomValue, useSetAtom } from 'jotai'

import { CareFeedingInfoView } from '../../../pods/ginger/components/care-feeding-info-view'
import { feedingScheduleAtom } from '../../../pods/ginger/feeding'
import { useFlowNavigation } from '../../../runtime/flow-context'
import { ScPet003TopBar } from '../components/sc-pet-003-top-bar'
import { type ScPet003ScreenId, toastAtom } from '../model'

export const InfoScreen = () => {
  const { goToScreen } = useFlowNavigation<ScPet003ScreenId>()
  const schedule = useAtomValue(feedingScheduleAtom)
  const setToast = useSetAtom(toastAtom)

  const openCareFeeding = () => {
    setToast(null)
    goToScreen('care-feeding')
  }

  return (
    <CareFeedingInfoView
      careFeedingCount={schedule.length}
      onOpenCareFeeding={openCareFeeding}
      topBar={<ScPet003TopBar tab="info" />}
    />
  )
}
