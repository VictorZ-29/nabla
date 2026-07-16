/* Nabla — widgets/avancement.js
   « Fais avancer la réaction » : un curseur sur l'avancement x pilote les
   barres de quantités de matière de chaque espèce et la dernière ligne d'un
   tableau d'avancement vivant. L'élève voit les réactifs fondre (chacun à
   la vitesse de son coefficient), les produits pousser, et la réaction
   s'arrêter net quand le premier réactif touche zéro. Boutons d'espèce :
   le calcul n = n₀ ± coef × x se déroule pour l'espèce choisie. Variante
   « bilan » (config avec masses molaires M) : ligne des masses et chip de
   masse totale — Lavoisier vérifié en direct, jamais affirmé.
   Deux instances (combustion du méthane §2, de l'éthanol §5).
   Spec : premiere/physique-chimie/reaction-avancement/README.md. */

import { el, texteChimie, clamp, fmt } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

/* « CH4 » → « CH<sub>4</sub> » : indices HTML pour les lignes de calcul
   (innerHTML, précédent : depistage.js) — jamais d'Unicode indice. */
function htmlChimie(formule) {
  return formule.replace(/([A-Za-z)])(\d+)/g, '$1<sub>$2</sub>');
}

/* Géométrie du SVG (viewBox 640 × 330) */
const BASE = 282;      /* y de la ligne de sol */
const HAUT = 40;       /* y du sommet de l'échelle */
const LARG_BARRE = 72;

function initAvancement(fig) {
  const d = fig.dataset;
  const config = JSON.parse(fig.querySelector('script[type="application/json"]').textContent);
  const especes = config.especes;
  const nomWidget = d.nom || 'avancement';
  const xInit = parseFloat(d.xInit);
  const xMax = parseFloat(d.xMax);
  const echelle = parseFloat(d.echelle);   /* n (mol) correspondant à la pleine hauteur */
  const pxParMol = (BASE - HAUT) / echelle;
  const avecMasses = especes.every((e) => 'M' in e);
  let x = xInit;
  let choisie = config.choisie || 0;       /* indice de l'espèce détaillée */

  const svg = fig.querySelector('svg');

  /* --- décor statique ------------------------------------------------------ */
  el('path', { class: 'g-axis', d: `M20 ${BASE}L620 ${BASE}` }, svg);
  /* flèche réactifs → produits, dessinée (pas de glyphe : couverture police) */
  el('path', { class: 'avc-fleche', d: `M300 ${HAUT + 108}L340 ${HAUT + 108}` }, svg);
  el('path', { class: 'avc-fleche-pointe', d: `M340 ${HAUT + 108}L331 ${HAUT + 103.5}L331 ${HAUT + 112.5}Z` }, svg);

  const reactifs = especes.filter((e) => e.role === 'reactif');
  const produits = especes.filter((e) => e.role === 'produit');
  const centres = [];
  especes.forEach((e) => {
    const groupe = e.role === 'reactif' ? reactifs : produits;
    const i = groupe.indexOf(e);
    const x0 = e.role === 'reactif' ? 100 : 400;
    centres.push(x0 + i * (groupe.length > 1 ? 140 : 70));
  });

  const barres = [];
  const valeurs = [];
  especes.forEach((e, i) => {
    const cx = centres[i];
    /* repère pointillé au niveau initial (réactifs : ce qu'il y avait au départ) */
    if (e.n0 > 0) {
      const y0 = BASE - e.n0 * pxParMol;
      el('path', { class: 'avc-repere', d: `M${cx - LARG_BARRE / 2 - 8} ${y0}L${cx + LARG_BARRE / 2 + 8} ${y0}` }, svg);
    }
    barres.push(el('rect', {
      class: e.role === 'reactif' ? 'avc-barre-reactif' : 'avc-barre-produit',
      x: cx - LARG_BARRE / 2, width: LARG_BARRE, y: BASE, height: 0, rx: 3,
    }, svg));
    valeurs.push(el('text', { class: 'avc-valeur', x: cx, y: BASE - 8, 'text-anchor': 'middle' }, svg));
    const nom = (e.coef > 1 ? e.coef + ' ' : '') + e.formule;
    texteChimie(svg, nom, { class: 'avc-nom', x: cx, y: BASE + 24, 'text-anchor': 'middle' });
  });

  /* --- lectures ------------------------------------------------------------ */
  const curseur = fig.querySelector('.js-curseur');
  const lectX = fig.querySelector('.js-x');
  const cellules = [...fig.querySelectorAll('.js-cell')];
  const cellulesMasse = [...fig.querySelectorAll('.js-masse')];
  const lectXTab = fig.querySelector('.js-x-tab');
  const boutons = [...fig.querySelectorAll('.js-espece')];
  const ligne = fig.querySelector('.js-ligne');
  const ligneMasse = fig.querySelector('.js-ligne-masse');
  const chipEtat = fig.querySelector('.js-etat');
  const chipMasseTotale = fig.querySelector('.js-masse-totale');
  /* légendes : trois paragraphes statiques (indices en HTML, pas de KaTeX),
     le JS ne fait que masquer/démasquer — doctrine univers.js */
  const legendes = {
    debut: fig.querySelector('.js-leg-debut'),
    cours: fig.querySelector('.js-leg-cours'),
    fin: fig.querySelector('.js-leg-fin'),
  };

  const n = (e) => (e.role === 'reactif' ? e.n0 - e.coef * x : e.n0 + e.coef * x);
  /* le réactif qui s'épuise à x = xMax (le curseur s'arrête là : n ≥ 0 garanti) */
  const epuise = reactifs.reduce((a, b) => (a.n0 / a.coef <= b.n0 / b.coef ? a : b));

  function rendre() {
    especes.forEach((e, i) => {
      const ni = n(e);
      const h = ni * pxParMol;
      barres[i].setAttribute('y', (BASE - h).toFixed(1));
      barres[i].setAttribute('height', h.toFixed(1));
      valeurs[i].setAttribute('y', (BASE - h - 8).toFixed(1));
      valeurs[i].textContent = fmt(ni);
      cellules[i].textContent = fmt(ni);
      if (avecMasses) cellulesMasse[i].textContent = fmt(ni * e.M, 1);
    });

    lectX.textContent = fmt(x);
    lectXTab.textContent = fmt(x);

    /* le calcul déroulé pour l'espèce choisie */
    const e = especes[choisie];
    const f = htmlChimie(e.formule);
    const coef = e.coef > 1 ? `${e.coef} × ` : '';
    ligne.innerHTML = e.role === 'reactif'
      ? `n(${f}) = ${fmt(e.n0)} − ${coef}${fmt(x)} = ${fmt(n(e))} mol`
      : `n(${f}) = ${coef}${fmt(x)} = ${fmt(n(e))} mol`;
    if (avecMasses && ligneMasse) {
      ligneMasse.innerHTML = `m(${f}) = ${fmt(n(e))} × ${e.M} = ${fmt(n(e) * e.M, 1)} g`;
    }
    if (avecMasses && chipMasseTotale) {
      const totale = especes.reduce((s, esp) => s + n(esp) * esp.M, 0);
      chipMasseTotale.textContent = fmt(totale, 1);
    }

    for (const [i, b] of boutons.entries()) b.setAttribute('aria-pressed', String(i === choisie));

    let regime;
    if (x <= 1e-9) {
      chipEtat.innerHTML = 'x = 0 — état initial';
      chipEtat.className = 'chip chip--accent js-etat';
      regime = 'debut';
    } else if (x >= xMax - 1e-9) {
      chipEtat.innerHTML = `${htmlChimie(epuise.formule)} épuisé — état final`;
      chipEtat.className = 'chip chip--bad js-etat';
      regime = 'fin';
    } else {
      chipEtat.innerHTML = 'la réaction avance';
      chipEtat.className = 'chip js-etat';
      regime = 'cours';
    }
    for (const [cle, p] of Object.entries(legendes)) p.hidden = cle !== regime;

    if (parseFloat(curseur.value) !== x) curseur.value = String(x);
    curseur.style.setProperty('--pos', ((x / xMax) * 100) + '%');
    curseur.setAttribute('aria-valuetext', `avancement x = ${fmt(x)} mole`);
  }

  function interaction() {
    track('widget_interact', { widget: nomWidget, chapitre });
  }

  /* au plus un rendu par frame pendant un drag du curseur */
  let renduPlanifie = 0;
  curseur.addEventListener('input', () => {
    x = clamp(parseFloat(curseur.value), 0, xMax);
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
    x = xInit;
    choisie = config.choisie || 0;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="avancement"]')) initAvancement(fig);
