import { useAtom, useStore } from 'jotai'
import { ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { formAttemptedAtom, profileAtom, type ScOnb004Components, type ScOnb004ScreenId } from '../model'
import { ActionStack, FlowPage } from './shell'

const COUNTRIES = [
  { code: 'US', label: 'United States (+1)' },
  { code: 'GB', label: 'United Kingdom (+44)' },
  { code: 'DE', label: 'Germany (+49)' },
]

export const ProfileFormScreen = () => {
  const { t } = useTranslation()
  const { Button, TextField } = useFlowComponents<ScOnb004Components>()
  const { goToScreen } = useFlowNavigation<ScOnb004ScreenId>()
  const store = useStore()
  const [profile, setProfile] = useAtom(profileAtom)
  const [attempted, setAttempted] = useAtom(formAttemptedAtom)
  const key = (path: string) => `flows.scOnb004.${path}`
  const missingName = attempted && profile.firstName.trim() === ''

  const patch = (partial: Partial<typeof profile>) => setProfile({ ...store.get(profileAtom), ...partial })

  return (
    <FlowPage
      footer={
        <ActionStack>
          <Button
            onClick={() => {
              setAttempted(true)
              if (store.get(profileAtom).firstName.trim() === '') return
              goToScreen('devices')
            }}
          >
            {t(key('actions.continue'))}
          </Button>
          <p className="text-center text-gray-500 text-sm">{t(key('profile.deviceOnly'))}</p>
        </ActionStack>
      }
      top={
        <div className="px-6 pt-4">
          <button
            className="flex min-h-11 items-center gap-1 text-gray-600"
            onClick={() => goToScreen('profile-choose')}
            type="button"
          >
            <ChevronLeft aria-hidden className="size-5" />
            {t(key('actions.back'))}
          </button>
        </div>
      }
    >
      <h1 className="font-semibold text-gray-900 text-xl">{t(key('profile.headline'))}</h1>
      <div className="mt-6 grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <TextField
            error={missingName ? t(key('profile.firstNameError')) : undefined}
            label={t(key('profile.firstName'))}
            onChange={(firstName) => patch({ firstName })}
            value={profile.firstName}
          />
          <TextField label={t(key('profile.lastName'))} onChange={(lastName) => patch({ lastName })} value={profile.lastName} />
        </div>
        <TextField label={t(key('profile.email'))} onChange={(email) => patch({ email })} value={profile.email} />
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="px-0.5 text-gray-700">{t(key('profile.country'))}</span>
          <select
            className="rounded-xl border border-gray-300 bg-white px-3 py-2"
            onChange={(event) => patch({ countryCode: event.target.value })}
            value={profile.countryCode}
          >
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.label}
              </option>
            ))}
          </select>
        </label>
        <TextField label={t(key('profile.phone'))} onChange={(phone) => patch({ phone })} value={profile.phone} />
        <p className="text-gray-600 text-sm">{t(key('profile.privacy'))}</p>
        <p className="text-gray-600 text-sm">{t(key('profile.realName'))}</p>
      </div>
    </FlowPage>
  )
}
