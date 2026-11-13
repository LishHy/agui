# Knowledge Discovery — AG-UI demo

A React + TypeScript prototype of the Hyland **Knowledge Discovery** generative
experience: a user asks a question, the agent **interprets it and assembles the
right set of widgets** to answer. Built with Vite, styled with a hand-authored
Satori / Material Design 3 **design-token** layer (no Tailwind/shadcn).

The UI follows the Figma frame *Generative KD Explorations — AG-UI · Chat*
(1440 x 1024): Hyland platform nav, app header, agent sidenav and the chat card.

Demo use cases (all over fabricated sample data):

> "List all upcoming renewals in Q4 2026" — the Chat frame: question breakdown,
> key facts, a summary with citations, a data table, information gaps and next steps.

> "What are the existing contractual arrangements for price increases on this account?"
> — the earlier Northwind due-diligence answer (card-style widgets).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

`npm run build` type-checks and builds for production.

## Demo click-path

1. **Home** — the Hyland Support Agent home inside the app shell (platform nav,
   header, sidenav). The suggestions are listed below the ask box.
2. Click it (or type any price/increase question) → the **Analyzing** state shows
   the agent's active reasoning step and the **tools it calls** (Search Chunks:
   searching repositories, extracting terms, comparing caps, …), revealed one by
   one, before the answer renders.
3. The **generated answer** streams in as a stack of widgets inside the chat card,
   with collapsible *Suggested Follow-ups* and a docked input. Citation chips open
   the source viewer; **Find out how?** opens the answer context; **New
   Conversation** returns home.

**Deep link (handy on stage):** open a question directly with
`?ask=<question>` — add `&instant=1` to skip the interpreting animation.
Examples: `http://localhost:5173/?ask=List%20all%20upcoming%20renewals%20in%20Q4%202026&instant=1`,
`http://localhost:5173/?ask=price%20increases`. `&cite=<n>` opens a citation and
`&ctx=1` opens the answer context.

Use the **gear** button (top-right) to switch light/dark live — it is driven
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
  assets/chat/    SVG/JPEG assets exported from the Figma Chat frame
  styles/         tokens.css (Satori values, Noto Sans / Figtree) · base.css · app.css ·
                  chat.css (shell + chat card + table)
  icons.tsx       line-icon set (home / thinking views)
  components/     Button · IconButton · SearchField · EmptyState   (Satori primitives)
  kd/
    data/         agents.ts · home.ts · answer.ts  (planAnswer + mock answers)
    components/   PlatformNav · AppHeader · Sidenav · HomePanel · AskInput ·
                  ThinkingState · AnswerView · ChatInput · DataTable ·
                  ChatWidgets · widgets.tsx (the widget registry)
  App.tsx         state machine: home → thinking → answer
```

## Widget library (this build)

Card widgets: `what_matters` · `key_facts` · `clause_excerpt` · `comparison` ·
`needs_attention` · `related_documents` · `timeline` · `key_contacts` ·
`suggested_followups`.

Chat widgets: `question_breakdown` · `key_metrics` · `summary_bullets` ·
`data_table` · `information_gaps` · `next_steps`.

These mirror widget types in the Figma catalogue
(*Generative KD Explorations — AG-UI*); more can be added to `WidgetSpec` +
`renderWidget` without touching the flow.

## Notes, assumptions and gaps

- **Sample data.** The brief for Northwind (MSA §9.2, Amendments 2–3, SOW-2024-02)
  and the renewals table are fabricated demo content. The Figma board has **no
  price-increase screen** — that answer composes the card widgets and is shown
  inside the new chat card without being re-laid-out.
- **Renewals table.** Figma shows 8 rows, 3 of which are leftover template data;
  the table here holds 10 plausible rows (5 from the design) so the body scrolls.
  The design's "Oct 6 - DEc 31, 2026" breakdown label is reproduced as drawn.
- **Scripted responses.** `planAnswer()` is keyword-routed (price/increase →
  price brief; renew / Q1–Q4 → renewals list; otherwise an agreements overview).
  It is structured to be replaced by a live agent.
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
