import { useAtom, useAtomValue } from 'jotai'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFlowComponents } from '../../../runtime/flow-context'
import {
  type DoseDay,
  formatDayLabel,
  groupByDay,
  HISTORY_PERIODS,
  type HistoryFilter,
  type HistoryPeriod,
  toDoseHistory,
} from '../dose-history'
import {
  CURRENT_MEDICATION_ID,
  doseHistoryAtom,
  doseHistoryFilterAtom,
  type GingerPodComponents,
  medicationAtom,
  medicationCoursesAtom,
  medicationDoseAtom,
} from '../model'
import { DoseRow } from './dose-row'
import { SubScreenTopBar } from './sub-screen-top-bar'

const PAGE_SIZE = 50

type DoseListProps = {
  days: DoseDay[]
  total: number
  onMoreShown: (shown: number) => void
}

// Remounted when a filter changes, so paging starts over.
const DoseList = ({ days, total, onMoreShown }: DoseListProps) => {
  const { t, i18n } = useTranslation()
  const { Button, SectionLabel } = useFlowComponents<GingerPodComponents>()
  const [shown, setShown] = useState(PAGE_SIZE)
  const now = new Date()

  let remaining = shown
  const visible = days.flatMap((day) => {
    if (remaining <= 0) return []
    const doses = day.doses.slice(0, remaining)
    remaining -= doses.length
    return [{ ...day, doses }]
  })

  const showMore = () => {
    const next = Math.min(shown + PAGE_SIZE, total)
    onMoreShown(next)
    setShown(next)
  }

  return (
    <>
      {visible.map((day) => (
        <section className="flex flex-col gap-2" key={day.day}>
          <SectionLabel>{formatDayLabel(day.day, now, t, i18n.language)}</SectionLabel>
          <ul className="flex flex-col divide-y divide-gray-100 rounded-2xl bg-white px-4 shadow-card">
            {day.doses.map((dose) => (
              <DoseRow dose={dose} key={dose.id} />
            ))}
          </ul>
        </section>
      ))}
      {shown < total && (
        <Button className="w-full" onClick={showMore} size="l" tone="tertiary" variant="outlined">
          {t('pods.ginger.doseHistory.showMore', { count: Math.min(PAGE_SIZE, total - shown) })}
        </Button>
      )}
    </>
  )
}

type DoseHistoryViewProps = {
  onMenu: () => void
  // Called before the filter changes, including by "Show all time".
  onFilter: (next: HistoryFilter) => void
  onMoreShown: (shown: number) => void
}

// Every past dose of Ginger's medications, newest first, filtered by period and medication.
export const DoseHistoryView = ({ onMenu, onFilter, onMoreShown }: DoseHistoryViewProps) => {
  const { t } = useTranslation()
  const { Button, PodScreen, SegmentedTabs, SelectField } = useFlowComponents<GingerPodComponents>()
  const [filter, setFilter] = useAtom(doseHistoryFilterAtom)
  const current = useAtomValue(medicationAtom)
  const courses = useAtomValue(medicationCoursesAtom)
  const doses = toDoseHistory(useAtomValue(medicationDoseAtom), useAtomValue(doseHistoryAtom), filter, new Date())

  const applyFilter = (next: HistoryFilter) => {
    onFilter(next)
    setFilter(next)
  }

  const medicationOptions = [
    { label: t('pods.ginger.doseHistory.allMedications'), value: 'all' },
    { label: current.brandName ?? current.activeIngredients[0].label, value: CURRENT_MEDICATION_ID },
    ...courses.map(({ id, record }) => ({
      label: t('pods.ginger.doseHistory.course', {
        name: record.brandName ?? record.activeIngredients[0].label,
        year: record.startDate?.slice(0, 4) ?? '',
      }),
      value: id,
    })),
  ]

  return (
    <PodScreen
      topBar={
        <SubScreenTopBar
          onMenu={onMenu}
          title={t('pods.ginger.doseHistory.title')}
          trail={[t('pods.ginger.medical.title')]}
        />
      }
    >
      <div className="flex flex-col gap-3">
        <SegmentedTabs<HistoryPeriod>
          items={HISTORY_PERIODS.map((period) => ({
            label: t(`pods.ginger.doseHistory.periods.${period}`),
            value: period,
          }))}
          onSelect={(period) => applyFilter({ ...filter, period })}
          value={filter.period}
        />
        <SelectField<string>
          label={t('pods.ginger.doseHistory.medication')}
          onChange={(medicationId) => applyFilter({ ...filter, medicationId })}
          options={medicationOptions}
          value={filter.medicationId}
        />
      </div>
      {doses.length > 0 ? (
        <DoseList
          days={groupByDay(doses)}
          key={`${filter.period}:${filter.medicationId}`}
          onMoreShown={onMoreShown}
          total={doses.length}
        />
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-5 text-center shadow-card">
          <p className="font-semibold text-gray-900 text-lg">{t('pods.ginger.doseHistory.empty')}</p>
          {filter.period !== 'all' && (
            <Button onClick={() => applyFilter({ ...filter, period: 'all' })} size="m" tone="secondary">
              {t('pods.ginger.doseHistory.showAllTime')}
            </Button>
          )}
        </div>
      )}
    </PodScreen>
  )
}
