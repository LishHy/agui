export type NodeKind = 'document' | 'object' | 'entity' | 'conversation'

export interface GEntity {
  id: string
  kind: NodeKind
  label: string
  /** Type shown under the label, e.g. "Clause". */
  sub: string
  /** Relation to the parent, e.g. "capped at". */
  rel: string
  children?: GEntity[]
}

export interface SourceGraph {
  center: { id: string; kind: NodeKind; label: string; sub: string; desc: string }
  relations: GEntity[]
}

/**
 * The entity graph for the Northwind account — the document being viewed sits in
 * a web of agreements, clauses and entities. Expanding a relation reveals its own
 * connections. (Shared across the price-increase sources for the demo.)
 */
export const ACCOUNT_GRAPH: SourceGraph = {
  center: {
    id: 'northwind',
    kind: 'object',
    label: 'Northwind Logistic Ltd',
    sub: 'Business object · Knowledge Graph',
    desc: 'The account these agreements and amendments belong to. Pricing, renewal and liability terms are assembled from the documents connected here.',
  },
  relations: [
    {
      id: 'msa',
      kind: 'document',
      label: 'Master Services Agreement',
      sub: 'Contract',
      rel: 'signed',
      children: [
        { id: 'msa-s92', kind: 'entity', label: '§9.2 Price adjustment', sub: 'Clause', rel: 'contains' },
        { id: 'msa-exh', kind: 'document', label: 'Exhibit A', sub: 'Attachment', rel: 'includes' },
        { id: 'msa-author', kind: 'entity', label: 'Author: Legal Ops', sub: 'Contact', rel: 'authored by' },
      ],
    },
    {
      id: 'am2',
      kind: 'document',
      label: 'Amendment 2',
      sub: 'Contract',
      rel: 'amended by',
      children: [
        { id: 'am2-s3', kind: 'entity', label: '§3 Notice period', sub: 'Clause', rel: 'contains' },
        { id: 'am2-author', kind: 'entity', label: 'Author: Legal Ops', sub: 'Contact', rel: 'authored by' },
      ],
    },
    {
      id: 'am3',
      kind: 'document',
      label: 'Amendment 3',
      sub: 'Contract',
      rel: 'amended by',
      children: [
        { id: 'am3-s5', kind: 'entity', label: '§5 Index and cap', sub: 'Clause', rel: 'contains' },
        { id: 'am3-lpi', kind: 'entity', label: 'Logistics Price Index', sub: 'Index', rel: 'references' },
      ],
    },
    {
      id: 'sow',
      kind: 'document',
      label: 'SOW-2024-02',
      sub: 'Order form',
      rel: 'ordered via',
      children: [{ id: 'sow-rate', kind: 'document', label: 'Rate card 2025', sub: 'Pricing', rel: 'priced by' }],
    },
    {
      id: 'cap',
      kind: 'entity',
      label: 'Price-increase cap',
      sub: 'Clause',
      rel: 'capped at',
      children: [
        { id: 'cap-cpi', kind: 'entity', label: 'CPI-U', sub: 'Index', rel: 'was' },
        { id: 'cap-lpi', kind: 'entity', label: 'Logistics Price Index', sub: 'Index', rel: 'now' },
      ],
    },
    {
      id: 'renewal',
      kind: 'entity',
      label: 'Renewal date',
      sub: 'Date',
      rel: 'renews on',
      children: [{ id: 'renewal-notice', kind: 'entity', label: 'Notice period', sub: 'Term', rel: 'requires' }],
    },
    {
      id: 'owner',
      kind: 'entity',
      label: 'Alex Rivera',
      sub: 'Contact',
      rel: 'owned by',
      children: [{ id: 'owner-ap', kind: 'object', label: 'Accounts payable', sub: 'Department', rel: 'works in' }],
    },
    {
      id: 'ap',
      kind: 'object',
      label: 'Accounts payable',
      sub: 'Department',
      rel: 'billed to',
      children: [{ id: 'ap-finance', kind: 'object', label: 'Finance archive', sub: 'Repository', rel: 'stored in' }],
    },
    {
      id: 'lpi',
      kind: 'entity',
      label: 'Logistics Price Index',
      sub: 'Index',
      rel: 'indexed to',
      children: [{ id: 'lpi-am3', kind: 'document', label: 'Amendment 3', sub: 'Contract', rel: 'introduced by' }],
    },
    {
      id: 'convo',
      kind: 'conversation',
      label: 'This conversation',
      sub: 'Question',
      rel: 'asked in',
    },
  ],
}
