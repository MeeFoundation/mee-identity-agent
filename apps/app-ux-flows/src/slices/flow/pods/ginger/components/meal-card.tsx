import { useAtomValue } from 'jotai'
import { useId } from 'react'
import { CheckCircleFill, Clock, ExclamationCircle, MeasuringCup } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/lib/cn'

import { useFlowComponents } from '../../../runtime/flow-context'
import { memberName } from '../dose-history'
import { type DoseStatus, formatDoseTime, toDoseStatus } from '../dose-status'
import type { Meal } from '../feeding'
import { type GingerPodComponents, PARTICIPANT_ID, podMembersAtom } from '../model'

// The dose card's treatments: only an overdue meal uses warning colours.
const treatments = {
  due: { heading: 'text-brand-700', icon: Clock, surface: 'border-brand-200 bg-brand-50' },
  given: { heading: 'text-success-700', icon: CheckCircleFill, surface: 'border-success-200 bg-success-50' },
  overdue: { heading: 'text-warning-700', icon: ExclamationCircle, surface: 'border-warning-200 bg-warning-50' },
  upcoming: { heading: 'text-gray-600', icon: Clock, surface: 'border-gray-200 bg-gray-50' },
} as const satisfies Record<DoseStatus, object>

type MealCardProps = {
  meal: Meal
  onFeed: () => void
  // Reverts a meal the participant marked as fed.
  onUndo: () => void
  // Feeds a meal another member already gave; without it such a meal offers no action.
  onFeedAgain?: () => void
}

export const MealCard = ({ meal, onFeed, onUndo, onFeedAgain }: MealCardProps) => {
  const { t, i18n } = useTranslation()
  const { Button } = useFlowComponents<GingerPodComponents>()
  const headingId = useId()
  const nameId = useId()
  const members = useAtomValue(podMembersAtom)
  const status = toDoseStatus(meal, new Date())
  const treatment = treatments[status]
  const StatusIcon = treatment.icon

  const fedHeading = () => {
    const fed = t('pods.ginger.careFeeding.meal.fed', {
      member: memberName(meal.givenBy, members, t),
      time: formatDoseTime(meal.givenAt ?? meal.scheduledAt, i18n.language),
    })
    return meal.amount && meal.amount !== 'all'
      ? `${fed} · ${t(`pods.ginger.careFeeding.meal.ate.${meal.amount}`)}`
      : fed
  }

  const heading =
    status === 'given'
      ? fedHeading()
      : t(`pods.ginger.careFeeding.meal.${status}`, { time: formatDoseTime(meal.scheduledAt, i18n.language) })

  return (
    <section
      aria-labelledby={`${headingId} ${nameId}`}
      className={cn('flex flex-col gap-3 rounded-2xl border p-3 shadow-card', treatment.surface)}
    >
      <div className="flex flex-col gap-0.5">
        <h3 className={cn('flex items-center gap-1.5 font-semibold text-sm', treatment.heading)} id={headingId}>
          <StatusIcon aria-hidden className="shrink-0" size={16} />
          {heading}
        </h3>
        {meal.extra && (
          <span className="pl-5.5 text-gray-700 text-sm">
            {t('pods.ginger.careFeeding.meal.fedAgain', {
              member: memberName(meal.extra.givenBy, members, t),
              time: formatDoseTime(meal.extra.givenAt, i18n.language),
            })}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white">
          <MeasuringCup aria-hidden className="text-brand-500" size={20} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="font-medium text-base text-gray-900" id={nameId}>
            {t(`pods.ginger.careFeeding.meals.${meal.name}`)}
          </span>
          <span className="text-gray-700 text-sm">{meal.portion}</span>
        </div>
        {status === 'given' && meal.givenBy === PARTICIPANT_ID && (
          <Button className="-mr-2.5 shrink-0" onClick={onUndo} size="s" tone="tertiary" variant="link">
            {t('pods.ginger.careFeeding.meal.undo')}
          </Button>
        )}
        {status === 'given' && meal.givenBy !== PARTICIPANT_ID && !meal.extra && onFeedAgain && (
          <Button className="-mr-2.5 shrink-0" onClick={onFeedAgain} size="s" tone="tertiary" variant="link">
            {t('pods.ginger.careFeeding.meal.feedAgain')}
          </Button>
        )}
      </div>
      {(status === 'due' || status === 'overdue') && (
        <Button className="w-full" onClick={onFeed} size="m">
          {t('pods.ginger.careFeeding.meal.markAsFed')}
        </Button>
      )}
    </section>
  )
}
