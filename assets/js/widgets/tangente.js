/* Nabla — widgets/tangente.js
   « Explore la tangente » : un point A déplaçable sur la courbe (pointeur)
   doublé d'un curseur natif (clavier), la tangente T suit, lectures
   a / f(a) / f′(a) en direct, bouton réinitialiser.
   Spec de l'instance : premiere/maths/derivation/README.md. */

import {
  FONCTIONS, el, creerVue, cheminCourbe, grilleUnite, axes,
  clamp, fmt, rendreDraggable, creerHint,
} from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

function initTangente(fig) {
  const d = fig.dataset;
  const { f, fp } = FONCTIONS[d.fn];
  const aInit = parseFloat(d.aInit);
  const [domMin, domMax] = d.domaine.split(',').map(Number);
  let a = aInit;

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, {
    xMin: +d.xmin, xMax: +d.xmax, yMin: +d.ymin, yMax: +d.ymax,
  });

  /* --- décor statique ----------------------------------------------------- */
  el('path', { class: 'g-grid', d: grilleUnite(vue) }, svg);
  el('path', { class: 'g-axis', d: axes(vue) }, svg);
  const guides = el('path', { class: 'g-guide', 'stroke-dasharray': '3 5' }, svg);
  const labF = el('text', { class: 'etiquette-math', 'font-size': 18, x: 160, y: 90 }, svg);
  labF.textContent = 'f';
  const labT = el('text', { class: 'etiquette-math etiquette-math--accent', 'font-size': 17 }, svg);
  labT.textContent = 'T';
  el('path', { class: 'g-courbe', d: cheminCourbe(vue, f, domMin, domMax) }, svg);

  /* --- éléments dynamiques -------------------------------------------------- */
  const tangente = el('path', { class: 'g-tangente' }, svg);
  const halo = el('circle', { class: 'pt-halo', r: 12 }, svg);
  const ptA = el('circle', { class: 'pt-point', r: 5.5 }, svg);
  const labA = el('text', { class: 'etiquette-math', 'font-size': 18 }, svg);
  labA.textContent = 'A';

  const ax0 = vue.xPx(aInit);
  const ay0 = vue.yPx(f(aInit));
  const hint = creerHint(svg, {
    x: ax0 + 22.4, y: ay0 - 59.1,
    filDe: [ax0 + 24.4, ay0 - 37.1], filVers: [ax0 + 5.4, ay0 - 6.1],
  });

  /* zone de saisie invisible ≥ 44 px ; le clavier passe par le curseur natif */
  const hit = el('circle', { class: 'hit-zone', r: 42, 'aria-hidden': 'true' }, svg);

  /* --- lectures et contrôles -------------------------------------------------- */
  const elA = fig.querySelector('.js-a');
  const elFa = fig.querySelector('.js-fa');
  const elFpa = fig.querySelector('.js-fpa');
  const elEq = fig.querySelector('.js-eq'); // équation de T développée (optionnel)
  const curseur = fig.querySelector('.js-curseur');
  const reset = fig.querySelector('.js-reset');

  function rendre() {
    const fa = f(a);
    const pente = fp(a);
    const ax = vue.xPx(a);
    const ay = vue.yPx(fa);

    guides.setAttribute('d', `M${ax} ${vue.yPx(0)}L${ax} ${ay}M${vue.xPx(0)} ${ay}L${ax} ${ay}`);

    const y0 = fa + pente * (vue.xMin - a);
    const y1 = fa + pente * (vue.xMax - a);
    tangente.setAttribute('d', `M0 ${vue.yPx(y0)}L${vue.largeur} ${vue.yPx(y1)}`);

    /* étiquette T : 18 px au-dessus de la droite, près du bord droit */
    const xT = vue.largeur - 42;
    const yLigne = vue.yPx(fa + pente * (vue.xDe(xT) - a));
    labT.setAttribute('x', xT);
    labT.setAttribute('y', clamp(yLigne - 18, 14, vue.hauteur - 14));

    halo.setAttribute('cx', ax); halo.setAttribute('cy', ay);
    ptA.setAttribute('cx', ax); ptA.setAttribute('cy', ay);
    hit.setAttribute('cx', ax); hit.setAttribute('cy', ay);
    labA.setAttribute('x', clamp(ax + 13, 8, vue.largeur - 18));
    labA.setAttribute('y', clamp(ay + 25, 16, vue.hauteur - 6));

    elA.textContent = fmt(a);
    elFa.textContent = fmt(fa);
    elFpa.textContent = fmt(pente);

    /* y = f′(a)(x − a) + f(a), développée : y = f′(a)·x + (f(a) − a·f′(a)) */
    if (elEq) {
      const ord = fa - a * pente;
      if (Math.abs(pente) < 0.005) elEq.textContent = `y = ${fmt(fa)}`;
      else if (Math.abs(ord) < 0.005) elEq.textContent = `y = ${fmt(pente)}x`;
      else elEq.textContent = `y = ${fmt(pente)}x ${ord > 0 ? '+' : '−'} ${fmt(Math.abs(ord))}`;
    }

    if (parseFloat(curseur.value) !== a) curseur.value = String(a);
    const pos = ((a - domMin) / (domMax - domMin)) * 100;
    curseur.style.setProperty('--pos', pos + '%');
    curseur.setAttribute('aria-valuetext', `a = ${fmt(a)}`);
  }

  function interaction() {
    hint.style.display = 'none';
    track('widget_interact', { widget: 'tangente', chapitre });
  }

  rendreDraggable(hit, {
    surDebut() { fig.classList.add('drag-actif'); interaction(); },
    surDeplacement(evt) {
      a = clamp(vue.xDePointeur(evt), domMin, domMax);
      rendre();
    },
    surFin() { fig.classList.remove('drag-actif'); },
  });

  curseur.addEventListener('input', () => {
    a = clamp(parseFloat(curseur.value), domMin, domMax);
    interaction();
    rendre();
  });
  /* flèches : pas de 0,05, pas fin de 0,01 avec Maj */
  curseur.addEventListener('keydown', (e) => {
    let sens = 0;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') sens = 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') sens = -1;
    if (!sens) return;
    e.preventDefault();
    a = clamp(a + sens * (e.shiftKey ? 0.01 : 0.05), domMin, domMax);
    interaction();
    rendre();
  });

  reset.addEventListener('click', () => {
    a = aInit;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="tangente"]')) initTangente(fig);
