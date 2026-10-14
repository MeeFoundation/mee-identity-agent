import { useAtomValue, useSetAtom, useStore } from 'jotai'
import { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { isMultiValue } from '../../../pods/people/member-info'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { MyInfoView } from '../components/my-info-view'
import { useMemberName } from '../components/use-member-name'
import {
  keepBothAtom,
  replaceDetailAtom,
  type ScPpl002Components,
  type ScPpl002ScreenId,
  selectedConflictAtom,
} from '../model'

type ValueRowProps = {
  label: string
  value: string
}

const ValueRow = ({ label, value }: ValueRowProps) => (
  <div className="flex flex-col py-3">
    <dt className="-mb-0.5 text-gray-600 text-xs">{label}</dt>
    <dd className="break-all font-medium text-base text-gray-800">{value}</dd>
  </div>
)

export const AdoptConflictScreen = () => {
  const { t } = useTranslation()
  const { BottomSheet, Button } = useFlowComponents<ScPpl002Components>()
  const { complete, goToScreen } = useFlowNavigation<ScPpl002ScreenId>()
  const store = useStore()
  const conflict = useAtomValue(selectedConflictAtom)
  const keepBoth = useSetAtom(keepBothAtom)
  const replaceDetail = useSetAtom(replaceDetailAtom)
  const memberName = useMemberName()

  // Only on arrival: once resolved, the conflict is gone while this screen is still on its way out.
  useLayoutEffect(() => {
    if (!store.get(selectedConflictAtom)) goToScreen('my-info')
  }, [store, goToScreen])

  if (!conflict) return <MyInfoView />

  const { added, yours } = conflict

  const resolve = (apply: () => void) => {
    apply()
    goToScreen('my-info')
    complete({ showCompletionView: false })
  }

  const cancel = () => goToScreen('my-info')

  return (
    <>
      <MyInfoView />
      <BottomSheet onDismiss={cancel} title={t(`flows.scPpl002.adoptConflict.title.${added.field}`)}>
        <div className="flex flex-col gap-6">
          <dl className="flex flex-col divide-y divide-gray-100 rounded-2xl px-4 shadow-card">
            <ValueRow label={t('flows.scPpl002.adoptConflict.yours')} value={yours.value} />
            <ValueRow
              label={t('flows.scPpl002.adoptConflict.addedBy', { name: memberName(added.addedBy) })}
              value={added.value}
            />
          </dl>
          <div className="flex flex-col gap-2">
            {isMultiValue(added.field) && (
              <Button onClick={() => resolve(keepBoth)} size="l">
                {t('flows.scPpl002.adoptConflict.keepBoth')}
              </Button>
            )}
            <Button
              className="h-auto min-h-11 break-all py-2"
              onClick={() => resolve(replaceDetail)}
              size="l"
              tone="secondary"
              variant="outlined"
            >
              {t('flows.scPpl002.adoptConflict.replace', { value: yours.value })}
            </Button>
            <Button onClick={cancel} size="l" tone="tertiary" variant="outlined">
              {t('flows.scPpl002.adoptConflict.cancel')}
            </Button>
          </div>
        </div>
      </BottomSheet>
    </>
  )
}
