import { useState } from 'react'
import { Icon } from '../../icons'
import { SearchField } from '../../components/SearchField'
import { AGENTS } from '../data/agents'

function SidebarSearch() {
  const [v, setV] = useState('')
  return <SearchField value={v} onChange={setV} label="Search agents" placeholder="Search" hideLabel />
}

interface AgentSidebarProps {
  activeAgentId: string
  onSelectAgent: (id: string) => void
  /** 'home' shows search + dashboard; 'compact' shows only the agent list. */
  variant?: 'home' | 'compact'
}

export function AgentSidebar({ activeAgentId, onSelectAgent, variant = 'home' }: AgentSidebarProps) {
  return (
    <aside className={`kd-sidebar${variant === 'compact' ? ' kd-sidebar--compact' : ''}`} aria-label="Agents">
      {variant === 'home' ? (
        <>
          <SidebarSearch />
          <button type="button" className="sidebar-item">
            <span className="sidebar-item__icon">
              <Icon name="apps" size={20} />
            </span>
            Agent Dashboard
          </button>
          <div className="sidebar-divider" />
        </>
      ) : null}

      <span className="sidebar-label">Agents</span>
      <ul className="agent-list">
        {AGENTS.map((a) => (
          <li key={a.id}>
            <button
              type="button"
              className="agent-item"
              aria-current={a.id === activeAgentId ? 'true' : undefined}
              onClick={() => onSelectAgent(a.id)}
            >
              <span className={`agent-badge agent-badge--${a.tone}`}>
                <Icon name={a.icon} size={18} />
              </span>
              {a.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
