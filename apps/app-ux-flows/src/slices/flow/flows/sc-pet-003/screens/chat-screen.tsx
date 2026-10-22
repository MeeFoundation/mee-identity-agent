import { useAtomValue, useSetAtom, useStore } from 'jotai'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { ScPet003TopBar } from '../components/sc-pet-003-top-bar'
import {
  alice,
  type ChatEntry,
  chatAtom,
  goalAtom,
  type ScPet003Components,
  type ScPet003ScreenId,
  scheduleReply,
  sendMessageAtom,
  telliTypingAtom,
  toastAtom,
} from '../model'
import telliAssistantIcon from '@/shared/ui/icons/telli-assistant.svg'

export const ChatScreen = () => {
  const { t, i18n } = useTranslation()
  const { ChatEmptyState, ChatThread, ChatTypingIndicator, GroupChatComposer, GroupChatMessage, PodScreen } =
    useFlowComponents<ScPet003Components>()
  const { complete, goToScreen } = useFlowNavigation<ScPet003ScreenId>()
  const store = useStore()
  const chat = useAtomValue(chatAtom)
  const telliTyping = useAtomValue(telliTypingAtom)
  const sendMessage = useSetAtom(sendMessageAtom)
  const setToast = useSetAtom(toastAtom)
  const [draft, setDraft] = useState('')

  const authorOf = (message: ChatEntry) => {
    if (message.author === 'me') return null
    if (message.author === 'telli')
      return { avatar: { icon: telliAssistantIcon }, name: t('pods.people.sharing.telli') }
    return { avatar: { letter: alice.name.charAt(0) }, name: alice.name }
  }

  const timeOf = (date: Date) => new Intl.DateTimeFormat(i18n.language, { timeStyle: 'short' }).format(date)

  // A toast from an earlier visit to Care & Feeding no longer applies.
  const openCareFeeding = () => {
    setToast(null)
    goToScreen('care-feeding')
  }

  const send = () => {
    sendMessage(draft, new Date())
    scheduleReply(store, draft, (fromPod) => {
      if (fromPod && store.get(goalAtom) === 'telli') complete({ showCompletionView: false })
    })
    setDraft('')
  }

  return (
    <PodScreen topBar={<ScPet003TopBar tab="chat" />}>
      <ChatThread
        empty={chat.length === 0 ? <ChatEmptyState /> : undefined}
        label={t('flows.scPet003.chat.threadLabel')}
      >
        {chat.map((entry) => (
          <GroupChatMessage author={authorOf(entry)} key={entry.id} time={timeOf(entry.sentAt)}>
            {'text' in entry ? (
              entry.text
            ) : (
              <Trans
                components={{
                  careFeeding: (
                    <button
                      className="cursor-pointer rounded-sm font-semibold text-brand-700 underline decoration-brand-300 underline-offset-2 outline-none focus-visible:ring-3 focus-visible:ring-ring"
                      onClick={openCareFeeding}
                      type="button"
                    />
                  ),
                }}
                i18nKey={entry.textKey}
              />
            )}
          </GroupChatMessage>
        ))}
        {telliTyping && <ChatTypingIndicator label={t('flows.scPet003.chat.telliTyping')} />}
      </ChatThread>
      <GroupChatComposer
        attachLabel={t('ui.groupChat.attach')}
        onChange={setDraft}
        onSend={send}
        placeholder={t('flows.scPet003.chat.placeholder')}
        sendLabel={t('ui.groupChat.send')}
        value={draft}
      />
    </PodScreen>
  )
}
