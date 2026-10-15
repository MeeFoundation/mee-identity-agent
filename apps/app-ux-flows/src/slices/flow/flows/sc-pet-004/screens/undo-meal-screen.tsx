import { useAtomValue, useSetAtom } from 'jotai'

import { UndoMealSheet } from '../../../pods/ginger/components/meal-sheets'
import { useMealSheet } from '../../../pods/ginger/components/use-meal-sheet'
import { type Meal, selectedMealAtom, undoMealAtom } from '../../../pods/ginger/feeding'
import { PARTICIPANT_ID } from '../../../pods/ginger/model'
import { useFlowNavigation } from '../../../runtime/flow-context'
import { MealsView } from '../components/meals-view'
import { goalAtom, type ScPet004ScreenId, toastAtom } from '../model'

const isNotMine = (meal: Meal | undefined) => !meal || meal.status !== 'given' || meal.givenBy !== PARTICIPANT_ID

export const UndoMealScreen = () => {
  const { back, complete, goToScreen } = useFlowNavigation<ScPet004ScreenId>()
  const meal = useAtomValue(selectedMealAtom)
  const goal = useAtomValue(goalAtom)
  const undoMeal = useSetAtom(undoMealAtom)
  const setToast = useSetAtom(toastAtom)
  const { settle } = useMealSheet(isNotMine)

  if (!meal || isNotMine(meal)) return <MealsView />

  const confirm = () => {
    settle()
    undoMeal(meal.id)
    setToast({ kind: 'undone', meal: meal.name })
    goToScreen('care-feeding')
    if (goal === 'undo') complete({ showCompletionView: false })
  }

  const cancel = () => {
    settle()
    back()
  }

  return (
    <>
      <MealsView />
      <UndoMealSheet meal={meal} onCancel={cancel} onConfirm={confirm} />
    </>
  )
}
