import { useAtomValue, useSetAtom } from 'jotai'
import { Diagram3, FolderPlus, Paperclip, People } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import {
  addMedicationFormAtom,
  type ExpPet002Components,
  type ExpPet002ScreenId,
  medicationFormAddedAtom,
  podAtom,
  sheetOriginAtom,
  showAiSuggestionAtom,
} from '../model'
import { GingerTopBar } from './ginger-top-bar'
import { MedicationFormCard } from './medication-form-card'

const noop = () => {}

type PodInfoViewProps = {
  // `medication-added` shows the added form even before its effect has updated the run state.
  medicationFormAdded?: boolean
}

export const PodInfoView = ({ medicationFormAdded: forcedAdded = false }: PodInfoViewProps) => {
  const { t } = useTranslation()
  const { AiSuggestion, CardWithAction, CategoryRow, Divider, EmptyStateCard, PodScreen, SectionLabel } =
    useFlowComponents<ExpPet002Components>()
  const { goToScreen } = useFlowNavigation<ExpPet002ScreenId>()
  const pod = useAtomValue(podAtom)
  const medicationFormAdded = useAtomValue(medicationFormAddedAtom) || forcedAdded
  const showAiSuggestion = useAtomValue(showAiSuggestionAtom)
  const addMedicationForm = useSetAtom(addMedicationFormAtom)
  const setSheetOrigin = useSetAtom(sheetOriginAtom)

  const openAddForm = () => {
    setSheetOrigin('ginger-info')
    goToScreen('add-form')
  }

  const acceptSuggestion = () => {
    addMedicationForm()
    goToScreen('medication-added')
  }

  return (
    <PodScreen topBar={<GingerTopBar tab="info" />}>
      <div className="flex flex-col gap-3">
        {showAiSuggestion && !medicationFormAdded && (
          <div className="pt-2">
            <AiSuggestion
              caption={t('flows.expPet002.aiSuggestion.caption')}
              label={t('flows.expPet002.aiSuggestion.addMedication')}
              onClick={acceptSuggestion}
            />
          </div>
        )}
        <section className="flex flex-col gap-3">
          <SectionLabel>{t('flows.expPet002.forms.title')}</SectionLabel>
          {medicationFormAdded ? (
            <CardWithAction
              actionIcon={FolderPlus}
              actionLabel={t('flows.expPet002.forms.createForm')}
              actionTone="tertiary"
              onAction={noop}
            >
              <MedicationFormCard />
            </CardWithAction>
          ) : (
            <EmptyStateCard
              actionLabel={t('flows.expPet002.forms.addForm')}
              message={t('flows.expPet002.forms.emptyMessage')}
              onAction={openAddForm}
              title={t('flows.expPet002.forms.emptyTitle')}
            />
          )}
        </section>
        <Divider />
        <CategoryRow
          count={0}
          icon={Paperclip}
          label={t('flows.expPet002.categories.medical')}
          onClick={() => goToScreen('medical')}
        />
        <CategoryRow count={0} icon={Paperclip} label={t('flows.expPet002.categories.attachments')} onClick={noop} />
        <CategoryRow count={0} icon={Diagram3} label={t('flows.expPet002.categories.subpods')} onClick={noop} />
        <CategoryRow
          count={pod.memberCount}
          icon={People}
          label={t('flows.expPet002.categories.members')}
          onClick={noop}
        />
      </div>
    </PodScreen>
  )
}
