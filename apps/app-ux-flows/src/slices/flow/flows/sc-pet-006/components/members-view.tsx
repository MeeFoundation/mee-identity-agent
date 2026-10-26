import { useAtom, useAtomValue } from 'jotai'
import { PersonPlus } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { podAtom } from '../../../pods/ginger/model'
import { memberInitial, pendingLabel, roleLabelKey } from '../../../pods/people/sharing'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import {
  accessAtom,
  invitesAtom,
  memberCountAtom,
  membersAtom,
  type ScPet006Components,
  type ScPet006ScreenId,
  sentToastAtom,
} from '../model'
import telliAssistantIcon from '@/shared/ui/icons/telli-assistant.svg'

type MembersViewProps = {
  // Off while a sheet is open over the list: a toast only lasts while Members itself is shown.
  showToast?: boolean
}

export const MembersView = ({ showToast = false }: MembersViewProps) => {
  const { t } = useTranslation()
  const { Button, CountBadge, MemberCard, MemberRow, PodScreen, PodTopBar, SectionLabel, Toast } =
    useFlowComponents<ScPet006Components>()
  const { back, goToScreen } = useFlowNavigation<ScPet006ScreenId>()
  const pod = useAtomValue(podAtom)
  const access = useAtomValue(accessAtom)
  const members = useAtomValue(membersAtom)
  const invites = useAtomValue(invitesAtom)
  const count = useAtomValue(memberCountAtom)
  const [sentTo, setSentTo] = useAtom(sentToastAtom)
  const isOwner = access === 'owner'

  const invite = () => {
    setSentTo(null)
    goToScreen('invite-name')
  }

  return (
    <PodScreen
      bottomBar={
        showToast &&
        sentTo !== null && (
          <div className="px-3 pb-[calc(0.75rem+var(--home-indicator-h))]">
            <Toast
              onClose={() => setSentTo(null)}
              title={t('flows.scPet006.toast.sent', { name: sentTo })}
              variant="success"
            />
          </div>
        )
      }
      topBar={
        <PodTopBar
          avatar={{ src: pod.avatarSrc }}
          onBack={back}
          onMenu={() => {}}
          subtitle={
            <>
              <span>{t('flows.scPet006.members.title')}</span>
              <CountBadge count={count} />
            </>
          }
          title={pod.name}
        />
      }
    >
      <MemberCard
        footer={
          isOwner && (
            <Button className="w-full gap-2" onClick={invite} size="l" tone="tertiary" variant="outlined">
              <PersonPlus aria-hidden size={20} />
              {t('flows.scPet006.members.invite')}
            </Button>
          )
        }
      >
        {members.map((member) => {
          const isYou = member.role === access
          return (
            <MemberRow
              avatar={{ letter: memberInitial(member.name) }}
              detail={t(roleLabelKey(member.role))}
              key={member.id}
              name={isYou ? t('pods.people.sharing.you', { name: member.name }) : member.name}
              online={isYou}
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
          <SectionLabel>{t('flows.scPet006.members.pendingInvites')}</SectionLabel>
          <MemberCard>
            {invites.map((pending) => {
              const label = pendingLabel(pending)
              return (
                <MemberRow
                  avatar={{ letter: memberInitial(pending.name) }}
                  detail={t('flows.scPet006.members.pendingDetail', {
                    access: t(roleLabelKey(pending.role ?? 'viewer')),
                    sent: t(`pods.people.sharing.${label.key}`, label),
                  })}
                  detailTone="warning"
                  key={pending.id}
                  name={pending.name}
                />
              )
            })}
          </MemberCard>
        </section>
      )}
    </PodScreen>
  )
}
