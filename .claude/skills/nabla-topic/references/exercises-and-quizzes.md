# NABLA — Exercises & quizzes: exact markup and doctrine

There is no JSON schema for exercises or quizzes — both are semantic HTML
rendered by two tiny shared modules (`corrige.js`, `quiz.js`) that only
toggle `hidden`. The "schema" is the markup below; copy it exactly.

## Contents

1. [Exercises — markup](#ex-markup)
2. [Exercises — difficulty & ordering doctrine](#ex-doctrine)
3. [VERS LE BAC — markup & doctrine](#bac)
4. [Quizzes — markup](#quiz-markup)
5. [Quizzes — question-writing doctrine](#quiz-doctrine)
6. [Game widgets that reuse quiz styles](#games)

## <a name="ex-markup"></a>1. Exercises — markup

One `article.exercice` per exercise, inside `section#ex`. Worked example
(real, from the suites chapter):

```html
<article class="exercice">
  <div class="exercice-tete">
    <span class="exercice-label">EXERCICE 03 <span class="exercice-theme">· notation u<sub>n+1</sub></span></span>
    <span class="exercice-niveau">
      <span class="niveau-nom">niveau 2</span>
      <span class="niveau-barres" aria-hidden="true"><span class="plein"></span><span class="plein"></span><span></span></span>
    </span>
  </div>
  <p class="exercice-enonce">Soit \(u_n = n^2 + n\). a. Exprime \(u_{n+1}\) en fonction de \(n\). b. Exprime \(u_n + 1\). c. Compare-les pour \(n = 1\).</p>
  <button type="button" class="corrige-toggle" aria-expanded="false" aria-controls="corrige-03" data-exercice="03" data-voir="Voir le corrigé ▾" data-masquer="Masquer le corrigé ▴">Voir le corrigé ▾</button>
  <div class="corrige" id="corrige-03" hidden>
    <div class="corrige-tag">CORRIGÉ</div>
    <p><span class="etape-label">a. — </span>on remplace \(n\) par \(n+1\) partout&nbsp;: \(u_{n+1} = (n+1)^2 + (n+1) = n^2 + 3n + 2\).</p>
    <p><span class="etape-label">b. — </span>\(u_n + 1 = n^2 + n + 1\)&nbsp;: là, on ajoute 1 <em>au terme</em>, la formule ne bouge pas.</p>
    <p class="conclusion">Conclusion&nbsp;: \(u_{n+1}\) est le terme <em>suivant</em>, \(u_n + 1\) est le terme <em>plus un</em>.</p>
  </div>
</article>
```

Rules encoded in that markup:

- Numbering `01…14`, two digits, in `EXERCICE NN`, `aria-controls`/`id`
  (`corrige-NN`) and `data-exercice` (the Plausible prop — keep them equal).
- `exercice-theme` names the course notion (« · tangente », « · probabilités
  totales »); may contain markup.
- Niveau meter: `niveau-nom` says « niveau N », the 3 bars carry N `.plein`
  spans, `aria-hidden` (the name carries the info).
- Corrigé steps: `<span class="etape-label">Étape N — </span>` for
  sequential reasoning, `a. — b. —` for multi-part questions, occasionally a
  named label (« Structure — », « Signe — »). Last paragraph is
  `p.conclusion` starting « Conclusion&nbsp;: » (or a takeaway sentence for
  multi-part), often ending with a check reflex or a one-line moral.
- All corrigés closed by default (`hidden`); `corrige.js` does the rest.

Section frame:

```html
<section id="ex" class="chap-section">
  <div class="ex-tete"><h2>Exercices</h2><span class="ex-compte">15 corrigés</span></div>
  <p class="ex-intro">Commence par le niveau 1. Cherche vraiment avant d'ouvrir le corrigé — c'est là que ça rentre. Les exercices suivent l'ordre du cours&nbsp;: <ordre des thèmes>.</p>
  … 14 articles … puis l'article #bac …
</section>
```

## <a name="ex-doctrine"></a>2. Exercises — difficulty & ordering doctrine

- **Course order, not difficulty order**: the themes appear in the order the
  chapter taught them; the intro sentence announces that order.
- Distribution over the 14 numbered exercises: ≈ 3–4 × niveau 1 (direct
  application, one notion), ≈ 8 × niveau 2 (combine two steps, a proof, a
  parameter to find), ≈ 2–3 × niveau 3 (multi-step, synthesis).
- **Exercise 14 is always a « problème »** — a concrete optimisation/
  modelling story that answers « à quoi ça sert » (boîte de volume maximal,
  deux offres d'embauche, site e-commerce). Slightly beyond routine, on
  purpose.
- Numbers engineered to land clean; every corrigé's arithmetic checked by
  hand. Statements introduce real-life data honestly.
- One exercise may deliberately re-derive by hand what a widget showed
  (probas ex 09 replays the dépistage).

## <a name="bac"></a>3. VERS LE BAC — markup & doctrine

Exercise 15, its own `article` (also the `#bac` sommaire target):

```html
<article id="bac" class="bac">
  <div class="bande-inversee">
    <span>VERS LE BAC — EXERCICE 15</span>
    <span class="bande-note">≈ 45 MIN · CALCULATRICE UTILE</span>  <!-- ou SANS CALCULATRICE -->
  </div>
  <div class="bac-corps">
    <p class="prose">…mise en situation…</p>
    <div class="bac-partie">PARTIE A</div>
    <ol><li>…</li><li>…</li><li>…</li></ol>
    <div class="bac-partie">PARTIE B</div>
    <ol><li>…</li><li>…</li><li>…</li></ol>
    <button type="button" class="corrige-toggle" aria-expanded="false" aria-controls="corrige-bac" data-exercice="15" data-event="bac_open" data-voir="Voir le corrigé détaillé ▾" data-masquer="Masquer le corrigé ▴">Voir le corrigé détaillé ▾</button>
    <div class="corrige" id="corrige-bac" hidden>
      <div class="corrige-tag">CORRIGÉ — LES GRANDES ÉTAPES</div>
      <p><span class="etape-label">A.1 — </span>…</p>
      …
    </div>
  </div>
</article>
```

Doctrine: a genuine bac-style subject in two parts (A ≈ technique, B ≈
study/modelling), 6–7 questions total; tricks the bac *gives* (an auxiliary
sequence, a factored form) are given in the statement, not expected to be
invented; the corrigé is « LES GRANDES ÉTAPES » (labels A.1 … B.n), tighter
than the numbered exercises. `data-event="bac_open"` replaces the
corrige_open event — bac only.

## <a name="quiz-markup"></a>4. Quizzes — markup

One quiz closes each course section s2–s5. Frame + one question (real, from
the probas chapter):

```html
<div class="widget quiz" data-quiz="s2">
  <div class="widget-tete">
    <div class="widget-titre-groupe">
      <span class="pill-interactif">TESTE-TOI</span>
      <span class="widget-titre">Trois questions, trente secondes</span>
    </div>
    <span class="quiz-score js-quiz-score" hidden></span>
  </div>
  <div class="quiz-corps">
    <div class="quiz-question" data-bonne="2">
      <p class="quiz-enonce"><span class="quiz-num">Q1</span>\(P_A(B)\), c'est…</p>
      <div class="quiz-reponses">
        <button type="button" class="quiz-reponse">la probabilité que A et B se produisent tous les deux</button>
        <button type="button" class="quiz-reponse">la part de B dans l'univers restreint à A</button>
        <button type="button" class="quiz-reponse">la probabilité de A sachant B</button>
      </div>
      <div class="quiz-retours" aria-live="polite">
        <p class="quiz-retour js-relance" hidden><span class="verdict verdict--fausse">PAS ENCORE —</span> élimine cette réponse et réessaie.</p>
        <p class="quiz-retour js-explication" hidden><span class="verdict verdict--bonne">EXACT —</span> le «&nbsp;sachant A&nbsp;» commence par rétrécir l'univers à A&nbsp;; on y mesure ensuite la part de B.</p>
      </div>
    </div>
    …
  </div>
</div>
```

Mechanics (quiz.js, do not reimplement): `data-bonne` is the 1-indexed
correct button; wrong click marks + disables that button and shows the
relance (retry allowed on the others); right click locks the question,
reveals the explanation, bumps the header score `x/n`. Relance text is
always the same generic line. Explanation and relance are static HTML —
KaTeX inside them renders at load.

## <a name="quiz-doctrine"></a>5. Quizzes — question-writing doctrine

- 13 questions per chapter: 3+3+3+4, the 4-question quiz on the richest
  section. Widget titles vary (« Trois questions, trente secondes »,
  « Quatre dérivées de tête », « Encore trois sur la tangente »,
  « Trois/Quatre questions pour finir »).
- 2–3 answers per question (2 only for a genuine oui/non); answers short;
  correct answer position varies (check the data-bonne spread).
- **Every distractor is a real misconception** from this chapter — the same
  errors the pièges section names (f(a) vs f′(a), uₙ+1 vs uₙ₊₁, sachant
  renversé). Never a silly filler option.
- The explanation teaches: it names why the right answer is right AND what
  trap the popular wrong answer falls into; it may forward-reference
  (« tu verras à la section 5 ») or back-reference the widgets.
- Wrong-answer flow is deliberately mark-and-retry (not reveal-on-fail) so
  the student can't brute-force to the explanation.

## <a name="games"></a>6. Game widgets that reuse quiz styles

Round-based interactives (dérivation `lecture`, suites `sens`) reuse
`.quiz-reponse`, `.quiz-retour`, verdicts and the header score slot
(`.js-progression`, « POINT 1/4 » / « SUITE 1/4 ») but are their own widget
modules with rounds in a `<script type="application/json">` block. Flow:
wrong → relance + retry; right → explanation + accent « suivant (i/n) ▸ »;
end → « x/n du premier coup » + « ↺ recommencer ». Prefer static per-round
explanation HTML when it contains maths (sens.js) — JS-built strings only
for plain text (lecture.js).
