/* Nabla — widgets/exp-pente.js
   « La pente, c'est la hauteur » : un point A déplaçable sur la courbe de
   exp, la tangente en A, et la lecture qui fait le chapitre : f′(a) = f(a),
   partout. Bonus dessiné : la tangente coupe l'axe des abscisses exactement
   1 unité à gauche de a (sous-tangente = 1), donc pente = hauteur / 1.
   Spec de l'instance : premiere/maths/exponentielle/README.md. */

import {
  FONCTIONS, el, creerVue, cheminCourbe, grilleUnite, axes,
  clamp, fmt, rendreDraggable, creerHint,
} from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

function initExpPente(fig) {
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
  const labF = el('text', { class: 'etiquette-math', 'font-size': 18, x: 30, y: 30 }, svg);
  labF.textContent = 'exp';
  el('path', { class: 'g-courbe', d: cheminCourbe(vue, f, domMin, domMax) }, svg);

  /* --- éléments dynamiques -------------------------------------------------- */
  const tangente = el('path', { class: 'g-tangente' }, svg);
  /* hauteur de A (pointillé) + base de largeur 1 sous l'axe : le triangle de
     lecture — pente = hauteur / 1 */
  const hauteur = el('path', { class: 'g-guide', 'stroke-dasharray': '4 4' }, svg);
  const labUn = el('text', {
    class: 'etiquette-math etiquette-math--muted', 'font-size': 14, 'text-anchor': 'middle',
  }, svg);
  labUn.textContent = '1';
  const ptBase = el('circle', { class: 'pt-fixe', r: 4 }, svg);
  const labH = el('text', {
    class: 'etiquette-math etiquette-math--accent', 'font-size': 14,
  }, svg);
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

  const hit = el('circle', {
    class: 'hit-zone', r: 42,
    tabindex: 0, role: 'slider', 'aria-orientation': 'horizontal',
    'aria-label': 'Abscisse a du point A sur la courbe de exp',
    'aria-valuemin': String(domMin), 'aria-valuemax': String(domMax),
  }, svg);

  /* --- lectures ------------------------------------------------------------ */
  const elA = fig.querySelector('.js-a');
  const elFa = fig.querySelector('.js-fa');
  const elFpa = fig.querySelector('.js-fpa');

  function rendre() {
    const fa = f(a);
    const pente = fp(a);
    const ax = vue.xPx(a);
    const ay = vue.yPx(fa);
    const y0 = vue.yPx(0);

    /* tangente sur toute la vue */
    const t0 = fa + pente * (vue.xMin - a);
    const t1 = fa + pente * (vue.xMax - a);
    tangente.setAttribute('d', `M0 ${vue.yPx(t0)}L${vue.largeur} ${vue.yPx(t1)}`);

    /* triangle de lecture : la tangente coupe l'axe des abscisses en a − 1
       (sous-tangente = 1) ; la hauteur en pointillé ferme le triangle.
       pente = hauteur / 1 = hauteur. */
    const bx = vue.xPx(a - 1);
    ptBase.setAttribute('cx', bx); ptBase.setAttribute('cy', y0);
    hauteur.setAttribute('d', `M${ax} ${y0}L${ax} ${ay}`);
    labUn.setAttribute('x', (ax + bx) / 2);
    labUn.setAttribute('y', y0 + 19);
    labH.setAttribute('x', ax + 9);
    labH.setAttribute('y', (y0 + ay) / 2 + 5);
    labH.textContent = fmt(fa);

    halo.setAttribute('cx', ax); halo.setAttribute('cy', ay);
    ptA.setAttribute('cx', ax); ptA.setAttribute('cy', ay);
    hit.setAttribute('cx', ax); hit.setAttribute('cy', ay);
    labA.setAttribute('x', clamp(ax - 24, 8, vue.largeur - 18));
    labA.setAttribute('y', clamp(ay - 12, 16, vue.hauteur - 6));

    elA.textContent = fmt(a);
    elFa.textContent = fmt(fa);
    elFpa.textContent = fmt(pente);

    hit.setAttribute('aria-valuenow', String(Math.round(a * 100) / 100));
    hit.setAttribute('aria-valuetext', `a = ${fmt(a)}, hauteur et pente = ${fmt(fa)}`);
  }

  function interaction() {
    hint.style.display = 'none';
    track('widget_interact', { widget: 'exp-pente', chapitre });
  }

  rendreDraggable(hit, {
    surDebut() { fig.classList.add('drag-actif'); interaction(); },
    surDeplacement(evt) {
      a = clamp(vue.xDePointeur(evt), domMin, domMax);
      rendre();
    },
    surFin() { fig.classList.remove('drag-actif'); },
  });

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

  fig.querySelector('.js-reset').addEventListener('click', () => {
    a = aInit;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="exp-pente"]')) initExpPente(fig);
