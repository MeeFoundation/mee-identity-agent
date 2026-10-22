import { type FC, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Share, TouchableOpacity, View } from 'react-native'
import ParsedText, { type ParseShape } from 'react-native-parsed-text'

import { resolveAttachmentIcon } from '@/features/upload'

import type { Attachment, UserMessage } from '@/entities/chat'

import { useFormattedTime } from '@/shared/lib/date-time'
import { cn } from '@/shared/lib/styling'
import { DropdownMenu, type DropdownMenuItem } from '@/shared/ui/DropdownMenu'
import { Typography } from '@/shared/ui/Typography'

import { getAttachmentTip } from '../lib/get-attachment-tip'
import * as ChatAttachment from './ChatAttachement'
import { useChatContext } from './ChatProvider'

const WWW_URL_PATTERN = /^www\./i

/* -------------------------------------------------------------------------------------------------
 * ChatBubbleText
 * -----------------------------------------------------------------------------------------------*/
type ChatBubbleTextProps = {
  position: 'left' | 'right'
  text: string
}

const ChatBubbleText: FC<ChatBubbleTextProps> = (props) => {
  // TODO add error handling
  const onUrlPress = useCallback((url: string) => {
    // When someone sends a message that includes a website address beginning with "www." (omitting the scheme),
    // react-native-parsed-text recognizes it as a valid url, but Linking fails to open due to the missing scheme.
    if (WWW_URL_PATTERN.test(url)) onUrlPress(`https://${url}`)
    else
      Linking.openURL(url).catch((e) => {
        console.error(e, 'No handler for URL:', url)
      })
  }, [])

  // TODO add error handling
  const onPhonePress = useCallback((_phone: string) => {
    // const options = ['Call', 'Text', 'Cancel']
    // const cancelButtonIndex = options.length - 1
    // FIXME add action sheet
    // actionSheet().showActionSheetWithOptions({ cancelButtonIndex, options }, (buttonIndex) => {
    //   switch (buttonIndex) {
    //     case 0:
    //       Linking.openURL(`tel:${phone}`).catch((e) => {
    //         console.error(e, 'No handler for telephone')
    //       })
    //       break
    //     case 1:
    //       Linking.openURL(`sms:${phone}`).catch((e) => {
    //         console.error(e, 'No handler for text')
    //       })
    //       break
    //   }
    // })
  }, [])

  // TODO add error handling
  const onEmailPress = useCallback(
    (email: string) => Linking.openURL(`mailto:${email}`).catch((e) => console.error(e, 'No handler for mailto')),
    [],
  )

  const linkClassName = cn('underline', props.position === 'left' ? 'text-primary' : 'text-white')

  const parse: ParseShape[] = useMemo(
    () => [
      { className: linkClassName, onPress: onUrlPress, type: 'url' },
      { className: linkClassName, onPress: onPhonePress, type: 'phone' },
      { className: linkClassName, onPress: onEmailPress, type: 'email' },
    ],
    [linkClassName, onUrlPress, onPhonePress, onEmailPress],
  )

  const textClassName = cn('font-publicSans text-base', props.position === 'left' ? 'text-gray-900' : 'text-white')

  return (
    <ParsedText childrenProps={{ className: textClassName }} parse={parse}>
      {props.text}
    </ParsedText>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ChatBubbleTIme
 * -----------------------------------------------------------------------------------------------*/
type ChatBubbleTimeProps = {
  message: UserMessage
  position: 'left' | 'right'
}

const ChatBubbleTime: FC<ChatBubbleTimeProps> = (props) => {
  const formattedTime = useFormattedTime(props.message.createdAt)

  return (
    <Typography className={cn('text-xs opacity-65', props.position === 'left' ? 'text-gray-900' : 'text-white')}>
      {formattedTime}
    </Typography>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ChatBubbleUsername
 * -----------------------------------------------------------------------------------------------*/
type ChatBubbleUsernameProps = {
  message: UserMessage
  position: 'left' | 'right'
}

const ChatBubbleUsername: FC<ChatBubbleUsernameProps> = (props) => (
  <Typography className="mb-1.5 font-semibold text-primary text-xs">
    {props.message.user.name} {props.position === 'left' ? <ChatBubbleTime {...props} /> : null}
  </Typography>
)

/* -------------------------------------------------------------------------------------------------
 * ChatBubbleAttachments
 * -----------------------------------------------------------------------------------------------*/
type ChatBubbleAttachmentsProps = {
  className?: string
  position: 'left' | 'right'
  attachments: Attachment[]
}

const ChatBubbleAttachments: FC<ChatBubbleAttachmentsProps> = ({ attachments, className, position }) => {
  const handleDownload = useCallback(async (attachment: Attachment) => {
    try {
      await Share.share({ url: attachment.url })
    } catch (error) {
      console.error('Error sharing', error)
    }
  }, [])

  return (
    <View className={cn('min-w-full gap-1', className)}>
      {attachments.map((attachment, index) => (
        <ChatAttachment.Root key={`${attachment.url}-${index}`} onPress={() => handleDownload(attachment)}>
          <ChatAttachment.Icon name={resolveAttachmentIcon(attachment.url, attachment.type)} />
          <ChatAttachment.Content name={attachment.fileName ?? attachment.url} tip={getAttachmentTip(attachment)} />
          {position === 'left' ? (
            <ChatAttachment.Action className="text-blue-700" name="arrow-down-tray.outlined" />
          ) : null}
        </ChatAttachment.Root>
      ))}
    </View>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ChatBubbleReply
 * -----------------------------------------------------------------------------------------------*/
type ChatBubbleReplyProps = {
  message: UserMessage
  position: 'left' | 'right'
}

const ChatBubbleReply: FC<ChatBubbleReplyProps> = (props) => {
  const { onRepliedToPress } = useChatContext()

  const Component = onRepliedToPress ? TouchableOpacity : View

  const handlePress = useCallback(() => {
    onRepliedToPress?.(props.message.id)
  }, [onRepliedToPress, props.message.id])

  return (
    <Component className="-mb-2 max-w-[90%] rounded-[10px] bg-white px-4 py-2.5" onPress={handlePress}>
      <Typography className="text-gray-800 text-xs" numberOfLines={2}>
        {props.message.text}
      </Typography>
    </Component>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ChatBubble
 * -----------------------------------------------------------------------------------------------*/
type ChatBubbleProps = {
  message: UserMessage
  position: 'left' | 'right'
  className?: string
}

const ChatBubble: FC<ChatBubbleProps> = ({ message, position, className }) => {
  const { t: chatT } = useTranslation('chat')
  const { setReplyToMessageId } = useChatContext()

  const attachnetsEl = !message.attachments?.length ? null : (
    <ChatBubbleAttachments attachments={message.attachments} className="mb-1.5" position={position} />
  )

  const replyEl = message.replyTo ? <ChatBubbleReply message={message.replyTo} position={position} /> : null

  const handleSelectForReply = useCallback(() => {
    setReplyToMessageId(message.id)
  }, [setReplyToMessageId, message.id])

  const menuItems = useMemo<DropdownMenuItem[]>(
    () => [{ id: 'reply', onSelect: handleSelectForReply, title: chatT('bubble_actions.reply.text') }],
    [chatT, handleSelectForReply],
  )

  return (
    <View className={cn(position === 'left' ? 'items-start' : 'items-end', className)}>
      {replyEl}

      <DropdownMenu
        className={cn(
          'rounded-[10] px-3 py-2',
          position === 'left' ? 'max-w-full border border-black/7 bg-white' : 'max-w-[80%] bg-primary',
        )}
        items={menuItems}
      >
        {/* render username for incomming messages only  */}
        {position !== 'left' ? null : <ChatBubbleUsername message={message} position={position} />}

        {/* render attachments for outgoing full-width */}
        {position !== 'right' ? null : attachnetsEl}

        <View className="flex-row items-end gap-2.5">
          <View className="shrink">
            {
              <>
                {position !== 'left' ? null : attachnetsEl}
                {!message.text ? null : <ChatBubbleText position={position} text={message.text} />}
              </>
            }
          </View>

          {position === 'right' ? (
            <View>
              <ChatBubbleTime message={message} position={position} />
            </View>
          ) : null}
        </View>
      </DropdownMenu>
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { ChatBubble }

export type { ChatBubbleProps }
