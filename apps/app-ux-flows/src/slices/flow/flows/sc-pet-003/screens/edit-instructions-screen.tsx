import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { careInstructionsAtom } from '../../../pods/ginger/feeding'
import { podAtom } from '../../../pods/ginger/model'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { CareFeedingFlowView } from '../components/care-feeding-flow-view'
import { goalAtom, isOwnerAtom, type ScPet003Components, toastAtom } from '../model'

export const EditInstructionsScreen = () => {
  const { t } = useTranslation()
  const { Button, PodScreen } = useFlowComponents<ScPet003Components>()
  const { back, complete } = useFlowNavigation()
  const [instructions, setInstructions] = useAtom(careInstructionsAtom)
  const goal = useAtomValue(goalAtom)
  const isOwner = useAtomValue(isOwnerAtom)
  const pod = useAtomValue(podAtom)
  const setToast = useSetAtom(toastAtom)
  const [draft, setDraft] = useState(instructions)

  // Only the owner changes the instructions, even when the editor is reached by URL.
  if (!isOwner) return <CareFeedingFlowView />

  const save = () => {
    setInstructions(draft.trim())
    setToast({ kind: 'saved' })
    // Opened from Care & Feeding: stepping back keeps the editor out of the history behind it.
    back()
    if (goal === 'write') complete({ showCompletionView: false })
  }

  return (
    <PodScreen
      topBar={
        <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-b-3xl bg-white px-3 pt-(--status-bar-h) pb-2.5 shadow-card">
          <Button className="justify-self-start" onClick={back} size="s" tone="tertiary" variant="link">
            {t('flows.scPet003.edit.cancel')}
          </Button>
          <h1 className="min-h-11 content-center text-center font-semibold text-gray-900 text-lg">
            {t('flows.scPet003.edit.title')}
          </h1>
          <Button
            className="justify-self-end"
            disabled={draft.trim().length === 0}
            onClick={save}
            size="s"
            tone="primary"
            variant="link"
          >
            {t('flows.scPet003.edit.save')}
          </Button>
        </header>
      }
    >
      <textarea
        aria-label={t('flows.scPet003.edit.title')}
        className="min-h-64 flex-1 resize-none rounded-2xl bg-white p-4 text-base text-gray-800 caret-brand-700 shadow-card outline-none placeholder:text-gray-500 focus-visible:ring-3 focus-visible:ring-ring"
        onChange={(event) => setDraft(event.target.value)}
        placeholder={t('flows.scPet003.edit.placeholder', { name: pod.name })}
        value={draft}
      />
    </PodScreen>
  )
}
