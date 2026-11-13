import { useEffect, useState } from 'react'
import { Icon } from '../../icons'
import { IconButton } from '../../components/IconButton'
import { AskInput } from './AskInput'
import { AnalyzeBlock } from './AnalyzeBlock'
import { ReferenceViewer } from './ReferenceViewer'
import { AdditionalInfo } from './AdditionalInfo'
import { renderWidget, type WidgetActions } from './widgets'
import type { AnswerPlan, Reference } from '../data/answer'
import type { Agent } from '../data/agents'

/** One turn in the conversation: a question and the plan the agent answered with. */
export type Turn = { id: number; plan: AnswerPlan; phase: 'thinking' | 'answered' }

type Panel =
  | { kind: 'ref'; references: Reference[]; index: number }
  | { kind: 'context'; plan: AnswerPlan }
  | null

interface AnswerViewProps {
  thread: Turn[]
  agent: Agent
  onAsk: (question: string) => void
  onClarify: (label: string) => void
  onOpenDoc: (label: string) => void
  onNewConversation: () => void
  /** Flip a thinking turn to answered once its analyze animation completes. */
  onTurnDone: (id: number) => void
  /** Deep-link: open this reference (of the first what_matters widget) on mount. */
  initialCite?: number | null
  /** Notifies the shell whether a side panel is open (to hide the agent sidebar). */
  onSourceOpenChange?: (open: boolean) => void
}

function firstReferences(plan: AnswerPlan): Reference[] | null {
  for (const w of plan.widgets) {
    if (w.type === 'what_matters' && w.data.references.length > 0) return w.data.references
  }
  return null
}

function isClarification(plan: AnswerPlan): boolean {
  return plan.widgets.some((w) => w.type === 'clarification')
}

/** A single answered turn: its widgets plus the feedback / context toolbar. */
function AnswerTurn({
  plan,
  actions,
  onOpenContext,
}: {
  plan: AnswerPlan
  actions: WidgetActions
  onOpenContext: (plan: AnswerPlan) => void
}) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  const stack = plan.widgets.filter((w) => w.type !== 'suggested_followups')

  function copyAnswer() {
    const wm = plan.widgets.find((w) => w.type === 'what_matters')
    const text = wm && wm.type === 'what_matters' ? wm.data.text : plan.title
    void navigator.clipboard?.writeText(text)
  }

  if (isClarification(plan)) {
    return <div className="answer-stack">{stack.map((spec, i) => renderWidget(spec, i, actions))}</div>
  }

  return (
    <>
      <div className="answer-stack">{stack.map((spec, i) => renderWidget(spec, i, actions))}</div>

      <div className="msg-footer">
        <div className="msg-footer__actions">
          <IconButton
            icon="thumbsUp"
            label="Good response"
            aria-pressed={feedback === 'up'}
            onClick={() => setFeedback((f) => (f === 'up' ? null : 'up'))}
          />
          <IconButton
            icon="thumbsDown"
            label="Needs work"
            aria-pressed={feedback === 'down'}
            onClick={() => setFeedback((f) => (f === 'down' ? null : 'down'))}
          />
          <IconButton icon="copy" label="Copy answer" onClick={copyAnswer} />
        </div>
        <button type="button" className="msg-context" onClick={() => onOpenContext(plan)}>
          Find out how?
          <Icon name="chevronRight" size={16} />
        </button>
      </div>
    </>
  )
}

/** Renders a multi-turn conversation, plus the reference viewer / additional-info panels. */
export function AnswerView({
  thread,
  agent,
  onAsk,
  onClarify,
  onOpenDoc,
  onNewConversation,
  onTurnDone,
  initialCite,
  onSourceOpenChange,
}: AnswerViewProps) {
  const firstPlan = thread[0]?.plan ?? null
  const [panel, setPanel] = useState<Panel>(() => {
    if (!firstPlan) return null
    if (new URLSearchParams(window.location.search).get('ctx')) return { kind: 'context', plan: firstPlan }
    if (initialCite == null) return null
    const references = firstReferences(firstPlan)
    if (!references) return null
    return { kind: 'ref', references, index: Math.max(0, Math.min(initialCite, references.length - 1)) }
  })

  useEffect(() => {
    onSourceOpenChange?.(panel != null)
    return () => onSourceOpenChange?.(false)
  }, [panel, onSourceOpenChange])

  const actions: WidgetActions = {
    onAsk,
    onClarify,
    onOpenDoc,
    onCite: (refs, index) => setPanel({ kind: 'ref', references: refs, index }),
    activeCite: panel?.kind === 'ref' ? { references: panel.references, index: panel.index } : null,
  }

  const lastTurn = thread[thread.length - 1]
  const lastAnswered = lastTurn?.phase === 'answered'
  const followups = lastAnswered ? lastTurn.plan.widgets.find((w) => w.type === 'suggested_followups') : undefined
  const hasSource = panel?.kind === 'ref'
  const title = lastTurn?.plan.title ?? 'Conversation'

  return (
    <div className={`answer-view${hasSource ? ' has-source' : ''}`}>
      <div className="answer-main">
        <div className="answer-header">
          <span className={`answer-header__avatar agent-badge agent-badge--${agent.tone}`}>
            <Icon name={agent.icon} size={20} />
          </span>
          <h1 className="answer-header__title">{title}</h1>
          <IconButton icon="maximize" label="Preview conversation" />
          <button type="button" className="sat-btn sat-btn--filled" onClick={onNewConversation}>
            <Icon name="plus" size={16} />
            <span className="sat-btn__label">New Conversation</span>
          </button>
        </div>

        <div className="answer-scroll">
          {thread.map((turn) => (
            <div className="answer-turn" key={turn.id}>
              <p className="question-bubble">{turn.plan.question}</p>
              {turn.phase === 'thinking' ? (
                <AnalyzeBlock plan={turn.plan} onDone={() => onTurnDone(turn.id)} />
              ) : (
                <AnswerTurn
                  plan={turn.plan}
                  actions={actions}
                  onOpenContext={(plan) => setPanel({ kind: 'context', plan })}
                />
              )}
            </div>
          ))}
        </div>

        <footer className="answer-footer">
          {followups ? renderWidget(followups, 999, actions) : null}
          <AskInput onSubmit={onAsk} docked placeholder="Ask a question" />
          <p className="answer-ask__caption">
            AI-generated answers can be wrong. Review answer context to verify.
          </p>
        </footer>
      </div>

      {panel?.kind === 'ref' ? (
        <ReferenceViewer
          references={panel.references}
          index={panel.index}
          onNavigate={(index) => setPanel({ kind: 'ref', references: panel.references, index })}
          onClose={() => setPanel(null)}
          onOpenDoc={onOpenDoc}
        />
      ) : panel?.kind === 'context' ? (
        <AdditionalInfo
          plan={panel.plan}
          agentName={agent.name}
          references={firstReferences(panel.plan)}
          onOpenRef={(refs, index) => setPanel({ kind: 'ref', references: refs, index })}
          onClose={() => setPanel(null)}
        />
      ) : null}
    </div>
  )
}
