import { useEffect, useMemo, useRef, useState } from 'react'
import { Icon, type IconName } from '../../icons'
import { IconButton } from '../../components/IconButton'
import { Button } from '../../components/Button'
import type { Reference, Source } from '../data/answer'
import { ACCOUNT_GRAPH, type GEntity, type NodeKind } from '../data/graph'

interface SourceViewerProps {
  references: Reference[]
  index: number
  onNavigate: (index: number) => void
  onClose: () => void
  onOpenDoc: (label: string) => void
}

type View = 'document' | 'graph'

// Kind colours map to Satori semantic role tokens (no raw hex).
const KIND: Record<NodeKind, { name: string; color: string; icon: IconName }> = {
  document: { name: 'Document', color: 'var(--md-sys-color-primary)', icon: 'contract' },
  object: { name: 'Business Object', color: 'var(--md-sys-color-success)', icon: 'building' },
  entity: { name: 'Entity', color: 'var(--md-sys-color-warning)', icon: 'person' },
  conversation: { name: 'Conversation', color: 'var(--md-sys-color-on-surface-variant)', icon: 'sparkle' },
}
const LEGEND = Object.values(KIND)

interface Para {
  parts?: { before: string; hit: string; after: string }
  text?: string
  ref?: { page: number; label: string }
}

function buildParas(s: Source): Para[] {
  return [
    { parts: s.excerpt, ref: { page: 2, label: `Supports the ${s.ref} terms` } },
    {
      text: 'This document records the commercial terms between Hyland and Northwind Logistic Ltd, including fees, renewal, liability and termination. Figures and effective dates reflect the signed execution copy held in the content lake.',
    },
    {
      text: 'Any change to the pricing mechanism takes effect on the next renewal date and must be notified in writing within the agreed notice period. Superseded terms remain on file for audit.',
      ref: { page: 5, label: 'Change and notice' },
    },
    {
      text: 'Supplemental order forms and rate cards are attached in the appendix and indexed in the content lake under the document ID shown in the source panel.',
    },
    {
      text: 'Earlier orders that predate this amendment may still reference the superseded index. Reconcile any conflicting figures against the executed copy before repricing.',
      ref: { page: 9, label: 'Conflicts and exclusions' },
    },
  ]
}

function paraText(p: Para): string {
  return p.parts ? `${p.parts.before}${p.parts.hit}${p.parts.after}` : (p.text ?? '')
}

function ParaBody({ p }: { p: Para }) {
  if (!p.parts) return <>{p.text}</>
  return (
    <>
      {p.parts.before}
      <strong>{p.parts.hit}</strong>
      {p.parts.after}
    </>
  )
}

interface PlacedNode {
  id: string
  kind: NodeKind
  label: string
  sub: string
  x: number
  y: number
  center?: boolean
  expandable?: boolean
  expanded?: boolean
}
interface PlacedEdge {
  x1: number
  y1: number
  x2: number
  y2: number
  label: string
  mx: number
  my: number
  deg: number
}

export function SourceViewer({ references, index, onNavigate, onClose, onOpenDoc }: SourceViewerProps) {
  const s = (references[index] as Extract<Reference, { kind: 'source' }>).source
  const paras = useMemo(() => buildParas(s), [s])
  const refIdxs = useMemo(() => paras.flatMap((p, i) => (p.ref ? [i] : [])), [paras])

  const [view, setView] = useState<View>(() =>
    new URLSearchParams(window.location.search).get('tab') === 'graph' ? 'graph' : 'document',
  )
  const [refPos, setRefPos] = useState(0)
  const [page, setPage] = useState(paras[refIdxs[0]].ref!.page)
  const [zoom, setZoom] = useState(100)
  const [scoped, setScoped] = useState(false)
  const paraEls = useRef<(HTMLParagraphElement | null)[]>([])

  // ---- Graph state ----
  const graph = ACCOUNT_GRAPH
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const e = new URLSearchParams(window.location.search).get('exp')
    return e ? new Set(e.split(',')) : new Set()
  })
  const [gzoom, setGzoom] = useState(0.8)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{ sx: number; sy: number; px: number; py: number } | null>(null)

  const collection = s.collection ?? 'Contracts'
  const pages = s.pages ?? 18
  const updated = s.updated ?? '10 Jan 2025'

  useEffect(() => {
    setRefPos(0)
    setPage(paras[refIdxs[0]].ref!.page)
    setZoom(100)
    setScoped(false)
    setGzoom(0.8)
    setPan({ x: 0, y: 0 })
  }, [index, paras, refIdxs])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  function goRef(pos: number) {
    const p = (pos + refIdxs.length) % refIdxs.length
    setRefPos(p)
    setPage(paras[refIdxs[p]].ref!.page)
    paraEls.current[refIdxs[p]]?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }
  const zoomTo = (z: number) => setZoom(Math.min(200, Math.max(50, Math.round(z))))

  function toggleRel(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // ---- Radial layout ----
  const { nodes, edges } = useMemo(() => {
    const R = 215
    const R2 = 150
    const ns: PlacedNode[] = [
      { ...graph.center, x: 0, y: 0, center: true },
    ]
    const es: PlacedEdge[] = []
    const N = graph.relations.length
    const pushEdge = (x1: number, y1: number, x2: number, y2: number, label: string) => {
      let deg = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
      if (deg > 90) deg -= 180
      if (deg < -90) deg += 180
      es.push({ x1, y1, x2, y2, label, mx: (x1 + x2) / 2, my: (y1 + y2) / 2, deg })
    }
    graph.relations.forEach((rel, i) => {
      const t = -Math.PI / 2 + (i * 2 * Math.PI) / N
      const x = Math.cos(t) * R
      const y = Math.sin(t) * R
      const isExp = expanded.has(rel.id)
      ns.push({
        id: rel.id,
        kind: rel.kind,
        label: rel.label,
        sub: rel.sub,
        x,
        y,
        expandable: !!rel.children?.length,
        expanded: isExp,
      })
      pushEdge(0, 0, x, y, rel.rel)
      if (isExp && rel.children) {
        const M = rel.children.length
        rel.children.forEach((c: GEntity, j) => {
          const spread = 0.42
          const ct = t + (j - (M - 1) / 2) * spread
          const cx = x + Math.cos(ct) * R2
          const cy = y + Math.sin(ct) * R2
          ns.push({ id: c.id, kind: c.kind, label: c.label, sub: c.sub, x: cx, y: cy })
          pushEdge(x, y, cx, cy, c.rel)
        })
      }
    })
    return { nodes: ns, edges: es }
  }, [graph, expanded])

  // ---- Pan ----
  function onCanvasDown(e: React.MouseEvent) {
    dragRef.current = { sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y }
  }
  useEffect(() => {
    function move(e: MouseEvent) {
      const d = dragRef.current
      if (!d) return
      setPan({ x: d.px + (e.clientX - d.sx), y: d.py + (e.clientY - d.sy) })
    }
    function up() {
      dragRef.current = null
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
  }, [])

  const centerKind = KIND[graph.center.kind]

  return (
    <section className="source-viewer" aria-label={`Source: ${s.label}`}>
      <header className="sv-header">
        <div className="sv-nav">
          <Button variant="text" leadingIcon="arrowLeft" onClick={onClose}>
            Sources
          </Button>
          <span className="sv-nav-divider" aria-hidden="true" />
          <div className="sv-pager" role="group" aria-label="Browse sources">
            <IconButton
              icon="chevronLeft"
              label="Previous source"
              disabled={index === 0}
              onClick={() => onNavigate(index - 1)}
            />
            <span className="sv-pager__label" aria-live="polite">
              Source {index + 1} of {references.length}
            </span>
            <IconButton
              icon="chevronRight"
              label="Next source"
              disabled={index === references.length - 1}
              onClick={() => onNavigate(index + 1)}
            />
          </div>
          <span className="sv-spacer" />
          <IconButton icon="close" label="Close source" onClick={onClose} />
        </div>

        <div className="sv-title">
          <span className="sv-title__icon">
            <Icon name="contract" size={20} />
          </span>
          <div className="sv-title__text">
            <h2 className="sv-title__name" title={s.label}>
              {s.label}
            </h2>
            <p className="sv-title__meta">
              {collection} · {s.provider} · {pages} pages · Updated {updated}
            </p>
          </div>
          <Button
            variant="tonal"
            leadingIcon={scoped ? 'success' : 'sparkle'}
            onClick={() => setScoped((v) => !v)}
          >
            {scoped ? 'Asking about this document' : 'Ask about this document'}
          </Button>
        </div>
      </header>

      <div className="sv-tabs" role="tablist" aria-label="Explore source">
        {(['document', 'graph'] as const).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={view === key}
            className="sv-tab"
            onClick={() => setView(key)}
          >
            <Icon name={key === 'document' ? 'file' : 'graph'} size={18} />
            {key === 'document' ? 'Document' : 'Graph'}
          </button>
        ))}
      </div>

      {view === 'document' ? (
        <div className="sv-doc">
          <div className="sv-main">
            <div className="sv-refbar">
              <span aria-live="polite">
                Reference {refPos + 1} of {refIdxs.length}
              </span>
              <IconButton icon="chevronUp" label="Previous reference" onClick={() => goRef(refPos - 1)} />
              <IconButton icon="chevronDown" label="Next reference" onClick={() => goRef(refPos + 1)} />
            </div>

            <div className="sv-pages">
              <article className="sv-page" style={{ fontSize: `calc(1rem * ${zoom / 100})` }}>
                {paras.map((p, i) => {
                  const isRef = !!p.ref
                  const isCurrent = refIdxs[refPos] === i
                  return (
                    <p
                      key={i}
                      ref={(el) => {
                        paraEls.current[i] = el
                      }}
                      className={isRef ? `sv-ref${isCurrent ? ' is-current' : ''}` : undefined}
                      onClick={isRef ? () => goRef(refIdxs.indexOf(i)) : undefined}
                    >
                      <ParaBody p={p} />
                    </p>
                  )
                })}
              </article>
            </div>

            <div className="sv-toolbar" role="toolbar" aria-label="Document controls">
              <div className="sv-tool-group">
                <IconButton icon="chevronLeft" label="Previous page" disabled={page <= 1} onClick={() => setPage(page - 1)} />
                <span className="sv-tool-value">
                  {page} / {pages}
                </span>
                <IconButton icon="chevronRight" label="Next page" disabled={page >= pages} onClick={() => setPage(page + 1)} />
              </div>
              <span className="sv-tool-divider" aria-hidden="true" />
              <div className="sv-tool-group">
                <IconButton icon="minus" label="Zoom out" disabled={zoom <= 50} onClick={() => zoomTo(zoom - 10)} />
                <span className="sv-tool-value">{zoom}%</span>
                <IconButton icon="plus" label="Zoom in" disabled={zoom >= 200} onClick={() => zoomTo(zoom + 10)} />
              </div>
              <span className="sv-spacer" />
              <IconButton icon="arrowsH" label="Fit to width" onClick={() => zoomTo(110)} />
              <IconButton icon="maximize" label="Fit page" onClick={() => zoomTo(80)} />
            </div>
          </div>

          <aside className="sv-refs" aria-label="References">
            <div className="sv-refs__head">
              <h3>References</h3>
              <span className="sv-refs__count">{refIdxs.length}</span>
            </div>
            <ol className="sv-refs__list">
              {refIdxs.map((pi, i) => (
                <li key={pi}>
                  <button
                    type="button"
                    className={`sv-ref-card${i === refPos ? ' is-current' : ''}`}
                    aria-current={i === refPos ? 'true' : undefined}
                    onClick={() => goRef(i)}
                  >
                    <span className="sv-ref-card__head">
                      <span className="sv-ref-card__index">{i + 1}</span>
                      <span className="sv-ref-card__label">{paras[pi].ref!.label}</span>
                      <span className="sv-ref-card__page">p. {paras[pi].ref!.page}</span>
                    </span>
                    <span className="sv-ref-card__text">
                      {paras[pi].parts ? (
                        <>
                          {paras[pi].parts!.before}
                          <strong>{paras[pi].parts!.hit}</strong>
                          {paras[pi].parts!.after}
                        </>
                      ) : (
                        paraText(paras[pi])
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      ) : (
        <div className="sv-graph">
          <div className="sv-graph__canvas" onMouseDown={onCanvasDown}>
            <div className="sv-graph__legend">
              {LEGEND.map((l) => (
                <span key={l.name} className="g-legend">
                  <span className="g-dot" style={{ background: l.color }} />
                  {l.name}
                </span>
              ))}
            </div>

            <div
              className="g-world"
              style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${gzoom})` }}
            >
              <svg className="g-edges" aria-hidden="true">
                {edges.map((e, i) => (
                  <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} />
                ))}
              </svg>
              {edges.map((e, i) => (
                <span
                  key={`l${i}`}
                  className="g-elabel"
                  style={{ left: e.mx, top: e.my, transform: `translate(-50%,-50%) rotate(${e.deg}deg)` }}
                >
                  {e.label}
                </span>
              ))}
              {nodes.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className={`g-node${n.center ? ' is-center' : ''}${n.expanded ? ' is-expanded' : ''}`}
                  style={{ left: n.x, top: n.y }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => n.expandable && toggleRel(n.id)}
                  title={n.label}
                >
                  <span className="g-node__icon" style={{ color: KIND[n.kind].color }}>
                    <Icon name={KIND[n.kind].icon} size={14} />
                  </span>
                  <span className="g-node__text">
                    <span className="g-node__label">{n.label}</span>
                    <span className="g-node__sub">{n.sub}</span>
                  </span>
                  {n.expandable ? (
                    <span className="g-node__action" aria-hidden="true">
                      <Icon name={n.expanded ? 'minus' : 'plus'} size={14} />
                    </span>
                  ) : null}
                </button>
              ))}
            </div>

            <span className="sv-graph__hint">Click a node to expand its connections · drag to pan</span>

            <div className="sv-graph__zoom">
              <IconButton icon="plus" label="Zoom in" onClick={() => setGzoom((z) => Math.min(1.6, +(z + 0.1).toFixed(2)))} />
              <IconButton icon="minus" label="Zoom out" onClick={() => setGzoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))} />
              <IconButton
                icon="history"
                label="Reset view"
                onClick={() => {
                  setGzoom(0.8)
                  setPan({ x: 0, y: 0 })
                }}
              />
            </div>
          </div>

          <aside className="sv-graph__side" aria-label="Node details">
            <span className="g-kind" style={{ color: centerKind.color }}>
              {centerKind.name}
            </span>
            <h3 className="g-node-title">{graph.center.label}</h3>
            <p className="g-node-sub">{graph.center.sub}</p>
            <p className="g-node-desc">{graph.center.desc}</p>

            <h4 className="g-rel-head">Immediate relations ({graph.relations.length})</h4>
            <p className="g-rel-note">
              Expand a relation, here or in the graph, to see what connects through it.
            </p>
            <ul className="g-rel-list">
              {graph.relations.map((r) => {
                const isExp = expanded.has(r.id)
                const hasChildren = !!r.children?.length
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      className={`g-rel-row${isExp ? ' is-expanded' : ''}`}
                      aria-expanded={hasChildren ? isExp : undefined}
                      onClick={() => hasChildren && toggleRel(r.id)}
                    >
                      <span className="g-rel-chevron">
                        {hasChildren ? <Icon name="chevronRight" size={16} /> : null}
                      </span>
                      <span className="g-rel-icon" style={{ color: KIND[r.kind].color }}>
                        <Icon name={KIND[r.kind].icon} size={16} />
                      </span>
                      <span className="g-rel-text">
                        <span className="g-rel-label">{r.label}</span>
                        <span className="g-rel-sub">
                          {r.rel} · {r.sub}
                        </span>
                      </span>
                      {hasChildren ? <span className="g-rel-count">{r.children!.length}</span> : null}
                    </button>
                    {isExp && r.children ? (
                      <ul className="g-rel-children">
                        {r.children.map((c) => (
                          <li key={c.id}>
                            <div className="g-rel-row is-child">
                              <span className="g-rel-chevron" />
                              <span className="g-rel-icon" style={{ color: KIND[c.kind].color }}>
                                <Icon name={KIND[c.kind].icon} size={16} />
                              </span>
                              <span className="g-rel-text">
                                <span className="g-rel-label">{c.label}</span>
                                <span className="g-rel-sub">
                                  {c.rel} · {c.sub}
                                </span>
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </aside>
        </div>
      )}

      <footer className="sv-footer">
        <Button variant="outlined" leadingIcon="launch" onClick={() => onOpenDoc(`${s.label} ${s.ref}`)}>
          Open document
        </Button>
        {s.docId ? (
          <span className="sv-docid">
            <strong>Content Lake DOC ID:</strong> {s.docId}
          </span>
        ) : null}
      </footer>
    </section>
  )
}
