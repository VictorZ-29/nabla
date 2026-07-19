/* Nabla — widgets/titrage.js
   « Verse et guette la couleur » : un titrage colorimétrique piloté par
   l'élève. Le curseur verse la solution violette de permanganate depuis la
   burette dans la fiole d'ions fer(II) ; avant l'équivalence le violet
   disparaît aussitôt (MnO₄⁻ limitant), à V_E les deux réactifs s'épuisent
   ensemble, au-delà le violet s'installe (Fe²⁺ épuisé — changement de
   réactif limitant). Le graphique n(V) se TRACE au fur et à mesure du
   versement : l'élève découvre le point anguleux en versant, il ne lui est
   pas donné d'avance. Tous les affichages sont exacts par construction :
   c_B × V et n_A − 5 c_B V tombent sur des centièmes de mmol à chaque cran
   de 0,5 mL. Spec : premiere/physique-chimie/oxydoreduction-titrages/README.md. */

import { el, clamp, fmt } from '../nabla-graph.js';
import { texteIon } from './redox-transfert.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

/* Géométrie (viewBox 640 × 360) — verrerie à gauche, graphique à droite */
const BUR = { g: 70, d: 92, haut: 8, bas: 150, bec: 162 };
const GRAPHE = { x0: 210, x1: 628, y0: 306, y1: 28, vMaxVue: 16.8, nMaxVue: 1.12 };

function initTitrage(fig) {
  const d = fig.dataset;
  const ca = parseFloat(d.ca);        /* mol/L — solution titrée (Fe²⁺) */
  const va = parseFloat(d.va);        /* mL prélevés */
  const cb = parseFloat(d.cb);        /* mol/L — solution titrante (MnO₄⁻) */
  const coef = parseFloat(d.coef);    /* n(Fe²⁺) consommé par n(MnO₄⁻) */
  const vMax = parseFloat(d.vMax);    /* mL — course de la burette */
  const nA = ca * va;                 /* mmol de Fe²⁺ au départ (mol/L × mL) */
  const vE = nA / coef / cb;          /* mL — volume équivalent */
  let V = parseFloat(d.vInit) || 0;

  const svg = fig.querySelector('svg');
  const xPx = (v) => GRAPHE.x0 + (v / GRAPHE.vMaxVue) * (GRAPHE.x1 - GRAPHE.x0);
  const yPx = (n) => GRAPHE.y0 - (n / GRAPHE.nMaxVue) * (GRAPHE.y0 - GRAPHE.y1);

  /* --- verrerie (statique + niveaux vivants) ------------------------------- */
  el('path', {
    class: 'dil-verre',
    d: `M${BUR.g} ${BUR.haut}L${BUR.g} ${BUR.bas}L${BUR.g + 8} ${BUR.bec}L${BUR.d - 8} ${BUR.bec}L${BUR.d} ${BUR.bas}L${BUR.d} ${BUR.haut}`,
  }, svg);
  const burLiquide = el('rect', { class: 'dil-liquide', x: BUR.g + 3, width: BUR.d - BUR.g - 6, y: 14, height: 134, 'fill-opacity': 0.55 }, svg);
  let ticks = '';
  for (let k = 0; k <= 4; k++) ticks += `M${BUR.d} ${14 + k * 33.5}L${BUR.d + 6} ${14 + k * 33.5}`;
  el('path', { class: 'g-grid', d: ticks }, svg);
  texteIon(svg, 'MnO4', '−', { class: 'avc-nom', x: BUR.d + 14, y: 26, 'text-anchor': 'start' });
  const labBur = el('text', { class: 'avc-candidat', x: BUR.d + 14, y: 44, 'text-anchor': 'start' }, svg);
  labBur.textContent = 'la burette';

  el('path', {
    class: 'dil-verre',
    d: 'M66 190L66 225L34 316Q30 330 44 330L118 330Q132 330 128 316L96 225L96 190',
  }, svg);
  const fioleLiquide = el('path', {
    class: 'dil-liquide', 'fill-opacity': 0.07,
    d: 'M49.5 272L36 310Q30 330 46 329L116 329Q132 330 126 310L112.5 272Z',
  }, svg);
  texteIon(svg, 'la fiole : ions Fe', '2+', { class: 'avc-candidat', x: 81, y: 352, 'text-anchor': 'middle' });

  /* --- graphique n(V) : grille, axes, tracé progressif --------------------- */
  let dGrille = '';
  for (let gv = 2; gv <= 16.01; gv += 2) dGrille += `M${xPx(gv).toFixed(1)} ${GRAPHE.y1}L${xPx(gv).toFixed(1)} ${GRAPHE.y0}`;
  for (let gn = 0.2; gn <= 1.001; gn += 0.2) dGrille += `M${GRAPHE.x0} ${yPx(gn).toFixed(1)}L${GRAPHE.x1} ${yPx(gn).toFixed(1)}`;
  el('path', { class: 'g-grid', d: dGrille }, svg);
  el('path', { class: 'g-axis', d: `M${GRAPHE.x0} ${GRAPHE.y0}L${GRAPHE.x1} ${GRAPHE.y0}M${GRAPHE.x0} ${GRAPHE.y0}L${GRAPHE.x0} ${GRAPHE.y1 - 8}` }, svg);
  for (const gv of [5, 10, 15]) {
    const t = el('text', { class: 'avc-candidat', x: xPx(gv).toFixed(1), y: GRAPHE.y0 + 18, 'text-anchor': 'middle' }, svg);
    t.textContent = String(gv);
  }
  for (const gn of [0.5, 1]) {
    const t = el('text', { class: 'avc-candidat', x: GRAPHE.x0 - 6, y: (yPx(gn) + 4).toFixed(1), 'text-anchor': 'end' }, svg);
    t.textContent = fmt(gn, 1);
  }
  const labN = el('text', { class: 'etiquette-math etiquette-math--muted', 'font-size': 15, x: GRAPHE.x0 + 8, y: GRAPHE.y1 - 8 }, svg);
  labN.textContent = 'n (mmol)';
  const labV = el('text', { class: 'etiquette-math etiquette-math--muted', 'font-size': 15, x: GRAPHE.x1 - 2, y: GRAPHE.y0 - 10, 'text-anchor': 'end' }, svg);
  labV.textContent = 'V versé (mL)';

  /* repère d'équivalence : révélé quand l'élève l'a atteint */
  const marqueE = el('g', {}, svg);
  el('path', { class: 'g-guide', 'stroke-dasharray': '3 4', d: `M${xPx(vE).toFixed(1)} ${GRAPHE.y0}L${xPx(vE).toFixed(1)} ${yPx(1.02).toFixed(1)}` }, marqueE);
  el('circle', { class: 'pt-point', r: 5.5, cx: xPx(vE).toFixed(1), cy: yPx(0).toFixed(1) }, marqueE);
  const labE = el('text', { class: 'etl-valeur', x: xPx(vE).toFixed(1), y: GRAPHE.y0 + 34, 'text-anchor': 'middle' }, marqueE);
  labE.textContent = `équivalence : ${fmt(vE, 1)} mL`;

  const ligneFe = el('path', { class: 'g-courbe' }, svg);
  const ligneMn = el('path', { class: 'g-courbe-derivee' }, svg);
  const guideV = el('path', { class: 'g-guide-accent', 'stroke-dasharray': '4 5' }, svg);
  const ptFe = el('circle', { class: 'pt-fixe pt-fixe--surface', r: 4.5 }, svg);
  const ptMn = el('circle', { class: 'pt-point', r: 5 }, svg);
  texteIon(svg, 'Fe', '2+', { class: 'avc-nom', x: xPx(0.6).toFixed(1), y: (yPx(1) - 12).toFixed(1), 'text-anchor': 'start' });
  const labMn = el('g', {}, svg);
  texteIon(labMn, 'MnO4', '−', { class: 'avc-nom avc-nom--accent', x: xPx(13.2).toFixed(1), y: yPx(0.3).toFixed(1), 'text-anchor': 'middle' });
  const labMn2 = el('text', { class: 'avc-candidat', x: xPx(13.2).toFixed(1), y: (yPx(0.3) + 16).toFixed(1), 'text-anchor': 'middle' }, labMn);
  labMn2.textContent = 'dans la fiole';

  /* --- lectures ------------------------------------------------------------ */
  const curseur = fig.querySelector('.js-curseur');
  const lectV = fig.querySelector('.js-v');
  const lectNb = fig.querySelector('.js-nb');
  const lectNfe = fig.querySelector('.js-nfe');
  const chipEtat = fig.querySelector('.js-etat');
  const ligne = fig.querySelector('.js-ligne');
  const legendes = {
    debut: fig.querySelector('.js-leg-debut'),
    avant: fig.querySelector('.js-leg-avant'),
    equiv: fig.querySelector('.js-leg-equiv'),
    apres: fig.querySelector('.js-leg-apres'),
  };

  const seg = (v1, n1, v2, n2) =>
    `M${xPx(v1).toFixed(1)} ${yPx(n1).toFixed(1)}L${xPx(v2).toFixed(1)} ${yPx(n2).toFixed(1)}`;

  function rendre() {
    const nVerse = cb * V;                                /* mmol de MnO₄⁻ versés */
    const nFe = Math.max(0, nA - coef * nVerse);          /* mmol de Fe²⁺ restants */
    const exces = V > vE + 1e-6 ? cb * (V - vE) : 0;      /* mmol de MnO₄⁻ en excès */
    const equivalence = Math.abs(V - vE) < 1e-6;

    /* niveaux de la verrerie */
    const niveau = 14 + (V / vMax) * 134;
    burLiquide.setAttribute('y', niveau.toFixed(1));
    burLiquide.setAttribute('height', (148 - niveau).toFixed(1));
    fioleLiquide.setAttribute('fill-opacity',
      exces > 0 ? (0.14 + 0.66 * Math.min(1, exces / (cb * (vMax - vE)))).toFixed(3) : '0.07');

    /* tracé progressif : les droites n'existent que là où l'élève a versé */
    const vCoude = Math.min(V, vE);
    ligneFe.setAttribute('d', V > 1e-9
      ? seg(0, nA, vCoude, nA - coef * cb * vCoude) + (V > vE + 1e-6 ? `L${xPx(V).toFixed(1)} ${yPx(0).toFixed(1)}` : '')
      : '');
    ligneMn.setAttribute('d', V > 1e-9
      ? seg(0, 0, vCoude, 0) + (V > vE + 1e-6 ? `L${xPx(V).toFixed(1)} ${yPx(exces).toFixed(1)}` : '')
      : '');
    guideV.setAttribute('d', `M${xPx(V).toFixed(1)} ${GRAPHE.y0}L${xPx(V).toFixed(1)} ${yPx(1.02).toFixed(1)}`);
    ptFe.setAttribute('cx', xPx(V).toFixed(1));
    ptFe.setAttribute('cy', yPx(nFe).toFixed(1));
    ptMn.setAttribute('cx', xPx(V).toFixed(1));
    ptMn.setAttribute('cy', yPx(exces).toFixed(1));
    marqueE.style.display = V >= vE - 1e-6 ? '' : 'none';
    labMn.style.display = V > vE + 1e-6 ? '' : 'none';

    lectV.textContent = fmt(V, 1);
    lectNb.textContent = fmt(nVerse);
    lectNfe.textContent = fmt(nFe);

    let regime;
    if (V <= 1e-9) {
      chipEtat.textContent = 'V = 0 — tout le fer(II) est là';
      chipEtat.className = 'chip chip--accent js-etat';
      regime = 'debut';
      ligne.innerHTML = `n(Fe<sup>2+</sup>) dans la fiole = ${fmt(nA)} mmol · rien n’est encore versé`;
    } else if (equivalence) {
      chipEtat.textContent = 'équivalence — les deux réactifs épuisés';
      chipEtat.className = 'chip chip--good js-etat';
      regime = 'equiv';
      ligne.innerHTML = `n(Fe<sup>2+</sup>) restant = ${fmt(nA)} − ${coef} × ${fmt(nVerse)} = 0,00 mmol — pile épuisé`;
    } else if (V < vE) {
      chipEtat.innerHTML = 'MnO<sub>4</sub><sup>−</sup> limitant — son violet disparaît aussitôt';
      chipEtat.className = 'chip js-etat';
      regime = 'avant';
      ligne.innerHTML = `n(Fe<sup>2+</sup>) restant = ${fmt(nA)} − ${coef} × ${fmt(nVerse)} = ${fmt(nFe)} mmol`;
    } else {
      chipEtat.innerHTML = 'Fe<sup>2+</sup> épuisé — le violet s’installe';
      chipEtat.className = 'chip chip--bad js-etat';
      regime = 'apres';
      ligne.innerHTML = `MnO<sub>4</sub><sup>−</sup> en excès&nbsp;: ${fmt(cb, 3)} × (${fmt(V, 1)} − ${fmt(vE, 1)}) = ${fmt(exces)} mmol`;
    }
    for (const [cle, p] of Object.entries(legendes)) p.hidden = cle !== regime;

    if (parseFloat(curseur.value) !== V) curseur.value = String(V);
    curseur.style.setProperty('--pos', ((V / vMax) * 100) + '%');
    curseur.setAttribute('aria-valuetext', `volume versé ${fmt(V, 1)} millilitres`);
  }

  function interaction() {
    track('widget_interact', { widget: 'titrage', chapitre });
  }

  let renduPlanifie = 0;
  curseur.addEventListener('input', () => {
    V = Math.round(clamp(parseFloat(curseur.value), 0, vMax) * 10) / 10;
    interaction();
    if (!renduPlanifie) {
      renduPlanifie = requestAnimationFrame(() => { renduPlanifie = 0; rendre(); });
    }
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    V = parseFloat(d.vInit) || 0;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="titrage"]')) initTitrage(fig);
