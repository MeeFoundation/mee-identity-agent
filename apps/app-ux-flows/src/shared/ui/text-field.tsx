import { useId } from 'react'

import { Input } from './primitives/input'
import { Label } from './primitives/label'

type TextFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'number' | 'date'
}

export const TextField = ({ label, value, onChange, type = 'text' }: TextFieldProps) => {
  const inputId = useId()

  return (
    <div className="group flex flex-col gap-1.5">
      <Label className="px-0.5 group-focus-within:text-brand-700" htmlFor={inputId}>
        {label}
      </Label>
      <Input id={inputId} onChange={(event) => onChange(event.target.value)} type={type} value={value} />
    </div>
  )
}
