import { useAtomValue, useSetAtom } from 'jotai'
import { Hearts } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { MedicationFormCard } from '../../../pods/ginger/components/medication-form-card'
import { medicationFormAddedAtom, podAtom } from '../../../pods/ginger/model'
import { useFlowAnalytics, useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { type ExpPet002Components, type ExpPet002Events, type ExpPet002ScreenId, sheetOriginAtom } from '../model'

const noop = () => {}

export const MedicalView = () => {
  const { t } = useTranslation()
  const { EmptyStateCard, PodScreen, PodTopBar, SectionLabel } = useFlowComponents<ExpPet002Components>()
  const { back, goToScreen } = useFlowNavigation<ExpPet002ScreenId>()
  const { track } = useFlowAnalytics<ExpPet002Events>()
  const pod = useAtomValue(podAtom)
  const medicationFormAdded = useAtomValue(medicationFormAddedAtom)
  const setSheetOrigin = useSetAtom(sheetOriginAtom)

  const openAddForm = () => {
    track('add_form_clicked', { entry_point: 'medical_section' })
    setSheetOrigin('medical')
    goToScreen('add-form')
  }

  return (
    <PodScreen
      topBar={
        <PodTopBar
          avatar={{ src: pod.avatarSrc }}
          breadcrumb={[pod.name]}
          breadcrumbIcon={Hearts}
          breadcrumbTrailingChevron
          onBack={back}
          onMenu={noop}
          title={t('flows.expPet002.medical.title')}
        />
      }
    >
      <section className="flex flex-col gap-3">
        <SectionLabel>{t('flows.expPet002.medical.sectionTitle')}</SectionLabel>
        {medicationFormAdded ? (
          <MedicationFormCard />
        ) : (
          <EmptyStateCard
            action={{ label: t('flows.expPet002.medical.addMedication'), onAction: openAddForm }}
            message={t('flows.expPet002.medical.emptyMessage', { name: pod.name })}
            title={t('flows.expPet002.medical.emptyTitle')}
          />
        )}
      </section>
    </PodScreen>
  )
}
