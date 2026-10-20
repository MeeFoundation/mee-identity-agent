import { useId } from 'react'

import { Input } from './primitives/input'
import { Label } from './primitives/label'

type TextFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'number' | 'date'
  // Marks the field invalid and shows the message under it.
  error?: string
}

export const TextField = ({ label, value, onChange, type = 'text', error }: TextFieldProps) => {
  const inputId = useId()
  const errorId = `${inputId}-error`

  return (
    <div className="group flex flex-col gap-1.5">
      <Label className="px-0.5 group-focus-within:text-brand-700" htmlFor={inputId}>
        {label}
      </Label>
      <Input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        className={error ? 'border-error-700 focus-visible:border-error-700' : undefined}
        id={inputId}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
      {error && (
        <p className="px-0.5 text-error-700 text-sm" id={errorId}>
          {error}
        </p>
      )}
    </div>
  )
}
