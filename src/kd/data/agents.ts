import type { IconName } from '../../icons'

/** Satori colour-role tone for the agent badge (container tokens, not raw hex). */
export type AgentTone = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning'

export interface Agent {
  id: string
  name: string
  icon: IconName
  tone: AgentTone
}

export const AGENTS: Agent[] = [
  { id: 'support', name: 'Hyland Support Agent', icon: 'help', tone: 'tertiary' },
  { id: 'contract', name: 'Contract Analyst', icon: 'butterfly', tone: 'primary' },
  { id: 'policy', name: 'Policy Analyst', icon: 'shield', tone: 'secondary' },
  { id: 'coverage', name: 'Coverage Analyst', icon: 'umbrella', tone: 'success' },
  { id: 'rules', name: 'Rules & Rates Analyst', icon: 'scale', tone: 'warning' },
]

/** The due-diligence flow runs on the Contract Analyst. */
export const ACTIVE_AGENT_ID = 'contract'

export function getAgent(id: string): Agent {
  return AGENTS.find((a) => a.id === id) ?? AGENTS[1]
}
