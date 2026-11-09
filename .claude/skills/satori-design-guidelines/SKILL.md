---
name: satori-design-guidelines
description: Authoritative Satori Design System standard for Hyland enterprise UI (Figma / Figma Make). Covers design tokens (md.sys.* colour, typography, shape, spacing, elevation), the full component catalogue (Satori custom components + Angular Material primitives themed by Satori), page and interaction patterns, interaction states, WCAG 2.2 AA accessibility and keyboard behaviour, and microcopy rules. Use when creating, reviewing, or refining a Satori design and when deciding which component, token, pattern, or copy rule applies.
---

# Guidelines.md — Satori Design System Guidelines for Figma Make

## Purpose

Use this file as the detailed Satori design standard for Figma Make.

- `design-skill.md` defines **how** to generate the prototype.
- `Guidelines.md` defines **what** design rules the prototype must follow.

Read the relevant section only. Do not read the whole file for every prompt.

**Quick index**

- Part A — Foundations (source of truth, tokens, layout, typography, colour)
- Part B — Component catalogue (all Satori + Angular Material components)
- Part C — Patterns and page layouts
- Part D — States, accessibility and keyboard
- Part E — Microcopy
- Part F — Quality checklist and exception handling

---

## Source of truth

Use the latest Satori documentation when available:

- Satori Design System — https://satori.hyland.com/latest/
- Styles and tokens — https://satori.hyland.com/latest/styles-and-tokens/
- Writing guidelines — https://satori.hyland.com/latest/styles-and-tokens/writing/
- Writing for errors — https://satori.hyland.com/latest/styles-and-tokens/writing/writing-for-errors-rYGCYi34-rYGCYi34
- Grammar and mechanics — https://satori.hyland.com/latest/styles-and-tokens/writing/grammar-and-mechanics-gyAJxfqu-gyAJxfqu
- Satori Storybook — https://sturdy-barnacle-ozo3pr1.pages.github.io/satori/
- Satori GitHub — https://github.com/HylandSoftware/satori
- Satori Figma Design Library — components and styles
- Satori Icon Library — icons
- Satori Patterns Figma — https://www.figma.com/design/VBuxmkFCon1GZFJsHv3fkC/Satori-Patterns
- Material Design 3 — https://m3.material.io/
- Angular Material — https://material.angular.dev/

Foundations:

- Angular Material v20
- Material Design 3
- WCAG 2.2 AA
- Section 508
- EN 301 549

Satori is built in three layers:

1. **Material Design 3** provides the underlying design language.
2. **Angular Material** provides primitive components, themed by Satori.
3. **Satori UI** provides custom and composite components on top.

If a Satori pattern is missing, use the closest approved Angular Material or Material Design 3 pattern and mark it as an approximation.

---

# PART A — FOUNDATIONS

## A1. Non-negotiable rules

### Do

- Use Satori components, tokens and patterns wherever possible.
- Use Satori typography, colour, spacing, radius, border and elevation rules.
- Follow WCAG 2.2 AA.
- Use the closest approved Satori pattern if an exact one does not exist.
- Flag design system gaps clearly.

### Do not

- Invent new visual styles silently.
- Hardcode arbitrary hex, px, rem or type values when tokens exist.
- Mix Material 2 and Material 3 patterns.
- Use colour alone to communicate state, meaning or selection.
- Rewrite Satori components or tokens to "improve" them.
- Duplicate a component that already exists in Satori or Angular Material.

---

## A2. Design intent checklist

Before generating or reviewing a design, resolve:

- User goal
- Business goal
- Platform
- Density
- Primary task
- Secondary tasks
- Required states
- Error scenarios
- Permission states
- Responsive needs
- Accessibility needs
- Translation needs
- Long text cases
- Empty data cases
- Network failure cases

If information is missing, make the smallest defensible assumption and keep the design aligned to Satori.

---

## A3. Tokens

Satori exposes design tokens for colour, typography, shape, spacing and elevation, following the Material Design 3 token model (`md.sys.*` and Satori-specific tokens).

### Do

- Reference tokens by Satori/M3 token name, for example `md.sys.color.primary`, `md.sys.color.surface-container-low`.
- Use semantic colour roles rather than raw palette values.
- Use system shape tokens for corner radius.
- Use system spacing rhythm consistently.
- Use theming overrides through approved override tokens only.

### Do not

- Reference a colour by hex or by Figma style name alone.
- Invent token names.
- Apply raw CSS overrides to component internals.
- Mix token systems.

### Core colour roles to use

- Primary, on-primary, primary-container, on-primary-container
- Secondary, on-secondary, secondary-container, on-secondary-container
- Tertiary and containers
- Error, on-error, error-container, on-error-container
- Surface, surface-container-lowest/low/high/highest
- Surface-variant, on-surface, on-surface-variant
- Outline, outline-variant
- Inverse-surface, inverse-on-surface, inverse-primary
- Status roles: success, warning, danger, info, neutral

---

## A4. Layout and responsive design

### Do

- Design desktop-first, then reflow to tablet and mobile.
- Preserve content priority and reading order.
- Preserve visual hierarchy across breakpoints.
- Preserve sticky, scroll and overflow behaviour.
- Use drill-down patterns on mobile for complex views.
- Use "Step X of Y" for mobile steppers.
- Keep body copy to roughly 60–75 characters per line.
- Use line-height of at least 150%.
- Use compact enterprise layouts.
- Use spacing before decoration.
- Use consistent margins and padding from the Satori canonical layout pattern.

### Do not

- Compress desktop layouts into mobile.
- Use absolute positioning for primary layout.
- Show full horizontal steppers on mobile.
- Create text lines longer than 75 characters.
- Use heavy hero sections where compact enterprise banners are more appropriate.
- Over-nest cards.
- Place primary actions below the fold when avoidable.

### Canonical page regions

- App shell (Platform Nav + App Header)
- Title header / page header
- Breadcrumbs
- Toolbar or action bar
- Filter region
- Primary content region (table, grid, cards, form, detail)
- Side sheet or detail panel
- Footer or pagination region
- Overlay layer (dialogs, menus, tooltips, snackbars)

---

## A5. Typography

### Do

- Use Satori type tokens.
- Use body text of at least 16px.
- Use 14px only for microcopy, metadata or dense tables.
- Maintain heading order: H1 → H2 → H3.
- Use exactly one page-level H1.
- Use sentence case by default.
- Use the M3 type scale roles: display, headline, title, body, label.

### Do not

- Use body text below 16px for reading content.
- Use line-height below 150%.
- Skip heading levels.
- Use Title Case for buttons, labels, tabs, dialog titles or body copy.
- Use ALL CAPS outside approved status tags.
- Bold keyboard shortcuts inline.
- Introduce custom fonts.

---

## A6. Colour, contrast and hierarchy

### Do

- Use Satori colour tokens.
- Ensure text contrast is at least 4.5:1.
- Ensure non-text contrast is at least 3:1 (icons, borders, focus rings, state indicators).
- Pair colour with a non-colour state indicator.
- Use icons alongside status colours.
- Use spacing, grouping and hierarchy before decoration.
- Use strokes for interactive cards unless another affordance exists.
- Use surface-container levels for layering instead of shadows.

### Do not

- Introduce colours outside Satori.
- Use colour-only error, success, selected or active states.
- Use heavy shadows to create hierarchy.
- Add strokes to non-interactive cards without a reason.
- Nest cards inside cards for hierarchy.
- Use decorative gradients or glassmorphism.

---

## A7. Iconography and illustration

### Do

- Use the Satori Icon Library.
- Use file type icons from the Satori set for document types.
- Use the `launch` icon trailing external links.
- Use Satori Illustrations for empty and error states.
- Give icon-only controls an accessible name.
- Keep icon meaning consistent across the product.

### Do not

- Mix icon families.
- Use emoji as icons.
- Use decorative illustration in dense enterprise views.
- Use an icon as the only signal for a critical action or state.

---

# PART B — COMPONENT CATALOGUE

This catalogue covers both **Satori custom components** and **Angular Material components themed by Satori**. Use the Satori component if one exists. Otherwise use the Angular Material primitive and mark it as themed-by-Satori.

---

## B1. Satori custom components

### Platform Nav

Global product navigation rail and container for the application shell.

Do:

- Use Platform Nav as the outermost app shell container.
- Use it for top-level product areas.
- Show icon plus label for rail items.
- Mark the active area with a non-colour indicator.
- Rely on Satori's built-in "Skip to main content" link.

Do not:

- Build a custom sidebar or top bar.
- Duplicate the skip link.
- Put page-level actions inside Platform Nav.

---

### App Header

Application-level header bar inside the Platform Nav main content region.

Do:

- Use for product/app title, global search, global actions, help and account.
- Keep the number of header actions small.
- Use Navigation Tabs below the App Header only where the approved pattern allows.

Do not:

- Use App Header for page-specific primary actions.
- Stack tabs above the App Header.
- Create a custom top bar.

---

### CIC Nav

Content Innovation Cloud cross-product navigation.

Do:

- Use where cross-product switching between CIC applications is required.
- Keep it consistent with Platform Nav behaviour.

Do not:

- Recreate CIC switching as a custom menu.

---

### Logo

Brand logo component.

Do:

- Use the approved logo component and lockup.
- Preserve clear space and minimum size.

Do not:

- Recolour, stretch or reconstruct the logo.

---

### Navigation List (formerly "Sidenav" in Figma)

Tertiary in-page navigation list.

Note: Satori renamed the Figma "Sidenav" component to **Navigation List** to match code. The Angular Material `Sidenav` is a different component (a drawer container).

Do:

- Use Navigation List for in-page or folder-level navigation.
- Mark the active item with more than colour.
- Support keyboard navigation between items.

Do not:

- Call it "Sidenav" when talking to engineering.
- Use it as the primary product navigation.

---

### Navigation Tabs

Tab-based navigation between sibling views.

Do:

- Use for switching between peer views of the same object.
- Keep tab labels short and in sentence case.
- Show the selected tab with an indicator plus label emphasis.
- Support arrow key navigation within the tab list.

Do not:

- Use tabs for sequential steps — use a Stepper.
- Use more tabs than fit without scrolling on desktop, unless scrollable tabs are intended.
- Use tabs to navigate to unrelated product areas.

---

### Breadcrumbs

Hierarchical location indicator.

Do:

- Use for deep hierarchies.
- Keep the last item as plain text representing the current page.
- Truncate the middle with an overflow menu on narrow viewports.

Do not:

- Link the last breadcrumb item.
- Use breadcrumbs as the only navigation.

---

### Action Bar

Contextual bar for bulk or contextual actions, typically shown on selection.

Do:

- Show on row or item selection.
- Show the selection count.
- Provide a clear way to deselect.
- Anchor the bar to the content it acts on.
- Place destructive actions last and confirm them.

Do not:

- Float bulk actions with no anchor.
- Keep the bar visible when nothing is selected.

---

### Banner

Persistent page-level message.

Do:

- Use for page-level information, warnings, errors or system status.
- Include an icon, a short message and an action where relevant.
- Allow dismissal for non-critical banners.
- Keep the banner compact.

Do not:

- Use a banner for transient confirmation — use Snackbar.
- Stack multiple banners.
- Use a hero block in place of a banner.

---

### Empty State

Placeholder for zero data, no results, permission and error scenarios.

Do:

- Include illustration, heading, supporting message and a next-step action.
- Provide variants for 401, 403, 404 and 500.
- Distinguish "no data yet" from "no results for this filter".
- Offer a recovery action such as clearing filters or creating the first item.

Do not:

- Ship "No data" as a complete empty state.
- Use an empty state where a loading state is correct.

---

### Layout Placeholders / Full-page loading state

Full-page and region-level placeholder states.

Do:

- Use skeletons for content areas.
- Use a full-page loading placeholder for initial page load.
- Preserve the layout shape while loading to avoid content shift.

Do not:

- Use a centred spinner for a whole page of content.
- Use spinners for micro-interactions.

---

### Ghost

Skeleton/ghost loading representation for content.

Do:

- Match the ghost shape to the eventual content.
- Use for tables, lists, cards and detail panels.
- Keep ghost animation subtle and respect reduced motion.

Do not:

- Use ghosts for actions that complete in under ~200ms.

---

### Interactive Card / Actionable Card

Card that acts as a control or navigation target.

Do:

- Give interactive cards a visible stroke unless another affordance exists.
- Provide hover, focus and selected states.
- Make the whole card a single accessible target where possible.

Do not:

- Add a stroke to a non-interactive card.
- Nest interactive cards.
- Put multiple competing click targets inside one card without clear separation.

---

### Card Surface

Neutral container surface for grouping related content.

Do:

- Use for grouping related content.
- Use surface-container tokens for layering.
- Use spacing and headings for internal hierarchy.

Do not:

- Nest cards inside cards.
- Apply heavy drop shadows.

---

### Splitter

Resizable split-pane divider.

Do:

- Use for adjustable list/detail or editor/preview layouts.
- Provide keyboard resizing and a visible focus state.
- Set sensible minimum and maximum pane sizes.
- Persist the user's pane size where useful.

Do not:

- Allow a pane to collapse to an unusable width without an explicit collapse control.

---

### Nested Scrollviews

Managed nested scrolling regions.

Do:

- Use where independent scroll regions are genuinely required, such as list plus detail.
- Keep scroll ownership predictable.
- Preserve scroll position on filter and navigation where sensible.

Do not:

- Create more than two levels of nested scroll.
- Trap scroll unexpectedly.

---

### Split Button

Combined primary action plus related-action menu.

Do:

- Make the default action the most common one.
- Put related variants in the attached menu.
- Label both the action and the menu trigger accessibly.

Do not:

- Put unrelated actions in the menu.
- Use a split button when a simple button is enough.

---

### Tag

Non-interactive label for status, category or metadata.

Do:

- Use defined status variants: success, warning, danger, info, neutral.
- Use Neutral Quiet for de-emphasised metadata.
- Pair status colour with an icon or text.
- Keep tag text short and in sentence case.

Do not:

- Create arbitrary tag colours.
- Use a tag as a button.
- Overload a row with many tags.

---

### Inline Chip

Inline token within text or input, for entities, filters or selections.

Do:

- Use for applied filters, selected recipients or entity references.
- Provide a remove affordance where removal is supported.
- Make chips keyboard removable.

Do not:

- Use chips for primary actions.
- Mix interactive and non-interactive chips without visual distinction.

---

### Rich Tooltip

Richer tooltip supporting a title, body and optional action.

Do:

- Use for supplemental explanation of a control or term.
- Keep content short.
- Make it dismissible and keyboard accessible.

Do not:

- Put critical or only-source information in a tooltip.
- Use a tooltip where inline help text is clearer.

---

### Avatar

User or entity representation.

Do:

- Use initials fallback when no image exists.
- Provide an accessible name.
- Use consistent sizes across the product.

Do not:

- Use avatars as the only identifier in dense lists.
- Rely on avatar colour to convey meaning.

---

### Upload / File Upload

File selection and upload component.

Do:

- Support both drag-and-drop and a browse control.
- State accepted file types and maximum size before upload.
- Show per-file progress, success and error states.
- Allow cancel and retry.
- Provide a keyboard-accessible browse control.

Do not:

- Rely on drag-and-drop alone.
- Fail silently on rejected files.
- Hide the file size or type constraints until after failure.

---

### Illustration

Illustration set for empty, error and onboarding states.

Do:

- Use Satori Illustrations only.
- Pair illustration with a text message.
- Keep illustration size proportionate in dense views.

Do not:

- Embed text inside illustrations.
- Use illustration as the only means of communication.

---

### File Type Icons

Icon set representing document and file types.

Do:

- Use the Satori file type icon set.
- Pair the icon with the file name and, where relevant, the type and size.

Do not:

- Invent file type icons.
- Use file type icon colour as the only differentiator.

---

### Table with Row States

Satori table variant with defined row interaction states.

Do:

- Implement default, hover, focus, selected, active, disabled and error row states.
- Combine checkbox, background and a border-left accent for selection.
- Keep row actions discoverable and keyboard reachable.

Do not:

- Use a background tint alone to show selection.
- Hide row actions behind hover only, without keyboard access.

---

### Content Grid

Advanced data grid pattern for enterprise data needs.

Do:

- Use for advanced needs such as sticky columns, custom cell content, column configuration, grouping and controlled truncation.
- Provide sorting, filtering, pagination and density options where the task requires them.
- Provide a mobile fallback such as a card list or drill-down.
- Support keyboard navigation across cells and controls.

Do not:

- Force horizontal scroll on mobile without a fallback.
- Add grid features that the task does not need.
- Build a custom grid when the Content Grid pattern applies.

---

### Rich Text Editor

Status: Satori-approved editor is pending. Editor library selection is under evaluation.

Do:

- Use the Satori-approved editor when available.
- If a prototype requires rich text now, mark it clearly as an interim approximation.
- Keep the toolbar minimal and label every control.

Do not:

- Invent a custom production rich-text editor.
- Assume a specific third-party editor is approved.

---

## B2. Angular Material components themed by Satori

Use these primitives when Satori does not provide a custom component. They inherit Satori theming for colour, typography, shape and focus.

### Autocomplete

Do: filter as the user types, announce result counts, allow free text where valid, and show a clear no-results message.
Do not: hide the input value, or require mouse-only selection.

### Badge

Do: use for small counts or status dots; provide an accessible label such as "3 unread".
Do not: use badge colour alone to convey meaning, or use badges for long text.

### Bottom Sheet

Do: use on mobile for contextual action lists; support swipe and keyboard dismissal.
Do not: use on desktop where a menu or dialog is more appropriate.

### Button

Variants: filled (primary), tonal, outlined (secondary), text (tertiary), elevated, icon, FAB.

Do:

- Use one primary action per view or dialog.
- Order actions: primary → secondary → tertiary → inline.
- Provide an accessible name for icon-only buttons.
- Explain disabled buttons with a tooltip, or hide until actionable.

Do not:

- Use multiple primary buttons in one view.
- Use a `div` as a button.
- Duplicate the primary CTA at the top and bottom of a short view.

### Button Toggle

Do: use for mutually exclusive or multi-select view options; show selected state with an icon, checkmark, stroke or label weight in addition to colour.
Do not: rely on background colour alone for the selected state.

### Card

Do: use for grouped content; add a stroke only when interactive.
Do not: nest cards, or use heavy shadows.

### Checkbox

Do: use for independent multi-select; provide a visible label; support indeterminate state for parent rows.
Do not: use a checkbox for an immediate destructive action without confirmation.

### Chips

Do: use for applied filters, selections and entity tokens; make removal keyboard accessible.
Do not: use chips as primary buttons.

### Datepicker

Do: show the expected format as helper text; allow typed entry as well as calendar selection; support keyboard navigation in the calendar; handle time zones explicitly where relevant.
Do not: rely on calendar-only entry, or use ambiguous numeric date formats without a hint.

### Dialog

Do: use for blocking decisions and focused tasks; trap focus; return focus to the trigger on close; allow Esc to close non-destructive dialogs; use a clear title and one primary action; confirm destructive actions with explicit labels.
Do not: use a dialog for transient confirmation, or nest dialogs.

### Divider

Do: use to separate sections where spacing alone is insufficient.
Do not: use dividers plus borders plus cards for the same grouping.

### Expansion Panel

Do: use for progressive disclosure of secondary detail; make the whole header a keyboard target; show expanded state with an icon and state change.
Do not: hide critical information behind collapse by default, or apply heavy shadows.

### Form Field

Do: use outlined form fields; use visible persistent labels; mark required fields explicitly and set `aria-required`; show helper text for format expectations; associate errors with `aria-describedby`; combine icon, colour and text for errors.
Do not: use placeholder text as the only label; mark required with colour alone; show red-text-only errors.

### Grid List

Do: use for uniform tile content such as thumbnails; keep tile actions accessible.
Do not: use grid list for tabular data.

### Icon

Do: use the Satori icon set; mark decorative icons as hidden from assistive technology; give meaningful icons an accessible name.
Do not: mix icon families, or use icons without labels for ambiguous actions.

### Input / Textarea

Do: size inputs to the expected content; show character limits when enforced; support autofill and paste.
Do not: block paste, or silently truncate input.

### List

Do: use for simple item collections; support keyboard navigation; use consistent line counts and density.
Do not: use a list where a table's columns are needed.

### Menu

Do: use for secondary actions; group related items with dividers; support arrow key navigation and Esc; label the trigger.
Do not: hide the primary action inside a menu, or nest menus more than one level.

### Paginator

Do: show total count and current range; offer page size options for dense tables; reset to page 1 on filter change.
Do not: hide the total count when it affects the user's decision.

### Progress Bar

Do: use determinate when progress is measurable; announce progress via a live region; pair with text such as "3 of 12 processed".
Do not: use a progress bar as the only success signal.

### Progress Spinner

Do: use for atomic actions such as saving a form; use the default Satori sizing.
Do not: use for full-page content loading — use ghosts or layout placeholders.

### Radio Group

Do: use for a single choice among a small visible set; provide a group label; support arrow key navigation.
Do not: use radios for more than about seven options — use a select.

### Ripple

Do: keep default Satori ripple behaviour; respect reduced motion.
Do not: add custom ripple effects.

### Select

Do: use for a single choice from a longer list; show the current value; support type-ahead; provide a clear empty option where "none" is valid.
Do not: use a select for two options where a toggle or radio is clearer.

### Multi-select

Status: Satori's enhanced multi-select based on Hyland UI is in progress. Use the Angular Material multi-select in the interim and mark it as interim.

Do: show selected count, allow select-all and clear-all where useful, and show selections as chips when space allows.
Do not: build a custom multi-select duplicate.

### Sidenav (Angular Material drawer)

Do: use for drawer or side sheet containers; support Esc close and focus management; use `over` mode on mobile and `side` mode on desktop where appropriate.
Do not: confuse this with the Satori Navigation List.

### Side Sheet

Do: use for contextual detail or editing without leaving the list; keep the list context visible on desktop; provide an explicit close; keep primary and cancel actions anchored.
Do not: use a side sheet for blocking decisions — use a dialog.

### Slide Toggle

Do: use for immediate on/off settings; label the state clearly; confirm if the change is destructive or system-wide.
Do not: use a slide toggle where a form requires an explicit save.

### Slider

Do: provide a numeric readout; support arrow key adjustment; show min, max and units.
Do not: use a slider where precise values matter without a paired numeric input.

### Snackbar

Do: use for transient confirmation of a completed action; include an undo action for reversible actions; keep it short; ensure it does not obscure the related control.
Do not: use a snackbar for critical, blocking or persistent errors; do not stack snackbars.

### Sort Header

Do: show the sort direction with an icon plus accessible state; keep the default sort predictable.
Do not: sort on hover, or hide the current sort state.

### Stepper

Do: use for sequential multi-step tasks; show progress and completed steps; allow back navigation; validate per step; summarise as "Step X of Y" on mobile.
Do not: show the full horizontal stepper on mobile; do not allow forward navigation past invalid required steps without explanation.

### Table

Do: use for structured tabular data; define header, row and cell behaviour; provide sorting, selection, pagination and row actions where the task needs them; provide an ARIA summary; provide a mobile fallback.
Do not: use a table for layout; do not force horizontal scroll on mobile without a fallback.

### Tabs (Material)

Do: use for peer content within a page; support arrow key navigation; keep tab content independent.
Do not: use Material tabs where Satori Navigation Tabs is the approved pattern.

### Toolbar

Do: use for page-level actions and view controls; keep the primary action first; collapse into an overflow menu on narrow viewports.
Do not: duplicate App Header actions in the toolbar.

### Tooltip

Do: use for short supplemental hints; make it available on keyboard focus; keep it dismissible.
Do not: put critical information in a tooltip only; do not use a tooltip as a label.

### Tree

Do: use for hierarchical structures such as folders; support expand and collapse, arrow key navigation and a visible focus indicator; show loading state for lazily loaded nodes.
Do not: use a tree where a simple list or breadcrumb is sufficient.

### Link

Do: link the whole meaningful phrase; use the `launch` icon for external links; include type and size for downloads.
Do not: use "click here" or "more"; do not italicise URLs.

---

## B3. Component selection quick map

| Need | Use |
|---|---|
| Global product navigation | Platform Nav |
| Cross-product switching | CIC Nav |
| App title, global search and account | App Header |
| Peer views within a page | Navigation Tabs |
| In-page or folder navigation | Navigation List |
| Location in hierarchy | Breadcrumbs |
| Hierarchical structure | Tree |
| Page-level actions | Toolbar |
| Bulk actions on selection | Action Bar |
| Main action | Button (filled) |
| Action with variants | Split Button |
| Secondary actions list | Menu |
| Structured data | Table / Table with Row States |
| Advanced data needs | Content Grid |
| Uniform tiles | Grid List |
| Simple collection | List |
| Sequential task | Stepper |
| Blocking decision | Dialog |
| Contextual detail or edit | Side Sheet |
| Mobile action list | Bottom Sheet |
| Persistent page message | Banner |
| Transient confirmation | Snackbar |
| Short hint | Tooltip / Rich Tooltip |
| Zero data or error page | Empty State |
| Page loading | Layout Placeholder / Ghost |
| Action in progress | Progress Spinner / Progress Bar |
| Status or metadata label | Tag |
| Applied filter or token | Inline Chip / Chips |
| Single choice, short list | Radio Group |
| Single choice, long list | Select |
| Multiple choice | Checkbox / Multi-select |
| Immediate setting | Slide Toggle |
| View option switch | Button Toggle |
| Free text with suggestions | Autocomplete |
| Date entry | Datepicker |
| File selection | Upload |
| User representation | Avatar |
| Resizable panes | Splitter |
| Progressive disclosure | Expansion Panel |
| Grouped content | Card Surface |
| Clickable card | Interactive Card |

---

# PART C — PATTERNS

## C1. List and detail

Do:

- Show a table or list as the primary region.
- Open detail in a side sheet for quick review, or a full page for deep editing.
- Preserve list scroll position and selection when returning.
- Keep the selected row visibly marked while detail is open.

Do not:

- Lose filters or scroll on return.
- Use a dialog for long detail content.

## C2. Filtering and search

Do:

- Use a sidebar filter with expand and collapse on desktop.
- Use drill-down filters on mobile.
- Show applied filter chips with a clear-all action.
- Show a result count.
- Filter asynchronously and preserve scroll where sensible.
- Reset pagination when filters change.
- Provide a distinct empty state for "no results for this filter".

Do not:

- Reload the page on every filter change.
- Hide the applied filters.

## C3. Create and edit

Do:

- Use a full page or side sheet for creation.
- Group fields under headings.
- Validate inline on blur and on submit.
- Show a clear save state: idle, saving, saved, error.
- Warn before discarding unsaved changes.

Do not:

- Rely on a single generic error at the top with no field association.
- Auto-save destructive changes without an undo.

## C4. Destructive actions

Do:

- Confirm with a dialog that names the object and the consequence.
- Use an explicit action label such as "Delete component".
- Provide undo where reversal is possible.
- Place the destructive action visually last.

Do not:

- Use "Are you sure?" as the only content.
- Use a snackbar as the only confirmation for an irreversible action.

## C5. Long-running and asynchronous actions

Do:

- Confirm that the request was accepted, not that it completed, when completion is deferred.
- Show a status that can be refreshed.
- Explain that status may take time to update.
- Scope feedback to the affected object.
- Announce updates in a live region.

Do not:

- Imply completion when the action is only queued.
- Leave the user without a way to check current status.

## C6. Dashboards and overviews

Do:

- Lead with the most decision-relevant metric.
- Provide a clear path from summary to detail.
- Use consistent card and surface treatment.
- Provide empty and error states per widget.

Do not:

- Fill the page with decorative charts.
- Use dense charts without text summaries.

## C7. Permissions and restricted states

Do:

- Explain why an action is unavailable.
- Prefer hiding truly unavailable actions; disable with an explanation when the user should know it exists.
- Use the 403 empty state for restricted pages.

Do not:

- Show a disabled control with no explanation.
- Reveal information that requires elevated permissions.

---

# PART D — STATES, ACCESSIBILITY AND KEYBOARD

## D1. Interaction states

Every interactive component must include relevant states:

- Default
- Hover
- Focus
- Active / pressed
- Selected
- Disabled
- Loading
- Empty
- Error
- Success
- Read-only

Focus requirements:

- Visible
- At least 2px
- Meets 3:1 contrast
- Never removed for keyboard users

For modals and overlays:

- Trap focus.
- Return focus to the trigger on close.
- Allow Esc to close when appropriate.

Do not:

- Hide focus indicators.
- Let focus jump unpredictably.
- Let focus escape a modal.
- Ship screens without relevant states.

## D2. Keyboard model by component

| Component | Keyboard behaviour |
|---|---|
| Button | Enter, Space |
| Link | Enter |
| Checkbox | Space |
| Radio group | Arrow keys move and select, Tab enters group |
| Select | Enter or Space opens, arrows move, Enter selects, Esc closes |
| Autocomplete | Arrows move, Enter selects, Esc closes |
| Menu | Enter or Space opens, arrows move, Esc closes, Tab closes |
| Tabs | Arrows move, Home and End jump, Enter or Space activates |
| Dialog | Tab cycles inside, Esc closes, focus returns to trigger |
| Side sheet | Tab cycles inside when modal, Esc closes |
| Table | Tab reaches controls, arrows within grid where grid semantics apply |
| Tree | Arrows move and expand or collapse, Home and End jump |
| Stepper | Tab between controls, arrows between step headers where applicable |
| Slider | Arrows adjust, Home and End set min and max, Page Up and Down for large steps |
| Chips | Tab to chip, Delete or Backspace removes |
| Expansion Panel | Enter or Space toggles |
| Splitter | Arrows resize |
| Snackbar | Action reachable by Tab before dismissal |

## D3. Accessibility checklist

Always check:

- Keyboard access
- Focus order
- Focus visibility
- Screen reader names
- Semantic structure
- Landmarks: `header`, `nav`, `main`, `aside`, `footer`
- Heading hierarchy with exactly one H1
- ARIA only where native semantics are insufficient
- Live regions for async updates
- Reduced motion support
- Zoom at 200%
- Reflow at 400%
- Captions or transcripts for media
- Touch targets of at least 44×44 CSS px

Do:

- Give every input a programmatic label.
- Give icon-only controls an accessible name.
- Pair colour with text, icon, stroke, shape or label.
- Support mouse, keyboard, voice, touch and assistive technology.
- Keep critical paths usable with a single input mode.

Do not:

- Build div-soup interfaces.
- Use `title` as the only label.
- Duplicate Satori's "Skip to main content".
- Use device-specific verbs such as tap, click or type.
- Use directional language such as left, right, above or below.
- Rely on colour alone.
- Put critical information only in a tooltip.

## D4. Usability heuristics and UX laws

Apply when relevant:

- Visibility of system status
- Match between system and real world
- User control and freedom
- Consistency and standards
- Error prevention
- Recognition over recall
- Flexibility and efficiency
- Aesthetic and minimalist design
- Error recovery
- Help and documentation
- Hick's Law
- Fitts's Law
- Jakob's Law
- Miller's Law
- Doherty Threshold

Design implications:

- Use progressive disclosure.
- Keep frequent actions easy to reach.
- Use familiar enterprise patterns.
- Group information into manageable chunks.
- Provide immediate feedback.
- Use ghosts or optimistic feedback for perceived speed.
- Confirm or provide undo for destructive actions.

Do not:

- Show every option at once.
- Bury the primary action.
- Duplicate the primary CTA in a short view.
- Ship destructive actions without confirmation or undo.

---

# PART E — MICROCOPY

## E1. Voice

Do:

- Be honest, clear and approachable.
- Use simple language below high-school reading level.
- Lead with the main point.
- Use active verbs.
- Be specific and consistent.
- Keep copy positive and empathetic.

Do not:

- Use robotic or tentative phrasing.
- Use slang or unnecessary jargon.
- Use idioms, metaphors or wordplay.
- Use emojis.
- Use negative framing when a positive alternative exists.

## E2. Grammar

Do:

- Use active voice.
- Use present tense for actions.
- Use past tense for completed confirmations, for example "Document uploaded".
- Use second person for instructions.
- Use first person for logged-in-user labels, for example "My documents".
- Use specific nouns instead of vague pronouns, for example "Document sent" not "It sent".

Do not:

- Use passive voice.
- Use ambiguous pronouns.
- Mix contractions and full forms in the same UI.
- Use awkward contractions such as there'd or it'll.
- Use contractions in critical errors.

## E3. Case

Do:

- Use sentence case by default.
- Use Title Case only for proper nouns, product names, data types and structural names such as form, document type, category and queue names.
- Capitalise all words in Title Case except articles, coordinating conjunctions and prepositions.
- Capitalise names and companies in email addresses.
- Use lowercase filenames, for example `ap_invoice.pdf`.
- Use uppercase generic extensions, for example PDF, PDFs, JPEG.

Do not:

- Use Title Case for buttons, tabs, labels, dialog titles or body copy.
- Use ALL CAPS outside approved status tags.

## E4. Punctuation

Do:

- Use ampersands only in official names or accepted shorthand.
- Use apostrophes for possessives only; `its` is the possessive of it.
- Use filled bullets at the first level and open bullets at the second.
- Use periods for full sentences and none for fragments.
- Capitalise the first word after a colon, with one space.
- Omit the Oxford comma; add a comma when an item contains "and"; use semicolons when items contain commas.
- Use an em dash with spaces for emphasis.
- Use an en dash without spaces for ranges.
- Use hyphens for compound modifiers, not after -ly adverbs.
- Use one space after periods.
- Use dashes in displayed phone numbers.
- Hyperlink the full meaningful phrase and omit `http://www.`.

Do not:

- Use ampersands instead of "and" in body copy, headings or titles.
- Use apostrophes for plurals.
- Overuse exclamation points.
- Use two spaces after periods.
- Italicise URLs.

## E5. Numbers, dates, time and files

Do:

- Use numerals for all numbers.
- Use commas for 1,000 and above.
- Use the `%` symbol.
- Use `MM-DD-YYYY` only for dense lists or informal use.
- Use the formal form "Saturday, April 14, 2018".
- Omit a comma between month and year when no day is given.
- Use `a.m.` and `p.m.` in lowercase with periods, and include the time zone.
- Use "noon" and "midnight" rather than 12 p.m. and 12 a.m.
- Use an en dash within the same half of the day and "to" across halves.
- Abbreviate durations as `h`, `min`, `s`.
- Use ISO currency codes such as USD, EUR and INR.

Do not:

- Spell out numbers in the UI.
- Use currency symbols in system strings.
- Use slashes, dashes or periods in formal dates.
- Add `st`, `nd`, `rd` or `th` to dates.

## E6. Error messages

Errors must be simple, polite, contextual, actionable, non-blaming, visually associated with the affected object and security aware.

Do:

- Name the affected object.
- Explain the cause when known.
- Provide a recovery action.
- Use `please` when asking for corrective action and `sorry` when the cause is unknown.
- Use present tense and numerals.

Do not:

- Blame the user by using "you" or "your" to describe the problem.
- Say "try again" if retry is unlikely to help.
- Ask users to contact an administrator unless it is the only path.
- Disclose secure data.
- Use vague errors such as "Something went wrong" without cause or action.

## E7. Content structure

Do:

- Lead with the most important information.
- Group related content under descriptive headings that nest consecutively.
- Use lists instead of dense paragraphs.
- Provide ARIA summary labels for data-heavy tables.
- Keep forms short, mark required fields explicitly and show input requirements.
- Provide alt text: describe functional and decorative images in detail, icons by the action they represent, and charts by the data shown.
- Provide captions or transcripts for video.

Do not:

- Bury critical context in paragraphs.
- Fragment related content.
- Use headings only for visual styling.
- Use special characters or emojis in text; spell out "Add" instead of "+".

## E8. Translation readiness

Do:

- Use short, precise, unambiguous language.
- Use consistent terminology.
- Give the full term on first use of an acronym.
- Allow about 30% extra space for translated strings.
- Use built-in text flow rather than hard line breaks.
- Use ISO currency codes tied to a region.
- Assume admin-configured strings and user input are not translated.
- Support Unicode.

Do not:

- Use idioms, jokes, metaphors or mnemonics.
- Embed text in images.
- Convert nouns into verbs such as "OCR'd".
- Assume addresses, temperature units or municipality names translate cleanly.

---

# PART F — QUALITY AND EXCEPTIONS

## F1. Visual fidelity guardrails

Avoid:

- Generic AI-generated dashboards
- Consumer-style gradients
- Excessive rounded corners
- Excessive shadows
- Decorative illustration outside Satori empty states
- Random accent colours
- Overly large whitespace
- Overly dense unreadable layouts
- Fake component libraries
- Tailwind or shadcn visual defaults unless explicitly requested

Prefer:

- Calm neutral surfaces
- Clear hierarchy
- Practical density
- Consistent spacing
- Accessible contrast
- Clear table and form patterns
- Satori-like action hierarchy
- Enterprise-ready interaction behaviour

## F2. Handoff and annotation

Include:

- Satori component name
- Component variant
- Token names
- Interaction states
- Keyboard behaviour
- ARIA requirements
- Focus behaviour
- Responsive behaviour
- Empty, error, loading and success behaviour
- Any Satori gap or exception

Do not ship:

- Frames without state coverage
- Missing responsive variants
- Hex-only token references
- "TBD" placeholders unless marked as `Design gap — pending Satori`

## F3. Quality checklist

- Components map to Satori or an exception is flagged.
- Tokens are used and named.
- Typography follows Satori.
- Copy uses sentence case.
- Body text is at least 16px.
- Line-height is at least 150%.
- Contrast meets WCAG 2.2 AA.
- Selected states are not colour-only.
- Keyboard access and focus behaviour are defined.
- Empty, loading, error and success states are included.
- Responsive behaviour is addressed.
- Mobile targets are at least 44×44 CSS px.
- Microcopy follows Satori writing rules.
- Translation expansion is considered.
- Edge cases are covered.
- No hard-fail anti-patterns remain.

## F4. When Satori does not cover a case

1. Check Satori documentation.
2. Check Satori Storybook.
3. Check Satori Patterns and the Satori Figma Design Library.
4. Check Angular Material and Material Design 3.
5. Use the closest approved pattern.
6. Flag the gap with a rationale.
7. Recommend a Satori design support request.
8. Do not silently invent a pattern.

## F5. Known gaps and interim decisions

- **Multi-select** — Satori's enhanced version based on Hyland UI is in progress. Use the Angular Material multi-select in the interim and mark it as interim.
- **Rich text editor** — No Satori-approved editor yet. Do not build a custom production editor. Mark any prototype editor as interim.
- **Content grid features** — Some grid features such as sticky columns exist in Angular Material but not yet in the Satori Figma library. Flag these as Angular Material capabilities.
- **Naming** — The Figma "Sidenav" component is now **Navigation List**. Use the new name with engineering.
