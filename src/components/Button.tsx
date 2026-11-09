import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon, type IconName } from '../icons'

type Variant = 'filled' | 'tonal' | 'outlined' | 'text' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** filled = primary. Use exactly one primary action per view (B2). */
  variant?: Variant
  leadingIcon?: IconName
  children: ReactNode
}

/**
 * Button — Angular Material button themed by Satori (B2).
 * Action order in a view: filled -> tonal/outlined -> text (A/D laws).
 */
export function Button({
  variant = 'filled',
  leadingIcon,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={`btn btn--${variant}`} {...rest}>
      {leadingIcon ? <Icon name={leadingIcon} size={18} /> : null}
      {children}
    </button>
  )
}
