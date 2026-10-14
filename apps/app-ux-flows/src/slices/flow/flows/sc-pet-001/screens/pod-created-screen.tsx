import { Check2Circle } from 'react-bootstrap-icons'
import { Trans, useTranslation } from 'react-i18next'

import { InviteLinkField } from '../../../pods/people/components/invite-link-field'
import { FIRST_INVITE_LINK } from '../../../pods/people/sharing'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { PodNotesView } from '../components/pod-notes-view'
import { usePod } from '../components/use-pod'
import type { ScPet001Components, ScPet001ScreenId } from '../model'

// Shown after every creation, over the new pod. Leaving it opens the pod, never the New Pod sheet again.
export const PodCreatedScreen = () => {
  const { t } = useTranslation()
  const pod = usePod()
  const { BottomSheet, Button } = useFlowComponents<ScPet001Components>()
  const { goToScreen } = useFlowNavigation<ScPet001ScreenId>()

  if (!pod) return null

  const goToPod = () => goToScreen('pod-notes')

  return (
    <>
      <PodNotesView pod={pod} />
      <BottomSheet
        onDismiss={goToPod}
        title={
          <span className="flex flex-col items-center gap-4 pt-2 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-success-50">
              <Check2Circle aria-hidden className="text-gray-900" size={24} />
            </span>
            <span className="font-normal text-2xl text-gray-900">
              <Trans
                components={{ bold: <strong className="font-bold" /> }}
                i18nKey="flows.scPet001.podCreated.title"
                values={{ name: pod.name }}
              />
            </span>
          </span>
        }
      >
        <div className="flex flex-col gap-6">
          <p className="-mt-4 text-center text-gray-800 text-sm">{t('flows.scPet001.podCreated.message')}</p>
          <InviteLinkField copyLabel="text" link={FIRST_INVITE_LINK} />
          <Button className="w-full" onClick={goToPod} size="l">
            {t('flows.scPet001.podCreated.goTo', { name: pod.name })}
          </Button>
        </div>
      </BottomSheet>
    </>
  )
}
