import { useAtomValue } from 'jotai'
import { ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import type { ScOnb004Components, ScOnb004ScreenId } from '../model'
import { skippedTourAtom } from '../model'
import { prefersReducedMotion } from '../motion'
import { ActionStack, FlowPage, Wordmark } from './shell'

export const SetupScreen = () => {
  const { t } = useTranslation()
  const { Button } = useFlowComponents<ScOnb004Components>()
  const { goToScreen } = useFlowNavigation<ScOnb004ScreenId>()
  const skipped = useAtomValue(skippedTourAtom)
  const key = (path: string) => `flows.scOnb004.${path}`
  const reduced = prefersReducedMotion()

  return (
    <FlowPage
      footer={
        <ActionStack>
          <Button onClick={() => goToScreen('profile-choose')}>{t(key('actions.setupThisPhone'))}</Button>
          <Button onClick={() => goToScreen('pairing')} tone="secondary" variant="link">
            {t(key('actions.pairOtherDevice'))}
          </Button>
        </ActionStack>
      }
      top={
        <div className="flex items-center px-6 pt-4">
          <button
            className="flex min-h-11 items-center gap-1 text-gray-600"
            onClick={() => goToScreen(skipped ? 'landing' : 'yours-to-keep')}
            type="button"
          >
            <ChevronLeft aria-hidden className="size-5" />
            {t(key('actions.back'))}
          </button>
        </div>
      }
    >
      <Wordmark />
      <h1 className="mt-8 text-pretty font-semibold text-3xl text-gray-900">{t(key('setup.headline'))}</h1>
      <p className="mt-3 text-pretty text-gray-600">{t(key('setup.subline'))}</p>
      <div className="flex flex-1 items-center justify-center py-8">
        <div className={reduced ? '' : 'animate-onb-rise'}>
          <div className="flex h-44 w-28 flex-col items-center justify-center rounded-[28px] bg-white shadow-sm">
            <span className="grid size-12 place-items-center rounded-xl bg-brand-700">
              <span className="size-5 rounded-md bg-brand-50 ring-2 ring-brand-700" />
            </span>
            <span className="mt-2 font-medium text-brand-700 text-sm">Tellipod</span>
          </div>
        </div>
      </div>
    </FlowPage>
  )
}
