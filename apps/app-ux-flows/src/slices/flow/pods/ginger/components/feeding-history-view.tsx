import { useAtomValue } from 'jotai'
import { CheckCircleFill, XCircle } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { useFlowComponents } from '../../../runtime/flow-context'
import { formatDayLabel, memberName } from '../dose-history'
import { formatDoseTime } from '../dose-status'
import { type FeedingEvent, feedingHistoryAtom, groupFeedingByDay, mealsAtom, toFeedingHistory } from '../feeding'
import { type GingerPodComponents, podMembersAtom } from '../model'
import { SubScreenTopBar } from './sub-screen-top-bar'
import { cn } from '@/shared/lib/cn'

const FeedingRow = ({ event }: { event: FeedingEvent }) => {
  const { t, i18n } = useTranslation()
  const members = useAtomValue(podMembersAtom)
  const fed = event.status === 'fed'
  const StatusIcon = fed ? CheckCircleFill : XCircle

  const detail = () => {
    if (!fed)
      return t('pods.ginger.careFeeding.history.missed', { time: formatDoseTime(event.scheduledAt, i18n.language) })
    const line = t(`pods.ginger.careFeeding.history.${event.extra ? 'fedAgain' : 'fed'}`, {
      member: memberName(event.givenBy, members, t),
      time: formatDoseTime(event.givenAt ?? event.scheduledAt, i18n.language),
    })
    return event.amount && event.amount !== 'all'
      ? `${line} · ${t(`pods.ginger.careFeeding.meal.ate.${event.amount}`)}`
      : line
  }

  return (
    <li className="flex items-center gap-3 py-2.5">
      <StatusIcon aria-hidden className={cn('shrink-0', fed ? 'text-success-600' : 'text-warning-600')} size={18} />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-medium text-gray-900 text-sm">{t(`pods.ginger.careFeeding.meals.${event.meal}`)}</span>
        <span className={cn('text-xs', fed ? 'text-gray-600' : 'text-warning-700')}>{detail()}</span>
      </div>
    </li>
  )
}

// The last 7 days of Ginger's meals, newest first; short enough to need no filter or paging.
export const FeedingHistoryView = () => {
  const { t, i18n } = useTranslation()
  const { PodScreen, SectionLabel } = useFlowComponents<GingerPodComponents>()
  const now = new Date()
  const events = toFeedingHistory(useAtomValue(mealsAtom), useAtomValue(feedingHistoryAtom), now)

  return (
    <PodScreen
      topBar={
        <SubScreenTopBar
          title={t('pods.ginger.careFeeding.history.title')}
          trail={[t('pods.ginger.careFeeding.title')]}
        />
      }
    >
      {events.length > 0 ? (
        groupFeedingByDay(events).map((day) => (
          <section className="flex flex-col gap-2" key={day.day}>
            <SectionLabel>{formatDayLabel(day.day, now, t, i18n.language)}</SectionLabel>
            <ul className="flex flex-col divide-y divide-gray-100 rounded-2xl bg-white px-4 shadow-card">
              {day.events.map((event) => (
                <FeedingRow event={event} key={event.id} />
              ))}
            </ul>
          </section>
        ))
      ) : (
        <p className="rounded-2xl bg-white p-5 text-center font-semibold text-gray-900 text-lg shadow-card">
          {t('pods.ginger.careFeeding.history.empty')}
        </p>
      )}
    </PodScreen>
  )
}
