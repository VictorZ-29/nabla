/* Nabla — widgets/pesee.js
   « La balance ne compte pas » : un curseur sur la quantité de matière n
   pilote quatre tas de n moles chacun — même nombre d'entités partout —
   et la balance affiche quatre masses différentes (m = n × M). Le repère
   pointillé de chaque espèce marque la masse d'UNE mole : sa masse molaire.
   Boutons d'espèce : le calcul m = n × M se déroule pour l'espèce choisie.
   Toutes les masses sont exactes par construction (pas de 0,10 mol × M
   qui déborde des deux décimales avec les M choisis).
   Spec : premiere/physique-chimie/composition-systeme/README.md. */

import { el, texteChimie, clamp, fmt, fmtCourt } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

/* « NaCl » → « NaCl », « H2O » → « H<sub>2</sub>O » (lignes de calcul en HTML) */
function htmlChimie(formule) {
  return formule.replace(/([A-Za-z)])(\d+)/g, '$1<sub>$2</sub>');
}

/* Géométrie du SVG (viewBox 640 × 330) */
const BASE = 282;      /* y de la ligne de sol */
const HAUT = 40;       /* y du sommet de l'échelle (masse molaire maximale) */
const LARG_BARRE = 72;
const CENTRES = [100, 247, 393, 540];

const AVOGADRO = 6.02; /* mantisse de N_A, × 10²³ */

function initPesee(fig) {
  const d = fig.dataset;
  const config = JSON.parse(fig.querySelector('script[type="application/json"]').textContent);
  const especes = config.especes;
  const nInit = parseFloat(d.nInit);
  const nMax = parseFloat(d.nMax);
  const mPlein = Math.max(...especes.map((e) => e.M)) * nMax; /* masse en haut d'échelle */
  const pxParG = (BASE - HAUT) / mPlein;
  let n = nInit;
  let choisie = config.choisie || 0;

  const svg = fig.querySelector('svg');

  /* --- décor statique ------------------------------------------------------ */
  el('path', { class: 'g-axis', d: `M20 ${BASE}L620 ${BASE}` }, svg);

  const barres = [];
  const valeurs = [];
  especes.forEach((e, i) => {
    const cx = CENTRES[i];
    /* repère pointillé : la masse d'UNE mole (masse molaire) */
    const yM = BASE - e.M * pxParG;
    el('path', { class: 'avc-repere', d: `M${cx - LARG_BARRE / 2 - 8} ${yM.toFixed(1)}L${cx + LARG_BARRE / 2 + 8} ${yM.toFixed(1)}` }, svg);
    barres.push(el('rect', {
      class: 'avc-barre-reactif',
      x: cx - LARG_BARRE / 2, width: LARG_BARRE, y: BASE, height: 0, rx: 3,
    }, svg));
    valeurs.push(el('text', { class: 'avc-valeur', x: cx, y: BASE - 8, 'text-anchor': 'middle' }, svg));
    texteChimie(svg, e.formule, { class: 'avc-nom', x: cx, y: BASE + 22, 'text-anchor': 'middle' });
    const petitNom = el('text', { class: 'avc-candidat', x: cx, y: BASE + 40, 'text-anchor': 'middle' }, svg);
    petitNom.textContent = e.nom;
  });

  /* --- lectures ------------------------------------------------------------ */
  const curseur = fig.querySelector('.js-curseur');
  const lectN = fig.querySelector('.js-n');
  const boutons = [...fig.querySelectorAll('.js-espece')];
  const ligne = fig.querySelector('.js-ligne');
  const chipN = fig.querySelector('.js-entites');
  const legendes = {
    debut: fig.querySelector('.js-leg-debut'),
    cours: fig.querySelector('.js-leg-cours'),
    zero: fig.querySelector('.js-leg-zero'),
  };

  function rendre() {
    especes.forEach((e, i) => {
      const m = n * e.M;
      const h = m * pxParG;
      barres[i].setAttribute('y', (BASE - h).toFixed(1));
      barres[i].setAttribute('height', h.toFixed(1));
      barres[i].setAttribute('class', i === choisie ? 'avc-barre-produit' : 'avc-barre-reactif');
      valeurs[i].setAttribute('y', (BASE - h - 8).toFixed(1));
      valeurs[i].textContent = `${fmtCourt(m)} g`;
    });

    lectN.textContent = fmt(n);

    /* le calcul déroulé pour l'espèce choisie */
    const e = especes[choisie];
    ligne.innerHTML = `m(${htmlChimie(e.formule)}) = n × M = ${fmt(n)} × ${fmtCourt(e.M, 1)} = ${fmtCourt(n * e.M)} g`;

    /* le compteur d'entités : N = n × 6,02 × 10²³, même nombre dans chaque tas */
    if (n <= 1e-9) {
      chipN.innerHTML = 'N = 0 entité — les tas sont vides';
    } else {
      const N = n * AVOGADRO;                      /* mantisse × 10²³ */
      const affiche = N >= 1
        ? `${fmtCourt(N)} × 10<sup>23</sup>`
        : `${fmtCourt(N * 10)} × 10<sup>22</sup>`;
      chipN.innerHTML = `N = ${affiche} entités — dans <strong>chaque</strong> tas`;
    }

    for (const [i, b] of boutons.entries()) b.setAttribute('aria-pressed', String(i === choisie));

    const regime = n <= 1e-9 ? 'zero' : (n >= nMax - 1e-9 ? 'debut' : 'cours');
    for (const [cle, p] of Object.entries(legendes)) p.hidden = cle !== regime;

    if (parseFloat(curseur.value) !== n) curseur.value = String(n);
    curseur.style.setProperty('--pos', ((n / nMax) * 100) + '%');
    curseur.setAttribute('aria-valuetext', `n = ${fmt(n)} mole de chaque espèce`);
  }

  function interaction() {
    track('widget_interact', { widget: 'pesee', chapitre });
  }

  let renduPlanifie = 0;
  curseur.addEventListener('input', () => {
    n = clamp(parseFloat(curseur.value), 0, nMax);
    interaction();
    if (!renduPlanifie) {
      renduPlanifie = requestAnimationFrame(() => { renduPlanifie = 0; rendre(); });
    }
  });

  boutons.forEach((b, i) => {
    b.addEventListener('click', () => {
      choisie = i;
      interaction();
      rendre();
    });
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    n = nInit;
    choisie = config.choisie || 0;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="pesee"]')) initPesee(fig);
