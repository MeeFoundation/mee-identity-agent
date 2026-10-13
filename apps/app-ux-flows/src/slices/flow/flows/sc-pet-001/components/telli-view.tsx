import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import {
  conversationAtom,
  nextTelliStage,
  nextUserMessageAtom,
  type ScPet001Components,
  type ScPet001ScreenId,
  sendNextMessageAtom,
  telliProgressAtom,
} from '../model'
import { QuickActionCard } from './quick-action-card'
import { TelliTopBar } from './telli-top-bar'

// The global Telli chat; it plays whatever conversation the case defines.
export const TelliView = () => {
  const { t } = useTranslation()
  const {
    AppTabBar,
    ChatAgentBubble,
    ChatComposer,
    ChatMessage,
    ChatMessageStatus,
    ChatThread,
    ChatTypingIndicator,
    PodScreen,
  } = useFlowComponents<ScPet001Components>()
  const { goToScreen } = useFlowNavigation<ScPet001ScreenId>()
  const conversation = useAtomValue(conversationAtom)
  const [progress, setProgress] = useAtom(telliProgressAtom)
  const nextMessage = useAtomValue(nextUserMessageAtom)
  const sendNextMessage = useSetAtom(sendNextMessageAtom)
  const inFlight = progress.stage === 'idle' ? undefined : conversation[progress.turn]

  // Restarts the current step on return, so leaving mid-exchange still ends with Telli's reply.
  useEffect(() => {
    const next = nextTelliStage(progress)
    if (!next) return
    const timer = setTimeout(() => setProgress(next.progress), next.afterMs)
    return () => clearTimeout(timer)
  }, [progress, setProgress])

  return (
    <PodScreen
      bottomBar={
        <AppTabBar
          active="telli"
          onSelect={(tab) => {
            if (tab === 'home') goToScreen('home')
          }}
        />
      }
      topBar={<TelliTopBar />}
    >
      <ChatThread label={t('flows.scPet001.telli.threadLabel')}>
        <ChatMessage author="agent">
          <ChatAgentBubble>{t('flows.scPet001.telli.greeting')}</ChatAgentBubble>
        </ChatMessage>
        {conversation.slice(0, progress.turn).map((turn, index) => (
          <div className="flex flex-col gap-3" key={turn.userKey}>
            <ChatMessage author="user">{t(turn.userKey)}</ChatMessage>
            <ChatMessage author="agent">
              <ChatAgentBubble>{t(turn.replyKey, turn.replyValues)}</ChatAgentBubble>
              {turn.action && <QuickActionCard action={turn.action} turn={index} />}
            </ChatMessage>
          </div>
        ))}
        {inFlight && (
          <>
            <ChatMessage author="user">{t(inFlight.userKey)}</ChatMessage>
            <ChatMessageStatus
              label={progress.stage === 'sending' ? t('flows.scPet001.telli.sending') : t('flows.scPet001.telli.sent')}
            />
            {progress.stage === 'thinking' && <ChatTypingIndicator label={t('flows.scPet001.telli.thinking')} />}
          </>
        )}
      </ChatThread>
      <ChatComposer
        onSend={sendNextMessage}
        placeholder={t('flows.scPet001.telli.placeholder')}
        sendLabel={t('flows.scPet001.telli.send')}
        value={nextMessage ? t(nextMessage.userKey) : ''}
      />
    </PodScreen>
  )
}
