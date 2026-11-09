---
name: satori-layout-designer
description: Create high-fidelity Figma layouts and user-flow screens using connected Satori Design System components, patterns, tokens, and accessibility guidance. Use when designing or refining Workspace, CIC, search, scope, drawer, metadata, permissions, or other enterprise product experiences in Figma.
---

# Satori Layout Designer

## Purpose

Create production-oriented Figma layouts using the Satori Design System as the primary source of truth. Reuse connected Satori components and established layout patterns before introducing custom UI.

This skill is intended for layout creation and screen-based user flows. It does not require an interactive prototype unless the user explicitly requests one.

## Authoritative references

Open and review these references before creating or modifying the layout:

- Satori documentation: https://satori.hyland.com/latest/welcome-to-satori-rxLu1XA1
- Satori Storybook, Supernova: https://storybook.supernova.io/design-systems/375663/alias/storybook/index.html?path=/docs/documentation-satori-ui-what-is-satori-ui--docs
- Satori Storybook, GitHub Pages fallback: https://sturdy-barnacle-ozo3pr1.pages.github.io/?path=/docs/documentation-satori-ui-what-is-satori-ui--docs
- Satori Storybook component entry: https://sturdy-barnacle-ozo3pr1.pages.github.io/?path=/story/appcomponent--primary
- Material Design 3 guidance: https://m3.material.io/

If a link is inaccessible, use the next available Satori reference. Do not invent component behavior when documentation cannot be accessed.

## Core instructions

1. Inspect the current Figma page, existing screens, local styles, enabled libraries, and nearby product patterns before editing.
2. Use connected instances from the Satori Design Library and Satori Icon Library wherever available.
3. Do not detach Satori component instances.
4. Use Satori layout patterns, component variants, tokens, typography, spacing, elevation, and iconography.
5. Cross-check component anatomy, states, interactions, and constraints in Satori Storybook.
6. Use Satori documentation for design guidance and Storybook for implemented component behavior.
7. Use Material Design 3 only when Satori documentation does not provide sufficient guidance. Satori takes precedence over Material Design 3.
8. Match terminology used by Satori and the existing product. Do not rename established components or patterns.
9. Preserve the existing Workspace or CIC information architecture unless the task explicitly requires changing it.
10. Build accessible layouts with clear hierarchy, logical focus order, adequate contrast, visible focus states, useful labels, and keyboard-compatible controls.

## Component decision hierarchy

Use this order when selecting UI elements:

1. Existing connected Satori component
2. Existing Satori pattern or documented component composition
3. Satori-themed Angular Material primitive supported by the documented system
4. Existing product pattern that is already aligned with Satori
5. Custom component, only when no supported option exists

When a custom solution is unavoidable:

- Keep it visually aligned with Satori tokens and patterns.
- Label it clearly as `Custom / Satori gap`.
- Add an annotation describing the missing capability.
- Do not present it as an official Satori component.

## Layout requirements

- Default to a 1440 px desktop viewport unless another size is specified.
- Use Auto Layout for all major containers and reusable groups.
- Apply responsive resizing and constraints.
- Use consistent Satori spacing rather than arbitrary values.
- Keep page-level navigation, app header, breadcrumbs, actions, content, and supporting panels aligned to the applicable Satori screen-layout pattern.
- Use real components and variants for buttons, icon buttons, form fields, chips, lists, drawers or side sheets, dialogs, banners, snackbars, tables, empty states, and loading states.
- Use text styles and color variables from the connected library.
- Avoid flattened graphics for functional controls.

## Required component checks

For every component used, validate:

- Correct Satori component and variant
- Correct size and density
- Default, hover, focus, active, selected, disabled, error, and loading states where relevant
- Label and helper-text behavior
- Leading and trailing icon behavior
- Minimum target size and keyboard access
- Responsive or overflow behavior
- Storybook parity

## Accessibility requirements

- Follow WCAG 2.2 AA expectations.
- Do not rely on color alone to communicate status.
- Maintain readable contrast and visible focus indicators.
- Use persistent inline validation for field-specific errors.
- Use banners or summaries only when they help users understand or navigate multiple errors.
- Provide labels or accessible names for icon-only actions.
- Keep reading order and focus order consistent with the visual layout.
- Include empty, error, loading, disabled, and no-results states when relevant.
- Consider zoom, text expansion, localization, and narrow viewports.

## Workflow

### 1. Understand the task

Identify the user goal, primary task, target persona, product area, required screens, states, constraints, and expected fidelity. If context is incomplete, make the minimum reasonable assumptions and document them. Do not stop layout creation for minor missing details.

### 2. Audit available Satori resources

Search the Figma assets panel and linked references for screen-layout patterns, navigation, search inputs, buttons, chips, lists, tables, side sheets, dialogs, form controls, validation, banners, snackbars, empty states, and loading states.

### 3. Plan the layout

Define the screen hierarchy, action hierarchy, content regions, component mapping, responsive behavior, and edge states before creating frames.

### 4. Create the screens

Create complete high-fidelity screens, not isolated fragments, unless the user requests components only. For a user flow, include the default, trigger, active, selection, applied, empty, error, and no-results states where relevant.

### 5. Validate the result

Review the final screens for Satori component usage, detached or overridden instances, layout and token consistency, accessibility, terminology, missing states, and Storybook parity.

## Task-specific instruction: Advanced Search and Search Scopes

When the task concerns Advanced Search or Search Scopes, create a scalable desktop search layout with:

- Workspace application structure and navigation
- A prominent search input
- A Filter or Scopes icon button placed immediately beside the search input
- A right-side Satori drawer or side-sheet pattern for reviewing scopes
- A summary-only view of all applied scopes when that is the stated requirement
- Clear grouping of scopes such as repository, content type, creator, owner, department, date range, metadata properties, permissions, and folder or location
- Applied-scope chips or summary rows beneath the search input when needed
- Clear All and per-scope removal actions where supported
- Synchronized drawer and search-result states

If the scope drawer is summary-only:

- Do not add scope-selection controls inside it.
- Do not introduce new filtering logic.
- Show all applied scopes in one scannable view.
- Allow only actions explicitly requested, such as removing a scope or clearing all scopes.
- Keep scope editing in the existing filter tiles, chips, or configuration flow.

## Output expectations

Create clearly named frames and sections, for example:

- `01 - Search - Default`
- `02 - Search - Scope Summary Open`
- `03 - Search - Applied Scopes`
- `04 - Search - Empty Results`
- `05 - Search - Error State`

Add a small design-notes section listing components used, references checked, assumptions, Satori gaps, accessibility considerations, and open design-system questions.

## Prohibited actions

Do not:

- Detach connected Satori components
- Recreate a Satori component manually when a connected instance exists
- Invent undocumented Satori variants
- Use arbitrary colors, spacing, shadows, radii, or typography
- Treat a custom component as Satori
- Add interactions or filtering logic not requested by the user
- Generate a prototype when the request is specifically for user-flow screens
- Replace product terminology without a documented reason

## Completion criteria

The task is complete when all requested screens and states are present, connected Satori components are used without detachment, Storybook behavior is checked, accessibility and responsive behavior are considered, custom elements and assumptions are documented, and frames are organized for review.
