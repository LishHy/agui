import { useEffect, useRef, useState } from 'react'
import { Icon } from '../../icons'
import { IconButton } from '../../components/IconButton'
import { AskInput } from './AskInput'
import { AnalyzeBlock } from './AnalyzeBlock'
import { ReferenceViewer } from './ReferenceViewer'
import { AdditionalInfo } from './AdditionalInfo'
import { SourcesGraph } from './SourcesGraph'
import { renderWidget, type WidgetActions } from './widgets'
import type { AnswerPlan, Reference, Source } from '../data/answer'
import type { Agent } from '../data/agents'

/** One turn in the conversation: a question and the plan the agent answered with. */
export type Turn = { id: number; plan: AnswerPlan; phase: 'thinking' | 'answered' }

type Panel =
  | { kind: 'ref'; references: Reference[]; index: number }
  | { kind: 'context'; plan: AnswerPlan }
  | { kind: 'graph'; plan: AnswerPlan; references: Reference[] }
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
  /** Open the full-page compare experience for a source. */
  onCompare: (source: Source) => void
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
  onCompare,
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

  // ---- Auto-scroll: keep the newest message in view as content appears -------
  const scrollRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  // Whether the view is parked at the bottom (so we may keep it pinned there).
  // Starts false so the first answer opens at the top; follow-ups pin to bottom.
  const pinnedRef = useRef(false)
  const prevLenRef = useRef(0)

  // A new follow-up turn glides to the latest message (and re-pins to bottom).
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    if (thread.length > prevLenRef.current && prevLenRef.current > 0) {
      pinnedRef.current = true
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }
    prevLenRef.current = thread.length
  }, [thread])

  // Follow height growth (tool reveal, widgets rendering) while pinned to bottom.
  useEffect(() => {
    const el = scrollRef.current
    const content = contentRef.current
    if (!el || !content) return
    const onScroll = () => {
      pinnedRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
    }
    el.addEventListener('scroll', onScroll)
    const ro = new ResizeObserver(() => {
      if (pinnedRef.current) el.scrollTop = el.scrollHeight
    })
    ro.observe(content)
    return () => {
      el.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  }, [])

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
  const hasSource = panel?.kind === 'ref' || panel?.kind === 'graph'
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

        <div className="answer-scroll" ref={scrollRef}>
          <div className="answer-thread" ref={contentRef}>
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
        </div>

        <footer className="answer-footer">
          {followups ? renderWidget(followups, 999, actions) : null}
          <AskInput onSubmit={onAsk} docked placeholder="Ask a question" />
          <p className="answer-ask__caption">
            AI can make mistakes. Please double-check responses.
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
          onCompare={onCompare}
        />
      ) : panel?.kind === 'context' ? (
        <AdditionalInfo
          plan={panel.plan}
          agentName={agent.name}
          references={firstReferences(panel.plan)}
          onOpenRef={(refs, index) => setPanel({ kind: 'ref', references: refs, index })}
          onVisualizeGraph={() =>
            setPanel({ kind: 'graph', plan: panel.plan, references: firstReferences(panel.plan) ?? [] })
          }
          onClose={() => setPanel(null)}
        />
      ) : panel?.kind === 'graph' ? (
        <SourcesGraph plan={panel.plan} references={panel.references} onBack={() => setPanel(null)} />
      ) : null}
    </div>
  )
}
