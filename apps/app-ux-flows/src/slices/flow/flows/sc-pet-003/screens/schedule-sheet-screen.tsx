import { useAtomValue, useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'

import {
  careInstructionsAtom,
  distinctMealTimes,
  feedingScheduleAtom,
  formatMealTime,
  recogniseMealTimes,
  setUpScheduleAtom,
} from '../../../pods/ginger/feeding'
import { podAtom } from '../../../pods/ginger/model'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { CareFeedingFlowView } from '../components/care-feeding-flow-view'
import { goalAtom, type ScPet003Components, toastAtom } from '../model'

export const ScheduleSheetScreen = () => {
  const { t, i18n } = useTranslation()
  const { BottomSheet, Button } = useFlowComponents<ScPet003Components>()
  const { back, complete } = useFlowNavigation()
  const instructions = useAtomValue(careInstructionsAtom)
  const schedule = useAtomValue(feedingScheduleAtom)
  const goal = useAtomValue(goalAtom)
  const pod = useAtomValue(podAtom)
  const setUpSchedule = useSetAtom(setUpScheduleAtom)
  const setToast = useSetAtom(toastAtom)
  const times = distinctMealTimes(recogniseMealTimes(instructions))

  // Reached by browser history once the schedule exists, or with nothing to schedule.
  if (schedule.length > 0 || times.length === 0) return <CareFeedingFlowView showToast />

  const confirm = () => {
    setUpSchedule()
    setToast({ kind: 'scheduled' })
    // Opened from Care & Feeding: stepping back keeps the sheet out of the history behind it.
    back()
    if (goal === 'schedule') complete({ showCompletionView: false })
  }

  return (
    <>
      <CareFeedingFlowView />
      <BottomSheet onDismiss={back} title={t('flows.scPet003.scheduleSheet.title', { name: pod.name })}>
        <div className="flex flex-col gap-6">
          <ul className="flex flex-col divide-y divide-gray-100">
            {times.map((time) => (
              <li className="py-2.5 text-base text-gray-900" key={time.start}>
                {t('pods.ginger.careFeeding.scheduledMeal', {
                  meal: t(`pods.ginger.careFeeding.meals.${time.name}`),
                  time: formatMealTime(time.time, i18n.language),
                })}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2">
            <Button className="w-full" onClick={confirm} size="l">
              {t('flows.scPet003.scheduleSheet.confirm')}
            </Button>
            <Button className="w-full" onClick={back} size="l" tone="tertiary" variant="link">
              {t('flows.scPet003.scheduleSheet.cancel')}
            </Button>
          </div>
        </div>
      </BottomSheet>
    </>
  )
}
