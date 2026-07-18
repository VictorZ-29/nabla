/* Nabla — widgets/energie-travail.js
   « La caisse tirée » : une force constante (norme fixée) tire une caisse
   de A à B ; le curseur fait tourner la force. Le travail W = F·AB·cos θ
   se lit sur la jauge signée : moteur, nul à 90°, résistant au-delà.
   Préréglages exacts : 0°, 60°, 90°, 120°, 180° (cos = 1 ; 0,5 ; 0 ; −0,5 ; −1).
   Spec : premiere/physique-chimie/energie-mecanique/README.md. */

import { el, clamp, fmt, animerValeur, creerVecteur, etiquetteVecteur } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

const exactA = (v, dec) => Math.abs(Math.round(v * 10 ** dec) / 10 ** dec - v) < 1e-9;

function initTravail(fig) {
  const F = parseFloat(fig.dataset.force || '40');       /* N */
  const AB = parseFloat(fig.dataset.deplacement || '5'); /* m */
  const svg = fig.querySelector('svg.widget-graph');

  /* --- décor fixe (pixels) : sol, caisse, déplacement A → B ---------------- */
  const SOL = 230;
  const A = 120, B = 520;               /* 400 px pour 5,0 m : 80 px/m */
  el('path', { class: 'g-axis', d: `M0 ${SOL}L640 ${SOL}` }, svg);
  el('rect', { class: 'mvt-caisse', x: 92, y: SOL - 36, width: 56, height: 36, rx: 3 }, svg);
  /* flèche du déplacement, sous le sol, avec ses repères A et B */
  el('path', { class: 'g-guide', d: `M${A} ${SOL + 8}L${A} ${SOL + 30}M${B} ${SOL + 8}L${B} ${SOL + 30}` }, svg);
  const dep = creerVecteur(svg, { classeTrait: 'g-courbe', classePointe: 'vec-pointe' });
  dep.maj(A, SOL + 22, B, SOL + 22);
  for (const [x, nom] of [[A, 'A'], [B, 'B']]) {
    const t = el('text', { class: 'avc-nom', x, y: SOL + 52, 'text-anchor': 'middle' }, svg);
    t.textContent = nom;
  }
  const tAB = el('text', { class: 'avc-candidat', x: (A + B) / 2, y: SOL + 52, 'text-anchor': 'middle' }, svg);
  tAB.textContent = 'AB = 5,0 m — la caisse va de A vers B';

  /* --- force accent qui tourne, arc d'angle, valeur ------------------------ */
  const O = { x: 148, y: SOL - 18 };    /* point d'accroche, flanc droit de la caisse */
  const LF = 128;                       /* longueur de la flèche F (norme fixe) */
  const arc = el('path', { class: 'arc-angle' }, svg);
  const force = creerVecteur(svg, { classeTrait: 'g-tangente', classePointe: 'vec-pointe--accent' });
  const labF = etiquetteVecteur(svg, 'F', 'accent');
  const labTheta = el('text', { class: 'etl-valeur', 'text-anchor': 'middle' }, svg);

  /* --- jauge de travail signée : 1 px par joule ----------------------------- */
  const JY = 306, J0 = 320;             /* zéro au centre, −200 → +200 J */
  const tJ = el('text', { class: 'avc-nom', x: 8, y: JY + 11, 'text-anchor': 'start' }, svg);
  tJ.textContent = 'W';
  el('rect', { class: 'jauge-fond', x: J0 - 200, y: JY, width: 400, height: 12, rx: 3 }, svg);
  const plein = el('rect', { class: 'jauge-plein', y: JY, height: 12 }, svg);
  el('path', { class: 'jauge-repere', d: `M${J0} ${JY - 4}L${J0} ${JY + 16}` }, svg);
  for (const [w, nom] of [[-200, '−200'], [-100, '−100'], [0, '0'], [100, '+100'], [200, '+200 J']]) {
    const t = el('text', { class: 'avc-candidat', x: J0 + w, y: JY + 34, 'text-anchor': 'middle' }, svg);
    t.textContent = nom;
  }
  const valW = el('text', { class: 'etl-valeur', x: J0 + 208, y: JY + 11, 'text-anchor': 'start' }, svg);

  /* --- lectures ------------------------------------------------------------ */
  const curseur = fig.querySelector('.js-curseur');
  const lectAngle = fig.querySelector('.js-angle');
  const ligne = fig.querySelector('.js-ligne');
  const etat = fig.querySelector('.js-etat');
  const presets = [...fig.querySelectorAll('.segmente button')];
  const legendes = {
    debut: fig.querySelector('.js-leg-debut'),
    cours: fig.querySelector('.js-leg-cours'),
    droit: fig.querySelector('.js-leg-droit'),
    fin: fig.querySelector('.js-leg-fin'),
  };

  let theta = 60;
  let touche = false;
  let vuMoteur = false, vuResistant = false;
  let animation = null;

  function poserEtat(texte, classe) {
    etat.textContent = texte;
    etat.className = `chip${classe ? ` ${classe}` : ''} js-etat`;
  }

  function rendre() {
    const rad = theta * Math.PI / 180;
    /* cos(90°) vaut 6e-17 en flottant : on le rabat sur zéro exact */
    const brut = Math.cos(rad);
    const c = Math.abs(brut) < 1e-12 ? 0 : brut;
    const W = F * AB * c;
    const tx = O.x + LF * Math.cos(rad);
    const ty = O.y - LF * Math.sin(rad);
    force.maj(O.x, O.y, tx, ty);
    labF.maj(O.x + (LF + 26) * Math.cos(rad), O.y - (LF + 26) * Math.sin(rad) + 6);
    /* arc de l'horizontale (sens de AB) vers la force */
    const R = 34;
    if (theta < 3) arc.setAttribute('d', '');
    else {
      arc.setAttribute('d',
        `M${O.x + R} ${O.y}A${R} ${R} 0 0 0 ${(O.x + R * Math.cos(rad)).toFixed(1)} ${(O.y - R * Math.sin(rad)).toFixed(1)}`);
    }
    const demi = rad / 2;
    labTheta.textContent = `${theta}°`;
    labTheta.setAttribute('x', (O.x + 56 * Math.cos(demi)).toFixed(1));
    labTheta.setAttribute('y', (O.y - 56 * Math.sin(demi) + 4).toFixed(1));
    if (theta < 14) { labTheta.setAttribute('y', O.y - 10); }

    /* jauge signée (1 px/J) et valeur */
    plein.setAttribute('x', Math.min(J0, J0 + W).toFixed(1));
    plein.setAttribute('width', Math.abs(W).toFixed(1));
    const eW = exactA(W, 0);
    const sW = W > 0.5 ? '+' : '';
    valW.textContent = `${eW ? '' : '≈ '}${sW}${fmt(W, 0)} J`;

    /* ligne instanciée : cos exact aux préréglages, ≈ sinon (négatif parenthésé) */
    const eC = exactA(c, 2) && exactA(W, 0);
    const dec = eC ? (Number.isInteger(c) ? 0 : 1) : 2;
    const cTxt = c < 0 ? `(${fmt(c, dec)})` : fmt(c, dec);
    ligne.textContent =
      `W = F × AB × cos θ = ${fmt(F, 0)} × ${fmt(AB, 1)} × ${cTxt} ${eC ? '=' : '≈'} ${sW}${fmt(W, 0)} J`;

    if (Math.abs(W) < 0.5) poserEtat('θ = 90° : travail nul — la force ne compte pas', 'chip--accent');
    else if (W > 0) poserEtat('travail moteur — la force aide le mouvement', 'chip--good');
    else poserEtat('travail résistant — la force s’oppose au mouvement', 'chip--bad');

    if (W > 0.5) vuMoteur = touche || vuMoteur;
    if (W < -0.5) vuResistant = touche || vuResistant;
    legendes.debut.hidden = touche;
    legendes.droit.hidden = !(touche && Math.abs(W) < 0.5);
    legendes.fin.hidden = !(touche && vuMoteur && vuResistant && Math.abs(W) >= 0.5);
    legendes.cours.hidden = !(touche && Math.abs(W) >= 0.5 && !(vuMoteur && vuResistant));

    lectAngle.textContent = `${theta}°`;
    if (parseFloat(curseur.value) !== theta) curseur.value = String(theta);
    curseur.style.setProperty('--pos', ((theta / 180) * 100) + '%');
    curseur.setAttribute('aria-valuetext', `angle ${theta} degrés — travail ${fmt(W, 0)} joules`);
    for (const b of presets) b.setAttribute('aria-pressed', String(parseFloat(b.dataset.angle) === theta));
  }

  function interaction() {
    touche = true;
    track('widget_interact', { widget: fig.dataset.nom || 'travail', chapitre });
  }

  curseur.addEventListener('input', () => {
    if (animation) { animation.stop(); animation = null; }
    theta = clamp(Math.round(parseFloat(curseur.value)), 0, 180);
    interaction();
    rendre();
  });

  for (const b of presets) {
    b.addEventListener('click', () => {
      if (animation) animation.stop();
      interaction();
      animation = animerValeur({
        de: theta, vers: parseFloat(b.dataset.angle),
        surFrame: (val) => { theta = Math.round(val); rendre(); },
        surFin: () => { animation = null; },
      });
    });
  }

  fig.querySelector('.js-reset').addEventListener('click', () => {
    if (animation) { animation.stop(); animation = null; }
    theta = 60;
    touche = false;
    vuMoteur = false;
    vuResistant = false;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="energie-travail"]')) initTravail(fig);
