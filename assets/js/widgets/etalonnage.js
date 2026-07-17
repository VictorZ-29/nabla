/* Nabla — widgets/etalonnage.js
   « Dose avec la lumière » : la droite d'étalonnage A = k × c d'un colorant,
   construite sur cinq solutions étalons (points craie). Un curseur règle
   l'absorbance A mesurée ; les guides accent font le geste du dosage —
   horizontale jusqu'à la droite, verticale jusqu'à l'axe des c — et la
   concentration se lit en bas. Bouton accent « ta mesure » : l'absorbance
   du sirop mystère (A = 0,54), animée par animerValeur. Le pas du curseur
   (0,03) est calé sur k = 0,075 : c avance par pas de 0,4 µmol/L, tout
   affichage est exact. La cuve en haut à droite pâlit avec c : la couleur
   est la grandeur que l'appareil mesure.
   Spec : premiere/physique-chimie/composition-systeme/README.md. */

import { el, creerVue, clamp, fmt, fmtCourt, animerValeur } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

function initEtalonnage(fig) {
  const d = fig.dataset;
  const k = parseFloat(d.k);              /* pente : A par (µmol/L) */
  const aInit = parseFloat(d.aInit);
  const aMax = parseFloat(d.aMax);        /* = A du dernier étalon (borne de la gamme) */
  const aMesure = parseFloat(d.aMesure);  /* l'absorbance du sirop mystère */
  const etalons = JSON.parse(fig.querySelector('script[type="application/json"]').textContent);
  let A = aInit;
  let animation = null;

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, { xMin: -0.7, xMax: 11.5, yMin: -0.075, yMax: 0.87 });

  /* --- décor statique : grille (1 µmol/L en c ; 0,1 en A), axes, gamme ----- */
  let dGrille = '';
  for (let gc = 1; gc <= 11.01; gc += 1) {
    dGrille += `M${vue.xPx(gc).toFixed(1)} 0L${vue.xPx(gc).toFixed(1)} ${vue.hauteur}`;
  }
  for (let ga = 0.1; ga <= 0.801; ga += 0.1) {
    dGrille += `M0 ${vue.yPx(ga).toFixed(1)}L${vue.largeur} ${vue.yPx(ga).toFixed(1)}`;
  }
  el('path', { class: 'g-grid', d: dGrille }, svg);
  el('path', {
    class: 'g-axis',
    d: `M0 ${vue.yPx(0).toFixed(1)}L${vue.largeur} ${vue.yPx(0).toFixed(1)}` +
       `M${vue.xPx(0).toFixed(1)} ${vue.hauteur}L${vue.xPx(0).toFixed(1)} 0`,
  }, svg);
  const labC = el('text', {
    class: 'etiquette-math etiquette-math--muted', 'font-size': 15,
    x: vue.largeur - 10, y: vue.yPx(0) + 22, 'text-anchor': 'end',
  }, svg);
  labC.textContent = 'c (µmol/L)';
  const labA = el('text', {
    class: 'etiquette-math etiquette-math--muted', 'font-size': 15,
    x: vue.xPx(0) + 10, y: 18,
  }, svg);
  labA.textContent = 'A';

  /* la droite d'étalonnage : pleine sur la gamme, pointillée au-delà
     (hors gamme, la loi n'est plus garantie) */
  const cGamme = aMax / k;
  el('path', {
    class: 'g-courbe',
    d: `M${vue.xPx(0).toFixed(1)} ${vue.yPx(0).toFixed(1)}L${vue.xPx(cGamme).toFixed(1)} ${vue.yPx(aMax).toFixed(1)}`,
  }, svg);
  el('path', {
    class: 'g-guide', 'stroke-dasharray': '3 4',
    d: `M${vue.xPx(cGamme).toFixed(1)} ${vue.yPx(aMax).toFixed(1)}L${vue.xPx(11.2).toFixed(1)} ${vue.yPx(11.2 * k).toFixed(1)}`,
  }, svg);
  /* les cinq étalons (craie) */
  for (const c of etalons) {
    el('circle', { class: 'pt-craie', r: 4.5, cx: vue.xPx(c).toFixed(1), cy: vue.yPx(c * k).toFixed(1) }, svg);
  }
  /* la cuve, en haut à droite : sa couleur est ce que l'appareil regarde */
  const cuveX = vue.largeur - 92;
  el('path', { class: 'dil-verre', d: `M${cuveX} 18L${cuveX} 66L${cuveX + 30} 66L${cuveX + 30} 18` }, svg);
  const cuveLiquide = el('rect', { class: 'dil-liquide', x: cuveX + 3, y: 26, width: 24, height: 37 }, svg);
  const cuveLab = el('text', { class: 'avc-candidat', x: cuveX + 15, y: 84, 'text-anchor': 'middle' }, svg);
  cuveLab.textContent = 'la cuve';

  /* --- éléments dynamiques : guides accent, point de lecture, valeurs ------ */
  const guideH = el('path', { class: 'g-guide-accent', 'stroke-dasharray': '4 5' }, svg);
  const guideV = el('path', { class: 'g-guide-accent', 'stroke-dasharray': '4 5' }, svg);
  const halo = el('circle', { class: 'pt-halo', r: 12 }, svg);
  const point = el('circle', { class: 'pt-point', r: 5.5 }, svg);
  const labLectureA = el('text', { class: 'etl-valeur', 'text-anchor': 'start' }, svg);
  const labLectureC = el('text', { class: 'etl-valeur', 'text-anchor': 'middle' }, svg);

  /* --- lectures ------------------------------------------------------------ */
  const curseur = fig.querySelector('.js-curseur');
  const lectA = fig.querySelector('.js-a');
  const chipA = fig.querySelector('.js-chip-a');
  const chipC = fig.querySelector('.js-chip-c');
  const ligne = fig.querySelector('.js-ligne');
  const legende = fig.querySelector('.js-legende');
  const btnMesure = fig.querySelector('.js-mesure');

  function rendre() {
    const c = A / k;                     /* au repos : A multiple de 0,03 → c multiple de 0,4 */
    const cAffiche = fmtCourt(c, 2);

    guideH.setAttribute('d', `M${vue.xPx(0).toFixed(1)} ${vue.yPx(A).toFixed(1)}L${vue.xPx(c).toFixed(1)} ${vue.yPx(A).toFixed(1)}`);
    guideV.setAttribute('d', `M${vue.xPx(c).toFixed(1)} ${vue.yPx(A).toFixed(1)}L${vue.xPx(c).toFixed(1)} ${vue.yPx(0).toFixed(1)}`);
    halo.setAttribute('cx', vue.xPx(c).toFixed(1));
    halo.setAttribute('cy', vue.yPx(A).toFixed(1));
    point.setAttribute('cx', vue.xPx(c).toFixed(1));
    point.setAttribute('cy', vue.yPx(A).toFixed(1));

    labLectureA.setAttribute('x', (vue.xPx(0) + 6).toFixed(1));
    labLectureA.setAttribute('y', (vue.yPx(A) - 7).toFixed(1));
    labLectureA.textContent = A > 1e-9 ? fmt(A) : '';
    const xC = vue.xPx(c);
    labLectureC.setAttribute('x', Math.max(xC, vue.xPx(0.35)).toFixed(1));
    labLectureC.setAttribute('y', (vue.yPx(0) + 22).toFixed(1));
    labLectureC.textContent = A > 1e-9 ? cAffiche : '';

    cuveLiquide.setAttribute('fill-opacity', (0.08 + 0.72 * (c / 10.8)).toFixed(3));

    lectA.textContent = fmt(A);
    chipA.textContent = `A = ${fmt(A)}`;
    chipC.textContent = `c = ${cAffiche} µmol/L`;
    ligne.textContent = `c = A / k = ${fmt(A)} / ${fmt(k, 3)} = ${cAffiche} µmol/L`;

    const surEtalon = etalons.some((e) => Math.abs(c - e) < 1e-9);
    if (Math.abs(A - aMesure) < 1e-9) {
      legende.textContent = `C'est la mesure du sirop : A = ${fmt(aMesure)}, donc ${cAffiche} µmol de colorant par litre. Le dosage est fait — sans compter une seule molécule à la main.`;
      legende.hidden = false;
    } else if (surEtalon && A > 1e-9) {
      legende.textContent = `Tu es pile sur un point de la gamme : la droite retrouve l'étalon à ${cAffiche} µmol/L. C'est le signe qu'elle modélise bien la loi.`;
      legende.hidden = false;
    } else {
      legende.hidden = true;
    }

    btnMesure.setAttribute('aria-pressed', String(Math.abs(A - aMesure) < 1e-9));

    if (parseFloat(curseur.value) !== A) curseur.value = String(A);
    curseur.style.setProperty('--pos', ((A / aMax) * 100) + '%');
    curseur.setAttribute('aria-valuetext',
      `absorbance ${fmt(A)}, concentration ${cAffiche} micromole par litre`);
  }

  function interaction() {
    track('widget_interact', { widget: 'etalonnage', chapitre });
  }

  let renduPlanifie = 0;
  function planifierRendu() {
    if (!renduPlanifie) renduPlanifie = requestAnimationFrame(() => { renduPlanifie = 0; rendre(); });
  }

  curseur.addEventListener('input', () => {
    if (animation) { animation.stop(); animation = null; }
    A = clamp(parseFloat(curseur.value), 0, aMax);
    interaction();
    planifierRendu();
  });

  btnMesure.addEventListener('click', () => {
    if (animation) animation.stop();
    interaction();
    animation = animerValeur({
      de: A, vers: aMesure, duree: 600,
      surFrame: (val) => { A = val; rendre(); },
      surFin: () => { A = aMesure; animation = null; rendre(); },
    });
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    if (animation) { animation.stop(); animation = null; }
    A = aInit;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="etalonnage"]')) initEtalonnage(fig);
