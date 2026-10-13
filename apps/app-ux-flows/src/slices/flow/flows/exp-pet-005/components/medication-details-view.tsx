import { useAtomValue } from 'jotai'
import { Capsule } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { DoseRow } from '../../../pods/ginger/components/dose-row'
import { SubScreenTopBar } from '../../../pods/ginger/components/sub-screen-top-bar'
import { recentDoses } from '../../../pods/ginger/dose-history'
import { toMedicationFieldRows, toMedicationSummary } from '../../../pods/ginger/medication-fields'
import { CURRENT_MEDICATION_ID, doseHistoryAtom, medicationAtom } from '../../../pods/ginger/model'
import { useFlowAnalytics, useFlowComponents } from '../../../runtime/flow-context'
import type { ExpPet005Components, ExpPet005Events } from '../model'
import { DoseToast } from './dose-toast'
import { FlowDoseCard } from './flow-dose-card'
import { useOpenHistory } from './use-open-history'

type ViewProps = {
  // Off while a confirmation sheet is shown over this view.
  showToast?: boolean
}

// Read-only: the dose can be given here so opening the medication is never a dead end, but nothing is edited.
export const MedicationDetailsView = ({ showToast = false }: ViewProps) => {
  const { t, i18n } = useTranslation()
  const { Button, FieldRow, FormCard, PodScreen, SectionLabel } = useFlowComponents<ExpPet005Components>()
  const openHistory = useOpenHistory()
  // Past doses only: the current one is the card above.
  const recent = recentDoses(useAtomValue(doseHistoryAtom), CURRENT_MEDICATION_ID, 2)
  const { track } = useFlowAnalytics<ExpPet005Events>()
  const medication = useAtomValue(medicationAtom)

  return (
    <PodScreen
      topBar={
        <SubScreenTopBar
          onMenu={() => track('pod_menu_selected', { screen: 'medication' })}
          title={toMedicationSummary(medication, t, i18n.language).name}
          trail={[t('pods.ginger.medical.title')]}
        />
      }
    >
      {showToast && <DoseToast screen="medication" />}
      <FlowDoseCard origin="medication" />
      {recent.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <SectionLabel>{t('flows.expPet005.details.recent')}</SectionLabel>
            <Button
              className="-my-1.5 -mr-2.5"
              onClick={() => openHistory('details', CURRENT_MEDICATION_ID)}
              size="s"
              tone="primary"
              variant="link"
            >
              {t('flows.expPet005.details.seeAll')}
            </Button>
          </div>
          <ul className="flex flex-col divide-y divide-gray-100 rounded-2xl bg-white px-4 shadow-card">
            {recent.map((dose) => (
              <DoseRow dose={dose} key={dose.id} />
            ))}
          </ul>
        </section>
      )}
      <FormCard icon={Capsule} title={t('pods.ginger.medication.formTitle')}>
        {toMedicationFieldRows(medication, t, i18n.language).map((row) => (
          <FieldRow key={row.id} label={row.label} value={row.value} />
        ))}
      </FormCard>
    </PodScreen>
  )
}
