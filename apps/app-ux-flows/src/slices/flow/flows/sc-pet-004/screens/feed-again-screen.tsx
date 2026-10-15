import { useAtomValue, useSetAtom } from 'jotai'

import { FeedAgainSheet } from '../../../pods/ginger/components/meal-sheets'
import { useMealSheet } from '../../../pods/ginger/components/use-meal-sheet'
import { feedAgainAtom, type Meal, selectedMealAtom } from '../../../pods/ginger/feeding'
import { PARTICIPANT_ID } from '../../../pods/ginger/model'
import { useFlowNavigation } from '../../../runtime/flow-context'
import { MealsView } from '../components/meals-view'
import { type ScPet004ScreenId, toastAtom } from '../model'

// Only a meal someone else fed, and not fed again yet, can be fed again.
const isNotOthers = (meal: Meal | undefined) =>
  !meal || meal.status !== 'given' || meal.givenBy === PARTICIPANT_ID || meal.extra !== undefined

export const FeedAgainScreen = () => {
  const { back, goToScreen } = useFlowNavigation<ScPet004ScreenId>()
  const meal = useAtomValue(selectedMealAtom)
  const feedAgain = useSetAtom(feedAgainAtom)
  const setToast = useSetAtom(toastAtom)
  const { settle } = useMealSheet(isNotOthers)

  if (!meal || isNotOthers(meal)) return <MealsView />

  const confirm = () => {
    settle()
    feedAgain(meal.id, new Date())
    setToast({ kind: 'extra', meal: meal.name })
    goToScreen('care-feeding')
  }

  const cancel = () => {
    settle()
    back()
  }

  return (
    <>
      <MealsView />
      <FeedAgainSheet meal={meal} onCancel={cancel} onConfirm={confirm} />
    </>
  )
}
