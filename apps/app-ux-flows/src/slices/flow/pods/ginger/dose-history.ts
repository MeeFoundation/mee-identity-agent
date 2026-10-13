import type { TFunction } from 'i18next'

import { CURRENT_MEDICATION_ID, type DoseEvent, type MedicationDose, PARTICIPANT_ID, type PodMember } from './model'

export const HISTORY_PERIODS = ['7d', '30d', '1y', 'all'] as const

export type HistoryPeriod = (typeof HISTORY_PERIODS)[number]

export type HistoryFilter = {
  period: HistoryPeriod
  // A course id, or every course.
  medicationId: 'all' | string
}

export type DoseDay = {
  // Local calendar date (YYYY-MM-DD).
  day: string
  doses: DoseEvent[]
}

const periodDays: Record<Exclude<HistoryPeriod, 'all'>, number> = { '1y': 365, '7d': 7, '30d': 30 }

const CURRENT_DOSE_ID = 'current-dose'

// The current dose joins the history only once it has been given.
const currentAsEvent = (current: MedicationDose): DoseEvent | undefined =>
  current.status === 'given'
    ? {
        givenAt: current.givenAt,
        givenBy: current.givenBy,
        id: CURRENT_DOSE_ID,
        medicationId: CURRENT_MEDICATION_ID,
        scheduledAt: current.scheduledAt,
        status: 'given',
      }
    : undefined

const byNewest = (a: DoseEvent, b: DoseEvent) => b.scheduledAt.localeCompare(a.scheduledAt)

// Every dose matching the filter, newest first.
export const toDoseHistory = (
  current: MedicationDose,
  past: readonly DoseEvent[],
  { period, medicationId }: HistoryFilter,
  now: Date,
): DoseEvent[] => {
  const since = period === 'all' ? undefined : now.getTime() - periodDays[period] * 86_400_000
  const given = currentAsEvent(current)
  return [...(given ? [given] : []), ...past]
    .filter((dose) => medicationId === 'all' || dose.medicationId === medicationId)
    .filter((dose) => since === undefined || new Date(dose.scheduledAt).getTime() >= since)
    .sort(byNewest)
}

const localDay = (iso: string) => {
  const date = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// Consecutive doses on the same local day, keeping the list's order.
export const groupByDay = (doses: readonly DoseEvent[]): DoseDay[] =>
  doses.reduce<DoseDay[]>((days, dose) => {
    const day = localDay(dose.scheduledAt)
    const last = days.at(-1)
    if (last?.day === day) last.doses.push(dose)
    else days.push({ day, doses: [dose] })
    return days
  }, [])

// A course's latest past doses, given or missed.
export const recentDoses = (past: readonly DoseEvent[], medicationId: string, limit: number): DoseEvent[] =>
  past
    .filter((dose) => dose.medicationId === medicationId)
    .sort(byNewest)
    .slice(0, limit)

export const lastGivenDose = (past: readonly DoseEvent[], medicationId: string): DoseEvent | undefined =>
  past.filter((dose) => dose.medicationId === medicationId && dose.status === 'given').sort(byNewest)[0]

export const formatDayLabel = (day: string, now: Date, t: TFunction, language: string) => {
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (day === localDay(now.toISOString())) return t('pods.ginger.doseHistory.today')
  if (day === localDay(yesterday.toISOString())) return t('pods.ginger.doseHistory.yesterday')
  const [year, month, date] = day.split('-').map(Number)
  return new Intl.DateTimeFormat(language, {
    day: 'numeric',
    month: 'short',
    weekday: 'short',
    ...(year === now.getFullYear() ? {} : { year: 'numeric' }),
  }).format(new Date(year ?? 0, (month ?? 1) - 1, date ?? 1))
}

// Lower-case relative day for running text, such as "today" in "Last given today 8:02 AM".
export const formatRelativeDay = (iso: string, now: Date, t: TFunction, language: string) => {
  const day = localDay(iso)
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (day === localDay(now.toISOString())) return t('pods.ginger.doseHistory.todayInline')
  if (day === localDay(yesterday.toISOString())) return t('pods.ginger.doseHistory.yesterdayInline')
  return new Intl.DateTimeFormat(language, { day: 'numeric', month: 'short' }).format(new Date(iso))
}

export const memberName = (memberId: string | undefined, members: readonly PodMember[], t: TFunction) =>
  memberId === PARTICIPANT_ID || memberId === undefined
    ? t('pods.ginger.doseHistory.you')
    : (members.find((member) => member.id === memberId)?.name ?? t('pods.ginger.doseHistory.someone'))
