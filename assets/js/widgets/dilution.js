/* Nabla — widgets/dilution.js
   « Allonge le sirop » : un curseur sur le volume total V verse de l'eau
   dans le verre. La quantité de soluté n ne bouge pas (la pastille le
   martèle), le niveau monte, la couleur pâlit : c = n/V chute. Préréglage
   accent « la menthe à l'eau » (V = 200 mL) animé par animerValeur.
   La ligne de calcul écrit c = n / V avec « = » quand la division tombe
   juste, « ≈ » sinon (l'affichage est arrondi, jamais menteur).
   Spec : premiere/physique-chimie/composition-systeme/README.md. */

import { el, clamp, fmt, fmtAdaptatif, fmtCourt, animerValeur } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

/* Géométrie du SVG (viewBox 640 × 330) : verre à gauche, jauge de
   concentration à droite. */
const V_HAUT = 42;      /* y du bord du verre */
const V_BAS = 288;      /* y du fond (intérieur) */
const V_G = 150;        /* x du bord gauche intérieur */
const V_D = 330;        /* x du bord droit intérieur */
const J_X = 470;        /* jauge : bord gauche */
const J_LARG = 46;
const J_HAUT = 62;
const J_BAS = 288;

function initDilution(fig) {
  const d = fig.dataset;
  const n = parseFloat(d.n);            /* mol de soluté, invariant */
  const vInit = parseFloat(d.vInit);    /* mL */
  const vMin = parseFloat(d.vMin);
  const vMax = parseFloat(d.vMax);
  const cMax = n / (vMin / 1000);       /* concentration du sirop pur = haut de jauge */
  let v = vInit;
  let animation = null;

  const svg = fig.querySelector('svg');

  /* --- décor statique ------------------------------------------------------ */
  /* le verre : parois et fond (ouvert en haut) */
  el('path', {
    class: 'dil-verre',
    d: `M${V_G - 8} ${V_HAUT - 10}L${V_G - 8} ${V_BAS}Q${V_G - 8} ${V_BAS + 12} ${V_G + 4} ${V_BAS + 12}L${V_D - 4} ${V_BAS + 12}Q${V_D + 8} ${V_BAS + 12} ${V_D + 8} ${V_BAS}L${V_D + 8} ${V_HAUT - 10}`,
  }, svg);
  const liquide = el('rect', {
    class: 'dil-liquide', x: V_G, width: V_D - V_G, y: V_BAS, height: 0,
  }, svg);
  /* graduations tous les 50 mL */
  const pxParMl = (V_BAS - V_HAUT) / vMax;
  for (let g = 50; g <= vMax; g += 50) {
    const y = (V_BAS - g * pxParMl).toFixed(1);
    el('path', { class: 'g-grid', d: `M${V_D + 8} ${y}L${V_D + 22} ${y}` }, svg);
    const t = el('text', { class: 'avc-candidat', x: V_D + 28, y: +y + 4 }, svg);
    t.textContent = `${g} mL`;
  }
  /* la jauge de concentration (fond + remplissage accent) */
  el('rect', { class: 'jauge-fond', x: J_X, y: J_HAUT, width: J_LARG, height: J_BAS - J_HAUT, rx: 4 }, svg);
  const jauge = el('rect', { class: 'jauge-plein', x: J_X + 3, width: J_LARG - 6, y: J_BAS - 3, height: 0, rx: 2 }, svg);
  const titreJauge = el('text', { class: 'avc-nom', x: J_X + J_LARG / 2, y: J_BAS + 24, 'text-anchor': 'middle' }, svg);
  titreJauge.textContent = 'concentration';
  const lectJauge = el('text', { class: 'avc-valeur', x: J_X + J_LARG / 2, y: J_HAUT - 12, 'text-anchor': 'middle' }, svg);

  /* --- lectures ------------------------------------------------------------ */
  const curseur = fig.querySelector('.js-curseur');
  const lectV = fig.querySelector('.js-v');
  const ligne = fig.querySelector('.js-ligne');
  const chipC = fig.querySelector('.js-c');
  const legendes = {
    debut: fig.querySelector('.js-leg-debut'),
    cours: fig.querySelector('.js-leg-cours'),
    fin: fig.querySelector('.js-leg-fin'),
  };

  function rendre() {
    const c = n / (v / 1000);                 /* mol·L⁻¹ */
    const cAffiche = fmtAdaptatif(c);
    const exact = Math.abs(c - parseFloat(cAffiche.replace(',', '.'))) < 1e-9;

    /* le verre : niveau ∝ V, couleur ∝ c (opacité seule — teinte des tokens) */
    const h = v * pxParMl;
    liquide.setAttribute('y', (V_BAS - h).toFixed(1));
    liquide.setAttribute('height', h.toFixed(1));
    liquide.setAttribute('fill-opacity', (0.12 + 0.68 * (c / cMax)).toFixed(3));

    /* la jauge : hauteur ∝ c */
    const hj = (J_BAS - J_HAUT - 6) * (c / cMax);
    jauge.setAttribute('y', (J_BAS - 3 - hj).toFixed(1));
    jauge.setAttribute('height', hj.toFixed(1));
    lectJauge.textContent = `${cAffiche} mol/L`;

    lectV.textContent = String(Math.round(v));
    chipC.textContent = `c ${exact ? '=' : '≈'} ${cAffiche} mol·L⁻¹`;
    ligne.textContent = `c = n / V = ${fmt(n, 3)} / ${fmt(v / 1000, 3)} ${exact ? '=' : '≈'} ${cAffiche} mol/L`;

    const regime = v <= vMin + 1e-6 ? 'debut' : (v >= vMax - 1e-6 ? 'fin' : 'cours');
    for (const [cle, p] of Object.entries(legendes)) p.hidden = cle !== regime;

    if (parseFloat(curseur.value) !== v) curseur.value = String(v);
    curseur.style.setProperty('--pos', (((v - vMin) / (vMax - vMin)) * 100) + '%');
    curseur.setAttribute('aria-valuetext',
      `volume total ${Math.round(v)} millilitres, concentration ${cAffiche} mole par litre`);
  }

  function interaction() {
    track('widget_interact', { widget: 'dilution', chapitre });
  }

  let renduPlanifie = 0;
  function planifierRendu() {
    if (!renduPlanifie) renduPlanifie = requestAnimationFrame(() => { renduPlanifie = 0; rendre(); });
  }

  curseur.addEventListener('input', () => {
    if (animation) { animation.stop(); animation = null; }
    v = clamp(parseFloat(curseur.value), vMin, vMax);
    interaction();
    planifierRendu();
  });

  /* préréglage « la menthe à l'eau » : on verse l'eau jusqu'à V = vMax */
  fig.querySelector('.js-verser').addEventListener('click', () => {
    if (animation) animation.stop();
    interaction();
    animation = animerValeur({
      de: v, vers: vMax, duree: 700,
      surFrame: (val) => { v = val; rendre(); },
      surFin: () => { v = vMax; animation = null; rendre(); },
    });
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    if (animation) { animation.stop(); animation = null; }
    v = vInit;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="dilution"]')) initDilution(fig);
