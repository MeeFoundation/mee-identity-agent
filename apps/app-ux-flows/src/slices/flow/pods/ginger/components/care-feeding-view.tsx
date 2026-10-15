import { useAtomValue } from 'jotai'
import type { ReactNode } from 'react'
import { CardText, ClockHistory } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { useFlowComponents } from '../../../runtime/flow-context'
import { formatRelativeDay, memberName } from '../dose-history'
import { formatDoseTime } from '../dose-status'
import {
  careInstructionsAtom,
  distinctMealTimes,
  feedingHistoryAtom,
  feedingScheduleAtom,
  formatMealTime,
  mealsAtom,
  type RecognisedMealTime,
  recogniseMealTimes,
  toFeedingHistory,
} from '../feeding'
import { type GingerPodComponents, podMembersAtom } from '../model'
import { SubScreenTopBar } from './sub-screen-top-bar'

const noop = () => {}

// The instructions with each recognised meal time marked.
const HighlightedText = ({ text, times }: { text: string; times: readonly RecognisedMealTime[] }) => {
  const parts: ReactNode[] = []
  let cursor = 0
  for (const time of times) {
    parts.push(text.slice(cursor, time.start))
    parts.push(
      <mark className="-mx-0.5 rounded-md bg-brand-50 px-0.5 text-inherit ring-1 ring-brand-300" key={time.start}>
        {text.slice(time.start, time.end)}
      </mark>,
    )
    cursor = time.end
  }
  parts.push(text.slice(cursor))
  return <>{parts}</>
}

// The latest fed meal, as one line.
const useLastFedPreview = () => {
  const { t, i18n } = useTranslation()
  const now = new Date()
  const members = useAtomValue(podMembersAtom)
  const last = toFeedingHistory(useAtomValue(mealsAtom), useAtomValue(feedingHistoryAtom), now).find(
    (event) => event.status === 'fed' && event.givenAt,
  )
  return last?.givenAt
    ? t('pods.ginger.careFeeding.history.preview', {
        day: formatRelativeDay(last.givenAt, now, t, i18n.language),
        member: memberName(last.givenBy, members, t),
        time: formatDoseTime(last.givenAt, i18n.language),
      })
    : undefined
}

type CareFeedingViewProps = {
  // Owners can write and edit the instructions and set up a schedule; other members only read them.
  canEdit: boolean
  // Today's meals, wired by the flow; shown above everything else.
  today?: ReactNode
  // Shown above the content, such as a flow's toast.
  notice?: ReactNode
  // `row` shows the instructions as an inert row, for a screen about the meals.
  instructionsAs?: 'text' | 'row'
  onEdit?: () => void
  // Without it no schedule is suggested.
  onSetUpSchedule?: () => void
  // Shown with today's meals; without it there is no Feeding history row.
  onOpenHistory?: () => void
}

// Ginger's Care & Feeding screen: today's meals or the feeding schedule, and the free-text instructions.
export const CareFeedingView = ({
  canEdit,
  today,
  notice,
  instructionsAs = 'text',
  onEdit = noop,
  onSetUpSchedule,
  onOpenHistory,
}: CareFeedingViewProps) => {
  const { t, i18n } = useTranslation()
  const { AiSuggestion, Button, EmptyStateCard, PodScreen, RecordRow, SectionLabel } =
    useFlowComponents<GingerPodComponents>()
  const instructions = useAtomValue(careInstructionsAtom)
  const schedule = useAtomValue(feedingScheduleAtom)
  const lastFed = useLastFedPreview()
  const hasInstructions = instructions.trim().length > 0
  const times = canEdit && onSetUpSchedule && schedule.length === 0 ? recogniseMealTimes(instructions) : []

  return (
    <PodScreen topBar={<SubScreenTopBar title={t('pods.ginger.careFeeding.title')} />}>
      {notice}
      {today && (
        <section className="flex flex-col gap-3">
          <SectionLabel>{t('pods.ginger.careFeeding.today')}</SectionLabel>
          {today}
          {onOpenHistory && (
            <RecordRow
              description={lastFed}
              icon={ClockHistory}
              onClick={onOpenHistory}
              title={t('pods.ginger.careFeeding.history.title')}
            />
          )}
        </section>
      )}
      {/* Today's meals already list the schedule. */}
      {!today && schedule.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionLabel>{t('pods.ginger.careFeeding.schedule')}</SectionLabel>
          <ul className="flex flex-col divide-y divide-gray-100 rounded-2xl bg-white px-4 shadow-card">
            {schedule.map((meal) => (
              <li className="py-3 text-base text-gray-900" key={`${meal.name}-${meal.time}`}>
                {t('pods.ginger.careFeeding.scheduledMeal', {
                  meal: t(`pods.ginger.careFeeding.meals.${meal.name}`),
                  time: formatMealTime(meal.time, i18n.language),
                })}
              </li>
            ))}
          </ul>
        </section>
      )}
      {times.length > 0 && onSetUpSchedule && (
        <AiSuggestion
          caption={t('pods.ginger.careFeeding.suggestion.caption', { count: distinctMealTimes(times).length })}
          label={t('pods.ginger.careFeeding.suggestion.label')}
          onClick={onSetUpSchedule}
        />
      )}
      {instructionsAs === 'row' ? (
        <RecordRow icon={CardText} onClick={noop} title={t('pods.ginger.careFeeding.instructions')} />
      ) : (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <SectionLabel>{t('pods.ginger.careFeeding.instructions')}</SectionLabel>
            {canEdit && hasInstructions && (
              <Button className="-my-1.5 -mr-2.5" onClick={onEdit} size="s" tone="primary" variant="link">
                {t('pods.ginger.careFeeding.edit')}
              </Button>
            )}
          </div>
          {hasInstructions ? (
            <p className="whitespace-pre-wrap break-words rounded-2xl bg-white p-4 text-base text-gray-800 shadow-card">
              <HighlightedText text={instructions} times={times} />
            </p>
          ) : (
            <EmptyStateCard
              action={canEdit ? { label: t('pods.ginger.careFeeding.write'), onAction: onEdit } : undefined}
              message={t('pods.ginger.careFeeding.emptyMessage')}
              title={t('pods.ginger.careFeeding.emptyTitle')}
            />
          )}
        </section>
      )}
    </PodScreen>
  )
}
