import { useAtom, useAtomValue, useSetAtom } from 'jotai'

import { CareFeedingToast } from '../../../pods/ginger/components/care-feeding-toast'
import { CareFeedingView } from '../../../pods/ginger/components/care-feeding-view'
import { MealCard } from '../../../pods/ginger/components/meal-card'
import { mealsAtom, selectedMealIdAtom } from '../../../pods/ginger/feeding'
import { useFlowNavigation } from '../../../runtime/flow-context'
import { type ScPet004ScreenId, toastAtom } from '../model'

type ViewProps = {
  // Off while a sheet is shown over this view.
  showToast?: boolean
}

// Care & Feeding with today's meals; the instructions are an inert row.
export const MealsView = ({ showToast = false }: ViewProps) => {
  const { goToScreen } = useFlowNavigation<ScPet004ScreenId>()
  const meals = useAtomValue(mealsAtom)
  const selectMeal = useSetAtom(selectedMealIdAtom)
  const [toast, setToast] = useAtom(toastAtom)

  // The toast belongs to the moment after a sheet; leaving Care & Feeding dismisses it.
  const leaveTo = (screen: Exclude<ScPet004ScreenId, 'info' | 'care-feeding'>) => {
    setToast(null)
    goToScreen(screen)
  }

  const openSheet = (mealId: string, screen: 'feed-meal' | 'undo-meal' | 'feed-again') => {
    selectMeal(mealId)
    leaveTo(screen)
  }

  return (
    <CareFeedingView
      canEdit={false}
      instructionsAs="row"
      notice={showToast && toast && <CareFeedingToast onClose={() => setToast(null)} toast={toast} />}
      onOpenHistory={() => leaveTo('feeding-history')}
      today={meals.map((meal) => (
        <MealCard
          key={meal.id}
          meal={meal}
          onFeed={() => openSheet(meal.id, 'feed-meal')}
          onFeedAgain={() => openSheet(meal.id, 'feed-again')}
          onUndo={() => openSheet(meal.id, 'undo-meal')}
        />
      ))}
    />
  )
}
