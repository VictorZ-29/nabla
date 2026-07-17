/* Nabla — widgets/energie-freinage.js
   « La distance de freinage » : une voiture freine (force constante) ; le
   curseur règle la vitesse initiale et la trace de freinage se dessine à
   l'échelle. Théorème de l'énergie cinétique : 0 − ½mv² = −f·d, donc
   d = ½mv²/f — avec m = 1 000 kg et f = 5 000 N, d = v²/10 : tout est exact.
   Le geste : doubler la vitesse, voir la distance quadrupler.
   Spec : premiere/physique-chimie/energie-mecanique/README.md. */

import { el, clamp, fmt } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

const fmtJ = (v) => Math.round(v).toString().replace(/\B(?=(\d{3})+$)/g, ' ');

function initFreinage(fig) {
  const m = parseFloat(fig.dataset.masse || '1000');   /* kg */
  const f = parseFloat(fig.dataset.frein || '5000');   /* N */
  const svg = fig.querySelector('svg.widget-graph');

  /* --- décor fixe (pixels) : la route, le point de freinage ----------------- */
  const ROUTE = 190;
  const X0 = 70;                        /* début du freinage */
  const PPM = 5.4;                      /* 90 m → 486 px */
  el('path', { class: 'g-axis', d: `M0 ${ROUTE}L640 ${ROUTE}` }, svg);
  el('path', { class: 'g-guide', d: `M${X0} 118L${X0} ${ROUTE + 16}` }, svg);
  const tFrein = el('text', { class: 'avc-candidat', x: X0, y: 110, 'text-anchor': 'middle' }, svg);
  tFrein.textContent = 'il freine ici';
  /* fantôme de la voiture au moment du freinage */
  el('rect', {
    class: 'g-guide', 'stroke-dasharray': '4 4', rx: 4,
    x: X0 - 62, y: ROUTE - 40, width: 62, height: 24,
  }, svg);

  /* --- voiture (déplacée en bloc), trace et mesure --------------------------- */
  const trace = el('path', { class: 'g-tangente' }, svg);
  const voiture = el('g', {}, svg);
  el('rect', { class: 'mvt-caisse', x: -62, y: -40, width: 62, height: 24, rx: 4 }, voiture);
  el('rect', { class: 'mvt-caisse', x: -46, y: -54, width: 30, height: 14, rx: 3 }, voiture);
  el('circle', { class: 'pt-craie', cx: -46, cy: -12, r: 7 }, voiture);
  el('circle', { class: 'pt-craie', cx: -14, cy: -12, r: 7 }, voiture);
  const mesure = el('path', { class: 'ond-mesure' }, svg);
  const valD = el('text', { class: 'etl-valeur', y: ROUTE + 46, 'text-anchor': 'middle' }, svg);

  /* --- lectures -------------------------------------------------------------- */
  const curseur = fig.querySelector('.js-curseur');
  const lectV = fig.querySelector('.js-v');
  const ligne = fig.querySelector('.js-ligne');
  const etat = fig.querySelector('.js-etat');
  const legendes = {
    debut: fig.querySelector('.js-leg-debut'),
    cours: fig.querySelector('.js-leg-cours'),
    fin: fig.querySelector('.js-leg-fin'),
  };

  let v = 10;                           /* m/s ; pas de 5 */
  let touche = false;
  const visites = new Set();

  function poserEtat(texte, classe) {
    etat.textContent = texte;
    etat.className = `chip${classe ? ` ${classe}` : ''} js-etat`;
  }

  function rendre() {
    const Ec = 0.5 * m * v * v;
    const d = Ec / f;                   /* = v²/10 : exact à chaque pas */
    const xFin = X0 + d * PPM;

    voiture.setAttribute('transform', `translate(${xFin.toFixed(1)} ${ROUTE})`);
    trace.setAttribute('d', `M${X0} ${ROUTE - 3}L${xFin.toFixed(1)} ${ROUTE - 3}`);
    mesure.setAttribute('d',
      `M${X0} ${ROUTE + 30}L${xFin.toFixed(1)} ${ROUTE + 30}` +
      `M${X0} ${ROUTE + 24}L${X0} ${ROUTE + 36}` +
      `M${xFin.toFixed(1)} ${ROUTE + 24}L${xFin.toFixed(1)} ${ROUTE + 36}`);
    valD.textContent = `d = ${fmt(d, d === Math.trunc(d) ? 0 : 1)} m`;
    valD.setAttribute('x', ((X0 + xFin) / 2).toFixed(1));

    const kmh = v * 3.6;
    ligne.textContent =
      `Ec = ½ × ${fmtJ(m)} × ${fmt(v, 0)}² = ${fmtJ(Ec)} J — ` +
      `d = Ec/f = ${fmtJ(Ec)}/${fmtJ(f)} = ${fmt(d, d === Math.trunc(d) ? 0 : 1)} m`;

    if (v === 10) poserEtat('36 km/h → 10 m pour s’arrêter', '');
    else if (v === 20) poserEtat('2 × plus vite qu’à 36 km/h → 4 × plus loin', 'chip--accent');
    else if (v === 30) poserEtat('3 × plus vite qu’à 36 km/h → 9 × plus loin', 'chip--accent');
    else poserEtat(`${fmt(kmh, 0)} km/h → ${fmt(d, 1)} m pour s’arrêter`, '');

    legendes.debut.hidden = touche;
    legendes.fin.hidden = !(touche && visites.size >= 3);
    legendes.cours.hidden = !(touche && visites.size < 3);

    lectV.textContent = `${fmt(kmh, 0)} km/h (${fmt(v, 0)} m/s)`;
    if (parseFloat(curseur.value) !== v) curseur.value = String(v);
    curseur.style.setProperty('--pos', (((v - 10) / 20) * 100) + '%');
    curseur.setAttribute('aria-valuetext',
      `vitesse ${fmt(kmh, 0)} kilomètres par heure — distance de freinage ${fmt(d, 1)} mètres`);
  }

  curseur.addEventListener('input', () => {
    v = clamp(Math.round(parseFloat(curseur.value) / 5) * 5, 10, 30);
    touche = true;
    visites.add(v);
    track('widget_interact', { widget: fig.dataset.nom || 'freinage', chapitre });
    rendre();
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    v = 10;
    touche = false;
    visites.clear();
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="energie-freinage"]')) initFreinage(fig);
