/* Nabla — widgets/geo-cercle.js
   « Le cercle mis en équation » : l'élève déplace le centre Ω de nœud en
   nœud et règle le rayon au curseur ; l'équation (x − a)² + (y − b)² = r²
   se réécrit en direct, signes compris. Défi de la page : faire passer le
   cercle par le point P fixé — le chip d'état compare ΩP² à r², tout est
   entier par construction.
   Spec de l'instance : premiere/maths/geometrie-reperee/README.md. */

import {
  el, creerVue, grilleUnite, axes, clamp, fmtCourt, rendreDraggable, creerHint,
} from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

const ent = (n) => (n < 0 ? `−${-n}` : `${n}`);
const parenthese = (n) => (n < 0 ? `(−${-n})` : `${n}`);

/* « (x + 1)² » à partir du centre a : le signe s'inverse en passant dans la
   parenthèse — c'est tout l'objet du chip d'état et du piège n°2. */
function carre(lettre, centre) {
  if (centre === 0) return `${lettre}²`;
  return `(${lettre} ${centre > 0 ? '−' : '+'} ${Math.abs(centre)})²`;
}

function initGeoCercle(fig) {
  const d = fig.dataset;
  const oInit = d.omegaInit.split(',').map(Number);
  const rInit = +d.rInit;
  const P = d.p.split(',').map(Number);
  const O = oInit.slice();
  let r = rInit;
  const [oxMin, oxMax] = d.xdom.split(',').map(Number);
  const [oyMin, oyMax] = d.ydom.split(',').map(Number);

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, {
    xMin: +d.xmin, xMax: +d.xmax, yMin: +d.ymin, yMax: +d.ymax,
  });

  /* --- décor statique ------------------------------------------------------ */
  el('path', { class: 'g-grid', d: grilleUnite(vue) }, svg);
  el('path', { class: 'g-axis', d: axes(vue) }, svg);
  el('circle', { class: 'pt-craie', cx: vue.xPx(P[0]), cy: vue.yPx(P[1]), r: 5 }, svg);
  const labP = el('text', {
    class: 'etiquette-math etiquette-math--muted', 'font-size': 15,
    x: vue.xPx(P[0]) + 15, y: vue.yPx(P[1]) - 10, 'text-anchor': 'middle',
  }, svg);
  labP.textContent = 'P';

  /* --- éléments dynamiques -------------------------------------------------- */
  const cercle = el('circle', { class: 'g-courbe-derivee' }, svg);
  const halo = el('circle', { class: 'pt-halo', r: 12 }, svg);
  const pt = el('circle', { class: 'pt-point', r: 5.5 }, svg);
  const labO = el('text', {
    class: 'etiquette-math etiquette-math--accent', 'font-size': 15, 'text-anchor': 'middle',
  }, svg);
  labO.textContent = 'Ω';
  const hit = el('circle', {
    class: 'hit-zone', r: 42,
    tabindex: 0, role: 'slider', 'aria-orientation': 'horizontal',
    'aria-label': 'Le centre Ω du cercle — flèches gauche et droite pour l’abscisse, haut et bas pour l’ordonnée',
    'aria-valuemin': String(oxMin), 'aria-valuemax': String(oxMax),
  }, svg);

  const ox0 = vue.xPx(oInit[0]);
  const oy0 = vue.yPx(oInit[1]);
  const hint = creerHint(svg, {
    x: ox0 + 22.4, y: oy0 - 59.1,
    filDe: [ox0 + 24.4, oy0 - 37.1], filVers: [ox0 + 5.4, oy0 - 6.1],
  });

  /* --- lectures ------------------------------------------------------------ */
  const ligne1 = fig.querySelector('.js-ligne1');
  const ligne2 = fig.querySelector('.js-ligne2');
  const elO = fig.querySelector('.js-omega');
  const elR = fig.querySelector('.js-r-val');
  const elEtat = fig.querySelector('.js-etat');
  const legende = fig.querySelector('.js-legende');
  const curseur = fig.querySelector('.js-r');

  function rendre() {
    const [ca, cb] = O;
    const dx = P[0] - ca;
    const dy = P[1] - cb;
    const op2 = dx * dx + dy * dy;
    const r2 = r * r;

    const cx = vue.xPx(ca);
    const cy = vue.yPx(cb);
    cercle.setAttribute('cx', cx); cercle.setAttribute('cy', cy);
    cercle.setAttribute('r', r * vue.pxParX);
    halo.setAttribute('cx', cx); halo.setAttribute('cy', cy);
    pt.setAttribute('cx', cx); pt.setAttribute('cy', cy);
    hit.setAttribute('cx', cx); hit.setAttribute('cy', cy);
    labO.setAttribute('x', clamp(cx - 15, 12, vue.largeur - 12));
    labO.setAttribute('y', clamp(cy - 12, 18, vue.hauteur - 8));

    ligne1.textContent = `${carre('x', ca)} + ${carre('y', cb)} = ${r2}`;
    ligne2.textContent = `ΩP² = ${parenthese(dx)}² + ${parenthese(dy)}² = ${ent(op2)}`;
    elO.textContent = `(${ent(ca)} ; ${ent(cb)})`;
    elR.textContent = fmtCourt(r, 0);
    curseur.value = String(r);
    curseur.style.setProperty('--pos', `${((r - +curseur.min) / (+curseur.max - +curseur.min)) * 100}%`);
    curseur.setAttribute('aria-valuetext', `rayon ${fmtCourt(r, 0)}`);

    if (op2 === r2) {
      elEtat.textContent = `ΩP² = ${r2} = r² — P est sur le cercle !`;
      elEtat.className = 'chip chip--good js-etat';
      legende.textContent = 'ΩP = r exactement : le cercle passe par P, et les coordonnées de P vérifient l’équation. Défi réussi.';
    } else if (op2 > r2) {
      elEtat.textContent = `ΩP² = ${ent(op2)} > ${r2} — P est dehors`;
      elEtat.className = 'chip js-etat';
      legende.textContent = 'ΩP² > r² : P est trop loin du centre, hors du cercle. Rapproche Ω, ou agrandis le rayon.';
    } else {
      elEtat.textContent = `ΩP² = ${ent(op2)} < ${r2} — P est dedans`;
      elEtat.className = 'chip js-etat';
      legende.textContent = 'ΩP² < r² : P est à l’intérieur, le cercle passe au-delà. Éloigne Ω, ou réduis le rayon.';
    }

    hit.setAttribute('aria-valuenow', String(ca));
    hit.setAttribute('aria-valuetext',
      `Ω = (${ent(ca)} ; ${ent(cb)}), rayon ${fmtCourt(r, 0)}, équation ${ligne1.textContent}`);
  }

  function interaction() {
    hint.style.display = 'none';
    track('widget_interact', { widget: 'geo-cercle', chapitre });
  }

  function poser(x, y) {
    O[0] = clamp(Math.round(x), oxMin, oxMax);
    O[1] = clamp(Math.round(y), oyMin, oyMax);
    rendre();
  }

  rendreDraggable(hit, {
    surDebut() { fig.classList.add('drag-actif'); interaction(); },
    surDeplacement(evt) {
      const rect = svg.getBoundingClientRect();
      const px = ((evt.clientX - rect.left) / rect.width) * vue.largeur;
      const py = ((evt.clientY - rect.top) / rect.height) * vue.hauteur;
      poser(vue.xDe(px), vue.yMax - py / vue.pxParY);
    },
    surFin() { fig.classList.remove('drag-actif'); },
  });

  hit.addEventListener('keydown', (e) => {
    let dx = 0;
    let dy = 0;
    if (e.key === 'ArrowRight') dx = 1;
    else if (e.key === 'ArrowLeft') dx = -1;
    else if (e.key === 'ArrowUp') dy = 1;
    else if (e.key === 'ArrowDown') dy = -1;
    else return;
    e.preventDefault();
    interaction();
    poser(O[0] + dx, O[1] + dy);
  });

  curseur.addEventListener('input', () => {
    r = clamp(Math.round(parseFloat(curseur.value)), +curseur.min, +curseur.max);
    interaction();
    rendre();
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    O[0] = oInit[0];
    O[1] = oInit[1];
    r = rInit;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="geo-cercle"]')) initGeoCercle(fig);
