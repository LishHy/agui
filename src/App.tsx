import { useEffect, useRef, useState } from 'react'
import { IconRail } from './kd/components/IconRail'
import { TopBar } from './kd/components/TopBar'
import { AgentSidebar } from './kd/components/AgentSidebar'
import { HomePanel } from './kd/components/HomePanel'
import { ThinkingState } from './kd/components/ThinkingState'
import { AnswerView } from './kd/components/AnswerView'
import { ACTIVE_AGENT_ID, getAgent } from './kd/data/agents'
import { planAnswer, type AnswerPlan } from './kd/data/answer'

type View = 'home' | 'thinking' | 'answer'

export function App() {
  const [view, setView] = useState<View>('home')
  const [agentId, setAgentId] = useState(ACTIVE_AGENT_ID)
  const [plan, setPlan] = useState<AnswerPlan | null>(null)
  const [initialCite, setInitialCite] = useState<number | null>(null)
  // A source is open in the viewer → hide the agent sidebar to give it room.
  const [sourceOpen, setSourceOpen] = useState(false)

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

  // ---- Deep link: ?ask=<question> pre-runs a question (handy for demos).
  //      Add &instant=1 to skip the interpreting animation.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('ask')
    if (!q) return
    setPlan(planAnswer(q))
    const cite = params.get('cite')
    if (cite !== null) setInitialCite(Number(cite))
    setView(params.get('instant') || cite !== null ? 'answer' : 'thinking')
  }, [])

  // ---- Flow ----------------------------------------------------------------
  function ask(question: string) {
    // The swappable agent layer turns a question into an ordered widget plan.
    setPlan(planAnswer(question))
    setView('thinking')
  }
  function selectAgent(id: string) {
    setAgentId(id)
    setView('home')
    setPlan(null)
  }
  function openDoc(label: string) {
    showSnack(`Opening ${label}`)
  }

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
          {view === 'answer' && sourceOpen ? null : (
            <AgentSidebar
              activeAgentId={agentId}
              onSelectAgent={selectAgent}
              variant={view === 'home' ? 'home' : 'compact'}
            />
          )}

          <main
            id="kd-content"
            className={`kd-content${view === 'answer' ? ' kd-content--answer' : ''}`}
            tabIndex={-1}
          >
            {view === 'home' ? (
              <div className="kd-card">
                <HomePanel agentId={agentId} onAsk={ask} />
              </div>
            ) : view === 'thinking' && plan ? (
              <div className="kd-card">
                <ThinkingState key={plan.question} plan={plan} onDone={() => setView('answer')} />
              </div>
            ) : view === 'answer' && plan ? (
              <AnswerView
                plan={plan}
                agentName={getAgent(agentId).name}
                onAsk={ask}
                onOpenDoc={openDoc}
                initialCite={initialCite}
                onSourceOpenChange={setSourceOpen}
              />
            ) : null}
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
