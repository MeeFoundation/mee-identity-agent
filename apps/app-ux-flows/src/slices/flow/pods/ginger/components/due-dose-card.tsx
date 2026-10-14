import { useAtomValue } from 'jotai'
import { useId } from 'react'
import { Capsule, CheckCircleFill, Clock, ExclamationCircle } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/lib/cn'

import { useFlowComponents } from '../../../runtime/flow-context'
import { formatRelativeDay, lastGivenDose, memberName } from '../dose-history'
import { type DoseStatus, formatDoseTime, toDoseStatus } from '../dose-status'
import { toMedicationSummary } from '../medication-fields'
import {
  CURRENT_MEDICATION_ID,
  doseHistoryAtom,
  type GingerPodComponents,
  medicationAtom,
  medicationDoseAtom,
  PARTICIPANT_ID,
  podAtom,
  podMembersAtom,
} from '../model'

const treatments = {
  // Due is a calm prompt, not an alarm: only an overdue dose uses warning colours.
  due: { heading: 'text-brand-700', icon: Clock, surface: 'border-brand-200 bg-brand-50' },
  given: { heading: 'text-success-700', icon: CheckCircleFill, surface: 'border-success-200 bg-success-50' },
  overdue: { heading: 'text-warning-700', icon: ExclamationCircle, surface: 'border-warning-200 bg-warning-50' },
  upcoming: { heading: 'text-gray-600', icon: Clock, surface: 'border-gray-200 bg-gray-50' },
} as const satisfies Record<DoseStatus, object>

type DueDoseCardProps = {
  onGive: () => void
  // Opens the medication's dose history.
  onHistory: () => void
  // Reverts a dose the participant marked as given; without it the given card offers no undo.
  onUndo?: () => void
  // Names the pet, for surfaces outside its pod.
  showPet?: boolean
}

// The pod's one scheduled dose; the same card wherever a flow surfaces it.
export const DueDoseCard = ({ onGive, onHistory, onUndo, showPet = false }: DueDoseCardProps) => {
  const { t, i18n } = useTranslation()
  const { Button } = useFlowComponents<GingerPodComponents>()
  const headingId = useId()
  const nameId = useId()
  const pod = useAtomValue(podAtom)
  const dose = useAtomValue(medicationDoseAtom)
  const members = useAtomValue(podMembersAtom)
  const lastGiven = lastGivenDose(useAtomValue(doseHistoryAtom), CURRENT_MEDICATION_ID)
  const summary = toMedicationSummary(useAtomValue(medicationAtom), t, i18n.language)
  const now = new Date()
  const status = toDoseStatus(dose, now)
  const treatment = treatments[status]
  const StatusIcon = treatment.icon

  const heading =
    status === 'given'
      ? t('pods.ginger.dose.given', {
          member: memberName(dose.givenBy, members, t),
          time: formatDoseTime(dose.givenAt ?? dose.scheduledAt, i18n.language),
        })
      : t(`pods.ginger.dose.${status}`, { time: formatDoseTime(dose.scheduledAt, i18n.language) })

  return (
    <section
      aria-labelledby={`${headingId} ${nameId}`}
      className={cn('flex flex-col gap-3 rounded-2xl border p-3 shadow-card', treatment.surface)}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className={cn('flex items-center gap-1.5 font-semibold text-sm', treatment.heading)} id={headingId}>
          <StatusIcon aria-hidden className="shrink-0" size={16} />
          {heading}
        </h2>
        <Button className="-my-1.5 -mr-2.5 shrink-0" onClick={onHistory} size="s" tone="primary" variant="link">
          {t('pods.ginger.dose.history')}
        </Button>
      </div>
      <div className="flex items-center gap-3">
        {showPet ? (
          <img alt="" className="size-10 shrink-0 rounded-full object-cover" src={pod.avatarSrc} />
        ) : (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white">
            <Capsule aria-hidden className="text-brand-500" size={20} />
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          {showPet && <span className="font-medium text-gray-600 text-sm">{pod.name}</span>}
          <span className="font-medium text-base text-gray-900" id={nameId}>
            {summary.name}
          </span>
          <span className="text-gray-700 text-sm">
            {t('pods.ginger.medication.summary', { dose: summary.dose, frequency: summary.frequency })}
          </span>
          {status !== 'given' && lastGiven?.givenAt && (
            <span className="text-gray-600 text-xs">
              {t('pods.ginger.dose.lastGiven', {
                day: formatRelativeDay(lastGiven.givenAt, now, t, i18n.language),
                member: memberName(lastGiven.givenBy, members, t),
                time: formatDoseTime(lastGiven.givenAt, i18n.language),
              })}
            </span>
          )}
        </div>
        {status === 'given' && dose.givenBy === PARTICIPANT_ID && onUndo && (
          <Button className="-mr-2.5 shrink-0" onClick={onUndo} size="s" tone="tertiary" variant="link">
            {t('pods.ginger.dose.undo')}
          </Button>
        )}
      </div>
      {(status === 'due' || status === 'overdue') && (
        <Button className="w-full" onClick={onGive} size="m">
          {t('pods.ginger.dose.markAsGiven')}
        </Button>
      )}
    </section>
  )
}
