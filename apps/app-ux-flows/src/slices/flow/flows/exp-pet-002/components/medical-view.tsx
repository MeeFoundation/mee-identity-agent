import { useAtomValue, useSetAtom } from 'jotai'
import { Hearts } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import {
  type ExpPet002Components,
  type ExpPet002ScreenId,
  medicationFormAddedAtom,
  podAtom,
  sheetOriginAtom,
} from '../model'
import { MedicationFormCard } from './medication-form-card'

const noop = () => {}

export const MedicalView = () => {
  const { t } = useTranslation()
  const { EmptyStateCard, PodScreen, PodTopBar, SectionLabel } = useFlowComponents<ExpPet002Components>()
  const { back, goToScreen } = useFlowNavigation<ExpPet002ScreenId>()
  const pod = useAtomValue(podAtom)
  const medicationFormAdded = useAtomValue(medicationFormAddedAtom)
  const setSheetOrigin = useSetAtom(sheetOriginAtom)

  const openAddForm = () => {
    setSheetOrigin('medical')
    goToScreen('add-form')
  }

  return (
    <PodScreen
      topBar={
        <PodTopBar
          avatarSrc={pod.avatarSrc}
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
            actionLabel={t('flows.expPet002.medical.addMedication')}
            message={t('flows.expPet002.medical.emptyMessage', { name: pod.name })}
            onAction={openAddForm}
            title={t('flows.expPet002.medical.emptyTitle')}
          />
        )}
      </section>
    </PodScreen>
  )
}
