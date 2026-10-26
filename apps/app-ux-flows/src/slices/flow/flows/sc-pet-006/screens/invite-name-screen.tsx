import { useSetAtom } from 'jotai'
import { type FormEvent, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { InviteRole } from '../../../pods/people/sharing'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { MembersView } from '../components/members-view'
import { SheetTitle } from '../components/sheet-title'
import { createInviteAtom, DEFAULT_INVITE_ROLE, type ScPet006Components, type ScPet006ScreenId } from '../model'
import { Input } from '@/shared/ui/primitives/input'
import { Label } from '@/shared/ui/primitives/label'
import { Radio, RadioGroup } from '@/shared/ui/primitives/radio'

const roles: readonly InviteRole[] = ['logger', 'viewer']

export const InviteNameScreen = () => {
  const { t } = useTranslation()
  const { BottomSheet, Button } = useFlowComponents<ScPet006Components>()
  const { back, goToScreen } = useFlowNavigation<ScPet006ScreenId>()
  const createInvite = useSetAtom(createInviteAtom)
  const [name, setName] = useState('')
  const [role, setRole] = useState<InviteRole>(DEFAULT_INVITE_ROLE)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const accessId = useId()
  const canCreate = name.trim() !== ''

  const create = () => {
    if (!canCreate) return
    createInvite({ name, role })
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
        initialFocus={inputRef}
        onDismiss={back}
        title={<SheetTitle i18nKey="flows.scPet006.inviteName.title" />}
      >
        <form className="flex flex-col gap-6" onSubmit={submit}>
          <div className="group flex flex-col gap-1.5">
            <Label className="px-0.5 text-base text-gray-700 group-focus-within:text-brand-700" htmlFor={inputId}>
              {t('flows.scPet006.inviteName.label')}
            </Label>
            <Input
              autoComplete="off"
              className="h-11 text-base"
              id={inputId}
              onChange={(event) => setName(event.target.value)}
              ref={inputRef}
              value={name}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="px-0.5 text-base text-gray-800" id={accessId}>
              {t('flows.scPet006.inviteName.access')}
            </span>
            <RadioGroup<InviteRole> aria-labelledby={accessId} onValueChange={setRole} value={role}>
              {roles.map((option) => (
                <Label
                  className="flex cursor-pointer items-start gap-3 rounded-xl px-1 py-2.5 hover:bg-gray-50"
                  key={option}
                >
                  <Radio className="mt-0.5" value={option} />
                  <span className="flex flex-col">
                    <span className="text-base text-gray-800">
                      {t(`flows.scPet006.inviteName.roles.${option}.label`)}
                    </span>
                    <span className="font-normal text-gray-600 text-sm">
                      {t(`flows.scPet006.inviteName.roles.${option}.description`)}
                    </span>
                  </span>
                </Label>
              ))}
            </RadioGroup>
          </div>
          <Button disabled={!canCreate} onClick={create} size="l">
            {t('flows.scPet006.inviteName.create')}
          </Button>
        </form>
      </BottomSheet>
    </>
  )
}
