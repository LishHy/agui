import type { IconName } from '../../icons'
import { ACCOUNT } from './home'

/* =============================================================================
   Generative answer model
   -----------------------------------------------------------------------------
   An answer is an ordered list of WidgetSpec. `planAnswer()` is the swappable
   "agent" layer: for the demo it maps a question to a scripted plan, but the
   return shape is exactly what a live agent would emit, so it can be replaced
   with a real model/tool call without touching the rendering layer.
   ========================================================================== */

export type WidgetType =
  | 'what_matters'
  | 'key_facts'
  | 'clause_excerpt'
  | 'comparison'
  | 'needs_attention'
  | 'related_documents'
  | 'timeline'
  | 'key_contacts'
  | 'suggested_followups'
  | 'clarification'
  | 'draft_preview'

export const WIDGET_META: Record<WidgetType, { label: string; icon: IconName }> = {
  what_matters: { label: 'What matters', icon: 'bolt' },
  key_facts: { label: 'Key facts', icon: 'sparkle' },
  clause_excerpt: { label: 'Clause', icon: 'contract' },
  comparison: { label: 'Compare price terms', icon: 'scale' },
  needs_attention: { label: 'Needs attention', icon: 'warning' },
  related_documents: { label: 'Related documents', icon: 'folder' },
  timeline: { label: 'Timeline', icon: 'history' },
  key_contacts: { label: 'Key contacts', icon: 'person' },
  suggested_followups: { label: 'Suggested follow-ups', icon: 'cornerDownLeft' },
  clarification: { label: 'Need your input', icon: 'help' },
  draft_preview: { label: 'Draft', icon: 'file' },
}

export type Confidence = 'High' | 'Medium' | 'Low'

/** A source the answer is grounded in — rendered as an inline citation chip
 *  and, on click, in the right-side source panel. */
export interface Source {
  label: string
  ref: string
  date: string
  provider: string
  docId?: string
  collection?: string
  pages?: number
  updated?: string
  /** The cited passage; `hit` is the phrase highlighted in the viewer. */
  excerpt: { before: string; hit: string; after: string }
}
/** An AI-derived reference — a value the agent computed, not a document source. */
export interface Inference {
  title: string
  statement: string
  confidence: Confidence
  /** How the value was reached. */
  method: string
  calc?: { expr: string; result: string }
  /** Each data point may link to another reference by index. */
  dataPoints: { label: string; value: string; refIndex?: number }[]
}

/** A citation is either a document source or an AI inference. */
export type Reference =
  | { kind: 'source'; source: Source }
  | { kind: 'inference'; inference: Inference }

export interface WhatMattersData {
  text: string
  confidence: Confidence
  references: Reference[]
}
export interface KeyFactsData {
  tiles: { label: string; value: string; sub: string }[]
}
export interface ClauseData {
  doc: string
  ref: string
  date: string
  quote: string
  openLabel: string
}
export interface ComparisonData {
  columns: string[]
  rows: { cells: string[]; current?: boolean }[]
}
export interface Risk {
  severity: 'High' | 'Medium'
  title: string
  desc: string
  ref: string
}
export interface NeedsAttentionData {
  risks: Risk[]
}
export interface RelatedDoc {
  title: string
  sub: string
  date: string
  /** Optional inline status chip shown after the title, e.g. "Pending signature". */
  tag?: string
}
export interface RelatedDocsData {
  docs: RelatedDoc[]
}
export interface TimelineData {
  nodes: { year: string; desc: string; current?: boolean }[]
}
export interface Contact {
  name: string
  role: string
  initials: string
  tag: string
}
export interface KeyContactsData {
  contacts: Contact[]
}
export interface FollowupsData {
  items: string[]
}
/** A single disambiguation choice shown in a clarification card. */
export interface ClarificationOption {
  id: string
  title: string
  meta: string
}
export interface ClarificationData {
  /** Short natural-language prompt, e.g. "I found more than one customer called Acme." */
  prompt: string
  /** Heading above the options, e.g. "WHICH ACME DO YOU MEAN?" */
  heading: string
  options: ClarificationOption[]
}
/** A drafted-but-unsent message (email / notice). Always a draft, never sent from here. */
export interface DraftPreviewData {
  /** Sent-status chip, e.g. "Not sent". */
  status: string
  to: string
  subject: string
  /** Body paragraphs, rendered in order. */
  body: string[]
}

export type WidgetSpec =
  | { type: 'what_matters'; data: WhatMattersData }
  | { type: 'key_facts'; data: KeyFactsData }
  | { type: 'clause_excerpt'; data: ClauseData }
  | { type: 'comparison'; data: ComparisonData }
  | { type: 'needs_attention'; data: NeedsAttentionData }
  | { type: 'related_documents'; data: RelatedDocsData }
  | { type: 'timeline'; data: TimelineData }
  | { type: 'key_contacts'; data: KeyContactsData }
  | { type: 'suggested_followups'; data: FollowupsData }
  | { type: 'clarification'; data: ClarificationData }
  | { type: 'draft_preview'; data: DraftPreviewData }

export interface AnswerPlan {
  id: string
  title: string
  entity: string
  question: string
  widgets: WidgetSpec[]
  /** Narration for the "Analyzing" tool-call loading state. */
  docCount: number
  matchedDocs: number
  analysis: {
    headline: string
    tools: { label: string; desc: string }[]
  }
  /** "Full answer context" — what the agent understood and the filters it used. */
  context: {
    understood: string
    interpretation: { label: string; value: string }[]
    filters: string[]
  }
}

/* ---------------------------------------------------------------- Price increase */
const PRICE_INCREASE_PLAN = (question: string): AnswerPlan => ({
  id: 'price-increase',
  title: 'Northwind — price increase arrangements',
  entity: ACCOUNT,
  question,
  docCount: 26,
  matchedDocs: 5,
  analysis: {
    headline: 'Identifying price-increase clauses..',
    tools: [
      { label: 'Search Chunks', desc: 'Searching contract repositories' },
      { label: 'Search Chunks', desc: 'Extracting price and uplift terms' },
      { label: 'Search Chunks', desc: 'Comparing caps across amendments' },
      { label: 'Search Chunks', desc: 'Checking order-form coverage' },
    ],
  },
  context: {
    understood:
      'You want the existing contractual terms that govern price increases for Northwind — the caps, index, notice and any gaps across the master agreement and its amendments.',
    interpretation: [
      { label: 'Intent', value: 'Identify price-increase terms' },
      { label: 'Account', value: 'Northwind Logistic Ltd' },
      { label: 'Scope', value: 'Fees, uplift cap, index and notice' },
      { label: 'Documents', value: 'MSA, Amendments 2–3, SOW-2024-02' },
      { label: 'Period', value: '2019–2025' },
      { label: 'Expected answer', value: 'Baseline terms with caps, index and gaps' },
    ],
    filters: [
      'Contracts',
      'Northwind Logistic Ltd',
      'Pricing clauses',
      'Signed',
      'MSA & amendments',
      '2019–2025',
      '26 documents',
    ],
  },
  widgets: [
    {
      type: 'what_matters',
      data: {
        text: "Northwind's price-increase terms sit across the Master Services Agreement and two amendments. Hyland may raise fees once per contract year, capped at the lower of CPI or 5% under the MSA, and must give 60 days' written notice before each renewal. Amendment 3 re-based the cap to the Logistics Price Index with a 7% ceiling. One order form, SOW-2024-02, is silent on increases and falls back to the MSA.",
        confidence: 'High',
        references: [
          {
            kind: 'source',
            source: {
              label: 'Northwind MSA 2019',
              ref: '§9.2 Price adjustment',
              date: 'Signed 14 Mar 2019',
              provider: 'Content Lake',
              docId: 'MSA-2019-0147',
              excerpt: {
                before:
                  'Supplier may increase the Fees once per Contract Year, effective on the renewal date, by no more than ',
                hit: 'the lesser of CPI-U or five percent (5%)',
                after: ', on at least sixty (60) days’ written notice.',
              },
            },
          },
          {
            kind: 'source',
            source: {
              label: 'Amendment 2',
              ref: '§3 Notice period',
              date: 'Signed 21 Apr 2023',
              provider: 'Content Lake',
              docId: 'AMD-2023-0061',
              excerpt: {
                before: 'The notice period for any fee increase is extended ',
                hit: 'from sixty (60) to ninety (90) days',
                after: ' before the applicable renewal date.',
              },
            },
          },
          {
            kind: 'source',
            source: {
              label: 'Amendment 3',
              ref: '§5 Index and cap',
              date: 'Signed 2 Feb 2025',
              provider: 'Content Lake',
              docId: 'AMD-2025-0023',
              excerpt: {
                before: 'The annual uplift cap is re-based to ',
                hit: 'the Logistics Price Index with a 7% ceiling',
                after: ', replacing the CPI-U reference in §9.2.',
              },
            },
          },
          {
            kind: 'inference',
            inference: {
              title: 'Current cap',
              statement: 'The current price-increase cap is 7%.',
              confidence: 'High',
              method:
                'Took the ceiling introduced when Amendment 3 re-based the cap from CPI-U to the Logistics Price Index.',
              calc: { expr: 'Logistics Price Index, capped', result: '7%' },
              dataPoints: [
                { label: 'Amendment 3 §5 cap', value: '7%', refIndex: 2 },
                { label: 'Prior cap (MSA §9.2)', value: '5%', refIndex: 0 },
              ],
            },
          },
          {
            kind: 'inference',
            inference: {
              title: 'Last increase',
              statement: 'The last increase was 4.2%.',
              confidence: 'Medium',
              method: 'Compared the 2025 index level with the prior contract year, under the uplift cap.',
              calc: { expr: '2025 index ÷ 2024 index − 1', result: '≈ 4.2%' },
              dataPoints: [
                { label: 'Index movement 2024–25', value: '4.2%', refIndex: 2 },
                { label: 'Within cap', value: '< 7%', refIndex: 3 },
              ],
            },
          },
        ],
      },
    },
    {
      type: 'key_facts',
      data: {
        tiles: [
          { label: 'Current cap', value: '7%', sub: 'Logistics Price Index · Am. 3' },
          { label: 'Notice required', value: '60 days', sub: 'before each renewal' },
          { label: 'Frequency', value: 'Once a year', sub: 'on the renewal date' },
          { label: 'Last increase', value: '4.2%', sub: 'effective 1 Jan 2025' },
        ],
      },
    },
    {
      type: 'clause_excerpt',
      data: {
        doc: 'Master Services Agreement',
        ref: '§9.2 Price adjustment',
        date: '14 Mar 2019',
        quote:
          "Supplier may increase the Fees once per Contract Year, effective on the renewal date, by no more than the lesser of (a) the increase in CPI-U over the preceding twelve months or (b) five percent (5%). Supplier shall give Customer no less than sixty (60) days' written notice of any such increase.",
        openLabel: 'Open document at §9.2',
      },
    },
    {
      type: 'comparison',
      data: {
        columns: ['Document', 'Cap', 'Index', 'Notice'],
        rows: [
          { cells: ['MSA §9.2 · 2019', '5%', 'CPI-U', '60 days'] },
          { cells: ['Amendment 2 §3 · 2023', '5%', 'CPI-U', '90 days'] },
          { cells: ['Amendment 3 §5 · 2025', '7%', 'Logistics Price Index', '60 days'], current: true },
        ],
      },
    },
    {
      type: 'needs_attention',
      data: {
        risks: [
          {
            severity: 'High',
            title: 'SOW-2024-02 has no price-increase clause',
            desc: 'It falls back to the MSA cap. Confirm the baseline before repricing this order.',
            ref: 'SOW-2024-02',
          },
          {
            severity: 'Medium',
            title: 'Index changed in 2025',
            desc: 'The MSA and Amendment 2 use CPI-U; Amendment 3 switched to the Logistics Price Index. Earlier orders may still reference CPI.',
            ref: 'Amendment 3 §5',
          },
        ],
      },
    },
    {
      type: 'related_documents',
      data: {
        docs: [
          { title: 'Master Services Agreement', sub: '§9 Fees and price adjustment', date: '14 Mar 2019' },
          { title: 'Amendment 2', sub: 'Notice period 60 to 90 days', date: '21 Apr 2023' },
          { title: 'Amendment 3', sub: 'Cap 5% to 7%, index change', date: '2 Feb 2025' },
          { title: 'Order form SOW-2024-02', sub: 'No price-increase clause', date: '3 May 2024' },
          { title: 'Rate card 2025', sub: 'Published list prices', date: '1 Jan 2025' },
        ],
      },
    },
    {
      type: 'timeline',
      data: {
        nodes: [
          { year: '2019', desc: 'MSA · CPI or 5%' },
          { year: '2023', desc: 'Am. 2 · 90-day notice' },
          { year: '2025', desc: 'Am. 3 · index, 7% cap', current: true },
        ],
      },
    },
    {
      type: 'suggested_followups',
      data: {
        items: [
          'Model a 7% increase at renewal',
          'Who else uses the Logistics Price Index?',
          'Draft a price-increase notice',
        ],
      },
    },
  ],
})

/* ---------------------------------------------------------------- Overview fallback */
const OVERVIEW_PLAN = (question: string): AnswerPlan => ({
  id: 'overview',
  title: 'Northwind — agreements overview',
  entity: ACCOUNT,
  question,
  docCount: 26,
  matchedDocs: 6,
  analysis: {
    headline: 'Collecting agreements for this account..',
    tools: [
      { label: 'Search Chunks', desc: 'Searching contract repositories' },
      { label: 'Search Chunks', desc: 'Listing agreements and amendments' },
      { label: 'Search Chunks', desc: 'Extracting key dates and terms' },
      { label: 'Search Chunks', desc: 'Checking signature status' },
    ],
  },
  context: {
    understood:
      'You want an overview of every agreement Hyland has signed or is signing with Northwind, and the terms they set.',
    interpretation: [
      { label: 'Intent', value: 'Summarise agreements' },
      { label: 'Account', value: 'Northwind Logistic Ltd' },
      { label: 'Scope', value: 'Agreements, amendments and orders' },
      { label: 'Documents', value: '6 executed documents' },
      { label: 'Period', value: '2019–2027' },
      { label: 'Expected answer', value: 'Document list with key terms' },
    ],
    filters: ['Contracts', 'Northwind Logistic Ltd', 'Executed', 'Agreements', 'Amendments', '26 documents'],
  },
  widgets: [
    {
      type: 'what_matters',
      data: {
        text: 'Hyland has six executed documents with Northwind: a 2019 Master Services Agreement, three amendments, a Data Processing Addendum and one open order form. Together they set a 2027 term, a 36-month liability cap, a 90-day termination-for-convenience right and annual price terms.',
        confidence: 'High',
        references: [
          {
            kind: 'source',
            source: {
              label: 'Northwind MSA 2019',
              ref: 'Master agreement',
              date: 'Signed 14 Mar 2019',
              provider: 'Content Lake',
              docId: 'MSA-2019-0147',
              excerpt: {
                before: 'This Master Services Agreement governs all ',
                hit: 'services, fees, liability and termination',
                after: ' between the parties.',
              },
            },
          },
          {
            kind: 'source',
            source: {
              label: 'Amendments 1–3',
              ref: 'Amendments',
              date: '2021–2025',
              provider: 'Content Lake',
              excerpt: {
                before: 'Three amendments updated ',
                hit: 'EU data residency, the liability cap and a termination right',
                after: ' across 2021–2025.',
              },
            },
          },
        ],
      },
    },
    {
      type: 'key_facts',
      data: {
        tiles: [
          { label: 'Customer since', value: '2019', sub: 'MSA signed 14 Mar 2019' },
          { label: 'Term ends', value: '31 Dec 2027', sub: 'annual renewal after' },
          { label: 'Liability cap', value: '36 months', sub: 'of fees (was 12)' },
          { label: 'Termination', value: '90 days', sub: 'for convenience, Am. 3' },
        ],
      },
    },
    {
      type: 'related_documents',
      data: {
        docs: [
          { title: 'Master Services Agreement', sub: 'Original', date: '14 Mar 2019' },
          { title: 'Amendment 1', sub: 'EU data residency', date: '9 Jun 2021' },
          { title: 'Amendment 2', sub: 'Cap 12 to 24 months', date: '21 Apr 2023' },
          { title: 'Amendment 3', sub: 'Cap 36 months, termination right', date: '2 Feb 2025' },
          { title: 'Data Processing Addendum', sub: 'Subprocessors', date: '9 Jun 2021' },
        ],
      },
    },
    {
      type: 'timeline',
      data: {
        nodes: [
          { year: '2019', desc: 'MSA, cap 12' },
          { year: '2021', desc: 'Am. 1, EU residency' },
          { year: '2023', desc: 'Am. 2, cap 24' },
          { year: '2025', desc: 'Am. 3, cap 36, 90-day exit', current: true },
        ],
      },
    },
    {
      type: 'suggested_followups',
      data: {
        items: [
          'Identify the price-increase arrangements for this account',
          'What is renewing in the next six months?',
          'Which agreements need notice this month?',
        ],
      },
    },
  ],
})

/* ------------------------------------------------- Clarification (disambiguation) */
const ACME_CLARIFICATION_PLAN = (question: string): AnswerPlan => ({
  id: 'acme-clarification',
  title: 'Acme Corp — agreements overview',
  entity: 'Acme Corp',
  question,
  docCount: 0,
  matchedDocs: 0,
  analysis: {
    headline: 'Matching the customer..',
    tools: [
      { label: 'Search Records', desc: 'Looking up customers named Acme' },
      { label: 'Search Records', desc: 'Checking policies and owners' },
    ],
  },
  context: {
    understood: 'You want an overview of the agreements for a customer called Acme.',
    interpretation: [
      { label: 'Intent', value: 'Summarise agreements' },
      { label: 'Account', value: 'Acme (ambiguous)' },
    ],
    filters: ['Contracts', 'Customer: Acme'],
  },
  widgets: [
    {
      type: 'clarification',
      data: {
        prompt: 'I found more than one customer called Acme.',
        heading: 'WHICH ACME DO YOU MEAN?',
        options: [
          { id: 'acme-corp', title: 'Acme Corporation', meta: 'Westlake, OH · Policy PL-20931 · Owner Dana Reyes' },
          { id: 'acme-logistics', title: 'Acme Logistics', meta: 'Columbus, OH · Policy PL-18442 · Owner Sam Ortiz' },
          { id: 'acme-health', title: 'Acme Health Ltd', meta: 'Leeds, UK · Policy PL-30177 · Owner Dana Reyes' },
        ],
      },
    },
  ],
})

/** The agreements overview answer for the resolved Acme customer. */
export function buildOverviewForEntity(entity: string, question: string): AnswerPlan {
  return {
    id: 'acme-overview',
    title: `${entity} — agreements overview`,
    entity,
    question,
    docCount: 5,
    matchedDocs: 5,
    analysis: {
      headline: 'Collecting agreements for this account..',
      tools: [
        { label: 'Search Chunks', desc: 'Searching contract repositories' },
        { label: 'Search Chunks', desc: 'Listing agreements and SOWs' },
        { label: 'Search Chunks', desc: 'Extracting key dates and terms' },
        { label: 'Search Chunks', desc: 'Checking signature status' },
      ],
    },
    context: {
      understood:
        'You want an overview of every agreement Hyland has signed or is signing with Acme Corp, and the terms they set.',
      interpretation: [
        { label: 'Intent', value: 'Summarise agreements' },
        { label: 'Account', value: entity },
        { label: 'Scope', value: 'Agreements, addenda and SOWs' },
        { label: 'Documents', value: '5 documents' },
        { label: 'Period', value: '2024–2027' },
        { label: 'Expected answer', value: 'Document list with key terms' },
      ],
      filters: ['Contracts', entity, 'Executed', 'Agreements', 'SOWs', '5 documents'],
    },
    widgets: [
      {
        type: 'what_matters',
        data: {
          text: "Hyland has five agreements with Acme Corp: four signed and one pending signature. The 2024 Master Services Agreement governs everything else, its initial term ends 14 Jan 2027, and Statement of Work 3 is still waiting on Acme's signature.",
          confidence: 'High',
          references: [
            {
              kind: 'source',
              source: {
                label: 'Acme MSA 2024',
                ref: '§1 Term',
                date: 'Signed 15 Jan 2024',
                provider: 'Content Lake',
                docId: 'MSA-2024-ACME',
                excerpt: {
                  before: 'This Agreement commences on the Effective Date and continues for ',
                  hit: 'an initial term of three (3) years',
                  after: ', renewing annually thereafter.',
                },
              },
            },
            {
              kind: 'source',
              source: {
                label: 'SOW 3 (draft)',
                ref: 'Signature block',
                date: 'Proposed 1 Dec 2026',
                provider: 'Content Lake',
                docId: 'SOW3-ACME',
                excerpt: {
                  before: 'This Statement of Work is ',
                  hit: 'pending Customer signature',
                  after: ' and is not yet in effect.',
                },
              },
            },
            {
              kind: 'source',
              source: {
                label: 'Data Processing Addendum',
                ref: 'Term',
                date: 'Signed 15 Jan 2024',
                provider: 'Content Lake',
                docId: 'DPA-2024-ACME',
                excerpt: {
                  before: 'This Addendum is ',
                  hit: 'co-terminous with the MSA',
                  after: '.',
                },
              },
            },
          ],
        },
      },
      {
        type: 'key_facts',
        data: {
          tiles: [
            { label: 'Customer since', value: '2024', sub: 'MSA signed 15 Jan 2024' },
            { label: 'Initial term ends', value: '14 Jan 2027', sub: 'annual renewal after' },
            { label: 'Signed', value: '4 of 5', sub: 'SOW 3 pending' },
            { label: 'Active SOWs', value: '2', sub: 'SOW 1 and SOW 2' },
          ],
        },
      },
      {
        type: 'related_documents',
        data: {
          docs: [
            { title: 'Master Services Agreement', sub: 'Governing agreement, 3 year term', date: '15 Jan 2024' },
            { title: 'Data Processing Addendum', sub: 'Personal data, co-terminous with MSA', date: '15 Jan 2024' },
            { title: 'SOW 1: Platform implementation', sub: '12 months', date: '1 Feb 2024' },
            { title: 'SOW 2: Managed services', sub: '24 months', date: '10 Jan 2025' },
            {
              title: 'SOW 3: Workflow expansion',
              sub: '18 months, draft',
              date: 'Proposed · 1 Dec 2026',
              tag: 'Pending signature',
            },
          ],
        },
      },
      {
        type: 'timeline',
        data: {
          nodes: [
            { year: '2024', desc: 'MSA and DPA signed' },
            { year: 'Feb 2024', desc: 'SOW 1, implementation' },
            { year: 'Jan 2025', desc: 'SOW 2, managed services' },
            { year: 'Dec 2026', desc: 'SOW 3 proposed, unsigned', current: true },
          ],
        },
      },
      {
        type: 'suggested_followups',
        data: {
          items: [
            'What is the scope of confidentiality in these agreements?',
            'Are there price uplift restrictions on Acme Corp’s account?',
            'Are there background check requirements?',
          ],
        },
      },
    ],
  }
}

/** True when a question is the ambiguous "Acme" agreements-overview ask. */
export function needsAcmeClarification(question: string): boolean {
  const q = question.toLowerCase()
  return q.includes('acme') && q.includes('overview')
}

/* ---------------------------------------------------------------------- Drafting */
const DRAFT_PLAN = (question: string): AnswerPlan => ({
  id: 'draft',
  title: 'Draft — price-increase notice',
  entity: ACCOUNT,
  question,
  docCount: 0,
  matchedDocs: 0,
  analysis: {
    headline: 'Drafting the notice..',
    tools: [
      { label: 'Read Terms', desc: 'Checking the adjustment cap and index' },
      { label: 'Draft', desc: 'Preparing a notice (not sent)' },
    ],
  },
  context: {
    understood: 'You want a drafted price-increase notice, prepared but not sent.',
    interpretation: [
      { label: 'Intent', value: 'Draft a notice' },
      { label: 'Account', value: 'Northwind Logistic Ltd' },
      { label: 'Basis', value: 'Amendment 3 · 7% cap · Logistics Price Index' },
    ],
    filters: ['Contracts', 'Northwind Logistic Ltd', 'Amendment 3'],
  },
  widgets: [
    {
      type: 'draft_preview',
      data: {
        status: 'Not sent',
        to: 'dana.reyes@northwind-logistics.com',
        subject: 'Notice of annual price adjustment (Amendment 3)',
        body: [
          'Hi Dana,',
          'This is formal notice that Hyland intends to apply the annual price adjustment permitted under Amendment 3, Section 5 — capped at 7% and indexed to the Logistics Price Index — effective on the next renewal date.',
          'Happy to walk through the figures this week if that would help.',
        ],
      },
    },
  ],
})

/** True when a question asks the agent to draft a message / notice / email. */
export function isDraftRequest(question: string): boolean {
  return /\bdraft\b/.test(question.toLowerCase())
}

/**
 * The swappable agent layer. Replace the body with a live model/tool call that
 * returns the same AnswerPlan shape to go from scripted to generative.
 */
export function planAnswer(question: string): AnswerPlan {
  const q = question.toLowerCase()
  if (needsAcmeClarification(question)) {
    return ACME_CLARIFICATION_PLAN(question)
  }
  if (isDraftRequest(question)) {
    return DRAFT_PLAN(question)
  }
  if (/\bprice|pricing|increas|uplift|escalat|cpi\b/.test(q)) {
    return PRICE_INCREASE_PLAN(question)
  }
  return OVERVIEW_PLAN(question)
}
