import { Icon } from '../../icons'
import { IconButton } from '../../components/IconButton'

const TABS = ['Home', 'Management', 'System Integrations', 'Ontologies']

interface TopBarProps {
  activeTab?: string
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

/** KD top bar (title, AI-generated pill, Hyland wordmark) + primary tabs. */
export function TopBar({ activeTab = 'Home', theme, onToggleTheme }: TopBarProps) {
  return (
    <>
      <div className="kd-topbar">
        <span className="kd-topbar__title">Knowledge Discovery</span>
        <div className="kd-topbar__center">
          <span className="ai-pill">
            <Icon name="sparkle" size={16} /> AI generated · sample data
          </span>
        </div>
        <div className="kd-topbar__right">
          <span className="hyland-wordmark">HYLAND</span>
          <IconButton
            icon={theme === 'dark' ? 'sun' : 'moon'}
            label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={onToggleTheme}
          />
          <IconButton icon="settings" label="Settings" />
        </div>
      </div>
      <div className="kd-tabs" role="tablist" aria-label="Sections">
        {TABS.map((t) => (
          <button key={t} type="button" role="tab" aria-selected={t === activeTab} className="kd-tab">
            {t}
          </button>
        ))}
      </div>
    </>
  )
}
