import { useEffect, useState } from 'react'
import { Icon } from '../../icons'
import { IconButton } from '../../components/IconButton'
import type { AnswerPlan } from '../data/answer'
import type { Agent } from '../data/agents'

interface ThinkingStateProps {
  plan: AnswerPlan
  agent: Agent
  onDone: () => void
  onNewConversation: () => void
}

/**
 * "Analyzing" loading state — shows the agent's active reasoning step, the tools
 * it is calling (revealed progressively), and a pending step. Presentational;
 * the content comes from the plan produced by the (swappable) planAnswer layer.
 */
export function ThinkingState({ plan, agent, onDone, onNewConversation }: ThinkingStateProps) {
  const tools = plan.analysis.tools
  const [open, setOpen] = useState(true)
  const [revealed, setRevealed] = useState(0)

  useEffect(() => {
    const timers: number[] = []
    const first = 350
    const step = 430
    tools.forEach((_, i) => {
      timers.push(window.setTimeout(() => setRevealed(i + 1), first + step * i))
    })
    timers.push(window.setTimeout(onDone, first + step * tools.length + 650))
    return () => timers.forEach((t) => window.clearTimeout(t))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="answer-view">
      <div className="answer-main">
        <div className="answer-header">
          <span className={`answer-header__avatar agent-badge agent-badge--${agent.tone}`}>
            <Icon name={agent.icon} size={20} />
          </span>
          <h1 className="answer-header__title">{plan.title}</h1>
          <IconButton icon="maximize" label="Preview conversation" />
          <button type="button" className="sat-btn sat-btn--filled" onClick={onNewConversation}>
            <Icon name="plus" size={16} />
            <span className="sat-btn__label">New Conversation</span>
          </button>
        </div>

        <div className="answer-scroll">
          <p className="question-bubble">{plan.question}</p>

          <div className="analyze">
        <button
          type="button"
          className="analyze__header"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span>Analyzing</span>
          <Icon
            name="chevronDown"
            size={18}
            className={`analyze__chevron${open ? ' analyze__chevron--open' : ''}`}
          />
        </button>

        {open ? (
          <div className="analyze__body">
            <div className="analyze-step analyze-step--active">
              <span className="analyze-spinner" />
              <span className="analyze-step__title">{plan.analysis.headline}</span>
            </div>

            <div className="analyze-tools">
              <span className="analyze-tools__label">Using tool(s):</span>
              <ul>
                {tools.slice(0, revealed).map((t, i) => (
                  <li className="tool-row" key={i}>
                    <span className="tool-chip">
                      <Icon name="search" size={14} /> {t.label}
                    </span>
                    <span className="tool-row__desc">{t.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="analyze-step analyze-step--pending">
              <Icon name="clock" size={18} />
              Understanding request
            </div>
          </div>
          ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
