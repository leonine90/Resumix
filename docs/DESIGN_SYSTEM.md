# Design System — Resumix

## Design System Choice: Vuetify 3 (Material Design 3)

**Why:** Vuetify 3 is already installed and registered globally. It ships MD3 tokens, a full component library (dialogs, chips, navigation drawer, snackbars, etc.), and integrates natively with Nuxt 3. Switching to shadcn/Tailwind would require a full stack swap. The right move is to **fully adopt Vuetify 3** instead of the current hybrid of Vuetify-registered-but-unused + hand-rolled CSS.

---

## Design Tokens (centralised in `plugins/vuetify.client.ts`)

### Color Palette (MD3-compliant)
| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#1565C0` | CTAs, active states, links |
| `primary-container` | `#E3F2FD` | Editable hover backgrounds |
| `secondary` | `#2E7D32` | Success, AI features |
| `secondary-container` | `#E8F5E9` | AI badge backgrounds |
| `error` | `#C62828` | Errors, delete actions |
| `surface` | `#FFFFFF` | Card/resume background |
| `surface-variant` | `#F5F7FA` | Sidebar background |
| `on-surface` | `#1C1B1F` | Body text |
| `on-surface-variant` | `#49454F` | Secondary text |
| `outline` | `#CAC4D0` | Borders, dividers |

### Typography Scale
| Role | Size | Weight | Usage |
|------|------|--------|-------|
| `display-large` | 40px / 2.5rem | 700 | Resume name (h1) |
| `headline-medium` | 24px / 1.5rem | 500 | Resume title/subtitle |
| `title-large` | 18px / 1.125rem | 600 | Section headings (h2) |
| `title-small` | 14px / 0.875rem | 600 | Sidebar panel titles |
| `body-medium` | 12px / 0.75rem | 400 | Resume body text |
| `label-small` | 11px / 0.6875rem | 600 | Badges, status chips |

### Spacing Scale (4px base)
`4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 64`

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Editable fields |
| `sm` | 8px | Buttons, chips |
| `md` | 12px | Cards, panels |
| `lg` | 16px | Modals, drawers |

### Elevation (MD3 tonal)
| Level | Shadow | Usage |
|-------|--------|-------|
| 0 | none | Flat surfaces |
| 1 | `0 1px 3px rgba(0,0,0,0.12)` | Sidebar, toolbar |
| 2 | `0 4px 12px rgba(0,0,0,0.12)` | Floating toolbar, PDF button |
| 3 | `0 8px 24px rgba(0,0,0,0.16)` | Modals, dialogs |

### Breakpoints
| Name | Value |
|------|-------|
| `sm` | 600px |
| `md` | 960px |
| `lg` | 1280px |

---

## UI Strategy Backlog (Phase 4 source)

| Feature | Suggested UI Pattern | Why | Priority |
|---------|---------------------|-----|----------|
| **Design tokens / theme** | Centralise all tokens in `vuetify.client.ts` | Single source of truth, all components inherit | P0 |
| **Global base styles** | Clean up `pages/index.vue` `<style>` — remove ad-hoc px values, unify font-family | Eliminate style debt before component work | P0 |
| **PDF Download button** | Replace float card with a Vuetify `v-btn` (elevated, primary color) fixed top-right | Consistent with MD3; remove raw card wrapper | P1 |
| **Sidebar** | Replace hand-rolled aside with `v-navigation-drawer` permanent/rail variant; use `v-list` + `v-expansion-panels` for accordion | Native Vuetify handles collapse, keyboard nav, rail mode | P1 |
| **Sidebar accordion panels** | `v-expansion-panels` (accordion mode) | Consistent open/close animation, keyboard accessible | P1 |
| **Resume section headings** | Style `h2` with a bottom-border underline and `title-large` token | Visual hierarchy without new components | P2 |
| **Floating toolbar** | Increase button size to 40×40; wrap in `v-card` with `elevation="2"`; use `v-btn` icon variant | Meets 44px touch target; consistent shadow | P2 |
| **Toast notifications** | Replace custom toast with Vuetify `v-snackbar` | Eliminates custom stack; MD3 compliant | P2 |
| **Modals** | Replace all custom modal overlays with `v-dialog` | Consistent backdrop, focus trap, keyboard close | P2 |
| **Import/AI Import modals** | `v-dialog` → `v-card` with `v-tabs` for JSON/file/AI options | Unified multi-tab import UX |P2 |
| **Job Optimizer / Tailor modal** | `v-dialog` → `v-stepper` for multi-step AI flow | Progress clarity, step validation | P3 |
| **Resume match / score circles** | `v-progress-circular` for score rings | Replaces hand-rolled SVG/CSS circles | P3 |
| **Cover letter modal** | `v-dialog` → `v-card` with `v-textarea` (auto-grow) + word count chip | Consistent with other modals | P3 |
| **Consent modal** | `v-dialog` (persistent) → `v-card` with icon + bullet list | Less intimidating than wall of text | P3 |
| **Keyboard shortcuts overlay** | `v-dialog` → `v-simple-table` or `v-table` | Replace raw `<table>` | P3 |
| **App footer** | Refactor to use `v-footer`; use `v-switch` for AI toggle, `v-chip` for status | Consistent with MD3 surface | P4 |
| **Section order (drag handles)** | Add visible drag handle icon (`mdi-drag`) to each draggable row | Discoverability of drag-to-reorder | P4 |
| **Privacy / ToS pages** | Add shared `v-app-bar` with back navigation | Contextual nav so users can return | P4 |
| **Resume header layout** | Flex layout already correct; polish typography tokens and spacing | Minor cleanup | P4 |
