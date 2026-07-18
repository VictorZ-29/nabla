/* Nabla — widgets/trigo-cercle.js
   Aides partagées des widgets du chapitre trigonométrie (pas un widget) :
   décor du cercle trigonométrique, écriture exacte des multiples de π/12,
   valeurs exactes de cos/sin aux angles remarquables, angle sous le
   pointeur, arcs échantillonnés. Importé par les modules trigo-*.js. */

import { el, grilleUnite, axes } from '../nabla-graph.js';

export const DOUZIEME = Math.PI / 12;

/* Fenêtre commune : unités carrées (160 px/unité en 640×400), rayon 1. */
export const FENETRE = { xMin: -2, xMax: 2, yMin: -1.25, yMax: 1.25 };

const arrondi = (v) => Math.round(v * 10) / 10;

/* Décor commun : grille, axes, cercle unité en craie, point I(1 ; 0). */
export function decorCercle(svg, vue) {
  el('path', { class: 'g-grid', d: grilleUnite(vue) }, svg);
  el('path', { class: 'g-axis', d: axes(vue) }, svg);
  el('circle', {
    class: 'g-courbe', cx: vue.xPx(0), cy: vue.yPx(0), r: vue.pxParX,
  }, svg);
  el('circle', { class: 'pt-fixe', r: 4.5, cx: vue.xPx(1), cy: vue.yPx(0) }, svg);
  const labI = el('text', {
    class: 'etiquette-math', 'font-size': 16,
    x: vue.xPx(1) + 10, y: vue.yPx(0) + 22,
  }, svg);
  labI.textContent = 'I';
}

const pgcd = (a, b) => (b ? pgcd(b, a % b) : a);

/* k douzièmes de π → écriture exacte : « 0 », « π/6 », « −5π/12 », « 2π ». */
export function fmtPi(k) {
  if (k === 0) return '0';
  const g = pgcd(Math.abs(k), 12);
  const p = Math.abs(k) / g;
  const q = 12 / g;
  const tete = p === 1 ? 'π' : `${p}π`;
  return (k < 0 ? '−' : '') + (q === 1 ? tete : `${tete}/${q}`);
}

/* Valeurs exactes aux angles remarquables (k douzièmes de π, |k| ≤ 12).
   Clé absente (π/12, 5π/12…) : l'angle n'est pas au programme des valeurs
   à connaître — les widgets affichent alors les arrondis. */
const COS_EXACT = { 0: '1', 2: '√3/2', 3: '√2/2', 4: '1/2', 6: '0', 8: '−1/2', 9: '−√2/2', 10: '−√3/2', 12: '−1' };
const SIN_EXACT = { 0: '0', 2: '1/2', 3: '√2/2', 4: '√3/2', 6: '1', 8: '√3/2', 9: '√2/2', 10: '1/2', 12: '0' };

export function cosExact(k) {
  return COS_EXACT[Math.abs(k)] ?? null;
}

/* sin(−t) = −sin t ; sur [0 ; π] le sinus exact est toujours ≥ 0. */
export function sinExact(k) {
  const v = SIN_EXACT[Math.abs(k)];
  if (v == null) return null;
  return k < 0 && v !== '0' ? '−' + v : v;
}

/* Angle (radians, dans ]−π ; π]) du point maths sous le pointeur. */
export function angleDePointeur(vue, evt) {
  const rect = vue.svg.getBoundingClientRect();
  const x = vue.xDe(((evt.clientX - rect.left) / rect.width) * vue.largeur);
  const py = ((evt.clientY - rect.top) / rect.height) * vue.hauteur;
  const y = vue.yMax - py / vue.pxParY;
  return Math.atan2(y, x);
}

/* Polyligne le long du cercle de rayon r, de l'angle a0 à l'angle a1. */
export function cheminArc(vue, r, a0, a1, n) {
  const pas = n || Math.max(12, Math.ceil(Math.abs(a1 - a0) * 24));
  const pts = [];
  for (let i = 0; i <= pas; i++) {
    const a = a0 + ((a1 - a0) * i) / pas;
    pts.push(`${arrondi(vue.xPx(r * Math.cos(a)))} ${arrondi(vue.yPx(r * Math.sin(a)))}`);
  }
  return 'M' + pts.join('L');
}

/* Pointe de flèche tangente au cercle de rayon r au point d'angle a ;
   sens = +1 (angles croissants) ou −1. Renvoie le « d » du triangle. */
export function pointeTangente(vue, r, a, sens, long = 12, demiLarg = 4.5) {
  const tx = vue.xPx(r * Math.cos(a));
  const ty = vue.yPx(r * Math.sin(a));
  /* direction tangente en pixels (l'axe y de l'écran est inversé) */
  let dx = -Math.sin(a) * sens;
  let dy = -Math.cos(a) * sens;
  const L = Math.hypot(dx, dy) || 1;
  dx /= L;
  dy /= L;
  const bx = tx - dx * long;
  const by = ty - dy * long;
  return `M${arrondi(tx)} ${arrondi(ty)}` +
    `L${arrondi(bx - dy * demiLarg)} ${arrondi(by + dx * demiLarg)}` +
    `L${arrondi(bx + dy * demiLarg)} ${arrondi(by - dx * demiLarg)}Z`;
}
