import { useAtomValue, useSetAtom, useStore } from 'jotai'
import { useLayoutEffect } from 'react'
import { ChatFill, Copy, EnvelopeFill, type Icon } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { copyToClipboard, InviteLinkField } from '../../../pods/people/components/invite-link-field'
import { formatShortDate, inviteExpiresOn } from '../../../pods/people/sharing'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { MembersView } from '../components/members-view'
import { SheetTitle } from '../components/sheet-title'
import {
  markInviteSentAtom,
  type ScPpl002Components,
  type ScPpl002ScreenId,
  selectedInviteAtom,
  todayAtom,
} from '../model'
import { cn } from '@/shared/lib/cn'

type ShareTarget = 'messages' | 'mail' | 'copy'

const shareTargets: readonly { id: ShareTarget; icon: Icon; tileClassName: string }[] = [
  { icon: ChatFill, id: 'messages', tileClassName: 'bg-linear-to-b from-[#67e86f] to-[#2fc742] text-white' },
  { icon: EnvelopeFill, id: 'mail', tileClassName: 'bg-linear-to-b from-[#3e9cfd] to-[#1d6ff2] text-white' },
  { icon: Copy, id: 'copy', tileClassName: 'bg-gray-100 text-gray-800' },
]

export const InviteShareScreen = () => {
  const { t, i18n } = useTranslation()
  const { BottomSheet } = useFlowComponents<ScPpl002Components>()
  const { complete, goToScreen } = useFlowNavigation<ScPpl002ScreenId>()
  const store = useStore()
  const invite = useAtomValue(selectedInviteAtom)
  const today = useAtomValue(todayAtom)
  const markInviteSent = useSetAtom(markInviteSentAtom)

  // Only on arrival: a new run opened at this screen has no invite to share.
  useLayoutEffect(() => {
    if (!store.get(selectedInviteAtom)) goToScreen('members')
  }, [store, goToScreen])

  if (!invite) return <MembersView />

  const share = (target: ShareTarget) => {
    if (target === 'copy') copyToClipboard(invite.link)
    markInviteSent()
    goToScreen('members')
    complete({ showCompletionView: false })
  }

  return (
    <>
      <MembersView />
      <BottomSheet
        description={t('flows.scPpl002.share.description', {
          date: formatShortDate(inviteExpiresOn(invite, today), i18n.language),
          name: invite.name,
        })}
        onDismiss={() => goToScreen('members')}
        title={<SheetTitle i18nKey="flows.scPpl002.share.title" values={{ name: invite.name }} />}
      >
        <div className="flex flex-col gap-6">
          <InviteLinkField link={invite.link} />
          <ul aria-label={t('flows.scPpl002.share.targets')} className="grid grid-cols-4 gap-2">
            {shareTargets.map(({ id, icon: TargetIcon, tileClassName }) => (
              <li key={id}>
                <button
                  className="group flex w-full cursor-pointer flex-col items-center gap-1.5 rounded-xl py-1 outline-none focus-visible:ring-3 focus-visible:ring-ring"
                  onClick={() => share(id)}
                  type="button"
                >
                  <span
                    className={cn(
                      'flex size-15 items-center justify-center rounded-2xl transition-[filter] group-hover:brightness-95',
                      tileClassName,
                    )}
                  >
                    <TargetIcon aria-hidden size={28} />
                  </span>
                  <span className="text-gray-900 text-xs">{t(`flows.scPpl002.share.target.${id}`)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </BottomSheet>
    </>
  )
}
