import type { Attachment } from './model'

// The files in Sofia's pod, as in the Tellipod v4.0.3 Attachments design. Member ids match the People pod.
export const sofiaAttachments: readonly Attachment[] = [
  { addedAt: '2026-08-07', addedBy: 'you', id: 'funny-moment', name: 'funny-moment.mp4', sizeBytes: 10_000_000 },
  { addedAt: '2026-06-19', addedBy: 'geo', id: 'photo-sofia', name: 'photo-Sofia.jpg', sizeBytes: 1_500_000 },
  {
    addedAt: '2026-05-11',
    addedBy: 'you',
    id: 'activities-tracker',
    name: 'Activities-tracker.xls',
    sizeBytes: 143_000,
  },
  { addedAt: '2026-01-23', addedBy: 'andrew', id: 'about-sophia', name: 'About Sophia.databook.mc', sizeBytes: 12_000 },
]
