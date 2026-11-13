import { useEffect, useMemo, useRef, useState } from 'react'
import { Icon, type IconName } from '../../icons'
import { IconButton } from '../../components/IconButton'
import type { AnswerPlan, Reference } from '../data/answer'
import type { NodeKind } from '../data/graph'

interface SourcesGraphProps {
  plan: AnswerPlan
  references: Reference[]
  onBack: () => void
}

// Kind colours map to Satori semantic role tokens (shared with the source graph).
const KIND: Record<NodeKind, { name: string; color: string; icon: IconName }> = {
  document: { name: 'Document', color: 'var(--md-sys-color-primary)', icon: 'contract' },
  object: { name: 'Business Object', color: 'var(--md-sys-color-success)', icon: 'building' },
  entity: { name: 'Entity', color: 'var(--md-sys-color-warning)', icon: 'person' },
  conversation: { name: 'Conversation', color: 'var(--md-sys-color-on-surface-variant)', icon: 'sparkle' },
}
const LEGEND = Object.values(KIND)

interface GChild {
  id: string
  kind: NodeKind
  label: string
  sub: string
  rel: string
}
interface GNode {
  id: string
  kind: NodeKind
  label: string
  sub: string
  count: number
  children: GChild[]
}
interface GEdge {
  x1: number
  y1: number
  x2: number
  y2: number
  label: string
  mx: number
  my: number
  deg: number
}
interface PlacedNode extends GNode {
  x: number
  y: number
  center?: boolean
  expandable?: boolean
  expanded?: boolean
  isChild?: boolean
}

/**
 * A conversation-centric knowledge graph: every cited source connects to the
 * question at the centre, and each node can be expanded to reveal the entities
 * and documents connected within it. Left is the pannable/zoomable canvas; right
 * lists the connections and shared-entity counts.
 */
export function SourcesGraph({ plan, references, onBack }: SourcesGraphProps) {
  const sources = references.filter((r) => r.kind === 'source')

  // Build the graph nodes: a document node per cited source (each expanding to
  // its cited section) plus the shared business object the answer is about
  // (expanding to its connected agreements, owners and entities).
  const graphNodes = useMemo<GNode[]>(() => {
    const docs: GNode[] = sources.map((r, i) => {
      const s = r.kind === 'source' ? r.source : null
      return {
        id: `src-${i}`,
        kind: 'document',
        label: `[${i + 1}] ${s?.label ?? 'Source'}`,
        sub: (s?.provider ?? 'Source').toUpperCase(),
        count: 2 + ((i * 2 + 1) % 3),
        children: [
          { id: `src-${i}-ref`, kind: 'entity', label: s?.ref ?? 'Cited section', sub: 'Cited section', rel: 'cites' },
          { id: `src-${i}-doc`, kind: 'object', label: plan.entity || 'Account', sub: 'Business object', rel: 'about' },
        ],
      }
    })
    const object: GNode = {
      id: 'object',
      kind: 'object',
      label: plan.entity || 'Business object',
      sub: 'BUSINESS OBJECT',
      count: 4,
      children: [
        { id: 'obj-owner', kind: 'entity', label: 'Dana Reyes', sub: 'Owner', rel: 'owned by' },
        { id: 'obj-msa', kind: 'document', label: 'Master Services Agreement', sub: 'Contract', rel: 'signed' },
        { id: 'obj-sow3', kind: 'document', label: 'SOW 3 — Workflow expansion', sub: 'Statement of work', rel: 'includes' },
        { id: 'obj-policy', kind: 'entity', label: 'Policy PL-20931', sub: 'Policy group', rel: 'under' },
      ],
    }
    return [...docs, object]
  }, [sources, plan.entity])

  const sharedEntities = Math.max(1, Math.round(graphNodes.length * 0.8))

  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [zoom, setZoom] = useState(0.9)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{ sx: number; sy: number; px: number; py: number } | null>(null)

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onBack()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onBack])

  // Radial layout: the conversation at the origin, nodes on a ring, and each
  // expanded node fans its children outward around it.
  const { nodes, edges } = useMemo(() => {
    const R = 230
    const R2 = 150
    const conv: PlacedNode = {
      id: 'conv',
      kind: 'conversation',
      label: 'This conversation',
      sub: 'QUESTION',
      count: 0,
      children: [],
      center: true,
      x: 0,
      y: 0,
    }
    const ns: PlacedNode[] = [conv]
    const es: GEdge[] = []
    const pushEdge = (x1: number, y1: number, x2: number, y2: number, label: string) => {
      let deg = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
      if (deg > 90) deg -= 180
      if (deg < -90) deg += 180
      es.push({ x1, y1, x2, y2, label, mx: (x1 + x2) / 2, my: (y1 + y2) / 2, deg })
    }
    const N = graphNodes.length
    graphNodes.forEach((node, i) => {
      const t = -Math.PI / 2 + (i * 2 * Math.PI) / N
      const x = Math.cos(t) * R
      const y = Math.sin(t) * R
      const isExp = expanded.has(node.id)
      ns.push({ ...node, x, y, expandable: node.children.length > 0, expanded: isExp })
      pushEdge(0, 0, x, y, 'references')
      if (isExp) {
        const M = node.children.length
        node.children.forEach((c, j) => {
          const spread = 0.42
          const ct = t + (j - (M - 1) / 2) * spread
          const cx = x + Math.cos(ct) * R2
          const cy = y + Math.sin(ct) * R2
          ns.push({ id: c.id, kind: c.kind, label: c.label, sub: c.sub, count: 0, children: [], x: cx, y: cy, isChild: true })
          pushEdge(x, y, cx, cy, c.rel)
        })
      }
    })
    return { nodes: ns, edges: es }
  }, [graphNodes, expanded])

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

  return (
    <div className="sources-graph">
      <div className="sources-graph__bar">
        <button type="button" className="sources-graph__back" onClick={onBack}>
          <Icon name="arrowLeft" size={16} />
          Sources
        </button>
        <span className="sv-spacer" />
        <IconButton icon="close" label="Close graph" onClick={onBack} />
      </div>

      <div className="sources-graph__head">
        <span className="sources-graph__icon">
          <Icon name="graph" size={22} />
        </span>
        <div>
          <h2 className="sources-graph__title">Knowledge Graph</h2>
          <p className="sources-graph__sub">
            {sources.length} sources · “{plan.question}”
          </p>
        </div>
      </div>

      <div className="sv-graph sources-graph__body">
        <div className="sv-graph__canvas" onMouseDown={onCanvasDown}>
          <div className="sv-graph__legend">
            {LEGEND.map((l) => (
              <span key={l.name} className="g-legend">
                <span className="g-dot" style={{ background: l.color }} />
                {l.name}
              </span>
            ))}
          </div>

          <div className="g-world" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
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
                onClick={() => n.expandable && toggle(n.id)}
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
            <IconButton icon="plus" label="Zoom in" onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.1).toFixed(2)))} />
            <IconButton icon="minus" label="Zoom out" onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))} />
            <IconButton
              icon="history"
              label="Reset view"
              onClick={() => {
                setZoom(0.9)
                setPan({ x: 0, y: 0 })
              }}
            />
          </div>
        </div>

        <aside className="sv-graph__side" aria-label="Conversation details">
          <span className="g-kind" style={{ color: KIND.conversation.color }}>
            Conversation
          </span>
          <h3 className="g-node-title">“{plan.question}”</h3>
          <p className="g-node-desc">
            This graph maps every source cited in the answer and the shared entities that connect them —
            showing how the answer was assembled.
          </p>

          <div className="sg-stats">
            <div className="sg-stat">
              <span className="sg-stat__value">{sources.length}</span>
              <span className="sg-stat__label">References</span>
            </div>
            <div className="sg-stat">
              <span className="sg-stat__value">{sharedEntities}</span>
              <span className="sg-stat__label">Shared entities</span>
            </div>
          </div>

          <h4 className="g-rel-head">Connections ({graphNodes.length})</h4>
          <ul className="g-rel-list">
            {graphNodes.map((n) => {
              const isExp = expanded.has(n.id)
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    className={`g-rel-row${isExp ? ' is-expanded' : ''}`}
                    aria-expanded={n.children.length ? isExp : undefined}
                    onClick={() => n.children.length && toggle(n.id)}
                  >
                    <span className="g-rel-chevron">
                      {n.children.length ? <Icon name="chevronRight" size={16} /> : null}
                    </span>
                    <span className="g-rel-icon" style={{ color: KIND[n.kind].color }}>
                      <Icon name={KIND[n.kind].icon} size={16} />
                    </span>
                    <span className="g-rel-text">
                      <span className="g-rel-label">{n.label}</span>
                      <span className="g-rel-sub">references</span>
                    </span>
                    <span className="g-rel-count">{n.count}</span>
                  </button>
                  {isExp && n.children.length ? (
                    <ul className="g-rel-children">
                      {n.children.map((c) => (
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
    </div>
  )
}
