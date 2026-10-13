import { useAtomValue, useSetAtom, useStore } from 'jotai'
import { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { formatShortDate, inviteExpiresOn, inviteSentOn } from '../../../pods/people/sharing'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { InviteLinkField } from '../components/invite-link-field'
import { MembersView } from '../components/members-view'
import {
  revokeInviteAtom,
  type ScPpl002Components,
  type ScPpl002ScreenId,
  selectedInviteAtom,
  todayAtom,
} from '../model'

export const InviteDetailScreen = () => {
  const { t, i18n } = useTranslation()
  const { BottomSheet, Button } = useFlowComponents<ScPpl002Components>()
  const { back, complete, goToScreen } = useFlowNavigation<ScPpl002ScreenId>()
  const store = useStore()
  const invite = useAtomValue(selectedInviteAtom)
  const today = useAtomValue(todayAtom)
  const revokeInvite = useSetAtom(revokeInviteAtom)

  // Only on arrival: once revoked, the invite is gone while this screen is still on its way out.
  useLayoutEffect(() => {
    if (!store.get(selectedInviteAtom)) goToScreen('members')
  }, [store, goToScreen])

  if (!invite) return <MembersView />

  const revoke = () => {
    revokeInvite()
    goToScreen('members')
    complete({ showCompletionView: false })
  }

  return (
    <>
      <MembersView />
      <BottomSheet
        description={t('flows.scPpl002.inviteDetail.dates', {
          expires: formatShortDate(inviteExpiresOn(invite, today), i18n.language),
          sent: formatShortDate(inviteSentOn(invite, today), i18n.language),
        })}
        onDismiss={back}
        title={t('flows.scPpl002.inviteDetail.title', { name: invite.name })}
      >
        <div className="flex flex-col gap-4">
          <InviteLinkField link={invite.link} />
          <p className="text-gray-600 text-sm">{t('flows.scPpl002.inviteDetail.explanation', { name: invite.name })}</p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => goToScreen('invite-share')} size="l">
              {t('flows.scPpl002.inviteDetail.sendAgain')}
            </Button>
            <Button onClick={revoke} size="l" tone="danger" variant="link">
              {t('flows.scPpl002.inviteDetail.revoke')}
            </Button>
          </div>
        </div>
      </BottomSheet>
    </>
  )
}
