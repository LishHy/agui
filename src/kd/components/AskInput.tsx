import { useState } from 'react'
import { Icon } from '../../icons'
import { DOC_SCOPE } from '../data/home'

interface AskInputProps {
  onSubmit: (question: string) => void
  placeholder?: string
  docked?: boolean
}

/**
 * Ask-a-question input. Used both as the home prompt (with a document-scope
 * dropdown) and docked at the bottom of an answer (with attach + filters).
 */
export function AskInput({ onSubmit, placeholder, docked }: AskInputProps) {
  const [value, setValue] = useState('')

  function submit() {
    const q = value.trim()
    if (!q) return
    onSubmit(q)
    setValue('')
  }

  return (
    <div className={`ask-card${docked ? ' ask-card--docked' : ''}`}>
      <textarea
        aria-label="Ask a question"
        placeholder={placeholder}
        value={value}
        rows={docked ? 1 : 2}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            submit()
          }
        }}
      />
      <div className="ask-card__footer">
        {docked ? (
          <>
            <button type="button" className="icon-btn" aria-label="Add attachment">
              <Icon name="plus" size={20} />
            </button>
            <button type="button" className="scope-dropdown">
              <Icon name="tune" size={16} /> Filters
            </button>
          </>
        ) : (
          <button type="button" className="scope-dropdown">
            {DOC_SCOPE} <Icon name="chevronDown" size={16} />
          </button>
        )}
        <span className="ask-card__spacer" />
        <button
          type="button"
          className="ask-send"
          aria-label="Send question"
          disabled={!value.trim()}
          onClick={submit}
        >
          <Icon name="arrowUp" size={20} />
        </button>
      </div>
    </div>
  )
}
