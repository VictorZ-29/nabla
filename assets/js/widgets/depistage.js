/* Nabla — widgets/depistage.js
   « Le test qui se trompe » : 1 000 personnes, une maladie qui touche n %
   d'entre elles, un test fiable à 90 % dans les deux sens (sensibilité et
   spécificité). Chaque point est une personne ; les quatre sorts possibles
   (malade détecté, malade raté, sain positif à tort, sain négatif) se lisent
   à la couleur. Curseur et préréglages sur la prévalence n — les effectifs
   restent entiers pour tout n (9n vrais positifs, 100 − n faux positifs).
   Le bouton « ne garde que les positifs » rejoue le geste du chapitre :
   restreindre l'univers, et lire la proportion de malades qu'il contient.
   Spec : premiere/maths/probabilites-conditionnelles/README.md. */

import { el, animerValeur } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

const TOTAL = 1000;
const COLS = 40;
const PAS = 15.5;
const X0 = 11;
const Y0 = 11;

/* Entiers à la française : espace fine insécable par groupe de trois. */
function entier(v) {
  return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/* Pourcentage à la française : une décimale, virgule, zéro final retiré. */
function pct(v) {
  return (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, '').replace('.', ',');
}

function initDepistage(fig) {
  const nInit = parseInt(fig.dataset.nInit, 10);
  let n = nInit;           // prévalence, en % (entier)
  let positifsSeuls = false;
  let animation = null;

  const svg = fig.querySelector('svg');
  const points = [];
  for (let i = 0; i < TOTAL; i++) {
    points.push(el('circle', {
      class: 'pt-vn', r: 5,
      cx: X0 + (i % COLS) * PAS + PAS / 2,
      cy: Y0 + Math.floor(i / COLS) * PAS + PAS / 2,
    }, svg));
  }

  const curseur = fig.querySelector('.js-curseur');
  const presets = [...fig.querySelectorAll('.segmente button')];
  const toggle = fig.querySelector('.js-positifs');
  const lectN = fig.querySelector('.js-n');
  const chipMalades = fig.querySelector('.js-malades');
  const chipPositifs = fig.querySelector('.js-positifs-chip');
  const chipReponse = fig.querySelector('.js-reponse');
  const formule = fig.querySelector('.js-formule');
  const legende = fig.querySelector('.js-legende');

  function rendre() {
    /* effectifs, tous entiers : malades 10n (9n détectés, n ratés),
       sains 1000 − 10n (100 − n positifs à tort) */
    const vp = 9 * n;
    const fn = n;
    const fp = 100 - n;
    const positifs = vp + fp;
    const proba = (100 * vp) / positifs;

    points.forEach((pt, i) => {
      let classe;
      if (i < vp) classe = 'pt-vp';
      else if (i < vp + fn) classe = 'pt-fn';
      else if (i < vp + fn + fp) classe = 'pt-fp';
      else classe = 'pt-vn';
      const negatif = classe === 'pt-fn' || classe === 'pt-vn';
      pt.setAttribute('class', classe + (positifsSeuls && negatif ? ' pt-efface' : ''));
    });

    lectN.textContent = String(n);
    chipMalades.textContent = entier(10 * n);
    chipPositifs.textContent = entier(positifs);
    chipReponse.textContent = `${pct(proba)} %`;
    formule.innerHTML = `P(malade sachant positif) = ${entier(vp)} / ${entier(positifs)} = <span class="val-accent">≈ ${pct(proba)} %</span>`;

    if (n <= 5) {
      legende.textContent = `Le test se trompe rarement — et pourtant, sur ${entier(positifs)} tests positifs, seuls ${entier(vp)} viennent de vrais malades. La maladie est si rare que les ${entier(TOTAL - 10 * n)} personnes saines, même trompées à 10 % seulement, fournissent ${entier(fp)} faux positifs : ils noient les vrais.`;
    } else if (n < 20) {
      legende.textContent = `La maladie devient plus fréquente : les ${entier(vp)} vrais positifs pèsent davantage face aux ${entier(fp)} faux. Un test positif devient plus inquiétant — sans être encore une certitude.`;
    } else {
      legende.textContent = `À ${n} % de prévalence, les vrais positifs dominent : le même test, avec la même fiabilité, devient très convaincant. La réponse dépend autant de la rareté de la maladie que de la qualité du test.`;
    }

    if (parseFloat(curseur.value) !== n) curseur.value = String(n);
    const min = parseFloat(curseur.min);
    const max = parseFloat(curseur.max);
    curseur.style.setProperty('--pos', (((n - min) / (max - min)) * 100) + '%');
    curseur.setAttribute('aria-valuetext', `prévalence ${n} %, probabilité d'être malade sachant positif ${pct(proba)} %`);

    toggle.textContent = positifsSeuls ? '↺ remets tout le monde' : '▸ ne garde que les positifs';
    toggle.setAttribute('aria-pressed', String(positifsSeuls));
    for (const btn of presets) {
      btn.setAttribute('aria-pressed', String(parseInt(btn.dataset.prev, 10) === n));
    }
  }

  function interaction() {
    track('widget_interact', { widget: 'depistage', chapitre });
  }

  /* le rendu touche 1 000 points : au plus un par frame pendant un drag */
  let renduPlanifie = 0;
  function planifierRendu() {
    if (!renduPlanifie) renduPlanifie = requestAnimationFrame(() => { renduPlanifie = 0; rendre(); });
  }

  curseur.addEventListener('input', () => {
    if (animation) { animation.stop(); animation = null; }
    n = parseInt(curseur.value, 10);
    interaction();
    planifierRendu();
  });

  for (const btn of presets) {
    btn.addEventListener('click', () => {
      if (animation) animation.stop();
      interaction();
      animation = animerValeur({
        de: n, vers: parseInt(btn.dataset.prev, 10),
        surFrame(v) { n = Math.round(v); rendre(); },
        surFin() { animation = null; },
      });
    });
  }

  toggle.addEventListener('click', () => {
    positifsSeuls = !positifsSeuls;
    interaction();
    rendre();
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    if (animation) { animation.stop(); animation = null; }
    n = nInit;
    positifsSeuls = false;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="depistage"]')) initDepistage(fig);
