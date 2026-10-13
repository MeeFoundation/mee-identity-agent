import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'

import { useFlowComponents } from '../../../runtime/flow-context'
import { formatRelativeDay, memberName } from '../dose-history'
import { formatDoseTime, toDoseStatus } from '../dose-status'
import { toMedicationSummary } from '../medication-fields'
import { type GingerPodComponents, medicationAtom, medicationDoseAtom, podAtom, podMembersAtom } from '../model'

type DoseSheetProps = {
  onConfirm: () => void
  // Also called when the sheet is dismissed.
  onCancel: () => void
}

// "Apoquel · 16 mg tablet": which dose the sheet is about.
const useMedicationLine = () => {
  const { t, i18n } = useTranslation()
  const medication = useAtomValue(medicationAtom)
  const summary = toMedicationSummary(medication, t, i18n.language)
  return t('pods.ginger.doseSheet.medication', {
    dose: summary.dose,
    form: medication.doseForm?.label.toLowerCase() ?? '',
    name: summary.name,
  })
}

type SheetProps = DoseSheetProps & {
  title: string
  detail: string
  confirmLabel: string
  cancelLabel: string
  confirmTone?: 'primary' | 'danger'
}

const DoseSheet = ({ title, detail, confirmLabel, cancelLabel, confirmTone, onConfirm, onCancel }: SheetProps) => {
  const { BottomSheet, Button } = useFlowComponents<GingerPodComponents>()
  const medicationLine = useMedicationLine()

  return (
    <BottomSheet onDismiss={onCancel} title={title}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-base text-gray-900">{medicationLine}</p>
          <p className="text-gray-600 text-sm">{detail}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Button className="w-full" onClick={onConfirm} size="l" tone={confirmTone}>
            {confirmLabel}
          </Button>
          <Button className="w-full" onClick={onCancel} size="l" tone="tertiary" variant="link">
            {cancelLabel}
          </Button>
        </div>
      </div>
    </BottomSheet>
  )
}

// Confirms giving the pod's scheduled dose; a dose not due yet or overdue names its scheduled time.
export const GiveDoseSheet = (props: DoseSheetProps) => {
  const { t, i18n } = useTranslation()
  const pod = useAtomValue(podAtom)
  const dose = useAtomValue(medicationDoseAtom)
  const detail =
    toDoseStatus(dose, new Date()) === 'due'
      ? t('pods.ginger.doseSheet.give.scheduledNow')
      : t('pods.ginger.doseSheet.give.scheduledAt', { time: formatDoseTime(dose.scheduledAt, i18n.language) })

  return (
    <DoseSheet
      {...props}
      cancelLabel={t('pods.ginger.doseSheet.give.cancel')}
      confirmLabel={t('pods.ginger.doseSheet.give.confirm')}
      detail={detail}
      title={t('pods.ginger.doseSheet.give.title', { name: pod.name })}
    />
  )
}

// Confirms reverting a dose marked as given by mistake.
export const UndoDoseSheet = (props: DoseSheetProps) => {
  const { t, i18n } = useTranslation()
  const pod = useAtomValue(podAtom)
  const dose = useAtomValue(medicationDoseAtom)
  const members = useAtomValue(podMembersAtom)
  const givenAt = dose.givenAt ?? dose.scheduledAt

  return (
    <DoseSheet
      {...props}
      cancelLabel={t('pods.ginger.doseSheet.undo.cancel')}
      confirmLabel={t('pods.ginger.doseSheet.undo.confirm')}
      confirmTone="danger"
      detail={t('pods.ginger.doseSheet.undo.given', {
        day: formatRelativeDay(givenAt, new Date(), t, i18n.language),
        member: memberName(dose.givenBy, members, t),
        time: formatDoseTime(givenAt, i18n.language),
      })}
      title={t('pods.ginger.doseSheet.undo.title', { name: pod.name })}
    />
  )
}
