# Knowledge Discovery — AG-UI demo (Contract Analyst)

A React + TypeScript prototype of the Hyland **Knowledge Discovery** generative
experience: a user asks a question, the agent **interprets it and assembles the
right set of widgets** to answer. Built with Vite, styled with a hand-authored
Satori / Material Design 3 **design-token** layer (no Tailwind/shadcn).

First demo use case — **Due diligence · price increases**:

> "What are the existing contractual arrangements for price increases on this account?"

The answer is composed from the Contract Analyst widget library over sample data
for the account **Northwind Logistic Ltd**.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

`npm run build` type-checks and builds for production.

## Demo click-path

1. **Home** — the Contract Analyst home (icon rail + workspace switcher, KD
   header, tabs, agent list). The target question is the highlighted suggestion.
2. Click it (or type any price/increase question) → the **Analyzing** state shows
   the agent's active reasoning step and the **tools it calls** (Search Chunks:
   searching repositories, extracting terms, comparing caps, …), revealed one by
   one, before the answer renders.
3. The **generated answer** streams in as a stack of widgets, scoped to
   Northwind, with a docked follow-up input.

**Deep link (handy on stage):** open a question directly with
`?ask=<question>` — add `&instant=1` to skip the interpreting animation.
Example: `http://localhost:5173/?ask=price%20increases`.

Use the **moon/sun** control (top-right) to switch light/dark live — it is driven
entirely by the design tokens.

## How the "AI picks the widgets" works (swappable, live-ready)

`src/kd/data/answer.ts` defines the answer model and `planAnswer(question)` — the
**agent layer**. It returns an ordered `WidgetSpec[]` (plus a title, entity and
narration). Today it maps a question to a scripted plan; swap the body for a live
model/tool call that returns the same shape and nothing in the rendering layer
changes. New widget types plug into one registry (`renderWidget` in
`src/kd/components/widgets.tsx`).

```
question ──▶ planAnswer()  ──▶  AnswerPlan { title, entity, widgets: WidgetSpec[] }
             (scripted now,         │
              live later)           ▼
                              AnswerView → renderWidget() per spec
```

## Structure

```
src/
  styles/         tokens.css (Satori/MD3, KD violet) · base.css · app.css
  icons.tsx       line-icon set
  components/      Button · IconButton · SearchField · EmptyState   (Satori primitives)
  kd/
    data/          agents.ts · home.ts · answer.ts  (planAnswer + mock briefs)
    components/    IconRail · TopBar · AgentSidebar · HomePanel · AskInput ·
                   ThinkingState · AnswerView · widgets.tsx (the widget library)
  App.tsx          state machine: home → thinking → answer
```

## Widget library (this build)

`what_matters` · `key_facts` · `clause_excerpt` · `comparison` ·
`needs_attention` · `related_documents` · `timeline` · `key_contacts` ·
`suggested_followups`. These mirror widget types in the Figma catalogue
(*Generative KD Explorations — AG-UI*); more can be added to `WidgetSpec` +
`renderWidget` without touching the flow.

## Notes, assumptions and gaps

- **Sample data.** The brief for Northwind (MSA §9.2, Amendments 2–3, SOW-2024-02)
  is fabricated demo content. The Figma board has **no price-increase screen** —
  this answer composes existing widget types for the new use case.
- **Scripted responses.** `planAnswer()` is keyword-routed (price/increase →
  price brief; otherwise an agreements overview). It is structured to be replaced
  by a live agent.
- **Satori adaptation.** Satori ships as Angular Material + Satori UI (no React
  build). Components here are React reimplementations following Satori tokens and
  rules; icons/illustrations are stand-ins for the Satori Icon Library. Accessibility
  (landmarks, focus, keyboard, labels, status-not-by-colour) follows WCAG 2.2 AA.
- **Accessibility + states** follow the Satori guidelines skills installed in
  `.claude/skills/`.

## Add the next use case

1. Add a `*_PLAN(question)` in `answer.ts` and route it from `planAnswer()`.
2. Add any new widget type to `WidgetSpec`, `WIDGET_META` and `renderWidget`.
3. (Optional) add a suggestion in `src/kd/data/home.ts`.
