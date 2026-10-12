import { CheckCircleFill, Plus } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { SubScreenTopBar } from '../../../pods/ginger/components/sub-screen-top-bar'
import { useFlowAnalytics, useFlowComponents } from '../../../runtime/flow-context'
import type { ExpPet004Components, ExpPet004Events } from '../model'
import { MedicationItem } from './medication-item'

type MedicalViewProps = {
  // Shown once the update was saved.
  confirmation?: boolean
}

export const MedicalView = ({ confirmation = false }: MedicalViewProps) => {
  const { t } = useTranslation()
  const { Button, PodScreen, SectionLabel } = useFlowComponents<ExpPet004Components>()
  const { track } = useFlowAnalytics<ExpPet004Events>()

  return (
    <PodScreen
      topBar={
        <SubScreenTopBar
          onMenu={() => track('pod_menu_selected', { screen: 'medical' })}
          title={t('flows.expPet004.medical.title')}
        />
      }
    >
      <div className="flex flex-col gap-3">
        <output aria-live="polite" className="block">
          {confirmation && (
            <p className="flex items-center gap-2 rounded-2xl border border-success-200 bg-success-50 px-4 py-3 font-medium text-sm text-success-800">
              <CheckCircleFill aria-hidden className="shrink-0 text-success-600" size={18} />
              {t('flows.expPet004.updated')}
            </p>
          )}
        </output>
        <section className="flex flex-col gap-3">
          <SectionLabel>{t('flows.expPet004.medical.medications')}</SectionLabel>
          <MedicationItem />
          {/* Shown so the list looks as in the product; this scenario only changes the medication, so a tap is just recorded. */}
          <Button
            className="w-full px-4"
            onClick={() => track('add_medication_selected')}
            size="l"
            tone="tertiary"
            variant="outlined"
          >
            <Plus aria-hidden className="shrink-0" size={24} />
            <span className="px-2.5">{t('flows.expPet004.medication.add')}</span>
          </Button>
        </section>
      </div>
    </PodScreen>
  )
}
