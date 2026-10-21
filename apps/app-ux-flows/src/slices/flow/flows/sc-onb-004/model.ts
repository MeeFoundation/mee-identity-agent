import { atom } from 'jotai'

import type { DefaultComponents } from '@/shared/ui/default-components'

export const SCREEN_IDS = [
  'landing',
  'pod-anything',
  'share-once',
  'yours-to-keep',
  'setup',
  'profile-choose',
  'profile-form',
  'devices',
  'pairing',
  'next',
] as const

export type ScOnb004ScreenId = (typeof SCREEN_IDS)[number]

export type ScOnb004Components = DefaultComponents

export type Profile = {
  countryCode: string
  email: string
  firstName: string
  lastName: string
  phone: string
}

export const emptyProfile = (): Profile => ({
  countryCode: 'US',
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
})

export const profileAtom = atom(emptyProfile())

export const skippedTourAtom = atom(false)

export const formAttemptedAtom = atom(false)

export type ContactsPrompt = 'idle' | 'asking' | 'choosing' | 'picking'

export const contactsPromptAtom = atom<ContactsPrompt>('idle')

export type FixtureContact = Profile & { id: string }

export const fixtureContacts: readonly FixtureContact[] = [
  {
    countryCode: 'US',
    email: 'ada@example.com',
    firstName: 'Ada',
    id: 'ada',
    lastName: 'Lovelace',
    phone: '555-0100',
  },
  {
    countryCode: 'US',
    email: 'sam@example.com',
    firstName: 'Sam',
    id: 'sam',
    lastName: 'Okoye',
    phone: '555-0142',
  },
]
