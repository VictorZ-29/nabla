/* Nabla — widgets/independance.js
   « Déplace les musiciens » : la même classe de 40 élèves qu'au début du
   chapitre. Les 12 musiciens sont fixes en nombre ; un curseur choisit
   combien d'entre eux font du théâtre (k parmi les 10 du cadre). Deux
   jauges comparent la part de musiciens dans le cadre (k/10) et en dehors
   ((12 − k)/30) au repère de toute la classe (0,30). Quand les trois
   coïncident (k = 3), savoir « il fait du théâtre » n'apprend rien sur la
   musique : c'est l'indépendance, vue avant d'être définie. La ligne du
   bas confronte P(T ∩ M) à P(T) × P(M).
   Spec : premiere/maths/probabilites-conditionnelles/README.md. */

import { el, clamp, fmtCourt } from '../nabla-graph.js';
import { track } from '../analytics.js';
import { POP, dessinerPopulation } from './univers.js';

const chapitre = document.body.dataset.chapitre || '';

/* Ordres de remplissage : les 6 premiers de chaque liste reproduisent la
   répartition du reste du chapitre (k = 6), les suivants prolongent. */
const ORDRE_T = [0, 3, 4, 6, 7, 9, 1, 2, 5, 8];
const ORDRE_O = [2, 9, 13, 17, 22, 28, 5, 11, 19, 24, 0, 15];

const JAUGE = { x: 210, w: 300, h: 18, yT: 380, yO: 412 };
const REPERE = 0.3;

function initIndependance(fig) {
  const kInit = parseInt(fig.dataset.kInit, 10);
  let k = kInit;

  const svg = fig.querySelector('svg');
  const points = dessinerPopulation(svg);
  const pointsT = points.slice(0, 10);
  const pointsO = points.slice(10);

  /* --- jauges de comparaison, sous la population ----------------------------- */
  const jauge = (y, libelle) => {
    el('rect', { class: 'jauge-fond', x: JAUGE.x, y, width: JAUGE.w, height: JAUGE.h, rx: 4 }, svg);
    const plein = el('rect', { class: 'jauge-plein', x: JAUGE.x, y, height: JAUGE.h, rx: 4 }, svg);
    const etiq = el('text', { class: 'pop-dim', x: JAUGE.x - 14, y: y + 13.5, 'text-anchor': 'end' }, svg);
    etiq.textContent = libelle;
    const val = el('text', { class: 'pop-dim pop-dim--accent', x: JAUGE.x + JAUGE.w + 12, y: y + 13.5 }, svg);
    return { plein, val };
  };
  const titreJauges = el('text', { class: 'pop-dim', x: JAUGE.x + JAUGE.w * REPERE, y: JAUGE.yT - 18, 'text-anchor': 'middle' }, svg);
  titreJauges.textContent = 'part de musiciens — repère : toute la classe, 0,30';
  const jaugeT = jauge(JAUGE.yT, 'chez les 10 du théâtre');
  const jaugeO = jauge(JAUGE.yO, 'chez les 30 autres');
  el('path', {
    class: 'jauge-repere',
    d: `M${JAUGE.x + JAUGE.w * REPERE} ${JAUGE.yT - 8}L${JAUGE.x + JAUGE.w * REPERE} ${JAUGE.yO + JAUGE.h + 8}`,
  }, svg);

  /* --- lectures HTML ----------------------------------------------------------- */
  const curseur = fig.querySelector('.js-curseur');
  const lectK = fig.querySelector('.js-k');
  const chipPtm = fig.querySelector('.js-ptm');
  const chipEtat = fig.querySelector('.js-etat');
  const formule = fig.querySelector('.js-formule');

  function rendre() {
    pointsT.forEach((p, i) => {
      p.el.setAttribute('class', ORDRE_T.indexOf(i) < k ? 'pt-pop pt-pop--b' : 'pt-pop');
    });
    pointsO.forEach((p, i) => {
      p.el.setAttribute('class', ORDRE_O.indexOf(i) > -1 && ORDRE_O.indexOf(i) < 12 - k ? 'pt-pop pt-pop--b' : 'pt-pop');
    });

    const pT = k / 10;
    const pO = (12 - k) / 30;
    jaugeT.plein.setAttribute('width', JAUGE.w * pT);
    jaugeT.val.textContent = `${k}/10 = ${fmtCourt(pT)}`;
    jaugeO.plein.setAttribute('width', JAUGE.w * pO);
    jaugeO.val.textContent = `${12 - k}/30 = ${fmtCourt(pO)}`;

    lectK.textContent = String(k);
    chipPtm.textContent = fmtCourt(pT);
    if (k > 3) {
      chipEtat.textContent = 'savoir T augmente les chances de M';
      chipEtat.className = 'chip chip--good js-etat';
    } else if (k < 3) {
      chipEtat.textContent = 'savoir T baisse les chances de M';
      chipEtat.className = 'chip chip--bad js-etat';
    } else {
      chipEtat.textContent = 'savoir T ne change rien — indépendants !';
      chipEtat.className = 'chip chip--accent js-etat';
    }

    const inter = k / 40;
    const produit = 0.25 * 0.3;
    formule.innerHTML = `P(T ∩ M) = ${k}/40 = ${fmtCourt(inter, 3)} · P(T) × P(M) = 0,25 × 0,30 = 0,075 → `
      + (Math.abs(inter - produit) < 1e-9
        ? '<span class="val-accent">égaux : indépendants</span>'
        : 'différents : dépendants');

    if (parseFloat(curseur.value) !== k) curseur.value = String(k);
    const min = parseFloat(curseur.min);
    const max = parseFloat(curseur.max);
    curseur.style.setProperty('--pos', (((k - min) / (max - min)) * 100) + '%');
    curseur.setAttribute('aria-valuetext', `${k} musiciens parmi les 10 du théâtre, probabilité de M sachant T : ${fmtCourt(pT)}`);
  }

  function interaction() {
    track('widget_interact', { widget: 'independance', chapitre });
  }

  let renduPlanifie = 0;
  curseur.addEventListener('input', () => {
    k = clamp(parseInt(curseur.value, 10), 0, 10);
    interaction();
    if (!renduPlanifie) {
      renduPlanifie = requestAnimationFrame(() => { renduPlanifie = 0; rendre(); });
    }
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    k = kInit;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="independance"]')) initIndependance(fig);
