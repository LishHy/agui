/** The account / document scope shown on the Contract Analyst home. */
export const DOC_SCOPE = '26 Documents'
export const ACCOUNT = 'Northwind Logistic Ltd'

export interface Suggestion {
  id: string
  text: string
}

export const SUGGESTIONS: Suggestion[] = [
  {
    id: 'price',
    text: 'What are the existing contractual arrangements for price increases on this account?',
  },
  {
    id: 'overview',
    text: 'Provide an overview of the agreements Hyland has signed, or is signing, for Acme Corp.',
  },
  { id: 'notice', text: 'Which agreements need notice this month?' },
  { id: 'coc', text: 'Can Northwind terminate if Hyland is acquired?' },
  { id: 'renew', text: 'What is renewing in the next six months?' },
]
