import { useAtomValue } from 'jotai'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFlowComponents } from '../../../runtime/flow-context'
import { formatRelativeDay, memberName } from '../dose-history'
import { formatDoseTime, toDoseStatus } from '../dose-status'
import type { Meal, MealAmount } from '../feeding'
import { type GingerPodComponents, podAtom, podMembersAtom } from '../model'

const MINUTE_MS = 60_000

const amounts: readonly MealAmount[] = ['all', 'half', 'little', 'none']

type SheetAction = { label: string; onClick: () => void }

type SheetProps = {
  meal: Meal
  title: string
  detail: string
  primary: SheetAction & { tone?: 'primary' | 'danger' }
  secondary: SheetAction
  // Dismissing always leaves the meal as it is.
  onDismiss: () => void
  children?: ReactNode
}

const MealSheet = ({ meal, title, detail, primary, secondary, onDismiss, children }: SheetProps) => {
  const { t } = useTranslation()
  const { BottomSheet, Button } = useFlowComponents<GingerPodComponents>()

  return (
    <BottomSheet onDismiss={onDismiss} title={title}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-base text-gray-900">
            {t('pods.ginger.careFeeding.sheet.meal', {
              meal: t(`pods.ginger.careFeeding.meals.${meal.name}`),
              portion: meal.portion,
            })}
          </p>
          <p className="text-gray-600 text-sm">{detail}</p>
        </div>
        {children}
        <div className="flex flex-col gap-2">
          <Button className="w-full" onClick={primary.onClick} size="l" tone={primary.tone}>
            {primary.label}
          </Button>
          <Button className="w-full" onClick={secondary.onClick} size="l" tone="tertiary" variant="link">
            {secondary.label}
          </Button>
        </div>
      </div>
    </BottomSheet>
  )
}

// "breakfast" in running text, such as "Record Ginger’s breakfast?".
const useMealInline = (meal: Meal) => {
  const { t } = useTranslation()
  return t(`pods.ginger.careFeeding.mealsInline.${meal.name}`)
}

type FeedMealSheetProps = {
  meal: Meal
  onConfirm: (amount: MealAmount) => void
  onCancel: () => void
}

// Confirms feeding a due or overdue meal, and how much of it was eaten.
export const FeedMealSheet = ({ meal, onConfirm, onCancel }: FeedMealSheetProps) => {
  const { t, i18n } = useTranslation()
  const { RadioGroupField } = useFlowComponents<GingerPodComponents>()
  const pod = useAtomValue(podAtom)
  const mealInline = useMealInline(meal)
  const [amount, setAmount] = useState<MealAmount>('all')
  const detail =
    toDoseStatus(meal, new Date()) === 'due'
      ? t('pods.ginger.careFeeding.sheet.feed.scheduledNow')
      : t('pods.ginger.careFeeding.sheet.feed.scheduledAt', { time: formatDoseTime(meal.scheduledAt, i18n.language) })

  return (
    <MealSheet
      detail={detail}
      meal={meal}
      onDismiss={onCancel}
      primary={{ label: t('pods.ginger.careFeeding.sheet.feed.confirm'), onClick: () => onConfirm(amount) }}
      secondary={{ label: t('pods.ginger.careFeeding.sheet.feed.cancel'), onClick: onCancel }}
      title={t('pods.ginger.careFeeding.sheet.feed.title', { meal: mealInline, name: pod.name })}
    >
      <RadioGroupField<MealAmount>
        label={t('pods.ginger.careFeeding.sheet.feed.amount')}
        onChange={setAmount}
        options={amounts.map((value) => ({ label: t(`pods.ginger.careFeeding.amounts.${value}`), value }))}
        value={amount}
      />
    </MealSheet>
  )
}

type MealSheetProps = {
  meal: Meal
  onConfirm: () => void
  onCancel: () => void
}

// Confirms reverting a meal marked as fed by mistake.
export const UndoMealSheet = ({ meal, onConfirm, onCancel }: MealSheetProps) => {
  const { t, i18n } = useTranslation()
  const pod = useAtomValue(podAtom)
  const members = useAtomValue(podMembersAtom)
  const mealInline = useMealInline(meal)
  const givenAt = meal.givenAt ?? meal.scheduledAt

  return (
    <MealSheet
      detail={t('pods.ginger.careFeeding.sheet.undo.fed', {
        day: formatRelativeDay(givenAt, new Date(), t, i18n.language),
        member: memberName(meal.givenBy, members, t),
        time: formatDoseTime(givenAt, i18n.language),
      })}
      meal={meal}
      onDismiss={onCancel}
      primary={{ label: t('pods.ginger.careFeeding.sheet.undo.confirm'), onClick: onConfirm, tone: 'danger' }}
      secondary={{ label: t('pods.ginger.careFeeding.sheet.undo.cancel'), onClick: onCancel }}
      title={t('pods.ginger.careFeeding.sheet.undo.title', { meal: mealInline, name: pod.name })}
    />
  )
}

// Warns before feeding a meal someone else already gave; not feeding is the primary choice.
export const FeedAgainSheet = ({ meal, onConfirm, onCancel }: MealSheetProps) => {
  const { t, i18n } = useTranslation()
  const pod = useAtomValue(podAtom)
  const members = useAtomValue(podMembersAtom)
  const mealInline = useMealInline(meal)
  const givenAt = meal.givenAt ?? meal.scheduledAt
  const member = memberName(meal.givenBy, members, t)
  const minutes = Math.max(1, Math.round((Date.now() - new Date(givenAt).getTime()) / MINUTE_MS))
  const detail =
    minutes < 60
      ? t('pods.ginger.careFeeding.sheet.feedAgain.minutesAgo', { count: minutes, member })
      : t('pods.ginger.careFeeding.sheet.feedAgain.at', { member, time: formatDoseTime(givenAt, i18n.language) })

  return (
    <MealSheet
      detail={detail}
      meal={meal}
      onDismiss={onCancel}
      primary={{ label: t('pods.ginger.careFeeding.sheet.feedAgain.cancel'), onClick: onCancel }}
      secondary={{ label: t('pods.ginger.careFeeding.sheet.feedAgain.confirm'), onClick: onConfirm }}
      title={t('pods.ginger.careFeeding.sheet.feedAgain.title', { meal: mealInline, name: pod.name })}
    />
  )
}
