import { useId } from 'react'

type CheckboxProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export const Checkbox = ({ label, checked, onChange }: CheckboxProps) => {
  const inputId = useId()

  return (
    <div>
      <input checked={checked} id={inputId} onChange={(event) => onChange(event.target.checked)} type="checkbox" />
      <label htmlFor={inputId}>{label}</label>
    </div>
  )
}
