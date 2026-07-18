/* Nabla — widgets/parabole-signe.js
   « Le signe se lit sur la parabole » : f(x) = a(x − x₁)(x − x₂), racines
   déplaçables sur l'axe des abscisses (aimantées au demi, écart minimal 1)
   et curseur a. La courbe est peinte par le signe du trinôme (vert au-dessus
   de l'axe, rouge en dessous) et un tableau de signes vivant se met à jour
   sous le graphique : le signe de a à l'extérieur des racines, l'opposé
   entre elles. a = 0 est autorisé et montre le trinôme qui disparaît.
   Spec de l'instance : premiere/maths/second-degre/README.md. */

import {
  el, creerVue, cheminCourbe, grilleUnite, axes, clamp, fmtCourt,
  rendreDraggable, creerHint,
} from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

function initParaboleSigne(fig) {
  const d = fig.dataset;
  const aInit = parseFloat(d.aInit);
  const x1Init = parseFloat(d.x1Init);
  const x2Init = parseFloat(d.x2Init);
  const [racMin, racMax] = d.racines.split(',').map(Number);
  const ECART = 1; // écart minimal entre les deux racines
  let a = aInit;
  let x1 = x1Init;
  let x2 = x2Init;

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, {
    xMin: +d.xmin, xMax: +d.xmax, yMin: +d.ymin, yMax: +d.ymax,
  });

  /* --- décor statique ----------------------------------------------------- */
  el('path', { class: 'g-grid', d: grilleUnite(vue) }, svg);
  el('path', { class: 'g-axis', d: axes(vue) }, svg);

  /* --- éléments dynamiques : 4 morceaux de courbe peints par le signe ------- */
  const segExtG = el('path', {}, svg);
  const segIntA = el('path', {}, svg);
  const segIntB = el('path', {}, svg);
  const segExtD = el('path', {}, svg);
  const halo1 = el('circle', { class: 'pt-halo', r: 12 }, svg);
  const halo2 = el('circle', { class: 'pt-halo', r: 12 }, svg);
  const pt1 = el('circle', { class: 'pt-point', r: 5.5 }, svg);
  const pt2 = el('circle', { class: 'pt-point', r: 5.5 }, svg);
  const lab1 = el('text', { class: 'etiquette-math etiquette-math--muted', 'font-size': 14, 'text-anchor': 'middle' }, svg);
  const lab2 = el('text', { class: 'etiquette-math etiquette-math--muted', 'font-size': 14, 'text-anchor': 'middle' }, svg);

  const hy = vue.yPx(0);
  const hint = creerHint(svg, {
    x: vue.xPx(x2Init) + 22.4, y: hy - 59.1,
    filDe: [vue.xPx(x2Init) + 24.4, hy - 37.1], filVers: [vue.xPx(x2Init) + 5.4, hy - 6.1],
  });

  const hit1 = el('circle', {
    class: 'hit-zone', r: 42,
    tabindex: 0, role: 'slider', 'aria-orientation': 'horizontal',
    'aria-label': 'Racine x indice 1, déplaçable sur l’axe des abscisses',
    'aria-valuemin': String(racMin), 'aria-valuemax': String(racMax),
  }, svg);
  const hit2 = el('circle', {
    class: 'hit-zone', r: 42,
    tabindex: 0, role: 'slider', 'aria-orientation': 'horizontal',
    'aria-label': 'Racine x indice 2, déplaçable sur l’axe des abscisses',
    'aria-valuemin': String(racMin), 'aria-valuemax': String(racMax),
  }, svg);

  /* --- lectures, contrôles, tableau vivant ---------------------------------- */
  const ligne = fig.querySelector('.js-ligne');
  const elX1 = fig.querySelector('.js-x1');
  const elX2 = fig.querySelector('.js-x2');
  const elEtat = fig.querySelector('.js-etat');
  const legende = fig.querySelector('.js-legende');
  const curseur = fig.querySelector('.js-curseur');
  const tX1 = fig.querySelector('.js-t-x1');
  const tX2 = fig.querySelector('.js-t-x2');
  const tExtG = fig.querySelector('.js-t-ext-g');
  const tInt = fig.querySelector('.js-t-int');
  const tExtD = fig.querySelector('.js-t-ext-d');
  const tZero1 = fig.querySelector('.js-t-zero-1');
  const tZero2 = fig.querySelector('.js-t-zero-2');

  function rendre() {
    const f = (x) => a * (x - x1) * (x - x2);
    const m = (x1 + x2) / 2;
    const demiEcart = (x2 - x1) / 2;
    const fSommet = -a * demiEcart * demiEcart;

    const clExt = a > 0 ? 'g-signe-pos' : 'g-signe-neg';
    const clInt = a > 0 ? 'g-signe-neg' : 'g-signe-pos';
    segExtG.setAttribute('class', clExt);
    segExtD.setAttribute('class', clExt);
    segIntA.setAttribute('class', clInt);
    segIntB.setAttribute('class', clInt);

    if (a !== 0) {
      /* bornes visibles : la parabole sort de la vue par borneExt à
         l'extérieur des racines, et parfois par borneInt entre elles */
      const borneExt = a > 0 ? vue.yMax : vue.yMin;
      /* (x − m)² = (borne − fSommet)/a */
      const wOut = Math.sqrt((borneExt - fSommet) / a);
      const xG = Math.max(vue.xMin, m - wOut);
      const xD = Math.min(vue.xMax, m + wOut);
      segExtG.setAttribute('d', cheminCourbe(vue, f, xG, x1, 60));
      segExtD.setAttribute('d', cheminCourbe(vue, f, x2, xD, 60));

      const borneInt = a > 0 ? vue.yMin : vue.yMax;
      const creux = (borneInt - fSommet) / a; // > 0 ⟺ le creux sort de la vue
      if (creux > 0) {
        const wIn = Math.sqrt(creux);
        segIntA.setAttribute('d', cheminCourbe(vue, f, x1, m - wIn, 60));
        segIntB.setAttribute('d', cheminCourbe(vue, f, m + wIn, x2, 60));
      } else {
        segIntA.setAttribute('d', cheminCourbe(vue, f, x1, x2, 90));
        segIntB.setAttribute('d', '');
      }
    } else {
      /* a = 0 : le trinôme s'est aplati sur l'axe */
      segExtG.setAttribute('d', '');
      segExtD.setAttribute('d', '');
      segIntA.setAttribute('d', '');
      segIntB.setAttribute('d', '');
    }

    /* racines */
    const p1 = vue.xPx(x1);
    const p2 = vue.xPx(x2);
    halo1.setAttribute('cx', p1); halo1.setAttribute('cy', hy);
    halo2.setAttribute('cx', p2); halo2.setAttribute('cy', hy);
    pt1.setAttribute('cx', p1); pt1.setAttribute('cy', hy);
    pt2.setAttribute('cx', p2); pt2.setAttribute('cy', hy);
    hit1.setAttribute('cx', p1); hit1.setAttribute('cy', hy);
    hit2.setAttribute('cx', p2); hit2.setAttribute('cy', hy);
    const labY = a >= 0 ? hy - 14 : hy + 24;
    lab1.setAttribute('x', p1); lab1.setAttribute('y', labY);
    lab2.setAttribute('x', p2); lab2.setAttribute('y', labY);
    lab1.textContent = fmtCourt(x1);
    lab2.textContent = fmtCourt(x2);

    /* forme factorisée instanciée */
    const facteur = (r) => (r === 0 ? 'x' : `(x ${r > 0 ? '−' : '+'} ${fmtCourt(Math.abs(r))})`);
    if (a !== 0) {
      const co = a === 1 ? '' : (a === -1 ? '−' : `${fmtCourt(a)} `);
      ligne.textContent = `f(x) = ${co}${facteur(x1)}${facteur(x2)}`;
    } else {
      ligne.textContent = 'f(x) = 0 — le trinôme a disparu';
    }
    elX1.textContent = fmtCourt(x1);
    elX2.textContent = fmtCourt(x2);

    /* tableau de signes vivant */
    tX1.textContent = fmtCourt(x1);
    tX2.textContent = fmtCourt(x2);
    tExtG.textContent = a > 0 ? '+' : (a < 0 ? '−' : '0');
    tExtD.textContent = a > 0 ? '+' : (a < 0 ? '−' : '0');
    tInt.textContent = a > 0 ? '−' : (a < 0 ? '+' : '0');
    tZero1.textContent = '0';
    tZero2.textContent = '0';

    /* chip d'état + légende */
    if (a > 0) {
      elEtat.textContent = 'a > 0 — positif à l’extérieur des racines';
      elEtat.className = 'chip chip--good js-etat';
      legende.textContent = `Au-dessus de l’axe avant ${fmtCourt(x1)} et après ${fmtCourt(x2)} (le signe de a), en dessous entre les deux (le signe opposé).`;
    } else if (a < 0) {
      elEtat.textContent = 'a < 0 — négatif à l’extérieur des racines';
      elEtat.className = 'chip chip--bad js-etat';
      legende.textContent = `La parabole s’est retournée, le tableau aussi : en dessous de l’axe avant ${fmtCourt(x1)} et après ${fmtCourt(x2)}, au-dessus entre les deux.`;
    } else {
      elEtat.textContent = 'a = 0 — le trinôme a disparu';
      elEtat.className = 'chip chip--accent js-etat';
      legende.textContent = 'Avec a = 0 il ne reste rien à signer : la courbe s’est aplatie sur l’axe. Remonte le curseur pour retrouver une parabole.';
    }

    if (parseFloat(curseur.value) !== a) curseur.value = String(a);
    const min = parseFloat(curseur.min);
    const max = parseFloat(curseur.max);
    curseur.style.setProperty('--pos', (((a - min) / (max - min)) * 100) + '%');
    curseur.setAttribute('aria-valuetext', `a = ${fmtCourt(a)}`);
    hit1.setAttribute('aria-valuenow', String(x1));
    hit1.setAttribute('aria-valuetext', `x1 = ${fmtCourt(x1)}`);
    hit2.setAttribute('aria-valuenow', String(x2));
    hit2.setAttribute('aria-valuetext', `x2 = ${fmtCourt(x2)}`);
  }

  function interaction() {
    hint.style.display = 'none';
    track('widget_interact', { widget: 'parabole-signe', chapitre });
  }

  /* déplacement des racines : aimantées au demi, jamais à moins de ECART */
  function poserX1(v) { x1 = clamp(Math.round(v * 2) / 2, racMin, x2 - ECART); }
  function poserX2(v) { x2 = clamp(Math.round(v * 2) / 2, x1 + ECART, racMax); }

  function brancherRacine(hit, poser) {
    rendreDraggable(hit, {
      surDebut() { fig.classList.add('drag-actif'); interaction(); },
      surDeplacement(evt) { poser(vue.xDePointeur(evt)); rendre(); },
      surFin() { fig.classList.remove('drag-actif'); },
    });
    hit.addEventListener('keydown', (e) => {
      const actuel = hit === hit1 ? x1 : x2;
      let cible = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') cible = actuel + 0.5;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') cible = actuel - 0.5;
      else if (e.key === 'Home') cible = racMin;
      else if (e.key === 'End') cible = racMax;
      if (cible === null) return;
      e.preventDefault();
      poser(cible);
      interaction();
      rendre();
    });
  }
  brancherRacine(hit1, poserX1);
  brancherRacine(hit2, poserX2);

  let renduPlanifie = 0;
  function planifierRendu() {
    if (!renduPlanifie) renduPlanifie = requestAnimationFrame(() => { renduPlanifie = 0; rendre(); });
  }
  curseur.addEventListener('input', () => {
    a = clamp(parseFloat(curseur.value), parseFloat(curseur.min), parseFloat(curseur.max));
    interaction();
    planifierRendu();
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    a = aInit; x1 = x1Init; x2 = x2Init;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="parabole-signe"]')) initParaboleSigne(fig);
