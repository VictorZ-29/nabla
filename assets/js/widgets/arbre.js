/* Nabla — widgets/arbre.js
   « L'arbre pondéré, en vrai » : un arbre à deux niveaux (A = il pleut,
   R = tu es en retard) piloté par trois curseurs — P(A), P_A(R), P_Ā(R).
   Les probabilités des branches sœurs se complètent à 1 toutes seules ;
   chaque feuille affiche le produit le long de son chemin. Sous l'arbre,
   une barre de proportion traduit chaque probabilité en aire : multiplier
   le long d'un chemin, c'est prendre une part d'une part. Toucher une
   feuille (boutons sous le graphique) allume son chemin et déroule le
   calcul. Spec : premiere/maths/probabilites-conditionnelles/README.md. */

import { el, clamp, fmt } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

/* Géométrie de l'arbre (viewBox 640×432). */
const RACINE = [58, 158];
const N1 = [[240, 78], [240, 238]];
const XF = 430;
const FEUILLES_Y = [38, 118, 198, 278];
const BARRE = { x: 58, w: 524, y: 362, h: 32, ecart: 3 };

/* Une étiquette d'événement : lettre + barre de négation éventuelle. */
function etiquette(svg, x, y, lettre, barre, classe = 'arbre-evt') {
  const t = el('text', { class: classe, x, y }, svg);
  t.textContent = lettre;
  if (barre) {
    el('path', { class: 'arbre-branche', 'stroke-width': 1.3, d: `M${x - 1} ${y - 15}L${x + 10} ${y - 15}` }, svg);
  }
  return t;
}

function initArbre(fig) {
  const d = fig.dataset;
  const pInit = parseFloat(d.pInit);
  const paInit = parseFloat(d.paInit);
  const pnInit = parseFloat(d.pnInit);
  let p = pInit;   // P(A)
  let pa = paInit; // P_A(R)
  let pn = pnInit; // P_Ā(R)
  let feuille = 'ar'; // chemin sélectionné

  const svg = fig.querySelector('svg');

  /* --- branches (6) ------------------------------------------------------- */
  const seg = (x1, y1, x2, y2) => el('path', { class: 'arbre-branche', d: `M${x1} ${y1}L${x2} ${y2}` }, svg);
  const branches = {
    a: seg(RACINE[0], RACINE[1], N1[0][0], N1[0][1]),
    n: seg(RACINE[0], RACINE[1], N1[1][0], N1[1][1]),
    ar: seg(N1[0][0] + 26, N1[0][1] - 8, XF, FEUILLES_Y[0]),
    an: seg(N1[0][0] + 26, N1[0][1] + 4, XF, FEUILLES_Y[1]),
    nr: seg(N1[1][0] + 26, N1[1][1] - 8, XF, FEUILLES_Y[2]),
    nn: seg(N1[1][0] + 26, N1[1][1] + 4, XF, FEUILLES_Y[3]),
  };

  /* --- nœuds et étiquettes d'événements ------------------------------------ */
  el('circle', { class: 'pt-noeud', r: 3.5, cx: RACINE[0], cy: RACINE[1] }, svg);
  etiquette(svg, N1[0][0] + 6, N1[0][1] + 5, 'A', false);
  etiquette(svg, N1[1][0] + 6, N1[1][1] + 5, 'A', true);
  etiquette(svg, XF + 12, FEUILLES_Y[0] + 5, 'R', false);
  etiquette(svg, XF + 12, FEUILLES_Y[1] + 5, 'R', true);
  etiquette(svg, XF + 12, FEUILLES_Y[2] + 5, 'R', false);
  etiquette(svg, XF + 12, FEUILLES_Y[3] + 5, 'R', true);

  /* --- probabilités des branches et valeurs des feuilles -------------------- */
  const probaTexte = (x, y) => el('text', { class: 'arbre-proba', x, y, 'text-anchor': 'middle' }, svg);
  const probas = {
    a: probaTexte(146, 102),
    n: probaTexte(146, 224),
    ar: probaTexte(348, 42),
    an: probaTexte(348, 122),
    nr: probaTexte(348, 202),
    nn: probaTexte(348, 282),
  };
  const valeurs = {};
  for (const [cle, y] of [['ar', FEUILLES_Y[0]], ['an', FEUILLES_Y[1]], ['nr', FEUILLES_Y[2]], ['nn', FEUILLES_Y[3]]]) {
    valeurs[cle] = el('text', { class: 'arbre-feuille-val', x: 486, y: y + 5 }, svg);
  }

  /* --- barre de proportion : aire = probabilité ------------------------------ */
  const legendeAire = el('text', { class: 'pop-dim', x: BARRE.x, y: BARRE.y - 14 }, svg);
  legendeAire.textContent = 'la même expérience, vue en aires :';
  el('rect', { class: 'seg-plein', x: 470, y: BARRE.y - 24, width: 11, height: 11, rx: 2 }, svg);
  const legendeR = el('text', { class: 'pop-dim', x: 487, y: BARRE.y - 14 }, svg);
  legendeR.textContent = 'retard (R)';

  const segments = {
    ar: el('rect', { class: 'seg-plein', y: BARRE.y, height: BARRE.h }, svg),
    an: el('rect', { class: 'seg-vide', y: BARRE.y, height: BARRE.h }, svg),
    nr: el('rect', { class: 'seg-plein', y: BARRE.y, height: BARRE.h }, svg),
    nn: el('rect', { class: 'seg-vide', y: BARRE.y, height: BARRE.h }, svg),
  };
  const cadreA = el('rect', { class: 'seg-cadre', y: BARRE.y, height: BARRE.h }, svg);
  const cadreN = el('rect', { class: 'seg-cadre', y: BARRE.y, height: BARRE.h }, svg);
  const etiqA = el('text', { class: 'pop-dim', y: BARRE.y + BARRE.h + 20, 'text-anchor': 'middle' }, svg);
  const etiqN = el('text', { class: 'pop-dim', y: BARRE.y + BARRE.h + 20, 'text-anchor': 'middle' }, svg);

  /* --- lectures HTML ---------------------------------------------------------- */
  const curseurs = {
    p: fig.querySelector('.js-p'),
    pa: fig.querySelector('.js-pa'),
    pn: fig.querySelector('.js-pn'),
  };
  const lect = {
    p: fig.querySelector('.js-lect-p'),
    pa: fig.querySelector('.js-lect-pa'),
    pn: fig.querySelector('.js-lect-pn'),
  };
  const boutons = [...fig.querySelectorAll('.feuille-btn')];
  const valBtn = {};
  for (const b of boutons) valBtn[b.dataset.feuille] = b.querySelector('.js-val');
  const calcul = fig.querySelector('.js-calcul');
  const chipSomme = fig.querySelector('.js-somme');

  function majCurseur(curseur, valeur, texte) {
    if (parseFloat(curseur.value) !== valeur) curseur.value = String(valeur);
    const min = parseFloat(curseur.min);
    const max = parseFloat(curseur.max);
    curseur.style.setProperty('--pos', (((valeur - min) / (max - min)) * 100) + '%');
    curseur.setAttribute('aria-valuetext', texte);
  }

  function rendre() {
    const probaFeuilles = {
      ar: p * pa,
      an: p * (1 - pa),
      nr: (1 - p) * pn,
      nn: (1 - p) * (1 - pn),
    };

    probas.a.textContent = fmt(p);
    probas.n.textContent = fmt(1 - p);
    probas.ar.textContent = fmt(pa);
    probas.an.textContent = fmt(1 - pa);
    probas.nr.textContent = fmt(pn);
    probas.nn.textContent = fmt(1 - pn);
    for (const cle of ['ar', 'an', 'nr', 'nn']) {
      valeurs[cle].textContent = fmt(probaFeuilles[cle]);
      valBtn[cle].textContent = fmt(probaFeuilles[cle]);
    }

    /* barre : groupe A (pluie) puis groupe Ā, séparés d'un petit blanc */
    const utile = BARRE.w - BARRE.ecart;
    const wA = utile * p;
    const wN = utile - wA;
    const x0 = BARRE.x;
    const xN = x0 + wA + BARRE.ecart;
    segments.ar.setAttribute('x', x0);
    segments.ar.setAttribute('width', Math.max(0, wA * pa));
    segments.an.setAttribute('x', x0 + wA * pa);
    segments.an.setAttribute('width', Math.max(0, wA * (1 - pa)));
    segments.nr.setAttribute('x', xN);
    segments.nr.setAttribute('width', Math.max(0, wN * pn));
    segments.nn.setAttribute('x', xN + wN * pn);
    segments.nn.setAttribute('width', Math.max(0, wN * (1 - pn)));
    cadreA.setAttribute('x', x0);
    cadreA.setAttribute('width', Math.max(0, wA));
    cadreN.setAttribute('x', xN);
    cadreN.setAttribute('width', Math.max(0, wN));

    etiqA.setAttribute('x', x0 + wA / 2);
    etiqA.textContent = `pluie — ${fmt(p * 100, 0)} %`;
    etiqA.style.display = wA >= 110 ? '' : 'none';
    etiqN.setAttribute('x', xN + wN / 2);
    etiqN.textContent = `pas de pluie — ${fmt((1 - p) * 100, 0)} %`;
    etiqN.style.display = wN >= 150 ? '' : 'none';

    /* chemin sélectionné */
    const niveau1 = feuille[0] === 'a' ? 'a' : 'n';
    for (const [cle, br] of Object.entries(branches)) {
      const actif = cle === niveau1 || cle === feuille;
      br.classList.toggle('chemin-actif', actif);
      probas[cle].classList.toggle('chemin-actif', actif);
    }
    for (const cle of ['ar', 'an', 'nr', 'nn']) {
      valeurs[cle].classList.toggle('chemin-actif', cle === feuille);
    }
    for (const b of boutons) b.setAttribute('aria-pressed', String(b.dataset.feuille === feuille));

    /* calcul déroulé du chemin sélectionné */
    const b1 = niveau1 === 'a' ? p : 1 - p;
    const b2v = feuille === 'ar' ? pa : feuille === 'an' ? 1 - pa : feuille === 'nr' ? pn : 1 - pn;
    const evt1 = niveau1 === 'a' ? 'A' : 'A̅';
    const evt2 = feuille[1] === 'r' ? 'R' : 'R̅';
    const sub = niveau1 === 'a' ? 'A' : 'A̅';
    calcul.innerHTML = `P(${evt1} ∩ ${evt2}) = P(${evt1}) × P<sub>${sub}</sub>(${evt2}) = ${fmt(b1)} × ${fmt(b2v)} = <span class="val-accent">${fmt(b1 * b2v)}</span>`;

    const somme = probaFeuilles.ar + probaFeuilles.an + probaFeuilles.nr + probaFeuilles.nn;
    chipSomme.textContent = fmt(somme);

    majCurseur(curseurs.p, p, `P(A) = ${fmt(p)}`);
    majCurseur(curseurs.pa, pa, `probabilité de R sachant A : ${fmt(pa)}`);
    majCurseur(curseurs.pn, pn, `probabilité de R sachant non A : ${fmt(pn)}`);
    lect.p.textContent = fmt(p);
    lect.pa.textContent = fmt(pa);
    lect.pn.textContent = fmt(pn);
  }

  function interaction() {
    track('widget_interact', { widget: 'arbre', chapitre });
  }

  /* les événements input peuvent dépasser la cadence d'affichage pendant un
     drag : au plus un rendu par frame */
  let renduPlanifie = 0;
  function planifierRendu() {
    if (!renduPlanifie) renduPlanifie = requestAnimationFrame(() => { renduPlanifie = 0; rendre(); });
  }

  const brancher = (curseur, poser) => {
    curseur.addEventListener('input', () => {
      poser(clamp(parseFloat(curseur.value), parseFloat(curseur.min), parseFloat(curseur.max)));
      interaction();
      planifierRendu();
    });
  };
  brancher(curseurs.p, (v) => { p = v; });
  brancher(curseurs.pa, (v) => { pa = v; });
  brancher(curseurs.pn, (v) => { pn = v; });

  for (const b of boutons) {
    b.addEventListener('click', () => {
      feuille = b.dataset.feuille;
      interaction();
      rendre();
    });
  }

  fig.querySelector('.js-reset').addEventListener('click', () => {
    p = pInit;
    pa = paInit;
    pn = pnInit;
    feuille = 'ar';
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="arbre"]')) initArbre(fig);
