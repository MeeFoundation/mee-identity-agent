import { useAtomValue } from 'jotai'
import { CheckCircleFill, XCircle } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { memberName } from '../dose-history'
import { formatDoseTime } from '../dose-status'
import { toMedicationSummary } from '../medication-fields'
import { CURRENT_MEDICATION_ID, type DoseEvent, medicationAtom, medicationCoursesAtom, podMembersAtom } from '../model'
import { cn } from '@/shared/lib/cn'

type DoseRowProps = {
  dose: DoseEvent
}

// One past dose, read-only: which medication, and whether and by whom it was given.
export const DoseRow = ({ dose }: DoseRowProps) => {
  const { t, i18n } = useTranslation()
  const current = useAtomValue(medicationAtom)
  const courses = useAtomValue(medicationCoursesAtom)
  const members = useAtomValue(podMembersAtom)
  const record =
    dose.medicationId === CURRENT_MEDICATION_ID
      ? current
      : (courses.find((course) => course.id === dose.medicationId)?.record ?? current)
  const summary = toMedicationSummary(record, t, i18n.language)
  const given = dose.status === 'given'
  const StatusIcon = given ? CheckCircleFill : XCircle

  return (
    <li className="flex items-center gap-3 py-2.5">
      <StatusIcon aria-hidden className={cn('shrink-0', given ? 'text-success-600' : 'text-warning-600')} size={18} />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-medium text-gray-900 text-sm">{`${summary.name} · ${summary.dose}`}</span>
        <span className={cn('text-xs', given ? 'text-gray-600' : 'text-warning-700')}>
          {given
            ? t('pods.ginger.doseHistory.given', {
                member: memberName(dose.givenBy, members, t),
                time: formatDoseTime(dose.givenAt ?? dose.scheduledAt, i18n.language),
              })
            : `${t('pods.ginger.doseHistory.missed')} · ${t('pods.ginger.doseHistory.scheduled', { time: formatDoseTime(dose.scheduledAt, i18n.language) })}`}
        </span>
      </div>
    </li>
  )
}
