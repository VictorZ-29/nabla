/* Nabla — widgets/redox-transfert.js
   « Fais circuler les électrons » : le TP du clou de fer dans le sulfate de
   cuivre, piloté par l'élève. Un curseur sur l'avancement x fait passer les
   électrons du clou (Fe → Fe²⁺ + 2 e⁻) aux ions cuivre (Cu²⁺ + 2 e⁻ → Cu) :
   le bleu de la solution pâlit (les Cu²⁺ disparaissent), le dépôt rouge
   pousse sur le clou, et les deux compteurs d'électrons — cédés, captés —
   restent égaux à chaque instant : l'invariant du chapitre, montré, jamais
   affirmé. La réaction s'arrête net quand le dernier ion Cu²⁺ est réduit.
   Spec : premiere/physique-chimie/oxydoreduction-titrages/README.md. */

import { el, texteChimie, clamp, fmt } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

/* Texte SVG d'un ion : indices chimiques via texteChimie, puis la charge en
   exposant (tspan surélevé, corps réduit) — pas de caractères Unicode
   exposants (couverture de police inégale). Partagé avec titrage.js. */
export function texteIon(parent, formule, charge, attrs = {}) {
  const t = texteChimie(parent, formule, attrs);
  const dernier = t.lastElementChild;
  const abaisse = dernier && dernier.getAttribute('dy') === '4';
  if (charge) {
    const ts = el('tspan', { 'font-size': '0.72em', dy: abaisse ? -9 : -5 }, t);
    ts.textContent = charge;
  }
  return t;
}

/* Géométrie (viewBox 640 × 330) */
const CUVE = { g: 200, d: 500, haut: 50, fond: 290 };   /* le bécher */
const LIQ_HAUT = 120;                                    /* surface du liquide */
const CLOU = { x: 407, larg: 16, haut: 72, bas: 270 };
const DEPOT_MAX = 116;                                   /* hauteur max du dépôt (px) */

function initTransfert(fig) {
  const d = fig.dataset;
  const n0 = parseFloat(d.n0);        /* mol de Cu²⁺ au départ */
  const xMax = parseFloat(d.xMax);
  const xInit = parseFloat(d.xInit) || 0;
  let x = xInit;

  const svg = fig.querySelector('svg');

  /* --- décor statique ------------------------------------------------------ */
  el('path', {
    class: 'dil-verre',
    d: `M${CUVE.g} ${CUVE.haut}L${CUVE.g} ${CUVE.fond - 4}Q${CUVE.g} ${CUVE.fond} ${CUVE.g + 4} ${CUVE.fond}` +
       `L${CUVE.d - 4} ${CUVE.fond}Q${CUVE.d} ${CUVE.fond} ${CUVE.d} ${CUVE.fond - 4}L${CUVE.d} ${CUVE.haut}`,
  }, svg);
  const liquide = el('rect', {
    class: 'dil-liquide', x: CUVE.g + 4, y: LIQ_HAUT,
    width: CUVE.d - CUVE.g - 8, height: CUVE.fond - 2 - LIQ_HAUT,
  }, svg);

  /* les ions en solution : Cu²⁺ (craie, s'effacent), Fe²⁺ (accent, apparaissent) */
  const ionsCu = [[252, 172], [330, 238], [268, 130]].map(([ix, iy]) =>
    texteIon(svg, 'Cu', '2+', { class: 'avc-nom', x: ix, y: iy, 'text-anchor': 'middle' }));
  const ionsFe = [[300, 200], [255, 268]].map(([ix, iy]) =>
    texteIon(svg, 'Fe', '2+', { class: 'avc-nom avc-nom--accent', x: ix, y: iy, 'text-anchor': 'middle' }));

  /* le clou (craie) et son dépôt de cuivre (accent) */
  el('rect', { class: 'avc-barre-reactif', x: CLOU.x - 8, y: CLOU.haut - 9, width: CLOU.larg + 16, height: 9, rx: 2 }, svg);
  el('rect', { class: 'avc-barre-reactif', x: CLOU.x, y: CLOU.haut, width: CLOU.larg, height: CLOU.bas - CLOU.haut, rx: 3 }, svg);
  const depot = el('rect', { class: 'avc-barre-produit', x: CLOU.x - 4, y: CLOU.bas + 2, width: CLOU.larg + 8, height: 0, rx: 3 }, svg);

  /* le flux d'électrons, du clou vers les ions (visible pendant le transfert) */
  const flux = el('g', {}, svg);
  el('path', { class: 'rdx-electrons', d: `M${CLOU.x - 4} 208Q368 244 340 210` }, flux);
  el('path', { class: 'vec-pointe--accent', d: 'M340 210L349 214.5L346.5 205Z' }, flux);
  texteIon(flux, 'e', '−', { class: 'avc-nom avc-nom--accent', x: 372, y: 196, 'text-anchor': 'middle' });

  const labClou = el('text', { class: 'avc-candidat', x: CLOU.x - 14, y: CLOU.haut - 2, 'text-anchor': 'end' }, svg);
  labClou.textContent = 'le clou de fer';
  const labSol = el('text', { class: 'avc-candidat', x: (CUVE.g + CUVE.d) / 2, y: 316, 'text-anchor': 'middle' }, svg);
  labSol.textContent = 'la solution de sulfate de cuivre';

  /* --- lectures ------------------------------------------------------------ */
  const curseur = fig.querySelector('.js-curseur');
  const lectX = fig.querySelector('.js-x');
  const eOx = fig.querySelector('.js-e-ox');
  const eRed = fig.querySelector('.js-e-red');
  const lectCu = fig.querySelector('.js-ncu');
  const lectFe = fig.querySelector('.js-nfe');
  const chipEtat = fig.querySelector('.js-etat');
  const legendes = {
    debut: fig.querySelector('.js-leg-debut'),
    cours: fig.querySelector('.js-leg-cours'),
    fin: fig.querySelector('.js-leg-fin'),
  };

  function rendre() {
    const nCu = n0 - x;
    const ratio = nCu / n0;

    liquide.setAttribute('fill-opacity', (0.08 + 0.64 * ratio).toFixed(3));
    const h = DEPOT_MAX * (x / xMax);
    depot.setAttribute('y', (CLOU.bas + 2 - h).toFixed(1));
    depot.setAttribute('height', h.toFixed(1));
    for (const ion of ionsCu) ion.setAttribute('opacity', Math.max(0, ratio).toFixed(3));
    for (const ion of ionsFe) ion.setAttribute('opacity', (x / xMax).toFixed(3));
    flux.style.display = x > 1e-9 && x < xMax - 1e-9 ? '' : 'none';

    lectX.textContent = fmt(x);
    eOx.textContent = fmt(2 * x);
    eRed.textContent = fmt(2 * x);
    lectCu.textContent = fmt(nCu);
    lectFe.textContent = fmt(x);

    let regime;
    if (x <= 1e-9) {
      chipEtat.textContent = 'x = 0 — la solution est bleue';
      chipEtat.className = 'chip chip--accent js-etat';
      regime = 'debut';
    } else if (x >= xMax - 1e-9) {
      chipEtat.innerHTML = 'plus un ion Cu<sup>2+</sup> — la réaction s’arrête';
      chipEtat.className = 'chip chip--bad js-etat';
      regime = 'fin';
    } else {
      chipEtat.textContent = 'le transfert est en cours — le bleu pâlit';
      chipEtat.className = 'chip js-etat';
      regime = 'cours';
    }
    for (const [cle, p] of Object.entries(legendes)) p.hidden = cle !== regime;

    if (parseFloat(curseur.value) !== x) curseur.value = String(x);
    curseur.style.setProperty('--pos', ((x / xMax) * 100) + '%');
    curseur.setAttribute('aria-valuetext', `avancement x = ${fmt(x)} mole, il reste ${fmt(nCu)} mole d'ions cuivre`);
  }

  function interaction() {
    track('widget_interact', { widget: 'redox-transfert', chapitre });
  }

  /* au plus un rendu par frame pendant un drag du curseur */
  let renduPlanifie = 0;
  curseur.addEventListener('input', () => {
    x = Math.round(clamp(parseFloat(curseur.value), 0, xMax) * 100) / 100;
    interaction();
    if (!renduPlanifie) {
      renduPlanifie = requestAnimationFrame(() => { renduPlanifie = 0; rendre(); });
    }
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    x = xInit;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="redox-transfert"]')) initTransfert(fig);
