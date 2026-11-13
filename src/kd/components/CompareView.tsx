import { useState } from 'react'
import { Icon } from '../../icons'
import { DocPreview } from './DocPreview'
import { COMPARE_FILES, type CompareFile } from '../data/compare'
import type { Source } from '../data/answer'

interface CompareViewProps {
  /** The source the user opened Compare from — shown on the left. */
  source: Source
  onBack: () => void
}

/**
 * Full-page compare experience that replaces the conversation area: the open
 * source on the left, and on the right either the "Compare to" picker or a
 * second document preview for a side-by-side read.
 */
export function CompareView({ source, onBack }: CompareViewProps) {
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState<CompareFile | null>(null)

  const files = COMPARE_FILES.filter((f) => f.name.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <div className="compare-view">
      <div className="compare-view__bar">
        <button type="button" className="compare-view__back" onClick={onBack}>
          <Icon name="arrowLeft" size={16} />
          Back to conversation
        </button>
      </div>

      <div className="compare-view__panes">
        <DocPreview
          name={source.label}
          icon="contract"
          provider={source.provider}
          cited={source.excerpt}
          page={source.pages ? Math.min(3, source.pages) : 3}
          pages={source.pages ?? 12}
        />

        {picked ? (
          <DocPreview
            name={picked.name}
            icon={picked.icon}
            provider={picked.provider}
            cited={picked.cited}
            page={picked.page}
            pages={picked.pages}
            onClose={() => setPicked(null)}
          />
        ) : (
          <section className="compare-pick" aria-label="Compare to">
            <div className="compare-pick__head">
              <h2 className="compare-pick__title">Compare to</h2>
              <p className="compare-pick__sub">Choose a document or file to view side by side</p>
            </div>

            <div className="compare-pick__search">
              <Icon name="search" size={18} />
              <input
                type="text"
                className="compare-pick__input"
                placeholder="Search Content Lake for your own files"
                aria-label="Search Content Lake for your own files"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <span className="compare-pick__label">Suggested files</span>
            <ul className="compare-pick__list">
              {files.map((f) => (
                <li key={f.id}>
                  <button type="button" className="compare-file" onClick={() => setPicked(f)}>
                    <span className="compare-file__icon">
                      <Icon name={f.icon} size={22} />
                    </span>
                    <span className="compare-file__text">
                      <span className="compare-file__name">{f.name}</span>
                      <span className="compare-file__meta">{f.meta}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
