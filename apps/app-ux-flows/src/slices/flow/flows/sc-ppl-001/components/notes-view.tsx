import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'

import { TidyNotesArea } from '../../../pods/notes/tidy-notes-area'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import {
  contactLinkLabelAtom,
  linkPulseAtom,
  noteBlocksAtom,
  type ScPpl001Components,
  type ScPpl001ScreenId,
  openTidyAtom,
  setBlockTextAtom,
  suggestionAtom,
} from '../model'
import { SofiaTopBar } from './sofia-top-bar'
import { useAnalysisTimer } from './use-analysis-timer'

type NotesViewProps = {
  screenId: Extract<ScPpl001ScreenId, 'notes' | 'notes-tidied'>
}

export const NotesView = ({ screenId }: NotesViewProps) => {
  const { PodScreen } = useFlowComponents<ScPpl001Components>()
  const { goToScreen } = useFlowNavigation<ScPpl001ScreenId>()
  const blocks = useAtomValue(noteBlocksAtom)
  const recognised = useAtomValue(suggestionAtom)
  const contactLinkLabel = useAtomValue(contactLinkLabelAtom)
  const pulseLink = useAtomValue(linkPulseAtom)
  const setPulseLink = useSetAtom(linkPulseAtom)
  const setBlockText = useSetAtom(setBlockTextAtom)
  const openTidy = useSetAtom(openTidyAtom)

  useAnalysisTimer()

  const endPulse = useCallback(() => setPulseLink(false), [setPulseLink])

  const tidy = () => {
    openTidy(screenId)
    goToScreen('tidy-confirm')
  }

  return (
    <PodScreen topBar={<SofiaTopBar tab="notes" />}>
      <TidyNotesArea
        blocks={blocks}
        contactLinkLabel={contactLinkLabel}
        onChangeText={setBlockText}
        onOpenContactLink={() => goToScreen('contact-info')}
        onPulseDone={endPulse}
        onTidy={tidy}
        pulseLink={pulseLink}
        recognised={recognised}
      />
    </PodScreen>
  )
}
