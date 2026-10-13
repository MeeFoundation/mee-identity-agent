import { useSetAtom } from 'jotai'
import { type FormEvent, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Input } from '@/shared/ui/primitives/input'
import { Label } from '@/shared/ui/primitives/label'

import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { MembersView } from '../components/members-view'
import { SheetTitle } from '../components/sheet-title'
import { createInviteAtom, type ScPpl002Components, type ScPpl002ScreenId } from '../model'

export const InviteNameScreen = () => {
  const { t } = useTranslation()
  const { BottomSheet, Button } = useFlowComponents<ScPpl002Components>()
  const { back, goToScreen } = useFlowNavigation<ScPpl002ScreenId>()
  const createInvite = useSetAtom(createInviteAtom)
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const helpId = useId()
  const canCreate = name.trim() !== ''

  const create = () => {
    if (!canCreate) return
    createInvite(name)
    goToScreen('invite-share')
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    create()
  }

  return (
    <>
      <MembersView />
      <BottomSheet
        description={t('flows.scPpl002.inviteName.description')}
        initialFocus={inputRef}
        onDismiss={back}
        title={<SheetTitle i18nKey="flows.scPpl002.inviteName.title" />}
      >
        <form className="flex flex-col gap-6" onSubmit={submit}>
          <div className="group flex flex-col gap-1.5">
            <Label className="px-0.5 text-base text-gray-700 group-focus-within:text-brand-700" htmlFor={inputId}>
              {t('flows.scPpl002.inviteName.label')}
            </Label>
            <Input
              aria-describedby={helpId}
              autoComplete="off"
              className="h-11 text-base"
              id={inputId}
              onChange={(event) => setName(event.target.value)}
              ref={inputRef}
              value={name}
            />
            <p className="px-0.5 text-gray-600 text-xs" id={helpId}>
              {t('flows.scPpl002.inviteName.help')}
            </p>
          </div>
          <Button disabled={!canCreate} onClick={create} size="l">
            {t('flows.scPpl002.inviteName.create')}
          </Button>
        </form>
      </BottomSheet>
    </>
  )
}
