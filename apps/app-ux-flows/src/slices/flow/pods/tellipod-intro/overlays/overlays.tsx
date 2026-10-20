// Everything drawn over the world, in the prototype's order (later items paint on top).

import { useRef } from 'react'

import { useIntroScene } from '../engine/frame'
import type { Box } from '../engine/values'
import { KeyChip } from './key-chip'
import { NoteCard } from './note-card'
import { SyncCards } from './sync-cards'
import { GingerStack, GingerTag, HomeTag, SideTag } from './tags'
import { TelliFlyer } from './telli-flyer'

type OverlayActions = {
  next: () => void
  inviteTelli: () => void
  addAll: () => void
}

export const Overlays = ({ actions }: { actions: OverlayActions }) => {
  const { stage, tap } = useIntroScene()
  // The Ginger chip's measured width, shared by everything that lines up with it.
  const chipW = useRef<Box<number>>({ value: 74 }).current
  return (
    <div style={{ height: stage.h, left: 0, pointerEvents: 'none', position: 'absolute', top: 0, width: stage.w }}>
      <SideTag which="kyoto" />
      <SideTag which="sofia" />
      <NoteCard onAddAll={actions.addAll} onInvitePaula={actions.next} onInviteTelli={actions.inviteTelli} />
      <GingerStack chipW={chipW} />
      <GingerTag chipW={chipW} onEnterPod={actions.next} />
      <TelliFlyer chipW={chipW} />
      <KeyChip />
      <SyncCards chipW={chipW} />
      {tap ? <HomeTag onGoHome={actions.next} /> : null}
    </div>
  )
}
