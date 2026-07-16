/* Nabla — widgets/TODO-type.js  (SKELETON — copy to assets/js/widgets/,
   rename, fill every TODO, delete the archetype branches you don't use)

   « TODO — Titre du widget » : une phrase décrivant le geste pédagogique
   (ce que l'élève fait avec les mains, et ce qu'il doit en comprendre).
   Spec de l'instance : premiere/maths/TODO-slug/README.md.

   Doctrine complète : .claude/skills/nabla-topic/references/interactive-patterns.md
   — archétype A : point déplacé le long d'une courbe (secante.js, tangente.js)
   — archétype B : curseurs natifs pilotant un dessin (arithmetique.js, arbre.js)
   — archétype C : bascule de mode sur données fixes, lectures en HTML statique (univers.js)
   — archétype D : manches à boutons-réponses (lecture.js, sens.js)
   — archétype E : cartes à apparier (associe.js) */

import {
  /* garde uniquement ce que tu utilises : */
  FONCTIONS, el, creerVue, cheminCourbe, grilleUnite, axes,
  clamp, fmt, fmtAdaptatif, fmtCourt, animerValeur, rendreDraggable, creerHint,
} from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

function initTodo(fig) {
  /* --- config déclarative depuis les data-* de la <figure> ---------------- */
  const d = fig.dataset;
  const { f, fp } = FONCTIONS[d.fn];              // archétype A/B sur courbe
  const aInit = parseFloat(d.aInit);
  const [domMin, domMax] = d.domaine.split(',').map(Number);
  let a = aInit;                                   // l'état vivant du widget

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, {
    xMin: +d.xmin, xMax: +d.xmax, yMin: +d.ymin, yMax: +d.ymax,
  });

  /* --- décor statique : construit UNE fois --------------------------------- */
  el('path', { class: 'g-grid', d: grilleUnite(vue) }, svg);
  el('path', { class: 'g-axis', d: axes(vue) }, svg);
  el('path', { class: 'g-courbe', d: cheminCourbe(vue, f, domMin, domMax) }, svg);

  /* --- éléments dynamiques : références gardées, attributs mis à jour ------ */
  const tangente = el('path', { class: 'g-tangente' }, svg);      // TODO
  const halo = el('circle', { class: 'pt-halo', r: 12 }, svg);
  const ptA = el('circle', { class: 'pt-point', r: 5.5 }, svg);

  /* indice « glisse-moi » près de la position initiale (archétype A) */
  const ax0 = vue.xPx(aInit);
  const ay0 = vue.yPx(f(aInit));
  const hint = creerHint(svg, {
    x: ax0 + 22.4, y: ay0 - 59.1,
    filDe: [ax0 + 24.4, ay0 - 37.1], filVers: [ax0 + 5.4, ay0 - 6.1],
  });

  /* zone de saisie invisible ≥ 44 px, clavier role="slider" (archétype A).
     Si le paramètre a DÉJÀ un curseur natif dans le pied, mets plutôt
     'aria-hidden': 'true' ici et laisse le clavier au curseur (cf. tangente.js). */
  const hit = el('circle', {
    class: 'hit-zone', r: 42,
    tabindex: 0, role: 'slider', 'aria-orientation': 'horizontal',
    'aria-label': 'TODO — description française du point',
    'aria-valuemin': String(domMin), 'aria-valuemax': String(domMax),
  }, svg);

  /* --- lectures : nœuds texte, JAMAIS de KaTeX par frame -------------------- */
  const elX = fig.querySelector('.js-x');          // TODO tes hooks .js-*
  const elEtat = fig.querySelector('.js-etat');    // chip d'état (aria-live)

  function rendre() {
    const fa = f(a);
    const pente = fp(a);
    const ax = vue.xPx(a);
    const ay = vue.yPx(fa);

    /* TODO — mettre à jour les attributs des éléments dynamiques */
    halo.setAttribute('cx', ax); halo.setAttribute('cy', ay);
    ptA.setAttribute('cx', ax); ptA.setAttribute('cy', ay);
    hit.setAttribute('cx', ax); hit.setAttribute('cy', ay);

    /* lectures françaises : fmt (virgule, vrai moins), fmtAdaptatif pour les
       toutes petites valeurs, fmtCourt pour les réglages ronds */
    elX.textContent = fmt(a);

    /* chip d'état sémantique : good = ça monte / bad = ça descend / accent =
       cas neutre — l'état est dit EN MOTS */
    if (pente > 0.005) {
      elEtat.textContent = 'TODO > 0 — TODO monte';
      elEtat.className = 'chip chip--good js-etat';
    } else if (pente < -0.005) {
      elEtat.textContent = 'TODO < 0 — TODO descend';
      elEtat.className = 'chip chip--bad js-etat';
    } else {
      elEtat.textContent = 'TODO = 0 — TODO';
      elEtat.className = 'chip chip--accent js-etat';
    }

    hit.setAttribute('aria-valuenow', String(Math.round(a * 100) / 100));
    hit.setAttribute('aria-valuetext', `TODO = ${fmt(a)}`);
  }

  function interaction() {
    hint.style.display = 'none';   // l'indice disparaît au premier geste
    track('widget_interact', { widget: 'TODO-type', chapitre });
  }

  /* --- archétype A : drag (coalescé par rAF dans rendreDraggable) ----------- */
  rendreDraggable(hit, {
    surDebut() { fig.classList.add('drag-actif'); interaction(); },
    surDeplacement(evt) {
      a = clamp(vue.xDePointeur(evt), domMin, domMax);
      rendre();
    },
    surFin() { fig.classList.remove('drag-actif'); },
  });

  /* clavier : flèches ±0,05, Maj ±0,01, Home/End = bornes du domaine */
  hit.addEventListener('keydown', (e) => {
    const pas = e.shiftKey ? 0.01 : 0.05;
    let cible = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') cible = a + pas;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') cible = a - pas;
    else if (e.key === 'Home') cible = domMin;
    else if (e.key === 'End') cible = domMax;
    if (cible === null) return;
    e.preventDefault();
    a = clamp(cible, domMin, domMax);
    interaction();
    rendre();
  });

  /* --- archétype B : curseur natif (à la place ou en plus du drag) ----------
  let renduPlanifie = 0;
  function planifierRendu() {
    if (!renduPlanifie) renduPlanifie = requestAnimationFrame(() => { renduPlanifie = 0; rendre(); });
  }
  const curseur = fig.querySelector('.js-curseur');
  curseur.addEventListener('input', () => {
    a = clamp(parseFloat(curseur.value), domMin, domMax);
    interaction();
    planifierRendu();
  });
  // et dans rendre() : maj de curseur.value, de la CSS var --pos (remplissage
  // accent) et de aria-valuetext — cf. arithmetique.js majCurseur().
  ------------------------------------------------------------------------- */

  /* --- préréglages animés (si la tête porte un .segmente) -------------------
  let animation = null;
  for (const btn of fig.querySelectorAll('.segmente button')) {
    btn.addEventListener('click', () => {
      if (animation) animation.stop();
      interaction();
      animation = animerValeur({
        de: a, vers: parseFloat(btn.dataset.TODO),
        surFrame(v) { a = v; rendre(); },
        surFin() { animation = null; },
      });
    });
  }
  // aria-pressed=true UNIQUEMENT sur correspondance exacte (dans rendre()) ;
  // stopper l'animation au début d'un drag.
  ------------------------------------------------------------------------- */

  /* --- réinitialiser : retour exact à l'état initial ------------------------- */
  fig.querySelector('.js-reset').addEventListener('click', () => {
    a = aInit;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="TODO-type"]')) initTodo(fig);
