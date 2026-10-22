import type { FC } from 'react'
import { TouchableOpacity, type TouchableOpacityProps, View, type ViewProps } from 'react-native'
import type { O } from 'ts-toolbelt'

import { cn } from '@/shared/lib/styling'
import { IconSymbol, type IconSymbolProps } from '@/shared/ui/IconSymbol'
import { Typography } from '@/shared/ui/Typography'

/* -------------------------------------------------------------------------------------------------
 * ChatAttachmentIcon
 * -----------------------------------------------------------------------------------------------*/
type ChatAttachmentIconProps = O.Optional<IconSymbolProps, 'name'>

const ChatAttachmentIcon: FC<ChatAttachmentIconProps> = ({
  name = 'document.outlined',
  width = 24,
  height = 24,
  ...rest
}) => (
  <View>
    <IconSymbol height={height} name={name} width={width} {...rest} />
  </View>
)

/* -------------------------------------------------------------------------------------------------
 * ChatAttachmentContent
 * -----------------------------------------------------------------------------------------------*/
type ChatAttachmentContentProps = ViewProps & {
  name: string
  tip?: string
}

const ChatAttachmentContent: FC<ChatAttachmentContentProps> = ({ name, tip, ...rest }) => (
  <View style={{ flex: 1 }} {...rest}>
    <Typography className="text-base text-gray-800" numberOfLines={1}>
      {name}
    </Typography>
    {!tip ? null : (
      <Typography className="font-italic text-gray-900 text-sm opacity-65" numberOfLines={1}>
        {tip}
      </Typography>
    )}
  </View>
)

/* -------------------------------------------------------------------------------------------------
 * ChatAttachmentAction
 * -----------------------------------------------------------------------------------------------*/
type ChatAttachmentActionProps = IconSymbolProps

const ChatAttachmentAction: FC<ChatAttachmentActionProps> = ({ width = 24, height = 24, ...rest }) => {
  const Component = rest.onPress ? TouchableOpacity : View

  return (
    <Component onPress={rest.onPress}>
      <IconSymbol height={height} width={width} {...rest} />
    </Component>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ChatAttachment
 * -----------------------------------------------------------------------------------------------*/
type ChatAttachmentProps = ViewProps & Pick<TouchableOpacityProps, 'onPress'>

const ChatAttachment: FC<ChatAttachmentProps> = ({ className, ...rest }) => {
  const rootClassName = cn('w-full flex-row gap-1 rounded-md border border-gray-200 bg-gray-100 px-2.5 py-2', className)

  if (rest.onPress) {
    return <TouchableOpacity className={rootClassName} {...rest} />
  }

  return <View className={rootClassName} {...rest} />
}

/* -----------------------------------------------------------------------------------------------*/

export {
  ChatAttachment as Root,
  ChatAttachmentIcon as Icon,
  ChatAttachmentAction as Action,
  ChatAttachmentContent as Content,
}

export { ChatAttachment, ChatAttachmentIcon, ChatAttachmentAction, ChatAttachmentContent }

export type { ChatAttachmentProps, ChatAttachmentIconProps, ChatAttachmentActionProps, ChatAttachmentContentProps }
