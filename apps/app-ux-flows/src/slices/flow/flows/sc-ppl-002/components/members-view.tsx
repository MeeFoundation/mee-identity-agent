import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { PersonPlus } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { sharedRole } from '../../../pods/people/member-info'
import { memberInitial, pendingLabel } from '../../../pods/people/sharing'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import {
  invitesAtom,
  memberCountAtom,
  memberInfoAtom,
  membersAtom,
  type ScPpl002Components,
  type ScPpl002ScreenId,
  selectedInviteIdAtom,
  selectedMemberIdAtom,
  toastAtom,
  undoRevokeAtom,
} from '../model'
import { MembersSubtitle, SofiaPodTopBar } from './sofia-pod-top-bar'
import telliAssistantIcon from '@/shared/ui/icons/telli-assistant.svg'

const MembersToast = () => {
  const { t } = useTranslation()
  const { Toast } = useFlowComponents<ScPpl002Components>()
  const [toast, setToast] = useAtom(toastAtom)
  const undoRevoke = useSetAtom(undoRevokeAtom)

  if (!toast) return null

  const close = () => setToast(null)

  if (toast.kind === 'revoked')
    return (
      <Toast
        action={{ label: t('flows.scPpl002.toast.undo'), onClick: undoRevoke }}
        onClose={close}
        title={t('flows.scPpl002.toast.revoked', { name: toast.invite.name })}
        variant="success"
      />
    )

  return (
    <Toast onClose={close} title={t(`flows.scPpl002.toast.${toast.kind}`, { name: toast.name })} variant="success" />
  )
}

type MembersViewProps = {
  // Off while a sheet is open over the list: a toast only lasts while Members itself is shown.
  showToast?: boolean
}

export const MembersView = ({ showToast = false }: MembersViewProps) => {
  const { t } = useTranslation()
  const { Button, MemberCard, MemberRow, PodScreen, SectionLabel } = useFlowComponents<ScPpl002Components>()
  const { goToScreen } = useFlowNavigation<ScPpl002ScreenId>()
  const members = useAtomValue(membersAtom)
  const invites = useAtomValue(invitesAtom)
  const count = useAtomValue(memberCountAtom)
  const memberInfo = useAtomValue(memberInfoAtom)
  const [toast, setToast] = useAtom(toastAtom)
  const selectInvite = useSetAtom(selectedInviteIdAtom)
  const selectMember = useSetAtom(selectedMemberIdAtom)

  const leaveFor = (screenId: ScPpl002ScreenId) => {
    setToast(null)
    goToScreen(screenId)
  }

  const openMember = (memberId: string) => {
    selectMember(memberId)
    leaveFor('member-detail')
  }

  const openInvite = (inviteId: string) => {
    selectInvite(inviteId)
    leaveFor('invite-detail')
  }

  return (
    <PodScreen
      bottomBar={
        showToast &&
        toast && (
          <div className="px-3 pb-[calc(0.75rem+var(--home-indicator-h))]">
            <MembersToast />
          </div>
        )
      }
      topBar={<SofiaPodTopBar onBack={() => leaveFor('info')} subtitle={<MembersSubtitle count={count} />} />}
    >
      <MemberCard
        footer={
          <Button
            className="w-full gap-2"
            onClick={() => leaveFor('invite-name')}
            size="l"
            tone="tertiary"
            variant="outlined"
          >
            <PersonPlus aria-hidden size={20} />
            {t('flows.scPpl002.members.invite')}
          </Button>
        }
      >
        {members.map((member) => {
          const detail = sharedRole(memberInfo[member.id]) ?? t('pods.people.sharing.canView')
          return member.role === 'owner' ? (
            <MemberRow
              avatar={{ letter: memberInitial(member.name) }}
              detail={detail}
              key={member.id}
              name={t('pods.people.sharing.you', { name: member.name })}
              onClick={() => leaveFor('my-info')}
              online
            />
          ) : (
            <MemberRow
              avatar={{ letter: memberInitial(member.name) }}
              detail={detail}
              key={member.id}
              name={member.name}
              onClick={() => openMember(member.id)}
            />
          )
        })}
        <MemberRow
          avatar={{ icon: telliAssistantIcon }}
          detail={t('pods.people.sharing.assistant')}
          name={t('pods.people.sharing.telli')}
        />
      </MemberCard>
      {invites.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionLabel>{t('flows.scPpl002.members.pendingInvites')}</SectionLabel>
          <MemberCard>
            {invites.map((invite) => {
              const label = pendingLabel(invite)
              return (
                <MemberRow
                  avatar={{ letter: memberInitial(invite.name) }}
                  detail={t(`pods.people.sharing.${label.key}`, label)}
                  detailTone="warning"
                  key={invite.id}
                  name={invite.name}
                  onClick={() => openInvite(invite.id)}
                />
              )
            })}
          </MemberCard>
        </section>
      )}
    </PodScreen>
  )
}
