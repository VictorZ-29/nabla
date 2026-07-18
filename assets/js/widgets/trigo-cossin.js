/* Nabla — widgets/trigo-cossin.js
   « Les deux coordonnées de M » : le point M se déplace librement sur le
   cercle trigonométrique ; ses projections sur les axes donnent cos t
   (abscisse) et sin t (ordonnée), et la puce cos²t + sin²t = 1,00 vérifie
   l'identité en direct. Aimant d'affichage : près d'un multiple de π/12,
   la valeur RENDUE se cale dessus (le drag reste libre) ; sur un angle
   remarquable, la légende donne les valeurs exactes.
   Spec de l'instance : premiere/maths/trigonometrie/README.md. */

import { el, creerVue, clamp, fmt, rendreDraggable, creerHint } from '../nabla-graph.js';
import {
  DOUZIEME, FENETRE, decorCercle, fmtPi, cosExact, sinExact, angleDePointeur,
} from './trigo-cercle.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';
const AIMANT = 0.04;                   // rayon de capture autour d'un π/12

function initCossin(fig) {
  const tInit = parseFloat(fig.dataset.kInit) * DOUZIEME;
  let t = tInit;

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, FENETRE);
  decorCercle(svg, vue);

  /* --- éléments dynamiques (guides sous le point) -------------------------- */
  const guides = el('path', { class: 'g-guide', 'stroke-dasharray': '4 4' }, svg);
  const rayon = el('path', { class: 'g-guide' }, svg);
  const labUn = el('text', {
    class: 'etiquette-math etiquette-math--muted', 'font-size': 13,
  }, svg);
  labUn.textContent = '1';
  const segCos = el('path', { class: 'g-tangente' }, svg);
  const segSin = el('path', { class: 'g-tangente' }, svg);
  const labCos = el('text', {
    class: 'etiquette-math etiquette-math--accent', 'font-size': 14, 'text-anchor': 'middle',
  }, svg);
  labCos.textContent = 'cos t';
  const labSin = el('text', {
    class: 'etiquette-math etiquette-math--accent', 'font-size': 14,
  }, svg);
  labSin.textContent = 'sin t';
  const halo = el('circle', { class: 'pt-halo', r: 12 }, svg);
  const ptM = el('circle', { class: 'pt-point', r: 5.5 }, svg);
  const labM = el('text', { class: 'etiquette-math', 'font-size': 17 }, svg);
  labM.textContent = 'M';

  /* indice « glisse-moi » près de M initial */
  const mx0 = vue.xPx(Math.cos(tInit));
  const my0 = vue.yPx(Math.sin(tInit));
  const hint = creerHint(svg, {
    x: mx0 + 26, y: my0 - 56,
    filDe: [mx0 + 28, my0 - 34], filVers: [mx0 + 6, my0 - 6],
  });

  const hit = el('circle', {
    class: 'hit-zone', r: 42,
    tabindex: 0, role: 'slider', 'aria-orientation': 'horizontal',
    'aria-label': 'Point M sur le cercle : angle t en radians',
    'aria-valuemin': '-3.14', 'aria-valuemax': '3.14',
  }, svg);

  /* --- lectures ------------------------------------------------------------ */
  const elT = fig.querySelector('.js-t');
  const elCos = fig.querySelector('.js-cos');
  const elSin = fig.querySelector('.js-sin');
  const elUn = fig.querySelector('.js-un');
  const legende = fig.querySelector('.js-legende');

  function rendre() {
    /* aimant d'affichage : le rendu se cale sur le multiple de π/12 proche */
    const kProche = Math.round(t / DOUZIEME);
    const aimante = Math.abs(t - kProche * DOUZIEME) < AIMANT;
    const tAff = aimante ? kProche * DOUZIEME : t;
    const c = Math.cos(tAff);
    const s = Math.sin(tAff);
    const mx = vue.xPx(c);
    const my = vue.yPx(s);

    guides.setAttribute('d', `M${mx} ${my}L${mx} ${vue.yPx(0)}M${mx} ${my}L${vue.xPx(0)} ${my}`);
    rayon.setAttribute('d', `M${vue.xPx(0)} ${vue.yPx(0)}L${mx} ${my}`);
    labUn.setAttribute('x', vue.xPx(0.5 * c) + (s >= 0 ? 8 : -14));
    labUn.setAttribute('y', vue.yPx(0.5 * s) + (s >= 0 ? 16 : -8));
    segCos.setAttribute('d', `M${vue.xPx(0)} ${vue.yPx(0)}L${mx} ${vue.yPx(0)}`);
    segSin.setAttribute('d', `M${vue.xPx(0)} ${vue.yPx(0)}L${vue.xPx(0)} ${my}`);
    labCos.setAttribute('x', vue.xPx(c / 2));
    labCos.setAttribute('y', vue.yPx(0) + (s >= 0 ? 22 : -12));
    labSin.setAttribute('text-anchor', c >= 0 ? 'end' : 'start');
    labSin.setAttribute('x', vue.xPx(0) + (c >= 0 ? -10 : 10));
    labSin.setAttribute('y', vue.yPx(s / 2) + 5);
    halo.setAttribute('cx', mx);
    halo.setAttribute('cy', my);
    ptM.setAttribute('cx', mx);
    ptM.setAttribute('cy', my);
    hit.setAttribute('cx', mx);
    hit.setAttribute('cy', my);
    labM.setAttribute('x', vue.xPx(1.13 * c) - 6);
    labM.setAttribute('y', vue.yPx(1.13 * s) + 6);

    elT.textContent = aimante ? fmtPi(kProche) : fmt(tAff);
    elCos.textContent = fmt(c);
    elSin.textContent = fmt(s);
    elUn.textContent = fmt(c * c + s * s);

    const quart = c > 1e-9 && s > 1e-9 ? 'en haut à droite : cos t > 0 et sin t > 0'
      : c < -1e-9 && s > 1e-9 ? 'en haut à gauche : cos t < 0 et sin t > 0'
      : c < -1e-9 && s < -1e-9 ? 'en bas à gauche : cos t < 0 et sin t < 0'
      : c > 1e-9 && s < -1e-9 ? 'en bas à droite : cos t > 0 et sin t < 0'
      : 'sur un axe : une des deux coordonnées est nulle';
    const cEx = aimante ? cosExact(kProche) : null;
    const sEx = aimante ? sinExact(kProche) : null;
    if (cEx !== null && sEx !== null) {
      legende.textContent = `Angle remarquable — valeurs exactes : cos(${fmtPi(kProche)}) = ${cEx} et sin(${fmtPi(kProche)}) = ${sEx}. Les puces affichent leurs arrondis.`;
    } else {
      legende.textContent = `M est ${quart}. Le rayon [OM] mesure 1 : dans le triangle rectangle, Pythagore donne cos²t + sin²t = 1.`;
    }

    hit.setAttribute('aria-valuenow', String(Math.round(tAff * 100) / 100));
    hit.setAttribute('aria-valuetext', `t = ${aimante ? fmtPi(kProche) : fmt(tAff)} rad, cos t = ${fmt(c)}, sin t = ${fmt(s)}`);
  }

  function interaction() {
    hint.style.display = 'none';
    track('widget_interact', { widget: 'trigo-cossin', chapitre });
  }

  rendreDraggable(hit, {
    surDebut() { fig.classList.add('drag-actif'); interaction(); },
    surDeplacement(evt) {
      t = angleDePointeur(vue, evt);
      rendre();
    },
    surFin() { fig.classList.remove('drag-actif'); },
  });

  hit.addEventListener('keydown', (e) => {
    const pas = e.shiftKey ? 0.01 : 0.05;
    let cible = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') cible = t + pas;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') cible = t - pas;
    else if (e.key === 'Home') cible = -Math.PI;
    else if (e.key === 'End') cible = Math.PI;
    if (cible === null) return;
    e.preventDefault();
    t = clamp(cible, -Math.PI, Math.PI);
    interaction();
    rendre();
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    t = tInit;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="trigo-cossin"]')) initCossin(fig);
