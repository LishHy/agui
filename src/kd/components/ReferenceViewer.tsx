import { useEffect } from 'react'
import { Icon } from '../../icons'
import { IconButton } from '../../components/IconButton'
import { SourceViewer } from './SourceViewer'
import type { Reference, Source } from '../data/answer'

interface ViewerProps {
  references: Reference[]
  index: number
  onNavigate: (index: number) => void
  onClose: () => void
  onOpenDoc: (label: string) => void
  onCompare: (source: Source) => void
}

/** Derivation viewer for an AI-inference reference. */
function InferenceViewer({ references, index, onNavigate, onClose }: Omit<ViewerProps, 'onOpenDoc' | 'onCompare'>) {
  const ref = references[index]
  const inf = ref.kind === 'inference' ? ref.inference : null

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!inf) return null

  return (
    <section className="inf-viewer" aria-label={`AI inference: ${inf.title}`}>
      <header className="inf-header">
        <span className="inf-title">
          <span className="inf-title__spark">
            <Icon name="sparkle" size={18} />
          </span>
          <span className="inf-title__text">
            <span className="inf-title__name">{inf.title}</span>
            <span className="inf-title__sub">AI inference · Derivation</span>
          </span>
        </span>
        <span className="inf-pager">
          <span className="sv-pager__label" aria-live="polite">
            {index + 1} of {references.length}
          </span>
          <IconButton icon="chevronUp" label="Previous reference" disabled={index === 0} onClick={() => onNavigate(index - 1)} />
          <IconButton
            icon="chevronDown"
            label="Next reference"
            disabled={index === references.length - 1}
            onClick={() => onNavigate(index + 1)}
          />
        </span>
        <span className="sv-spacer" />
        <IconButton icon="close" label="Close" onClick={onClose} />
      </header>

      <div className="inf-body">
        <span className="inf-badge">
          <Icon name="sparkle" size={14} /> AI inference · Confidence {inf.confidence}
        </span>

        <div className="inf-card">
          <div className="inf-block">
            <span className="inf-label">Statement</span>
            <p className="inf-statement">{inf.statement}</p>
          </div>

          <div className="inf-block">
            <div className="inf-row">
              <span className="inf-label">How it was reached</span>
              <span className="inf-conf">Confidence: {inf.confidence}</span>
            </div>
            <p className="inf-method">{inf.method}</p>
            {inf.calc ? (
              <div className="inf-calc">
                <span className="inf-calc__expr">{inf.calc.expr}</span>
                <span className="inf-calc__res">{inf.calc.result}</span>
              </div>
            ) : null}
          </div>

          <div className="inf-block">
            <div className="inf-row">
              <span className="inf-label">Data points</span>
              <span className="inf-count">{inf.dataPoints.length}</span>
            </div>
            <ul className="inf-dps">
              {inf.dataPoints.map((dp, i) => {
                const target = dp.refIndex != null ? references[dp.refIndex] : null
                return (
                  <li className="inf-dp" key={i}>
                    <div className="inf-dp__row">
                      <span className="inf-dp__label">{dp.label}</span>
                      <span className="inf-dp__value">{dp.value}</span>
                    </div>
                    {target ? (
                      <button type="button" className="inf-dp__link" onClick={() => onNavigate(dp.refIndex!)}>
                        <Icon name={target.kind === 'inference' ? 'sparkle' : 'contract'} size={14} />
                        {target.kind === 'inference'
                          ? `Inference ${dp.refIndex! + 1}`
                          : `Source ${dp.refIndex! + 1}`}
                      </button>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Renders the right viewer for a reference — a document source or an AI inference. */
export function ReferenceViewer(props: ViewerProps) {
  const ref = props.references[props.index]
  if (ref.kind === 'source') return <SourceViewer {...props} />
  return (
    <InferenceViewer
      references={props.references}
      index={props.index}
      onNavigate={props.onNavigate}
      onClose={props.onClose}
    />
  )
}
