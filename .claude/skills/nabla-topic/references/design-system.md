# NABLA — Design system

Everything visual flows from `assets/css/tokens.css` — the single source of
truth. **Never hardcode a colour, font, or SVG stroke width anywhere else**,
SVG included (use the CSS classes below, or `currentColor`). If a value you
need doesn't exist as a token, that's a signal to reuse an existing component,
not to invent a colour.

## Theming model

- Theme set via `data-theme="dark|light"` on `<html>`; **dark is the brand
  default for everyone** — `prefers-color-scheme` is deliberately ignored.
- An inline `<head>` snippet resolves the theme before first paint
  (localStorage `nabla-theme` = 'light' → light, else dark); `theme.js`
  handles the toggle button (`.js-toggle-theme`, label « ☀︎ clair » /
  « ☾ sombre » — note U+FE0E after ☀ so iOS doesn't render an emoji).
- Every visual must be checked in BOTH themes. SVG stroke widths are
  per-theme tokens (thicker on dark): `--sw-grid`, `--sw-curve`,
  `--sw-curve-hero`, `--sw-tan`, `--sw-tan-mini`, `--sw-motif`.

## Token vocabulary (names, not values — values live in tokens.css)

- **Surfaces**: `--bg` (page), `--surface` (cards, widget frames), `--chip`
  (chips, staircase cells).
- **Text**: `--text`, `--muted` (secondary prose, captions), `--faint`
  (kickers, labels, mono metadata).
- **Lines**: `--hair` (external hairlines), `--hairIn` (internal separators),
  `--edge` (high-contrast frame of DÉFINITION/PIÈGES/ESSENTIEL/BAC blocks),
  `--dash` (MÉTHODE dashes), `--dash2` (« bientôt » dashes), `--ghost`
  (« bientôt » SVG motifs).
- **Graph**: `--grid`, `--axis`, `--chalk` (the reference curve — « la
  craie »), `--guide` (dashed guides), `--tick` (unlit level bars).
- **Accent family**: `--accent`, plus derived `--accTint` (13%/6% mix,
  block backgrounds), `--accTint2` (stronger, active cells/chips),
  `--accEdge` (borders). Derived via `color-mix(in oklab, …)` in tokens.css.
- **Semantic pair**: `--good`/`--goodTint` (green — rises, correct),
  `--bad`/`--badTint` (red — falls, wrong). Used for slope/state chips and
  quiz feedback ONLY; don't dilute the semantics.
- **Inverted bands**: `--band-bg`/`--band-fg`/`--band-muted` — table
  headers, VERS LE BAC banner, « glisse-moi » tag.

## Typography

- `--font-serif` Spectral — all prose. `--font-mono` IBM Plex Mono — every
  label, kicker, chip, button, breadcrumb, readout (uppercase + letter-spacing
  for kickers/tags). `--font-math` STIX Two Text italic — maths labels
  **inside SVG only** (`.etiquette-math`); HTML maths is KaTeX.
- Layout tokens: `--page-max` 1100px, `--content-max` 720px (chapter column),
  `--sommaire-w` 230px, breakpoint 920px (sommaire desktop/mobile),
  `--pad-x` fluid gutters; radii `--radius-card|block|chip`.

## Reusable components (implemented ONCE in chapitre.css — reuse, never fork)

Course blocks (see any chapter page for exact markup):

| Component | Class | Look | Use for |
|---|---|---|---|
| DÉFINITION | `.bloc-definition` + `.bloc-tag` | edge border, floating tag | formal definitions |
| PROPRIÉTÉ | `.bloc-propriete` + `.bloc-label` | accTint background | theorems/formulas |
| MÉTHODE | `.bloc-methode` + `.methode-etape` | dashed border, numbered steps | procedures |
| À RETENIR | `.bloc-retenir` | accent border + tint, centered | the one-liner to memorise |
| POURQUOI ? | `.bloc-pourquoi` | accent left rule, quiet | intuition behind a formula |
| EXEMPLE RÉSOLU | `.bloc-exemple` + `.exemple-item` | surface card, étape labels | méthode executed live |
| LES PIÈGES CLASSIQUES | `.bloc-pieges` + `.piege` | edge card, separated rows | 4–5 classic errors |
| L'ESSENTIEL EN 5 LIGNES | `.bloc-essentiel` + `.essentiel-ligne/-label` | edge card, label column | recap before exercises |
| Tables | `.tableau` + inverted `figcaption` | banded header, `.defile` scroll wrapper | usuelles/opérations/face-à-face; totals variant `.total`/`.sep-total`/`.ligne-total` |
| Tableaux signes/variations | `.tab-grille` (+`.tab-signes`/`.tab-variations`/`--mini`) | CSS grid | arrows are inline SVG `.var-fleche` (viewBox 0 0 88 56) — **never** the characters ↗/↘ (emoji on mobile) |
| Formula showcase | `.math-vitrine` (+`--grande`) | reserved min-height (no CLS), centered, x-scrollable | display maths |
| Static graph | `.figure-graph` + figcaption | full-width SVG | non-interactive figures |

Widget frame & controls:

- `.widget` frame (surface, radius-card) → `.widget-tete` (title row:
  `.pill-interactif` INTERACTIF/TESTE-TOI pill + `.widget-titre`; right slot
  = `.segmente` presets OR `.btn-pill.js-reset` « ↺ réinitialiser ») →
  SVG(s) `.widget-graph` (stacked graphs separated by `.graph-scinde`) →
  `.widget-pied` (readouts) and/or `.widget-note` (mono footnote).
- Controls: `.segmente` (segmented presets, `aria-pressed`), `.btn-pill`
  (+`--accent` for the primary action), `.curseur-ligne` (styled native range
  with `--pos` fill; `--libelle` variant for long labels), `.chips`/`.chip`
  (+`--accent/--good/--bad`), `.lecture-taux`/`.frac` (live fraction),
  `.lecture-eq`, `.lecture-formule` (mono instantiated formula),
  `.widget-legende` (italic revealed caption), `.widget-question`.
- Quiz: `.quiz-corps`, `.quiz-question`, `.quiz-enonce` + `.quiz-num`,
  `.quiz-reponses`/`.quiz-reponse` (`data-etat="bonne|fausse"`),
  `.quiz-retour` + `.verdict--bonne/--fausse`, `.quiz-score`.
- Exercises: `.exercice`, `.exercice-tete/-label/-theme/-niveau`,
  `.niveau-barres` (3 bars, `.plein` filled), `.exercice-enonce`,
  `.corrige-toggle`, `.corrige` + `.corrige-tag` + `.etape-label` +
  `.conclusion`; `.bac` + `.bande-inversee` for VERS LE BAC.
- Page: `.chap-entete` (`.fil-ariane`, h1, `.chap-savoir` + `.savoir-tag`,
  `.chap-meta`), `.chap-layout` (sticky `.sommaire` ≥920px + mobile
  `<details>.sommaire-mobile`), `.chap-section` + `.prose`,
  `.pied-chapitre` (CHAPITRE SUIVANT + contact), `.site-footer--chapitre`.
- Homepage: `.carte-chapitre` (info + `.carte-motif` SVG), `.carte-bientot`,
  `.grille-bientot`, `.rangee-chapitres`, `.bande-comment`, `.hero`.

Shared SVG classes (chapitre.css): `.g-grid .g-axis .g-courbe
.g-courbe-derivee .g-tangente(-mini) .pente-pos/neg/nulle .g-guide(-accent)
.pt-halo .pt-point .pt-fixe .pt-b .pt-derivee .pt-suite .pt-craie
.etiquette-math(--muted/--accent) .etiquette-mono .hit-zone .hint-tag`.
Chapter-specific SVG vocabularies already exist for sequences (`.g-marche`,
`.som-*`), populations (`.pt-pop*`, `.cadre-univers`, `.pop-dim`), trees
(`.arbre-*`, `.pt-noeud`), bars/gauges (`.seg-*`, `.jauge-*`), dépistage
(`.pt-vp/fn/fp/vn`, `.puce*`).

## Do / don't

- DO copy component markup verbatim from an existing chapter and change only
  the content. The components are the design language.
- DO put any genuinely new chapter-specific CSS at the end of chapitre.css
  under a banner comment, colours from tokens only — and document it in the
  chapter README under « Components introduced by this chapter ».
- DO keep the craie/accent role split in graphs: the reference object
  (curve, point cloud) is `--chalk`; the thing that responds to the student
  (tangent, staircase, trace, selected path) is `--accent`.
- DON'T introduce new colours, fonts, shadows, or gradients. No drop
  shadows exist anywhere on the site.
- DON'T use Unicode arrows ↗/↘ (emoji on mobile), a bare ☀ (append U+FE0E),
  or combining-overline in SVG text (draw negation bars as paths).
- DON'T style with inline `style=` attributes or `<style>` blocks in pages
  (the only inline script is the theme snippet + KaTeX onload).
- DON'T forget `:focus-visible` comes free from base.css — but anything
  clickable must be a real `<button>` to get it.
