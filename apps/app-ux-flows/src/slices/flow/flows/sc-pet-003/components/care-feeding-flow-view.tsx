import { useAtom, useAtomValue, useSetAtom } from 'jotai'

import { CareFeedingToast } from '../../../pods/ginger/components/care-feeding-toast'
import { CareFeedingView } from '../../../pods/ginger/components/care-feeding-view'
import { MealCard } from '../../../pods/ginger/components/meal-card'
import { mealsAtom, selectedMealIdAtom } from '../../../pods/ginger/feeding'
import { useFlowNavigation } from '../../../runtime/flow-context'
import { isOwnerAtom, type ScPet003ScreenId, toastAtom } from '../model'

type ViewProps = {
  // Off while a sheet is shown over this view.
  showToast?: boolean
}

// Only the owner changes the instructions; every member records meals.
export const CareFeedingFlowView = ({ showToast = false }: ViewProps) => {
  const { goToScreen } = useFlowNavigation<ScPet003ScreenId>()
  const isOwner = useAtomValue(isOwnerAtom)
  const meals = useAtomValue(mealsAtom)
  const selectMeal = useSetAtom(selectedMealIdAtom)
  const [toast, setToast] = useAtom(toastAtom)

  // The toast belongs to the moment after a change; leaving Care & Feeding dismisses it.
  const leaveTo = (screen: Exclude<ScPet003ScreenId, 'info' | 'care-feeding' | 'chat'>) => {
    setToast(null)
    goToScreen(screen)
  }

  const openSheet = (mealId: string, screen: 'feed-meal' | 'undo-meal') => {
    selectMeal(mealId)
    leaveTo(screen)
  }

  return (
    <CareFeedingView
      canEdit={isOwner}
      notice={showToast && toast && <CareFeedingToast onClose={() => setToast(null)} toast={toast} />}
      onEdit={() => leaveTo('edit-instructions')}
      onOpenHistory={() => leaveTo('feeding-history')}
      onSetUpSchedule={() => leaveTo('schedule-sheet')}
      today={
        meals.length > 0
          ? meals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onFeed={() => openSheet(meal.id, 'feed-meal')}
                onUndo={() => openSheet(meal.id, 'undo-meal')}
              />
            ))
          : undefined
      }
    />
  )
}
