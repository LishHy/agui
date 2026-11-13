import { useEffect, useState } from 'react'
import { Icon } from '../../icons'
import { IconButton } from '../../components/IconButton'
import type { AnswerPlan, Reference } from '../data/answer'

type Tab = 'details' | 'sources' | 'agent'

interface AdditionalInfoProps {
  plan: AnswerPlan
  agentName: string
  references: Reference[] | null
  onOpenRef: (references: Reference[], index: number) => void
  onVisualizeGraph: () => void
  onClose: () => void
}

/**
 * "Full answer context" — the Additional Information side panel. Details explains
 * what the agent understood and the filters it used; Sources lists the grounding
 * documents; Agent describes the agent that answered.
 */
export function AdditionalInfo({
  plan,
  agentName,
  references,
  onOpenRef,
  onVisualizeGraph,
  onClose,
}: AdditionalInfoProps) {
  const [tab, setTab] = useState<Tab>('details')

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <aside className="addl" role="complementary" aria-label="Additional information">
      <header className="addl__head">
        <span className="addl__title">
          <Icon name="bulb" size={20} />
          Additional information
        </span>
        <IconButton icon="close" label="Close additional information" onClick={onClose} />
      </header>

      <div className="addl__tabs" role="tablist" aria-label="Additional information">
        {(['details', 'sources', 'agent'] as const).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            className="addl__tab"
            onClick={() => setTab(key)}
          >
            {key === 'details' ? 'Details' : key === 'sources' ? 'Sources' : 'Agent'}
          </button>
        ))}
      </div>

      <div className="addl__body">
        {tab === 'details' ? (
          <>
            <section className="addl__section">
              <h3 className="addl__h">Your question</h3>
              <p className="addl__question">{plan.question}</p>
              <p className="addl__muted">Asked today · {agentName}</p>
            </section>

            <section className="addl__section">
              <h3 className="addl__h">What the agent understood</h3>
              <p className="addl__understood">{plan.context.understood}</p>
              <table className="addl__interp">
                <tbody>
                  {plan.context.interpretation.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      <td>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="addl__section">
              <div className="addl__filters-head">
                <h3 className="addl__h">Filters applied</h3>
                <span className="addl__count">{plan.context.filters.length}</span>
              </div>
              <div className="addl__filters">
                {plan.context.filters.map((f) => (
                  <span key={f} className="addl__filter">
                    {f}
                  </span>
                ))}
              </div>
            </section>
          </>
        ) : tab === 'sources' ? (
          <section className="addl__section">
            {references && references.some((r) => r.kind === 'source') ? (
              <button type="button" className="addl__graph-card" onClick={onVisualizeGraph}>
                <span className="addl__graph-card__icon">
                  <Icon name="graph" size={20} />
                </span>
                <span className="addl__graph-card__text">
                  <span className="addl__graph-card__title">Visualize sources in graph</span>
                  <span className="addl__graph-card__sub">
                    See how {references.filter((r) => r.kind === 'source').length} sources connect
                  </span>
                </span>
                <Icon name="chevronRight" size={18} />
              </button>
            ) : null}

            <h3 className="addl__h">Grounding documents</h3>
            {references && references.some((r) => r.kind === 'source') ? (
              <ul className="addl__sources">
                {references.map((r, i) =>
                  r.kind === 'source' ? (
                    <li key={i}>
                      <button type="button" className="addl__source" onClick={() => onOpenRef(references, i)}>
                        <span className="addl__source-index">{i + 1}</span>
                        <span className="addl__source-main">
                          <span className="addl__source-title">{r.source.label}</span>
                          <span className="addl__source-sub">
                            {r.source.provider} · {r.source.ref}
                          </span>
                        </span>
                        <Icon name="chevronRight" size={16} />
                      </button>
                    </li>
                  ) : null,
                )}
              </ul>
            ) : (
              <p className="addl__muted">No grounding documents for this answer.</p>
            )}
          </section>
        ) : (
          <section className="addl__section">
            <h3 className="addl__h">Answered by</h3>
            <div className="addl__agent">
              <span className="agent-badge agent-badge--primary">
                <Icon name="butterfly" size={18} />
              </span>
              <div>
                <p className="addl__agent-name">{agentName}</p>
                <p className="addl__muted">Contract analysis</p>
              </div>
            </div>
            <p className="addl__understood">
              Reviews agreements, amendments and orders across the account and grounds every answer
              in the source documents it cites.
            </p>
            <table className="addl__interp">
              <tbody>
                <tr>
                  <th scope="row">Scope</th>
                  <td>26 documents</td>
                </tr>
                <tr>
                  <th scope="row">Repository</th>
                  <td>Content Lake</td>
                </tr>
                <tr>
                  <th scope="row">Grounding</th>
                  <td>Citations required</td>
                </tr>
              </tbody>
            </table>
          </section>
        )}
      </div>
    </aside>
  )
}
