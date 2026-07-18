/* Nabla — widgets/geo-projete.js
   « La distance vraie » : la droite d est fixée, l'élève promène M sur les
   nœuds de la grille ; le projeté orthogonal H, le segment [MH] et la
   distance MH suivent — face à la « distance verticale », toujours plus
   longue, qui incarne l'erreur classique. Avec d : 3x + 4y − 12 = 0
   (vecteur normal 3-4-5), H tombe sur des centièmes exacts et MH sur des
   dixièmes exacts pour tout M entier.
   Spec de l'instance : premiere/maths/geometrie-reperee/README.md. */

import {
  el, creerVue, grilleUnite, axes, clamp, fmt, rendreDraggable, creerHint,
} from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

const ent = (n) => (n < 0 ? `−${-n}` : `${n}`);

function initGeoProjete(fig) {
  const d = fig.dataset;
  const a = +d.da;
  const b = +d.db;
  const c = +d.dc;
  const n2 = a * a + b * b;
  const mInit = d.mInit.split(',').map(Number);
  const M = mInit.slice();
  const [mxMin, mxMax] = d.xdom.split(',').map(Number);
  const [myMin, myMax] = d.ydom.split(',').map(Number);

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, {
    xMin: +d.xmin, xMax: +d.xmax, yMin: +d.ymin, yMax: +d.ymax,
  });

  /* --- décor statique ------------------------------------------------------ */
  el('path', { class: 'g-grid', d: grilleUnite(vue) }, svg);
  el('path', { class: 'g-axis', d: axes(vue) }, svg);
  /* la droite d, tracée d'un bord à l'autre : y = (−c − ax) / b */
  const yDe = (x) => (-c - a * x) / b;
  el('path', {
    class: 'g-courbe',
    d: `M${vue.xPx(vue.xMin)} ${vue.yPx(yDe(vue.xMin))}L${vue.xPx(vue.xMax)} ${vue.yPx(yDe(vue.xMax))}`,
  }, svg);
  const labD = el('text', {
    class: 'etiquette-math etiquette-math--muted', 'font-size': 15,
    x: vue.xPx(vue.xMax - 2.5), y: vue.yPx(yDe(vue.xMax - 2.5)) - 14, 'text-anchor': 'middle',
  }, svg);
  labD.textContent = 'd';

  /* --- éléments dynamiques -------------------------------------------------- */
  const verticale = el('path', { class: 'g-guide', 'stroke-dasharray': '4 4' }, svg);
  const perpendiculaire = el('path', { class: 'g-guide-accent', 'stroke-dasharray': '4 4' }, svg);
  const marqueDroit = el('path', { class: 'marque-droit' }, svg);
  const ptH = el('circle', { class: 'pt-derivee', r: 4.5 }, svg);
  const labH = el('text', {
    class: 'etiquette-math etiquette-math--accent', 'font-size': 15, 'text-anchor': 'middle',
  }, svg);
  labH.textContent = 'H';
  const halo = el('circle', { class: 'pt-halo', r: 12 }, svg);
  const pt = el('circle', { class: 'pt-point', r: 5.5 }, svg);
  const labM = el('text', {
    class: 'etiquette-math', 'font-size': 15, 'text-anchor': 'middle',
  }, svg);
  labM.textContent = 'M';
  const hit = el('circle', {
    class: 'hit-zone', r: 42,
    tabindex: 0, role: 'slider', 'aria-orientation': 'horizontal',
    'aria-label': 'Le point M — flèches gauche et droite pour l’abscisse, haut et bas pour l’ordonnée',
    'aria-valuemin': String(mxMin), 'aria-valuemax': String(mxMax),
  }, svg);

  const mx0 = vue.xPx(mInit[0]);
  const my0 = vue.yPx(mInit[1]);
  const hint = creerHint(svg, {
    x: mx0 + 22.4, y: my0 - 59.1,
    filDe: [mx0 + 24.4, my0 - 37.1], filVers: [mx0 + 5.4, my0 - 6.1],
  });

  /* --- lectures ------------------------------------------------------------ */
  const ligne1 = fig.querySelector('.js-ligne1');
  const ligne2 = fig.querySelector('.js-ligne2');
  const elM = fig.querySelector('.js-m');
  const elMh = fig.querySelector('.js-mh');
  const elVert = fig.querySelector('.js-vert');
  const legende = fig.querySelector('.js-legende');

  function rendre() {
    const v = a * M[0] + b * M[1] + c;    // valeur de l'équation en M
    const t = v / n2;
    const H = [M[0] - t * a, M[1] - t * b];
    const mh = Math.abs(v) / Math.sqrt(n2);
    const vert = Math.abs(v) / Math.abs(b);

    const mPx = [vue.xPx(M[0]), vue.yPx(M[1])];
    const hPx = [vue.xPx(H[0]), vue.yPx(H[1])];
    halo.setAttribute('cx', mPx[0]); halo.setAttribute('cy', mPx[1]);
    pt.setAttribute('cx', mPx[0]); pt.setAttribute('cy', mPx[1]);
    hit.setAttribute('cx', mPx[0]); hit.setAttribute('cy', mPx[1]);
    ptH.setAttribute('cx', hPx[0]); ptH.setAttribute('cy', hPx[1]);
    labM.setAttribute('x', clamp(mPx[0] + 16, 12, vue.largeur - 12));
    labM.setAttribute('y', clamp(mPx[1] - 12, 18, vue.hauteur - 8));
    labH.setAttribute('x', clamp(hPx[0] - 16, 12, vue.largeur - 12));
    labH.setAttribute('y', clamp(hPx[1] + 22, 18, vue.hauteur - 8));

    const surD = v === 0;
    if (surD) {
      perpendiculaire.style.display = 'none';
      verticale.style.display = 'none';
      marqueDroit.style.display = 'none';
    } else {
      perpendiculaire.style.display = '';
      verticale.style.display = '';
      marqueDroit.style.display = '';
      perpendiculaire.setAttribute('d', `M${mPx[0]} ${mPx[1]}L${hPx[0]} ${hPx[1]}`);
      verticale.setAttribute('d', `M${mPx[0]} ${mPx[1]}L${mPx[0]} ${vue.yPx(yDe(M[0]))}`);
      /* équerre en H, entre la droite et [HM] */
      const L = Math.hypot(a, b);
      const s = Math.sign(v);
      const nx = (a / L) * s;             // direction H → M, en pixels
      const ny = (-b / L) * s;
      const ux = -b / L;
      const uy = -a / L;
      const q = 11;
      marqueDroit.setAttribute('d',
        `M${hPx[0] + nx * q} ${hPx[1] + ny * q}` +
        `L${hPx[0] + (nx + ux) * q} ${hPx[1] + (ny + uy) * q}` +
        `L${hPx[0] + ux * q} ${hPx[1] + uy * q}`);
    }

    ligne1.textContent = `H = (${fmt(H[0])} ; ${fmt(H[1])})`;
    ligne2.textContent = `distance de M à d : MH = ${fmt(mh)}`;
    elM.textContent = `(${ent(M[0])} ; ${ent(M[1])})`;
    elMh.textContent = fmt(mh);
    elVert.textContent = fmt(vert);

    legende.textContent = surD
      ? 'M est sur d : ses coordonnées vérifient l’équation, H et M sont confondus, la distance est nulle.'
      : 'La verticale grise a l’air directe, mais elle est toujours plus longue : la distance d’un point à une droite se mesure à angle droit, le long de [MH].';

    hit.setAttribute('aria-valuenow', String(M[0]));
    hit.setAttribute('aria-valuetext',
      `M = (${ent(M[0])} ; ${ent(M[1])}), H = (${fmt(H[0])} ; ${fmt(H[1])}), distance ${fmt(mh)}`);
  }

  function interaction() {
    hint.style.display = 'none';
    track('widget_interact', { widget: 'geo-projete', chapitre });
  }

  function poser(x, y) {
    M[0] = clamp(Math.round(x), mxMin, mxMax);
    M[1] = clamp(Math.round(y), myMin, myMax);
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
    poser(M[0] + dx, M[1] + dy);
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    M[0] = mInit[0];
    M[1] = mInit[1];
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="geo-projete"]')) initGeoProjete(fig);
