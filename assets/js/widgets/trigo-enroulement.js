/* Nabla — widgets/trigo-enroulement.js
   « Enrouler la droite sur le cercle » : un curseur déplace le réel t sur la
   droite graduée (en bas) ; le morceau [0 ; t] s'enroule sur le cercle
   trigonométrique depuis I, dans le sens direct pour t > 0. Lecture triple :
   écriture exacte en π, valeur en radians, équivalent en degrés. Le pas du
   curseur vaut π/12, donc les degrés tombent toujours juste (15° par cran).
   Spec de l'instance : premiere/maths/trigonometrie/README.md. */

import { el, creerVue, clamp, fmt, animerValeur } from '../nabla-graph.js';
import {
  DOUZIEME, FENETRE, decorCercle, fmtPi, cheminArc, pointeTangente,
} from './trigo-cercle.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

function initEnroulement(fig) {
  const kInit = parseFloat(fig.dataset.kInit);
  let k = kInit;                       // t = k · π/12, k ∈ [−24 ; 24]
  let animation = null;

  /* --- cercle ------------------------------------------------------------- */
  const svgC = fig.querySelector('.js-cercle');
  const vue = creerVue(svgC, FENETRE);
  decorCercle(svgC, vue);

  /* flèche du sens direct, petit arc « + » près du centre */
  el('path', {
    class: 'g-guide', 'stroke-dasharray': '4 4',
    d: cheminArc(vue, 0.3, 0.15, 1.15),
  }, svgC);
  el('path', { class: 'vec-pointe', d: pointeTangente(vue, 0.3, 1.15, 1, 9, 3.5) }, svgC);
  const labSens = el('text', {
    class: 'etiquette-math etiquette-math--muted', 'font-size': 15,
    x: vue.xPx(0.46 * Math.cos(0.6)), y: vue.yPx(0.46 * Math.sin(0.6)) + 5,
  }, svgC);
  labSens.textContent = '+';

  const arc = el('path', { class: 'g-tangente' }, svgC);
  const pointe = el('path', { class: 'vec-pointe--accent' }, svgC);
  const ptM = el('circle', { class: 'pt-point', r: 5.5 }, svgC);
  const labM = el('text', { class: 'etiquette-math', 'font-size': 17 }, svgC);
  labM.textContent = 'M';

  /* --- droite graduée (ruban) ---------------------------------------------- */
  const svgR = fig.querySelector('.js-ruban');
  const vueR = creerVue(svgR, { xMin: -7.06, xMax: 7.06, yMin: -1.2, yMax: 1.2 });
  const yAxe = vueR.yPx(0);
  el('path', { class: 'g-axis', d: `M0 ${yAxe}L${vueR.largeur} ${yAxe}` }, svgR);
  for (let j = -4; j <= 4; j++) {
    const x = Math.round(vueR.xPx(j * Math.PI / 2) * 10) / 10;
    const grand = j % 2 === 0;
    el('path', { class: 'g-axis', d: `M${x} ${yAxe - (grand ? 7 : 4)}L${x} ${yAxe + (grand ? 7 : 4)}` }, svgR);
    if (grand) {
      const lab = el('text', {
        class: 'etiquette-math etiquette-math--muted', 'font-size': 14,
        x, y: yAxe + 28, 'text-anchor': 'middle',
      }, svgR);
      lab.textContent = fmtPi(j * 6);
    }
  }
  const segment = el('path', { class: 'g-tangente' }, svgR);
  const ptT = el('circle', { class: 'pt-point', r: 5 }, svgR);

  /* --- lectures et contrôles ----------------------------------------------- */
  const ligne = fig.querySelector('.js-ligne');
  const elDeg = fig.querySelector('.js-deg');
  const elArc = fig.querySelector('.js-arc');
  const elEtat = fig.querySelector('.js-etat');
  const legende = fig.querySelector('.js-legende');
  const curseur = fig.querySelector('.js-curseur');
  const presets = [...fig.querySelectorAll('.segmente button')];

  function rendre() {
    const t = k * DOUZIEME;
    const entier = Math.abs(k - Math.round(k)) < 1e-9;
    const kR = Math.round(k);
    const exact = entier ? fmtPi(kR) : fmt(t);
    const deg = entier ? String(15 * kR).replace('-', '−') : fmt(15 * k, 0);

    /* cercle : arc de I à M(t), pointe tangente, point M poussé vers l'extérieur */
    arc.setAttribute('d', cheminArc(vue, 1, 0, t));
    pointe.style.display = Math.abs(t) < 0.12 ? 'none' : '';
    if (Math.abs(t) >= 0.12) {
      pointe.setAttribute('d', pointeTangente(vue, 1, t, Math.sign(t)));
    }
    const mx = vue.xPx(Math.cos(t));
    const my = vue.yPx(Math.sin(t));
    ptM.setAttribute('cx', mx);
    ptM.setAttribute('cy', my);
    labM.setAttribute('x', vue.xPx(1.16 * Math.cos(t)) - 6);
    labM.setAttribute('y', vue.yPx(1.16 * Math.sin(t)) + 6);
    labM.style.display = Math.abs(t) < 0.25 ? 'none' : '';

    /* ruban : segment [0 ; t] et curseur du réel t */
    const x0 = vueR.xPx(0);
    const xt = vueR.xPx(t);
    segment.setAttribute('d', `M${x0} ${yAxe}L${xt} ${yAxe}`);
    ptT.setAttribute('cx', xt);
    ptT.setAttribute('cy', yAxe);

    /* lectures */
    ligne.textContent = k === 0
      ? 't = 0 rad = 0°'
      : `t = ${exact}${entier ? ` ≈ ${fmt(t)}` : ''} rad = ${deg}°`;
    elDeg.textContent = `${deg}°`;
    elArc.textContent = fmt(Math.abs(t));

    if (entier && Math.abs(kR) === 24) {
      elEtat.textContent = 'un tour complet — retour en I';
      elEtat.className = 'chip chip--accent js-etat';
    } else if (t > 1e-9) {
      elEtat.textContent = 't > 0 — sens direct';
      elEtat.className = 'chip chip--good js-etat';
    } else if (t < -1e-9) {
      elEtat.textContent = 't < 0 — sens des aiguilles';
      elEtat.className = 'chip chip--bad js-etat';
    } else {
      elEtat.textContent = 't = 0 — M est en I';
      elEtat.className = 'chip chip--accent js-etat';
    }

    if (!entier) {
      legende.textContent = 'Relâche le curseur sur une graduation pour lire une valeur exacte.';
    } else if (kR === 0) {
      legende.textContent = "Rien n'est enroulé : M est au point de départ I. Pousse t vers la droite pour tourner dans le sens direct.";
    } else if (kR === 6) {
      legende.textContent = "Un quart de tour : 90° = π/2 rad ≈ 1,57. L'arc parcouru mesure le quart du périmètre 2π.";
    } else if (kR === 12) {
      legende.textContent = "Un demi-tour : 180° = π rad. C'est LA correspondance à retenir — tout le reste s'en déduit par proportionnalité.";
    } else if (Math.abs(kR) === 24) {
      legende.textContent = "Un tour complet : 360° = 2π rad, le périmètre entier. La droite continuerait de s'enrouler : t et t − 2π tombent sur le même point.";
    } else {
      legende.textContent = (kR > 0
        ? `Le morceau [0 ; t] de la droite, enroulé sur le cercle depuis I, couvre un arc de longueur ${fmt(Math.abs(t))}`
        : `Le morceau [t ; 0] s'enroule depuis I dans le sens des aiguilles d'une montre : arc de longueur ${fmt(Math.abs(t))}`)
        + " — compter en radians, c'est mesurer cette longueur.";
    }

    if (parseFloat(curseur.value) !== k && entier) curseur.value = String(kR);
    const min = parseFloat(curseur.min);
    const max = parseFloat(curseur.max);
    curseur.style.setProperty('--pos', (((k - min) / (max - min)) * 100) + '%');
    curseur.setAttribute('aria-valuetext', entier ? `t = ${exact}, soit ${deg} degrés` : `t = ${fmt(t)}`);

    for (const btn of presets) {
      btn.setAttribute('aria-pressed', String(entier && parseFloat(btn.dataset.k) === kR));
    }
  }

  function interaction() {
    track('widget_interact', { widget: 'trigo-enroulement', chapitre });
  }

  let renduPlanifie = 0;
  function planifierRendu() {
    if (!renduPlanifie) renduPlanifie = requestAnimationFrame(() => { renduPlanifie = 0; rendre(); });
  }

  curseur.addEventListener('input', () => {
    if (animation) { animation.stop(); animation = null; }
    k = clamp(parseFloat(curseur.value), parseFloat(curseur.min), parseFloat(curseur.max));
    interaction();
    planifierRendu();
  });

  for (const btn of presets) {
    btn.addEventListener('click', () => {
      if (animation) animation.stop();
      interaction();
      animation = animerValeur({
        de: k, vers: parseFloat(btn.dataset.k), duree: 650,
        surFrame(v) { k = v; rendre(); },
        surFin() { animation = null; },
      });
    });
  }

  fig.querySelector('.js-reset').addEventListener('click', () => {
    if (animation) { animation.stop(); animation = null; }
    k = kInit;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="trigo-enroulement"]')) initEnroulement(fig);
