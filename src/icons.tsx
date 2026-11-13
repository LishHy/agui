/* -----------------------------------------------------------------------------
   Icon set — inline line icons (24px grid, stroke = currentColor).

   Satori gap: the real product uses the Satori Icon Library. These stand-ins
   keep a single consistent family (A7: do not mix icon families) and are marked
   decorative (aria-hidden) by default; controls that use an icon alone must
   provide their own accessible name (D3).
   -------------------------------------------------------------------------- */
import type { ReactNode } from 'react'

export type IconName =
  | 'search'
  | 'tune'
  | 'close'
  | 'folder'
  | 'file'
  | 'contract'
  | 'report'
  | 'sheet'
  | 'image'
  | 'person'
  | 'calendar'
  | 'download'
  | 'share'
  | 'trash'
  | 'dashboard'
  | 'apps'
  | 'settings'
  | 'help'
  | 'sun'
  | 'moon'
  | 'info'
  | 'warning'
  | 'error'
  | 'success'
  | 'shield'
  | 'building'
  | 'chevronRight'
  | 'chevronLeft'
  | 'chevronDown'
  | 'chevronUp'
  | 'arrowLeft'
  | 'minus'
  | 'thumbsUp'
  | 'thumbsDown'
  | 'copy'
  | 'bulb'
  | 'arrowsH'
  | 'maximize'
  | 'logo'
  | 'arrowUp'
  | 'plus'
  | 'more'
  | 'pin'
  | 'sparkle'
  | 'bolt'
  | 'scale'
  | 'history'
  | 'clock'
  | 'cornerDownLeft'
  | 'launch'
  | 'diamond'
  | 'graph'
  | 'butterfly'
  | 'umbrella'
  | 'edit'

const PATHS: Record<IconName, ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </>
  ),
  tune: (
    <>
      <path d="M4 7h11M4 17h7" />
      <path d="M15 7h5M11 17h9" />
      <circle cx="17" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  file: (
    <>
      <path d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v4h4" />
    </>
  ),
  contract: (
    <>
      <path d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v4h4" />
      <path d="M8 12h8M8 15h8M8 18h5" />
    </>
  ),
  report: (
    <>
      <path d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v4h4" />
      <path d="M9 17v-3M12 17v-5M15 17v-2" />
    </>
  ),
  sheet: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="1.5" />
      <path d="M4 9h16M4 14h16M10 4v16" />
    </>
  ),
  image: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <circle cx="9" cy="9" r="1.6" />
      <path d="m5 18 5-5 4 4 2-2 3 3" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" />
    </>
  ),
  download: <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14" />,
  share: (
    <>
      <circle cx="6" cy="12" r="2.4" />
      <circle cx="18" cy="6" r="2.4" />
      <circle cx="18" cy="18" r="2.4" />
      <path d="m8.1 10.9 7.8-3.8M8.1 13.1l7.8 3.8" />
    </>
  ),
  trash: <path d="M5 7h14M10 7V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2m2 0-.7 12a1 1 0 0 1-1 1H8.7a1 1 0 0 1-1-1L7 7" />,
  dashboard: (
    <>
      <rect x="4" y="4" width="7" height="9" rx="1" />
      <rect x="13" y="4" width="7" height="5" rx="1" />
      <rect x="13" y="11" width="7" height="9" rx="1" />
      <rect x="4" y="15" width="7" height="5" rx="1" />
    </>
  ),
  apps: (
    <>
      <circle cx="7" cy="7" r="1.6" />
      <circle cx="12" cy="7" r="1.6" />
      <circle cx="17" cy="7" r="1.6" />
      <circle cx="7" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="17" cy="12" r="1.6" />
      <circle cx="7" cy="17" r="1.6" />
      <circle cx="12" cy="17" r="1.6" />
      <circle cx="17" cy="17" r="1.6" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v2.5M12 19v2.5M4.5 12H2M22 12h-2.5M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.3 9.2a2.7 2.7 0 0 1 5.2 1c0 1.8-2.5 2.2-2.5 3.8" />
      <circle cx="12" cy="17.2" r="0.3" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <circle cx="12" cy="7.8" r="0.3" />
    </>
  ),
  warning: (
    <>
      <path d="M12 4 2.8 20h18.4z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="17.3" r="0.3" />
    </>
  ),
  error: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5" />
      <circle cx="12" cy="16.3" r="0.3" />
    </>
  ),
  success: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 2.5 2.5L16 9.5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4 3 6.5 7 8 4-1.5 7-4 7-8V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  building: (
    <>
      <rect x="5" y="4" width="14" height="16" rx="1" />
      <path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h6" />
    </>
  ),
  chevronRight: <path d="m9 6 6 6-6 6" />,
  chevronLeft: <path d="m15 6-6 6 6 6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronUp: <path d="m6 15 6-6 6 6" />,
  arrowLeft: <path d="M19 12H5m6 6-6-6 6-6" />,
  minus: <path d="M5 12h14" />,
  thumbsUp: (
    <path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zM7 10l4.4-7.4a1.6 1.6 0 0 1 2.8 1.2L13.4 9h5.1a2 2 0 0 1 2 2.4l-1.3 6.5A2 2 0 0 1 16.2 20H7z" />
  ),
  thumbsDown: (
    <path d="M17 14V3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1zM17 14l-4.4 7.4a1.6 1.6 0 0 1-2.8-1.2l.8-5.2H5.5a2 2 0 0 1-2-2.4l1.3-6.5A2 2 0 0 1 7.8 4H17z" />
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.8 10.7c.5.4.8 1 .8 1.8v.5h6v-.5c0-.8.3-1.4.8-1.8A6 6 0 0 0 12 3z" />
    </>
  ),
  arrowsH: <path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4" />,
  maximize: <path d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4" />,
  logo: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M8 16V9l4 4 4-4v7" />
    </>
  ),
  arrowUp: <path d="M12 19V5M6 11l6-6 6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  more: (
    <>
      <circle cx="5.5" cy="12" r="1.3" />
      <circle cx="12" cy="12" r="1.3" />
      <circle cx="18.5" cy="12" r="1.3" />
    </>
  ),
  pin: (
    <>
      <path d="M9 3h6l-1 7 3 3v2h-5v5l-1 1-1-1v-5H4v-2l3-3z" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
      <path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
    </>
  ),
  bolt: <path d="M13 3 5 13h5l-1 8 8-10h-5z" />,
  scale: (
    <>
      <path d="M12 3v18M7 21h10" />
      <path d="M12 6 5 8m7-2 7 2" />
      <path d="M2.8 13 5 8l2.2 5a2.3 2.3 0 0 1-4.4 0zM16.8 13 19 8l2.2 5a2.3 2.3 0 0 1-4.4 0z" />
    </>
  ),
  history: (
    <>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.8-6.3M3 4v3.5h3.5" />
      <path d="M12 8v4.2l3 1.8" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  cornerDownLeft: <path d="M20 5v5a3 3 0 0 1-3 3H5m0 0 4-4m-4 4 4 4" />,
  launch: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M19 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" />
    </>
  ),
  diamond: <path d="M12 3 21 12l-9 9-9-9z" />,
  graph: (
    <>
      <circle cx="6" cy="7" r="2" />
      <circle cx="18" cy="7" r="2" />
      <circle cx="12" cy="17" r="2" />
      <path d="M8 7h8M7.6 8.6 10.6 15m2.8-6.4L16.4 8.6" />
    </>
  ),
  butterfly: (
    <>
      <path d="M12 7v10" />
      <path d="M12 8C10 4 4 3.5 4 8c0 4.2 5 4.4 8 2.6" />
      <path d="M12 8c2-4 8-4.5 8 0 0 4.2-5 4.4-8 2.6" />
      <path d="M12 11c-2.2 4-7 4.3-7-.2M12 11c2.2 4 7 4.3 7-.2" />
    </>
  ),
  umbrella: (
    <>
      <path d="M12 3v2" />
      <path d="M3.5 12a8.5 8.5 0 0 1 17 0z" />
      <path d="M12 12v6a2.2 2.2 0 0 0 4.4 0" />
    </>
  ),
}

export interface IconProps {
  name: IconName
  size?: number
  /** Decorative by default. Pass a title to expose an accessible name. */
  title?: string
  className?: string
  strokeWidth?: number
}

export function Icon({ name, size = 20, title, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name]}
    </svg>
  )
}
