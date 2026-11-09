import type { ReactNode } from 'react'
import { Icon, type IconName } from '../icons'

interface EmptyStateProps {
  icon: IconName
  title: string
  message: string
  actions?: ReactNode
}

/**
 * Empty State — zero data, no-results, permission and error scenarios (B1).
 * Distinguishes "no data yet" from "no results for this filter" and offers a
 * recovery action. (Satori ships Illustrations; here an icon stands in — gap.)
 */
export function EmptyState({ icon, title, message, actions }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      <span className="empty-state__art">
        <Icon name={icon} size={48} strokeWidth={1.4} />
      </span>
      <h2 className="empty-state__title">{title}</h2>
      <p className="empty-state__message">{message}</p>
      {actions ? <div className="empty-state__actions">{actions}</div> : null}
    </div>
  )
}
