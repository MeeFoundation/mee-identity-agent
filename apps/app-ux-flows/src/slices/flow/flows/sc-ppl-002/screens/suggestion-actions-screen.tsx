import { useAtomValue, useSetAtom, useStore } from 'jotai'
import { useLayoutEffect } from 'react'
import { Copy, type Icon, PlusLg, Trash3 } from 'react-bootstrap-icons'
import { Trans, useTranslation } from 'react-i18next'

import { copyToClipboard } from '../../../pods/people/components/invite-link-field'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { MyInfoView } from '../components/my-info-view'
import { useMemberName } from '../components/use-member-name'
import {
  adoptDetailAtom,
  copyDetailAtom,
  removeDetailAtom,
  type ScPpl002Components,
  type ScPpl002ScreenId,
  selectedDetailAtom,
} from '../model'

const sharedByKey = (daysAgo: number) => {
  if (daysAgo === 0) return 'flows.scPpl002.suggestionActions.sharedToday'
  if (daysAgo === 1) return 'flows.scPpl002.suggestionActions.sharedYesterday'
  return 'flows.scPpl002.suggestionActions.sharedDaysAgo'
}

type SheetActionProps = {
  icon: Icon
  label: string
  onClick: () => void
  destructive?: boolean
}

const SheetAction = ({ icon: ActionIcon, label, onClick, destructive = false }: SheetActionProps) => {
  const { Button } = useFlowComponents<ScPpl002Components>()

  return (
    <Button
      className="w-full justify-start gap-2.5 px-1.5 font-semibold"
      onClick={onClick}
      size="l"
      tone={destructive ? 'danger' : 'tertiary'}
      variant="link"
    >
      <ActionIcon aria-hidden className="shrink-0" size={22} />
      {label}
    </Button>
  )
}

export const SuggestionActionsScreen = () => {
  const { t } = useTranslation()
  const { BottomSheet } = useFlowComponents<ScPpl002Components>()
  const { complete, goToScreen } = useFlowNavigation<ScPpl002ScreenId>()
  const store = useStore()
  const detail = useAtomValue(selectedDetailAtom)
  const copyDetail = useSetAtom(copyDetailAtom)
  const adoptDetail = useSetAtom(adoptDetailAtom)
  const removeDetail = useSetAtom(removeDetailAtom)
  const memberName = useMemberName()

  // Only on arrival: once acted on, the detail is gone while this screen is still on its way out.
  useLayoutEffect(() => {
    if (!store.get(selectedDetailAtom)) goToScreen('my-info')
  }, [store, goToScreen])

  if (!detail) return <MyInfoView />

  const field = t(`pods.people.memberInfo.fields.${detail.field}`)

  const copy = () => {
    copyToClipboard(detail.value)
    copyDetail()
    goToScreen('my-info')
  }

  const add = () => {
    if (adoptDetail() === 'conflict') {
      goToScreen('adopt-conflict')
      return
    }
    goToScreen('my-info')
    complete({ showCompletionView: false })
  }

  const remove = () => {
    removeDetail()
    goToScreen('my-info')
    complete({ showCompletionView: false })
  }

  return (
    <>
      <MyInfoView />
      <BottomSheet
        description={t(sharedByKey(detail.addedDaysAgo), {
          count: detail.addedDaysAgo,
          name: memberName(detail.addedBy),
        })}
        onDismiss={() => goToScreen('my-info')}
        title={
          <Trans
            components={{ bold: <strong className="font-bold" /> }}
            i18nKey="flows.scPpl002.suggestionActions.title"
            values={{ field, value: detail.value }}
          />
        }
      >
        <div className="flex flex-col gap-6">
          <SheetAction icon={Copy} label={t('flows.scPpl002.suggestionActions.copy')} onClick={copy} />
          <SheetAction icon={PlusLg} label={t('flows.scPpl002.suggestionActions.add')} onClick={add} />
          <SheetAction
            destructive
            icon={Trash3}
            label={t('flows.scPpl002.suggestionActions.remove')}
            onClick={remove}
          />
        </div>
      </BottomSheet>
    </>
  )
}
