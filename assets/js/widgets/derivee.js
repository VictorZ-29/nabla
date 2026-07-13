/* Nabla — widgets/derivee.js
   « Construis f′ à partir de f » : deux graphiques superposés. En haut, un
   point A déplaçable sur f avec sa mini-tangente ; en bas, le point
   (a ; f′(a)) laisse une trace persistante — la courbe de f′ se construit
   point par point au fil du balayage. Réinitialiser efface la trace.
   Spec de l'instance : premiere/maths/derivation/README.md. */

import {
  FONCTIONS, el, creerVue, cheminCourbe, grilleUnite, axes,
  clamp, fmt, rendreDraggable,
} from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';
const N_CASES = 240; // cases de trace sur le domaine (pas ≈ 0,0175)

function initDerivee(fig) {
  const d = fig.dataset;
  const { f, fp } = FONCTIONS[d.fn];
  const aInit = parseFloat(d.aInit);
  const [domMin, domMax] = d.domaine.split(',').map(Number);
  let a = aInit;
  let aPrec = aInit;

  const svgF = fig.querySelector('.js-graph-f');
  const svgFp = fig.querySelector('.js-graph-fp');
  const vueF = creerVue(svgF, {
    xMin: +d.xmin, xMax: +d.xmax, yMin: +d.yminF, yMax: +d.ymaxF,
  });
  const vueFp = creerVue(svgFp, {
    xMin: +d.xmin, xMax: +d.xmax, yMin: +d.yminFp, yMax: +d.ymaxFp,
  });

  /* --- graphique de f (haut) ------------------------------------------------ */
  el('path', { class: 'g-grid', d: grilleUnite(vueF) }, svgF);
  el('path', { class: 'g-axis', d: axes(vueF) }, svgF);
  const guideF = el('path', { class: 'g-guide-accent', 'stroke-dasharray': '3 5' }, svgF);
  const labF = el('text', { class: 'etiquette-math', 'font-size': 17, x: 16, y: 26 }, svgF);
  labF.textContent = 'f';
  el('path', { class: 'g-courbe', d: cheminCourbe(vueF, f, domMin, domMax) }, svgF);
  const miniTan = el('path', { class: 'g-tangente-mini' }, svgF);
  const ptA = el('circle', { class: 'pt-fixe pt-fixe--surface', r: 4.5 }, svgF);
  const labA = el('text', { class: 'etiquette-math', 'font-size': 16 }, svgF);
  labA.textContent = 'A';
  const hit = el('circle', {
    class: 'hit-zone', r: 42,
    tabindex: 0, role: 'slider', 'aria-orientation': 'horizontal',
    'aria-label': 'Abscisse a du point A',
    'aria-valuemin': String(domMin), 'aria-valuemax': String(domMax),
  }, svgF);

  /* --- graphique de f′ (bas) --------------------------------------------------- */
  el('path', { class: 'g-grid', d: grilleUnite(vueFp) }, svgFp);
  el('path', { class: 'g-axis', d: axes(vueFp) }, svgFp);
  const guideFp = el('path', { class: 'g-guide-accent', 'stroke-dasharray': '3 5' }, svgFp);
  const labFp = el('text', { class: 'etiquette-math', 'font-size': 17, x: 16, y: 26 }, svgFp);
  labFp.textContent = 'f ′';
  const trace = el('path', { class: 'g-courbe-derivee' }, svgFp);
  const ptFp = el('circle', { class: 'pt-derivee', r: 4.5 }, svgFp);
  const labVal = el('text', {
    class: 'etiquette-mono etiquette-math--accent', 'font-size': 11.5,
  }, svgFp);

  /* --- trace : cases visitées sur le domaine -------------------------------------- */
  const pas = (domMax - domMin) / N_CASES;
  let visitees = new Array(N_CASES + 1).fill(false);
  const caseDe = (x) => clamp(Math.round((x - domMin) / pas), 0, N_CASES);

  function marquer(x0, x1) {
    const i0 = caseDe(Math.min(x0, x1));
    const i1 = caseDe(Math.max(x0, x1));
    let nouveau = false;
    for (let i = i0; i <= i1; i++) {
      if (!visitees[i]) { visitees[i] = true; nouveau = true; }
    }
    if (nouveau) dessinerTrace();
  }

  function dessinerTrace() {
    const morceaux = [];
    let ouvert = false;
    for (let i = 0; i <= N_CASES; i++) {
      if (visitees[i]) {
        const x = domMin + i * pas;
        const p = `${Math.round(vueFp.xPx(x) * 10) / 10} ${Math.round(vueFp.yPx(fp(x)) * 10) / 10}`;
        morceaux.push((ouvert ? 'L' : 'M') + p);
        ouvert = true;
      } else {
        ouvert = false;
      }
    }
    trace.setAttribute('d', morceaux.join(''));
  }

  function rendre() {
    const fa = f(a);
    const pente = fp(a);
    const ax = vueF.xPx(a);
    const ay = vueF.yPx(fa);

    guideF.setAttribute('d', `M${ax} ${vueF.hauteur}L${ax} 0`);
    guideFp.setAttribute('d', `M${ax} ${vueFp.hauteur}L${ax} 0`);

    /* mini-tangente : ± 30 px de part et d'autre de A, le long de la tangente */
    const dx = 30 / vueF.pxParX;
    miniTan.setAttribute('d',
      `M${vueF.xPx(a - dx)} ${vueF.yPx(fa - pente * dx)}L${vueF.xPx(a + dx)} ${vueF.yPx(fa + pente * dx)}`);

    ptA.setAttribute('cx', ax); ptA.setAttribute('cy', ay);
    hit.setAttribute('cx', ax); hit.setAttribute('cy', ay);
    labA.setAttribute('x', clamp(ax + 12, 8, vueF.largeur - 16));
    labA.setAttribute('y', clamp(ay + 22, 14, vueF.hauteur - 6));

    const py = vueFp.yPx(pente);
    ptFp.setAttribute('cx', ax); ptFp.setAttribute('cy', py);
    labVal.textContent = `f′(a) = ${fmt(pente)}`;
    const gauche = ax > vueFp.largeur - 120;
    labVal.setAttribute('text-anchor', gauche ? 'end' : 'start');
    labVal.setAttribute('x', ax + (gauche ? -12 : 12));
    labVal.setAttribute('y', clamp(py - 4.6, 12, vueFp.hauteur - 6));

    hit.setAttribute('aria-valuenow', String(Math.round(a * 100) / 100));
    hit.setAttribute('aria-valuetext', `a = ${fmt(a)}`);

    marquer(aPrec, a);
    aPrec = a;
  }

  function interaction() {
    track('widget_interact', { widget: 'derivee', chapitre });
  }

  rendreDraggable(hit, {
    surDebut() { fig.classList.add('drag-actif'); interaction(); },
    surDeplacement(evt) {
      a = clamp(vueF.xDePointeur(evt), domMin, domMax);
      rendre();
    },
    surFin() { fig.classList.remove('drag-actif'); },
  });

  hit.addEventListener('keydown', (e) => {
    const pasClavier = e.shiftKey ? 0.01 : 0.05;
    let cible = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') cible = a + pasClavier;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') cible = a - pasClavier;
    else if (e.key === 'Home') cible = domMin;
    else if (e.key === 'End') cible = domMax;
    if (cible === null) return;
    e.preventDefault();
    a = clamp(cible, domMin, domMax);
    interaction();
    rendre();
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    a = aInit;
    aPrec = aInit;
    visitees = new Array(N_CASES + 1).fill(false);
    dessinerTrace();
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="derivee"]')) initDerivee(fig);
