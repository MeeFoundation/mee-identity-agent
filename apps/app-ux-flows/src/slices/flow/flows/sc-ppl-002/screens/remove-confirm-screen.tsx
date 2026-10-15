import { useAtomValue, useSetAtom, useStore } from 'jotai'
import { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { MemberInfoView } from '../components/member-info-view'
import { MembersView } from '../components/members-view'
import { SheetTitle } from '../components/sheet-title'
import { removeMemberAtom, type ScPpl002Components, type ScPpl002ScreenId, selectedMemberAtom } from '../model'

export const RemoveConfirmScreen = () => {
  const { t } = useTranslation()
  const { BottomSheet, Button } = useFlowComponents<ScPpl002Components>()
  const { back, complete, goToScreen } = useFlowNavigation<ScPpl002ScreenId>()
  const store = useStore()
  const member = useAtomValue(selectedMemberAtom)
  const removeMember = useSetAtom(removeMemberAtom)

  // Only on arrival: a new run opened at this screen has no member selected.
  useLayoutEffect(() => {
    if (!store.get(selectedMemberAtom)) goToScreen('members')
  }, [store, goToScreen])

  if (!member) return <MembersView />

  const remove = () => {
    removeMember()
    goToScreen('members')
    complete({ showCompletionView: false })
  }

  return (
    <>
      <MemberInfoView memberId={member.id} />
      <BottomSheet
        onDismiss={back}
        title={<SheetTitle i18nKey="flows.scPpl002.removeConfirm.title" values={{ name: member.name }} />}
      >
        <div className="flex flex-col gap-6">
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-base text-gray-700">
            <li>{t('flows.scPpl002.removeConfirm.noAccess', { name: member.name })}</li>
            <li>{t('flows.scPpl002.removeConfirm.messagesStay')}</li>
          </ul>
          <div className="flex flex-col gap-2">
            <Button onClick={remove} size="l" tone="danger">
              {t('flows.scPpl002.removeConfirm.confirm', { name: member.name })}
            </Button>
            <Button onClick={back} size="l" tone="tertiary" variant="outlined">
              {t('flows.scPpl002.removeConfirm.cancel')}
            </Button>
          </div>
        </div>
      </BottomSheet>
    </>
  )
}
