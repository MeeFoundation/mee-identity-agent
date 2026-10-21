import { useAtomValue } from 'jotai'
import { ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { profileAtom, type ScOnb004Components, type ScOnb004ScreenId } from '../model'
import { prefersReducedMotion } from '../motion'
import { ActionStack, FlowPage } from './shell'

export const DevicesScreen = () => {
  const { t } = useTranslation()
  const { Button } = useFlowComponents<ScOnb004Components>()
  const { complete, goToScreen } = useFlowNavigation<ScOnb004ScreenId>()
  const firstName = useAtomValue(profileAtom).firstName.trim()
  const key = (path: string) => `flows.scOnb004.${path}`
  const reduced = prefersReducedMotion()

  return (
    <FlowPage
      footer={
        <ActionStack>
          <Button onClick={() => goToScreen('pairing')} tone="secondary">
            {t(key('actions.pairAnother'))}
          </Button>
          <Button
            onClick={() => {
              goToScreen('next')
              complete({ showCompletionView: false })
            }}
            variant="link"
          >
            {t(key('actions.later'))}
          </Button>
          <p className="text-center text-gray-500 text-sm">{t(key('devices.laterNote'))}</p>
        </ActionStack>
      }
      top={
        <div className="px-6 pt-4">
          <button
            className="flex min-h-11 items-center gap-1 text-gray-600"
            onClick={() => goToScreen('profile-form')}
            type="button"
          >
            <ChevronLeft aria-hidden className="size-5" />
            {t(key('actions.back'))}
          </button>
        </div>
      }
    >
      <h1 className="text-pretty font-semibold text-2xl text-gray-900">{t(key('devices.headline'))}</h1>
      <p className="mt-2 text-pretty text-gray-600">{t(key('devices.subline'))}</p>
      <div className={`mt-10 flex items-center justify-center gap-4 ${reduced ? '' : 'animate-onb-rise'}`}>
        <div className="flex flex-col items-center gap-2">
          <div className="h-28 w-16 rounded-[18px] bg-white shadow-sm" />
          <span className="text-gray-800 text-xs">{t(key('devices.thisPhone'), { name: firstName || 'You' })}</span>
        </div>
        <span className="grid size-8 place-items-center rounded-full bg-brand-100 text-brand-700">↻</span>
        <div className="flex flex-col items-center gap-2">
          <div className="h-24 w-20 rounded-[18px] border border-gray-300 border-dashed bg-brand-50" />
          <span className="text-gray-800 text-xs">{t(key('devices.otherDevices'))}</span>
        </div>
      </div>
    </FlowPage>
  )
}
