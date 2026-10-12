import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'

import { categoriesWithStructure } from '../../../pods/catalog/templates'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { HomeView } from '../components/home-view'
import { TelliView } from '../components/telli-view'
import {
  canCreatePod,
  categoryFromTelliAtom,
  chooseCategoryAtom,
  chosenCategoryAtom,
  createdPodAtom,
  createPodAtom,
  newPodOriginAtom,
  podNameAtom,
  type ScPet001Components,
  type ScPet001ScreenId,
} from '../model'

// The select's value for "no category"; it is shown as the "Choose category" placeholder.
const NO_CATEGORY = ''

export const NewPodScreen = () => {
  const { t } = useTranslation()
  const { BottomSheet, Button, SelectField, TextField } = useFlowComponents<ScPet001Components>()
  const { back, goToScreen } = useFlowNavigation<ScPet001ScreenId>()
  const [podName, setPodName] = useAtom(podNameAtom)
  const category = useAtomValue(chosenCategoryAtom)
  const chooseCategory = useSetAtom(chooseCategoryAtom)
  const categoryFromTelli = useAtomValue(categoryFromTelliAtom)
  const origin = useAtomValue(newPodOriginAtom)
  const podCreated = useAtomValue(createdPodAtom) !== null
  const createPod = useSetAtom(createPodAtom)

  const create = () => {
    createPod()
    goToScreen('pod-notes')
  }

  return (
    <>
      {origin === 'telli' ? <TelliView /> : <HomeView />}
      <BottomSheet
        description={t('flows.scPet001.newPod.description')}
        onDismiss={back}
        title={t('flows.scPet001.newPod.title')}
      >
        <div className="flex flex-col gap-4">
          <TextField label={t('flows.scPet001.newPod.name')} onChange={setPodName} value={podName} />
          <SelectField<string>
            label={t('flows.scPet001.newPod.category')}
            onChange={(next) => chooseCategory(next === NO_CATEGORY ? null : next)}
            options={[
              { disabled: true, label: t('flows.scPet001.newPod.chooseCategory'), value: NO_CATEGORY },
              ...categoriesWithStructure().map((option) => ({ label: option.label, value: option.iri })),
            ]}
            value={category ?? NO_CATEGORY}
          />
          {categoryFromTelli && (
            <p className="-mt-2 text-gray-600 text-xs">{t('flows.scPet001.newPod.suggestedByTelli')}</p>
          )}
          <Button className="w-full" disabled={podCreated || !canCreatePod(podName)} onClick={create} size="l">
            {t('flows.scPet001.newPod.create')}
          </Button>
          {podCreated && (
            <output className="text-center text-gray-600 text-sm">{t('flows.scPet001.newPod.created')}</output>
          )}
        </div>
      </BottomSheet>
    </>
  )
}
