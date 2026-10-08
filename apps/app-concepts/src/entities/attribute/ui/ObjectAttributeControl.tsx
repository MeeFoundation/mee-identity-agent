import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import type { ControlProps, ObjectAttributeSchema } from '../model/types'

/* -------------------------------------------------------------------------------------------------
 * ObjectAttributeControl
 * -----------------------------------------------------------------------------------------------*/
type ObjectAttributeControlProps = ControlProps<ObjectAttributeSchema>

const ObjectAttributeControl: FC<ObjectAttributeControlProps> = (props) => {
  const { t } = useTranslation()
  const isRoot = props.path.length === 0
  const label = isRoot ? '' : t(`attribute_${props.path.join('.')}.label`, { defaultValue: props.path.at(-1) ?? '' })

  if (isRoot) {
    return (
      <View>
        {Object.keys(props.schema.properties ?? {}).map((key) => (
          <View key={key}>{props.renderProperty?.(key)}</View>
        ))}
      </View>
    )
  }

  return (
    <View className="mt-3">
      <Text className="z-10 -mb-2 ml-2 self-start bg-white px-1 text-gray-600 text-xs">
        {label}
      </Text>
      <View className="rounded-lg border border-black/7 p-3">
        {Object.keys(props.schema.properties ?? {}).map((key) => (
          <View key={key}>{props.renderProperty?.(key)}</View>
        ))}
      </View>
    </View>
  )
}

/* -----------------------------------------------------------------------------------------------*/

export { ObjectAttributeControl }

export type { ObjectAttributeControlProps }
