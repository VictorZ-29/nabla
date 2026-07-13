# Chapitre — La dérivation (Première · Spé Maths)

Spec of this chapter's content structure, widgets and configuration.
Derived from the Claude Design handoff (`design-reference/Nabla - La dérivation.dc.html`).
Read this file in full before any later work on the chapter; keep it updated
when behaviour changes.

## Purpose & narrative through-line

Replace the static PDF fiche on differentiation with a page where the student
*builds* the concept. The narrative order is deliberate and must never be
reordered (CLAUDE.md non-negotiable #1):

1. **Concrete hook** (§1) — average speed vs speedometer; taux de variation and
   sécante as Seconde-level material.
2. **Picture + manipulation** (§2) — the student drags B towards A in the
   flagship widget and *sees* the secant settle into the tangent…
3. **…then the formal definition** — dérivable en a / nombre dérivé, the limit
   formula, method, À RETENIR. The formal definition appears **only after**
   the secant widget.
4. **Exploitation** (§3–§5) — tangent equation, derivative tables, building f′
   graphically, sign of f′ → variations.
5. **Consolidation** — pièges classiques, 15 exercices corrigés, Vers le Bac.

## Reference function

All three widgets and both figures use the same reference function:

- **f(x) = x³ − 3x**, analytic derivative **f′(x) = 3x² − 3** — registry key
  `x3-3x` in `assets/js/nabla-graph.js` (`FONCTIONS`). No numeric
  differentiation anywhere.
- Curve drawn on **[−2,1 ; 2,1]** (the drag domain), inside a view window of
  x ∈ [−2,5 ; 2,5].
- Large graphs (widgets 1–2, static figure): viewBox 640×400, y ∈ [−4,2 ; 4,2].
- Widget 3: two stacked viewBox 640×230 graphs — f: y ∈ [−4,2 ; 4,2];
  f′: y ∈ [−4,5 ; 11].
- Grid = one line per maths unit in both directions (axes excluded), from
  tokens (`--grid`, `--axis`, `--sw-grid`).

## Section structure

| id | Sommaire label | Contents |
|---|---|---|
| `s1` | 1. À quelle vitesse, exactement ? | hook prose (+ added time/distance reading of the figure) · static sécante figure · display formula (taux) |
| `s2` | 2. Resserre les deux points | **widget sécante** · POURQUOI ? (h≠0, limite) · DÉFINITION · display formula (limite) · MÉTHODE (calculer f′(a)) · EXEMPLE RÉSOLU (f′(2) pour x²) · À RETENIR · **quiz s2** (3 q.) |
| `s3` | 3. La tangente à une courbe | plain-language tangente gloss · PROPRIÉTÉ (équation) · POURQUOI ? (y = mx + p) · **widget tangente** (+ équation de T en direct) · MÉTHODE · EXEMPLE RÉSOLU (tangente de x² en 1) · **widget lecture** (lire f′(a), 4 manches) · **quiz s3** (3 q.) |
| `s4` | 4. Dérivées usuelles et opérations | nombre → fonction dérivée gloss · table DÉRIVÉES USUELLES · POURQUOI ? ((x²)′ = 2x démontré) · table OPÉRATIONS · MÉTHODE · EXEMPLES RÉSOLUS (somme, produit, quotient, inverse) · **widget construis f′** · **widget associe** (f ↔ f′) · **quiz s4** (4 q.) |
| `s5` | 5. Signe de f′ et variations | prose + **widget variations** · POURQUOI ? (zoom courbe ≈ tangente) · PROPRIÉTÉ · étude complète : TABLEAU DE SIGNES puis TABLEAU DE VARIATIONS · MÉTHODE · **quiz s5** (3 q.) |
| `pieges` | Les pièges classiques | 4 pièges |
| `essentiel` | L'essentiel en 5 lignes | static recap card `.bloc-essentiel` : définition-limite, équation de tangente, usuelles, opérations, règle du signe |
| `ex` | Exercices — 15 corrigés | ex. 01–14 with corrigés (course order: taux 01 · définition 02–03 · tangentes 04–06 · usuelles 07 · produit 08 · quotient 09 · inverse 10 · variations 11–13 · problème d'optimisation 14) · **VERS LE BAC** (ex. 15, `#bac`) |

### Reusable components introduced by this chapter

- **`.tab-grille`** — shared grid for tableaux de signes & variations
  (variants: `.tab-signes`, `.tab-variations`, compact `.tab-grille--mini`
  inside widgets). Variation arrows are inline SVGs (`.var-fleche`, viewBox
  `0 0 88 56`, montée/descente paths) — **never** the characters ↗/↘, which
  render as emoji on iOS/Android. `.zone-active` highlights the current
  column (used by the variations widget).
- **`.bloc-exemple`** — EXEMPLE RÉSOLU: the méthode executed step by step
  (corrigé-style étape labels on a surface card); `.exemple-item` for
  multi-example blocks.
- **`.bloc-pourquoi`** — POURQUOI ? aside: the intuition behind a formula
  (accent left rule, quiet tone).
- **`.widget.quiz` + `assets/js/quiz.js`** — Teste-toi MCQs (see below).
- Tokens `--good`/`--bad` (+ tints): the design's alternate green/red pair
  (lifted variants on dark), used for slope sign and quiz feedback.

Sommaire: sticky desktop aside (≥ 920 px) + sticky mobile `<details>`
(< 920 px). Scroll-spy: active section = last one whose top ≤ 170 px; click
scrolls with an offset of 84 px (instant under `prefers-reduced-motion`);
tapping a mobile link closes the `<details>`. Behaviour and breakpoint come
from the design's DCLogic.

## Widget instances

Shared engineering standards (Pointer Events, ≥ 44 px hit targets, keyboard
sliders, reduced motion, French formatting, analytics throttling…) are defined
in CLAUDE.md — this section only specs the instances.

### 1. `secante` — « De la sécante à la tangente » (flagship, §2)

Module `assets/js/widgets/secante.js`, instantiated with
`data-fn="x3-3x" data-a="1.2" data-h-init="0.9" data-h-min="0.01" data-h-legende="0.05" data-domaine="-2.1,2.1"`.

- **Fixed**: A at a = 1,2 (f(a) ≈ −1,87 ; f′(a) = 1,32 — the « cible » chip).
- **Draggable**: B, constrained to the curve (pointer x clamped to
  [−2,1 ; 2,1], y = f(x)). **h < 0 allowed** (B may cross to the left of A).
- **Guard**: |h| ≥ 0,01 — the dead zone is snapped to ±0,01 on the side of
  travel; keyboard steps jump across it.
- **Readouts** (plain DOM text, live): numerator f(a+h) − f(a) (2 decimals,
  3 when |value| < 0,1), h (2 decimals), taux (2 decimals). Chips: a = 1,20
  (static) · h = live · cible : f′(a) = 1,32 (static). The fraction shell on
  the left is KaTeX (static).
- **Presets**: segmented control h = 0,90 / 0,30 / 0,01. Clicking animates h
  from the current value to the target (≈ 450 ms, cubic ease; instant jump
  under `prefers-reduced-motion`). Active state (`aria-pressed`) shown only
  while h equals the preset exactly; dragging away deselects.
- **Caption** (« La droite ne bouge presque plus… tangente… f′(a) »): revealed
  while **|h| ≤ 0,05**, hidden otherwise; `aria-live="polite"`.
- **Guides**: dashed L-path A→(b, f(a))→B with labels *h* and
  *f(a + h) − f(a)*; hidden when |h| < 0,15 (unreadable — the design's
  h = 0,01 state omits them). The numerator label is rotated −90° when the
  vertical segment ≥ 110 px, horizontal beside B otherwise (matches the far /
  mid design states). Guides mirror correctly for h < 0.
- **Hint**: « glisse-moi » tag near B's initial position; permanently hidden at
  first interaction (drag, keyboard or preset).
- **Reset state**: h = 0,90 — restored by the first preset button (no separate
  reset control in the design; see review flags).
- **Keyboard**: B is `role="slider"` on h (min −3,3 / max 0,9), arrows ±0,05,
  Shift ±0,01, Home/End = domain ends.

### 2. `tangente` — « Explore la tangente » (§3)

Module `assets/js/widgets/tangente.js`, instantiated with
`data-fn="x3-3x" data-a-init="1.2" data-domaine="-2.1,2.1"`.

- **Draggable**: A along the curve (pointer), duplicated by a styled native
  range slider below the graph (min −2,1, max 2,1, step 0,01; arrows move
  ±0,05, Shift ±0,01). Slider fill tracks the accent portion left of the knob.
- **Follows A**: tangent line T across the full view, dashed guides from both
  axes to A, label T pinned 18 px above the line near the right edge (clamped
  into view).
- **Readouts** (chips): a · f(a) · f′(a) — la pente de T, 2 decimals, true
  minus sign.
- **Hint**: « glisse-moi » near A, hidden at first interaction.
- **Reset**: button « ↺ réinitialiser » → a = 1,2 (initial state).

### 3. `derivee` — « Construis f′ à partir de f » (§4)

Module `assets/js/widgets/derivee.js`, instantiated with
`data-fn="x3-3x" data-a-init="1.2" data-domaine="-2.1,2.1"`.

- **Top graph (f)**: A draggable on the curve (pointer + `role="slider"`
  keyboard, same steps as widget 2); mini-tangent segment through A (±30 px
  along the tangent, token `--sw-tan-mini`); accent dashed vertical guide at
  x = a spanning **both** graphs.
- **Bottom graph (f′)**: the point (a ; f′(a)) moves with A, labelled
  `f′(a) = <valeur>`; it leaves a **persistent trace**: the domain is split
  into 240 bins and every bin swept by A is drawn as part of the f′ curve
  (accent, `--sw-curve`). Sweeping the whole domain reconstructs the design's
  fully-drawn curve.
- **Initial state**: a = 1,2, trace = only the initial bin.
- **Reset**: button « ↺ réinitialiser » → a = 1,2, trace cleared.
- **Caption** (static): « La pente de la tangente en A, en haut, devient la
  hauteur du point de f′, en bas — au même x. »

### 4. `variations` — « Le signe de f′ pilote les variations » (§5)

Module `assets/js/widgets/variations.js`, instantiated with
`data-fn="x3-3x" data-a-init="-1.8" data-zeros="-1,1" data-domaine="-2.1,2.1"`.

- **Draggable**: A on the curve (pointer + `role="slider"` keyboard, arrows
  ±0,05, Shift ±0,01, Home/End). Starts at a = −1,8 (left rising zone) so a
  full left-to-right sweep tells the story: monte → sommet → descend →
  creux → monte.
- **Tangent segment** (± 40 px) through A, coloured by sign of f′(x):
  `--good` (> 0,005), `--bad` (< −0,005), accent otherwise (classes
  `pente-pos/neg/nulle`).
- **Display magnet**: within |x − z| ≤ 0,05 of a zero of f′, everything is
  *rendered* at exactly z (slope exactly 0, chip « tangente horizontale »)
  while the internal drag position stays free — the extremum state is
  reachable by finger without stickiness.
- **Readouts**: chips x, f′(x) (2 decimals), and a state chip
  (`aria-live="polite"`) — « f′(x) > 0 — f monte » (good) / « … < 0 — f
  descend » (bad) / « … = 0 — tangente horizontale » (accent).
- **Live tableau**: compact `.tab-grille--mini` under the chips
  (`aria-hidden="true"`, the chips carry the accessible state); cells tagged
  `data-zone="0…4"` (zone1/3 = the zeros ±0,05); the active column gets
  `.zone-active` (accTint2 background, accent arrow).
- **Static décor**: dashed guides at x = ±1 with muted labels below the axis.
- **Hint**: « glisse-moi » near A, hidden at first interaction.
- **Reset**: « ↺ réinitialiser » → a = −1,8.

### 5. `lecture` — « Lis f′(a) sur le graphique » (§3)

Module `assets/js/widgets/lecture.js`. Rounds come from a
`<script type="application/json">` inside the figure:
`{fn, a, choix (display strings), bonne (1-based)}`. No dragging; the whole
interaction is buttons, so it is keyboard-accessible for free.

- **View**: fixed square-unit window (viewBox 640×440, x ∈ [−3,2 ; 3,2],
  y ∈ [−2,2 ; 2,2], 100 px per unit) so slopes are countable on the grid;
  curves are clipped by the viewBox where they leave the window.
- **Décor per round**: curve, full-width tangent at A, dashed reading
  triangle A → (+1 in x) → back up/down to the tangent, labels « +1 » and
  « ? » ; the « ? » becomes the slope value once answered.
- **Rounds shipped**: x²/2 at a=1 (pente 1) · x²−1 at a=1 (pente 2) ·
  1−x²/4 at a=2 (pente −1) · 2−x² at a=1 (pente −2). Distractors include
  the sign error and the halved/doubled misreads.
- **Flow**: wrong answer → marked + disabled + relance, retry; right →
  explanation with the monte/descend reading, « Point suivant ▸ ». After
  the last round: « x/4 du premier coup » and « ↺ recommencer ».
- Reuses quiz button/feedback styles; progress chip « POINT i/4 ».

### 6. `associe` — « Associe chaque f à sa dérivée » (§4)

Module `assets/js/widgets/associe.js`. Card set from JSON in the figure:
`{fn, yf: [yMin,yMax], yfp: [...]}` (x window fixed at [−2,5 ; 2,5]).

- Three function cards (craie) on top, their derivatives (accent) shuffled
  below (`Math.random`, reshuffle on « ↺ réinitialiser »). All cards are
  `<button>`s: tap one per row, the pair is checked on the second tap.
- Match → both cards lock green; the bottom card's label becomes
  « ✓ f′ de n » so finished pairings stay readable. Mismatch → brief
  `data-etat="fausse"` flash (700 ms, colour only) + relance.
- **Deliberate trap**: the top card x²−1 has the same shape as the cubic's
  derivative below — matching by « same shape » fails and the relance says
  why (sommets de f ↔ zéros de f′).
- Set shipped: x²−1 → 2x · x³/3−x → x²−1 · 1−x²/2 → −x.

## Quiz « Teste-toi » (assets/js/quiz.js — reusable)

Four quizzes (ids `s2/s3/s4/s5`), 13 questions total, at the end of each
course section. Markup: `.widget.quiz[data-quiz]` (widget frame, pill
TESTE-TOI, score `x/n` in the header once ≥ 1 correct), questions
`.quiz-question[data-bonne=<1-based index>]` with `.quiz-reponse` buttons.

- Wrong answer → that button is marked (`data-etat="fausse"`, shake unless
  reduced motion) and disabled; generic relance « PAS ENCORE — élimine cette
  réponse et réessaie. » shows; the student retries.
- Right answer → question locks (all buttons disabled), the explanation
  reveals with verdict « EXACT — ».
- Relance and explanation are **static HTML** (`.js-relance` /
  `.js-explication`, `hidden`) inside an `aria-live="polite"` wrapper — the
  JS only toggles `hidden`, never builds HTML, so KaTeX inside explanations
  is rendered once at page load.
- No persistence; reload resets. No per-question analytics — one throttled
  `widget_interact` per quiz (see Analytics).

## Analytics (Plausible, throttled ≈ 1 event / interaction session)

| Event | Props | Fired |
|---|---|---|
| `widget_interact` | `widget: secante \| tangente \| derivee \| variations \| lecture \| associe \| quiz-s2 \| quiz-s3 \| quiz-s4 \| quiz-s5`, `chapitre: derivation` | first interaction, then ≤ 1 / 30 s per widget/quiz |
| `corrige_open` | `exercice: 01 … 14`, `chapitre: derivation` | when a corrigé is opened |
| `bac_open` | — | when the Vers le Bac corrigé is opened |
| `theme_toggle` | `to: light \| dark` | header button |

Quizzes reuse `widget_interact` (values `quiz-*`) rather than adding a new
event name, to stay inside the CLAUDE.md event list — flag 22.

`chapitre` is read from `<body data-chapitre="derivation">`.

## Review flags for Victor

Behavioural interpretations inferred from static design states, plus copy
touched. Everything else is a faithful transcription.

1. **Secante presets → one behaviour.** The design shows three static
   keyframes (h = 0,90 / 0,30 / 0,01). Implemented as one continuous
   draggable B; preset clicks *animate* B along the curve to the target h.
2. **Secante guides threshold.** Guides + labels hidden when |h| < 0,15
   (the design's h = 0,01 state omits them; 0,15 is my threshold). The
   numerator label rotates only when the vertical segment ≥ 110 px (far vs
   mid design states).
3. **Caption trigger.** Design ties the tangente caption to the h = 0,01
   state; implemented as |h| ≤ 0,05 per your instruction.
4. **No reset button on the secante widget** in the design — CLAUDE.md
   requires a reset control on every widget; the h = 0,90 preset restores the
   initial state exactly and stands in for it. Add a dedicated button if you
   prefer.
5. **Secante active preset while dragging.** Highlight only when h matches a
   preset exactly; free dragging deselects all three.
6. **Hint tags.** The design has an `indices` toggle (default on). Implemented
   as: visible until the first interaction with that widget, then hidden for
   the rest of the visit (not persisted).
7. **Tangente slider domain.** The mock's knob at 74 % implies a slider over
   the full view [−2,5 ; 2,5], but A must stay on the drawn curve, so the
   slider spans [−2,1 ; 2,1] (knob at ≈ 79 % for a = 1,2).
8. **Tangente keyboard path.** The native slider is the single keyboard
   control; the SVG point itself is pointer-only (avoids two tab stops for one
   parameter). Interpretation of the CLAUDE.md "draggable points focusable"
   rule for this widget only — secante's B and derivee's A are proper
   `role="slider"` points.
9. **Construis f′ = progressive trace.** The design's bottom graph shows the
   full f′ curve; its own aria-label says « construite point par point ». I
   read the full curve as the *end state* of a persistent trace built where A
   has swept; reset clears it. If you prefer the full curve always visible,
   it's a one-line change.
10. **Exercise 2 corrigé** is open in the design (showcase state); production
    starts with all corrigés closed.
11. **Number formatting.** Design shows « 0,014 » (3 decimals) for the tiny
    numerator at h = 0,01, while h and taux keep 2 decimals — implemented as:
    2 decimals everywhere, 3 for readout values with 0 < |v| < 0,1. CLAUDE.md
    amended accordingly.
12. **Copy — hero H1** changed per your instruction to « La spé, expliquée
    pour de vrai. » (design: « Les maths de spé, expliquées pour de vrai. »).
13. **Copy — espaces insécables** added before : ; ! ? and inside « … »
    throughout (the design exports use plain spaces). No word changed.
14. **KaTeX look.** Hand-styled STIX maths replaced by KaTeX (per CLAUDE.md),
    so HTML maths render in KaTeX's font, slightly different from the mock;
    SVG maths labels keep STIX Two Text.
15. **T label heuristic** (18 px above the tangent near the right edge,
    clamped into view) generalises the single mocked position.
16. **`mailto:bonjour@nabla.example`** kept from the design — placeholder
    address to replace.
17. **Placeholders to configure at launch**: `NABLA_DOMAIN` (Plausible
    `data-domain`, canonicals, OG URLs, sitemap, robots), `og:image`
    (`/assets/og/nabla-og.png` doesn't exist yet), mentions légales content,
    portrait photo in the homepage « À propos » (dashed placeholder circle).
18. **« mis à jour juillet 2026 »** in the chapter header is hand-maintained.

Flags 19+ come from the July 2026 improvement pass (tableau mobile fix, more
intuition, more interactivity, worked examples, full exercise set):

19. **New copy, all of it.** Every POURQUOI ? passage, every EXEMPLE RÉSOLU,
    the §1 time/distance reading of the figure, the §5 widget invitation and
    tableau-de-signes transitions, the quiz questions/explanations, and
    exercises 01, 03–04, 06–11, 13–14 with their corrigés are **my words in
    your voice** — please read them as author. Existing copy was not
    rewritten, only added to.
20. **Three new block types not in the design vocabulary**: POURQUOI ?
    (accent left rule), EXEMPLE RÉSOLU (surface card, corrigé-style steps),
    TESTE-TOI quiz (widget frame). Styled inside the existing design
    language; say the word and any of them can be restyled.
21. **Tableau arrows are now SVG** (the design's ↗/↘ characters render as
    emoji on iOS/Android — your point 1). Same fix applied to the ☀ in the
    theme toggle (U+FE0E appended, all pages + theme.js).
22. **Quiz analytics** reuse `widget_interact` with `widget: quiz-<id>` —
    a value convention, not a new event; CLAUDE.md's event list is unchanged.
23. **Header meta changed**: « ≈ 40 min de lecture » → « ≈ 60 min de
    travail » to stay honest about the bigger chapter. Your call on wording.
24. **Exercises renumbered** into course order (old 01→02, 02→05, 03→12) and
    one sentence added to the exercises intro announcing that order. The
    numbering matters for the `corrige_open` analytics prop — done before
    launch, so no data continuity issue.
25. **Tangente widget now shows T's developed equation live** (`y = 1,32x −
    3,46`, mono line under the slider) — the design mock showed only the
    three chips; assembling the equation is the skill §3 teaches, so I
    surfaced it. Degenerate forms handled (y = 2,00 when the slope is ~0).
26. **Variations widget behaviour is my design** (no mock exists): tangent
    coloured by sign, display-magnet at the zeros, live-highlighted mini
    tableau. The green/red pair comes from the design's own alternate
    palette (tokens `--good`/`--bad`).
27. **Wrong-answer quiz behaviour**: marked + disabled + retry (rather than
    reveal-on-fail) — deliberate, so the student can't brute-force to the
    explanation without landing on the right answer.
28. **§5 order**: prose hook → variations widget → POURQUOI → PROPRIÉTÉ →
    worked study (signes → variations) — manipulation before formalisation,
    consistent with the chapter's narrative principle.
29. **Exercise 14 (optimisation)** goes slightly beyond a routine variations
    exercise on purpose — it's the « why does any of this matter » payoff
    (your point 2). Tell me if you'd rather keep it for a future chapter.
30. **Tableau de signes shows one row per factor** (x+1, x−1, then f′). The
    constant factor 3 is dismissed in the prose rather than given a row —
    the classroom convention I've seen most; easy to add a row if you
    prefer.

Flags 31–32 come from Victor's copy review (July 2026):

31. **« widget » removed from all student-facing prose** (Victor's request) —
    replaced by « le graphique », « le graphique interactif », « les
    graphiques du chapitre ». One *original design sentence* was touched:
    §5 « Retrouve-les sur la courbe du widget plus haut » → « sur le
    graphique interactif plus haut ». The word survives only in code
    (classes, data-attributes, this README).
32. **Plain-language glosses added** (Victor's request — say it simply
    before using the term): §3 opens with what a tangente *is* (a line that
    leans on the curve at a point and follows its direction — phrased to
    avoid the « touches in only one point » myth that the bac exercise
    A.3 itself contradicts); §4 opens with nombre → fonction dérivée
    (f′(a) is a number, computed everywhere it becomes the function f′);
    §5 extremum gets an inline gloss « un sommet ou un creux de la
    courbe » inside an existing sentence.
33. **Em-dash reduction pass** (Victor's request): 31 tic-like « — » in my
    copy rewritten as full stops, commas, colons or semicolons (128 → 97
    occurrences page-wide). Kept: every dash in the original design copy,
    the structural labels (« Étape 1 — », « EXACT — », « MÉTHODE — … »),
    the title pattern in metas, and a few incises that genuinely earn it.
34. **Two new interactives with no design mock** — lecture (§3) and associe
    (§4); behaviour and rounds/card-sets are my design, documented above.
    The associe shape-lookalike trap is deliberate; say the word if you
    find it too hard for a first pass.
35. **« L'essentiel en 5 lignes »** added as its own sommaire section
    between pièges and exercices; formulas separated by « ; » (a « · »
    read as a multiplication dot next to KaTeX).
36. **JS budget nearly full**: 49,8 KB of the 50 KB first-party ceiling.
    The next interactive on this page must trim or lazy-load something.
