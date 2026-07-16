/* Nabla — widgets/exp-decale.js
   « Décaler, c'est multiplier » : la courbe craie de exp, et la courbe
   accent de x ↦ e^(x+a), pilotée par le curseur a. La lecture instanciée
   montre la relation fonctionnelle : e^(x+a) = e^a × e^x — décaler la
   courbe de a vers la gauche revient à la multiplier par e^a. Le facteur
   e^a se lit sur l'axe des ordonnées (hauteur de la courbe accent en 0).
   Spec de l'instance : premiere/maths/exponentielle/README.md. */

import {
  el, creerVue, cheminCourbe, grilleUnite, axes, clamp, fmt, fmtCourt,
} from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

function initExpDecale(fig) {
  const d = fig.dataset;
  const aInit = parseFloat(d.aInit);
  let a = aInit;

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, {
    xMin: +d.xmin, xMax: +d.xmax, yMin: +d.ymin, yMax: +d.ymax,
  });

  /* --- décor statique ----------------------------------------------------- */
  el('path', { class: 'g-grid', d: grilleUnite(vue) }, svg);
  el('path', { class: 'g-axis', d: axes(vue) }, svg);
  /* courbe de référence : exp, tronquée là où elle crève le plafond */
  const xFinRef = Math.min(vue.xMax, Math.log(vue.yMax));
  el('path', { class: 'g-courbe', d: cheminCourbe(vue, Math.exp, vue.xMin, xFinRef) }, svg);
  const labRef = el('text', {
    class: 'etiquette-math etiquette-math--muted', 'font-size': 15,
    x: vue.xPx(xFinRef) - 34, y: 24,
  }, svg);
  labRef.textContent = 'eˣ';

  /* --- éléments dynamiques -------------------------------------------------- */
  const courbeA = el('path', { class: 'g-courbe-derivee' }, svg);
  /* lecture du facteur : point sur la courbe accent en x = 0, guide vers l'axe */
  const guide = el('path', { class: 'g-guide-accent', 'stroke-dasharray': '3 5' }, svg);
  const ptFacteur = el('circle', { class: 'pt-derivee', r: 4.5 }, svg);
  const labFacteur = el('text', {
    class: 'etiquette-mono etiquette-math--accent', 'font-size': 12,
  }, svg);

  /* --- lectures et contrôles -------------------------------------------------- */
  const elA = fig.querySelector('.js-a');
  const elFacteur = fig.querySelector('.js-facteur');
  const ligne = fig.querySelector('.js-ligne');
  const elEtat = fig.querySelector('.js-etat');
  const legende = fig.querySelector('.js-legende');
  const curseur = fig.querySelector('.js-curseur');

  function rendre() {
    const ea = Math.exp(a);

    /* courbe décalée, tronquée au plafond : e^(x+a) ≤ yMax ⟺ x ≤ ln(yMax) − a */
    const xFin = Math.min(vue.xMax, Math.log(vue.yMax) - a);
    courbeA.setAttribute('d', cheminCourbe(vue, (x) => Math.exp(x + a), vue.xMin, xFin));

    /* lecture du facteur en x = 0 */
    const px = vue.xPx(0);
    const py = vue.yPx(ea);
    guide.setAttribute('d', `M${px} ${vue.yPx(0)}L${px} ${py}`);
    ptFacteur.setAttribute('cx', px); ptFacteur.setAttribute('cy', py);
    labFacteur.setAttribute('x', px + 10);
    labFacteur.setAttribute('y', clamp(py - 8, 12, vue.hauteur - 6));
    labFacteur.textContent = `e^a = ${fmt(ea)}`;

    elA.textContent = fmtCourt(a);
    elFacteur.textContent = fmt(ea);
    /* relation fonctionnelle instanciée, en une ligne mono */
    const aTxt = fmtCourt(Math.abs(a));
    const signe = a < 0 ? '−' : '+';
    ligne.textContent = `e^(x ${signe} ${aTxt}) = e^(${a < 0 ? '−' : ''}${aTxt}) × e^x ≈ ${fmt(ea)} × e^x`;

    if (a > 1e-9) {
      elEtat.textContent = `a > 0 — facteur ${fmt(ea)} : la courbe s'élève`;
      elEtat.className = 'chip chip--good js-etat';
      legende.textContent = `Décaler la courbe de ${aTxt} vers la gauche, c'est exactement la multiplier par e^${aTxt} ≈ ${fmt(ea)}. Même geste, deux lectures.`;
    } else if (a < -1e-9) {
      elEtat.textContent = `a < 0 — facteur ${fmt(ea)} : la courbe s'écrase`;
      elEtat.className = 'chip chip--bad js-etat';
      legende.textContent = `Décaler la courbe de ${aTxt} vers la droite, c'est la multiplier par e^(−${aTxt}) ≈ ${fmt(ea)} — un facteur plus petit que 1, la courbe s'écrase.`;
    } else {
      elEtat.textContent = 'a = 0 — les deux courbes se confondent';
      elEtat.className = 'chip chip--accent js-etat';
      legende.textContent = 'Aucun décalage : e⁰ = 1, la courbe est multipliée par 1. Les deux courbes n’en font qu’une.';
    }

    if (parseFloat(curseur.value) !== a) curseur.value = String(a);
    const min = parseFloat(curseur.min);
    const max = parseFloat(curseur.max);
    curseur.style.setProperty('--pos', (((a - min) / (max - min)) * 100) + '%');
    curseur.setAttribute('aria-valuetext', `a = ${fmtCourt(a)}, facteur e puissance a = ${fmt(Math.exp(a))}`);
  }

  function interaction() {
    track('widget_interact', { widget: 'exp-decale', chapitre });
  }

  /* au plus un rendu par frame pendant un drag de curseur */
  let renduPlanifie = 0;
  function planifierRendu() {
    if (!renduPlanifie) renduPlanifie = requestAnimationFrame(() => { renduPlanifie = 0; rendre(); });
  }

  curseur.addEventListener('input', () => {
    a = clamp(parseFloat(curseur.value), parseFloat(curseur.min), parseFloat(curseur.max));
    interaction();
    planifierRendu();
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    a = aInit;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="exp-decale"]')) initExpDecale(fig);
