import type { FaceId } from './faces'
import { NEW_VET } from './motion'

export type PodExample = {
  caption: string
  chat: { from: FaceId; text: string }
  files: readonly string[]
  form?: { label: string; value: string }
  members: readonly FaceId[]
  name: string
  note: string
  tab: string
}

export const POD_EXAMPLES: readonly PodExample[] = [
  {
    caption: 'Everyone has the same plan, even offline.',
    chat: { from: 'friendB', text: 'Who’s bringing the adapter?' },
    files: ['Hotel booking.pdf'],
    members: ['you', 'friendA', 'friendB'],
    name: 'Lisbon trip',
    note: 'Flight lands 9:40 on May 12. Check-in after 3pm.',
    tab: 'Trip',
  },
  {
    caption: 'You and your siblings see the same meds list, always current.',
    chat: { from: 'sister', text: 'I’ll take her on Tuesday' },
    files: ['Insurance card.jpg'],
    members: ['you', 'sister'],
    name: "Mom's care",
    note: 'Morning meds at 8am, evening at 8pm.',
    tab: 'Care',
  },
  {
    caption: 'The walker always has the latest vet number.',
    chat: { from: 'walker', text: 'All fed and walked!' },
    files: [],
    form: { label: 'Vet', value: NEW_VET },
    members: ['you', 'walker'],
    name: 'Pet care',
    note: 'Walks at 7am and 5pm, dinner after.',
    tab: 'Pets',
  },
  {
    caption: 'Quotes and decisions in one place, not lost in texts.',
    chat: { from: 'contractor', text: 'Warm grey grout, yes?' },
    files: ['Tile quote.pdf'],
    members: ['you', 'partner', 'contractor'],
    name: 'Kitchen reno',
    note: 'Tiles arrive Friday. Warm grey grout.',
    tab: 'Reno',
  },
  {
    caption: 'The next book and host, without scrolling back.',
    chat: { from: 'readerA', text: 'I’ll bring snacks' },
    files: [],
    members: ['you', 'readerA', 'readerB'],
    name: 'Book club',
    note: 'Next: chapters 5–8. Priya hosts, June 3.',
    tab: 'Books',
  },
]
