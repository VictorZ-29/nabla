/* Nabla — widgets/onde-relation.js
   « Une période, une longueur d'onde » : deux curseurs — la célérité v
   (fixée par le milieu) et la période T (choisie par la source) — et une
   crête marquée sur la ligne de départ. Le bouton accent fait avancer la
   crête pendant EXACTEMENT une période : elle parcourt v × T, et ce
   trajet est précisément la longueur d'onde λ, mesurée par le second
   crochet entre deux crêtes. Bouger un curseur remet la crête au départ ;
   λ = v × T est toujours exact (pas de 0,5 × pas de 0,5).
   Spec : premiere/physique-chimie/ondes-mecaniques/README.md. */

import { el, creerVue, clamp, fmt, animerValeur } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

/* 1 décimale quand la valeur tombe juste au dixième (« 4,0 »), 2 sinon */
const fmtPhys = (x) => fmt(x, Math.abs(x * 10 - Math.round(x * 10)) < 1e-9 ? 1 : 2);

function initOndeRelation(fig) {
  const d = fig.dataset;
  const vInit = parseFloat(d.vInit);
  const pInit = parseFloat(d.periodeInit);
  const A = parseFloat(d.amplitude || '0.3');
  const DEPART = 0.5;                       /* la ligne de départ de la crête (m) */
  const XMAX = 13;
  let v = vInit;
  let P = pInit;
  let tau = 0;                              /* temps écoulé depuis le départ, 0 → T */
  let animation = null;

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, { xMin: -0.6, xMax: 13.6, yMin: -0.5, yMax: 0.98 });

  /* --- décor statique ------------------------------------------------------ */
  let dGrille = '';
  for (let gx = 1; gx <= XMAX + 0.01; gx += 1) {
    dGrille += `M${vue.xPx(gx).toFixed(1)} 0L${vue.xPx(gx).toFixed(1)} ${vue.hauteur}`;
  }
  el('path', { class: 'g-grid', d: dGrille }, svg);
  el('path', { class: 'g-axis', d: `M0 ${vue.yPx(0).toFixed(1)}L${vue.largeur} ${vue.yPx(0).toFixed(1)}` }, svg);
  for (const [gx, texte] of [[0, '0'], [5, '5'], [10, '10 m']]) {
    const lab = el('text', {
      class: 'avc-candidat', x: vue.xPx(gx).toFixed(1), y: (vue.yPx(0) + 18).toFixed(1),
      'text-anchor': 'middle',
    }, svg);
    lab.textContent = texte;
  }
  /* la ligne de départ de la crête marquée */
  el('path', {
    class: 'g-guide', 'stroke-dasharray': '3 4',
    d: `M${vue.xPx(DEPART).toFixed(1)} ${vue.yPx(A + 0.12).toFixed(1)}L${vue.xPx(DEPART).toFixed(1)} ${vue.yPx(-0.3).toFixed(1)}`,
  }, svg);
  const departLab = el('text', {
    class: 'avc-candidat', x: vue.xPx(DEPART).toFixed(1), y: (vue.yPx(-0.3) + 14).toFixed(1),
    'text-anchor': 'middle',
  }, svg);
  departLab.textContent = 'départ';

  /* --- éléments dynamiques ------------------------------------------------- */
  const courbe = el('path', { class: 'g-courbe' }, svg);
  const ptDepart = el('circle', { class: 'pt-craie', r: 4.5 }, svg);
  const mesureAvance = el('path', { class: 'ond-mesure' }, svg);
  const mesureAvanceTxt = el('text', { class: 'etl-valeur', 'text-anchor': 'middle' }, svg);
  const mesureLambda = el('path', { class: 'ond-mesure' }, svg);
  const mesureLambdaTxt = el('text', { class: 'etl-valeur', 'text-anchor': 'middle' }, svg);
  const halo = el('circle', { class: 'pt-halo', r: 12 }, svg);
  const point = el('circle', { class: 'pt-point', r: 5.5 }, svg);

  function crochet(x1, x2, yM) {
    const a = vue.xPx(x1).toFixed(1);
    const b = vue.xPx(x2).toFixed(1);
    const py = vue.yPx(yM).toFixed(1);
    const h = 5;
    return `M${a} ${(+py - h).toFixed(1)}L${a} ${(+py + h).toFixed(1)}M${a} ${py}L${b} ${py}M${b} ${(+py - h).toFixed(1)}L${b} ${(+py + h).toFixed(1)}`;
  }

  /* --- lectures ------------------------------------------------------------ */
  const curseurV = fig.querySelector('.js-curseur-v');
  const curseurT = fig.querySelector('.js-curseur-t');
  const lectV = fig.querySelector('.js-v');
  const lectP = fig.querySelector('.js-periode');
  const ligne = fig.querySelector('.js-ligne');
  const chipLambda = fig.querySelector('.js-lambda');
  const legende = fig.querySelector('.js-legende');
  const btnAvancer = fig.querySelector('.js-avancer');

  function rendre() {
    const lam = v * P;                       /* exact : pas de 0,5 × pas de 0,5 */
    const xC = DEPART + v * tau;             /* la crête marquée */
    const arrivee = Math.abs(tau - P) < 1e-9;

    /* la corde : une crête est calée sur la crête marquée */
    const pts = [];
    for (let i = 0; i <= 480; i++) {
      const x = (XMAX * i) / 480;
      pts.push(`${vue.xPx(x).toFixed(1)} ${vue.yPx(A * Math.cos(2 * Math.PI * (x - xC) / lam)).toFixed(1)}`);
    }
    courbe.setAttribute('d', 'M' + pts.join('L'));

    halo.setAttribute('cx', vue.xPx(xC).toFixed(1)); halo.setAttribute('cy', vue.yPx(A).toFixed(1));
    point.setAttribute('cx', vue.xPx(xC).toFixed(1)); point.setAttribute('cy', vue.yPx(A).toFixed(1));

    /* le point de départ (craie) n'apparaît que quand la crête l'a quitté */
    const partie = tau > 1e-9;
    ptDepart.style.display = partie ? '' : 'none';
    ptDepart.setAttribute('cx', vue.xPx(DEPART).toFixed(1));
    ptDepart.setAttribute('cy', vue.yPx(A).toFixed(1));

    /* crochet d'avance : du départ à la crête (dès que c'est lisible) */
    const avance = v * tau;
    if (avance > 0.28) {
      mesureAvance.setAttribute('d', crochet(DEPART, xC, A + 0.2));
      mesureAvanceTxt.textContent = arrivee
        ? `v × T = ${fmtPhys(lam)} m = λ`
        : `d = ${fmt(avance)} m`;
      mesureAvanceTxt.setAttribute('x', vue.xPx(DEPART + avance / 2).toFixed(1));
      mesureAvanceTxt.setAttribute('y', (vue.yPx(A + 0.2) - 8).toFixed(1));
      mesureAvance.style.display = '';
      mesureAvanceTxt.style.display = '';
    } else {
      mesureAvance.style.display = 'none';
      mesureAvanceTxt.style.display = 'none';
    }

    /* crochet λ : de la crête marquée à la suivante (ou la précédente) */
    const versDroite = xC + lam <= XMAX + 0.4;
    const l1 = versDroite ? xC : xC - lam;
    mesureLambda.setAttribute('d', crochet(l1, l1 + lam, A + 0.42));
    mesureLambdaTxt.textContent = `λ = ${fmtPhys(lam)} m`;
    mesureLambdaTxt.setAttribute('x', vue.xPx(l1 + lam / 2).toFixed(1));
    mesureLambdaTxt.setAttribute('y', (vue.yPx(A + 0.42) - 8).toFixed(1));

    /* lectures françaises */
    lectV.textContent = fmtPhys(v);
    lectP.textContent = fmtPhys(P);
    chipLambda.textContent = `λ = ${fmtPhys(lam)} m`;
    ligne.textContent = `λ = v × T = ${fmtPhys(v)} × ${fmtPhys(P)} = ${fmtPhys(lam)} m`;

    /* légende (texte pur, composé en JS — aria-live sur le conteneur) */
    if (arrivee) {
      legende.textContent = `Pendant une période exactement (T = ${fmtPhys(P)} s), la crête a avancé de v × T = ${fmtPhys(lam)} m : c'est la longueur d'onde. Et regarde la corde : elle est revenue exactement dans sa position de départ.`;
    } else if (partie) {
      legende.textContent = `La crête court à ${fmtPhys(v)} m/s…`;
    } else {
      legende.textContent = `Une crête est marquée sur la ligne de départ. Pendant une période, elle doit avancer d'exactement v × T. Lance-la et mesure.`;
    }

    if (parseFloat(curseurV.value) !== v) curseurV.value = String(v);
    if (parseFloat(curseurT.value) !== P) curseurT.value = String(P);
    curseurV.style.setProperty('--pos', (((v - parseFloat(curseurV.min)) / (parseFloat(curseurV.max) - parseFloat(curseurV.min))) * 100) + '%');
    curseurT.style.setProperty('--pos', (((P - parseFloat(curseurT.min)) / (parseFloat(curseurT.max) - parseFloat(curseurT.min))) * 100) + '%');
    curseurV.setAttribute('aria-valuetext', `célérité ${fmtPhys(v)} mètre par seconde — longueur d'onde ${fmtPhys(lam)} mètre`);
    curseurT.setAttribute('aria-valuetext', `période ${fmtPhys(P)} seconde — longueur d'onde ${fmtPhys(lam)} mètre`);
  }

  function interaction() {
    track('widget_interact', { widget: d.nom || 'relation', chapitre });
  }

  let renduPlanifie = 0;
  function planifierRendu() {
    if (!renduPlanifie) renduPlanifie = requestAnimationFrame(() => { renduPlanifie = 0; rendre(); });
  }

  function surCurseur(curseur, poser) {
    curseur.addEventListener('input', () => {
      if (animation) { animation.stop(); animation = null; }
      poser(clamp(parseFloat(curseur.value), parseFloat(curseur.min), parseFloat(curseur.max)));
      tau = 0;                               /* la crête repart de la ligne de départ */
      interaction();
      planifierRendu();
    });
  }
  surCurseur(curseurV, (val) => { v = val; });
  surCurseur(curseurT, (val) => { P = val; });

  btnAvancer.addEventListener('click', () => {
    if (animation) animation.stop();
    interaction();
    tau = 0;
    rendre();
    animation = animerValeur({
      de: 0, vers: P, duree: 1400,
      surFrame: (val) => { tau = val; rendre(); },
      surFin: () => { tau = P; animation = null; rendre(); },
    });
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    if (animation) { animation.stop(); animation = null; }
    v = vInit;
    P = pInit;
    tau = 0;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="onde-relation"]')) initOndeRelation(fig);
