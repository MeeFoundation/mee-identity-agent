import { useAtomValue } from 'jotai'
import type { ReactNode } from 'react'
import { ClockHistory, Plus } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { useFlowComponents } from '../../../runtime/flow-context'
import { formatRelativeDay, memberName, toDoseHistory } from '../dose-history'
import { formatDoseTime } from '../dose-status'
import { doseHistoryAtom, type GingerPodComponents, medicationDoseAtom, podMembersAtom } from '../model'
import { MedicationRow } from './medication-row'
import { SubScreenTopBar } from './sub-screen-top-bar'

// The latest given dose of any medication, as one line.
const useLastGivenPreview = () => {
  const { t, i18n } = useTranslation()
  const now = new Date()
  const doses = toDoseHistory(
    useAtomValue(medicationDoseAtom),
    useAtomValue(doseHistoryAtom),
    { medicationId: 'all', period: 'all' },
    now,
  )
  const members = useAtomValue(podMembersAtom)
  const last = doses.find((dose) => dose.status === 'given' && dose.givenAt)
  return last?.givenAt
    ? t('pods.ginger.medical.historyPreview', {
        day: formatRelativeDay(last.givenAt, now, t, i18n.language),
        member: memberName(last.givenBy, members, t),
        time: formatDoseTime(last.givenAt, i18n.language),
      })
    : undefined
}

type MedicalDoseViewProps = {
  // The due-dose card, wired by the flow.
  doseCard: ReactNode
  // Shown above the card, such as a flow's toast.
  notice?: ReactNode
  onMenu: () => void
  onOpenMedication: () => void
  onAddMedication: () => void
  onOpenHistory: () => void
}

// Ginger's Medical screen: the scheduled dose, the current medication and the dose history.
export const MedicalDoseView = ({
  doseCard,
  notice,
  onMenu,
  onOpenMedication,
  onAddMedication,
  onOpenHistory,
}: MedicalDoseViewProps) => {
  const { t } = useTranslation()
  const { Button, PodScreen, RecordRow, SectionLabel } = useFlowComponents<GingerPodComponents>()
  const lastGiven = useLastGivenPreview()

  return (
    <PodScreen topBar={<SubScreenTopBar onMenu={onMenu} title={t('pods.ginger.medical.title')} />}>
      {notice}
      {doseCard}
      <section className="flex flex-col gap-3">
        <SectionLabel>{t('pods.ginger.medical.medications')}</SectionLabel>
        <MedicationRow onOpen={onOpenMedication} />
        <Button className="w-full px-4" onClick={onAddMedication} size="l" tone="tertiary" variant="outlined">
          <Plus aria-hidden className="shrink-0" size={24} />
          <span className="px-2.5">{t('pods.ginger.medical.add')}</span>
        </Button>
      </section>
      <RecordRow
        description={lastGiven}
        icon={ClockHistory}
        onClick={onOpenHistory}
        title={t('pods.ginger.medical.history')}
      />
    </PodScreen>
  )
}
