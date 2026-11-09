import { useEffect, useMemo, useState } from 'react'
import { Icon } from '../../icons'
import { IconButton } from '../../components/IconButton'
import { AskInput } from './AskInput'
import { ReferenceViewer } from './ReferenceViewer'
import { AdditionalInfo } from './AdditionalInfo'
import { renderWidget, type WidgetActions } from './widgets'
import type { AnswerPlan, Reference } from '../data/answer'

type Panel = { kind: 'ref'; references: Reference[]; index: number } | { kind: 'context' } | null

interface AnswerViewProps {
  plan: AnswerPlan
  agentName: string
  onAsk: (question: string) => void
  onOpenDoc: (label: string) => void
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

/** Renders a generative answer, plus the reference viewer / additional-info panels. */
export function AnswerView({
  plan,
  agentName,
  onAsk,
  onOpenDoc,
  initialCite,
  onSourceOpenChange,
}: AnswerViewProps) {
  const [panel, setPanel] = useState<Panel>(() => {
    if (new URLSearchParams(window.location.search).get('ctx')) return { kind: 'context' }
    if (initialCite == null) return null
    const references = firstReferences(plan)
    if (!references) return null
    return { kind: 'ref', references, index: Math.max(0, Math.min(initialCite, references.length - 1)) }
  })

  useEffect(() => {
    onSourceOpenChange?.(panel != null)
    return () => onSourceOpenChange?.(false)
  }, [panel, onSourceOpenChange])

  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  const references = useMemo(() => firstReferences(plan), [plan])
  function copyAnswer() {
    const wm = plan.widgets.find((w) => w.type === 'what_matters')
    const text = wm && wm.type === 'what_matters' ? wm.data.text : plan.title
    void navigator.clipboard?.writeText(text)
  }

  const actions: WidgetActions = {
    onAsk,
    onOpenDoc,
    onCite: (refs, index) => setPanel({ kind: 'ref', references: refs, index }),
    activeCite: panel?.kind === 'ref' ? { references: panel.references, index: panel.index } : null,
  }

  const followups = plan.widgets.find((w) => w.type === 'suggested_followups')
  const stack = plan.widgets.filter((w) => w.type !== 'suggested_followups')
  const hasSource = panel?.kind === 'ref'

  return (
    <div className={`answer-view${hasSource ? ' has-source' : ''}`}>
      <div className="answer-main">
        <div className="answer-scroll">
          <div className="answer-header">
            <h1 className="answer-header__title">{plan.title}</h1>
            <IconButton icon="pin" label="Pin this answer" />
            <IconButton icon="more" label="More actions" />
          </div>

          <p className="question-bubble">{plan.question}</p>

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
            <button type="button" className="msg-context" onClick={() => setPanel({ kind: 'context' })}>
              Full answer context
              <Icon name="chevronRight" size={16} />
            </button>
          </div>
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
          plan={plan}
          agentName={agentName}
          references={references}
          onOpenRef={(refs, index) => setPanel({ kind: 'ref', references: refs, index })}
          onClose={() => setPanel(null)}
        />
      ) : null}
    </div>
  )
}
