import type { ReactNode } from 'react'
import { Icon } from '../../icons'
import { Button } from '../../components/Button'
import { useState } from 'react'
import {
  WIDGET_META,
  type WidgetSpec,
  type WidgetType,
  type WhatMattersData,
  type KeyFactsData,
  type ClauseData,
  type ComparisonData,
  type NeedsAttentionData,
  type RelatedDocsData,
  type TimelineData,
  type KeyContactsData,
  type FollowupsData,
  type ClarificationData,
  type DraftPreviewData,
  type Reference,
} from '../data/answer'

export interface WidgetActions {
  onAsk: (question: string) => void
  onOpenDoc: (label: string) => void
  /** Open a reference (source or AI inference) in the right-side panel. */
  onCite: (references: Reference[], index: number) => void
  /** The currently open citation, so its chip can show an active state. */
  activeCite: { references: Reference[]; index: number } | null
  /** Resolve a clarification by submitting the chosen option's label as the next turn. */
  onClarify?: (label: string) => void
}

/* ---- Shared card chrome ---- */
function WidgetCard({ type, children }: { type: WidgetType; children: ReactNode }) {
  const meta = WIDGET_META[type]
  return (
    <section className={`widget-card widget-card--${type}`} aria-label={meta.label}>
      <div className="widget-card__head">
        <span className="widget-icon">
          <Icon name={meta.icon} size={16} />
        </span>
        <span className="widget-label">{meta.label}</span>
      </div>
      {children}
    </section>
  )
}

function WhatMatters({ data, actions }: { data: WhatMattersData; actions: WidgetActions }) {
  const firstSource = data.references.find((r) => r.kind === 'source')
  return (
    <WidgetCard type="what_matters">
      <p className="widget-body-text">
        {data.text}
        {data.references.map((r, i) => {
          const active =
            actions.activeCite?.references === data.references && actions.activeCite.index === i
          const isAi = r.kind === 'inference'
          const label = r.kind === 'source' ? r.source.label : r.inference.title
          return (
            <button
              key={i}
              type="button"
              className={`citation-tag${isAi ? ' citation-tag--ai' : ''}${active ? ' is-active' : ''}`}
              aria-pressed={active}
              aria-label={`${isAi ? 'Open AI inference' : 'Open source'} ${i + 1}: ${label}`}
              onClick={() => actions.onCite(data.references, i)}
            >
              {isAi ? <Icon name="sparkle" size={12} /> : null}
              {i + 1}
            </button>
          )
        })}
      </p>
      <div className="confidence-row">
        <span className="confidence-chip">
          <span className="confidence-chip__dot" />
          {data.confidence} confidence
        </span>
        {firstSource && firstSource.kind === 'source' ? (
          <>
            <span className="confidence-sep">|</span>
            <span className="confidence-source">{firstSource.source.label}</span>
            <span className="confidence-sep">|</span>
            <span className="confidence-source">{firstSource.source.date}</span>
          </>
        ) : null}
      </div>
    </WidgetCard>
  )
}

function KeyFacts({ data }: { data: KeyFactsData }) {
  return (
    <div className="facts-grid">
      {data.tiles.map((t) => (
        <div className="fact-tile" key={t.label}>
          <span className="fact-tile__label">{t.label}</span>
          <span className="fact-tile__value">{t.value}</span>
          <span className="fact-tile__sub">{t.sub}</span>
        </div>
      ))}
    </div>
  )
}

function ClauseExcerpt({ data, actions }: { data: ClauseData; actions: WidgetActions }) {
  return (
    <WidgetCard type="clause_excerpt">
      <span className="clause-meta">
        {data.doc} · {data.ref} · {data.date}
      </span>
      <blockquote className="clause-quote">{data.quote}</blockquote>
      <Button
        variant="outlined"
        leadingIcon="launch"
        onClick={() => actions.onOpenDoc(`${data.doc} ${data.ref}`)}
      >
        {data.openLabel}
      </Button>
    </WidgetCard>
  )
}

function Comparison({ data }: { data: ComparisonData }) {
  return (
    <WidgetCard type="comparison">
      <div style={{ overflowX: 'auto' }}>
        <table className="cmp-table">
          <thead>
            <tr>
              {data.columns.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, i) => (
              <tr key={i} data-current={row.current ? 'true' : undefined}>
                {row.cells.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetCard>
  )
}

function NeedsAttention({ data }: { data: NeedsAttentionData }) {
  return (
    <WidgetCard type="needs_attention">
      <div className="risk-list">
        {data.risks.map((r, i) => (
          <div className="risk-item" key={i}>
            <div className="risk-head">
              <span className={`risk-badge risk-badge--${r.severity.toLowerCase()}`}>
                <Icon name={r.severity === 'High' ? 'warning' : 'info'} size={14} />
                {r.severity}
              </span>
              <span className="risk-title">{r.title}</span>
            </div>
            <p className="risk-desc">{r.desc}</p>
            <span className="risk-ref">{r.ref}</span>
          </div>
        ))}
      </div>
    </WidgetCard>
  )
}

function RelatedDocuments({ data, actions }: { data: RelatedDocsData; actions: WidgetActions }) {
  return (
    <WidgetCard type="related_documents">
      <div>
        {data.docs.map((d) => (
          <div className="doc-row" key={d.title}>
            <div className="doc-row__main">
              <span className="doc-row__titlerow">
                <button type="button" className="doc-row__title" onClick={() => actions.onOpenDoc(d.title)}>
                  {d.title}
                </button>
                {d.tag ? <span className="doc-row__tag">{d.tag}</span> : null}
              </span>
              <span className="doc-row__sub">{d.sub}</span>
            </div>
            <span className="doc-row__date">{d.date}</span>
          </div>
        ))}
      </div>
    </WidgetCard>
  )
}

function Timeline({ data }: { data: TimelineData }) {
  return (
    <WidgetCard type="timeline">
      <div className="timeline">
        {data.nodes.map((n, i) => (
          <div className="timeline__node" key={n.year} data-current={n.current ? 'true' : undefined}>
            <div className="timeline__track">
              <span className="timeline__dot" />
              <span className={`timeline__line${i === data.nodes.length - 1 ? ' timeline__line--hidden' : ''}`} />
            </div>
            <span className="timeline__year">{n.year}</span>
            <span className="timeline__desc">{n.desc}</span>
          </div>
        ))}
      </div>
    </WidgetCard>
  )
}

function KeyContacts({ data }: { data: KeyContactsData }) {
  return (
    <WidgetCard type="key_contacts">
      <div>
        {data.contacts.map((c) => (
          <div className="contact-row" key={c.name}>
            <span className="avatar">{c.initials}</span>
            <div className="contact-row__main">
              <span className="contact-row__name">{c.name}</span>
              <span className="contact-row__role">{c.role}</span>
            </div>
            <span className="tag tag--neutral">
              <span className="tag__dot" />
              {c.tag}
            </span>
          </div>
        ))}
      </div>
    </WidgetCard>
  )
}

function SuggestedFollowups({ data, actions }: { data: FollowupsData; actions: WidgetActions }) {
  return (
    <div className="followups">
      <span className="followups__label">Suggested follow-ups</span>
      <div className="followups__row">
        {data.items.map((item) => (
          <button type="button" className="followup-chip" key={item} onClick={() => actions.onAsk(item)}>
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}

function Clarification({ data, actions }: { data: ClarificationData; actions: WidgetActions }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  function submit(id: string | null) {
    if (sent) return
    const option = data.options.find((o) => o.id === id) ?? data.options[0]
    setSelected(option.id)
    setSent(true)
    actions.onClarify?.(option.title)
  }

  return (
    <section className="clarify" aria-label="Need your input">
      <span className="clarify__eyebrow">Need your input</span>
      <p className="clarify__prompt">{data.prompt}</p>

      <div className="clarify__card">
        <span className="clarify__heading">{data.heading}</span>
        <div className="clarify__options" role="radiogroup" aria-label={data.heading}>
          {data.options.map((o) => (
            <label key={o.id} className={`clarify-option${selected === o.id ? ' clarify-option--on' : ''}`}>
              <input
                type="radio"
                name="clarify"
                className="clarify-option__radio"
                checked={selected === o.id}
                disabled={sent}
                onChange={() => setSelected(o.id)}
              />
              <span className="clarify-option__body">
                <span className="clarify-option__title">{o.title}</span>
                <span className="clarify-option__meta">{o.meta}</span>
              </span>
            </label>
          ))}
        </div>

        <div className="clarify__actions">
          <button
            type="button"
            className="sat-btn sat-btn--outlined"
            disabled={sent}
            onClick={() => submit(null)}
          >
            Decide for me
          </button>
          <button
            type="button"
            className="sat-btn sat-btn--filled"
            disabled={sent || selected === null}
            onClick={() => submit(selected)}
          >
            Send Answer
          </button>
        </div>
      </div>
    </section>
  )
}

function DraftPreview({ data }: { data: DraftPreviewData }) {
  function copyDraft() {
    const text = `To: ${data.to}\nSubject: ${data.subject}\n\n${data.body.join('\n\n')}`
    void navigator.clipboard?.writeText(text)
  }

  return (
    <section className="draft-card" aria-label="Draft message">
      <div className="draft-card__head">
        <span className="draft-card__label">Draft</span>
        <span className="draft-chip">{data.status}</span>
      </div>

      <div className="draft-fields">
        <div className="draft-field">
          <span className="draft-field__label">To</span>
          <span className="draft-field__value">{data.to}</span>
        </div>
        <div className="draft-field">
          <span className="draft-field__label">Subject</span>
          <span className="draft-field__value">{data.subject}</span>
        </div>
      </div>

      <hr className="draft-divider" />

      <div className="draft-body">
        {data.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="draft-actions">
        <button type="button" className="sat-btn sat-btn--outlined sat-btn--sm" onClick={copyDraft}>
          <Icon name="copy" size={16} />
          Copy
        </button>
        <button type="button" className="sat-btn sat-btn--outlined sat-btn--sm">
          <Icon name="edit" size={16} />
          Edit
        </button>
      </div>
    </section>
  )
}

/** Registry: render any WidgetSpec. New widget types plug in here. */
export function renderWidget(spec: WidgetSpec, key: number, actions: WidgetActions): ReactNode {
  switch (spec.type) {
    case 'clarification':
      return <Clarification key={key} data={spec.data} actions={actions} />
    case 'draft_preview':
      return <DraftPreview key={key} data={spec.data} />
    case 'what_matters':
      return <WhatMatters key={key} data={spec.data} actions={actions} />
    case 'key_facts':
      return <KeyFacts key={key} data={spec.data} />
    case 'clause_excerpt':
      return <ClauseExcerpt key={key} data={spec.data} actions={actions} />
    case 'comparison':
      return <Comparison key={key} data={spec.data} />
    case 'needs_attention':
      return <NeedsAttention key={key} data={spec.data} />
    case 'related_documents':
      return <RelatedDocuments key={key} data={spec.data} actions={actions} />
    case 'timeline':
      return <Timeline key={key} data={spec.data} />
    case 'key_contacts':
      return <KeyContacts key={key} data={spec.data} />
    case 'suggested_followups':
      return <SuggestedFollowups key={key} data={spec.data} actions={actions} />
    default:
      return null
  }
}
