import { useAtom, useSetAtom } from 'jotai'
import { ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import {
  contactsPromptAtom,
  emptyProfile,
  fixtureContacts,
  formAttemptedAtom,
  profileAtom,
  type Profile,
  type ScOnb004Components,
  type ScOnb004ScreenId,
} from '../model'
import { ActionStack, FlowPage } from './shell'

export const ProfileChooseScreen = () => {
  const { t } = useTranslation()
  const { Button } = useFlowComponents<ScOnb004Components>()
  const { goToScreen } = useFlowNavigation<ScOnb004ScreenId>()
  const setProfile = useSetAtom(profileAtom)
  const setAttempted = useSetAtom(formAttemptedAtom)
  const [prompt, setPrompt] = useAtom(contactsPromptAtom)
  const key = (path: string) => `flows.scOnb004.${path}`

  const openForm = (profile: Profile = emptyProfile()) => {
    setProfile(profile)
    setAttempted(false)
    setPrompt('idle')
    goToScreen('profile-form')
  }

  return (
    <FlowPage
      footer={
        prompt === 'idle' ? (
          <ActionStack>
            <Button onClick={() => setPrompt('asking')}>{t(key('actions.contactCard'))}</Button>
            <Button onClick={() => openForm()} tone="secondary">
              {t(key('actions.manual'))}
            </Button>
            <p className="text-center text-gray-500 text-sm">{t(key('profile.deviceOnly'))}</p>
          </ActionStack>
        ) : null
      }
      top={
        <div className="px-6 pt-4">
          <button
            className="flex min-h-11 items-center gap-1 text-gray-600"
            onClick={() => (prompt === 'idle' ? goToScreen('setup') : setPrompt('idle'))}
            type="button"
          >
            <ChevronLeft aria-hidden className="size-5" />
            {t(key('actions.back'))}
          </button>
        </div>
      }
    >
      {prompt === 'idle' ? (
        <>
          <h1 className="font-semibold text-gray-900 text-xl">{t(key('profile.headline'))}</h1>
          <p className="mt-2 text-gray-600">{t(key('profile.subline'))}</p>
          <div className="flex flex-1 items-center justify-center py-8">
            <div className="relative h-40 w-48">
              <span className="absolute top-8 left-8 grid size-20 place-items-center rounded-[22px] bg-brand-700">
                <span className="size-10 rounded-full bg-brand-50" />
              </span>
              <span className="absolute top-0 left-0 size-12 rounded-2xl bg-brand-100" />
              <span className="absolute right-4 bottom-4 size-12 rounded-2xl bg-brand-100" />
            </div>
          </div>
        </>
      ) : null}
      {prompt === 'asking' ? (
        <PromptCard
          actions={[
            { label: t(key('contacts.dontAllow')), onClick: () => openForm() },
            { label: t(key('contacts.continue')), onClick: () => setPrompt('choosing') },
          ]}
          message={t(key('contacts.askingMessage'))}
          title={t(key('contacts.askingTitle'))}
        />
      ) : null}
      {prompt === 'choosing' ? (
        <PromptCard
          actions={[
            { label: t(key('contacts.select')), onClick: () => setPrompt('picking') },
            { label: t(key('contacts.shareAll')), onClick: () => setPrompt('picking') },
            { label: t(key('contacts.dontAllow')), onClick: () => openForm() },
          ]}
          message={t(key('contacts.choosingMessage'))}
          title={t(key('contacts.choosingTitle'))}
        />
      ) : null}
      {prompt === 'picking' ? (
        <div className="grid gap-3">
          <h2 className="font-semibold text-gray-900">{t(key('contacts.pickerTitle'))}</h2>
          {fixtureContacts.map((contact) => (
            <Button
              key={contact.id}
              onClick={() => {
                const { id: _id, ...details } = contact
                openForm(details)
              }}
              tone="secondary"
            >
              {`${contact.firstName} ${contact.lastName}`}
            </Button>
          ))}
          <Button onClick={() => openForm()} variant="link">
            {t(key('contacts.cancel'))}
          </Button>
        </div>
      ) : null}
    </FlowPage>
  )
}

const PromptCard = ({
  actions,
  message,
  title,
}: {
  title: string
  message: string
  actions: { label: string; onClick: () => void }[]
}) => {
  const { Button } = useFlowComponents<ScOnb004Components>()
  return (
    <div className="m-auto w-full max-w-sm rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-gray-900">{title}</h2>
      <p className="mt-2 text-gray-600 text-sm">{message}</p>
      <div className="mt-4 grid gap-2">
        {actions.map((action) => (
          <Button key={action.label} onClick={action.onClick} tone="secondary">
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
