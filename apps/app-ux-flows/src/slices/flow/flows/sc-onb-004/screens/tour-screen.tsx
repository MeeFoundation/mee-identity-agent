import { ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useFlowComponents, useFlowNavigation, useFlowScreen } from '../../../runtime/flow-context'
import type { ScOnb004Components, ScOnb004ScreenId } from '../model'
import { PodAnythingScene } from './pod-anything-scene'
import { ShareOnceScene } from './share-once-scene'
import { FlowPage, Wordmark } from './shell'
import { YoursToKeepScene } from './yours-to-keep-scene'

const BEATS = ['pod-anything', 'share-once', 'yours-to-keep'] as const

type BeatId = (typeof BEATS)[number]

const isBeat = (id: ScOnb004ScreenId): id is BeatId => (BEATS as readonly string[]).includes(id)

export const TourScreen = () => {
  const { t } = useTranslation()
  const { Button } = useFlowComponents<ScOnb004Components>()
  const screenId = useFlowScreen<ScOnb004ScreenId>()
  const { goToScreen } = useFlowNavigation<ScOnb004ScreenId>()
  const key = (path: string) => `flows.scOnb004.${path}`
  const beat = isBeat(screenId) ? screenId : 'pod-anything'
  const index = BEATS.indexOf(beat)
  const last = index === BEATS.length - 1

  const back = () => goToScreen(index <= 0 ? 'landing' : (BEATS[index - 1] ?? 'landing'))
  const next = () => goToScreen(last ? 'setup' : (BEATS[index + 1] ?? 'setup'))

  return (
    <FlowPage
      footer={
        <Button className="w-full" onClick={next}>
          {last ? t(key('actions.gotIt')) : t(key('actions.next'))}
        </Button>
      }
      top={
        <header className="grid min-h-11 shrink-0 grid-cols-[1fr_auto_1fr] items-center px-6 pt-4">
          <button
            className="flex min-h-11 items-center gap-1 justify-self-start rounded-xl text-gray-600"
            onClick={back}
            type="button"
          >
            <ChevronLeft aria-hidden className="size-5" />
            {t(key('actions.back'))}
          </button>
          <Wordmark />
          {last ? (
            <span aria-hidden />
          ) : (
            <span className="justify-self-end">
              <Button onClick={() => goToScreen('setup')} size="s" tone="tertiary">
                {t(key('actions.skip'))}
              </Button>
            </span>
          )}
        </header>
      }
    >
      <div className="my-auto flex flex-col items-center">
        {beat === 'pod-anything' ? <PodAnythingScene /> : null}
        {beat === 'share-once' ? <ShareOnceScene /> : null}
        {beat === 'yours-to-keep' ? <YoursToKeepScene /> : null}
        <div
          aria-label={t(key('pager'), { current: index + 1, total: BEATS.length })}
          className="mt-6 flex justify-center gap-1.5"
          role="img"
        >
          {BEATS.map((id, i) => (
            <span
              className={`h-1.5 rounded-full ${i === index ? 'w-5 bg-brand-700' : 'w-1.5 bg-gray-300'}`}
              key={id}
            />
          ))}
        </div>
      </div>
    </FlowPage>
  )
}
