import { useAtomValue, useSetAtom, useStore } from 'jotai'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { bogdan, memberInitial } from '../../../pods/people/sharing'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { SharedPodTopBar } from '../components/shared-pod-top-bar'
import {
  type ChatEntry,
  chatAtom,
  goalAtom,
  type ScPpl003Components,
  scheduleReply,
  sendMessageAtom,
  telliTypingAtom,
} from '../model'
import telliAssistantIcon from '@/shared/ui/icons/telli-assistant.svg'

type Message = Extract<ChatEntry, { kind: 'message' }>

export const ChatScreen = () => {
  const { t, i18n } = useTranslation()
  const { ChatNotice, ChatThread, ChatTypingIndicator, GroupChatComposer, GroupChatMessage, PodScreen } =
    useFlowComponents<ScPpl003Components>()
  const { complete } = useFlowNavigation()
  const store = useStore()
  const chat = useAtomValue(chatAtom)
  const telliTyping = useAtomValue(telliTypingAtom)
  const sendMessage = useSetAtom(sendMessageAtom)
  const [draft, setDraft] = useState('')

  const authorOf = (message: Message) => {
    if (message.author === 'me') return null
    if (message.author === 'telli')
      return { avatar: { icon: telliAssistantIcon }, name: t('pods.people.sharing.telli') }
    return { avatar: { letter: memberInitial(bogdan.name) }, name: bogdan.name }
  }

  const timeOf = (date: Date) => new Intl.DateTimeFormat(i18n.language, { timeStyle: 'short' }).format(date)

  const send = () => {
    sendMessage(draft, new Date())
    scheduleReply(store, draft, (fromPod) => {
      if (fromPod && store.get(goalAtom) === 'telli') complete({ showCompletionView: false })
    })
    setDraft('')
  }

  return (
    <PodScreen topBar={<SharedPodTopBar tab="chat" />}>
      <ChatThread label={t('flows.scPpl003.chat.threadLabel')}>
        {chat.map((entry) => {
          if (entry.kind === 'day') return <ChatNotice key={entry.id}>{t(entry.labelKey)}</ChatNotice>
          if (entry.kind === 'joined')
            return (
              <ChatNotice key={entry.id}>
                <Trans
                  components={{ bold: <strong className="font-semibold text-brand-700" /> }}
                  i18nKey="flows.scPpl003.chat.joined"
                  values={{ name: entry.name }}
                />
              </ChatNotice>
            )
          return (
            <GroupChatMessage author={authorOf(entry)} key={entry.id} time={timeOf(entry.sentAt)}>
              {'text' in entry ? entry.text : t(entry.textKey)}
            </GroupChatMessage>
          )
        })}
        {telliTyping && <ChatTypingIndicator label={t('flows.scPpl003.chat.telliTyping')} />}
      </ChatThread>
      <GroupChatComposer
        attachLabel={t('ui.groupChat.attach')}
        onChange={setDraft}
        onSend={send}
        placeholder={t('flows.scPpl003.chat.placeholder')}
        sendLabel={t('ui.groupChat.send')}
        value={draft}
      />
    </PodScreen>
  )
}
