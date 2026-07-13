# Chapitre — Les suites numériques (Première · Spé Maths)

Spec of this chapter's content structure, widgets and configuration.
No Claude Design mock exists for this chapter: the page transposes the
dérivation design system (`design-reference/`, `assets/css/*`) to new
content, reusing every block component and widget convention. Read this
file in full before any later work on the chapter; keep it updated when
behaviour changes.

## Purpose & narrative through-line

Replace the static PDF fiche on sequences with a page where the student
*builds* the concept. Narrative order (concrete hook → picture →
manipulation → formal definition), never to be reordered:

1. **Concrete hook** (§1) — 100, 120, 140, 160… savings on a livret; rank
   vs term; the cloud-of-isolated-points picture (static figure).
2. **The two generation modes** (§2) — the student *feels* the asymmetry
   in the « deux machines » widget (slider = direct access vs button =
   one step at a time) **before** the formal definitions.
3. **Arithmétiques** (§3) — manipulate u₀ and r first (staircase +
   alignment), then définition, proof method, explicit formula (POURQUOI:
   count the steps), Gauss sum widget, sum formulas.
4. **Géométriques** (§4) — manipulate q first (three worlds: explode /
   freeze / die out), then définition, proof method, explicit formula,
   telescoping sum (POURQUOI), face-à-face table, À RETENIR.
5. **Sens de variation** (§5) — eye training first (4-round game with two
   traps), then définition (« pour tout n »), the two routes (difference,
   quotient), known cases (r sign, q vs 1).
6. **Consolidation** — 5 pièges classiques, l'essentiel en 5 lignes,
   15 exercices corrigés, Vers le Bac (suite arithmético-géométrique).

Every concept gets its intuition before its formalism: the limit-flavoured
ideas (0,8ⁿ → 0, plafond d'abonnés) are kept qualitative — limits of
sequences are Terminale material and are only teased.

## Reference sequences & view windows

No shared `FONCTIONS` entries are used (sequence widgets are
parameterised by sliders, not by curve registry keys). Windows:

- **§1 static figure**: u_n = 100 + 20n (the savings hook), n = 0…8,
  viewBox 640×400, x ∈ [−0,6 ; 9], y ∈ [−15 ; 300], money grid every 50.
  u₃ highlighted (accent point + dashed guides + label « u₃ = 160 € »).
- **arithmetique widget**: n = 0…8, viewBox 640×400, x ∈ [−0,7 ; 9,3],
  y ∈ [−7 ; 7]. u₀ ∈ [−3 ; 3] step 0,5 (init −2), r ∈ [−1 ; 1] step 0,05
  (init 0,75). Points may exit the frame at extreme settings (hidden);
  the carrier line still shows the direction.
- **geometrique widget**: n = 0…8, viewBox 640×400, x ∈ [−0,7 ; 9,3],
  y ∈ [−1 ; 10]. u₀ fixed = 1, q ∈ [0,1 ; 2] step 0,05 (init 1,3 —
  chosen so all nine points fit the frame). Points above y = 10 are
  hidden, stems clip to the top edge, the legend says so.
- **somme widget**: viewBox 640×360, n ∈ [3 ; 12] (init 8), square cells
  sized `min(44, 520/(n+1), 250/n)`, grid centred.
- **sens widget**: viewBox 640×360, x ∈ [−0,7 ; 9,3], y window per round
  (JSON). Sequence registry lives in `sens.js` (`SUITES`), analytic.

## Section structure

| id | Sommaire label | Contents |
|---|---|---|
| `s1` | 1. Une liste de nombres numérotés | hook prose (épargne) · static figure (cloud of points, u₃ highlighted) · « fonction qui n'accepte que les entiers » gloss · DÉFINITION (suite, terme, rang, (uₙ) vs uₙ) |
| `s2` | 2. Deux façons de fabriquer une suite | explicit vs récurrence prose · **widget termes** · POURQUOI ? (la récurrence est la langue du monde) · DÉFINITION (deux modes) · MÉTHODE (calculer des termes) · EXEMPLES RÉSOLUS (explicite, récurrence, u_{n+1} en littéral) · **quiz s2** (3 q.) |
| `s3` | 3. Les suites arithmétiques | hook (le livret est arithmétique) · **widget arithmetique** · lien pente ↔ chapitre dérivation · DÉFINITION · MÉTHODE (prouver/réfuter) · EXEMPLES (7 − 2n oui, n² non) · POURQUOI ? (n marches de hauteur r) · PROPRIÉTÉ (uₙ = u₀ + nr ; u_p) · EXEMPLE (u₂/u₅ → r, u₀, u₄₀) · Gauss prose · **widget somme** · PROPRIÉTÉ (n(n+1)/2 ; premier+dernier) · EXEMPLE (deux sommes) · **quiz s3** (3 q.) |
| `s4` | 4. Les suites géométriques | hook (vues ×1,5) · **widget geometrique** · DÉFINITION · MÉTHODE · EXEMPLES (5×3ⁿ oui, 2n+1 non) · POURQUOI ? (n multiplications = qⁿ) · PROPRIÉTÉ (uₙ = u₀qⁿ) · EXEMPLE (la vidéo, 1,5¹⁰) · POURQUOI ? (télescopage qS − S) · PROPRIÉTÉ (somme, q ≠ 1) · EXEMPLE (1+2+…+2⁹) · table FACE-À-FACE · À RETENIR · **quiz s4** (4 q.) |
| `s5` | 5. Le sens de variation | hook (comparer uₙ₊₁ à uₙ) · **widget sens** (4 manches) · DÉFINITION (pour tout n) · POURQUOI ? (les premiers termes mentent) · MÉTHODE (différence / quotient) · EXEMPLES (n²+4n ; 5×0,8ⁿ) · PROPRIÉTÉ (cas arithmétique et géométrique) · **quiz s5** (3 q.) |
| `pieges` | Les pièges classiques | 5 pièges (rang/terme · uₙ₊₁ ≠ uₙ+1 · « vérifié sur 3 termes » · décalage d'indice · comptage des termes d'une somme) |
| `essentiel` | L'essentiel en 5 lignes | SUITE · ARITHMÉTIQUE · GÉOMÉTRIQUE · SOMMES · VARIATIONS |
| `ex` | Exercices — 15 corrigés | course order: explicite 01 · récurrence 02 · notation 03 · arithmétiques 04–06 · géométriques 07–09 · sommes 10–11 · variations 12–13 · problème 14 (deux offres d'embauche) · **VERS LE BAC** (ex. 15, `#bac`, plateforme de vidéos, suite auxiliaire vₙ = uₙ − 25 000) |

### Components introduced by this chapter

- **`.machine-*`** (chapitre.css) — two-panel frame for the termes widget
  (mode label, KaTeX rule, calc line, recurrence chain `<ol>`, italic note).
- **`.som-*`** — Gauss staircase cells (`.som-case`, base = chip/guide,
  copy = accTint2/accEdge), `.som-copie` reveal transition (respects
  reduced motion via the global base.css rule), `.som-dim`/`.som-num`
  labels.
- **`.pt-suite`** — chalk sequence point (stroke bg on page, surface in
  widgets); **`.g-marche`** — accent staircase riser;
  **`.lecture-formule`** — mono line for instantiated explicit formulas.
- **`.pied-chapitre .suivant-titre a`** — the CHAPITRE SUIVANT footer is
  now linkable (used on the dérivation page → suites).
- `fmtCourt` added to `nabla-graph.js` (trim trailing zeros for round
  slider values).

## Widget instances

Shared engineering standards are defined in CLAUDE.md. All five widgets
are **slider/button-driven** — this chapter has no free-draggable SVG
point, so keyboard access comes free from native controls (see flag 7).

### 1. `termes` — « Explicite ou récurrence : deux machines » (§2)

Module `assets/js/widgets/termes.js`, instance
`data-exp="n2-2n" data-rec="2v-1"` (registries in the module).

- **Machine 1 (explicite)**: uₙ = n² − 2n. Native slider n ∈ [0 ; 50]
  (init 4). Calc line updates text nodes only in a static shell:
  « u₃₇ = 37² − 2 × 37 = 1 295 ». Integers formatted with true minus and
  U+202F thousands grouping.
- **Machine 2 (récurrence)**: v₀ = 2, vₙ₊₁ = 2vₙ − 1 (2, 3, 5, 9, …,
  1 025). Accent button « Calcule le terme suivant ▸ » appends one chain
  line « v₃ = 2 × 5 − 1 = 9 »; capped at v₁₀ (button disabled), note
  escalates: 0 calcul → « n calculs… pas moyen de sauter une marche » →
  « pour v₅₀ il en faudrait 50 ».
- **Reset**: header « ↺ réinitialiser » → n = 4, chain back to v₀ only.
- The control asymmetry (slider vs one-step button) is the pedagogy.

### 2. `arithmetique` — « Construis ta suite arithmétique » (§3)

Module `assets/js/widgets/arithmetique.js`, instance
`data-n="8" data-u0-init="-2" data-r-init="0.75"`.

- **Controls**: two native sliders u₀ and r (steps 0,5 / 0,05).
- **Drawing**: 9 chalk points (n ; uₙ); staircase between consecutive
  points (dashed muted tread + solid accent riser, risers omitted when
  r = 0); first riser labelled « +0,75 » / « −0,50 » (hidden when
  |r| < 0,2 — unreadable); dashed accent carrier line y = u₀ + rx across
  the full view (the alignment invariant).
- **Readouts**: instantiated formula line « u₈ = u₀ + 8 × r = −2 + 8 ×
  0,75 = 4 » (negative r parenthesised); chips u₀, r, state chip
  (aria-live): r > 0 monte (good) / r < 0 descend (bad) / r = 0
  constante (accent) — deliberately foreshadows §5.
- **Reset**: u₀ = −2, r = 0,75.

### 3. `somme` — « L'astuce de Gauss, en images » (§3)

Module `assets/js/widgets/somme.js`, instance `data-n-init="8"`.

- **Base staircase**: columns of 1…n cells (chip fill), column numbers
  underneath. **Copy**: the complement of the n × (n+1) rectangle
  (accTint2 fill), toggled by « ▸ pose la copie retournée » /
  « ↺ enlève la copie » (aria-pressed), fade+slide reveal (instant under
  reduced motion). Dimension labels « n = 8 lignes » / « n + 1 = 9
  colonnes » only while the copy is posed.
- **Readout** (aria-live): before — « 1 + 2 + … + 8 = ? — compter les
  cases une à une, non merci. Essaie le bouton. »; after — « deux
  escaliers = un rectangle de 8 × 9 = 72 cases, donc … = 36 ». The sum
  chip shows « ? » until the copy is posed (kept as suspense).
- **Slider** n ∈ [3 ; 12]; changing n keeps the copy state.
- **Reset**: n = 8, copy off.

### 4. `geometrique` — « La raison q change tout » (§4)

Module `assets/js/widgets/geometrique.js`, instance
`data-n="8" data-u0="1" data-q-init="1.3"`.

- **Controls**: slider q ∈ [0,1 ; 2] step 0,05 + segmented presets
  q = 2 / 1 / 0,7 in the header, **animated** via `animerValeur` (same
  behaviour as the dérivation secante presets: aria-pressed only on exact
  match, instant under reduced motion). Reset button beside the slider
  (header slot is taken by the presets) → q = 1,3.
- **Drawing**: chalk points with dashed stems to the axis; points above
  the frame hidden, stems clipped to the top edge.
- **Readouts**: formula line « u₈ = u₀ × q⁸ = 1 × 1,3⁸ = 8,16 » (values
  ≥ 100 shown as integers); chips u₀ = 1 (static), q, state chip:
  q > 1 « ça s'emballe » (good) / q < 1 « ça fond vers 0 » (bad) /
  q = 1 « constante » (accent); dynamic legend (aria-live) narrating the
  three worlds, plus « les derniers points crèvent déjà le plafond du
  graphique » when points are hidden. This legend is the Terminale-limits
  teaser, kept qualitative.

### 5. `sens` — « Croissante, décroissante… ou ni l'une ni l'autre ? » (§5)

Module `assets/js/widgets/sens.js`. Rounds from
`<script type="application/json">`: `{suite, ymin, ymax, bonne}`; the
three answer buttons and all four explanations are **static HTML**
(KaTeX-safe, JS only toggles `hidden` — same doctrine as quiz.js).

- **Rounds** (registry `SUITES` in the module): ① uₙ = 0,5n + 0,5 →
  croissante (easy, arithmetic echo) · ② uₙ = 4 × 0,75ⁿ → décroissante
  (trap: « elle s'arrête de descendre » — non) · ③ uₙ = 3 × (−0,75)ⁿ →
  ni l'une ni l'autre (oscillation) · ④ uₙ = (n−5)²/4 − 1 → ni l'une ni
  l'autre (descend puis remonte; explanation grants « croissante à
  partir du rang 5 »).
- **Flow**: wrong → button marked+disabled, generic relance (compare
  chaque terme au suivant); right → all locked, explanation, accent
  « Suite suivante (i/4) ▸ »; after round 4: « Terminé : x/4 du premier
  coup » + « ↺ recommencer ». Progress chip « SUITE i/4 ».

## Quiz « Teste-toi » (reuses assets/js/quiz.js)

Four quizzes (`s2/s3/s4/s5`), 13 questions total, same markup and
behaviour as the dérivation chapter (static relance/explication HTML,
wrong = marked+disabled+retry, right = locked+explanation, score in
header). Distractors are the chapter's real errors: uₙ + 1, (2×3)²,
off-by-one u₁₉, 5×2³, exponent n vs n+1, sum-formula confusion.

## Analytics (Plausible, throttled ≈ 1 event / interaction session)

| Event | Props | Fired |
|---|---|---|
| `widget_interact` | `widget: termes \| arithmetique \| somme \| geometrique \| sens \| quiz-s2 \| quiz-s3 \| quiz-s4 \| quiz-s5`, `chapitre: suites` | first interaction, then ≤ 1 / 30 s per widget/quiz |
| `corrige_open` | `exercice: 01 … 14`, `chapitre: suites` | when a corrigé is opened |
| `bac_open` | — | when the Vers le Bac corrigé is opened |

`chapitre` read from `<body data-chapitre="suites">`.

## Review flags for Victor

Everything on this page is new authorship in your voice — there is no
design mock and no pre-existing copy for this chapter. Please read as
author. Specific interpretations and decisions:

1. **All five widgets are my design** (no mock): concepts, rounds,
   presets, captions and thresholds documented above. The visual language
   (frames, pills, chips, segmented control, sliders, craie/accent roles,
   good/bad states) is transposed from the dérivation designs.
2. **No draggable SVG points in this chapter** — every widget is driven
   by native sliders/buttons, so the CLAUDE.md drag standards
   (hit-targets, role="slider" on points) don't apply; keyboard and touch
   come free. If you want a draggable variant somewhere, say so.
3. **§1 savings hook** (100 € + 20 €/mois) deliberately returns in §3
   (« le livret est arithmétique ») — one story across the chapter, like
   the car/speedometer in dérivation.
4. **Machine 2 caps at v₁₀ = 1 025** and the explicit slider caps at
   n = 50 (u₅₀ = 2 400): big enough to feel the asymmetry, small enough
   to keep every number readable.
5. **Cross-chapter link** to ../derivation/ in §3 (points alignés ↔
   pente). First internal link between chapters; remove if you'd rather
   keep chapters self-contained.
6. **Gauss anecdote** told as « la légende raconte » — historically
   disputed, flagged as legend on purpose.
7. **Sum formulas**: I give 1+…+n = n(n+1)/2 (program) plus the
   « (nombre de termes) × (premier + dernier)/2 » generalisation, and for
   geometric both 1+q+…+qⁿ and the u₀-factored version. That's slightly
   more than the strict minimum; trim if you disagree.
8. **Ex. 09 uses q² = 9 → q = ±3** with « termes strictement positifs »
   to force the discussion of the rejected root.
9. **Ex. 14 (deux offres d'embauche)** ends on « l'exponentielle finit
   toujours par gagner, mais pas tout de suite » — B wins year-10 salary
   but A wins the 10-year cumul (20 700 € vs ≈ 20 635 €), B passes from
   year 11. Checked numerically. It's the chapter's « à quoi ça sert ».
10. **Vers le Bac** is the classic arithmético-géométrique
    (uₙ₊₁ = 0,8uₙ + 5 000, auxiliary vₙ = uₙ − 25 000). The auxiliary-
    sequence trick is *given* by the statement (as at the bac), not
    expected to be invented. B.4 answers with the qualitative plafond —
    no limit vocabulary.
11. **Limits kept qualitative everywhere** (« fond vers 0 », « plafond
    de 25 000, sans jamais l'atteindre ») — real limits are Terminale.
12. **Sens de variation defined with broad inequalities** (≥ / ≤), strict
    variants mentioned in the same DÉFINITION block — the convention
    varies across manuels; flip if yours differs.
13. **Croissante « à partir du rang 5 »** granted in the sens widget's
    round-4 explanation — a nuance slightly beyond the program, included
    to be honest with the picture.
14. **Homepage**: the suites « bientôt » card became CHAPITRE 02 — EN
    LIGNE (counts updated to « 2 chapitres en ligne · 3 en préparation »);
    its motif is dots rising to a dashed accent ceiling (the bac
    exercise's story). Dérivation's footer now links here; this page's
    footer announces « Le produit scalaire — BIENTÔT ».
15. **JS budget**: 38,2 KB first-party on this page (ceiling 50 KB) —
    comfortable headroom for one more interactive.
16. **« mis à jour juillet 2026 »** hand-maintained, as on dérivation.
17. **Développé sur la branche `claude/fiche-suites-numeriques-qclhus`**
    (consigne de session), pas directement sur `main` — merge quand tu
    valides.
