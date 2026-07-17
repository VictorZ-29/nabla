---
name: nabla-topic
description: >
  Scaffold and author a new NABLA topic in the site's established style.
  Use whenever creating, scaffolding, or adding a new NABLA topic / chapter /
  chapitre / fiche / lesson (maths or physique-chimie, French lycée —
  Seconde / Première / Terminale), building a new interactive
  diagram/graphique/widget in the NABLA style, or adding NABLA-style
  exercises, corrigés, or quizzes — even if the user doesn't say the word
  "skill". Also use when extending an existing chapter with new widgets or
  exercises, or when registering a chapter on the homepage/sitemap.
---

# nabla-topic — create a new NABLA chapter

NABLA chapters are single interactive HTML pages where a lycée student
*manipulates* the maths before reading its formal definition. Three shipped
chapters (dérivation, suites, probabilités conditionnelles) define the
pattern; this skill encodes it so a new topic is never built from a blank
page. Vanilla HTML/CSS/JS only — no frameworks, no build step, KaTeX for
maths, GitHub Pages from `main`.

Read the reference for each step BEFORE doing that step; they carry the
depth this file deliberately omits:

| Reference | Read before |
|---|---|
| `references/architecture.md` | scaffolding, registration, head boilerplate, budgets |
| `references/content-and-pedagogy.md` | outlining, writing any French copy, the chapter README |
| `references/interactive-patterns.md` | building any widget |
| `references/design-system.md` | any styling decision, any SVG |
| `references/exercises-and-quizzes.md` | writing exercises, the bac exercise, quizzes |
| `references/audit.md` | resolving "which convention?" doubts — it lists the divergences and the chosen conventions |

Templates in `assets/templates/`: `topic-skeleton.html`,
`widget-skeleton.js`, `exercise-and-quiz-stub.html`.

Also read the repo's `CLAUDE.md` (non-negotiables, workflow) and at least
one existing chapter page + its README end to end before writing anything —
the shipped pages are the living spec; when this skill and the shipped code
disagree, the code wins and audit.md should be updated.

## Workflow

### 1. Gather

Ask the user for (or confirm from context):
- topic name and curriculum level (Seconde / Première / Terminale +
  spécialité; maths or physique-chimie);
- the 1–3 concepts that most need an interactive visual — these become the
  widgets, and the chapter is designed around them;
- prerequisites the student already has (what "Seconde level" means here);
- where the chapter sits (which homepage row, which chapter number, what the
  previous chapter's footer should now link to).

Check the actual programme scope for that level so nothing taught is
off-programme; anything beyond it must be qualitative and flagged. Start
with `/PROGRAMME.md` (official programme referential + coverage status —
note maths Première follows the NEW 2026 programme); read the chapter's
row there, and update its status in the commit that ships the chapter.

### 2. Outline — and confirm with the user

Propose, in one message: the five course sections (s1 hook story → s2
flagship gesture + core definition → s3–s5 one concept each), which widget
carries each section, the running story, the pièges list, the 5 essentiel
lines, the 14+1 exercise themes, and the reference function(s)/dataset with
the exact windows and why the numbers land clean. Get the user's OK before
building — this is the cheapest moment to change course. (If the user is
absent, proceed with the outline and flag it prominently for review.)

### 3. Scaffold

- Copy `assets/templates/topic-skeleton.html` to
  `premiere/maths/<slug>/index.html` (adjust level path); fill the head
  (title, description, JSON-LD, canonical, widget module list, current
  `?v=N` — check what existing pages use).
- Start the chapter `README.md` from the outline (structure in
  content-and-pedagogy.md § "The chapter README") — it grows with the build.
- Register the chapter: homepage card (promote the « bientôt » card if one
  exists), previous chapter's CHAPITRE SUIVANT link, `sitemap.xml`. Apply
  these directly.

### 4. Build the widgets FIRST

They are the point of NABLA — if a widget idea doesn't survive
implementation, the section text must change, so never write prose before
its widget works. For each widget: pick the archetype
(interactive-patterns.md §4), add `FONCTIONS` entries if it's curve-based,
copy `widget-skeleton.js`, engineer the dataset so every displayed number
is exact, implement guards/presets/captions, and spec the instance in the
README as you go. Interactivity must be genuinely pedagogical: the student
performs the chapter's central gesture; a widget that only decorates gets
cut. Static §1 figure last — it's the flagship widget's initial frame,
hand-authored SVG (generate sampled paths with a throwaway script).

### 5. Write the content — in French, in the tutor's voice

Follow the narrative law (content-and-pedagogy.md): story first, formal
definition only after the manipulation. Blocks in the house order
(POURQUOI ? → DÉFINITION → vitrine → MÉTHODE → EXEMPLE RÉSOLU → À RETENIR).
Apply the typography rules mechanically (nbsp, decimal commas, `0{,}5` in
KaTeX, no ↗/↘, « le graphique » never « le widget »). Every sentence you
write is Victor's voice on loan — track it for the README review flags.

### 6. Exercises and quizzes

15 exercises (14 + Vers le Bac) in course order, difficulty ~4/8/3, ex 14 a
concrete « problème », every corrigé's arithmetic hand-checked. 13 quiz
questions (3+3+3+4) whose distractors are the pièges. Markup verbatim from
`exercise-and-quiz-stub.html` / exercises-and-quizzes.md.

### 7. Verify

Serve locally (`python -m http.server`) and check: both themes at 375 px
and desktop; every widget by mouse, touch (emulated), and keyboard; KaTeX
renders with no layout shift; sommaire scroll-spy + mobile collapse; all
corrigés and quizzes toggle; internal links resolve; JS budget
(`wc -c` on the page's modules, < 50 KB); analytics events fire (watch
`plausible` calls in the console or network tab); quiz answer positions
spread over all slots (`grep -o 'data-bonne="[0-9]"' page | sort |
uniq -c`). If CSS changed, bump `?v=N` on every page in the same commit.
If no browser tool is available, a jsdom harness (shim `svg.viewBox`
from the attribute, stub matchMedia/requestAnimationFrame, import the
page's modules, dispatch clicks/keys/inputs) verifies the interactive
behaviour end-to-end — see audit.md §10.5; the two-theme visual pass then
goes on Victor's review list.

### 8. Self-check, README, summary

Run the checklist below, finish the chapter README (including numbered
« Review flags for Victor » covering every inference and every piece of
authored copy), commit in small conventional commits directly to `main`,
and end with a session summary: what changed, decisions taken, what needs
Victor's review.

## Final checklist

- [ ] Narrative law respected: no widget/definition in §1; central
      DÉFINITION after the flagship widget; manipulation before formalism in
      every section
- [ ] 5 sections + pièges (4–5) + essentiel (exactly 5) + 15 exercises +
      Vers le Bac (Partie A/B, `data-event="bac_open"`) + 4 quizzes
      (13 questions)
- [ ] Every widget: reset state, keyboard path, ≥44 px targets, reduced
      motion, French number formatting, throttled `widget_interact`, exact
      arithmetic, aria-live readouts, spec'd in the README
- [ ] No hardcoded colours/fonts/stroke-widths; new CSS at the end of
      chapitre.css under a banner, tokens only
- [ ] French typography pass (nbsp before `: ; ! ?` and in « », decimal
      commas, U+2212, no ↗/↘, no « widget » in prose)
- [ ] Head complete (title pattern, description, canonical, OG/Twitter,
      JSON-LD, correct `?v=N`); `body data-chapitre` short key
- [ ] Registered: homepage card + motif, previous chapter's footer link,
      sitemap.xml, own footer announces the next chapter
- [ ] Both themes × both widths checked; JS < 50 KB; all links resolve
- [ ] Chapter README complete with numbered review flags; session summary
      written; committed to `main`
