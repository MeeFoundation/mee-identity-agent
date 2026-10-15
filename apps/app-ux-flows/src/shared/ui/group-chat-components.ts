import { ChatThread } from './chat-thread'
import { ChatTypingIndicator } from './chat-typing-indicator'
import { ChatEmptyState, ChatNotice, GroupChatComposer, GroupChatMessage } from './group-chat'

export const groupChatComponents = {
  ChatEmptyState,
  ChatNotice,
  ChatThread,
  ChatTypingIndicator,
  GroupChatComposer,
  GroupChatMessage,
}

export type GroupChatComponents = typeof groupChatComponents
