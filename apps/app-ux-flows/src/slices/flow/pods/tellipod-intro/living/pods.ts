// The pods the living-pod scene shows, in the order they stack on the first beat (Ginger last, on top). Their names,
// notes and messages are copy under `pods.tellipodIntro.living.pods.<id>.*`.

import type { IconName } from '../overlays/icons'

export type PodId = 'home' | 'kyoto' | 'sofia' | 'ginger'

export const DECK_PODS = ['home', 'kyoto', 'sofia', 'ginger'] as const satisfies readonly PodId[]

export const POD_CATEGORY_ICON: Record<PodId, IconName> = {
  ginger: 'heart',
  home: 'house',
  kyoto: 'airplane',
  sofia: 'people',
}

export const POD_FILE_ICON: Record<PodId, IconName> = {
  ginger: 'file-earmark-medical',
  home: 'file-earmark-text',
  kyoto: 'file-earmark-text',
  sofia: 'image',
}

// Who is in each pod besides Telli; the other member's initial is copy.
export const POD_MEMBERS: Record<PodId, readonly ('you' | 'other')[]> = {
  ginger: ['you'],
  home: ['you', 'other'],
  kyoto: ['you', 'other'],
  sofia: ['you', 'other'],
}

// Ginger's last message is yours; the others come from another member.
export const POD_CHAT_IS_MINE: Record<PodId, boolean> = {
  ginger: true,
  home: false,
  kyoto: false,
  sofia: false,
}
