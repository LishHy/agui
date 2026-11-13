import { useEffect, useRef, useState } from 'react'
import { IconRail } from './kd/components/IconRail'
import { TopBar } from './kd/components/TopBar'
import { AgentSidebar } from './kd/components/AgentSidebar'
import { HomePanel } from './kd/components/HomePanel'
import { AnswerView, type Turn } from './kd/components/AnswerView'
import { ACTIVE_AGENT_ID, getAgent } from './kd/data/agents'
import { buildOverviewForEntity, planAnswer, type AnswerPlan } from './kd/data/answer'

export function App() {
  const [agentId, setAgentId] = useState(ACTIVE_AGENT_ID)
  const [thread, setThread] = useState<Turn[]>([])
  const [initialCite, setInitialCite] = useState<number | null>(null)
  // A source is open in the viewer → hide the agent sidebar to give it room.
  const [sourceOpen, setSourceOpen] = useState(false)
  const turnId = useRef(0)

  // Default to light to match the Satori / KD design; presenter can toggle.
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // ---- Snackbar (transient confirmation) -----------------------------------
  const [snack, setSnack] = useState<string | null>(null)
  const snackTimer = useRef<number | undefined>(undefined)
  function showSnack(text: string) {
    window.clearTimeout(snackTimer.current)
    setSnack(text)
    snackTimer.current = window.setTimeout(() => setSnack(null), 4000)
  }
  useEffect(() => () => window.clearTimeout(snackTimer.current), [])

  function pushTurn(plan: AnswerPlan, phase: 'thinking' | 'answered' = 'thinking') {
    turnId.current += 1
    setThread((t) => [...t, { id: turnId.current, plan, phase }])
  }

  // ---- Deep link: ?ask=<question> pre-runs a question (handy for demos).
  //      Add &instant=1 to skip the interpreting animation.
  const didInit = useRef(false)
  useEffect(() => {
    if (didInit.current) return // guard against StrictMode's double-invoke (pushTurn appends)
    didInit.current = true
    const params = new URLSearchParams(window.location.search)
    const q = params.get('ask')
    if (!q) return
    const cite = params.get('cite')
    if (cite !== null) setInitialCite(Number(cite))
    const instant = params.get('instant') !== null || cite !== null
    pushTurn(planAnswer(q), instant ? 'answered' : 'thinking')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- Flow ----------------------------------------------------------------
  function ask(question: string) {
    // The swappable agent layer turns a question into an ordered widget plan.
    pushTurn(planAnswer(question))
  }
  // Resolve a clarification: the chosen option becomes the next user turn.
  function clarify(label: string) {
    pushTurn(buildOverviewForEntity(label, label))
  }
  function turnDone(id: number) {
    setThread((t) => t.map((turn) => (turn.id === id ? { ...turn, phase: 'answered' } : turn)))
  }
  function newConversation() {
    setThread([])
    setInitialCite(null)
  }
  function selectAgent(id: string) {
    setAgentId(id)
    setThread([])
  }
  function openDoc(label: string) {
    showSnack(`Opening ${label}`)
  }

  const inChat = thread.length > 0

  return (
    <div className="kd-shell">
      <a className="skip-link" href="#kd-content">
        Skip to main content
      </a>

      <IconRail />

      <div className="kd-main">
        <TopBar
          activeTab="Home"
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        />

        <div className="kd-body">
          {inChat && sourceOpen ? null : (
            <AgentSidebar activeAgentId={agentId} onSelectAgent={selectAgent} variant="home" />
          )}

          <main
            id="kd-content"
            className={`kd-content${inChat ? ' kd-content--answer' : ''}`}
            tabIndex={-1}
          >
            {!inChat ? (
              <div className="kd-card">
                <HomePanel agentId={agentId} onAsk={ask} />
              </div>
            ) : (
              <AnswerView
                thread={thread}
                agent={getAgent(agentId)}
                onAsk={ask}
                onClarify={clarify}
                onOpenDoc={openDoc}
                onNewConversation={newConversation}
                onTurnDone={turnDone}
                initialCite={initialCite}
                onSourceOpenChange={setSourceOpen}
              />
            )}
          </main>
        </div>
      </div>

      {snack ? (
        <div className="snackbar" role="status" aria-live="polite">
          <span className="snackbar__text">{snack}</span>
        </div>
      ) : null}
    </div>
  )
}
