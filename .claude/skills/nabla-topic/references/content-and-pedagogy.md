# NABLA — Content structure, pedagogy & voice

Pedagogy is the product (CLAUDE.md non-negotiable #1). This file defines the
canonical chapter anatomy, the narrative doctrine, curriculum framing, and
the voice. Deviating from the anatomy is possible, but each deviation goes in
the chapter README's review flags.

## The narrative law

**Concrete hook → picture → manipulation → formal definition.** In that
order, always. The student must *do* the chapter's central gesture (drag B
into A, pose the second staircase, restrict the universe) before reading its
formal name. Concretely:

- §1 contains NO widget and NO formal definition of the new concept — it
  tells a story from the student's world (a car's speedometer, a savings
  account, a raffle) and shows a static figure that is literally the
  flagship widget's initial state.
- The chapter's central DÉFINITION appears in §2, AFTER the flagship widget,
  introduced by a bridging sentence (« Ce que tu viens de faire avec la
  main, voilà comment on l'écrit. »).
- Every later section repeats the rhythm at smaller scale: hook prose →
  manipulation → formalisation → worked example(s) → quiz.
- One story runs through the chapter (the car, the livret, the class of 40)
  and returns in later sections; the exercises reuse it or introduce
  similarly concrete ones.
- Ideas beyond the program are kept qualitative and flagged (e.g. limits
  described as « ça fond vers 0 » in Première).

## Canonical section anatomy

| id | Role | Always contains | Often contains |
|---|---|---|---|
| `s1` | Concrete hook | 2–3 `.prose` story paragraphs · static `figure.figure-graph` previewing the flagship picture | a table, a `.math-vitrine`, a Seconde-level DÉFINITION |
| `s2` | Flagship gesture → formal core | flagship widget · POURQUOI ? · DÉFINITION · `.math-vitrine--grande` (the central formula) · MÉTHODE · EXEMPLE RÉSOLU · quiz s2 | À RETENIR |
| `s3`–`s5` | One concept each | hook prose · widget or game · DÉFINITION or PROPRIÉTÉ · MÉTHODE · EXEMPLE(S) RÉSOLU(S) · quiz | POURQUOI ?, tables, second MÉTHODE, À RETENIR |
| `pieges` | Classic errors | `.bloc-pieges` with 4–5 `.piege` (bold lead naming the error, then why it's wrong, often a counter-example) | |
| `essentiel` | 5-line recap | `.bloc-essentiel` with EXACTLY 5 `essentiel-ligne` (mono LABEL + formula/sentence) | |
| `ex` | 15 exercices corrigés | `.ex-intro` · 14 `.exercice` in course order · `#bac` article = ex 15 | |

Chapter footer: CHAPITRE SUIVANT (link if published, else title +
`pastille-bientot` BIENTÔT) + « Un point pas clair&nbsp;? Écris-moi. »

Header: h1 = the concept name (« La dérivation », « Les suites
numériques ») · `.chap-savoir` = « CE QUE TU DOIS SAVOIR FAIRE — » + one
sentence listing the operational skills · `.chap-meta` = « ≈ 60 min de
travail · 15 exercices corrigés · mis à jour <mois année> » (hand-maintained).

Sommaire: 9 links (s1…s5, pieges, essentiel, ex, bac); labels may be short
forms of the h2s; numbered « 1. … 5. ».

## Curriculum levels & tagging

Currently shipped: Première · spécialité mathématiques. Tag a chapter's
level in FIVE places, consistently: `<title>` suffix (« — Première Spé
Maths | Nabla »), breadcrumb (« Première · Spé Maths »), JSON-LD
`educationalLevel` (« Première générale — spécialité mathématiques »),
homepage row heading, and the folder path (`premiere/maths/…`,
`terminale/maths/…`, `premiere/physique-chimie/…`). Check the actual
programme (BO) scope for the level before writing: what's in, what's
Terminale-only, which notations the students already know from Seconde.
Physics chapters follow the same anatomy with PROPRIÉTÉ blocks for laws and
units formatted with nbsp (« 9,81 m·s⁻² »).

## Voice — the tutor's voice, in French

- **Tutoiement, always.** Imperatives: « Fais-le toi-même », « Vérifie »,
  « Prends cette habitude ». Direct address: « Tu as déjà fait tout ça en
  Seconde. »
- Short declarative sentences; rhetorical questions that the next paragraph
  answers; zero marketing filler; no exclamation inflation.
- Explain the WORD before the symbol (« Le mot d'abord, simplement : une
  tangente, c'est… »); give plain-language glosses before formal terms.
- Honest asides that anticipate the student's objection (« ce n'est pas un
  caprice », « pas de panique »).
- Anti-brute-force pedagogy: the student is made to *predict* before the
  answer is shown; explanations name the misconception, not just the fact.
- « widget » never appears in student-facing prose — write « le graphique »,
  « le graphique interactif ». The word survives only in code and READMEs.
- Em-dashes: structural labels use them (« MÉTHODE — … », « Étape 1 — »,
  « EXACT — »); in running prose prefer commas/colons — Victor trims
  tic-like dashes.
- Victor owns the copy: everything you write is « my words in your voice »
  and must be listed for his review in the README flags.

## French typography rules (apply mechanically)

- `&nbsp;` before `:` `;` `!` `?` and inside `«&nbsp;…&nbsp;»`.
- Decimal comma everywhere; in KaTeX write `0{,}75`.
- True minus U+2212 in HTML readouts/chips; `-` only inside LaTeX.
- Thousands: `&thinsp;` in prose (`1&thinsp;000`), `\,` in maths (`1\,000`).
- nbsp before units and % € (« 30&nbsp;% », « 20&nbsp;€ », « 45&nbsp;MIN »).
- Ordinals with Unicode superscripts (« 10ᵉ », « 1ᵉʳ »); « n°&thinsp;1 ».
- ☀ needs U+FE0E; never ↗/↘ (SVG `.var-fleche` instead); SVG overlines
  drawn as paths, not combining characters.
- Semantic HTML: `lang="fr"`, one `<h1>`, `<section>/<article>/<figure>`,
  real `<button>`s.

## Maths notation conventions

- Inline `\( … \)`, display `$$ … $$` inside `.math-vitrine` (`--grande`
  for the chapter's central formula).
- Intervals: `\left]0\;;\,+\infty\right[`; couples: `(a\;;\, f(a))`;
  sets: `\mathbb{R}`, `\mathbb{R}^*`.
- Derivatives `f'(a)` (KaTeX) / « f′(a) » with U+2032 in plain HTML text;
  sequences `u_n`, `u_{n+1}`, `(u_n)`; probabilities `P_A(B)`,
  `\overline{A}`, `\cap`.
- `\dfrac` in prose-sized maths and corrigés; `\;`/`\,` spacing as in the
  existing pages. Avoid `\text{…}` with accents where possible — prefer
  prose outside the maths.

## The chapter README — you author it, Victor reviews it

Required sections (mirror the three existing READMEs):

1. Title header + provenance note (no design mock → « the page transposes
   the dérivation design system to new content »).
2. **Purpose & narrative through-line** — numbered story of the chapter.
3. **Reference function(s)/data & view windows** — every registry key,
   viewBox, x/y window, dataset, with the WHY (numbers chosen to land clean).
4. **Section structure** — the table (id · sommaire label · contents).
5. **Components introduced by this chapter** (CSS/JS added to shared files).
6. **Widget instances** — one spec per instance: module + data-attrs,
   fixed/draggable/controls, readouts, presets, guards & thresholds,
   captions + trigger conditions, reset state, keyboard behaviour.
7. **Quiz** — count, doctrine reference, what the distractors target.
8. **Analytics** — the events table with this chapter's widget values.
9. **Review flags for Victor** — EVERY behavioural interpretation you
   inferred, every piece of copy you authored, every convention picked,
   placeholder states, JS budget measurement. Number them.
