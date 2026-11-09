import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Icon, type IconName } from '../icons'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName
  /** Required accessible name — icon-only controls must be labelled (D3). */
  label: string
  variant?: 'standard' | 'outlined'
  badge?: number
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, variant = 'standard', badge, type = 'button', ...rest },
  ref,
) {
  const cls = [
    'icon-btn',
    variant === 'outlined' ? 'icon-btn--outlined' : '',
    badge != null ? 'has-badge' : '',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <button ref={ref} type={type} className={cls} aria-label={label} title={label} {...rest}>
      <Icon name={icon} size={variant === 'outlined' ? 22 : 20} />
      {badge != null && badge > 0 ? (
        <span className="icon-btn__badge" aria-hidden="true">
          {badge}
        </span>
      ) : null}
    </button>
  )
})
