import { useId } from 'react'
import { Icon } from '../icons'

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  label: string
  placeholder?: string
  /** Hide the visible label (still announced to assistive tech). */
  hideLabel?: boolean
  compact?: boolean
}

/** Search input (Form field themed by Satori, B2). Always has a programmatic label. */
export function SearchField({
  value,
  onChange,
  onSubmit,
  label,
  placeholder,
  hideLabel,
  compact,
}: SearchFieldProps) {
  const id = useId()
  return (
    <div className={`search-field${compact ? ' search-field--compact' : ''}`}>
      <label htmlFor={id} className={hideLabel ? 'sr-only' : 'search-field__label'}>
        {label}
      </label>
      <div className="search-field__control">
        <Icon name="search" size={20} className="search-field__icon" />
        <input
          id={id}
          type="search"
          role="searchbox"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit?.()
          }}
        />
      </div>
    </div>
  )
}
