import type { IconName } from '../../icons'

/** A file offered in the "Compare to" list, with its own cited passage for side-by-side. */
export interface CompareFile {
  id: string
  name: string
  /** Secondary line, e.g. "OnBase · Document" or "Knowledge Graph · Context graph". */
  meta: string
  icon: IconName
  /** Provider shown in the preview header / footer, e.g. "OnBase". */
  provider: string
  /** The passage cited in the answer, highlighted in the preview. */
  cited: { before: string; hit: string; after: string }
  page: number
  pages: number
}

/** Suggested files to compare against the open source (scripted for the demo). */
export const COMPARE_FILES: CompareFile[] = [
  {
    id: 'node',
    name: 'Acme Corporation',
    meta: 'Source · Context graph',
    icon: 'graph',
    provider: 'Knowledge Graph',
    cited: {
      before: 'Acme Corporation connects to ',
      hit: 'five agreements and three owners',
      after: ' across the content lake.',
    },
    page: 1,
    pages: 1,
  },
  {
    id: 'object',
    name: 'Business Object: SOW 3',
    meta: 'Knowledge Graph · Context graph',
    icon: 'graph',
    provider: 'Knowledge Graph',
    cited: {
      before: 'SOW 3 links to the ',
      hit: 'Master Services Agreement and the redline log',
      after: ' as its governing documents.',
    },
    page: 1,
    pages: 1,
  },
  {
    id: 'doc-onbase',
    name: 'Approval sheet',
    meta: 'OnBase · Document',
    icon: 'file',
    provider: 'OnBase',
    cited: {
      before: 'Procurement approval for SOW 3 is ',
      hit: 'open — pending legal sign-off on Exhibit B',
      after: '.',
    },
    page: 2,
    pages: 6,
  },
  {
    id: 'doc-redline',
    name: 'Redline log',
    meta: 'Source · Document',
    icon: 'file',
    provider: 'Content Lake',
    cited: {
      before: 'Exhibit B — architecture documentation: ',
      hit: 'two comments unresolved',
      after: ' (Customer counsel).',
    },
    page: 4,
    pages: 12,
  },
  {
    id: 'doc-msa',
    name: 'Master Services Agreement',
    meta: 'Source · Document',
    icon: 'file',
    provider: 'Content Lake',
    cited: {
      before: 'This Agreement commences on the Effective Date and continues for ',
      hit: 'an initial term of three (3) years',
      after: ', renewing annually thereafter.',
    },
    page: 1,
    pages: 24,
  },
  {
    id: 'doc-dpa',
    name: 'Data Processing Addendum',
    meta: 'Source · Document',
    icon: 'file',
    provider: 'Content Lake',
    cited: {
      before: 'This Addendum is ',
      hit: 'co-terminous with the MSA',
      after: '.',
    },
    page: 3,
    pages: 9,
  },
]
