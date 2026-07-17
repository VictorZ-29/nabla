/* Nabla — widgets/bernoulli.js
   « Trois lancers francs » : l'arbre d'une succession de trois épreuves de
   Bernoulli identiques et indépendantes (succès S de probabilité p, échec E).
   Un curseur règle p ; un segmenté choisit l'événement (« k succès » ou
   « au moins 1 ») : les chemins qui le réalisent s'allument et le calcul se
   déroule — produit le long d'un chemin, somme des chemins, contraire pour
   « au moins 1 ». Sans jamais formaliser la loi binomiale (programme 2026).
   Spec : premiere/maths/probabilites-conditionnelles/README.md. */

import { el, clamp, fmt, fmtCourt } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

/* Géométrie de l'arbre (viewBox 640×404) : racine → 2 → 4 → 8 feuilles. */
const RACINE = [30, 202];
const N1 = [[190, 106], [190, 298]];
const N2 = [[350, 58], [350, 154], [350, 250], [350, 346]];
const XF = 510;
const FEUILLES_Y = [34, 82, 130, 178, 226, 274, 322, 370];
/* Feuille i (0…7) : bits de i = échecs (0 = S en haut) ; nb de succès. */
const SUCCES = [3, 2, 2, 1, 2, 1, 1, 0];

function initBernoulli(fig) {
  const pInit = parseFloat(fig.dataset.pInit);
  let p = pInit;
  let choix = '3'; // '0' | '1' | '2' | '3' | 'plus'

  const svg = fig.querySelector('svg');
  const seg = (x1, y1, x2, y2) => el('path', { class: 'arbre-branche', d: `M${x1} ${y1}L${x2} ${y2}` }, svg);
  const lettre = (x, y, s) => {
    const t = el('text', { class: 'arbre-evt', x, y }, svg);
    t.textContent = s;
    return t;
  };
  const probaTexte = (x, y) => el('text', { class: 'arbre-proba', x, y, 'text-anchor': 'middle' }, svg);

  el('circle', { class: 'pt-noeud', r: 3.5, cx: RACINE[0], cy: RACINE[1] }, svg);

  /* Niveau 1 : racine → S / E. */
  const br1 = N1.map((n) => seg(RACINE[0], RACINE[1], n[0] - 14, n[1] - 4));
  N1.forEach((n, i) => lettre(n[0] - 6, n[1] + 5, i === 0 ? 'S' : 'E'));
  const pr1 = [probaTexte(103, 140), probaTexte(103, 266)];

  /* Niveau 2 : chaque nœud → S / E. */
  const br2 = N2.map((n, i) => {
    const dep = N1[i >> 1];
    return seg(dep[0] + 14, dep[1] + (i % 2 === 0 ? -8 : 4), n[0] - 14, n[1] - 4);
  });
  N2.forEach((n, i) => lettre(n[0] - 6, n[1] + 5, i % 2 === 0 ? 'S' : 'E'));
  const pr2 = [probaTexte(283, 66), probaTexte(283, 148), probaTexte(283, 258), probaTexte(283, 344)];

  /* Niveau 3 : 8 feuilles — lettre puis valeur du chemin. */
  const br3 = [];
  const pr3 = [];
  const valeurs = [];
  FEUILLES_Y.forEach((y, i) => {
    const dep = N2[i >> 1];
    br3.push(seg(dep[0] + 14, dep[1] + (i % 2 === 0 ? -8 : 4), XF - 14, y - 4));
    lettre(XF - 6, y + 5, i % 2 === 0 ? 'S' : 'E');
    pr3.push(probaTexte(437, i % 2 === 0 ? y - 8 : y + 14));
    valeurs.push(el('text', { class: 'arbre-feuille-val', x: XF + 34, y: y + 5 }, svg));
  });

  /* Lectures HTML. */
  const curseur = fig.querySelector('.js-curseur');
  const lectP = fig.querySelector('.js-p');
  const chipP = fig.querySelector('.js-chip-p');
  const chipQ = fig.querySelector('.js-chip-q');
  const chipSomme = fig.querySelector('.js-somme');
  const ligne1 = fig.querySelector('.js-ligne1');
  const l2pre = fig.querySelector('.js-l2pre');
  const l2val = fig.querySelector('.js-l2val');
  const boutons = [...fig.querySelectorAll('.js-choix button')];

  function rendre() {
    const q = 1 - p;
    /* probabilité d'une feuille : p^succès × q^échecs */
    const probaFeuille = (i) => Math.pow(p, SUCCES[i]) * Math.pow(q, 3 - SUCCES[i]);

    /* feuilles allumées par l'événement choisi */
    const allumee = (i) => (choix === 'plus' ? SUCCES[i] >= 1 : SUCCES[i] === parseInt(choix, 10));

    /* branches : allumées si elles portent au moins un chemin allumé */
    const l1On = [false, false];
    const l2On = [false, false, false, false];
    for (let i = 0; i < 8; i++) {
      if (!allumee(i)) continue;
      l1On[i >> 2] = true;
      l2On[i >> 1] = true;
    }
    br1.forEach((b, i) => b.classList.toggle('chemin-actif', l1On[i]));
    pr1.forEach((t, i) => t.classList.toggle('chemin-actif', l1On[i]));
    br2.forEach((b, i) => b.classList.toggle('chemin-actif', l2On[i]));
    pr2.forEach((t, i) => t.classList.toggle('chemin-actif', l2On[i]));
    br3.forEach((b, i) => b.classList.toggle('chemin-actif', allumee(i)));
    pr3.forEach((t, i) => t.classList.toggle('chemin-actif', allumee(i)));

    /* textes : probabilités des branches (les mêmes à chaque étage) */
    pr1[0].textContent = fmt(p);
    pr1[1].textContent = fmt(q);
    pr2.forEach((t, i) => { t.textContent = fmt(i % 2 === 0 ? p : q); });
    pr3.forEach((t, i) => { t.textContent = fmt(i % 2 === 0 ? p : q); });
    let somme = 0;
    valeurs.forEach((t, i) => {
      const v = probaFeuille(i);
      somme += v;
      t.textContent = fmt(v, 3);
      t.classList.toggle('chemin-actif', allumee(i));
    });

    /* calcul déroulé */
    const fp = fmt(p);
    const fq = fmt(q);
    if (choix === '3' || choix === '0') {
      const s = choix === '3';
      ligne1.textContent = s ? 'Un seul chemin réalise 3 succès : S – S – S.' : 'Un seul chemin ne contient aucun succès : E – E – E.';
      const f = s ? fp : fq;
      l2pre.textContent = `P(${choix} succès) = ${f} × ${f} × ${f} = `;
      l2val.textContent = fmt(s ? p ** 3 : q ** 3, 3);
    } else if (choix === 'plus') {
      ligne1.textContent = '7 chemins sur 8… trop long d’additionner : passe par le contraire, le seul chemin sans succès.';
      l2pre.textContent = `P(au moins 1 succès) = 1 − P(0 succès) = 1 − ${fmt(q ** 3, 3)} = `;
      l2val.textContent = fmt(1 - q ** 3, 3);
    } else {
      const k = parseInt(choix, 10);
      const chemin = k === 2 ? p * p * q : p * q * q;
      const produit = k === 2 ? `${fp} × ${fp} × ${fq}` : `${fp} × ${fq} × ${fq}`;
      const fc = fmt(chemin, 3);
      ligne1.textContent = `3 chemins réalisent ${k} succès — chacun vaut ${produit} = ${fc}, dans un ordre différent.`;
      l2pre.textContent = `P(${k} succès) = ${fc} + ${fc} + ${fc} = `;
      l2val.textContent = fmt(3 * chemin, 3);
    }

    chipSomme.textContent = fmt(somme, 3);
    chipP.textContent = fmt(p);
    chipQ.textContent = fmt(q);
    lectP.textContent = fmtCourt(p);
    if (parseFloat(curseur.value) !== p) curseur.value = String(p);
    curseur.style.setProperty('--pos', (((p - 0.1) / 0.8) * 100) + '%');
    curseur.setAttribute('aria-valuetext', `probabilité de succès : ${fmtCourt(p)}`);
    for (const b of boutons) b.setAttribute('aria-pressed', String(b.dataset.k === choix));
  }

  function interaction() {
    track('widget_interact', { widget: 'bernoulli', chapitre });
  }

  let renduPlanifie = 0;
  function planifierRendu() {
    if (!renduPlanifie) renduPlanifie = requestAnimationFrame(() => { renduPlanifie = 0; rendre(); });
  }

  curseur.addEventListener('input', () => {
    p = clamp(parseFloat(curseur.value), 0.1, 0.9);
    interaction();
    planifierRendu();
  });
  for (const b of boutons) {
    b.addEventListener('click', () => {
      choix = b.dataset.k;
      interaction();
      rendre();
    });
  }
  fig.querySelector('.js-reset').addEventListener('click', () => {
    p = pInit;
    choix = '3';
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="bernoulli"]')) initBernoulli(fig);
