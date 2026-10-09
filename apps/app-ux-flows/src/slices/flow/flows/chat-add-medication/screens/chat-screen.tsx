import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { addMedicationFormAtom, medicationFormAddedAtom } from '../../../pods/ginger/model'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { ShowcaseTopBar } from '../components/showcase-top-bar'
import {
  type ChatAddMedicationComponents,
  type ChatAddMedicationScreenId,
  chatStageAtom,
  nextStage,
  sendMessageAtom,
} from '../model'

export const ChatScreen = () => {
  const { t } = useTranslation()
  const {
    ChatAgentBubble,
    ChatComposer,
    ChatMessage,
    ChatMessageStatus,
    ChatSuggestionChip,
    ChatThread,
    ChatTypingIndicator,
    PodScreen,
  } = useFlowComponents<ChatAddMedicationComponents>()
  const { goToScreen } = useFlowNavigation<ChatAddMedicationScreenId>()
  const [stage, setStage] = useAtom(chatStageAtom)
  const sendMessage = useSetAtom(sendMessageAtom)
  const medicationFormAdded = useAtomValue(medicationFormAddedAtom)
  const addMedicationForm = useSetAtom(addMedicationFormAtom)

  // Restarts the current step on return, so leaving the chat mid-exchange still ends with Telli's reply.
  useEffect(() => {
    const next = nextStage(stage)
    if (!next) return
    const timer = setTimeout(() => setStage(next.stage), next.afterMs)
    return () => clearTimeout(timer)
  }, [stage, setStage])

  const addMedication = () => {
    addMedicationForm()
    goToScreen('medication-added')
  }

  return (
    <PodScreen topBar={<ShowcaseTopBar tab="chat" />}>
      <ChatThread label={t('flows.chatAddMedication.chat.threadLabel')}>
        {stage !== 'draft' && (
          <>
            <ChatMessage author="user">{t('flows.chatAddMedication.chat.userMessage')}</ChatMessage>
            <ChatMessageStatus
              label={
                stage === 'sending' ? t('flows.chatAddMedication.chat.sending') : t('flows.chatAddMedication.chat.sent')
              }
            />
          </>
        )}
        {stage === 'typing' && <ChatTypingIndicator label={t('flows.chatAddMedication.chat.typing')} />}
        {stage === 'replied' && (
          <ChatMessage author="agent">
            <ChatAgentBubble>{t('flows.chatAddMedication.chat.telliReply')}</ChatAgentBubble>
            {!medicationFormAdded && (
              <ChatSuggestionChip label={t('flows.chatAddMedication.chat.addMedication')} onClick={addMedication} />
            )}
          </ChatMessage>
        )}
      </ChatThread>
      <ChatComposer
        onSend={sendMessage}
        placeholder={t('flows.chatAddMedication.chat.placeholder')}
        sendLabel={t('flows.chatAddMedication.chat.send')}
        value={stage === 'draft' ? t('flows.chatAddMedication.chat.userMessage') : ''}
      />
    </PodScreen>
  )
}
