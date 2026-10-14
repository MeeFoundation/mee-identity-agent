import { useAtomValue } from 'jotai'

import { membersAtom } from '../model'

// A detail keeps who added it by member id; that person may have been removed from the pod since.
export const useMemberName = () => {
  const members = useAtomValue(membersAtom)
  return (memberId: string) => members.find((member) => member.id === memberId)?.name ?? memberId
}
