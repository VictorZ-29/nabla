# Chapitre — Les variables aléatoires (Première · Spé Maths)

Spec of this chapter's content structure, widgets and configuration.
No Claude Design mock exists for this chapter: the page transposes the
dérivation design system (`design-reference/`, `assets/css/*`) to new
content, reusing every block component and widget convention. Read this
file in full before any later work on the chapter; keep it updated when
behaviour changes.

Programme note: this chapter is written for the **2026 programme** of
Première spé maths. It covers « variable aléatoire réelle, loi de
probabilité ; espérance, variance, écart type ; interprétation » **plus
the 2026 addition** « succession de n ≤ 4 épreuves de Bernoulli
indépendantes et identiques (arbres), sans formaliser la loi binomiale »
— the decision to host the Bernoulli complément here (rather than in the
probabilités conditionnelles chapter) is flag 2 below.

## Purpose & narrative through-line

Replace the static PDF fiche on random variables with a page where the
student *performs* the central gestures — grouping outcomes by value,
and playing a game enough times to watch the mean settle on E(X) —
before ever seeing a formula. Narrative order (concrete hook → picture →
manipulation → formal definition), never to be reordered:

1. **Concrete hook** (§1) — la roue de la kermesse : mise 2 €, dix
   secteurs équiprobables (5 × « 0 € », 3 × « 2 € », 2 × « 5 € »).
   The affiché/net distinction (X = rendu − 2) is introduced as a story
   fact, everything stays at Seconde level (équiprobabilité). Static
   wheel figure = the §2 widget's « toute la roue » state.
2. **Manipulation, then definition** (§2) — the **va-loi** widget lets
   the student select a value of X and see which sectors produce it
   (regrouper les issues) ; **only after** come the definitions of
   variable aléatoire and loi de probabilité, the law table, and the
   Σp = 1 contrôle-réflexe.
3. **Espérance** (§3) — the chapter's « wow » : the **va-simulation**
   widget plays the wheel ×1/×10/×100 and the running mean visibly
   settles on the dashed E(X) = −0,40 € line — the official
   interpretation of expectation, performed by hand. Then POURQUOI
   (1 000 parties idéales → weighted mean), DÉFINITION, the central
   formula (vitrine --grande), MÉTHODE, worked example (the §2 die
   turns out to be équitable).
4. **Variance / écart type** (§4) — roue sage vs roue folle, both
   E = −0,40 € but σ = 1,20 € vs 4,80 € (exact by construction). The
   **va-risque** widget replays 100 parties of each and shows the two
   cumulative-gain trajectories: same average drift, very different
   film. Then the definition, the units story (why σ, not V), the
   quick formula E(X²) − E(X)², MÉTHODE, worked example on the main
   wheel (V = 3,64 ; σ ≈ 1,91 €).
5. **Succession d'épreuves de Bernoulli** (§5, ajout 2026) — le
   chamboule-tout : n = 2 ou 3 lancers identiques et indépendants,
   succès p. The **va-bernoulli** widget shows the full tree; the
   student picks a value of X (nombre de succès) and watches its paths
   light up while the computation line unrolls « nombre de chemins ×
   produit d'un chemin ». Definition of épreuve de Bernoulli, the
   independence-justifies-multiplying POURQUOI, MÉTHODE (n ≤ 4),
   « au moins un = 1 − aucun » réflexe.
6. **Consolidation** — 5 pièges, essentiel en 5 lignes, 15 exercices
   corrigés (loi → espérance → variance → Bernoulli → Python → problème
   assurance), Vers le Bac sans calculatrice (loterie de financement :
   loi avec mise, E, V, σ encadré à la main, puis trois tickets et
   Bernoulli n = 3).

One story runs through the chapter (la kermesse : la roue, les deux
roues rivales, le chamboule-tout) ; the die of §2 returns in §3 ; the
sage/folle wheels return in ex 09 ; the simulation returns in ex 13
(Python) and in the assurance problème (ex 14).

## Reference data & view windows

No `FONCTIONS` registry entries (no curves of functions in this
chapter). All datasets are engineered so displayed numbers are exact:

- **Roue principale** (§1 figure, va-loi, va-simulation) : 10 secteurs
  équiprobables, gains bruts 5 × 0 € / 3 × 2 € / 2 × 5 €, mise 2 €.
  X ∈ {−2 ; 0 ; +3}, p = (0,5 ; 0,3 ; 0,2). E(X) = −0,40 exactly ;
  E(X²) = 3,8 ; V = 3,64 ; σ ≈ 1,91 (the only ≈ of the chapter, in the
  §4 worked example). Wheel geometry: viewBox 640×400, centre
  (320 ; 200), R = 150, 10 sectors of 36° starting at 12 o'clock,
  value order clockwise 0-2-0-5-0-2-0-2-5-0 (spread, no two 5s
  adjacent); labels at radius 106; accent pointer at top.
- **Roues sage / folle** (§4, va-risque) : sage X ∈ {−2 ; 0 ; +2},
  p = (0,3 ; 0,6 ; 0,1) → E = −0,4, V = 1,44, σ = 1,20 exactly ;
  folle X ∈ {−2 ; +14}, p = (0,9 ; 0,1) → E = −0,4, V = 23,04,
  σ = 4,80 exactly (23,04 = 4,8²). Graph: viewBox 640×400, x ∈ [0 ; 100]
  parties, y ∈ [−160 ; +80] € (grid every 40 €/20 parties); drawn
  capital clamped to the window (worst-case overflow probability ≈ 1 %).
- **va-simulation graph** : viewBox 640×400, y ∈ [−2,6 ; 3,4] € (unit
  grid), x ∈ [0 ; 100] parties switching once to [0 ; 1 000] when
  n > 100 (ticks every xMax/5). Cap N = 1 000 parties (buttons disable).
- **Chamboule-tout** (va-bernoulli) : p ∈ [0,1 ; 0,9] step 0,1 so all
  probabilities are exact percentages (n = 3 → 1 decimal, n = 2 →
  integers) ; n ∈ {2 ; 3} ; init p = 0,3, n = 3, X = 2 selected.
  Tree geometry: viewBox 640×410, depth x = 36/180/326/470, leaves
  (n = 3) y = 30 + 50k ; level-2 nodes at children's midpoints; leaf
  percentages at x = 502 (n = 3) or x = 362 (n = 2).

## Section structure

| id | Sommaire label | Contents |
|---|---|---|
| `s1` | 1. La roue de la kermesse | hook prose (la dispute : rentable ou pas ?) · static wheel figure · tableau brut → net (mise 2 €) · vitrine équiprobabilité (Seconde) · annonce du plan |
| `s2` | 2. La loi de probabilité | **widget va-loi** · DÉFINITION (variable aléatoire + loi) · loi en tableau (variante totaux) · PROPRIÉTÉ (Σ = 1, contrôle-réflexe) · MÉTHODE (établir une loi) · EXEMPLE RÉSOLU (le dé à mise 1 €) · **quiz s2** (3 q.) |
| `s3` | 3. L'espérance | **widget va-simulation** · POURQUOI (1 000 parties idéales) · DÉFINITION · vitrine --grande E(X) = Σxᵢpᵢ · interprétation · À RETENIR (signe de E) · MÉTHODE · EXEMPLE RÉSOLU (le dé : équitable) · **quiz s3** (3 q.) |
| `s4` | 4. Variance et écart type | hook (deux stands) · tableau des deux lois · **widget va-risque** · prose (écarts, carrés) · DÉFINITION (V puis σ) · prose unités · PROPRIÉTÉ (formule rapide) · MÉTHODE · EXEMPLE RÉSOLU (roue principale) · **quiz s4** (3 q.) |
| `s5` | 5. Répéter une épreuve | hook (chamboule-tout) · **widget va-bernoulli** · DÉFINITION (épreuve de Bernoulli, succession) · POURQUOI (indépendance = arbre paresseux) · MÉTHODE (P(X = k) par l'arbre, n ≤ 4) · EXEMPLE RÉSOLU (p = 0,2 : P(X = 1), au moins un) · À RETENIR · **quiz s5** (4 q.) |
| `pieges` | Les pièges classiques | 5 pièges (brut/net · E ≠ valeur possible/probable · somme ≠ 1 · E(X²) vs E(X)² · p² sans chemins ni facteur q) |
| `essentiel` | L'essentiel en 5 lignes | LOI · ESPÉRANCE · VARIANCE · ÉCART TYPE · BERNOULLI |
| `ex` | Exercices — 15 corrigés | course order : variable aléatoire 01 · compléter une loi 02 · tombola 03 · brut/net 04 · espérance 05 · jeu équitable 06 · paramètre 07 · variance 08 · comparer deux jeux 09 · Bernoulli n = 2 10 · au moins un 11 · n = 4 12 · lecture Python 13 · problème assurance 14 · **VERS LE BAC** (ex 15, `#bac`, sans calculatrice) |

### Components introduced by this chapter

- **`.roue-sect` / `.roue-v0` / `.roue-v2` / `.roue-v5` / `.roue-val` /
  `.roue-pointe` / `.roue-moyeu` / `.roue-hors`** — the kermesse wheel
  language: sector fill encodes the value class (neutral chip = −2 €,
  accTint = 0 €, accTint2 = +3 €), accent pointer, fade for « pas cette
  valeur » (opacity 0.15, transition gated by prefers-reduced-motion).
- **`.btn-pill:disabled`** — greyed play buttons at the 1 000-parties cap.
- **`.bloc-code`** — read-only Python block for ex 13 (mono, chip
  background, x-scrollable). First code block on the site.
- Everything else is reused untouched: `.segmente`, `.curseur-ligne
  --libelle`, `.arbre-*` + `.pt-noeud` + `.chemin-actif` (tree),
  `.arbre-feuilles`/`.feuille-btn` (value buttons), `.lecture-formule`,
  `.lecture-controles`, `.chips`/`.chip--accent`, `.widget-legende`,
  `.g-grid`/`.g-axis`/`.g-courbe`/`.g-courbe-derivee`/`.g-guide-accent`,
  `.pop-dim`/`.pop-dim--accent`, `.pt-point`, tableau + totals variant.

## Widget instances

Shared engineering standards are defined in CLAUDE.md. All four widgets
are **button/slider-driven** — like the suites and probas chapters,
there is no free-draggable SVG point, so keyboard and touch come free
from native controls.

### 1. `va-loi` — « Regroupe les issues » (§2)

Module `assets/js/widgets/va-loi.js`. No data attributes: the wheel
(10 sectors, values above) is canonical and lives **statically in the
page SVG** (`.js-sect` paths + `.js-sect-txt` labels carrying
`data-net="m2|z|p3"`); all readouts are static HTML per mode
(`.js-mode` blocks), KaTeX-rendered once at load — same doctrine as the
probas univers widget.

- **Controls**: header segmented « toute la roue / X = −2 / X = 0 /
  X = +3 » (`data-mode`, aria-pressed).
- JS only toggles `hidden` on the mode blocks and `.roue-hors` on
  non-matching sectors/labels.
- **Reset** = the « toute la roue » segment (initial state), standing in
  for a dedicated reset button (univers precedent).

### 2. `va-simulation` — « Joue, rejoue, et regarde la moyenne » (§3)

Module `assets/js/widgets/va-simulation.js`. No data attributes (law
hard-wired: −2/0/+3 with 0,5/0,3/0,2 via one uniform draw).

- **Controls**: `.lecture-controles` buttons « jouer 1 partie »
  (accent), « jouer × 10 », « jouer × 100 » ; header « ↺ réinitialiser ».
- **Drawing**: custom decor (unit y-grid, x ticks every xMax/5, axis at
  0, dashed accent E(X) line + label) rebuilt only when the x-window
  switches 100 ↔ 1 000 ; running-mean polyline (accent) + last point.
- **Readouts**: aria-live formula line « perdu … · remboursé … ·
  gagné … — gain moyen : −0,38 € » ; chips parties / gain total / gain
  moyen / static accent chip E(X) = −0,40 €.
- **Revealed caption** (`.js-legende`, aria-live wrapper inherited from
  `.widget-legende`): appears at n ≥ 300 — the payoff sentence.
- Cap: 1 000 parties (buttons disabled at cap; note announces it).
- Randomness: `Math.random()` per partie; renders only on click
  (≤ 1 000-point path, no per-frame work).

### 3. `va-risque` — « Deux roues, même espérance » (§4)

Module `assets/js/widgets/va-risque.js`. No data attributes (both laws
hard-wired, see Reference data).

- **Control**: single header button « ↻ rejouer 100 parties » — replays
  both wheels; the initial render already shows one simulation, and
  replaying IS the reset (flag 8).
- **Drawing**: fixed decor (grid, axis, dashed accent « cap espérance »
  line from (0 ; 0) to (100 ; −40) with label, in-SVG legend swatches),
  two cumulative-capital paths — sage = accent (`.g-courbe-derivee`),
  folle = chalk (`.g-courbe`), y clamped to the window.
- **Readouts**: aria-live bilan line « après 100 parties — sage : … ·
  folle : … » ; static chips (E common, both σ).

### 4. `va-bernoulli` — « Le chamboule-tout » (§5)

Module `assets/js/widgets/va-bernoulli.js`, instance
`data-p-init="0.3" data-n-init="3"`.

- **Controls**: header segmented « 2 lancers / 3 lancers » (`data-n`) ;
  slider p ∈ [0,1 ; 0,9] step 0,1 (`.curseur-ligne--libelle`, French
  aria-valuetext) ; per-n value-button groups (`.js-groupe[data-n]`,
  `.feuille-btn`, aria-pressed) — two static groups toggled by `hidden`
  so labels render at load ; reset button in the `.widget-pied` (header
  slot taken by the segmented control, audit divergence #1).
- **Drawing**: full depth-3 tree built once (letters S/E, branch
  probability labels, leaf percentages) ; level 3 + its leaf values in a
  group hidden when n = 2, a second set of leaf values at level 2 shown
  instead. Selecting X = k lights every branch on every path with k
  successes (`.chemin-actif`) plus those leaves' percentages.
- **Readouts**: aria-live computation line « P(X = 2) = 3 chemins ×
  (0,3 × 0,3 × 0,7) = 18,9 % » (single chemin → « 1 chemin : … ») ;
  accent chip « E(X) = 0,9 boîte par série » (= Σ k·P(X = k) = np,
  live) ; static chip « les valeurs de X se partagent 100 % ».
- **Reset**: p = 0,3, n = 3, X = 2.
- All percentages exact by the step-0,1 grid (see Reference data).

## Quiz « Teste-toi » (reuses assets/js/quiz.js)

Four quizzes (`s2/s3/s4/s5` = 3+3+3+4, the 4-question quiz on the
richest section, §5), 13 questions, same markup and behaviour as the
other chapters. `data-bonne` spread: 3 × pos. 1, 5 × pos. 2, 5 × pos. 3.
Distractors are the chapter's real errors: brut vs net (0,5 for
P(X = 0)), moyenne simple vs pondérée, « E est la valeur la plus
probable », E(X²) vs (E(X))², somme = 100, p × n > 1, p² sans chemins,
« 4 × 0,1 » pour « au moins un ».

## Analytics (Plausible, throttled ≈ 1 event / interaction session)

| Event | Props | Fired |
|---|---|---|
| `widget_interact` | `widget: loi \| simulation \| risque \| bernoulli \| quiz-s2 \| quiz-s3 \| quiz-s4 \| quiz-s5`, `chapitre: variables` | first interaction, then ≤ 1 / 30 s per widget/quiz |
| `corrige_open` | `exercice: 01 … 14`, `chapitre: variables` | when a corrigé is opened |
| `bac_open` | — | when the Vers le Bac corrigé is opened |

`chapitre` read from `<body data-chapitre="variables">` (short key; the
folder is `variables-aleatoires`).

## Review flags for Victor

Everything on this page is new authorship in your voice — no design
mock and no pre-existing copy exist for this chapter. Please read as
author. Specific interpretations and decisions:

1. **All four widgets are my design** (no mock): datasets, stories,
   thresholds, captions documented above. Visual language transposed
   from the existing chapters (wheel sectors are the only new SVG
   vocabulary).
2. **The 2026 Bernoulli complément lives here, not in the probas
   chapter.** Rationale: its natural payoff is the *law of the number
   of successes* and its espérance — this chapter's tools — and the
   probas chapter's arbre section already teaches the multiplying
   gesture it builds on (§5 links back to it explicitly). PROGRAMME.md
   updated accordingly. Say the word if you'd rather split it.
3. **One dataset runs the chapter** (roue : mise 2 €, bruts 0/2/5 sur
   5/3/2 secteurs) — chosen so E(X) = −0,40 lands exactly and the
   brut/net trap is built into the story. §4's sage/folle wheels are
   engineered for *exact* σ (1,20 € and 4,80 €) with the same E ; the
   main wheel's σ ≈ 1,91 € is the chapter's only rounded value.
4. **Sector-colour encoding** (chip/accTint/accTint2 by value class)
   stretches the craie/accent role split — the wheel is the reference
   object but uses accent tints to group values. It makes the
   « regrouper » gesture readable; tell me if you want a neutral wheel.
5. **Simulation caption threshold** (n ≥ 300) and the 1 000-parties cap
   are my calls: at 300+ the mean is visually glued to the line at this
   y-scale; the cap keeps the x-axis honest and the DOM path short.
   The axis window switch at n > 100 is announced in the widget-note.
6. **va-risque has no dedicated reset** — « rejouer 100 parties »
   regenerates the state, and the initial state is itself a random
   run (precedent: associe shuffles at init). A reset would just be
   another rejouer.
7. **Trajectory clamping**: the folle wheel's capital can leave the
   [−160 ; +80] window with probability ≈ 1 % per run; the path is
   clamped flat at the edge rather than escaping the frame. Flag if
   you'd rather widen the window.
8. **E(X) = np shown, not taught**: the bernoulli widget's espérance
   chip and ex 10's « tiens, 1,4 = 2 × 0,7 » present np as an observed
   curiosity (« tu le prouveras en Terminale ») — the binomial law is
   deliberately not formalised, per the 2026 programme.
9. **The quick variance formula** V(X) = E(X²) − E(X)² is presented as
   PROPRIÉTÉ with a one-line justification sketch («&nbsp;en développant,
   tout se simplifie&nbsp;»), no full proof. It was in the 2019 programme;
   I could not verify the 2026 annexe from the sandbox (PROGRAMME.md
   « À vérifier ») — if the annexe drops it, the §4 méthode and
   exemples need a rewrite to the definition-only route.
10. **Linear transformations E(aX + b), V(aX)** are deliberately
    absent (not listed in the 2026 synthesis I had). Ex 06.b computes
    the fair price by re-deriving the espérance of the *rendus* rather
    than invoking E(X + c) — check that this matches the annexe.
11. **Vitrine --grande placement**: the chapter's central formula
    (E(X) = Σxᵢpᵢ) lives in §3 with its definition, not in §2 as in
    the dérivation chapter — §2's object (the law) has no one-line
    formula; its vitrine is the Σ = 1 propriété. Structural deviation,
    flagged per the skill.
12. **§4 widget before the definition** shows the *phenomenon* (same
    E, different films) with σ already printed on the chips — the
    number is named and defined right after. I consider the
    manipulation-first law respected (the definition follows the
    gesture); flag if you read the chips as formalism-before-gesture.
13. **Exercise stories** (jeu de 32 cartes, tombola, pêche aux
    canards, appli de fidélité, borne d'arcade, tirs au but, coffres de
    jeu vidéo, QCM, assurance smartphone) are mine; every number
    hand-checked : ex03 Σ = 1 et P(X ≥ 0) = 0,2 · ex06 m = 2,50 € ·
    ex08 V = 2, σ = √2 ≈ 1,41 · ex09 σ = 1,20/4,80 · ex10 E = 1,4 ·
    ex11 0,488/0,384 · ex12 81/256, 1/256, 175/256 · ex14 E = 7 € ·
    bac : E = −0,6, V = 8,44, 2,9 < σ < 3, 27/64, 37/64,
    P(Y = 1) = P(Y = 0) = 27/64.
14. **Ex 13 is code-reading only** (site statique, pas d'exécution),
    matching the PROGRAMME.md transversal policy; it introduces the
    `.bloc-code` component (first on the site). The script mirrors the
    §3 widget on purpose.
15. **Vers le Bac is SANS CALCULATRICE** (first maths chapter to use
    it) to serve the 2026 épreuve anticipée; A.4's « montre que
    2,9 < σ < 3 » replaces a calculator square root by an encadrement.
    The grattage framing (« imprimés en très grand nombre ») is there
    to make B's independence honest.
16. **Homepage**: the « Les variables aléatoires » bientôt card became
    CHAPITRE 09 (same bar motif, chalk bars + accent dashed baseline +
    accent point); a new « Les statistiques » bientôt card replaces it
    (scatter-plot motif) — the title is provisional, the 2026 statistics
    chapter scope still needs the annexe (PROGRAMME.md). The
    trigonométrie footer now links here; this page's footer announces
    « Les statistiques — BIENTÔT ». Sitemap and recherche-data.js
    updated.
17. **JS budget**: 35,4 KB first-party on this page (ceiling 50 KB) —
    `wc -c` over the ten modules the page loads.
18. **« mis à jour juillet 2026 »** hand-maintained, as on the other
    chapters.
19. **Développé sur la branche `claude/premiere-topic-selection-242ts1`**
    (consigne de session) — merge to `main` when you're happy.
