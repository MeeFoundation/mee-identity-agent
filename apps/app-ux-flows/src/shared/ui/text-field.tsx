import { useId } from 'react'

type TextFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
}

export const TextField = ({ label, value, onChange }: TextFieldProps) => {
  const inputId = useId()

  return (
    <div>
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} onChange={(event) => onChange(event.target.value)} value={value} />
    </div>
  )
}
