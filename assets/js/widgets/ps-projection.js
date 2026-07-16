/* Nabla — widgets/ps-projection.js
   « L'ombre qui fait le produit » : u⃗ est fixé (norme 4, horizontal), on
   fait tourner v⃗ (norme 3) autour de O. L'ombre de v⃗ sur la droite qui
   porte u⃗ — le projeté orthogonal — s'étire, disparaît à 90°, repart à
   reculons au-delà. Le produit scalaire, c'est ‖u⃗‖ × (ombre signée) :
   positif, nul ou négatif selon l'angle. Seul l'angle bouge : toutes les
   valeurs affichées sont exactes aux arrondis d'affichage près, et les
   préréglages 60° / 90° / 120° tombent sur 6 / 0 / −6.
   Spec de l'instance : premiere/maths/produit-scalaire/README.md. */

import {
  el, creerVue, grilleUnite, axes, clamp, fmt, animerValeur, rendreDraggable,
  creerHint, creerVecteur, etiquetteVecteur,
} from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';
const RAD = Math.PI / 180;

function initPsProjection(fig) {
  const d = fig.dataset;
  const nu = parseFloat(d.nu);            // ‖u⃗‖ (fixée)
  const nv = parseFloat(d.nv);            // ‖v⃗‖ (fixée)
  const thetaInit = parseFloat(d.thetaInit);
  let theta = thetaInit;                  // angle (u⃗ ; v⃗) en degrés, [0 ; 180]

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, {
    xMin: +d.xmin, xMax: +d.xmax, yMin: +d.ymin, yMax: +d.ymax,
  });
  const ox = vue.xPx(0);
  const oy = vue.yPx(0);
  const pxU = vue.pxParX;                 // unités carrées : pxParX = pxParY

  /* --- décor statique ----------------------------------------------------- */
  el('path', { class: 'g-grid', d: grilleUnite(vue) }, svg);
  el('path', { class: 'g-axis', d: axes(vue) }, svg);
  const vecU = creerVecteur(svg, { classeTrait: 'g-courbe', classePointe: 'vec-pointe' });
  vecU.maj(ox, oy, vue.xPx(nu), oy);
  const labU = etiquetteVecteur(svg, 'u');
  labU.maj(vue.xPx(nu) - 24, oy + 36);
  const labO = el('text', {
    class: 'etiquette-math etiquette-math--muted', 'font-size': 15,
    x: ox - 14, y: oy + 24, 'text-anchor': 'end',
  }, svg);
  labO.textContent = 'O';

  /* --- éléments dynamiques (ordre = ordre de superposition) ---------------- */
  const ombre = el('path', { class: 'g-courbe-derivee' }, svg);      // [OH] épais
  const chute = el('path', { class: 'g-guide', 'stroke-dasharray': '4 4' }, svg);
  const arc = el('path', { class: 'arc-angle' }, svg);
  const labTheta = el('text', {
    class: 'etiquette-mono etiquette-math--accent', 'font-size': 12.5,
    'text-anchor': 'middle',
  }, svg);
  const ptH = el('circle', { class: 'pt-derivee', r: 4.5 }, svg);
  const labH = el('text', {
    class: 'etiquette-math etiquette-math--muted', 'font-size': 15,
    'text-anchor': 'middle',
  }, svg);
  labH.textContent = 'H';
  const vecV = creerVecteur(svg, { classeTrait: 'g-courbe-derivee', classePointe: 'vec-pointe--accent' });
  const labV = etiquetteVecteur(svg, 'v', 'accent');
  const halo = el('circle', { class: 'pt-halo', r: 12 }, svg);
  const ptB = el('circle', { class: 'pt-point', r: 5.5 }, svg);

  const bx0 = ox + nv * pxU * Math.cos(thetaInit * RAD);
  const by0 = oy - nv * pxU * Math.sin(thetaInit * RAD);
  const hint = creerHint(svg, {
    x: bx0 + 22.4, y: by0 - 59.1,
    filDe: [bx0 + 24.4, by0 - 37.1], filVers: [bx0 + 5.4, by0 - 6.1],
  });

  const hit = el('circle', {
    class: 'hit-zone', r: 42,
    tabindex: 0, role: 'slider', 'aria-orientation': 'horizontal',
    'aria-label': 'Angle entre les vecteurs u et v, en degrés',
    'aria-valuemin': '0', 'aria-valuemax': '180',
  }, svg);

  /* --- lectures ------------------------------------------------------------ */
  const ligne1 = fig.querySelector('.js-ligne1');
  const ligne2 = fig.querySelector('.js-ligne2');
  const elTheta = fig.querySelector('.js-theta');
  const elProduit = fig.querySelector('.js-produit');
  const elEtat = fig.querySelector('.js-etat');
  const legende = fig.querySelector('.js-legende');
  const presets = [...fig.querySelectorAll('.segmente button')];

  function rendre() {
    const deg = Math.round(theta);        // les lectures parlent en degrés entiers
    const cosT = Math.cos(theta * RAD);
    const sinT = Math.sin(theta * RAD);
    const oh = nv * cosT;                 // mesure signée de l'ombre
    const produit = nu * oh;
    const bx = ox + nv * pxU * cosT;
    const by = oy - nv * pxU * sinT;
    const hx = ox + nv * pxU * cosT;

    vecV.maj(ox, oy, bx, by);
    labV.maj(clamp(ox + (nv * pxU + 26) * cosT, 14, vue.largeur - 14),
             clamp(oy - (nv * pxU + 26) * sinT + 6, 30, vue.hauteur - 8));
    chute.setAttribute('d', `M${bx} ${by}L${hx} ${oy}`);
    ombre.setAttribute('d', `M${ox} ${oy}L${hx} ${oy}`);
    ptH.setAttribute('cx', hx); ptH.setAttribute('cy', oy);
    labH.setAttribute('x', hx); labH.setAttribute('y', oy + 24);
    labH.style.display = Math.abs(hx - ox) < 14 ? 'none' : '';

    /* arc d'angle au sommet O, rayon 36 px */
    const r = 36;
    arc.setAttribute('d',
      `M${ox + r} ${oy}A${r} ${r} 0 0 0 ${ox + r * cosT} ${oy - r * sinT}`);
    labTheta.setAttribute('x', ox + 54 * Math.cos((theta / 2) * RAD));
    labTheta.setAttribute('y', oy - 54 * Math.sin((theta / 2) * RAD) + 4);
    labTheta.textContent = `${deg}°`;

    halo.setAttribute('cx', bx); halo.setAttribute('cy', by);
    ptB.setAttribute('cx', bx); ptB.setAttribute('cy', by);
    hit.setAttribute('cx', bx); hit.setAttribute('cy', by);

    /* lectures : projection d'abord (le geste), cosinus ensuite (la formule) */
    const ohParen = oh < 0 ? `(${fmt(oh)})` : fmt(oh);
    ligne1.textContent = `u·v = ${fmt(nu, 0)} × OH = ${fmt(nu, 0)} × ${ohParen} = ${fmt(produit)}`;
    ligne2.textContent = `OH = ${fmt(nv, 0)} × cos(${deg}°) = ${fmt(oh)}`;
    elTheta.textContent = `${deg}°`;
    elProduit.textContent = fmt(produit);

    if (produit > 0.005) {
      elEtat.textContent = 'angle aigu — produit positif';
      elEtat.className = 'chip chip--good js-etat';
    } else if (produit < -0.005) {
      elEtat.textContent = 'angle obtus — produit négatif';
      elEtat.className = 'chip chip--bad js-etat';
    } else {
      elEtat.textContent = 'angle droit — produit nul';
      elEtat.className = 'chip chip--accent js-etat';
    }

    if (deg === 0) {
      legende.textContent = 'Angle nul : v tire exactement dans le sens de u. L’ombre est v tout entier, le produit est maximal.';
    } else if (deg === 180) {
      legende.textContent = 'Angle plat : v tire exactement à contresens. L’ombre est retournée, le produit est minimal.';
    } else if (produit > 0.005) {
      legende.textContent = 'Angle aigu : l’ombre tombe du côté de u, le produit scalaire est positif.';
    } else if (produit < -0.005) {
      legende.textContent = 'Angle obtus : l’ombre part à reculons, le produit scalaire est négatif.';
    } else {
      legende.textContent = 'À 90°, l’ombre disparaît : produit scalaire nul. Les deux vecteurs sont orthogonaux — retiens ce cas, il porte toute la section 4.';
    }

    for (const b of presets) {
      b.setAttribute('aria-pressed', String(Math.abs(theta - parseFloat(b.dataset.theta)) < 1e-9));
    }

    hit.setAttribute('aria-valuenow', String(deg));
    hit.setAttribute('aria-valuetext', `angle ${deg} degrés, produit scalaire ${fmt(produit)}`);
  }

  function interaction() {
    hint.style.display = 'none';
    track('widget_interact', { widget: 'ps-projection', chapitre });
  }

  /* --- drag : l'angle sous le pointeur, borné au demi-plan supérieur -------- */
  let animation = null;
  rendreDraggable(hit, {
    surDebut() {
      if (animation) { animation.stop(); animation = null; }
      fig.classList.add('drag-actif');
      interaction();
    },
    surDeplacement(evt) {
      const rect = svg.getBoundingClientRect();
      const px = ((evt.clientX - rect.left) / rect.width) * vue.largeur;
      const py = ((evt.clientY - rect.top) / rect.height) * vue.hauteur;
      const x = px - ox;
      const y = Math.max(0, oy - py);     // sous l'axe : rabattu sur 0° ou 180°
      theta = clamp(Math.round(Math.atan2(y, x) / RAD), 0, 180);
      rendre();
    },
    surFin() { fig.classList.remove('drag-actif'); },
  });

  /* clavier : flèches ±5°, Maj ±1°, Home/End = 0°/180° */
  hit.addEventListener('keydown', (e) => {
    const pas = e.shiftKey ? 1 : 5;
    let cible = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') cible = theta + pas;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') cible = theta - pas;
    else if (e.key === 'Home') cible = 0;
    else if (e.key === 'End') cible = 180;
    if (cible === null) return;
    e.preventDefault();
    if (animation) { animation.stop(); animation = null; }
    theta = clamp(Math.round(cible), 0, 180);
    interaction();
    rendre();
  });

  /* préréglages animés (60° / 90° / 120°) */
  for (const btn of presets) {
    btn.addEventListener('click', () => {
      if (animation) animation.stop();
      interaction();
      animation = animerValeur({
        de: theta, vers: parseFloat(btn.dataset.theta),
        surFrame(v) { theta = v; rendre(); },
        surFin() { animation = null; },
      });
    });
  }

  fig.querySelector('.js-reset').addEventListener('click', () => {
    if (animation) { animation.stop(); animation = null; }
    theta = thetaInit;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="ps-projection"]')) initPsProjection(fig);
