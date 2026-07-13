# Chapitre — Les probabilités conditionnelles (Première · Spé Maths)

Spec of this chapter's content structure, widgets and configuration.
No Claude Design mock exists for this chapter: the page transposes the
dérivation design system (`design-reference/`, `assets/css/*`) to new
content, reusing every block component and widget convention. Read this
file in full before any later work on the chapter; keep it updated when
behaviour changes.

## Purpose & narrative through-line

Replace the static PDF fiche on conditional probability with a page where
the student *performs* the central gesture of the chapter — restricting
the universe — before ever seeing a formula. Narrative order (concrete
hook → picture → manipulation → formal definition), never to be reordered:

1. **Concrete hook** (§1) — a concert-ticket raffle among 40 élèves;
   the whispered clue « c'est un élève du théâtre » moves the probability
   from 0,30 to 0,60 without changing the world. Static population figure
   (40 dots, musicians filled, théâtre framed) + tableau croisé + the
   « proportion parmi » vitrine. Everything stays at Seconde level
   (fréquences conditionnelles).
2. **Manipulation, then definition** (§2) — the **univers** widget lets
   the student switch the information (rien / sachant T / sachant M) and
   watch the denominator change and the asymmetry appear; **only after**
   comes P_A(B) = P(A∩B)/P(A), whose POURQUOI shows it is the §1 counting
   divided by 40 top and bottom.
3. **Arbre pondéré** (§3) — experiments told in stages (pluie → retard);
   conditional probabilities live on second-level branches. The **arbre**
   widget (3 sliders, clickable leaves, proportion bar « aire =
   probabilité ») grounds the path-product rule as « une part d'une
   part », then the rule is derived as the §2 definition read backwards.
4. **Probabilités totales + renversement** (§4) — P(R) read off the two
   accent segments of §3's bar; formula; the bac-classic reversal method;
   then the **depistage** widget (1 000 dots, prevalence slider) delivers
   the chapter's « wow »: a 90 %-reliable test with positives that are
   mostly false. The « ne garde que les positifs » button replays the
   §2 gesture on a real-stakes example.
5. **Indépendance** (§5) — the **independance** widget returns to the
   class of §1 and lets the student *fabricate* independence (k = 3
   musicians in the frame aligns every gauge on 0,30); then définition
   (product form), equivalence with P_A(B) = P(B), the méthode (always a
   calculation), and the indépendants/incompatibles face-à-face table.
6. **Consolidation** — 5 pièges classiques, l'essentiel en 5 lignes,
   15 exercices corrigés, Vers le Bac (usine à deux lignes : totales,
   renversement, indépendance, réglage rendant D indépendant, complément
   « au moins un »).

One dataset runs through §1/§2/§5 (the class: 40 élèves, T = théâtre 10,
M = musicien 12, T∩M = 6); §3/§4 use the pluie/retard story; the
dépistage widget owns the medical-test story. All arithmetic is
exact-by-construction (see widget specs).

## Reference data & view windows

No `FONCTIONS` registry entries are used (no curves in this chapter).

- **Population layout** (§1 figure + widgets univers & indépendance),
  exported as `POP` from `univers.js`: viewBox 640×356 (univers/figure)
  or 640×444 (indépendance, gauges below); pitch 56, r = 10; théâtre
  block 2×5 at x ∈ {96, 152} inside dashed accent frame (70, 34, 108,
  276, rx 12); others 6×5 at x ∈ {260…540}; rows y ∈ {60…284}; block
  labels at y = 342. Musicians (canonical, k = 6): théâtre indices
  {0, 3, 4, 6, 7, 9}, others indices {2, 9, 13, 17, 22, 28} (row-major).
- **Arbre geometry** (`arbre.js`): viewBox 640×432; root (58, 158);
  level-1 nodes (240, 78)/(240, 238); leaves x = 430, y ∈ {38, 118, 198,
  278}; leaf values at x = 486; proportion bar x 58–582, y 362, h 32,
  3 px gap between the A and Ā groups; group labels under the bar hidden
  below 110/150 px width.
- **Dépistage grid** (`depistage.js`): 1 000 dots, 40×25, pitch 15.5,
  r = 5, origin (11, 11), viewBox 640×395. Category order (row-major):
  vrais positifs, malades non détectés, faux positifs, vrais négatifs —
  malades contiguous so prevalence reads as a block.

## Section structure

| id | Sommaire label | Contents |
|---|---|---|
| `s1` | 1. L'information change les chances | hook prose (tirage au sort, l'indice soufflé) · static population figure · « sachant = parmi » gloss + notation ∩ · tableau croisé (effectifs, variante totaux) · vitrine (proportion de M parmi T) |
| `s2` | 2. « Sachant que » : l'univers rétrécit | **widget univers** · POURQUOI ? (diviser haut et bas par 40 ; P(A) ≠ 0) · DÉFINITION · vitrine P_A(B) · MÉTHODE · EXEMPLE RÉSOLU (dé : « au moins 4 » favorise les pairs) · À RETENIR · **quiz s2** (3 q.) |
| `s3` | 3. L'arbre pondéré | hook (expériences en étapes ; les conditionnelles vivent sur les branches) · **widget arbre** · PROPRIÉTÉ (les trois règles) · POURQUOI ? (une part d'une part ; la définition lue à l'envers) · MÉTHODE · EXEMPLE RÉSOLU (sac sans remise) · **quiz s3** (3 q.) |
| `s4` | 4. Les probabilités totales | prose (les deux chemins vers R, renvoi à la barre du §3) · PROPRIÉTÉ · POURQUOI ? (recoller les morceaux) · MÉTHODE (P(B) par l'arbre) · EXEMPLE RÉSOLU (Jade vélo/bus + renversement) · MÉTHODE (renverser le sachant) · prose paradoxe · **widget depistage** · morale (P_malade(positif) ≠ P_positif(malade)) · **quiz s4** (3 q.) |
| `s5` | 5. L'indépendance | hook (aurait-elle pu ne rien changer ?) · **widget independance** · prose k = 3 · DÉFINITION (produit) · PROPRIÉTÉ (P_A(B) = P(B)) · POURQUOI ? (équivalence) · MÉTHODE · EXEMPLES (roi/cœur oui ; dé du §2 non) · prose + table FACE-À-FACE indépendants/incompatibles · À RETENIR · **quiz s5** (4 q.) |
| `pieges` | Les pièges classiques | 5 pièges (∩ vs sachant · sachant renversé · P(B) sur une branche · indépendant vs incompatible · indépendance au feeling) |
| `essentiel` | L'essentiel en 5 lignes | SACHANT · ARBRE · CHEMIN · TOTALES · INDÉPENDANCE |
| `ex` | Exercices — 15 corrigés | course order: tableau 01 · traduction 02 · définition 03 · chemin 04 · arbre sans remise 05 · totales 06–07 · renversé 08–09 · indépendance 10–13 · problème 14 (site e-commerce) · **VERS LE BAC** (ex. 15, `#bac`, usine deux lignes) |

### Components introduced by this chapter

- **`.pt-pop` / `.pt-pop--b` / `.pt-efface` / `.cadre-univers` /
  `.pop-dim`** — population dots language (neutral chip dot, accent fill
  = B-membership, dashed accent frame = A-membership by position, fade =
  « plus dans l'univers »). `.widget-question` for the mode question.
- **`.arbre-*` + `.pt-noeud`** — tree branches (guide, accent when on the
  selected path), event letters (serif, negation bar drawn as a path —
  no Unicode combining overline in SVG), branch probabilities and leaf
  values (mono, accent when active).
- **`.seg-plein` / `.seg-vide` / `.seg-cadre`** — proportion bar
  segments (aire = probabilité).
- **`.arbre-feuilles` / `.feuille-btn`** — clickable leaf chips
  (aria-pressed) that light a path and unroll its computation.
- **`.curseur-ligne--libelle` / `.curseur-legende`** — slider rows with
  long KaTeX labels (label takes its own line under 560 px).
- **`.pt-vp` / `.pt-fn` / `.pt-fp` / `.pt-vn` + `.puce*` legend** — the
  four fates of the dépistage grid and their HTML legend chips.
- **`.jauge-*`** — comparison gauges with dashed reference line
  (independance widget).
- **Tableau croisé variant** — `.total`, `.sep-total`, `.ligne-total`
  on the shared `.tableau` component.

## Widget instances

Shared engineering standards are defined in CLAUDE.md. All four widgets
are **slider/button-driven** — like the suites chapter, there is no
free-draggable SVG point, so keyboard and touch come free from native
controls.

### 1. `univers` — « Rétrécis l'univers toi-même » (§2)

Module `assets/js/widgets/univers.js` (also exports `POP` +
`dessinerPopulation` reused by `independance.js`). No data attributes:
the class dataset (40/10/12/6) is canonical and hard-wired.

- **Controls**: segmented « tout le monde / sachant T / sachant M ».
- Since every count is fixed, **all readouts are static HTML** in the
  page (3 × question, formule, chips, légende) and the JS only toggles
  `hidden` + `.pt-efface` on dots — same doctrine as quiz.js, so KaTeX
  and subscripts render once at load.
- Modes: tout → P(M) = 12/40 = 0,30 ; sachant T → fade the 30 others,
  P_T(M) = 6/10 = 0,60 ; sachant M → fade non-musicians, P_M(T) = 6/12 =
  0,50 (the asymmetry lesson, called out in the légende).
- **Reset** = the « tout le monde » segment (initial state), standing in
  for a dedicated reset button as on the dérivation secante widget.

### 2. `arbre` — « L'arbre pondéré, en vrai » (§3)

Module `assets/js/widgets/arbre.js`, instance
`data-p-init="0.3" data-pa-init="0.4" data-pn-init="0.1"`
(A = il pleut, R = retard).

- **Controls**: three native sliders — P(A) ∈ [0,05 ; 0,95] step 0,05
  (no empty first-level branch), P_A(R) and P_Ā(R) ∈ [0 ; 1] step 0,05.
  Sister branches auto-complete to 1.
- **Drawing**: two-level tree (letters A/Ā, R/R̄ with drawn negation
  bars), branch probabilities live, leaf products live; below, the
  proportion bar: A-group / Ā-group split at P(A), R-parts filled accent
  (legend « retard (R) »), group labels hidden when too narrow.
- **Leaves as buttons** (aria-pressed): selecting one lights its two
  branches + value and unrolls the computation line
  « P(A ∩ R) = P(A) × P_A(R) = 0,30 × 0,40 = 0,12 » (aria-live). Default
  selection: A ∩ R.
- **Chips**: « somme des 4 feuilles : 1,00 » recomputed live — the
  invariant is *shown*, not asserted.
- **Reset**: header button → inits + leaf A ∩ R.

### 3. `depistage` — « Le test qui se trompe » (§4)

Module `assets/js/widgets/depistage.js`, instance `data-n-init="1"`.

- **Population**: 1 000 dots. Test fixed at sensibilité 90 % /
  spécificité 90 %; prevalence n ∈ [1 ; 30] % (slider, step 1) chosen so
  every count is an integer for every n: malades 10n (9n vrais positifs,
  n ratés), sains 1000 − 10n (100 − n faux positifs). P(malade | positif)
  = 9n/(8n + 100): 8,3 % at n = 1, 50 % at n = 10, ≈ 77 % at n = 30.
- **Controls**: header segmented presets 1 % / 10 % / 30 % (animated via
  `animerValeur`, instant under reduced motion); slider; accent toggle
  « ▸ ne garde que les positifs / ↺ remets tout le monde »
  (aria-pressed) fading all negatives — the §2 restriction gesture;
  « ↺ réinitialiser » → n = 1, toggle off.
- **Readouts**: formule line (aria-live) « P(malade sachant positif) =
  9 / 108 = ≈ 8,3 % »; chips malades / positifs / réponse; HTML legend
  (aria-hidden, the dot colours restated); dynamic légende narrating
  three prevalence regimes (≤ 5 %, < 20 %, ≥ 20 %).
- Rendering touches 1 000 dots: coalesced with requestAnimationFrame.

### 4. `independance` — « Déplace les musiciens » (§5)

Module `assets/js/widgets/independance.js`, instance `data-k-init="6"`.

- **Same population drawing** as §2 (imported), plus two gauges under
  the dots: part of musicians « chez les 10 du théâtre » (k/10) and
  « chez les 30 autres » ((12 − k)/30), with a dashed reference line at
  0,30 (toute la classe).
- **Control**: slider k ∈ [0 ; 10] step 1 — musicians among the 10 of
  the frame; total stays 12 (the rest move to the other block; fill
  orders keep the canonical k = 6 layout recognisable).
- **Readouts**: formule line « P(T ∩ M) = 6/40 = 0,15 · P(T) × P(M) =
  0,25 × 0,30 = 0,075 → différents : dépendants » (aria-live), turning
  « égaux : indépendants » exactly at k = 3; chips P(M) = 0,30 (static),
  P(M sachant T) live, state chip good/bad/accent (« savoir T augmente /
  baisse les chances de M » / « ne change rien — indépendants ! »).
- **Reset**: header button → k = 6.

## Quiz « Teste-toi » (reuses assets/js/quiz.js)

Four quizzes (`s2/s3/s4/s5`), 13 questions total, same markup and
behaviour as the other chapters (static relance/explication HTML, wrong
= marked+disabled+retry, right = locked+explanation, score in header).
Distractors are the chapter's real errors: P(A∩B) vs P_A(B), produit vs
somme, sachant renversé, branches non pondérées (0,8), indépendant vs
incompatible, « environ 90 % » on the test question.

## Analytics (Plausible, throttled ≈ 1 event / interaction session)

| Event | Props | Fired |
|---|---|---|
| `widget_interact` | `widget: univers \| arbre \| depistage \| independance \| quiz-s2 \| quiz-s3 \| quiz-s4 \| quiz-s5`, `chapitre: probabilites` | first interaction, then ≤ 1 / 30 s per widget/quiz |
| `corrige_open` | `exercice: 01 … 14`, `chapitre: probabilites` | when a corrigé is opened |
| `bac_open` | — | when the Vers le Bac corrigé is opened |

`chapitre` read from `<body data-chapitre="probabilites">` (kept short,
like `derivation` / `suites`, though the folder is
`probabilites-conditionnelles`).

## Review flags for Victor

Everything on this page is new authorship in your voice — no design mock
and no pre-existing copy exist for this chapter. Please read as author.
Specific interpretations and decisions:

1. **All four widgets are my design** (no mock): datasets, stories,
   thresholds, captions documented above. Visual language (frames,
   pills, chips, segmented control, sliders, good/bad states) transposed
   from the existing chapters.
2. **One dataset for §1/§2/§5** (40 élèves, théâtre 10, musique 12,
   T∩M = 6) — chosen so every probability lands on two clean decimals
   (0,30 / 0,60 / 0,50) and independence needs k = 3 exactly. The story
   returns in §5 like the livret does in the suites chapter.
3. **Membership encoding**: B = accent fill, A = *position* inside the
   dashed frame (no rings — one visual variable per attribute). The §1
   static figure is the widget's « tout le monde » state, mirroring how
   dérivation's §1 figure previews its flagship widget.
4. **Univers widget has no free parameter** — deliberately: the lesson
   is the change of denominator, and fixed numbers let every readout be
   static, KaTeX-rendered HTML. Its reset is the first segment
   (précédent : secante's h = 0,90 preset, flag 4 of the dérivation
   README).
5. **Arbre events named A and R** (not P for pluie — P(P) reads badly).
   Negation bars over letters are drawn as SVG paths; in the JS-built
   calculation line, Ā is the combining-overline character (A + U+0305) —
   if it renders poorly on some device, tell me and I'll switch to
   « non A ».
6. **P(A) slider bounded to [0,05 ; 0,95]** so neither first-level
   branch disappears; the conditional sliders allow the full [0 ; 1]
   (probability-0 branches are instructive there).
7. **Dépistage numbers engineered for integers at every n** (sensibilité
   = spécificité = 90 %, 1 000 people): 9n vrais positifs, 100 − n faux.
   The three-regime légende (rare / moins rare / fréquent) is my
   framing; the claim « se trompent même des médecins » refers to the
   classic Gigerenzer-style screening studies — reword if you find it
   too pointed.
8. **Prévalence capped at 30 %** — beyond that the grid stops looking
   like « une maladie » and the lesson dilutes; the three presets tell
   the story on their own.
9. **Indépendance presented as « répartition au prorata »** and the
   gauges compare *inside vs outside vs overall* — a slightly stronger
   picture than the program's minimal definition, but it is exactly the
   P_A(B) = P(B) property made visible.
10. **Independence état chip uses good/bad colours** for « augmente /
    baisse les chances » — semantic stretch of the monte/descend pair;
    say the word to neutralise it.
11. **Face-à-face table indépendants/incompatibles** reuses the suites
    « face-à-face » table pattern; the last row spans both columns
    (colspan) — a first for this component.
12. **Exercise stories** (jeu vidéo, club d'escalade, site e-commerce,
    usine d'enceintes) are mine; every number checked by hand: ex06
    P(G) = 0,61 · ex08 28/61 ≈ 0,46 · ex09 9/58 ≈ 0,155 · ex11 x = 5 ·
    ex15 P(D) = 0,032, P_D(L₂) = 0,625, x = 0,02, 1 − 0,98² = 0,0396.
13. **Vers le Bac B.3 uses one step beyond the chapter** (répétition de
    deux épreuves indépendantes + événement contraire) — standard in
    bac subjects on this chapter, but tell me if you'd rather keep it
    strictly inside the cours.
14. **Ex. 09 duplicates the dépistage widget's logic on purpose** (with
    a 2 % prevalence) so the student re-derives by hand what the graphic
    showed.
15. **Homepage**: the « Probabilités conditionnelles » bientôt card
    became CHAPITRE 03 (tree motif with the top path in accent — the
    « multiplier le long d'un chemin » gesture); the suites footer now
    links here; this page's footer announces « Le produit scalaire —
    BIENTÔT ». Sitemap updated; CSS version bumped to ?v=6 on all pages.
16. **JS budget**: 38,9 KB first-party on this page (ceiling 50 KB) —
    room left for one more interactive.
17. **« mis à jour juillet 2026 »** hand-maintained, as on the other
    chapters.
18. **Développé sur la branche
    `claude/probabilites-conditionnelles-fiche-bz25um`** (consigne de
    session) — merge to `main` when you're happy.
