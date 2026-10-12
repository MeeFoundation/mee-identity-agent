import { type ReactNode, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from './button'

type InlineFieldEditorProps = {
  // The field's input, with its own visible label.
  children: ReactNode
  onSave: () => void
  onCancel: () => void
  saveDisabled?: boolean
}

// Edits one form field where it is shown: the input replaces the value until Save or Cancel.
export const InlineFieldEditor = ({ children, onSave, onCancel, saveDisabled = false }: InlineFieldEditorProps) => {
  const { t } = useTranslation()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    formRef.current?.querySelector<HTMLElement>('input, button')?.focus()
  }, [])

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        if (!saveDisabled) onSave()
      }}
      ref={formRef}
    >
      {children}
      <div className="flex gap-2">
        <Button className="flex-1" disabled={saveDisabled} onClick={onSave} size="m">
          {t('ui.inlineFieldEditor.save')}
        </Button>
        <Button className="flex-1" onClick={onCancel} size="m" tone="tertiary" variant="outlined">
          {t('ui.inlineFieldEditor.cancel')}
        </Button>
      </div>
    </form>
  )
}
