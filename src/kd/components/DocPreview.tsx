import { useState } from 'react'
import { Icon, type IconName } from '../../icons'
import { IconButton } from '../../components/IconButton'

interface DocPreviewProps {
  name: string
  icon: IconName
  provider: string
  cited: { before: string; hit: string; after: string }
  page: number
  pages: number
  onClose?: () => void
}

/**
 * A read-only document preview panel: header (name + provider), a page/zoom
 * toolbar, a rendered "page" with the cited-in-answer passage highlighted, and
 * a page footer. Used on both sides of the compare view.
 */
export function DocPreview({ name, icon, provider, cited, page, pages, onClose }: DocPreviewProps) {
  const [pg, setPg] = useState(page)
  const [zoom, setZoom] = useState(100)
  const zoomTo = (z: number) => setZoom(Math.min(200, Math.max(50, z)))

  return (
    <section className="doc-preview" aria-label={`Preview: ${name}`}>
      <header className="doc-preview__head">
        <span className="doc-preview__icon">
          <Icon name={icon} size={22} />
        </span>
        <div className="doc-preview__titles">
          <h2 className="doc-preview__name" title={name}>
            {name}
          </h2>
          <p className="doc-preview__provider">{provider} · Read-only preview</p>
        </div>
        <IconButton icon="launch" label="Open document" />
        {onClose ? <IconButton icon="close" label="Close preview" onClick={onClose} /> : null}
      </header>

      <div className="doc-preview__toolbar">
        <div className="doc-preview__pager">
          <IconButton icon="chevronUp" label="Previous page" disabled={pg <= 1} onClick={() => setPg(pg - 1)} />
          <span className="doc-preview__pageno">
            Page {pg} of {pages}
          </span>
          <IconButton icon="chevronDown" label="Next page" disabled={pg >= pages} onClick={() => setPg(pg + 1)} />
        </div>
        <span className="doc-preview__cited-chip">Cited passage · p.{page}</span>
        <span className="doc-preview__spacer" />
        <div className="doc-preview__zoom">
          <IconButton icon="minus" label="Zoom out" disabled={zoom <= 50} onClick={() => zoomTo(zoom - 10)} />
          <span className="doc-preview__zoomval">{zoom}%</span>
          <IconButton icon="plus" label="Zoom in" disabled={zoom >= 200} onClick={() => zoomTo(zoom + 10)} />
        </div>
      </div>

      <div className="doc-preview__body">
        <article className="doc-page" style={{ fontSize: `calc(1rem * ${zoom / 100})` }}>
          <span className="doc-page__eyebrow">{provider} · Source document</span>
          <h3 className="doc-page__title">{name}</h3>
          <p className="doc-page__text">
            This preview shows the section cited in the answer. The full document is held in the content
            lake and opens read-only for review.
          </p>

          <blockquote className="doc-page__cited">
            <span className="doc-page__cited-label">Cited in answer</span>
            <p>
              {cited.before}
              <mark>{cited.hit}</mark>
              {cited.after}
            </p>
          </blockquote>

          <p className="doc-page__text">
            Surrounding context and supplemental material are indexed in the content lake under the document
            ID shown in the source panel.
          </p>
        </article>
      </div>

      <footer className="doc-preview__foot">
        {provider} · Page {page}
      </footer>
    </section>
  )
}
