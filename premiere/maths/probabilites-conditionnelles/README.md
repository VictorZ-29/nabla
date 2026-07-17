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
6. **Répétition d'épreuves** (§6 — added July 2026 for the 2026
   programme: succession de n ≤ 4 épreuves de Bernoulli indépendantes et
   identiques, sans loi binomiale) — the **bernoulli** widget (three
   lancers francs, an 8-leaf tree, a p slider and an event picker
   « 0/1/2/3/au moins 1 succès ») grounds the gesture *first*; then
   DÉFINITION (épreuve/succession de Bernoulli), PROPRIÉTÉ
   (produit le long d'un chemin, somme des chemins), POURQUOI (§3 × §5:
   the tree always multiplies, independence makes every level carry the
   same numbers), MÉTHODE (n ≤ 4; count ALL orders; « au moins un » via
   the contraire 1 − (1−p)ⁿ), EXEMPLES RÉSOLUS (archère 3 flèches
   exactly-2 = 0,243; chevalier de Méré, au moins un six en 4 lancers
   ≈ 0,52), quiz s6 (3 q.).
7. **Consolidation** — 6 pièges classiques, l'essentiel en 5 lignes,
   17 exercices corrigés, Vers le Bac (usine à deux lignes : totales,
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
- **Bernoulli tree** (`bernoulli.js`): viewBox 640×404; root (30, 202);
  level-1 nodes (190, 106)/(190, 298); level-2 (350, 58/154/250/346);
  leaves x = 510, y = 34 + 48·i (i = 0…7, order SSS→EEE, bit = échec);
  leaf values at x = 544; branch probability labels centred at
  x = 103/283/437, offset ±14 px (±10 px at level 3) from branch
  midpoints. p restricted to the 0,1 grid ([0,1 ; 0,9], step 0,1) so
  every leaf probability is exact in 3 decimals (p^s·(1−p)^(3−s)).

## Section structure

| id | Sommaire label | Contents |
|---|---|---|
| `s1` | 1. L'information change les chances | hook prose (tirage au sort, l'indice soufflé) · static population figure · « sachant = parmi » gloss + notation ∩ · tableau croisé (effectifs, variante totaux) · vitrine (proportion de M parmi T) |
| `s2` | 2. « Sachant que » : l'univers rétrécit | **widget univers** · POURQUOI ? (diviser haut et bas par 40 ; P(A) ≠ 0) · DÉFINITION · vitrine P_A(B) · MÉTHODE · EXEMPLE RÉSOLU (dé : « au moins 4 » favorise les pairs) · À RETENIR · **quiz s2** (3 q.) |
| `s3` | 3. L'arbre pondéré | hook (expériences en étapes ; les conditionnelles vivent sur les branches) · **widget arbre** · PROPRIÉTÉ (les trois règles) · POURQUOI ? (une part d'une part ; la définition lue à l'envers) · MÉTHODE · EXEMPLE RÉSOLU (sac sans remise) · **quiz s3** (3 q.) |
| `s4` | 4. Les probabilités totales | prose (les deux chemins vers R, renvoi à la barre du §3) · PROPRIÉTÉ · POURQUOI ? (recoller les morceaux) · MÉTHODE (P(B) par l'arbre) · EXEMPLE RÉSOLU (Jade vélo/bus + renversement) · MÉTHODE (renverser le sachant) · prose paradoxe · **widget depistage** · morale (P_malade(positif) ≠ P_positif(malade)) · **quiz s4** (3 q.) |
| `s5` | 5. L'indépendance | hook (aurait-elle pu ne rien changer ?) · **widget independance** · prose k = 3 · DÉFINITION (produit) · PROPRIÉTÉ (P_A(B) = P(B)) · POURQUOI ? (équivalence) · MÉTHODE · EXEMPLES (roi/cœur oui ; dé du §2 non) · prose + table FACE-À-FACE indépendants/incompatibles · À RETENIR · **quiz s5** (4 q.) |
| `s6` | 6. Répéter l'expérience | hook (lancers francs, p = 0,6, indépendance au sens du §5) · **widget bernoulli** · DÉFINITION (épreuve/succession de Bernoulli) · PROPRIÉTÉ (produit d'un chemin, somme des chemins) · POURQUOI ? (§3 rejoint §5) · MÉTHODE (n ≤ 4 · tous les ordres · contraire pour « au moins un ») · EXEMPLES RÉSOLUS (archère 0,243 ; Méré 671/1296 ≈ 0,52) · **quiz s6** (3 q.) |
| `pieges` | Les pièges classiques | 6 pièges (∩ vs sachant · sachant renversé · P(B) sur une branche · indépendant vs incompatible · indépendance au feeling · ordres oubliés d'un même score) |
| `essentiel` | L'essentiel en 5 lignes | SACHANT · ARBRE · CHEMIN · TOTALES · INDÉPENDANCE (inchangé — pas de ligne Bernoulli, voir flag 24) |
| `ex` | Exercices — 17 corrigés | course order: tableau 01 · traduction 02 · définition 03 · chemin 04 · arbre sans remise 05 · totales 06–07 · renversé 08–09 · indépendance 10–13 · répétition d'épreuves 14 (Léna, 3 lancers) · au moins un 15 (coffres, n = 4) · problème 16 (site e-commerce) · **VERS LE BAC** (ex. 17, `#bac`, usine deux lignes) |

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

### 5. `bernoulli` — « Trois lancers francs » (§6, added July 2026)

Module `assets/js/widgets/bernoulli.js`, instance `data-p-init="0.6"`.
Archetype B (native controls only — keyboard and touch free); reuses the
`arbre.js` SVG vocabulary (`.arbre-branche/-evt/-proba/-feuille-val`,
`.chemin-actif`, `.pt-noeud`) — **zero new CSS**.

- **Fixed**: n = 3 throws (an n = 4 tree is unreadable at 375 px; n = 4
  is exercised via the contraire in ex 15 and the Méré example).
- **Controls**: slider p ∈ [0,1 ; 0,9] step 0,1 (0,1 grid ⇒ every leaf
  value exact in 3 decimals); segmented event picker « 0 / 1 / 2 / 3 /
  au moins 1 » (aria-pressed, exclusive), default « 3 ».
- **Drawing**: 14 branches, 14 letters S/E, live branch probabilities
  (2 decimals — the same pair repeated at every level, deliberately),
  8 leaf values (3 decimals). Branches, probability labels and leaf
  values on paths realising the chosen event get `.chemin-actif`
  (accent); « au moins 1 » lights 7 of 8 paths — visually loud on
  purpose (the « too many paths, use the contraire » lesson).
- **Readouts**: two-line composed text in `.lecture-formule`
  (aria-live) — line 1 counts the paths in words, line 2 unrolls the
  computation with the result in `.val-accent` (static span structure,
  textContent-only updates: k = 3/0 « produit d'un seul chemin »,
  k = 1/2 « 3 chemins × valeur », « au moins 1 » via 1 − P(0 succès)).
  Chips: « chaque étage : S avec 0,60, E avec 0,40 » (live) and
  accent chip « somme des 8 feuilles : 1,000 » (invariant shown, as on
  the arbre widget). Static `.widget-note` names « identiques et
  indépendantes » as what authorises multiplying without conditionals.
- **Reset**: header button → p = 0,6, event « 3 ».
- Renders coalesced per frame (`planifierRendu`), same idiom as arbre.

## Quiz « Teste-toi » (reuses assets/js/quiz.js)

Five quizzes (`s2/s3/s4/s5/s6`), 16 questions total (3+3+3+4+3), same
markup and behaviour as the other chapters (static relance/explication
HTML, wrong = marked+disabled+retry, right = locked+explanation, score
in header). Distractors are the chapter's real errors: P(A∩B) vs
P_A(B), produit vs somme, sachant renversé, branches non pondérées
(0,8), indépendant vs incompatible, « environ 90 % » on the test
question — and for s6: additionner au lieu de multiplier (1,5), l'ordre
unique oublié (0,125), p × n pour « au moins un » (0,8).

## Analytics (Plausible, throttled ≈ 1 event / interaction session)

| Event | Props | Fired |
|---|---|---|
| `widget_interact` | `widget: univers \| arbre \| depistage \| independance \| bernoulli \| quiz-s2 \| quiz-s3 \| quiz-s4 \| quiz-s5 \| quiz-s6`, `chapitre: probabilites` | first interaction, then ≤ 1 / 30 s per widget/quiz |
| `corrige_open` | `exercice: 01 … 16`, `chapitre: probabilites` | when a corrigé is opened |
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
    strictly inside the cours. *(Update July 2026: with the new §6 this
    question is now fully inside the cours — flag resolved.)*
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

Flags 19+ come from the July 2026 « programme 2026 » extension pass
(succession d'épreuves de Bernoulli, PROGRAMME.md):

19. **New §6 added for the 2026 programme** (BO n°14 du 2 avril 2026:
    succession de n ≤ 4 épreuves de Bernoulli indépendantes et
    identiques, sans loi binomiale). Every word of §6 — prose,
    DÉFINITION, PROPRIÉTÉ, POURQUOI, MÉTHODE, the archère and Méré
    examples, quiz s6, exercises 14–15 and their corrigés — is my
    writing in your voice; please read as author. The exact official
    wording of the annexe could not be fetched from the sandbox (see
    PROGRAMME.md « À vérifier ») — the scope implemented is
    cross-checked from concordant secondary sources.
20. **Six course sections instead of the canonical five** — the house
    anatomy (audit.md) says 5; the programme addition earns its own
    section rather than bloating §5. Sommaire now has 10 links.
21. **The bernoulli widget is my design** (no mock): n = 3 fixed,
    p on the 0,1 grid so every displayed number is exact, event picker
    instead of clickable leaves (the event—not the single path—is the
    2026 skill), « au moins 1 » as a fifth segment delivering the
    contraire lesson. Specs above.
22. **Exercises renumbered post-launch**: the problème « site
    e-commerce » moved 14 → 16 and the bac 15 → 17 so the two new
    Bernoulli exercises (14–15) sit in course order. The `corrige_open`
    analytics props change accordingly — two weeks of launch data on
    « exercice 14/15 » now refer to different exercises.
23. **s5 quiz retitled** « Quatre questions pour finir » → « Quatre
    questions sur l'indépendance » (it no longer closes the chapter).
    One original sentence touched.
24. **Six pièges** (house rule says 4–5): the « ordres oubliés » trap
    earned the sixth slot rather than evicting an existing piège. Say
    the word to trim. **L'essentiel stays at exactly 5 lines** with no
    Bernoulli line (hard house rule); if you want one, my suggestion is
    to fold CHEMIN and TOTALES together and add « RÉPÉTITION :
    P(au moins un) = 1 − (1−p)ⁿ ».
25. **Chevalier de Méré**: the historical claim (he won the « at least
    one six in four throws » bet and wrote to Pascal) is the standard
    telling of the 1654 correspondence; reword if you find it too
    storybook.
26. **Header meta** now « ≈ 70 min de travail · 17 exercices
    corrigés »; head description/OG/JSON-LD and the homepage card
    updated to name répétition d'épreuves and 17 exercices.
27. **JS budget re-measured**: 48,5 KB unminified for everything the
    page loads (theme, sommaire, corrige, quiz, analytics, nabla-graph,
    univers, arbre, depistage, independance, bernoulli 7,4 KB) — under
    the 50 KB ceiling but nearly full; flag 16's earlier « 38,9 KB »
    was measured over a narrower module set. Verified end-to-end with a
    jsdom harness (29 checks: tree drawing, all four event modes,
    slider, reset, quiz s6, corrigé toggles 14/15/16/17, no duplicate
    ids) + KaTeX render of all 337 formulas, 0 errors. The two-theme
    visual pass at 375 px/desktop remains on your checklist (no browser
    in this session).
28. **No CSS changed** (the widget reuses the arbre vocabulary), so no
    `?v=` bump was needed anywhere.
29. **Checked against the official annexe** (BO n°14 du 2 avril 2026 PDF,
    provided by Victor on 17-07-2026): §6's scope matches the official
    item word for word (« Pour n ⩽ 4, répétition de n épreuves de
    Bernoulli indépendantes et identiques », represent the tree to
    compute probabilities — flag 19's caveat is resolved). Two adjacent
    official items are not (yet) on the page and are tracked in
    PROGRAMME.md as possible compléments: the vocabulary « partition de
    l'univers / système complet d'évènements » (the page's probabilités
    totales use the {A, Ā} case), and the representation of a succession
    of two independent trials by a **tableau** (the page only uses
    trees). Also worth knowing: the 2026 programme initiates conditional
    probabilities in Seconde (entretien via automatismes in Première) —
    this chapter teaching them from scratch is exactly right for
    revision + formalisation.
