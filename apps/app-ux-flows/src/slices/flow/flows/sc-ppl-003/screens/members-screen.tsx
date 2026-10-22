import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { memberCount, memberInitial } from '../../../pods/people/sharing'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { SharedPodTopBar } from '../components/shared-pod-top-bar'
import { goalAtom, podMembers, type ScPpl003Components, type ScPpl003ScreenId } from '../model'
import telliAssistantIcon from '@/shared/ui/icons/telli-assistant.svg'

export const MembersScreen = () => {
  const { t } = useTranslation()
  const { CountBadge, MemberCard, MemberRow, PodScreen } = useFlowComponents<ScPpl003Components>()
  const { complete, goToScreen } = useFlowNavigation<ScPpl003ScreenId>()
  const goal = useAtomValue(goalAtom)

  useEffect(() => {
    if (goal === 'members') complete({ showCompletionView: false })
  }, [goal, complete])

  return (
    <PodScreen
      topBar={
        <SharedPodTopBar
          onBack={() => goToScreen('info')}
          subtitle={
            <>
              <span>{t('flows.scPpl003.pod.members')}</span>
              <CountBadge count={memberCount(podMembers, [])} />
            </>
          }
        />
      }
    >
      <MemberCard>
        {podMembers.map((member) =>
          member.role === 'owner' ? (
            <MemberRow
              avatar={{ letter: memberInitial(member.name) }}
              detail={t('pods.people.sharing.owner')}
              key={member.id}
              name={member.name}
            />
          ) : (
            <MemberRow
              avatar={{ letter: memberInitial(member.name) }}
              detail={t('pods.people.sharing.canView')}
              key={member.id}
              name={t('pods.people.sharing.you', { name: member.name })}
              online
            />
          ),
        )}
        <MemberRow
          avatar={{ icon: telliAssistantIcon }}
          detail={t('pods.people.sharing.assistant')}
          name={t('pods.people.sharing.telli')}
        />
      </MemberCard>
    </PodScreen>
  )
}
