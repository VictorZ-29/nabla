# Chapitre — Le mouvement d'un système (Première · Spé Physique-Chimie)

Spec of this chapter's content structure, widgets and configuration.
Fourth physique-chimie chapter of the site, third of the thème 2
« Mouvement et interactions » (the first two of the thème are still to
do). No Claude Design mock exists for it: the page transposes the
dérivation design system (`design-reference/`, `assets/css/*`) to physics
content, reusing every block component and widget convention, following
the `nabla-topic` skill (`.claude/skills/nabla-topic/`). Read this file
in full before any later work on the chapter; keep it updated when
behaviour changes.

> **Built without Victor in the loop** (autonomous session): the outline
> below was NOT validated before building — read the whole page as
> author, starting with the review flags at the bottom.

## Programme scope (BO spécial n°1, 22-01-2019 — from PROGRAMME.md)

« Mouvement d'un système » (thème « Mouvement et interactions ») :
vecteur vitesse d'un point d'un système ; vecteur variation de vitesse
entre deux instants voisins ; **lien qualitatif** entre la somme des
forces appliquées et Δv⃗ (direction et sens — la relation complète
ΣF⃗ = m·a⃗ est en Terminale, dit explicitement dans la PROPRIÉTÉ du §4) ;
rôle de la masse (l'inertie). Prérequis de Seconde mobilisés et rappelés
en une ligne quand ils servent : référentiel, système réduit à un point,
trajectoire, v = d/Δt, principe d'inertie (relu en §4 comme le cas
ΣF⃗ = 0⃗ du lien). Capacité expérimentale (pointage vidéo /
chronophotographie) : nourrie par la lecture de chronophotographies dans
tous les widgets et les exercices 01, 08, 09, 13 ; capacité numérique
Python (représenter des vecteurs) : hors format Nabla — mention non
simulée, même traitement que le flag 14 du chapitre avancement. The
official BO text was not reachable from this sandbox (network policy) —
scope taken from PROGRAMME.md's verified row; see flag 2.

## Purpose & narrative through-line

Replace the static PDF fiche with a page where the student *performs*
the chapter's one big gesture — reading a chronophotography image by
image, building the velocity vector, then its variation, then aligning
the sum of forces on it — before any formal definition:

1. **Concrete hook** (§1) — le lancer franc filmé au ralenti avec le
   téléphone (240 i/s → une image gardée toutes les 0,20 s) : la
   chronophotographie. Static figure = the flagship widget's picture
   with the v⃗ arrow posed on M1 (mid-gesture, ondes precedent). Rappels
   de Seconde (référentiel, point, trajectoire, v = d/Δt) : §1 closes on
   « un compteur ne dit pas où tu vas — il faut des flèches ».
2. **Manipulation, then definition** (§2) — the **chrono-vecteurs**
   widget in mode « vitesse » : the slider picks an image, the arrow
   traces itself from the selected point to the next ; only after the
   gesture come the DÉFINITION (direction/sens/norme), the central
   vitrine v⃗ᵢ = M⃗ᵢMᵢ₊₁/Δt, the méthode and the exemple (6,5 m/s au
   départ, 2,5 m/s au sommet).
3. **La variation de vitesse** (§3) — same module, mode « delta » : two
   successive velocity arrows chained on the trajectory, and below
   « l'établi » that brings both back to a common origin — Δv⃗ is the
   accent arrow from tip to tip, and it turns out to be identical for
   every image : vertical, down, 2,0 m/s. The payoff caption plants the
   question (« quelque chose tire la balle vers le bas… »).
4. **Le lien avec les forces** (§4) — the **mouvement-forces** widget:
   three scenes (en l'air / sur la glace / au manège) ; in each, Δv⃗
   (solid accent) and ΣF⃗ (dashed accent) are drawn side by side and
   always aligned. PROPRIÉTÉ (the qualitative link + principe d'inertie
   as its ΣF⃗ = 0⃗ case), POURQUOI (Aristote vs Newton), MÉTHODE
   (l'enquête dans les deux sens), EXEMPLE (le palet et la balle).
5. **Le rôle de la masse** (§5) — the **mouvement-masse** widget: the
   same push (same force, same duration) on a 1/2/3 kg cart, forward or
   as a brake ; the ghost of v⃗ avant makes Δv⃗ visible, and it halves
   when the mass doubles. PROPRIÉTÉ (masse = inertie), MÉTHODE (the full
   bilan), EXEMPLE (la pétanque et le ping-pong, incl. pourquoi elles
   tombent ensemble), then the **mouvement-jeu** game (four
   chronophotographies to judge — the bac skill) and quiz.
6. **Consolidation** — 5 pièges, l'essentiel en 5 lignes, 15 exercices
   corrigés (problème 14 = le crash-test), Vers le Bac (Partie A le
   lancer franc chiffré, Partie B le rond-point sous le verglas).

One story runs through: **le lancer franc au basket** (hook §1, flagship
§2–§3, scène « en l'air » §4, exemples, exercices 02/06/07, bac A). The
supporting cast returns at fixed posts: le palet sur la glace (§4, ex
08), le rond-point/manège (§4, ex 03, ex 10, bac B), le caddie/chariot
(§5, ex 12), la sécurité routière (ex 14, quiz s5).

## Reference trajectory & datasets (all displayed numbers exact)

No `FONCTIONS` entry (chronophotographies are point lists, not curves —
module-local / figure-JSON data).

- **Le lancer franc** (§1 figure, both chrono-vecteurs instances, scène
  « en l'air », game round 3, bac A) : Δt = 0,20 s, positions
  Mᵢ = (0,5·i ; yᵢ) m with y = 0 ; 1,2 ; 2,0 ; 2,4 ; 2,4 ; 2,0 ; 1,2 ;
  0 — i.e. the exact projectile x = 2,5·t, y = 7·t − 5·t² (g = 10 m/s²,
  see flag 6) sampled every 0,20 s. Segment velocities: vₓ = 2,5
  constant, v_y = 6 ; 4 ; 2 ; 0 ; −2 ; −4 ; −6 → **Δv⃗ = (0 ; −2,0) m/s
  for every i**, the chapter's engine. Norms: v₀ = v₆ = 6,5 (exact,
  √(2,5²+6²) = 6,5) and v₃ = 2,5 (exact) ; intermediate norms are
  honest ≈ (4,7 and 3,2 — display policy flag 7).
- **Sur la glace** (§4) : 8 points, y = 1,3 m, x = 0,25 + 0,5·k →
  v = 2,5 m/s constant, Δv⃗ = 0⃗.
- **Au manège** (§4, game round 4) : circle centre (2,05 ; 1,3),
  R = 1,05 m, 8 points every 45°, sens horaire. Chord-difference vector
  points exactly at the centre by symmetry — no numbers displayed in
  this scene (flag 7).
- **Les chariots** (§5) : Δv = 3,0/m m/s → 3,0 / 1,5 / 1,0 for m = 1 /
  2 / 3 kg. Pousser: v 1,0 → 4,0 / 2,5 / 2,0 ; freiner: v 4,0 → 1,0 /
  2,5 / 3,0. All exact.
- **Exercices** : skateur 1,0 m et 1,5 m par 0,50 s → 2,0 et 3,0 m/s
  (ex 01) · 1,30/0,20 = 6,5 m/s = 23,4 km/h (ex 02) · 18/3,6 = 5,0 m/s
  (ex 03) · échelle 1 cm ↔ 2 m/s → 3,0 et 2,0 cm (ex 04) · 5−3 et 1−3
  (ex 05) · (4,0 ; ±1,0) → Δv⃗ = (0 ; −2,0), normes √17 ≈ 4,1 (ex 06) ·
  30,0 → 22,0 m/s, Δv = −8,0 (ex 11) · Δv 3,0 → 1,0 m/s (ex 12) · lob :
  positions (0;0)(1,0;0,9)(2,0;1,6)(3,0;2,1) par 0,50 s → v = (2,0;1,8)
  (2,0;1,4)(2,0;1,0), Δv⃗ = (0;−0,4) constant (ex 13) · 54/3,6 = 15 m/s
  (ex 14) · bac A : 6,5 m/s, flèche 3,25 cm à 1 cm ↔ 2 m/s,
  Δv⃗ = (0;−2,0) (all hand-checked).

## Section structure

| id | Sommaire label | Contents |
|---|---|---|
| `s1` | 1. Le lancer au ralenti | hook prose (le lancer franc filmé à 240 i/s, la chronophotographie) · static figure (the flagship's picture, v⃗ posed on M1) · rappels de Seconde · vitrine v = d/Δt — no widget, no new formal definition |
| `s2` | 2. Le vecteur vitesse | **widget chrono-vecteurs (mode vitesse)** · POURQUOI ? (une flèche, pas un nombre) · DÉFINITION (direction, sens, norme) · vitrine --grande (v⃗ᵢ = M⃗ᵢMᵢ₊₁/Δt) · MÉTHODE (tracer v⃗) · EXEMPLE RÉSOLU (le lancer en chiffres) · À RETENIR · **quiz s2** (3 q.) |
| `s3` | 3. La variation de vitesse | hook (le virage, le freinage — ce que ton corps sent) · **widget chrono-vecteurs (mode delta)** · DÉFINITION (Δv⃗ = v⃗ᵢ₊₁ − v⃗ᵢ) · MÉTHODE (construire Δv⃗) · EXEMPLE RÉSOLU (coordonnées) · **quiz s3** (3 q.) |
| `s4` | 4. Le lien avec les forces | hook (le poids, suspect n°1) · **widget mouvement-forces** (3 scènes) · PROPRIÉTÉ (le lien + principe d'inertie) · POURQUOI ? (Aristote vs Newton) · MÉTHODE (l'enquête) · EXEMPLE RÉSOLU (le palet et la balle) · À RETENIR · **quiz s4** (4 q.) |
| `s5` | 5. Le rôle de la masse | hook (le caddie vide/plein) · **widget mouvement-masse** · PROPRIÉTÉ (masse = inertie) · MÉTHODE (le bilan complet) · EXEMPLE RÉSOLU (pétanque et ping-pong) · **jeu mouvement-jeu** (4 chronophotos) · **quiz s5** (3 q.) |
| `pieges` | Les pièges classiques | 5 pièges (mouvement ⇒ force · vitesse nulle au sommet · « vitesse constante donc rien ne change » · la force centrifuge · aligner ΣF⃗ sur v⃗) |
| `essentiel` | L'essentiel en 5 lignes | VITESSE · VARIATION · LE LIEN · INERTIE · MASSE |
| `ex` | Exercices — 15 corrigés | course order : lire une chronophoto 01 · la norme de v⃗ 02 · caractériser v⃗ 03 · représenter à l'échelle 04 · construire Δv⃗ 05 · Δv⃗ en coordonnées 06 · la balle en cloche 07 · le palet 08 · l'enquête 09 · le rond-point 10 · le train qui freine 11 · le rôle de la masse 12 · la chronophoto complète 13 · problème (le crash-test) 14 · **VERS LE BAC** (ex 15, `#bac`, SANS CALCULATRICE) |

Niveau distribution : n1 = 01, 02, 03, 04 · n2 = 05, 06, 07, 08, 09,
10, 11, 12 · n3 = 13, 14.

### Components introduced by this chapter

- **chapitre.css** (end-of-file banner « Mouvement d'un système
  (physique-chimie) ») : `.mvt-caisse` only (the cart crate — chip
  fill, chalk stroke, same role split as the avancement bars).
  Everything else reuses the existing vocabulary : `.pt-craie` (the
  chronophoto dots), `.g-courbe`/`.vec-pointe` (craie vectors),
  `.g-tangente`/`.vec-pointe--accent` (accent vectors — Δv⃗, ΣF⃗ with a
  `stroke-dasharray` attribute for the force), `.etiquette-math` +
  `.etiquette-vec-fleche` (vector letters via `etiquetteVecteur`),
  `.avc-nom/.avc-candidat/.etl-valeur` (mono labels), `.g-guide`
  (rails, ghost, circle), `.pt-halo/.pt-point` (selection), `.segmente`
  (scenes), `.feuille-btn` (sens/masse), quiz classes for the game.
  CSS changed → `?v=10` bumped to `?v=11` on every page in the same
  commit.

## Widget instances

Shared engineering standards are in CLAUDE.md; doctrine in
`.claude/skills/nabla-topic/references/interactive-patterns.md`.

### 1. `chrono-vecteurs` — « La flèche du mouvement » (flagship, §2)

Module `assets/js/widgets/chrono-vecteurs.js`, instance
`#widget-vitesse`, `data-widget="chrono-vecteurs" data-nom="vitesse"
data-mode="vitesse"` ; trajectory in the figure's JSON block
(`{"dt": 0.2, "points": [[x, y] × 8]}`) — the module is config-only
reusable with another trajectory.

- **Archetype B** (native slider, keyboard/touch free). Slider =
  l'image i, min 0, max 6, step 1. The SVG (640 × 440) is a square
  frame (same px/m on both axes — vector geometry must not shear):
  view x ∈ [−0,5 ; 4,1], yMin = −0,55, yMax derived from the viewBox.
  Grid every metre, axis y = 0, the 8 chronophoto dots (`.pt-craie`)
  labelled M0…M7 (mono, below).
- The accent arrow (`creerVecteur`, g-tangente trait) goes from Mᵢ to
  Mᵢ₊₁ : **at this scale the displacement chord IS the velocity
  vector** (arrow length ∝ norm since Δt is fixed) — the note says so.
  Halo + accent point mark the selected Mᵢ ; the v⃗ letter
  (`etiquetteVecteur`, accent) floats on the outward side of the chord.
- **Readouts** : legend « image choisie : M<i> » (`.js-image`) ;
  composed mono line (`.js-ligne`) « de M0 à M1 : d = 1,30 m, donc
  v = d/Δt = 1,30/0,20 = 6,5 m/s » with =/≈ chosen per displayed value
  (flag 7) ; state chip (aria-live) « la balle monte — la flèche
  raccourcit » (neutral) / « autour du sommet — v horizontal, jamais
  nul » (accent, at i = 3) / « la balle retombe — la flèche s'allonge »
  (neutral).
- **Captions** (static HTML, aria-live wrapper) : début (invitation) /
  cours / sommet (i = 3 : la norme minimum est 2,5 m/s, pas zéro) / fin
  (i = 6 : the definition recited on the picture). Début returns on
  reset.
- **« ▸ rejoue le lancer »** (`.js-rejouer`) : steps i from 0 to 6 via
  `animerValeur` (≈ 0,48 s per image ; jumps to the end under reduced
  motion — the slider keeps the full manipulation). Slider input stops
  it. **Reset** (header) → i = 0, caption début.
- Keyboard : native slider arrows (une image par cran),
  `aria-valuetext` « image M2 — t = 0,40 seconde ».

### 2. `chrono-vecteurs` — « Deux flèches, et leur différence » (§3)

Instance `#widget-deltav`, `data-nom="deltav" data-mode="delta"`, same
JSON trajectory ; slider max 5 (needs segments i and i+1). Additions:

- **Top SVG** : the two successive chords drawn chained (v⃗ᵢ from Mᵢ
  ends exactly on Mᵢ₊₁ where v⃗ᵢ₊₁ starts — both craie), labels mono
  « avant »/« après » on the outward side, halo on the shared point.
- **Bottom SVG « L'ÉTABLI » (640 × 300, `.graph-scinde`)** : its own
  scale, 1 carreau (40 px) = 2 m/s, noted in the frame. Both vectors
  redrawn from a common origin (craie), labels at the shaft midpoints
  (avant above, après below) ; **Δv⃗ = the accent arrow from tip to
  tip**, its label (`etiquetteVecteur` « Δv », accent) to the right of
  the tips.
- **Readouts** : line « entre M2 et M4 : Δv = (0,0 ; −2,0) m/s — norme
  2,0 m/s » (composed, generic w.r.t. dataset) ; static chips « Δt =
  0,20 s » and « Δv : de la pointe de « avant » à la pointe de
  « après » » (accent).
- **Captions** : début / cours / payoff — the payoff appears once the
  student has visited **≥ 3 different images** (a `visites` Set) and
  says Δv⃗ never changes, planting §4. Reset clears the set.

### 3. `mouvement-forces` — « Trois scènes, une seule règle » (§4)

Module `assets/js/widgets/mouvement-forces.js`, instance
`#widget-forces`, `data-widget="mouvement-forces" data-nom="forces"`.
Scene data is module-local (three 8-point chronophotographies, same
Δt = 0,20 s).

- **Archetype B + segmented scenes** (header `.segmente` : « en l'air »
  init / « sur la glace » / « au manège » ; reset therefore moves to
  the pied, divergence rule 1). Slider = images window i (M i → M i+2),
  min 0, max 5, step 1.
- Same square frame as the flagship. Per scene décor (rebuilt on
  switch) : air — ground axis ; glace — guide line + mono note « la
  glace (frottements négligés) » ; manège — dashed guide circle,
  centre dot + label. Dots labelled M0…M7 (radially outward au manège).
- Drawn at every i : the two chained chords (craie) with
  « avant »/« après », halo on Mᵢ₊₁, then **Δv⃗ solid accent** at Mᵢ₊₁
  (chord-difference vector, same scale as the chords) and **ΣF⃗ dashed
  accent** alongside (perpendicular 14 px offset, its own length —
  only direction and sens are claimed, the note says so). Letters
  « Δv » and « ΣF » via `etiquetteVecteur` (accent). Sur la glace,
  Δv⃗ = 0⃗ : no accent arrows ; instead **P⃗ down and R⃗ up** (craie,
  ±7 px offsets) with letters, visibly cancelling.
- **Readouts are static HTML per scene** (`.js-stat-<scene>` toggled by
  `hidden` : one `lecture-formule` line, one accent chip, one caption —
  all inside aria-live wrappers). Δv⃗ is constant within each scene, so
  nothing numeric needs JS (KaTeX-safe captions).
- **« ▸ image par image »** (`.js-rejouer`) animation as above ;
  **reset** (pied) → scène « en l'air », i = 0.

### 4. `mouvement-masse` — « La même poussée, trois chariots » (§5)

Module `assets/js/widgets/mouvement-masse.js`, instance
`#widget-masse`, `data-widget="mouvement-masse" data-nom="masse"`.

- **Archetype C** (mode switch over fixed data — buttons only, keyboard
  free). Controls : sens (`.js-sens`, feuille-btn « pousser vers
  l'avant » init / « freiner ») and masse (`.js-masse`, « 1 kg » init /
  « 2 kg » / « 3 kg »), aria-pressed managed.
- **SVG (640 × 270, pixel-space)** : two rows AVANT / APRÈS (mono row
  titles, guide ground lines). The cart = m crates (`.mvt-caisse`,
  46 × 26 px) side by side, nose fixed ; label « m = 2 kg » under. La
  poussée = dashed accent arrow above (sens-dependent), label mono
  accent « la poussée — pendant 0,50 s ». v⃗ avant / v⃗ après = craie
  arrows (26 px per m/s) with mono values ; on the APRÈS row the
  **ghost of v⃗ avant** (dashed guide + end tick) stays, and **Δv⃗ =
  accent arrow between the two tips**, drawn 25 px above with dotted
  droplines, value in `.etl-valeur`.
- **Readouts** : line « même poussée, m = 2 kg : Δv = 1,5 m/s — la
  vitesse passe de 1,0 à 2,5 m/s » ; state chip good (« la poussée est
  dans le sens du mouvement — la vitesse augmente ») / bad (freinage).
- **Captions** : début / payoff — payoff after **≥ 2 different masses**
  tried, states the inverse proportionality and names l'inertie.
- **Reset** (header) → pousser, 1 kg, caption début.

### 5. `mouvement-jeu` — « L'inspecteur du mouvement » (§5, game)

Module `assets/js/widgets/stoechio-jeu.js` (shared rounds engine,
unchanged), instance `data-widget="stoechio-jeu"
data-nom="mouvement-jeu" data-progression="ENQUÊTE"
data-suivant="Enquête suivante"`. Archetype D : per-round static groups
(`.js-manche` = one hand-authored chronophoto SVG + question +
3 buttons), static per-round explanations, answers `[1, 3, 2, 3]` in
the JSON block.

- Rounds graded : ① ligne droite, espacements réguliers → ΣF⃗ nulle
  (distracteurs : « vers l'avant sinon il n'avancerait pas » —
  l'aristotélisme —, « vers l'arrière les frottements ») ② espacements
  croissants → ΣF⃗ vers l'avant (distracteur clé : « nulle — la
  trajectoire est une droite », confusion droite/uniforme) ③ la balle
  en cloche → Δv⃗ vertical vers le bas (distracteurs : le long de la
  trajectoire ; se retourne au sommet) ④ le manège → ΣF⃗ vers le centre
  (distracteurs : « nulle — vitesse constante », « la force
  centrifuge » — les pièges 3 et 4).
- Flow : wrong → mark + disable + tailored relance (« construis
  d'abord Δv… »), retry ; right → explanation + « Enquête suivante
  (i/4) ▸ » ; end → « Terminé : x/4 du premier coup » + « ↺
  recommencer ». Progress chip « ENQUÊTE 1/4 ». Keyboard/touch free
  (buttons only).

## Quiz « Teste-toi » (reuses assets/js/quiz.js)

Four quizzes (s2/s3/s4/s5), 13 questions (3+3+4+3 — the 4-question quiz
on §4, the chapter's core), `data-bonne` spread 4/5/4 over the three
positions. Every distractor is a piège from the pièges section : le
vecteur qui « pointe vers le sol », multiplier au lieu de diviser,
vitesse nulle au sommet, Δv⃗ « vers l'avant » dans un freinage, « il
bouge donc une force le pousse », la force centrifuge, « ΣF⃗ nulle au
sommet », masse = capacité à aller vite.

## Analytics (Plausible, throttled ≈ 1 event / interaction session)

| Event | Props | Fired |
|---|---|---|
| `widget_interact` | `widget: vitesse \| deltav \| forces \| masse \| mouvement-jeu \| quiz-s2 \| quiz-s3 \| quiz-s4 \| quiz-s5`, `chapitre: mouvement` | first interaction, then ≤ 1 / 30 s per key |
| `corrige_open` | `exercice: 01 … 14`, `chapitre: mouvement` | when a corrigé is opened |
| `bac_open` | — | when the Vers le Bac corrigé is opened |

The two `chrono-vecteurs` instances report distinct `widget` props
(`data-nom`: `vitesse` / `deltav`).

## Review flags for Victor

Everything on this page is new authorship in your voice — no design
mock, no pre-existing copy, and **no outline validation before
building** (the session ran autonomously). Please read as author.
Specific decisions:

1. **Chapter choice.** Your instruction was « pick one topic from the
   movement theme » ; of the three thème-2 chapters, this one had the
   homepage « bientôt » card, the ondes footer already announced it,
   and PROGRAMME.md flagged its title recadrage — so it shipped first,
   as CHAPITRE 04, retitled « Le mouvement d'un système » on the
   homepage card (the recadrage PROGRAMME.md called for : en Première
   c'est le lien ΣF⃗ ↔ Δv⃗, pas la 2ᵉ loi complète). « Interactions et
   champs » and « Les fluides au repos » remain to do. This page's
   footer announces « L'énergie mécanique » (BIENTÔT) — the PROGRAMME.md
   wording, not the homepage bientôt card's (« Aspects énergétiques des
   phénomènes mécaniques ») ; align whichever you prefer.
2. **BO not fetched.** education.gouv.fr is unreachable from the
   sandbox ; the scope is PROGRAMME.md's row (verified 17-07-2026) plus
   my knowledge of the 2019 programme. Worth a glance at the official
   « capacités exigibles » wording when you have access — especially
   whether « relier qualitativement » covers the inverse direction
   (forces → mouvement) as taught in MÉTHODE §4 step 3 (I believe it
   does : « prévoir »-type capacities), and the exact status of the
   principe d'inertie recall.
3. **The whole chapter design is mine** : le lancer franc as hook and
   running story, « la flèche du mouvement » as the s2 frame, l'établi
   as the Δv⃗ construction bench, « avant/après » as the vector names
   (manuals write v⃗ᵢ et v⃗ᵢ₊₁ — both appear, the maths names in the
   DÉFINITIONS and corrigés, the words on the graphics), « qui tord le
   mouvement ? » as the s4 frame, the crash-test problem, the
   Aristote/Newton POURQUOI, and the Apollo 15 aside. Check especially
   « l'établi » — it's the chapter's central vocabulary invention.
4. **The velocity convention is v⃗ᵢ = M⃗ᵢMᵢ₊₁/Δt** (the « point
   suivant » convention, standard in Première textbooks), and Δv⃗ᵢ =
   v⃗ᵢ₊₁ − v⃗ᵢ shown at the *shared* point Mᵢ₊₁. Some manuals use the
   centred M⃗ᵢ₋₁Mᵢ₊₁/2Δt — flag if you teach that one.
5. **On the chronophoto SVGs the drawn arrow IS the chord MᵢMᵢ₊₁**
   (i.e. v⃗ at the scale « 1 carreau of length per 5 m/s », since
   Δt = 0,20 s). This makes « la flèche relie le point au suivant »
   literally true and is stated in the widget notes ; the à-l'échelle
   drawing skill (1 cm ↔ 2 m/s) is exercised in MÉTHODE §2/ex 04/bac A
   instead. ΣF⃗ (dashed) deliberately has NO scale — the page says only
   direction/sens count, since the quantitative law is Terminale.
6. **g = 10 m/s² implicitly** behind the reference trajectory (it
   makes every displayed number exact : Δv = 2,0 m/s per 0,20 s). The
   value of g is never printed on the page ; if you'd rather have a
   9,81-based dataset with ≈ everywhere, say the word.
7. **Number-exactness policy** (ondes flag 9 continued) : settings
   exact by construction ; the only ≈ are the two intermediate norms
   of the flagship (0,94 m → 4,7 m/s ; 0,64 m → 3,2 m/s), displayed
   with =/≈ chosen by comparing the displayed rounding to the true
   value (d at 2 decimals, v at 1 decimal), and √17 ≈ 4,1 in ex 06 /
   √7,24 ≈ 2,7 omitted (ex 13 asks coordinates, not norms). Au manège
   no numbers are displayed at all (chord values are irrational) —
   the scene argues purely with directions, which is the programme's
   own emphasis.
8. **The game sits after the méthodes, at the end of §5** (same
   placement as ondes' game, flag 7 there) : it tests the full
   chapter's judgment like a mini-bac ; manipulation-first is honoured
   by the three real widgets above it.
9. **Ex 14 (crash-test) question d** ends on « étale son freinage sur
   toute la durée du choc » — this brushes the F·Δt idea (Terminale)
   without formula ; kept qualitative on purpose. Also the closing
   imperative « Attache-la. » is a deliberate safety nudge — trim if
   too parental.
10. **Ex 12.b** (« une poussée trois fois plus intense, ou la même
    force trois fois plus longtemps ») quantifies the mass role
    slightly beyond the qualitative letter of the programme —
    proportionality is implied by the widget's dataset anyway ; flag
    if you want it softer.
11. **Chip texts use plain « Δv », « ΣF », « v » without vector
    arrows** (mono plain-text contexts — the U+20D7 combining arrow
    renders unevenly) ; KaTeX contexts always carry \(\Delta \vec v\),
    \(\sum \vec F\). The chap-savoir header line also uses plain Δv for
    the same reason (it renders before KaTeX).
12. **JS budget : 49,3 KB** first-party unminified on this page
    (ceiling 50) — the heaviest page yet, measured with `wc -c` over
    the ten modules it loads (theme, sommaire, corrige, quiz,
    analytics, nabla-graph, stoechio-jeu, chrono-vecteurs,
    mouvement-forces, mouvement-masse). Any future widget on this page
    must trim elsewhere first.
13. **Verified in a real browser** (Playwright + local Chromium ; the
    sandbox blocks CDNs so KaTeX was served from a local copy of the
    same 0.16.11 dist during tests) : 42 automated checks pass — both
    chrono instances (exact/≈ lines at every i, sommet chip, captions
    incl. the ≥ 3-images payoff, rejouer, reset, keyboard arrows),
    forces (scene switching + statics toggling, aria-pressed, reset),
    masse (all sens × masse values, good/bad chips, ≥ 2-masses payoff,
    reset), full game flow (wrong → relance, 4 rounds, 3/4 score,
    recommencer), quiz flow (mark-disable-retry, score), corrigé + bac
    toggles, KaTeX 251 formulas 0 errors, zero console errors, no
    horizontal overflow at 375 px ; the onload snippet is
    byte-identical to the ondes page's ; every internal link on the
    touched pages resolves ; data-bonne spread 4/5/4 ; structure
    counts (1 h1, 8 sections, 14+1 exercices, 13 questions, 5 pièges,
    5 essentiel, 9 sommaire links ×2). Screenshots of every widget in
    both themes at desktop + 375 px were reviewed by eye. **Real
    devices, real CDN load, and Lighthouse remain on your checklist.**
14. **Cosmetic known-small** : sur la scène « glace », au réglage
    initial (images M0 à M2) la note mono « la glace (frottements
    négligés) » passe sous la flèche P⃗ — lisible mais pas parfait ;
    elle se dégage dès que le curseur avance. Dis-moi si je décale la
    note.
15. **« mis à jour juillet 2026 »** hand-maintained ; sitemap lastmod
    2026-07-17 (this page, accueil, ondes). Homepage motif = the eight
    chronophoto dots + accent chord with point — echoes §1's figure.
    PROGRAMME.md row flipped to ✅ (bilan 4 en ligne · 12 à faire).
