import { useState } from 'react'
import { Icon } from '../../icons'
import { IconButton } from '../../components/IconButton'
import { EmptyState } from '../../components/EmptyState'
import { AskInput } from './AskInput'
import { SUGGESTIONS } from '../data/home'
import { getAgent } from '../data/agents'

interface HomePanelProps {
  agentId: string
  onAsk: (question: string) => void
}

export function HomePanel({ agentId, onAsk }: HomePanelProps) {
  const agent = getAgent(agentId)
  const [tab, setTab] = useState<'Suggested' | 'History'>('Suggested')

  return (
    <div className="home-panel">
      <div className="home-panel__header">
        <span className="agent-avatar">
          <Icon name={agent.icon} size={22} />
        </span>
        <h1 className="home-panel__title">{agent.name}</h1>
        <div className="home-panel__actions">
          <IconButton icon="pin" label="Pin agent" />
          <IconButton icon="more" label="More actions" />
        </div>
      </div>

      <AskInput onSubmit={onAsk} placeholder="Ask a question about this account" />
      <p className="ask-caption">Always verify AI-generated responses.</p>

      <div className="home-tabs" role="tablist" aria-label="Suggestions and history">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'Suggested'}
          className="home-tab"
          onClick={() => setTab('Suggested')}
        >
          Suggested
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'History'}
          className="home-tab"
          onClick={() => setTab('History')}
        >
          Conversation History
        </button>
        <button type="button" role="tab" aria-selected={false} className="home-tab" disabled>
          Schedules
        </button>
      </div>

      {tab === 'Suggested' ? (
        <ul className="suggestion-list">
          {SUGGESTIONS.map((s) => (
            <li key={s.id}>
              <button type="button" className="suggestion-row" onClick={() => onAsk(s.text)}>
                <span className="suggestion-row__text">{s.text}</span>
                <Icon name="cornerDownLeft" size={18} className="suggestion-row__icon" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon="history"
          title="No conversations yet"
          message="Ask a question to start. Your conversation history for this agent will appear here."
        />
      )}
    </div>
  )
}
