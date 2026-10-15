import { useAtomValue, useStore } from 'jotai'
import { useLayoutEffect } from 'react'

import { useFlowNavigation } from '../../../runtime/flow-context'
import { MemberInfoView } from '../components/member-info-view'
import { MembersView } from '../components/members-view'
import { type ScPpl002ScreenId, selectedMemberAtom } from '../model'

export const MemberDetailScreen = () => {
  const { goToScreen } = useFlowNavigation<ScPpl002ScreenId>()
  const store = useStore()
  const member = useAtomValue(selectedMemberAtom)

  // Only on arrival: a new run opened at this screen has no member selected.
  useLayoutEffect(() => {
    if (!store.get(selectedMemberAtom)) goToScreen('members')
  }, [store, goToScreen])

  return member ? <MemberInfoView memberId={member.id} showToast /> : <MembersView />
}
