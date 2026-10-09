import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'

import { categoriesWithStructure } from '../../../pods/catalog/templates'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { HomeView } from '../components/home-view'
import {
  canCreatePod,
  chosenCategoryAtom,
  createdPodAtom,
  createPodAtom,
  podNameAtom,
  roleAtom,
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
  const [role, setRole] = useAtom(roleAtom)
  const [category, setCategory] = useAtom(chosenCategoryAtom)
  const podCreated = useAtomValue(createdPodAtom) !== null
  const createPod = useSetAtom(createPodAtom)

  const create = () => {
    createPod()
    goToScreen(category ? 'pod-template-applied' : 'pod-empty')
  }

  return (
    <>
      <HomeView />
      <BottomSheet
        description={t('flows.scPet001.newPod.description')}
        onDismiss={back}
        title={t('flows.scPet001.newPod.title')}
      >
        <div className="flex flex-col gap-4">
          <TextField label={t('flows.scPet001.newPod.name')} onChange={setPodName} value={podName} />
          <TextField label={t('flows.scPet001.newPod.role')} onChange={setRole} value={role} />
          <SelectField<string>
            label={t('flows.scPet001.newPod.category')}
            onChange={(next) => setCategory(next === NO_CATEGORY ? null : next)}
            options={[
              { disabled: true, label: t('flows.scPet001.newPod.chooseCategory'), value: NO_CATEGORY },
              ...categoriesWithStructure().map((option) => ({ label: option.label, value: option.iri })),
            ]}
            value={category ?? NO_CATEGORY}
          />
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
