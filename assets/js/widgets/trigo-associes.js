/* Nabla — widgets/trigo-associes.js
   « Les angles associés » : M(t) se déplace dans le premier quart du cercle ;
   les segments du haut choisissent l'angle associé (−t, π − t, π + t,
   π/2 − t). Le point M′ est le symétrique de M, l'axe (ou le centre) de la
   symétrie est tracé, et les deux lignes mono instancient cos/sin de l'angle
   associé — en valeurs exactes quand t est sur π/6, π/4 ou π/3 (aimant
   d'affichage π/12, comme trigo-cossin).
   Spec de l'instance : premiere/maths/trigonometrie/README.md. */

import { el, creerVue, clamp, fmt, rendreDraggable, creerHint } from '../nabla-graph.js';
import {
  DOUZIEME, FENETRE, decorCercle, fmtPi, cosExact, sinExact, angleDePointeur,
} from './trigo-cercle.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';
const AIMANT = 0.04;
const DOM_MIN = 0.06;
const DOM_MAX = Math.PI / 2 - 0.06;

/* Chaque mode : angle associé (en douzièmes et en radians), symétrie à
   tracer, et les deux formules cos/sin — [source 'cos'|'sin', signe]. */
const MODES = {
  oppose: {
    kDe: (k) => -k, tDe: (t) => -t,
    nom: "symétrie d'axe (Ox) — l'axe des abscisses",
    axe: 'horizontal', tete: '−t',
    cos: ['cos', 1], sin: ['sin', -1],
    phrase: "M′ est le reflet de M dans l'axe horizontal : même abscisse (cos conservé), hauteur retournée (sin change de signe).",
  },
  piMoins: {
    kDe: (k) => 12 - k, tDe: (t) => Math.PI - t,
    nom: "symétrie d'axe (Oy) — l'axe des ordonnées",
    axe: 'vertical', tete: 'π − t',
    cos: ['cos', -1], sin: ['sin', 1],
    phrase: "M′ est le reflet de M dans l'axe vertical : même hauteur (sin conservé), abscisse retournée (cos change de signe).",
  },
  piPlus: {
    kDe: (k) => 12 + k, tDe: (t) => Math.PI + t,
    nom: 'symétrie de centre O',
    axe: 'centre', tete: 'π + t',
    cos: ['cos', -1], sin: ['sin', -1],
    phrase: 'M′ est diamétralement opposé à M : les deux coordonnées changent de signe.',
  },
  complementaire: {
    kDe: (k) => 6 - k, tDe: (t) => Math.PI / 2 - t,
    nom: "symétrie d'axe la diagonale y = x",
    axe: 'diagonale', tete: 'π/2 − t',
    cos: ['sin', 1], sin: ['cos', 1],
    phrase: "M′ est le reflet de M dans la diagonale : abscisse et ordonnée s'échangent — le cosinus de l'un est le sinus de l'autre.",
  },
};

function initAssocies(fig) {
  const tInit = parseFloat(fig.dataset.kInit) * DOUZIEME;
  const modeInit = fig.dataset.modeInit;
  let t = tInit;
  let mode = modeInit;

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, FENETRE);
  decorCercle(svg, vue);

  /* --- éléments dynamiques ------------------------------------------------- */
  const axeSym = el('path', { class: 'g-guide-accent', 'stroke-dasharray': '6 5' }, svg);
  const lien = el('path', { class: 'g-guide', 'stroke-dasharray': '3 4' }, svg);
  const rayonM = el('path', { class: 'g-guide' }, svg);
  const rayonMp = el('path', { class: 'g-guide' }, svg);
  const halo = el('circle', { class: 'pt-halo', r: 12 }, svg);
  const ptM = el('circle', { class: 'pt-point', r: 5.5 }, svg);
  const labM = el('text', { class: 'etiquette-math', 'font-size': 17 }, svg);
  labM.textContent = 'M';
  const ptMp = el('circle', { class: 'pt-b', r: 5.5 }, svg);
  const labMp = el('text', { class: 'etiquette-math etiquette-math--accent', 'font-size': 17 }, svg);
  labMp.textContent = 'M′';

  const mx0 = vue.xPx(Math.cos(tInit));
  const my0 = vue.yPx(Math.sin(tInit));
  const hint = creerHint(svg, {
    x: mx0 + 26, y: my0 - 56,
    filDe: [mx0 + 28, my0 - 34], filVers: [mx0 + 6, my0 - 6],
  });

  const hit = el('circle', {
    class: 'hit-zone', r: 42,
    tabindex: 0, role: 'slider', 'aria-orientation': 'horizontal',
    'aria-label': 'Point M sur le premier quart du cercle : angle t en radians',
    'aria-valuemin': String(Math.round(DOM_MIN * 100) / 100),
    'aria-valuemax': String(Math.round(DOM_MAX * 100) / 100),
  }, svg);

  /* --- lectures et contrôles ----------------------------------------------- */
  const elT = fig.querySelector('.js-t');
  const elTp = fig.querySelector('.js-tp');
  const elEtat = fig.querySelector('.js-etat');
  const ligneCos = fig.querySelector('.js-ligne-cos');
  const ligneSin = fig.querySelector('.js-ligne-sin');
  const legende = fig.querySelector('.js-legende');
  const modesBtn = [...fig.querySelectorAll('.segmente button')];

  /* « cos(5π/6) = −cos(π/6) = −√3/2 » ou, hors aimant, en décimales. */
  function ligne(quoi, m, kAff, aimante, tAff) {
    const src = m[quoi][0];
    const signe = m[quoi][1] < 0 ? '−' : '';
    const tp = m.tDe(tAff);
    const gauche = aimante ? fmtPi(m.kDe(kAff)) : fmt(tp);
    const droite = aimante ? fmtPi(kAff) : fmt(tAff);
    let exacte = null;
    if (aimante) {
      const brute = src === 'cos' ? cosExact(kAff) : sinExact(kAff);
      if (brute !== null) exacte = m[quoi][1] < 0 ? '−' + brute : brute;
    }
    const valeur = exacte !== null ? exacte
      : fmt(quoi === 'cos' ? Math.cos(tp) : Math.sin(tp));
    return `${quoi}(${gauche}) = ${signe}${src}(${droite}) = ${valeur}`;
  }

  function rendre() {
    const kProche = Math.round(t / DOUZIEME);
    const aimante = Math.abs(t - kProche * DOUZIEME) < AIMANT;
    const tAff = aimante ? kProche * DOUZIEME : t;
    const m = MODES[mode];
    const tp = m.tDe(tAff);
    const mx = vue.xPx(Math.cos(tAff));
    const my = vue.yPx(Math.sin(tAff));
    const px = vue.xPx(Math.cos(tp));
    const py = vue.yPx(Math.sin(tp));

    if (m.axe === 'horizontal') {
      axeSym.setAttribute('d', `M${vue.xPx(-1.22)} ${vue.yPx(0)}L${vue.xPx(1.22)} ${vue.yPx(0)}`);
    } else if (m.axe === 'vertical') {
      axeSym.setAttribute('d', `M${vue.xPx(0)} ${vue.yPx(-1.18)}L${vue.xPx(0)} ${vue.yPx(1.18)}`);
    } else if (m.axe === 'diagonale') {
      axeSym.setAttribute('d', `M${vue.xPx(-1.14)} ${vue.yPx(-1.14)}L${vue.xPx(1.14)} ${vue.yPx(1.14)}`);
    } else {
      axeSym.setAttribute('d', `M${mx} ${my}L${px} ${py}`);
    }
    lien.setAttribute('d', m.axe === 'centre' ? '' : `M${mx} ${my}L${px} ${py}`);
    rayonM.setAttribute('d', `M${vue.xPx(0)} ${vue.yPx(0)}L${mx} ${my}`);
    rayonMp.setAttribute('d', `M${vue.xPx(0)} ${vue.yPx(0)}L${px} ${py}`);
    halo.setAttribute('cx', mx);
    halo.setAttribute('cy', my);
    ptM.setAttribute('cx', mx);
    ptM.setAttribute('cy', my);
    hit.setAttribute('cx', mx);
    hit.setAttribute('cy', my);
    labM.setAttribute('x', vue.xPx(1.14 * Math.cos(tAff)) - 5);
    labM.setAttribute('y', vue.yPx(1.14 * Math.sin(tAff)) + 6);
    ptMp.setAttribute('cx', px);
    ptMp.setAttribute('cy', py);
    labMp.setAttribute('x', vue.xPx(1.16 * Math.cos(tp)) - 9);
    labMp.setAttribute('y', vue.yPx(1.16 * Math.sin(tp)) + 6);

    elT.textContent = aimante ? fmtPi(kProche) : fmt(tAff);
    elTp.textContent = aimante ? fmtPi(m.kDe(kProche)) : fmt(tp);
    elEtat.textContent = m.nom;
    ligneCos.textContent = ligne('cos', m, kProche, aimante, tAff);
    ligneSin.textContent = ligne('sin', m, kProche, aimante, tAff);
    legende.textContent = m.phrase + (aimante && cosExact(kProche) !== null
      ? ' Ici t est remarquable : les deux lignes sont exactes.'
      : ' Les signes se lisent sur le dessin — pas besoin de les apprendre par cœur.');

    hit.setAttribute('aria-valuenow', String(Math.round(tAff * 100) / 100));
    hit.setAttribute('aria-valuetext', `t = ${aimante ? fmtPi(kProche) : fmt(tAff)} rad, angle associé ${m.tete}`);

    for (const btn of modesBtn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.mode === mode));
    }
  }

  function interaction() {
    hint.style.display = 'none';
    track('widget_interact', { widget: 'trigo-associes', chapitre });
  }

  rendreDraggable(hit, {
    surDebut() { fig.classList.add('drag-actif'); interaction(); },
    surDeplacement(evt) {
      t = clamp(angleDePointeur(vue, evt), DOM_MIN, DOM_MAX);
      rendre();
    },
    surFin() { fig.classList.remove('drag-actif'); },
  });

  hit.addEventListener('keydown', (e) => {
    const pas = e.shiftKey ? 0.01 : 0.05;
    let cible = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') cible = t + pas;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') cible = t - pas;
    else if (e.key === 'Home') cible = DOM_MIN;
    else if (e.key === 'End') cible = DOM_MAX;
    if (cible === null) return;
    e.preventDefault();
    t = clamp(cible, DOM_MIN, DOM_MAX);
    interaction();
    rendre();
  });

  for (const btn of modesBtn) {
    btn.addEventListener('click', () => {
      mode = btn.dataset.mode;
      interaction();
      rendre();
    });
  }

  fig.querySelector('.js-reset').addEventListener('click', () => {
    t = tInit;
    mode = modeInit;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="trigo-associes"]')) initAssocies(fig);
