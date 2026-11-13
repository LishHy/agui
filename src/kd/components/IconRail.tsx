import { Icon } from '../../icons'
import navLogo from '../../assets/nav-logo.png'

const WORKSPACES = ['WS', 'KD', 'CF', 'AS', 'IR', 'UM', 'HR', 'CC']

/** Far-left product rail + workspace switcher (brand chrome). */
export function IconRail() {
  return (
    <nav className="icon-rail" aria-label="Workspaces">
      <span className="icon-rail__logo" aria-hidden="true">
        <img className="icon-rail__logo-img" src={navLogo} alt="" width={26} height={26} />
      </span>
      <button type="button" className="rail-btn" aria-label="Home">
        <Icon name="dashboard" size={20} />
      </button>
      <ul className="icon-rail__switcher">
        {WORKSPACES.map((w) => (
          <li key={w}>
            <button
              type="button"
              className="ws-chip"
              aria-current={w === 'KD' ? 'true' : undefined}
              aria-label={`Workspace ${w}`}
            >
              {w}
            </button>
          </li>
        ))}
      </ul>
      <span className="icon-rail__spacer" />
      <span className="rail-avatar" role="img" aria-label="Your account" />
    </nav>
  )
}
