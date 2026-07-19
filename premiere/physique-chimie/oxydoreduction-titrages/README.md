# Chapitre — L'oxydoréduction et les titrages (Première · Spé Physique-Chimie)

Spec of this chapter's content structure, widgets and configuration.
Third chemistry chapter of the site (chapitre 03 of the physique-chimie
row), directly downstream of « La composition d'un système » (conversions
en moles) and « La réaction chimique et l'avancement » (limitant,
stœchiométrie), both of which it reuses explicitly. No Claude Design mock
exists for it: the page transposes the dérivation design system
(`design-reference/`, `assets/css/*`) to chemistry content, reusing every
block component and widget convention, following the `nabla-topic` skill
(`.claude/skills/nabla-topic/`). Read this file in full before any later
work on the chapter; keep it updated when behaviour changes.

> **Built without Victor in the loop** (autonomous session): the outline
> below was NOT validated before building — read the whole page as author,
> starting with the review flags at the bottom.

## Programme scope (BO spécial n°1, 22-01-2019 — vérifié sur PROGRAMME.md)

« Détermination d'une quantité de matière grâce à une transformation
chimique » : couples oxydant/réducteur, oxydants et réducteurs usuels ;
demi-équations électroniques (écrites en milieu acide, avec H⁺ et H₂O) ;
réactions d'oxydoréduction ; titrage avec suivi colorimétrique :
définition et repérage de l'équivalence (changement de réactif limitant,
couleur persistante), relation à l'équivalence, détermination de la
quantité de matière ou de la concentration titrée. Capacité mathématique :
la proportionnalité (via la relation à l'équivalence). Hors programme de
Première, non traités : potentiels d'oxydoréduction, piles et électrolyse
(Terminale), nombre d'oxydation, titrages pH-métriques et
conductimétriques (Terminale), demi-équations en milieu basique. Mesure &
incertitudes (transversal) : nod en B.4 du Vers le Bac (écart réel vs
petites incertitudes de manipulation).

## Purpose & narrative through-line

Replace the static PDF fiche with a page where the student *performs* the
chapter's one big gesture — pushing electrons from a reducer to an
oxidant with their own hand, then reading the colour traces this leaves —
before any formal definition. Narrative order (concrete hook → picture →
manipulation → formal definition), never to be reordered:

1. **Concrete hook** (§1) — le TP du clou : un clou de fer dans une
   solution bleue de sulfate de cuivre ; vingt minutes plus tard, dépôt
   rouge et bleu pâli. « Qui a fait quoi ? » Rouille, pomme coupée, pile,
   éthylotest : partout des électrons qui changent de camp, jamais
   visibles — mais leurs traces, si. Lien arrière vers la composition
   (« la couleur suit la concentration »). Static figure = the flagship
   widget's initial state (bécher, solution pleine opacité, clou net).
2. **Manipulation, then definition** (§2) — the **redox-transfert**
   widget : un curseur sur l'avancement fait passer les électrons du clou
   aux ions Cu²⁺ ; le bleu pâlit, le dépôt pousse, et les deux compteurs
   (cédés / captés) restent égaux à chaque instant. Only after the
   gesture come the DÉFINITIONS (oxydant, réducteur, oxydation,
   réduction ; couple Ox/Red) and the central vitrine Ox + n e⁻ = Red.
3. **Les demi-équations** (§3) — the **demi-jeu** game (stoechio-jeu
   engine, config-only) : 4 couples, 3 propositions chacun, une seule
   juste ; puis la MÉTHODE élément → O (H₂O) → H (H⁺) → charges (e⁻),
   l'exemple résolu MnO₄⁻/Mn²⁺, and the table of usual couples.
4. **L'équation d'oxydoréduction** (§4) — the **redox-equation** widget :
   deux multiplicateurs à régler jusqu'à l'accord cédés = captés ;
   l'équation 2 Al + 3 Cu²⁺ ne s'assemble qu'à l'accord, et l'accord
   double (4 ; 6) enseigne « garde les plus petits entiers ». Exemple
   résolu : MnO₄⁻ + 5 Fe²⁺ — l'équation support du §5, préparée ici.
5. **Le titrage colorimétrique** (§5) — the **titrage** widget : la
   burette verse le permanganate violet dans la fiole de Fe²⁺ ; avant
   l'équivalence le violet meurt à chaque goutte (versé limitant), à
   V_E = 10,0 mL les deux s'épuisent ensemble, au-delà le violet
   s'installe (changement de réactif limitant rendu visible). Le
   graphique n(V) se TRACE en versant — le point anguleux se découvre,
   il n'est pas donné. Puis DÉFINITION (titrage, équivalence), POURQUOI
   (la couleur = le limitant qui change de camp), PROPRIÉTÉ (relation à
   l'équivalence, reliée au mélange stœchiométrique du chapitre
   avancement), MÉTHODE, EXEMPLE (les nombres du widget, bouclés).
6. **Consolidation** — 5 pièges, l'essentiel en 5 lignes, 15 exercices
   corrigés (problème 14 = la vitamine C du jus d'orange), Vers le Bac
   (Partie A réaction support de l'eau oxygénée, Partie B contrôle d'un
   flacon entamé).

One story runs through: **les couleurs qui trahissent les électrons** —
le bleu du Cu²⁺ (§1–§2, ex 09), le violet du permanganate (§3 exemple,
§4 exemple, §5, ex 12), l'orange→vert de l'éthylotest (§1, ex 04, ex 13),
le brun du diiode (jeu §3, ex 11, ex 14). Prerequisites are consumed
explicitly: n = c·V et la couleur/concentration (chapitre composition,
linked §1 + piège 5), avancement/limitant/stœchiométrie (chapitre
avancement, linked §5 propriété + ex 09).

## Reference reactions & datasets (all displayed numbers exact)

No `FONCTIONS` entry (no curves of functions — bespoke drawings and
straight lines from module-local data).

- **§1 figure & flagship redox-transfert (s2)** : Fe + Cu²⁺ → Fe²⁺ + Cu
  (couples Cu²⁺/Cu et Fe²⁺/Fe, 2 e⁻ chacun). n₀(Cu²⁺) = 0,10 mol, clou
  en large excès. Slider x ∈ [0 ; 0,10] step 0,01 : n(Cu²⁺) = 0,10 − x,
  n(Fe²⁺) = x, électrons échangés 2x — tous exacts à 2 décimales. La
  garde « pas de quantités négatives » est la borne du curseur (maison,
  cf. avancement). SVG 640 × 330 : bécher `.dil-verre`, liquide
  `.dil-liquide` (fill-opacity 0,08 + 0,64 × n(Cu²⁺)/n₀), clou
  `.avc-barre-reactif`, dépôt `.avc-barre-produit` (hauteur ∝ x, max
  116 px), 3 étiquettes d'ions Cu²⁺ qui s'effacent (opacity ∝ ratio) et
  2 étiquettes Fe²⁺ accent qui apparaissent, flèche du flux d'électrons
  (`.rdx-electrons` + `.vec-pointe--accent`) visible seulement pendant
  0 < x < x_max.
- **demi-jeu (s3)** : ① Cu²⁺/Cu (bonne : +2 e⁻ à gauche ; distracteurs :
  e⁻ du mauvais côté, un seul e⁻) ② Al³⁺/Al (bonne : 3 e⁻ ; distracteurs :
  2 e⁻, électrons captés par le métal) ③ I₂/I⁻ (bonne : I₂ + 2 e⁻ =
  2 I⁻ ; distracteurs perdent un atome d'iode) ④ MnO₄⁻/Mn²⁺ (bonne :
  8 H⁺ + 5 e⁻ ; distracteurs : O₂ fabriqué, mauvais comptes H⁺/e⁻).
  Réponses `[2, 1, 3, 2]`. Gradation : charges seules → nombre d'e⁻ →
  élément d'abord → O et H — la méthode du dessous dans l'ordre.
- **redox-equation (s4)** : oxydation Al = Al³⁺ + 3 e⁻ (×m₁), réduction
  Cu²⁺ + 2 e⁻ = Cu (×m₂), m ∈ [1 ; 6]. Accord ssi 3m₁ = 2m₂ : minimal
  (2 ; 3), double (4 ; 6) — deux vitrines statiques distinctes. État
  initial (1 ; 1) : 3 ≠ 2.
- **titrage (s5)** : MnO₄⁻ + 8 H⁺ + 5 Fe²⁺ → Mn²⁺ + 4 H₂O + 5 Fe³⁺
  (établie au §4). Fiole : V_A = 20,0 mL à c_A = 0,050 mol/L →
  n_A = 1,00 mmol. Burette : c_B = 0,020 mol/L → V_E = 10,0 mL, atteint
  exactement par le pas de 0,5 mL du curseur (V ∈ [0 ; 16]). En mmol :
  versé = 0,020·V (pas de 0,01), restant = 1,00 − 0,10·V (pas de 0,05),
  excès = 0,020·(V − 10) — tout exact à 2 décimales à chaque cran.
  Graphe : V ∈ [0 ; 16,8], n ∈ [0 ; 1,12] mmol, zone x px 210–628.
- **Exercices** (hand-checked, machine-checked via the page's own
  corrigés) : ex 04 Cr₂O₇²⁻ + 14 H⁺ + 6 e⁻ = 2 Cr³⁺ + 7 H₂O (charges
  +12/+6 → 6 e⁻) · ex 08 charges +24 = +24 · ex 09 n(Fe) = 11,2/56 =
  0,20 mol, x_max = 0,10, m(Cu) = 6,35 g, m(Fe) perdue = 5,6 g · ex 11
  Bétadine : 0,10 × 0,0130 = 1,3·10⁻³ → ÷2 → 6,5·10⁻⁴ mol →
  6,5·10⁻² mol/L · ex 12 1,6·10⁻³ → ÷5 → 3,2·10⁻⁴ → V_E = 8,0 mL ·
  ex 13 éthylotest : ×2/×3, simplification 16 H⁺ / 11 H₂O, charges
  +12/+12 · ex 14 vitamine C : 2,5·10⁻³ × 0,0080 = 2,0·10⁻⁵ mol (1:1),
  ×5 ×176 → 17,6 mg ≈ 18 mg/100 mL, l'étiquette dit vrai · bac A.2
  2 MnO₄⁻ + 6 H⁺ + 5 H₂O₂ (charges +4/+4) · bac B : sans dilution
  V_E ≈ 180 mL ; 0,020 × 0,0080 = 1,6·10⁻⁴ → ×5/2 → 4,0·10⁻⁴ mol →
  0,040 mol/L → flacon 0,40 mol/L vs 0,89 annoncés.

## Section structure

| id | Sommaire label | Contents |
|---|---|---|
| `s1` | 1. Un clou dans le bleu | hook prose (le TP du clou ; rouille, pomme, pile, éthylotest) · lien arrière composition · static figure (bécher + clou, état initial du widget phare) — no widget, no definition |
| `s2` | 2. Le transfert d'électrons | **widget redox-transfert** · POURQUOI ? (le bleu, c'était les ions) · DÉFINITION (oxydant/réducteur/oxydation/réduction) · DÉFINITION (couple, demi-équation) · vitrine --grande (Ox + n e⁻ = Red) · MÉTHODE (qui est oxydé, qui est réduit) · EXEMPLE RÉSOLU (la lame de zinc) · À RETENIR · **quiz s2** (3 q.) |
| `s3` | 3. Les demi-équations | hook · **widget demi-jeu** (4 manches) · MÉTHODE (élément → O → H → charges) · EXEMPLE RÉSOLU (MnO₄⁻/Mn²⁺) · tableau (les couples à connaître) · prose (Fe dans deux couples : un rôle, pas une étiquette) · **quiz s3** (3 q.) |
| `s4` | 4. L'équation d'oxydoréduction | hook (pas de stock d'électrons libres) · **widget redox-equation** · MÉTHODE (établir l'équation) · EXEMPLE RÉSOLU (MnO₄⁻ + 5 Fe²⁺ — l'équation du §5) · **quiz s4** (3 q.) |
| `s5` | 5. Le titrage colorimétrique | hook (l'anti-mousse, la mission de chimiste) · **widget titrage** · DÉFINITION (titrage, équivalence) · POURQUOI ? (couleur = changement de limitant) · PROPRIÉTÉ (relation à l'équivalence, lien avancement) · MÉTHODE (exploiter un titrage) · EXEMPLE RÉSOLU (les nombres du widget) · À RETENIR · **quiz s5** (4 q.) |
| `pieges` | Les pièges classiques | 5 pièges (vocabulaire croisé · e⁻ dans l'équation finale · additionner sans égaliser · le réflexe 1 pour 1 · titrage vs étalonnage) |
| `essentiel` | L'essentiel en 5 lignes | COUPLE · DEMI-ÉQUATION · ÉQUATION · ÉQUIVALENCE · RELATION |
| `ex` | Exercices — 15 corrigés | course order : vocabulaire 01 · oxydé/réduit 02 · demi-équations simples 03 · milieu acide 04 · lire une équation 05 · établir 06 · le graphique rejoué 07 · avec H⁺/H₂O 08 · le clou quantitatif 09 · principe du titrage 10 · la Bétadine 11 · prévoir V_E 12 · l'éthylotest 13 · problème (vitamine C) 14 · **VERS LE BAC** (ex 15, `#bac`, CALCULATRICE UTILE) |

Niveau distribution : n1 = 01, 02, 03, 10 · n2 = 04, 05, 06, 07, 08, 09,
11, 12 · n3 = 13, 14.

### Components introduced by this chapter

- **`assets/js/widgets/redox-transfert.js`** exports `texteIon(parent,
  formule, charge, attrs)` — SVG ion text: subscripts via the shared
  `texteChimie`, then the charge as a raised smaller tspan (dy −5, or −9
  after a subscript). Kept chapter-local (imported by titrage.js) rather
  than added to nabla-graph.js **to protect the other pages' JS budgets**
  (dérivation sits at 49,8 KB — shared-helper growth would tip it over).
- **chapitre.css** (end-of-file banner « Oxydoréduction
  (physique-chimie) ») : `.rdx-electrons` (trait accent du flux
  d'électrons), `.rdx-demi` / `.rdx-stepper` / `.rdx-mult` (rangée
  demi-équation + multiplicateur du widget d'équilibrage), and
  line-height 0 guards for `sup`/`sub` in `.lecture-formule`,
  `.avc-tableau`, `.feuille-btn`, `.quiz-reponse`, `.widget-note`,
  `.widget-legende` (ion exponents in readouts). Everything else reuses
  the existing vocabulary: `.dil-verre`/`.dil-liquide` (bécher, burette,
  fiole — seule l'opacité varie), `.avc-barre-reactif` (clou) /
  `.avc-barre-produit` (dépôt), `.g-courbe`/`.g-courbe-derivee` (droites
  du titrage), `.g-guide(-accent)`, `.pt-point`/`.pt-fixe--surface`,
  `.avc-nom`/`.avc-candidat`/`.etl-valeur`, `.vec-pointe--accent`,
  quiz/exercice classes. Colours/strokes from tokens only. CSS changed →
  `?v=16` bumped to `?v=17` on every served page in the same commit.

## Widget instances

Shared engineering standards are in CLAUDE.md; doctrine in
`.claude/skills/nabla-topic/references/interactive-patterns.md`.

### 1. `redox-transfert` — « Fais circuler les électrons » (flagship, §2)

Module `assets/js/widgets/redox-transfert.js`, instance
`#widget-transfert`, `data-n0="0.1" data-x-max="0.1" data-x-init="0"`.

- **Archetype B** (native slider, keyboard/touch free). Slider = the
  avancement x, min 0, max 0,10 = x_max, step 0,01 — the guard against
  negative quantities is the slider range itself (house convention).
- **SVG (640 × 330)**: static bécher + clou; dynamic liquid opacity
  (0,08 + 0,64 × ratio — le bleu EST les Cu²⁺), deposit growing from the
  nail tip, ion labels cross-fading (Cu²⁺ out, Fe²⁺ accent in), electron
  arrow + « e⁻ » label shown only while 0 < x < x_max. Static décor
  built once; `rendre()` only sets attributes/textContent,
  rAF-coalesced.
- **Readouts**: two static demi-équation lines with one live span each
  (« le clou a cédé … / les ions ont capté … » — the equality of the two
  counters is the chapter's shown-never-asserted invariant); chips
  n(Cu²⁺) restant / n(Fe²⁺) formé (static shells, live spans); state
  chip (aria-live) accent « x = 0 — la solution est bleue » / neutral
  « le transfert est en cours — le bleu pâlit » / bad « plus un ion
  Cu²⁺ — la réaction s'arrête ».
- **Captions**: three static `.widget-legende` paragraphs
  (début/cours/fin) toggled by `hidden` in one aria-live wrapper; the
  fin caption does the honest-chemistry aside (Fe²⁺ teinte vert pâle).
- **Reset** (header) → x = 0. Keyboard: native slider (±0,01/cran),
  French `aria-valuetext` announcing x and the remaining Cu²⁺.

### 2. `demi-jeu` — « Trouve la bonne demi-équation » (§3, game)

Module `assets/js/widgets/stoechio-jeu.js` (shared rounds engine —
**unchanged**), instance `data-widget="stoechio-jeu" data-nom="demi-jeu"
data-progression="COUPLE" data-suivant="Couple suivant"`. Archetype D:
per-round static groups (`.js-manche` = énoncé + 3 KaTeX buttons),
static per-round explanations (KaTeX renders at load), answers
`[2, 1, 3, 2]` in the JSON block. No SVG — the point is training the
eye on conservation checks (atomes, puis charges). Flow: wrong → mark +
disable + tailored relance (« compte les atomes… puis les charges »),
retry; right → explanation + « Couple suivant (i/4) ▸ »; end →
« Terminé : x/4 du premier coup » + « ↺ recommencer ». Progress chip
« COUPLE 1/4 ». Keyboard/touch free (buttons only).

### 3. `redox-equation` — « Fais les comptes d'électrons » (§4)

Module `assets/js/widgets/redox-equation.js`, instance
`#widget-equation`, `data-e-ox="3" data-e-red="2" data-m-max="6"`.

- **Controls**: two − / + stepper rows (real `<button>`s — keyboard
  free), multiplier displayed in accent mono (`.rdx-mult`, aria-live),
  buttons disabled at bounds (1 and 6). The demi-équation lines are
  static HTML (sub/sup), only the multiplier is live.
- **Readouts**: chips « e⁻ cédés : m₁ × 3 = … » / « e⁻ captés :
  m₂ × 2 = … » (static shells, one composed live span each — audit
  gap-2 convention); state chip (aria-live) bad « 9 e⁻ cédés ≠ 8 e⁻
  captés » / good « 6 e⁻ cédés = 6 e⁻ captés — ils s'annulent ».
- **Results**: three static blocks toggled by `hidden` in one aria-live
  wrapper (KaTeX-safe): attente (hint), accord minimal (2 ; 3) → the
  equation vitrine + « plus un seul électron visible », accord double
  (4 ; 6) → doubled vitrine + « garde les plus petits entiers ».
  Matching is exact integer arithmetic (3m₁ === 2m₂); minimal =
  (e_red/g ; e_ox/g) via gcd.
- **Reset** (header) → (1 ; 1).

### 4. `titrage` — « Verse et guette la couleur » (§5)

Module `assets/js/widgets/titrage.js`, instance `#widget-titrage`,
`data-ca="0.05" data-va="20" data-cb="0.02" data-coef="5"
data-v-max="16" data-v-init="0"` (V_E computed = 10,0 mL). Imports
`texteIon` from redox-transfert.js.

- **Archetype B**, one slider (V versé, step 0,5 mL — lands exactly on
  V_E). SVG (640 × 360): left, the glassware — burette (level drops
  with V, fixed opacity 0,55) over erlenmeyer whose liquid opacity is
  0,07 up to AND AT the équivalence, then 0,14 + 0,66 × excès/excès_max
  beyond (honest chemistry: at exact équivalence nothing is in excess;
  the persistent tint appears at the first step beyond, and the captions
  narrate exactly that). Right, the n(V) graph.
- **Progressive trace**: the two lines (Fe²⁺ restant, craie ; MnO₄⁻
  dans la fiole, accent) are drawn only on [0 ; V] — the student
  discovers the kink by pouring; at V = 0 the graph holds only the two
  current-position dots. The équivalence marker (muted dashed guide +
  `pt-point` + « équivalence : 10,0 mL ») and the accent line label
  (« MnO₄⁻ dans la fiole ») are revealed once reached/passed. Current V
  carried by an accent dashed guide + dots on both lines.
- **Readouts**: chips versé (mmol) / restant (mmol) (static shells,
  live spans); state chip (aria-live) accent « V = 0 » / neutral
  « MnO₄⁻ limitant — son violet disparaît aussitôt » / good
  « équivalence — les deux réactifs épuisés » / bad « Fe²⁺ épuisé — le
  violet s'installe » ; one fully JS-composed formula line per regime
  (innerHTML with sub/sup — repeated live values, audit gap-2). Four
  static captions (début/avant/équivalence/après) toggled in one
  aria-live wrapper.
- **Reset** (header) → V = 0. Keyboard: native slider; `aria-valuetext`
  gives only the poured volume (never V_E — finding it is the game).

## Quiz « Teste-toi » (reuses assets/js/quiz.js)

Four quizzes (s2/s3/s4/s5), 13 questions (3+3+3+4 — the 4-question quiz
on §5, the chapter's bac-critical section), `data-bonne` spread 5/4/4
over the three positions. Every distractor is a piège from the pièges
section: céder/capter inversés, « l'oxydant s'oxyde » (vocabulaire
croisé), électrons du mauvais côté ou comptés sur le mauvais exposant
(Fe³⁺/Fe²⁺ → 1 e⁻), O₂ pour équilibrer les oxygènes, électrons laissés
dans l'équation finale, addition sans égaliser, le réflexe « 1 pour 1 »
à l'équivalence (×5 vs ÷5), le titré cru limitant avant l'équivalence.

## Analytics (Plausible, throttled ≈ 1 event / interaction session)

| Event | Props | Fired |
|---|---|---|
| `widget_interact` | `widget: redox-transfert \| demi-jeu \| redox-equation \| titrage \| quiz-s2 \| quiz-s3 \| quiz-s4 \| quiz-s5`, `chapitre: redox` | first interaction, then ≤ 1 / 30 s per key |
| `corrige_open` | `exercice: 01 … 14`, `chapitre: redox` | when a corrigé is opened |
| `bac_open` | — | when the Vers le Bac corrigé is opened |

## Review flags for Victor

Everything on this page is new authorship in your voice — no design mock,
no pre-existing copy, and **no outline validation before building** (the
session ran autonomously). Please read as author. Specific decisions:

1. **Chapter choice.** PROGRAMME.md left one Première maths chapter
   (statistiques) explicitly blocked on verifying the 2026 annexe — not
   accessible from this sandbox — so I built the next physique-chimie
   chapter instead: the Thème 1 continuation, whose 2019 scope is fixed.
   Title from your PROGRAMME row, slug `oxydoreduction-titrages`,
   analytics key `redox` (short, house convention).
2. **The whole chapter design is mine**: le clou dans le bleu as hook and
   flagship, « les couleurs trahissent les électrons » as running story,
   the twin electron counters as the shown invariant, the demi-équation
   game gradation, the multiplier-steppers widget, the titration with
   progressive trace, and « le changement de couleur est le changement
   de réactif limitant rendu visible » as the §5 thesis. Check
   especially the game distractors and the pièges wording.
3. **Demi-équations written with = and taught Ox + n e⁻ = Red**, but in
   §2 the two half-equations appear with → in the *widget readouts*
   (« Fe → Fe²⁺ + 2 e⁻ ») because there they narrate a reaction running
   in one real direction; the = convention is introduced with the couple
   definition and used from §3 on (méthode step 1 writes the oxidation
   as Red₁ = Ox₁ + n₁ e⁻). Flag if you'd rather one symbol everywhere.
4. **Milieu acide only** (H⁺, not H₃O⁺): the programme and manuals write
   demi-équations with H⁺ in Première ; H₃O⁺ never appears on the page.
5. **Colour semantics vs tokens**: the real colours (bleu du Cu²⁺,
   violet du MnO₄⁻, brun du I₂) are all rendered as the accent tint with
   varying opacity — no hardcoded colours anywhere (tokens rule). The
   prose names the real colours; the drawings stay in-system (precedent:
   menthe verte rendered accent in the composition chapter). Veto if you
   want a real violet — it would need a new token.
6. **Titrage honesty at V_E**: at exactly V = 10,0 mL the flask shows NO
   persistent tint (nothing is in excess at équivalence) — the tint
   appears at 10,5. The equivalence caption + the après caption carry
   the « première goutte qui tient » practical criterion. Alternative
   (tint the flask AT V_E) felt chemically wrong; tell me if you'd
   rather match the TP feel over the theory.
7. **The équivalence marker and V_E label are hidden until the student
   reaches V_E**, and the graph traces progressively — the challenge
   « trouve le volume où la teinte bascule » would be dead on arrival
   with the full curve visible. aria-valuetext also withholds V_E.
8. **The MnO₄⁻-excess line is visually small** (0,12 mmol max vs the
   1,00 mmol axis) — intrinsic to the 5:1 stoichiometry with a dilute
   titrant. The kink + colour flip + chips carry the message; I kept the
   honest scale rather than distorting it.
9. **stoechio-jeu.js untouched** (third instance via the data-attributes
   generalisation from the composition chapter); regression-tested on
   the avancement page (MÉLANGE 1/4, flow intact, no console errors).
10. **`texteIon` lives in redox-transfert.js, not nabla-graph.js** — a
    shared-helper addition would count against every chapter's JS budget
    and dérivation sits at 49,8/50 KB. If you prefer it in the shared
    helper anyway, dérivation needs a budget pass first.
11. **Exercise contexts are all real**: gravure des circuits au
    Fe³⁺ (ex 05), sapin d'argent (ex 06), éthylotest au dichromate
    (ex 04/13 — orange → vert), Bétadine titrée au thiosulfate (ex 11 —
    the S₄O₆²⁻ couple is beyond the usual list, so the equation is
    GIVEN, only exploited), vitamine C au diiode avec empois d'amidon
    (ex 14, étiquette 18 mg/100 mL vérifiée exactement), eau oxygénée
    qui se décompose (bac — étiquette 0,89 mol/L vs 0,40 mesuré,
    l'écart est le message). Ex 13 (éthylotest) is heavy for Première:
    both demi-équations are given/recalled and it's flagged niveau 3 —
    cut it to a lighter combine if you prefer.
12. **Ex 09 gives M(Fe) = 56 g·mol⁻¹** (usual rounded table value) so
    the clou numbers land clean; m(Cu) = 6,35 g kept at 3 significant
    figures (0,10 × 63,5 exact).
13. **JS budget: 42,1 KB** first-party unminified on this page (ceiling
    50 KB), measured with `wc -c` over the ten modules the page loads.
14. **Verified in a real browser** (Playwright + Chromium in the build
    sandbox): 80 behavioural checks pass — transfert (readouts,
    compteurs, dépôt, opacité, flux, chips, légendes, aria, reset),
    demi-jeu full flow (relance, désactivation, 4 manches, score 3/4,
    recommencer), équation (accord minimal/double, bornes, reset),
    titrage (avant/équivalence/après, marqueur révélé, trace
    progressive, teinte, reset), quiz flow + score, corrigés + bac
    toggle, scroll-spy (aria-current), theme toggle, all internal links
    (200), 375 px without horizontal overflow, touch taps in a mobile
    emulated context with reduced motion, and a regression pass on the
    avancement page. KaTeX served locally (CDN blocked in the sandbox):
    380+ formulas, 0 errors. Screenshots of every widget in both themes
    at 1280 px and full-page at 375 px. **A live pass on the real site
    (CDN KaTeX, Lighthouse, real touch) remains on your checklist.**
15. **Registration**: homepage card CHAPITRE 03 inserted under
    « Constitution et transformations de la matière » (no « bientôt »
    card existed for it), following physique-chimie cards renumbered
    04/05/06 (mouvement, énergie mécanique, ondes — pages untouched);
    the avancement footer now links here, and this page's footer links
    on to « Les ondes mécaniques » (keeping your study-order chain
    unbroken: composition → avancement → oxydoréduction → ondes →
    mouvement → énergie). Sitemap lastmod 2026-07-19 (accueil,
    avancement, this page) ; search index entry added ; PROGRAMME.md row
    ✅ and bilan 6/10. « mis à jour juillet 2026 » hand-maintained.
