# Chapitre — L'énergie mécanique (Première · Spé Physique-Chimie)

Spec of this chapter's content structure, widgets and configuration.
Fifth physique-chimie chapter of the site, first of the thème 3
« L'énergie : conversions et transferts » (l'énergie électrique remains
to do). No Claude Design mock exists for it: the page transposes the
dérivation design system (`design-reference/`, `assets/css/*`) to
physics content, reusing every block component and widget convention,
following the `nabla-topic` skill (`.claude/skills/nabla-topic/`). Read
this file in full before any later work on the chapter; keep it updated
when behaviour changes.

> **Built without Victor in the loop** (autonomous session): the outline
> below was NOT validated before building — read the whole page as
> author, starting with the review flags at the bottom.

## Programme scope (BO spécial n°1, 22-01-2019 — from PROGRAMME.md)

« Aspects énergétiques des phénomènes mécaniques » (thème « L'énergie :
conversions et transferts ») : énergie cinétique d'un système modélisé
par un point matériel ; travail d'une force constante
W_AB(F⃗) = F⃗·AB⃗ ; théorème de l'énergie cinétique (admis — la
démonstration via la 2ᵉ loi est en Terminale, dit explicitement dans la
PROPRIÉTÉ du §4) ; travail du poids (indépendance du chemin), travail
des frottements d'intensité constante sur trajet rectiligne (−f·L) ;
forces conservatives / non conservatives ; énergie potentielle de
pesanteur (champ uniforme, référence choisie) ; énergie mécanique,
conservation et non-conservation, ΔEm = W(f⃗nc). Prérequis mobilisés et
rappelés : Ec = ½mv² (croisée au collège, re-définie proprement au §2),
le produit scalaire (chapitre de maths, lié au §3), le bilan des forces
et le rôle de la masse (chapitre mouvement). Capacité numérique Python
(tracer Ec/Epp/Em au cours d'un mouvement) : hors format Nabla — le
widget rampe EST cette représentation, en interactif ; capacité
expérimentale (pointage vidéo) non simulée. The official BO text was
not reachable from this sandbox (network policy) — scope taken from
PROGRAMME.md's verified row; see flag 2.

## Purpose & narrative through-line

Replace the static PDF fiche with a page where the student *performs*
the chapter's one big gesture — moving a system along its path and
watching the energy accounts trade, then locating the leak — before any
formal definition:

1. **Concrete hook** (§1) — la grande rampe du skatepark (3,20 m) : le
   pote se laisse glisser sans pomper. Trois observations = tout le
   chapitre : l'échange hauteur ↔ vitesse, le plafond du point de
   départ, la fuite qui finit par l'arrêter. Static figure = the
   flagship widget's initial frame (rampe + compte à barres, tout dans
   Epp). Rappel collège : Ec = ½mv² (vitrine), qui plante la question
   du carré (payoff §4).
2. **Manipulation, then definitions** (§2) — the **energie-rampe**
   widget in mode « libre » : the slider walks the skater along the
   half-pipe, three bars (Ec, Epp, Em) update live ; the payoff caption
   states the sum never moves. Only after the gesture come the three
   DÉFINITIONS (Ec, Epp with the chosen reference, Em), the central
   vitrine Em = Ec + Epp, the méthode and the exemple (1 600 J at every
   checkpoint).
3. **Le travail** (§3) — the **energie-travail** widget : one force
   (40 N), one displacement (5,0 m), one angle slider — the signed
   gauge makes moteur/nul/résistant visible. DÉFINITION (W = F·AB·cosθ,
   produit scalaire cross-linked to the maths chapter), PROPRIÉTÉ (le
   poids se moque du chemin — mg(z_A − z_B) — vs frottements −f·L),
   MÉTHODE, EXEMPLE (la luge tirée).
4. **Le théorème** (§4) — the **energie-freinage** widget : braking
   distance drawn to scale, d = Ec/f ; double the speed, quadruple the
   distance — the §1 question about v² answered on the road. PROPRIÉTÉ
   (ΔEc = ΣW), POURQUOI (le tarif au mètre du frein), MÉTHODE, EXEMPLE
   (le chariot poussé : 150 J → 10 m/s).
5. **Conservation et fuite** (§5) — the same **energie-rampe** module
   in mode « frottements » : one button per traversée, Em halves each
   crossing (1 600 → 800 → 400 → 200 → 100 J), the dissipated part
   piles up in barres éteintes against the repère. DÉFINITION
   (conservative / non conservative), PROPRIÉTÉ (conservation ssi ;
   ΔEm = W_nc, dans les deux sens — un câble peut regonfler Em),
   MÉTHODE (le bilan), EXEMPLE (le toboggan : −550 J), then the
   **energie-jeu** game (four energy audits — the bac skill) and quiz.
6. **Consolidation** — 5 pièges, l'essentiel en 5 lignes, 15 exercices
   corrigés (problème 14 = le grand huit), Vers le Bac (Partie A le
   skatepark chiffré, Partie B la luge — remonter à f par ΔEm).

One story runs through: **la rampe du skatepark** (hook §1, flagship §2,
retour §5, quiz s2, bac A). The supporting cast returns at fixed posts:
la sécurité routière (§4, ex 08 — continuité avec le crash-test du
chapitre mouvement), la luge/la neige (§3 exemple, ex 06, bac B), le
toboggan (§5 exemple, ex 10), la balle qui rebondit (jeu ③, ex 12,
quiz s5), le grand huit (ex 14).

## Reference data & view windows (all displayed numbers exact)

No `FONCTIONS` entry (the ramp profile is module-local; nothing here is
a maths curve to differentiate).

- **La rampe** (§1 figure, both energie-rampe instances, bac A) :
  profile z(x) = (h/2)·(1 + cos(πx/4)), x ∈ [0 ; 8] m, h = 3,20 m ;
  m = 50 kg (skateur + planche), g = 10 N/kg → **Em₀ = 1 600 J**,
  v_creux = 8,0 m/s (√64 exact). Slider index k = 0…48, x = k/6 :
  exact stops at k = 0/48 (z = 3,20 ; Epp = 1 600), k = 8/40 (z = 2,40 ;
  Epp = 1 200 ; **v = 4,0 exact**), k = 12/36 (z = 1,60 ; **Ec = Epp =
  800** — mi-hauteur moitié-moitié), k = 16/32 (z = 0,80 ; Ec = 1 200),
  k = 24 (z = 0 ; v = 8,0 exact). Intermediate stops display honest ≈
  (z at 2 dec, E at unit, v at 1 dec — the exactA helper picks =/≈).
  The sum Ec + Epp is exact by construction even where the parts are ≈.
  View: SVG 640×340, square scale (73,56 px/m), x ∈ [−0,35 ; 8,35],
  ground at yPx = 299,5.
- **Frottements (mode « frottements »)** : Em halves at each crossing —
  demi-tours at z = 3,20 / 1,60 / 0,80 / 0,40 / 0,20 m (sides
  alternate ; x from z by inverting the profile), Em = 1 600 / 800 /
  400 / 200 / 100 J, all exact. Capped at 4 traversées (button then
  reads « il s'endort au fond… »). The « half per crossing » ratio is
  engineered (see flag 6).
- **Travail** (§3) : F = 40 N, AB = 5,0 m → W = 200·cosθ J. Presets
  0/60/90/120/180° exact (+200/+100/0/−100/−200) ; free slider (5°
  steps) shows ≈ with cos at 2 dec. Gauge 1 px/J (−200 → +200).
  cos(90°) snapped to exact 0 (flottant 6e-17).
- **Freinage** (§4) : m = 1 000 kg, f = 5 000 N → d = v²/10. Slider
  v = 10/15/20/25/30 m/s → 36/54/72/90/108 km/h (×3,6 exact) et
  d = 10/22,5/40/62,5/90 m, Ec = 50 000/112 500/200 000/312 500/
  450 000 J — all exact. Scale 5,4 px/m (90 m → 486 px).
- **Exercices** : 18/3,6 = 5,0 ; ½·80·25 = 1 000 J (ex 01) · 24 J/132 J
  (ex 02) · 1 000/500/0 J (ex 03) · ±150 kJ (ex 05) · −2 000/−4 800 J
  (ex 06) · 150 J → v = 10 m/s ; m ×4 → v/2 (ex 07) · 40/10 m (ex 08) ·
  25 J → 10 m/s (ex 09) · √64 = 8,0 (ex 10) · 27/12/−15 kJ (ex 11) ·
  1,2/0,72 J → 40 %, rebond suivant 0,72 m (ex 12) · 2,0 J → √20 ≈ 4,5
  (ex 13, la seule ≈ des corrigés avec √80 ≈ 8,9 de l'exemple §5 et
  √800 ≈ 28 de l'ex 14) · 200 kJ ; 190 < 200 ; 0,85·200 = 170 kJ →
  34 m < 38 m (ex 14) · bac : 1 600 J, 8,0 m/s, z = 2,40 m ; 24/4 kJ,
  −20 kJ, f = 100 N (all hand-checked).

## Section structure

| id | Sommaire label | Contents |
|---|---|---|
| `s1` | 1. La rampe du skatepark | hook prose (l'échange, le plafond, la fuite) · static figure (rampe + compte au départ) · vitrine Ec = ½mv² (rappel collège) — no widget, no new formal definition |
| `s2` | 2. Cinétique et potentielle | **widget energie-rampe (libre)** · POURQUOI ? (la comptabilité paresseuse) · DÉFINITION Ec · DÉFINITION Epp (référence) · DÉFINITION Em · vitrine --grande (Em = Ec + Epp) · MÉTHODE (faire les comptes) · EXEMPLE (le skate en chiffres) · À RETENIR · **quiz s2** (3 q.) |
| `s3` | 3. Le travail d'une force | hook (la force qui ne compte pas pour ce qu'elle pèse) · **widget energie-travail** · lien produit scalaire · DÉFINITION (W, moteur/résistant/nul) · PROPRIÉTÉ (poids vs frottements) · MÉTHODE · EXEMPLE (la luge tirée) · **quiz s3** (3 q.) |
| `s4` | 4. Le théorème de l'énergie cinétique | hook (le virement — vers quel compte ?) · **widget energie-freinage** · PROPRIÉTÉ (ΔEc = ΣW) · POURQUOI ? (le tarif au mètre) · MÉTHODE · EXEMPLE (le chariot poussé) · **quiz s4** (3 q.) |
| `s5` | 5. Conservation… et fuite | hook (le détail qui chiffonne) · **widget energie-rampe (frottements)** · DÉFINITION (conservative/non conservative) · PROPRIÉTÉ (conservation ; ΔEm = W_nc) · MÉTHODE (le bilan) · EXEMPLE (le toboggan) · À RETENIR · **jeu energie-jeu** (4 dossiers) · **quiz s5** (4 q.) |
| `pieges` | Les pièges classiques | 5 pièges (le carré oublié · la force intense qui ne travaille pas · « la vraie » Epp · « Em se conserve toujours » · « l'énergie perdue a disparu » / compter le poids deux fois) |
| `essentiel` | L'essentiel en 5 lignes | CINÉTIQUE · POTENTIELLE · TRAVAIL · LE THÉORÈME · MÉCANIQUE |
| `ex` | Exercices — 15 corrigés | course order : Ec 01-02 · Epp 02 · travail 03-04 · poids 05 · frottements 06 · théorème 07-08 · conservation 09-10 · non-conservation 11-12 · synthèse 13 · problème (le grand huit) 14 · **VERS LE BAC** (ex 15, `#bac`, CALCULATRICE UTILE) |

Niveau distribution : n1 = 01, 02, 03, 04 · n2 = 05, 06, 07, 08, 09,
10, 11, 12 · n3 = 13, 14.

### Components introduced by this chapter

- **chapitre.css** (end-of-file banner « Énergie mécanique
  (physique-chimie) ») : `.nrj-dissipe` only (the part of the cagnotte
  gone to heat — `--tick`, the unlit-level colour). Everything else
  reuses the existing vocabulary : `.g-courbe` (la rampe, craie),
  `.pt-halo/.pt-point` (le skateur), `.g-guide` (altitude, fantôme,
  repères), `.jauge-fond/-plein/-repere` (fonds de barres, jauge W,
  repère Em₀), `.avc-barre-reactif` (barres craie : Epp),
  `.avc-barre-produit` (barres accent : Ec), `.mvt-caisse` (la caisse
  tirée, la voiture), `.arc-angle` (l'angle θ), `.ond-mesure` (le
  crochet de d), `.g-tangente`/`.vec-pointe--accent` (la force, la
  trace de freinage), étiquettes `.avc-nom/.avc-candidat/.etl-valeur`,
  quiz classes for the game. CSS changed → `?v=11` bumped to `?v=12` on
  every page in the same commit.

## Widget instances

Shared engineering standards are in CLAUDE.md; doctrine in
`.claude/skills/nabla-topic/references/interactive-patterns.md`.

### 1. `energie-rampe` — « L'échange, mètre par mètre » (flagship, §2)

Module `assets/js/widgets/energie-rampe.js`, instance `#widget-rampe`,
`data-widget="energie-rampe" data-nom="rampe" data-mode="libre"
data-masse="50" data-g="10" data-hauteur="3.2"` — the module is
config-only reusable (another mass/height/gravity gives another exact
dataset).

- **Archetype B** (native slider, keyboard/touch free). Slider =
  position index k, min 0, max 48, step 1 → x = k/6 on the profile.
  Top SVG (640×340, square scale) : metre grid, ground axis, the ramp
  (craie), the skater (halo + accent point), a dashed vertical guide
  down to the ground with the live « z = 1,60 m » label (hidden below
  z < 0,18 m ; anchor flips near the right edge).
- **Bottom SVG « LE COMPTE ÉNERGIE » (640×210, `.graph-scinde`)** :
  three rows Ec / Epp / Em (mono labels with real subscripts via
  tspan), each with a full-length `jauge-fond` (420 px ↔ 1 600 J) ;
  Ec bar accent, Epp bar craie, and the **Em row is literally the
  stack Ec (accent) + Epp (craie)** — the sum reads on the drawing.
  Dashed `jauge-repere` at the 1 600 J mark.
- **Readouts** : composed mono line (`.js-ligne`) « z = 1,60 m : Epp =
  800 J · Ec = 800 J · v ≈ 5,7 m/s » with =/≈ per displayed value ;
  static chip « m = 50 kg · g = 10 N/kg » ; state chip (aria-live) —
  tout en potentielle (neutral) / tout en cinétique, v maximale
  (accent) / mi-hauteur : Ec = Epp (accent) / descente « Epp se vide
  dans Ec » / remontée « Ec se reverse dans Epp » (neutral).
- **Captions** (3 static HTML in an aria-live wrapper, in order
  début/cours/fin) : début (invitation) / cours (l'échange) / payoff
  once **≥ 4 different positions** visited (a `visites` Set) : the sum
  never moves, and it has a name. Reset clears the set.
- **« ▸ fais l'aller complet »** (`.js-rejouer`) : sweeps k 0 → 48 via
  `animerValeur` (2,6 s ; jumps to the end under reduced motion —
  the slider keeps the full manipulation). Slider input stops it.
  **Reset** (header) → k = 0, caption début.
- Keyboard : native slider arrows (un cran = 1/6 m), `aria-valuetext`
  « altitude z = 1,60 mètre ».

### 2. `energie-travail` — « Une force, un angle, un travail » (§3)

Module `assets/js/widgets/energie-travail.js`, instance
`#widget-travail`, `data-nom="travail" data-force="40"
data-deplacement="5"`.

- **Archetype B + segmented presets** (header `.segmente` : 0°, 60°
  init, 90°, 120°, 180° ; reset therefore moves to the pied,
  divergence rule 1). Slider θ min 0 max 180 step 5.
- SVG 640×372 (pixel space) : ground, crate (`.mvt-caisse`),
  displacement arrow A → B below the ground (craie, 80 px/m) with A/B
  marks and the mono note « AB = 5,0 m — la caisse va de A vers B » ;
  the **force arrow (accent, fixed length 128 px)** rotating around
  its anchor on the crate ; `arc-angle` + live « 60° » label ; signed
  **W gauge** at the bottom (1 px/J, zero centre, dashed zero mark,
  ticks −200…+200 J below, live value right).
- **Readouts** : composed line « W = F × AB × cos θ = 40 × 5,0 × 0,5 =
  +100 J » (cos exact at presets, ≈ 2 dec elsewhere ; negatives
  parenthesised ; true minus) ; static chip « F = 40 N · AB = 5,0 m » ;
  state chip moteur (`chip--good`) / résistant (`chip--bad`) / nul at
  90° (`chip--accent`) — the house good/bad semantics.
- **Captions** : début / cours / 90° special (le poids sur une route
  plate) / payoff once **both signs** have been visited (the signe du
  virement). Presets animate via `animerValeur`, `aria-pressed` true
  only on exact match (free slider deselects). **Reset** (pied) → 60°.

### 3. `energie-freinage` — « La distance de freinage, à l'échelle » (§4)

Module `assets/js/widgets/energie-freinage.js`, instance
`#widget-freinage`, `data-nom="freinage" data-masse="1000"
data-frein="5000"`.

- **Archetype B**. Slider v₀ = 10…30 m/s step 5. SVG 640×250 (pixel
  space, 5,4 px/m) : road, dashed brake-point guide « il freine ici »,
  ghost car outline at the brake point, the car (crate + cab + wheels,
  one `<g>` translated), the **accent skid trace** to scale, and the
  `ond-mesure` bracket with « d = 40 m ».
- **Readouts** : composed line « Ec = ½ × 1 000 × 20² = 200 000 J —
  d = Ec/f = 200 000/5 000 = 40 m » (thin-space thousands) ; static
  chip « m = 1 000 kg · f = 5 000 N » ; state chip — neutral at
  10/15/25, **accent at 20 and 30** (« 2 × plus vite → 4 × plus
  loin », « 3 × plus vite → 9 × plus loin »). Slider legend shows
  km/h + m/s.
- **Captions** : début / cours / payoff after **≥ 3 speeds** visited
  (d suit v², LE chiffre de la sécurité routière). **Reset** (header)
  → 10 m/s. Keyboard free (native slider), `aria-valuetext` in km/h +
  braking distance.

### 4. `energie-rampe` — « La cagnotte qui fuit » (§5, mode frottements)

Instance `#widget-frottements`, `data-nom="frottements"
data-mode="frottements"`, same module and drawing as the flagship.

- **Button-driven** (keyboard/touch free) : « ▸ traversée suivante »
  (`.js-traversee`, accent) animates the skater along the profile to
  the next demi-tour on the opposite side (`animerValeur` 0,9 s ;
  instant under reduced motion — a `fini` flag guards the
  synchronous-surFin case) ; bars and line update on arrival. A small
  craie dot marks each abandoned demi-tour. Capped at **4 traversées**
  (button disabled, label « il s'endort au fond… »).
- **Compte additions** : the Em stack shrinks ; the gap to the
  `jauge-repere` fills with `.nrj-dissipe` (barres éteintes) labelled
  « parti en chaleur → ».
- **Readouts** : line « traversée 2 : il ne remonte qu'à z = 0,80 m —
  Em = 400 J, 1 200 J déjà partis en chaleur » ; static chip « au
  départ : Em = 1 600 J » ; state chip `chip--bad` « la cagnotte
  fuit — moitié moins à chaque traversée » (neutral at n = 0).
- **Captions** : début / cours (la différence EST le travail des
  frottements) / payoff at **n ≥ 2** (la fuite est à sens unique).
  **Reset** (header) → n = 0, marks cleared.

### 5. `energie-jeu` — « L'auditeur de l'énergie » (§5, game)

Module `assets/js/widgets/stoechio-jeu.js` (shared rounds engine,
unchanged), instance `data-widget="stoechio-jeu" data-nom="energie-jeu"
data-progression="DOSSIER" data-suivant="Dossier suivant"`. Archetype
D : per-round static groups (`.js-manche` = one hand-authored SVG +
question + 3 buttons), static per-round explanations, answers
`[2, 1, 3, 2]` in the JSON block.

- Rounds graded : ① la pomme en chute libre → Em constante
  (distracteurs : « l'altitude baisse » / « la vitesse augmente » —
  the one-account-only errors) ② le parachutiste à vitesse constante →
  Em diminue, dissipée par l'air (distracteur clé : « constante — la
  vitesse ne change pas », piège 4) ③ la balle qui rebondit (2,0 →
  1,2 m) → 40 % partis en chaleur (distracteurs : conservation ; « le
  poids a volé la perte » — piège 5) ④ la cabine qui monte à vitesse
  constante → **Em augmente**, le câble paie (montre que la
  non-conservation joue dans les deux sens).
- Flow : wrong → mark + disable + tailored relance (« fais les
  comptes : que fait Ec ? que fait Epp ? »), retry ; right →
  explanation + « Dossier suivant (i/4) ▸ » ; end → « Terminé : x/4 du
  premier coup » + « ↺ recommencer ». Progress chip « DOSSIER 1/4 ».

## Quiz « Teste-toi » (reuses assets/js/quiz.js)

Four quizzes (s2/s3/s4/s5), 13 questions (3+3+3+4 — the 4-question
quiz on §5, the chapter's synthesis), `data-bonne` spread 4/5/4 over
the three positions. Every distractor is a piège from the pièges
section : « double vitesse, double énergie », le watt contre le joule,
la force intense qui travaillerait forcément, le travail du poids qui
dépendrait du chemin, la somme des forces égalée à des joules,
« vitesse constante donc Em constante », le poids qui « vole » de
l'énergie, compter le poids deux fois dans le bilan.

## Analytics (Plausible, throttled ≈ 1 event / interaction session)

| Event | Props | Fired |
|---|---|---|
| `widget_interact` | `widget: rampe \| travail \| freinage \| frottements \| energie-jeu \| quiz-s2 \| quiz-s3 \| quiz-s4 \| quiz-s5`, `chapitre: energie` | first interaction, then ≤ 1 / 30 s per key |
| `corrige_open` | `exercice: 01 … 14`, `chapitre: energie` | when a corrigé is opened |
| `bac_open` | — | when the Vers le Bac corrigé is opened |

The two `energie-rampe` instances report distinct `widget` props
(`data-nom`: `rampe` / `frottements`).

## Review flags for Victor

Everything on this page is new authorship in your voice — no design
mock, no pre-existing copy, and **no outline validation before
building** (the session ran autonomously). Please read as author.
Specific decisions:

1. **Chapter choice.** Your instruction was « pick one topic from the
   programme » ; of the twelve remaining physique-chimie chapters,
   this one had the homepage « bientôt » card AND the mouvement
   chapter's footer already announcing it — so it shipped as
   CHAPITRE 05. The bientôt card title was the official sub-part name
   (« Aspects énergétiques des phénomènes mécaniques ») ; the card now
   says « L'énergie mécanique », matching PROGRAMME.md and the
   mouvement footer. This page's footer announces « L'énergie
   électrique » (BIENTÔT) — the other thème-3 chapter ; a new bientôt
   card for it sits on the homepage (motif : un circuit stylisé).
2. **BO not fetched.** education.gouv.fr is unreachable from the
   sandbox ; the scope is PROGRAMME.md's row (verified 17-07-2026)
   plus my knowledge of the 2019 programme. Worth a glance at the
   official « capacités exigibles » when you have access — notably
   whether « établir » l'expression du travail du poids exige une
   dérivation sur la page (here it is *stated* in the PROPRIÉTÉ §3 and
   *used* everywhere ; ex 05.c shows the aller-retour nul) and the
   exact wording around forces conservatives.
3. **The whole chapter design is mine** : la rampe du skatepark as
   hook and running story, « le compte énergie » / « la cagnotte » as
   the money metaphor (réservoirs, virement, tarif au mètre, fuite),
   the Em row drawn as the literal stack Ec + Epp, the braking-distance
   widget as the théorème's payoff, the halving-ramp for §5, the
   auditeur game, le grand huit as problème 14. Check especially « la
   cagnotte » — it's the chapter's central vocabulary invention, used
   ~15 times ; if you prefer « le capital » or plain « Em », it's a
   find-and-replace.
4. **g = 10 N/kg everywhere**, stated in the §2 DÉFINITION (« 9,81,
   souvent arrondie à 10 »), in the ex-intro (« Sauf mention
   contraire, prends g = 10 N/kg ») and in each widget chip. This
   makes every displayed number exact. If you'd rather train 9,81
   somewhere, ex 02 or 05 are the natural spots.
5. **m = 50 kg for skateur + planche** — light for an adult, right for
   a 15-year-old ; chosen so Em₀ = 1 600 J and v_creux = 8,0 m/s
   exactly. The §1 story now has the rider on the board (initially the
   board rolled alone, but 3 kg would have given punchless numbers —
   flag if you prefer the riderless version with adjusted data).
6. **The « half per crossing » friction ratio is engineered.** For a
   straight-sided V-ramp with constant-intensity friction the turning
   heights DO form an exact geometric sequence ; for this cosine
   profile the constant ratio is an approximation, presented as a
   property of « cette rampe » (widget note). No friction intensity is
   ever displayed, so nothing on the page is falsifiable-wrong ; the
   bac B does the honest −f·L calculation on a straight slope. If you
   want full rigour, switching the §5 drawing to a V-profile makes the
   halving exact — say the word.
7. **Number-exactness policy** (mouvement flag 7 continued) : =/≈
   chosen per displayed value by the exactA helper everywhere ; the
   only ≈ in corrigés are √20 ≈ 4,5 (ex 13), √80 ≈ 8,9 (exemple §5)
   and √800 ≈ 28 (ex 14), each written with √ first. The Em bar value
   never shows ≈ (the sum is exact by construction).
8. **Ec presented as collège recall in §1** (vitrine before any
   DÉFINITION block) — mirrors the dérivation/suites precedent of a
   known formula in §1. The proper DÉFINITION with units happens in
   §2. Pedagogically deliberate ; flag if you'd rather keep §1
   formula-free.
9. **The game sits after the méthodes, at the end of §5** (same
   placement as mouvement's game) : it audits the whole chapter like a
   mini-bac ; manipulation-first is honoured by the four real widgets
   above it. Round ④ (Em qui AUGMENTE) goes slightly beyond the usual
   textbook framing but stays strictly within ΔEm = W_nc ; it
   forearms against « Em ne peut que baisser ».
10. **Cross-chapter links** : §3 links to the produit scalaire maths
    chapter (the only in-prose link) ; ex 12.d winks at suites
    (« suite géométrique de raison 0,6 ») ; ex 07.c and the §4
    PROPRIÉTÉ echo the mouvement chapter (masse modératrice, 2ᵉ loi en
    Terminale). Trim if too clever.
11. **Chip texts use plain « Ec », « Epp », « Em », « W » without
    KaTeX** (mono plain-text contexts — same policy as mouvement flag
    11) ; HTML subscripts appear in chap-savoir and SVG tspans ; KaTeX
    contexts always carry \(E_c\), \(E_{pp}\), \(E_m\).
12. **JS budget : 47,2 KB** first-party unminified on this page
    (ceiling 50) — measured with `wc -c` over the ten modules it loads
    (theme, sommaire, corrige, quiz, analytics, nabla-graph,
    stoechio-jeu, energie-rampe, energie-travail, energie-freinage).
13. **Verified in a real browser** (Playwright + local Chromium ; the
    sandbox blocks CDNs so KaTeX 0.16.11 was served from a local copy
    during tests) : 72 automated checks pass — rampe libre (exact and
    ≈ lines at 6 positions, mi-hauteur chip, Em bar constant, payoff
    ≥ 4 positions, aller complet, reset, keyboard arrow), frottements
    (the 4 traversée lines verbatim, button cap, dissipated bar,
    demi-tour marks, payoff, reset, animated and reduced-motion
    paths), travail (5 presets verbatim + chips + aria-pressed, free
    45° ≈ line, both-signs payoff, reset), freinage (all 5 speeds
    verbatim, ×9 chip, km/h readout, payoff, reset), full game flow
    (wrong → relance, 4 dossiers, 3/4 score, recommencer), quiz flow
    (mark-disable-retry, score), corrigé + bac toggles, KaTeX 308
    formulas 0 errors, zero console errors, no horizontal overflow at
    375 px, scroll-spy, touch tap, theme toggle both ways ; the onload
    snippet is byte-identical to the mouvement page's ; every internal
    link on the touched pages resolves ; data-bonne spread 4/5/4 ;
    structure counts (1 h1, 8 sections, 14+1 exercices, 13 questions,
    5 pièges, 5 essentiel, 9 sommaire links ×2). Screenshots of every
    widget in both themes at desktop + 375 px were reviewed by eye
    (two visual bugs found and fixed : a CSS comment that swallowed
    `.nrj-dissipe`, and colliding labels in the travail gauge). **Real
    devices, real CDN load, and Lighthouse remain on your checklist.**
14. **Cosmetic known-smalls** : à 180° la flèche de la force traverse
    la caisse (physiquement sensé — elle tire vers l'arrière — mais
    dessiné par-dessus la boîte) ; sur la rampe, l'étiquette
    « z = … m » frôle le guide pointillé à certaines positions ;
    pendant l'animation d'une traversée (§5) les barres restent figées
    jusqu'à l'arrivée (choix : Em entre deux demi-tours dépend de la
    longueur d'arc, pas de x — l'animer linéairement aurait été faux).
    Dis-moi si l'un des trois te gêne.
15. **« mis à jour juillet 2026 »** hand-maintained ; sitemap lastmod
    2026-07-17 (this page). Homepage motif = la demi-lune (craie) + le
    niveau Em en pointillé accent + le point skateur — echoes §1's
    figure. PROGRAMME.md row flipped to ✅ (bilan 5 en ligne · 11 à
    faire). The mouvement chapter's footer now links here.
