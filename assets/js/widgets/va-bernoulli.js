/* Nabla — widgets/va-bernoulli.js
   « Le chamboule-tout » : n lancers identiques et indépendants (n = 2 ou 3),
   chacun fait tomber la pyramide avec la probabilité p (curseur, pas 0,1 —
   tous les pourcentages affichés sont exacts). L'arbre montre les 2ⁿ chemins ;
   toucher une valeur de X (nombre de succès) allume ses chemins et déroule le
   calcul « nombre de chemins × produit le long d'un chemin ».
   Spec de l'instance : premiere/maths/variables-aleatoires/README.md. */

import { el, clamp, fmtCourt } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

/* Géométrie (viewBox 640×410) : profondeur → x ; feuilles n=3 espacées de 50. */
const X_NIVEAU = [36, 180, 326, 470];
const CHEMINS = ['s', 'e'];
const pct = (v) => `${fmtCourt(v * 100, 1)} %`;

function initBernoulli(fig) {
  const d = fig.dataset;
  const pInit = parseFloat(d.pInit);
  const nInit = parseInt(d.nInit, 10);
  let p = pInit;
  let n = nInit;
  let sel = 2; // valeur de X sélectionnée

  const svg = fig.querySelector('svg');

  /* --- construit l'arbre complet (profondeur 3), niveau 3 masquable --- */
  const noeuds = new Map(); // clé '' | 's' | 'se' | 'ses'… → { x, y }
  const feuilles3 = [];
  for (let i = 0; i < 8; i++) {
    const cle = [4, 2, 1].map((b) => (i & b ? 'e' : 's')).join('');
    feuilles3.push(cle);
    noeuds.set(cle, { x: X_NIVEAU[3], y: 30 + 50 * i });
  }
  for (const prof of [2, 1, 0]) {
    for (const cle of [...noeuds.keys()].filter((c) => c.length === prof + 1)) {
      const parent = cle.slice(0, -1);
      if (noeuds.has(parent)) continue;
      const enfants = CHEMINS.map((c) => noeuds.get(parent + c));
      noeuds.set(parent, { x: X_NIVEAU[prof], y: (enfants[0].y + enfants[1].y) / 2 });
    }
  }

  const gNiveau3 = el('g', {}, svg);
  const branches = new Map();
  const probas = new Map();
  const lettres = new Map();
  el('circle', { class: 'pt-noeud', r: 3.5, cx: X_NIVEAU[0], cy: noeuds.get('').y }, svg);

  for (const [cle, pos] of noeuds) {
    if (!cle) continue;
    const parent = noeuds.get(cle.slice(0, -1));
    const groupe = cle.length === 3 ? gNiveau3 : svg;
    const x0 = cle.length === 1 ? parent.x : parent.x + 26;
    const y0 = cle.length === 1 ? parent.y : parent.y + (pos.y < parent.y ? -8 : 4);
    branches.set(cle, el('path', { class: 'arbre-branche', d: `M${x0} ${y0}L${pos.x} ${pos.y}` }, groupe));
    const t = el('text', {
      class: 'arbre-proba', x: (x0 + pos.x) / 2, y: (y0 + pos.y) / 2 - 6, 'text-anchor': 'middle',
    }, groupe);
    probas.set(cle, t);
    const lettre = el('text', { class: 'arbre-evt', x: pos.x + 10, y: pos.y + 5 }, groupe);
    lettre.textContent = cle.at(-1) === 's' ? 'S' : 'E';
    lettres.set(cle, lettre);
  }

  /* valeurs des feuilles : un jeu pour n=3 (bout de l'arbre), un pour n=2 */
  const valeurs3 = new Map();
  for (const cle of feuilles3) {
    valeurs3.set(cle, el('text', { class: 'arbre-feuille-val', x: 502, y: noeuds.get(cle).y + 5 }, gNiveau3));
  }
  const gValeurs2 = el('g', {}, svg);
  const valeurs2 = new Map();
  for (const cle of ['ss', 'se', 'es', 'ee']) {
    valeurs2.set(cle, el('text', { class: 'arbre-feuille-val', x: 362, y: noeuds.get(cle).y + 5 }, gValeurs2));
  }

  /* --- lectures HTML --- */
  const boutonsN = [...fig.querySelectorAll('.segmente button')];
  const groupes = [...fig.querySelectorAll('.js-groupe')];
  const curseur = fig.querySelector('.js-p');
  const lectP = fig.querySelector('.js-lect-p');
  const calcul = fig.querySelector('.js-calcul');
  const chipE = fig.querySelector('.js-esperance');

  const succes = (cle) => [...cle].filter((c) => c === 's').length;

  function rendre() {
    const q = 1 - p;
    const feuilles = n === 3 ? feuilles3 : ['ss', 'se', 'es', 'ee'];
    gNiveau3.style.display = n === 3 ? '' : 'none';
    gValeurs2.style.display = n === 2 ? '' : 'none';

    for (const [cle, t] of probas) t.textContent = fmtCourt(cle.at(-1) === 's' ? p : q, 1);
    for (const [cle, t] of valeurs3) t.textContent = pct(p ** succes(cle) * q ** (3 - succes(cle)));
    for (const [cle, t] of valeurs2) t.textContent = pct(p ** succes(cle) * q ** (2 - succes(cle)));

    /* chemins allumés : toutes les feuilles à `sel` succès et leurs préfixes */
    const actives = new Set();
    for (const f of feuilles) {
      if (succes(f) !== sel) continue;
      for (let l = 1; l <= f.length; l++) actives.add(f.slice(0, l));
    }
    for (const [cle, b] of branches) {
      const actif = actives.has(cle);
      b.classList.toggle('chemin-actif', actif);
      probas.get(cle).classList.toggle('chemin-actif', actif);
    }
    for (const [cle, t] of valeurs3) t.classList.toggle('chemin-actif', n === 3 && actives.has(cle));
    for (const [cle, t] of valeurs2) t.classList.toggle('chemin-actif', n === 2 && actives.has(cle));

    /* boutons de valeurs */
    for (const g of groupes) g.hidden = parseInt(g.dataset.n, 10) !== n;
    for (const g of groupes) {
      for (const b of g.querySelectorAll('.feuille-btn')) {
        const k = parseInt(b.dataset.k, 10);
        const proba = (n === 2 ? [1, 2, 1] : [1, 3, 3, 1])[k] * p ** k * q ** (n - k);
        b.querySelector('.js-val').textContent = pct(proba);
        b.setAttribute('aria-pressed', String(parseInt(g.dataset.n, 10) === n && k === sel));
      }
    }

    /* calcul déroulé */
    const nbChemins = (n === 2 ? [1, 2, 1] : [1, 3, 3, 1])[sel];
    const produit = [...Array(sel).fill(p), ...Array(n - sel).fill(q)].map((v) => fmtCourt(v, 1)).join(' × ');
    const total = nbChemins * p ** sel * q ** (n - sel);
    calcul.textContent = nbChemins === 1
      ? `P(X = ${sel}) = 1 chemin : ${produit} = ${pct(total)}`
      : `P(X = ${sel}) = ${nbChemins} chemins × (${produit}) = ${pct(total)}`;

    const e = n * p;
    chipE.textContent = `E(X) = ${fmtCourt(e, 2)} boîte${e >= 2 ? 's' : ''} par série`;

    const min = parseFloat(curseur.min);
    const max = parseFloat(curseur.max);
    if (parseFloat(curseur.value) !== p) curseur.value = String(p);
    curseur.style.setProperty('--pos', (((p - min) / (max - min)) * 100) + '%');
    curseur.setAttribute('aria-valuetext', `p = ${fmtCourt(p, 1)}`);
    lectP.textContent = fmtCourt(p, 1);
    for (const b of boutonsN) b.setAttribute('aria-pressed', String(parseInt(b.dataset.n, 10) === n));
  }

  function interaction() {
    track('widget_interact', { widget: 'bernoulli', chapitre });
  }

  curseur.addEventListener('input', () => {
    p = clamp(parseFloat(curseur.value), parseFloat(curseur.min), parseFloat(curseur.max));
    interaction();
    rendre();
  });
  for (const b of boutonsN) {
    b.addEventListener('click', () => {
      n = parseInt(b.dataset.n, 10);
      sel = Math.min(sel, n);
      interaction();
      rendre();
    });
  }
  for (const g of groupes) {
    for (const b of g.querySelectorAll('.feuille-btn')) {
      b.addEventListener('click', () => {
        sel = parseInt(b.dataset.k, 10);
        interaction();
        rendre();
      });
    }
  }
  fig.querySelector('.js-reset').addEventListener('click', () => {
    p = pInit;
    n = nInit;
    sel = 2;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="va-bernoulli"]')) initBernoulli(fig);
