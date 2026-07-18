# Chapitre — Le second degré (Première · Spé Maths)

Spec of this chapter's content structure, widgets and configuration.
No Claude Design mock exists for this chapter: the page transposes the
dérivation design system (`design-reference/`, `assets/css/*`) to new
content, reusing every block component and widget convention, following the
`nabla-topic` skill (`.claude/skills/nabla-topic/`). Read this file in full
before any later work on the chapter; keep it updated when behaviour
changes.

Programme reference: PROGRAMME.md row « Le second degré » (2026 programme,
kept intégralement in spé) — forme canonique, allure, symétrie, variations ;
équation, discriminant, racines ; factorisation ; signe du trinôme ;
inéquations. Everything taught here is on-programme; somme/produit des
racines is deliberately absent.

## Purpose & narrative through-line

Replace the static PDF fiche on le second degré with a page where the
student *manipulates the parabola itself* before any formalism. The
chapter's thesis: **a trinôme has three écritures, and each one answers a
question the others hide** — learning the second degré is learning to
rewrite. Narrative order (concrete hook → picture → manipulation → formal
definition), never to be reordered:

1. **Concrete hook** (§1) — une passe lobée au foot :
   h(x) = −0,5x² + 2x. The developed form answers none of the real
   questions (hauteur max ? point de chute ? passe-t-elle le défenseur ?).
   Static figure = the flagship widget's initial frame: chalk x² + accent
   lob parabola, sommet S(2 ; 2), dashed symmetry axis x = 2, ground points
   0 and 4. Seconde-level DÉFINITION (trinôme, allure selon le signe de a).
2. **Manipulation, then definition** (§2) — the **parabole-sommet** widget:
   grab the summit (or drive sliders a / α / β) and watch the canonical and
   developed forms rewrite themselves live; **only after** comes the
   DÉFINITION of the forme canonique, α = −b/(2a), symmetry, variations
   (two 4-column tableaux), the trouver-le-sommet méthode, and the chapter's
   reference trinôme x² − 2x − 3 = (x−1)² − 4.
3. **Le discriminant** (§3) — the **parabole-discriminant** widget makes Δ
   physical: sliding c moves x² − 2x + c vertically and the roots approach,
   fuse (Δ = 0, sommet posé sur l'axe), vanish (Δ < 0). Then DÉFINITION,
   the root formulas, the POURQUOI via the canonical form
   ((x − α)² = Δ/4a²), the méthode, the three worked cases.
4. **Factorisation & signe** (§4) — factored form from the roots (PROPRIÉTÉ,
   méthode with the mandatory leading a, worked 2x² − 5x + 2); then the
   **parabole-signe** widget (drag the roots, flip a, live sign table)
   BEFORE the sign rule is stated; static factor-by-factor tab-signes on
   the reference trinôme bridges back to the dérivation chapter.
5. **Inéquations & synthesis** (§5) — the « x² < 9 » prediction trap opens;
   the **parabole-formes** game (4 rounds: match parabola ↔ écriture)
   trains form-reading; méthode inéquation; worked x² < 9 and a < 0
   example; the three-écritures synthesis table.
6. **Consolidation** — 5 pièges, l'essentiel en 5 lignes, 15 exercices
   corrigés, Vers le Bac (étude complète de 2x² − 8x + 6 + rentabilité
   B(x) = −2x² + 120x − 1000, SANS CALCULATRICE).

One story runs through: the lob of §1 returns in full as exercise 14
(canonical form → hauteur max, roots → point de chute, inéquation → temps
au-dessus de 1,50 m, le défenseur à 1,40 m). The reference trinôme
x² − 2x − 3 = (x−1)² − 4 = (x+1)(x−3) (Δ = 16) recurs in §2 (exemple), §3
(exemple a + widget initial state), §4 (factorisation hook + tab-signes),
ex 06 and ex 08. The dérivation chapter is leaned on for the
tableau-de-signes gesture; the épreuve anticipée sans calculatrice
motivates ex 05/07 (automatismes, Δ-free shortcuts).

## Reference functions & view windows

No `FONCTIONS` registry entries added — all four widgets are parametric
(a, α, β, c, x₁, x₂ live) and therefore self-contained modules
(the suites/probas convention, audit.md divergence #11).

- **Chapter reference trinôme** (examples, not a widget config):
  x² − 2x − 3 = (x − 1)² − 4 = (x + 1)(x − 3), Δ = 16 — every number an
  integer, roots and sommet on grid nodes.
- **Story lob**: h(x) = −0,5x² + 2x = −0,5(x − 2)² + 2; sommet (2 ; 2),
  roots 0 and 4, h(1) = 1,5 — all exact.
- **§1 figure & parabole-sommet**: viewBox 640×400, x ∈ [−5 ; 5],
  y ∈ [−5 ; 5] (64 px/unit in x, 40 in y). Chalk x² drawn on |x| ≤ √5.
  Accent parabola truncated analytically at the view top/bottom
  (demi-largeur √((borne − β)/a)).
- **parabole-discriminant**: viewBox 640×400, x ∈ [−3 ; 5], y ∈ [−5 ; 6].
  f(x) = x² − 2x + c, c ∈ [−4 ; 4] step 0,5 → Δ = 4 − 4c is always an even
  integer; sommet (1 ; c − 1) stays inside the view for all c. Truncated at
  the top edge ((x−1)² ≤ yMax − c + 1).
- **parabole-signe**: viewBox 640×400, x ∈ [−4,5 ; 5,5], y ∈ [−5 ; 5].
  f(x) = a(x − x₁)(x − x₂); roots in [−3 ; 4] snap 0,5, minimal gap 1;
  a ∈ [−2 ; 2] step 0,25. Curve segments truncated analytically at both
  view edges (outer bound + possible inner « hole » when the vertex leaves
  the view).
- **parabole-formes**: x ∈ [−5 ; 5] fixed in the module, y window per round
  (JSON). Round registry `COURBES` in the module: `fact-m1-3` (x+1)(x−3),
  `canon-neg-1-4` −(x−1)²+4, `double-2` (x−2)², `canon-m1-2` (x+1)²+2.

Slider steps in parabole-sommet are engineered for exactness: α integer,
β step 0,5, a step 0,25 ⇒ b = −2aα is a multiple of 0,5 and c = aα² + β a
multiple of 0,25 — both exact at 2 decimals, so the developed form line
never rounds.

## Section structure

| id | Sommaire label | Contents |
|---|---|---|
| `s1` | 1. La courbe du ballon | hook prose (passe lobée ; les 3 questions) · vitrine h(x) = −0,5x² + 2x · prose (chaque écriture révèle) · static figure (x² craie + lob accent, S, axe, 0 et 4) · DÉFINITION (trinôme, allure) · prose lecture de a, b, c |
| `s2` | 2. Attrape le sommet | **widget parabole-sommet** · POURQUOI ? (développement → α = −b/2a) · DÉFINITION forme canonique · vitrine grande · PROPRIÉTÉ symétrie/variations + 2 tableaux (tab-grille--sommet) · MÉTHODE sommet · EXEMPLE (x² − 2x − 3) · À RETENIR · **quiz s2** (3 q.) |
| `s3` | 3. Le discriminant | hook (où retombe le ballon ?) · **widget parabole-discriminant** · DÉFINITION Δ · PROPRIÉTÉ racines (+ vitrine) · POURQUOI ? (via forme canonique) · MÉTHODE · EXEMPLES (3 cas : Δ=16 / Δ=0 / Δ<0) · prose raccourcis (renvoi ex 07) · **quiz s3** (3 q.) |
| `s4` | 4. Factoriser, lire le signe | hook (racines → factorisation) · PROPRIÉTÉ forme factorisée · MÉTHODE factoriser · EXEMPLE (2x² − 5x + 2) · prose bridge · **widget parabole-signe** · PROPRIÉTÉ signe · figure tab-signes ((x+1)(x−3)) · À RETENIR · **quiz s4** (3 q.) |
| `s5` | 5. Les inéquations | hook + predict (x² < 9) · **widget parabole-formes** (4 manches) · MÉTHODE inéquation · EXEMPLES (x² < 9 ; −x² + 2x + 3 ≥ 0) · tableau synthèse des 3 écritures · **quiz s5** (4 q.) |
| `pieges` | Les pièges classiques | 5 pièges (signe de a oublié · sommet lu avec le mauvais signe · diviser par x · x² < 9 résolu au premier degré · « pas de racine » ≠ « pas de solution ») |
| `essentiel` | L'essentiel en 5 lignes | TRINÔME · SOMMET · RACINES · FACTORISER · SIGNE |
| `ex` | Exercices — 15 corrigés | course order: lire un trinôme 01 · forme canonique 02–03 · variations 04 · discriminant 05 · équations 06–07 · factorisation 08 · signes 09 · inéquations 10–11 · paramètre 12 · position relative 13 · problème 14 (le lob) · **VERS LE BAC** (ex 15, `#bac`, SANS CALCULATRICE) |

Niveau distribution: n1 = 01, 02, 05 · n2 = 03, 04, 06, 07, 08, 09, 10,
11 · n3 = 12, 13, 14.

### Components introduced by this chapter

Appended at the end of `chapitre.css` under the « Second degré » banner
(CSS version bumped `?v=12` → `?v=13` on every page in the same commit):

- `.g-signe-pos` / `.g-signe-neg` — parabola segments painted by the sign
  of the trinôme (stroke `--good`/`--bad`, width `--sw-curve`). Same
  semantic pair as the tangent-slope colours.
- `.tab-grille--sommet` — 4-column variant of the shared sign/variations
  grid, for a table with a single remarkable point (the sommet).

Everything else reuses existing components (curseur-ligne, segmente,
chips, lecture-formule, widget-legende, tab-grille--mini, quiz styles,
var-fleche arrows, tableau/defile).

## Widget instances

Shared engineering standards are in CLAUDE.md; doctrine in
`.claude/skills/nabla-topic/references/interactive-patterns.md`.

### 1. `parabole-sommet` — « Attrape le sommet » (flagship, §2)

Module `assets/js/widgets/parabole-sommet.js`, instance
`data-a-init="-0.5" data-alpha-init="2" data-beta-init="2"
data-xmin="-5" data-xmax="5" data-ymin="-5" data-ymax="5"`.
Archetype B (three native sliders) + pointer drag of the summit as an
enhancement.

- **Fixed**: chalk curve of x² (truncated at |x| ≤ √5), grid, axes.
- **Controls**: sliders a ∈ [−2 ; 2] step 0,25 · α ∈ [−3 ; 3] step 1 ·
  β ∈ [−3 ; 3] step 0,5. The summit is also draggable directly (2-D
  pointer drag, snapped to the slider lattice: α to integers, β to
  halves). The drag hit-zone is `aria-hidden` — keyboard goes through the
  three native sliders (the tangente.js convention, extended to 2-D).
- **Follows the state**: accent parabola a(x−α)² + β truncated at the view
  edge; dashed symmetry axis x = α with mono label (top for a > 0, bottom
  for a < 0); summit point + halo + « S » label (label flips above/below
  the point with the sign of a).
- **Readouts**: two `lecture-formule` mono lines — the canonical form and
  the developed form of the SAME function, recomposed as full strings in
  JS (`.js-canonique`, `.js-developpee`; audit.md §10.2 convention);
  chips: sommet S = (α ; β) (accent) + state chip (aria-live): a > 0
  « tournée vers le haut » (good) / a < 0 « vers le bas » (bad) / a = 0
  « plus de x² : une droite, pas une parabole » (accent).
- **Guard — a = 0 allowed on purpose**: the curve degenerates to the
  horizontal line y = β, sommet/axis/hit are hidden, the sommet chip shows
  « S = — », the légende explains why the definition requires a ≠ 0. Way
  back: the a slider.
- **Légende** (aria-live): narrates « x² retournée/étirée (plus serrée ou
  plus ouverte que x²) puis déplacée en (α ; β) », adapting to |a| ⋛ 1.
- **Hint**: « glisse-moi » near S, hidden at first interaction.
- **Reset**: header « ↺ réinitialiser » → the lob state (a = −0,5,
  S(2 ; 2)) — identical to the §1 figure.

### 2. `parabole-discriminant` — « Les trois destins d'une parabole » (§3)

Module `assets/js/widgets/parabole-discriminant.js`, instance
`data-c-init="-3" data-xmin="-3" data-xmax="5" data-ymin="-5"
data-ymax="6"`. Archetype B + animated header presets.

- **Fixed**: a = 1, b = −2 (spelled out in the widget-note); static dashed
  axis of symmetry x = 1; mono curve label « y = x² − 2x + c ».
- **Controls**: header `segmente` presets Δ > 0 (c = −3) / Δ = 0 (c = 1) /
  Δ < 0 (c = 3), animated via `animerValeur` (instant under reduced
  motion), `aria-pressed` only on exact match; slider c ∈ [−4 ; 4]
  step 0,5 with the reset button beside it (header slot taken — the
  geometrique convention).
- **Follows c**: accent parabola (truncated at the top edge); root markers
  on the x-axis with labels x₁/x₂ (Δ > 0), a single x₀ (Δ = 0), none
  (Δ < 0).
- **Readouts**: mono line « Δ = b² − 4ac = 4 − 4 × (−3) = 16 » (c
  parenthesised when negative; Δ always an even integer at rest); chips
  c · Δ (accent) · state chip (accent for all three states — the three
  worlds are neutral, not good/bad); légende (aria-live) narrating the
  world and giving the roots — printed with « = » when exact at 2
  decimals (c ∈ {−3, 0, 1}), « ≈ » otherwise.
- **Reset**: → c = −3, i.e. the reference trinôme x² − 2x − 3.

### 3. `parabole-signe` — « Le signe se lit sur la parabole » (§4)

Module `assets/js/widgets/parabole-signe.js`, instance
`data-a-init="1" data-x1-init="-1" data-x2-init="3" data-racines="-3,4"
data-xmin="-4.5" data-xmax="5.5" data-ymin="-5" data-ymax="5"`.
Archetype A (two 1-D draggable roots) + native slider for a.

- **Draggable**: the two roots along the x-axis (pointer + keyboard,
  `role="slider"` each, arrows ±0,5, Home/End = bounds), snapped to 0,5,
  clamped to keep x₁ ≤ x₂ − 1 (the racine-double case is §3's business —
  the gap keeps the live table readable).
- **Control**: slider a ∈ [−2 ; 2] step 0,25 (a = 0 reachable — guard
  below).
- **Follows the state**: the parabola drawn as up to four segments painted
  by sign (`.g-signe-pos` above the axis, `.g-signe-neg` below), truncated
  analytically at the outer view edge and — when the vertex leaves the
  view — split around an inner « hole »; root points + halos + value
  labels (flip above/below the axis with the sign of a).
- **Live sign table**: `tab-grille--mini` (aria-hidden — the chip carries
  the accessible state): x row shows −∞ / x₁ / x₂ / +∞ (values updated),
  f(x) row shows the ext/int signs flipping with a.
- **Readouts**: mono factored-form line « f(x) = 0,5 (x + 1)(x − 3) »
  (coefficient omitted at 1, « − » at −1, factor « x » at root 0); chips
  x₁, x₂ + state chip: a > 0 « positif à l'extérieur des racines » (good) /
  a < 0 « négatif à l'extérieur » (bad) / a = 0 accent; légende (aria-live)
  narrating which side of the axis the parabola occupies.
- **Guard — a = 0**: the curve flattens onto the axis (all segments
  removed, table shows 0 everywhere, f(x) = 0), the légende says « il ne
  reste rien à signer » and points back to the slider.
- **Hint**: « glisse-moi » near the root x₂.
- **Reset**: header → a = 1, roots −1 and 3 (the reference factorisation).

### 4. `parabole-formes` — « À chaque parabole son écriture » (§5)

Module `assets/js/widgets/parabole-formes.js`. Archetype D (rounds),
structure mirrored from exp-courbes.js. Rounds from
`<script type="application/json">`:
`{courbe (clé du registre COURBES), ymin, ymax, bonne (1-based)}`.
Buttons AND explanations are **static HTML per round** (`.js-manche` /
`.js-expl` toggled by `hidden`) because they contain KaTeX.

- **Rounds**: ① (x+1)(x−3) — read the roots, sign of the factors
  (distractors: swapped-sign roots, flipped a) ② −(x−1)²+4 — read sommet +
  direction (same roots as ①, retournée — the explanation says so)
  ③ (x−2)² — racine double = un carré (distractors: x²−4, sommet à −2)
  ④ (x+1)²+2 — Δ < 0, sommet à −1 (both sign traps in the distractors).
- **Flow**: wrong → marked + disabled + relance (lis le signe de a, puis
  les racines ou le sommet), retry; right → locked, explanation, accent
  « Parabole suivante (i/4) ▸ »; after round 4 « Terminé : x/4 du premier
  coup » + « ↺ recommencer ». Progress chip « PARABOLE i/4 ». Curves
  truncated by an edge-scan (both top AND bottom — a < 0 parabolas leave
  through the floor).
- No dragging: keyboard/touch free via buttons.

## Quiz « Teste-toi » (reuses assets/js/quiz.js)

Four quizzes (`s2/s3/s4/s5`), 13 questions total (3+3+3+4), same markup
and behaviour as the other chapters. `data-bonne` spread: 4× position 1,
5× position 2, 4× position 3. Distractors are the chapter's pièges: sommet
lu S(−3 ; 1), maximum confondu avec son abscisse, Δ = b² + 4ac, « Δ < 0
donc la parabole est tournée vers le bas », factorisation sans le a,
« jamais négatif puisque a > 0 », x ≤ 4 pour x² ≤ 16, « pas de racine donc
pas de solution ».

## Analytics (Plausible, throttled ≈ 1 event / interaction session)

| Event | Props | Fired |
|---|---|---|
| `widget_interact` | `widget: parabole-sommet \| parabole-discriminant \| parabole-signe \| parabole-formes \| quiz-s2 \| quiz-s3 \| quiz-s4 \| quiz-s5`, `chapitre: second-degre` | first interaction, then ≤ 1 / 30 s per widget/quiz |
| `corrige_open` | `exercice: 01 … 14`, `chapitre: second-degre` | when a corrigé is opened |
| `bac_open` | — | when the Vers le Bac corrigé is opened |

`chapitre` read from `<body data-chapitre="second-degre">`.

## Review flags for Victor

Everything on this page is new authorship in your voice — no design mock
and no pre-existing copy. Please read as author. Specific decisions:

1. **Outline built without your sign-off** (you were absent this
   session). The five sections, the four widgets, the lob story, the
   pièges, the exercise list and the bac subject are all my proposal —
   review the outline (top of this file) first, the details second.
2. **The running story is a football lob** (h(x) = −0,5x² + 2x): chosen
   so sommet (2 ; 2), roots 0/4 and h(1) = 1,5 are all exact on the grid,
   and so the three chapter questions (max ? chute ? au-dessus du
   défenseur ?) map onto the three écritures. Say the word if you'd rather
   a basket shot (starts above ground → less clean numbers) or another
   story.
3. **The chapter thesis « trois écritures, trois super-pouvoirs »**
   organises §5 and the synthesis table. It's my framing, not a programme
   phrase.
4. **parabole-sommet keyboard path** is the three native sliders; the
   2-D summit drag is pointer-only (`aria-hidden` hit zone). This extends
   the tangente.js convention (slider = keyboard, point = pointer) to two
   dimensions; a `role="slider"` can't honestly describe a 2-D point.
5. **a = 0 is reachable on purpose** in parabole-sommet and
   parabole-signe, with explanatory captions (the degenerate case teaches
   why the definition demands a ≠ 0). In parabole-discriminant a and b are
   frozen so the c-slider tells one clean story (Δ = 4 − 4c).
6. **State-chip semantics**: good/bad = tournée vers le haut/bas (§2) and
   positif/négatif à l'extérieur (§4) — sign-of-a semantics, consistent
   with the site's monte/descend pair. The three Δ worlds (§3) are all
   accent (neutral): two roots isn't « better » than none.
7. **parabole-signe forbids the racine-double state** (min gap 1 between
   roots) to keep the widget on its single lesson; Δ = 0 is §3's and
   ex 09's business. Flag if you'd rather allow merging.
8. **POURQUOI ? of §3** derives the discriminant from the canonical form
   with « et un calcul montre que ce membre vaut Δ/4a² » — the full
   algebra is deliberately not done on the page. Tell me if you want it
   written out.
9. **Somme/produit des racines is absent** (not in the 2026 spé
   programme row); the only trace is the « racines symétriques autour de
   −b/2a » check reflex, which is pure symmetry.
10. **Exercise stories and arithmetic hand-checked**: ex 03b
    2(x+1)²−3 · ex 06b racines 1/2 et 2 · ex 08b −(x−2)² · ex 09
    racines 1 et 4 / double 3 · ex 11b ]0 ; 2/3[ · ex 12 m = ±6, racines
    −9/−1, ]−6 ; 6[ · ex 13 racines 1 et 2, points (1 ; 2) et (2 ; 3) ·
    ex 14 h(1) = 1,5, [1 ; 3] → 2 m · ex 15 : racines 1 et 3, B(0) =
    −1000, max 800 € à 30 objets, rentable [10 ; 50].
11. **Vers le Bac is SANS CALCULATRICE** (all numbers engineered for
    mental arithmetic) — chosen to echo the épreuve anticipée format the
    2026 reform introduces; ex 05 and 07 train the same automatismes.
12. **New CSS**: `.g-signe-pos/.g-signe-neg` and `.tab-grille--sommet`
    (4-column variations table) appended under a banner; `?v=12 → ?v=13`
    bumped on every page in the same commit. No other shared file
    touched; nabla-graph.js unchanged.
13. **Homepage**: new CHAPITRE 06 card (motif: downward parabola + dashed
    symmetry axis + sommet point); produit-scalaire's footer now links
    here; this page's footer announces « La géométrie repérée — BIENTÔT »
    (unchanged bientôt card). Sitemap updated (lastmod 2026-07-18 on /,
    produit-scalaire, second-degre). PROGRAMME.md row flipped to ✅ in the
    registration commit.
14. **JS budget**: measured with `wc -c` — see the session summary (the
    number is also re-checked in the verification step); ceiling 50 KB.
15. **Two-theme visual pass in a real browser not run** (no browser tool
    in this environment): behaviour was verified with a jsdom harness
    (widgets driven by clicks/keys/inputs) and KaTeX rendered headlessly.
    Please eyeball both themes at 375 px and desktop — especially the
    coloured sign segments (good/bad on dark vs light) and the two
    4-column variations tables.
