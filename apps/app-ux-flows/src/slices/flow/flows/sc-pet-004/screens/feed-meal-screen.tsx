import { useAtomValue, useSetAtom } from 'jotai'

import { FeedMealSheet } from '../../../pods/ginger/components/meal-sheets'
import { useMealSheet } from '../../../pods/ginger/components/use-meal-sheet'
import { canFeed, feedMealAtom, type Meal, type MealAmount, selectedMealAtom } from '../../../pods/ginger/feeding'
import { useFlowNavigation } from '../../../runtime/flow-context'
import { MealsView } from '../components/meals-view'
import { goalAtom, type ScPet004ScreenId, toastAtom } from '../model'

const isNotDue = (meal: Meal | undefined) => !meal || !canFeed(meal, new Date())

export const FeedMealScreen = () => {
  const { back, complete, goToScreen } = useFlowNavigation<ScPet004ScreenId>()
  const meal = useAtomValue(selectedMealAtom)
  const goal = useAtomValue(goalAtom)
  const feedMeal = useSetAtom(feedMealAtom)
  const setToast = useSetAtom(toastAtom)
  const { settle } = useMealSheet(isNotDue)

  if (!meal || isNotDue(meal)) return <MealsView />

  const confirm = (amount: MealAmount) => {
    settle()
    feedMeal(meal.id, amount, new Date())
    setToast({ kind: 'fed', meal: meal.name })
    goToScreen('care-feeding')
    if (goal === 'feed') complete({ showCompletionView: false })
  }

  const cancel = () => {
    settle()
    back()
  }

  return (
    <>
      <MealsView />
      <FeedMealSheet meal={meal} onCancel={cancel} onConfirm={confirm} />
    </>
  )
}
