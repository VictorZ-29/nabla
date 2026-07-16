# NABLA — Interactive widget patterns

How every widget on the site is built. Widgets are the point of NABLA: each
one must let the student *perform* the chapter's central gesture (drag B into
A, restrict the universe, pose the second staircase), never decorate. Read
the widget modules named below before writing a new one — copy their idioms.

## Contents

1. [The contract every widget satisfies](#contract)
2. [Module anatomy & instantiation](#anatomy)
3. [nabla-graph.js — the shared helper](#helper)
4. [The five interaction archetypes](#archetypes)
5. [Readout & state-chip idioms](#readouts)
6. [Performance doctrine](#perf)
7. [Accessibility doctrine](#a11y)

## <a name="contract"></a>1. The contract every widget satisfies (from CLAUDE.md)

- Pointer Events (mouse + touch), `touch-action: none` on the drag surface
  (the `.hit-zone` class provides it), drag hit-targets ≥ 44×44 px — an
  invisible enlarged circle (`r=42` in a 640-wide viewBox) around the point.
- Draggable points constrained to the curve: clamp pointer x to the domain,
  compute y = f(x). All maths analytic — f and f′ from config/registry,
  **never numeric differentiation**.
- Keyboard accessible: draggable points are focusable `role="slider"` with
  `aria-valuenow/-min/-max/-valuetext`; arrows ±0,05, Shift ±0,01, Home/End =
  domain ends. Widgets driven by native sliders/buttons get keyboard for free
  (preferred when dragging isn't itself the lesson — suites and probas
  chapters have zero draggable points).
- `prefers-reduced-motion`: no draw-on/transition animations, full
  functionality preserved (`animerValeur` and base.css handle this).
- A reset control restoring the initial state — either a header
  `.btn-pill.js-reset` « ↺ réinitialiser », or an initial-state preset/segment
  that stands in for it (secante's h = 0,90; univers' « tout le monde »).
  If the header slot is taken by `.segmente` presets, the reset button moves
  into the `.widget-pied` (see geometrique).
- French formatting everywhere: decimal comma, true minus U+2212, U+2032
  prime; 2 decimals, 3 when 0 < |v| < 0,1 (`fmt`, `fmtAdaptatif`,
  `fmtCourt` for round slider values).
- One throttled Plausible event per interaction session:
  `track('widget_interact', { widget: '<type>', chapitre })` on first/every
  interaction — analytics.js throttles to 1 per 30 s per key.
- No allocation-heavy work in move handlers; updates coalesced per frame.

## <a name="anatomy"></a>2. Module anatomy & instantiation

One module per widget TYPE in `assets/js/widgets/<type>.js`. A type written
for one chapter must be configuration-only for the next. Skeleton (see
`assets/templates/widget-skeleton.js` in this skill):

```js
/* Nabla — widgets/<type>.js
   « Titre du widget » : une phrase sur le geste pédagogique.
   Spec de l'instance : premiere/maths/<chapitre>/README.md. */
import { el, creerVue, ... } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

function initMonWidget(fig) {
  const d = fig.dataset;               // config from data-* attributes
  /* build static décor once, keep refs to dynamic nodes,
     define rendre(), wire events, call rendre() */
}
for (const fig of document.querySelectorAll('[data-widget="<type>"]')) initMonWidget(fig);
```

Instantiation is declarative in the page — a `figure.widget` carries all
config as `data-*` attributes:

```html
<figure class="widget" id="widget-<type>"
  data-widget="<type>" data-fn="exp" data-a-init="0"
  data-xmin="-2.5" data-xmax="2.5" data-ymin="-1" data-ymax="8"
  data-domaine="-2.2,2.0">
  <div class="widget-tete"> …pill INTERACTIF, titre, reset/presets… </div>
  <svg class="widget-graph" viewBox="0 0 640 400" aria-label="…"></svg>
  <div class="widget-pied"> …curseurs, lectures, chips, légende… </div>
</figure>
```

Conventions: `data-fn` = key in the `FONCTIONS` registry; `data-*-init` =
initial values; `data-domaine="min,max"` = where the point may travel (curve
is drawn on the domain; the view window `data-xmin/xmax/ymin/ymax` is a bit
wider). Round-based widgets (lecture, sens) and card sets (associe) embed
their rounds as `<script type="application/json">` inside the figure instead.
The JS reads page hooks by `.js-*` classes — keep styling classes and JS
hooks separate.

Larger datasets/state machines (rounds registry, population geometry) live as
consts in the module; genuinely shared geometry is exported (univers.js
exports `POP` + `dessinerPopulation`, reused by independance.js).

## <a name="helper"></a>3. nabla-graph.js — the shared helper

- `FONCTIONS` — registry of reference functions: `{ f, fp }` both analytic.
  **Adding an entry here is all a new curve chapter needs.** Keys are short
  slugs (`'x3-3x'`, `'x2-1'`).
- `el(nom, attrs, parent)` — create SVG element.
- `creerVue(svg, {xMin,xMax,yMin,yMax})` — maths↔pixel transforms from the
  viewBox: `xPx/yPx/xDe`, and `xDePointeur(evt)` (pointer → maths x,
  CSS-resize safe).
- `cheminCourbe(vue, f, x0, x1, n=140)` — polyline path (≥120 samples).
- `grilleUnite(vue)` / `axes(vue)` — one gridline per maths unit (axes
  excluded), painted with `.g-grid`/`.g-axis` classes (token-driven).
- `clamp`, `fmt(v, dec=2)`, `fmtAdaptatif` (3 decimals for tiny values),
  `fmtCourt` (trim trailing zeros — round slider values).
- `mouvementReduit()` — media-query check.
- `animerValeur({de, vers, duree≈450, surFrame, surFin})` — eased numeric
  animation for presets; **jumps instantly under reduced motion**; returns
  `{stop}` — always stop a running animation when a drag starts.
- `rendreDraggable(cible, {surDebut, surDeplacement, surFin})` — Pointer
  Events with capture, move events coalesced through requestAnimationFrame.
- `creerHint(parent, {x, y, filDe, filVers})` — « glisse-moi » tag; hide it
  permanently on first interaction (`hint.style.display = 'none'`).

## <a name="archetypes"></a>4. The five interaction archetypes

Pick the one matching the pedagogy; combine sparingly.

### A. Point dragged along a curve (secante, tangente, derivee, variations)
The flagship gesture. Static décor (grid, axes, curve, labels) built once;
dynamic nodes (tangent path, halo `pt-halo` + point `pt-point`, labels,
`.hit-zone` r=42) updated in a single `rendre()`. Drag via
`rendreDraggable` on the hit circle: `a = clamp(vue.xDePointeur(evt), domMin,
domMax); rendre()`. Keyboard on the same hit circle (`role="slider"`),
OR a parallel native range slider (tangente.js) when two tab stops for one
parameter would be redundant — then the SVG point is `aria-hidden`.
Fine touches worth copying: label positions clamped into view; guides hidden
below a readability threshold; « display magnet » snapping the *rendered*
state to special x-values while the drag stays free (variations.js);
persistent bin-trace of visited x (derivee.js, 240 bins).

### B. Native sliders driving a drawing (arithmetique, geometrique, arbre,
depistage, independance, termes, somme)
Zero custom drag code — keyboard/touch free. `.curseur-ligne` native range
inputs (`--pos` CSS var updated for the accent fill, `aria-valuetext` in
French). All `input` handlers do `state = clamp(parseFloat(...)); interaction();
planifierRendu()` where `planifierRendu` coalesces renders with
requestAnimationFrame. Segmented presets (`.segmente button[data-x]`) animate
to the target via `animerValeur`; `aria-pressed` true only on exact match, so
free dragging deselects.

### C. Mode switch on a fixed dataset (univers)
When every number is fixed, ALL readouts are static HTML in the page
(question, KaTeX fraction, chips, légende — one copy per mode, `.js-mode-*`,
`hidden`), and the JS only toggles `hidden` and CSS classes on SVG dots.
Same doctrine as quiz.js: never build HTML with maths in JS — KaTeX renders
once at load.

### D. Rounds answered by buttons (lecture, sens)
A game: draw round i, answer buttons (`.quiz-reponse` styles reused), wrong →
mark + disable + generic relance, retry; right → lock, explanation, accent
« suivant (i/n) ▸ » button; after the last round « x/n du premier coup » +
« ↺ recommencer ». Progress chip in the header (`.js-progression`,
quiz-score styling). Rounds in JSON in the figure; explanations either
static HTML per round (sens — KaTeX-safe) or built text (lecture — plain
strings only). No dragging → accessible for free.

### E. Matching / classification cards (associe)
Cards are `<button>`s in rows; select one per row, check on second tap;
match → lock green + relabel; mismatch → 700 ms `data-etat="fausse"` flash +
relance. Shuffle with `Math.random` on init and reset.

## <a name="readouts"></a>5. Readout & state-chip idioms

- KaTeX only for the static formula shell; the numbers that change are
  plain text nodes (`.js-*` spans) updated with `textContent`.
- Chips row: neutral chips for parameters, `.chip--accent` for the target/
  key value, and a **state chip** (`aria-live="polite"`) that names the
  regime in words with the semantic colours:
  « r > 0 — la suite monte » (`chip--good`) / « … descend » (`chip--bad`) /
  constant/neutral (`chip--accent`). This foreshadowing-in-words is a house
  pattern — reuse it.
- Instantiated formula line (`.lecture-formule`): the general formula with
  live values substituted — « u₈ = u₀ + 8 × r = −2 + 8 × 0,75 = 4 »
  (negative values parenthesised).
- Revealed caption (`.widget-legende`, `aria-live="polite"`, `hidden`):
  appears when the student reaches the state the caption narrates
  (secante: |h| ≤ 0,05). The payoff sentence of the widget.
- Invariants are *shown*, not asserted (arbre's « somme des 4 feuilles :
  1,00 » chip recomputed live).
- Numbers in datasets are **engineered to land clean** (integers on grid
  nodes, two-decimal probabilities, exact independence at a reachable
  setting). Choose the dataset so the maths is exact-by-construction; the
  READMEs document each choice.

## <a name="perf"></a>6. Performance doctrine

- ≤ 1 render per animation frame: `rendreDraggable` coalesces pointer moves;
  slider widgets keep their own `planifierRendu()` rAF guard.
- Never re-render KaTeX per frame; never innerHTML in a move handler.
- Static décor built once at init; `rendre()` only sets attributes/
  textContent on kept references.
- Path data rounded to 0,1 px to keep attribute strings short.
- Widgets touching many nodes (1 000 dots) still fit the doctrine — class
  toggles only, coalesced.
- Mind the page budget: < 50 KB first-party JS unminified per page.

## <a name="a11y"></a>7. Accessibility doctrine

- SVGs that convey content: `role="img"` + French `aria-label` describing
  the picture. Decorative SVGs: `aria-hidden="true"`.
- Everything clickable is a `<button type="button">` (focus ring free).
- Dynamic feedback lives in an `aria-live="polite"` wrapper that EXISTS at
  load (`.quiz-retours`, state chips, formula lines); JS toggles `hidden` or
  textContent inside it.
- Duplicated visual state (live mini-tableau) is `aria-hidden` when a chip
  already carries the accessible state.
- `.hit-zone` provides `touch-action: none` and grab/grabbing cursors via
  CSS (`drag-actif` class on the figure while dragging).
