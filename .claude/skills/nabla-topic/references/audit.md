# NABLA — Audit of the three existing topics

Full-source audit of Probabilités conditionnelles, Suites numériques and
La dérivation (July 2026, commit c173388), plus the shared CSS/JS. This file
records the COMMON pattern the skill templates encode, every divergence
found between the three, and which convention the skill picked. The other
reference files are derived from this one.

## Contents

1. [Layout & registration](#layout)
2. [Design system](#design)
3. [Page anatomy — the canonical section flow](#anatomy)
4. [Interactive widgets](#widgets)
5. [Exercises](#exercises)
6. [Quizzes](#quizzes)
7. [French pedagogy & notation](#pedagogy)
8. [Accessibility & responsiveness](#a11y)
9. [Divergences between the three topics & conventions chosen](#divergences)
10. [Gaps found while validating the skill (Phase 4)](#gaps)

## <a name="layout"></a>1. Layout & registration

Common to all three: one folder per chapter (`premiere/maths/<slug>/`) with
`index.html` + `README.md`; wired into the site via (a) homepage card
(`.carte-chapitre` with `CHAPITRE NN`, description « thèmes · … · 15
exercices corrigés », motif SVG 80×56), (b) previous chapter's
`.pied-chapitre` link, (c) `sitemap.xml` entry. `body data-chapitre` is a
SHORT analytics key, not necessarily the slug (`probabilites` for
`probabilites-conditionnelles`). Head boilerplate is byte-identical across
chapters except title/description/JSON-LD/canonical/widget-module list.
Full checklist: architecture.md.

## <a name="design"></a>2. Design system

All colours/fonts/stroke-widths from `tokens.css` (dark default + light,
`data-theme` on `<html>`, no-flash inline snippet). Component vocabulary
implemented once in `chapitre.css` and reused untouched by all three
chapters; chapter-specific additions are appended at the end of chapitre.css
under banner comments (suites: `.machine-*`, `.som-*`, `.pt-suite`,
`.g-marche`, `.lecture-formule`; probas: `.pt-pop*`, `.cadre-univers`,
`.arbre-*`, `.seg-*`, `.feuille-btn`, `.pt-vp/fn/fp/vn`, `.puce*`,
`.jauge-*`, tableau totals variant). Details: design-system.md.

## <a name="anatomy"></a>3. Page anatomy — the canonical section flow

All three pages follow exactly:

1. `site-header` (logo ∇ draw-on, nav Chapitres/À propos, theme toggle)
2. `chap-entete`: fil-ariane · h1 · `.chap-savoir` (« CE QUE TU DOIS SAVOIR
   FAIRE — » + one sentence of skills) · `.chap-meta` (« ≈ 60 min de travail
   · 15 exercices corrigés · mis à jour <mois année> »)
3. `chap-layout`: sticky desktop `.sommaire` + mobile `<details>` (identical
   link lists), then `main.chap-contenu` with:
   - **§s1 — concrete hook**: 2–3 prose paragraphs telling a real-life story
     (voiture/compteur, livret d'épargne, tirage au sort) · one HAND-AUTHORED
     static `figure.figure-graph` SVG that *previews the flagship widget's
     picture* · optional table/vitrine · (dérivation/suites: a DÉFINITION or
     the taux formula). **No widget in §1.**
   - **§s2 — flagship manipulation, THEN formal definition**: 1–3 prose ·
     the chapter's flagship widget · POURQUOI ? · DÉFINITION · math-vitrine
     (--grande for the central formula) · MÉTHODE · EXEMPLE RÉSOLU ·
     (À RETENIR) · quiz s2. The formal definition NEVER precedes the
     manipulation — this is CLAUDE.md non-negotiable #1.
   - **§s3, §s4, §s5 — one concept each**, same internal rhythm: hook prose
     → widget (manipulation first) → DÉFINITION/PROPRIÉTÉ → MÉTHODE →
     EXEMPLE(S) RÉSOLU(S) → (POURQUOI ? / tables / À RETENIR) → quiz.
     One of the five sections carries a game-type widget (lecture/sens) and
     one section's quiz has 4 questions instead of 3.
   - **#pieges**: `.bloc-pieges`, 4–5 `.piege` (bold lead + explanation).
   - **#essentiel**: `.bloc-essentiel`, exactly 5 lines (LABEL + one
     formula/sentence each).
   - **#ex**: header + `.ex-intro` (« Commence par le niveau 1… les
     exercices suivent l'ordre du cours ») · 14 `.exercice` articles ·
     `article#bac.bac` = exercise 15.
   - `pied-chapitre`: CHAPITRE SUIVANT (link, or title + `pastille-bientot`
     if unpublished) + « Un point pas clair ? Écris-moi. »
4. `site-footer--chapitre`.

Always present: 5 course sections (s1–s5) · 4 quizzes (s2–s5, 13 questions
total: 3+3+3+4 or 3+3+4+3) · pièges · essentiel (exactly 5) · 15 exercises ·
Vers le Bac with Partie A/B. Optional: À RETENIR (1–2 per chapter), tables,
number of widgets (4–6), second MÉTHODE in a section, cross-chapter links.

## <a name="widgets"></a>4. Interactive widgets

See interactive-patterns.md for the full engineering doctrine. Audit
summary: SVG + vanilla JS modules (one per TYPE), declarative `data-*`
instantiation, `nabla-graph.js` for coordinates/formatting/drag/animation.
Five archetypes across 15 modules: (A) point-on-curve drag, (B) native
sliders driving a drawing, (C) mode switch over fixed data with static HTML
readouts, (D) button-answered rounds, (E) matching cards. State chips
(good/bad/accent), instantiated formula lines, revealed captions, presets
animated via `animerValeur`, « glisse-moi » hints, one throttled
`widget_interact` per session. Datasets engineered so every displayed number
is exact.

## <a name="exercises"></a>5. Exercises

No data schema — exercises are semantic HTML, one `article.exercice` each
(see exercises-and-quizzes.md for the copy-ready markup). Ordered in COURSE
order, themes labelled (`.exercice-theme` « · thème »), difficulty
`niveau 1|2|3` + 3-bar meter. Distribution across the three chapters:
~3-4 niveau 1, ~8 niveau 2, ~2-3 niveau 3. Corrigés: hidden `div.corrige`
toggled by `button.corrige-toggle` (aria-expanded/controls, data-voir/
masquer, data-exercice for analytics); steps labelled « Étape N — » (or
« a. — » for multi-part), conclusion bold, often ending with a check reflex
or a takeaway sentence. Ex 14 is always a « problème » — the chapter's
"what is this for" payoff. Ex 15 = VERS LE BAC (banded article, Partie A/B,
`data-event="bac_open"`, corrigé « LES GRANDES ÉTAPES »).

## <a name="quizzes"></a>6. Quizzes

`quiz.js` MCQs (`.widget.quiz[data-quiz=sN]`). 3–4 questions per quiz,
`data-bonne` 1-indexed. Wrong → mark + disable + shared generic relance
(« PAS ENCORE — élimine cette réponse et réessaie. »), retry allowed; right
→ lock + explanation (« EXACT — … » with the *why*, often naming the trap).
Relance/explication are STATIC HTML toggled by `hidden` (KaTeX-safe).
Score x/n appears in the header after the first success. Distractors are the
chapter's real misconceptions, never filler. No persistence.

## <a name="pedagogy"></a>7. French pedagogy & notation

- Curriculum tagging: title suffix « — Première Spé Maths | Nabla »,
  breadcrumb « Première · Spé Maths », JSON-LD educationalLevel « Première
  générale — spécialité mathématiques », homepage row « Première · Spé
  Maths ». Content beyond the program is either avoided, kept qualitative
  (limits in suites), or flagged in the README.
- Voice: tutoiement, direct tutor voice, mini-stories with recurring
  characters/objects; « widget » never appears in student-facing prose
  (say « le graphique », « le graphique interactif »).
- Typography: `&nbsp;` before `: ; ! ?` and inside « guillemets » ; decimal
  comma (KaTeX: `0{,}30`); true minus U+2212 in readouts; `&thinsp;`
  thousands in prose, `\,` in maths; nbsp before % € min; U+FE0E after ☀;
  no ↗/↘ characters (SVG arrows); em-dashes used for labels (« MÉTHODE — »,
  « EXACT — ») and sparingly in prose.
- Notation: `\(u_n\)`, `P_A(B)`, `\overline{A}` (SVG: negation bar drawn as
  a path), `f'(a)` with U+2032 in plain text, intervals
  `\left]a\;;\,b\right[`, `(a\;;\, f(a))` coordinate style.

## <a name="a11y"></a>8. Accessibility & responsiveness

WCAG AA both themes; `:focus-visible` global; real buttons everywhere;
`role="img"` + French aria-labels on meaningful SVGs; `role="slider"` +
aria-value* on draggable points; aria-live="polite" wrappers pre-existing in
markup; quiz/corrigé toggles keyboard-operable; `prefers-reduced-motion`
respected globally (base.css kill-switch + `animerValeur`/`mouvementReduit`).
Responsive: mobile-first at 375 px; sommaire flips at 920 px; tables scroll
inside `.defile`; `.math-vitrine` scrolls x; tab-grille compacts under
480 px; widget layouts stack (machine-corps 1 column under 620 px, slider
labels take their own line under 560 px).

## <a name="divergences"></a>9. Divergences between the three & conventions chosen

| # | Divergence | Found | Convention for new topics |
|---|---|---|---|
| 1 | Reset control placement | header `.js-reset` (most) vs preset-as-reset (secante, univers) vs reset moved to `.widget-pied` when header holds presets (geometrique, depistage) | Header `.js-reset` by default; if presets occupy the header, put reset in the pied next to the controls; a true initial-state segment may stand in for reset (flag it in the README) |
| 2 | Widget config carrier | `data-*` attributes (most) vs `<script type="application/json">` (lecture, sens, associe) | `data-*` for scalar params; JSON block only for round/card lists |
| 3 | Keyboard path for a dragged point | `role="slider"` on the hit zone (secante, derivee, variations) vs parallel native slider + aria-hidden point (tangente) | `role="slider"` on the point; use the native-slider variant only when the widget already shows a slider for the same parameter |
| 4 | Draggable points at all | dérivation: 4 drag widgets; suites & probas: none (sliders/buttons only) | Drag only when the drag itself is the lesson; otherwise native controls (free a11y) |
| 5 | Quiz question counts | 3+3+4+3 (dérivation, probas s5=4) vs 3+3+4+3 (suites s4=4) | 13 total, one 4-question quiz on the chapter's richest section |
| 6 | Corrigé step labels | « Étape N — » vs « a. — b. — » vs named (« Structure — », « Signe — », « A.1 — ») | Étape N for sequential reasoning, letters for multi-part, A.N/B.N in the bac corrigé |
| 7 | `data-chapitre` vs folder slug | equal (derivation, suites) vs shortened (probabilites) | Short, one-word analytics key; folder slug may be longer |
| 8 | Bac banner note | « SANS CALCULATRICE » (dérivation) vs « CALCULATRICE UTILE » (suites, probas) | Pick whichever matches the exercise; format « ≈ 45 MIN · … » |
| 9 | §1 closing element | math-vitrine (dérivation) vs DÉFINITION (suites) vs tableau + vitrine (probas) | Free — whatever the hook needs; §1 never contains a widget |
| 10 | Section h2 wording vs sommaire label | probas h2s are longer than sommaire labels (« 3. L'arbre pondéré : l'expérience racontée pas à pas ») | Allowed: sommaire label = short form of the h2 (keep numbering identical) |
| 11 | FONCTIONS registry use | dérivation only; suites/probas widgets self-contained | Registry for curve-based widgets; module-local registries (SUITES, POP) otherwise |
| 12 | À RETENIR count | 1 (dérivation s2) vs 2 (suites s4, probas s2+s5) | 1–2 per chapter, on the most memorised formula |

## <a name="gaps"></a>10. Gaps found while validating the skill (Phase 4)

Recorded during the dry-run build of « La fonction exponentielle » —
things the audit/templates didn't specify and had to be decided on the spot.
Tighten the skill with these.

*(filled in during Phase 4 — see end of file)*
