import { useAtomValue, useSetAtom } from 'jotai'
import { Grid } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { findCategory } from '../../../pods/catalog/categories'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import {
  applyQuickActionAtom,
  canCreateFromDraft,
  createdPodAtom,
  createPodFromQuickActionAtom,
  type QuickAction,
  type ScPet001Components,
  type ScPet001ScreenId,
} from '../model'

type QuickActionCardProps = {
  action: QuickAction
  // The turn whose reply carries the card; the card always acts on its own draft.
  turn: number
}

export const QuickActionCard = ({ action, turn }: QuickActionCardProps) => {
  const { t } = useTranslation()
  const { ChatActionCard } = useFlowComponents<ScPet001Components>()
  const { goToScreen } = useFlowNavigation<ScPet001ScreenId>()
  const pod = useAtomValue(createdPodAtom)
  const applyQuickAction = useSetAtom(applyQuickActionAtom)
  const createPodFromQuickAction = useSetAtom(createPodFromQuickActionAtom)
  const { name, category } = action.draft
  const categoryLabel = category ? findCategory(category)?.label : undefined

  const createPod = () => {
    if (!canCreateFromDraft(action.draft)) {
      applyQuickAction(turn)
      goToScreen('new-pod')
      return
    }
    createPodFromQuickAction(turn)
    goToScreen('pod-created')
  }

  // A run has one pod, so once it exists every card leads to it, however it was created.
  const cardAction = pod
    ? { label: t('flows.scPet001.telli.openPod'), onAction: () => goToScreen('pod-notes') }
    : { label: t('flows.scPet001.telli.createPod'), onAction: createPod }

  return (
    <ChatActionCard
      action={cardAction}
      avatarLetter={name?.charAt(0).toUpperCase()}
      icon={name ? undefined : Grid}
      rows={categoryLabel ? [{ label: t('flows.scPet001.telli.category'), value: categoryLabel }] : []}
      status={pod ? t('flows.scPet001.telli.podCreated') : undefined}
      title={name ?? t('flows.scPet001.telli.newPod')}
    />
  )
}
