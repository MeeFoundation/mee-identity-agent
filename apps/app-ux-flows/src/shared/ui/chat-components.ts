import { ChatComposer } from './chat-composer'
import { ChatAgentBubble, ChatMessage } from './chat-message'
import { ChatMessageStatus } from './chat-message-status'
import { ChatSuggestionChip } from './chat-suggestion-chip'
import { ChatThread } from './chat-thread'
import { ChatTypingIndicator } from './chat-typing-indicator'

export const chatComponents = {
  ChatAgentBubble,
  ChatComposer,
  ChatMessage,
  ChatMessageStatus,
  ChatSuggestionChip,
  ChatThread,
  ChatTypingIndicator,
}

export type ChatComponents = typeof chatComponents
