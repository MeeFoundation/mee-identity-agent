import { useAtomValue, useStore } from 'jotai'
import { useLayoutEffect } from 'react'

import { useFlowNavigation } from '../../../runtime/flow-context'
import { MemberDetailView } from '../components/member-detail-view'
import { MembersView } from '../components/members-view'
import { type ScPpl002ScreenId, selectedMemberAtom, todayAtom } from '../model'

export const MemberDetailScreen = () => {
  const { goToScreen } = useFlowNavigation<ScPpl002ScreenId>()
  const store = useStore()
  const member = useAtomValue(selectedMemberAtom)
  const today = useAtomValue(todayAtom)

  // Only on arrival: a new run opened at this screen has no member selected.
  useLayoutEffect(() => {
    if (!store.get(selectedMemberAtom)) goToScreen('members')
  }, [store, goToScreen])

  return member ? <MemberDetailView member={member} today={today} /> : <MembersView />
}
