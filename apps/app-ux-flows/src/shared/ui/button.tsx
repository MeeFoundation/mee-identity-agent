import type { ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
}

export const Button = ({ children, onClick, disabled = false }: ButtonProps) => (
  <button disabled={disabled} onClick={onClick} type="button">
    {children}
  </button>
)
