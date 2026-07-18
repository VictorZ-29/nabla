/* Nabla — widgets/parabole-sommet.js
   « Attrape le sommet » : une parabole accent a(x − α)² + β posée sur la
   courbe craie de x², pilotée par trois curseurs (a, α, β) — et le sommet
   se déplace aussi directement au doigt (aimanté à la grille : α entier,
   β au demi). Les deux écritures (canonique et développée) se réécrivent
   en direct : même fonction, deux lectures. Les pas des curseurs sont
   choisis pour que b = −2aα et c = aα² + β restent exacts à 2 décimales.
   Spec de l'instance : premiere/maths/second-degre/README.md. */

import {
  el, creerVue, cheminCourbe, grilleUnite, axes, clamp, fmtCourt,
  rendreDraggable, creerHint,
} from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

/* « 0,5 x² », « −x² », « x² » : coefficient lisible devant un morceau. */
function coef(v) {
  if (v === 1) return '';
  if (v === -1) return '−';
  return `${fmtCourt(v)} `;
}

function initParaboleSommet(fig) {
  const d = fig.dataset;
  const aInit = parseFloat(d.aInit);
  const alInit = parseFloat(d.alphaInit);
  const beInit = parseFloat(d.betaInit);
  let a = aInit;
  let al = alInit;
  let be = beInit;

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, {
    xMin: +d.xmin, xMax: +d.xmax, yMin: +d.ymin, yMax: +d.ymax,
  });

  /* --- décor statique : grille, axes, la craie x² --------------------------- */
  el('path', { class: 'g-grid', d: grilleUnite(vue) }, svg);
  el('path', { class: 'g-axis', d: axes(vue) }, svg);
  const wRef = Math.sqrt(vue.yMax);
  el('path', { class: 'g-courbe', d: cheminCourbe(vue, (x) => x * x, -wRef, wRef) }, svg);
  const labRef = el('text', {
    class: 'etiquette-math etiquette-math--muted', 'font-size': 15,
    x: vue.xPx(wRef) + 8, y: 22,
  }, svg);
  labRef.textContent = 'x²';

  /* --- éléments dynamiques -------------------------------------------------- */
  const axe = el('path', { class: 'g-guide', 'stroke-dasharray': '4 4' }, svg);
  const labAxe = el('text', { class: 'etiquette-mono etiquette-math--muted', 'font-size': 12 }, svg);
  const courbe = el('path', { class: 'g-courbe-derivee' }, svg);
  const halo = el('circle', { class: 'pt-halo', r: 12 }, svg);
  const ptS = el('circle', { class: 'pt-point', r: 5.5 }, svg);
  const labS = el('text', { class: 'etiquette-math', 'font-size': 18 }, svg);
  labS.textContent = 'S';

  const sx0 = vue.xPx(alInit);
  const sy0 = vue.yPx(beInit);
  const hint = creerHint(svg, {
    x: sx0 + 22.4, y: sy0 - 59.1,
    filDe: [sx0 + 24.4, sy0 - 37.1], filVers: [sx0 + 5.4, sy0 - 6.1],
  });

  /* Le clavier passe par les trois curseurs natifs : la zone de saisie du
     sommet est réservée au pointeur (convention tangente.js). */
  const hit = el('circle', { class: 'hit-zone', r: 42, 'aria-hidden': 'true' }, svg);

  /* --- lectures et contrôles ------------------------------------------------ */
  const ligneCan = fig.querySelector('.js-canonique');
  const ligneDev = fig.querySelector('.js-developpee');
  const elSommet = fig.querySelector('.js-sommet');
  const elEtat = fig.querySelector('.js-etat');
  const legende = fig.querySelector('.js-legende');
  const curseurA = fig.querySelector('.js-curseur-a');
  const curseurAl = fig.querySelector('.js-curseur-alpha');
  const curseurBe = fig.querySelector('.js-curseur-beta');

  function majCurseur(curseur, v, texte) {
    if (parseFloat(curseur.value) !== v) curseur.value = String(v);
    const min = parseFloat(curseur.min);
    const max = parseFloat(curseur.max);
    curseur.style.setProperty('--pos', (((v - min) / (max - min)) * 100) + '%');
    curseur.setAttribute('aria-valuetext', texte);
  }

  function rendre() {
    /* parabole accent, tronquée là où elle sort de la vue (haut ou bas) */
    if (a !== 0) {
      const borne = a > 0 ? vue.yMax : vue.yMin;
      const demi = Math.sqrt((borne - be) / a);
      const x0 = Math.max(vue.xMin, al - demi);
      const x1 = Math.min(vue.xMax, al + demi);
      courbe.setAttribute('d', cheminCourbe(vue, (x) => a * (x - al) * (x - al) + be, x0, x1));
    } else {
      const py = vue.yPx(be);
      courbe.setAttribute('d', `M0 ${Math.round(py * 10) / 10}L${vue.largeur} ${Math.round(py * 10) / 10}`);
    }

    /* sommet, axe de symétrie */
    const sx = vue.xPx(al);
    const sy = vue.yPx(be);
    const visible = a !== 0 ? '' : 'none';
    for (const n of [axe, labAxe, halo, ptS, labS]) n.style.display = visible;
    hit.style.display = visible;
    if (a !== 0) {
      axe.setAttribute('d', `M${sx} ${vue.hauteur}L${sx} 0`);
      labAxe.setAttribute('x', sx + 6);
      labAxe.setAttribute('y', a > 0 ? 14 : vue.hauteur - 8);
      labAxe.textContent = `x = ${fmtCourt(al)}`;
      halo.setAttribute('cx', sx); halo.setAttribute('cy', sy);
      ptS.setAttribute('cx', sx); ptS.setAttribute('cy', sy);
      hit.setAttribute('cx', sx); hit.setAttribute('cy', sy);
      labS.setAttribute('x', clamp(sx - 24, 8, vue.largeur - 18));
      labS.setAttribute('y', clamp(a > 0 ? sy + 24 : sy - 12, 16, vue.hauteur - 6));
    }

    /* les deux écritures de la même fonction */
    const b = -2 * a * al;
    const c = a * al * al + be;
    if (a !== 0) {
      const carre = al === 0 ? 'x²' : `(x ${al > 0 ? '−' : '+'} ${fmtCourt(Math.abs(al))})²`;
      const fin = be === 0 ? '' : ` ${be > 0 ? '+' : '−'} ${fmtCourt(Math.abs(be))}`;
      ligneCan.textContent = `f(x) = ${coef(a)}${carre}${fin}`;
      let dev = `${coef(a)}x²`;
      if (b !== 0) dev += ` ${b > 0 ? '+' : '−'} ${b === 1 || b === -1 ? '' : fmtCourt(Math.abs(b)) + ' '}x`;
      if (c !== 0) dev += ` ${c > 0 ? '+' : '−'} ${fmtCourt(Math.abs(c))}`;
      ligneDev.textContent = `= ${dev}`;
      elSommet.textContent = `S = (${fmtCourt(al)} ; ${fmtCourt(be)})`;
    } else {
      ligneCan.textContent = `f(x) = ${fmtCourt(be)}`;
      ligneDev.textContent = '(plus de terme en x² : ce n’est plus un trinôme)';
      elSommet.textContent = 'S = —';
    }

    /* chip d'état + légende */
    if (a > 0) {
      elEtat.textContent = 'a > 0 — la parabole est tournée vers le haut';
      elEtat.className = 'chip chip--good js-etat';
    } else if (a < 0) {
      elEtat.textContent = 'a < 0 — la parabole est tournée vers le bas';
      elEtat.className = 'chip chip--bad js-etat';
    } else {
      elEtat.textContent = 'a = 0 — plus de x² : une droite, pas une parabole';
      elEtat.className = 'chip chip--accent js-etat';
    }
    if (a === 0) {
      legende.textContent = 'Écrase a jusqu’à 0 : le terme en x² disparaît et la courbe dégénère en droite horizontale. Voilà pourquoi la définition exige a ≠ 0.';
    } else {
      const ouverture = Math.abs(a) === 1 ? 'même ouverture que x²'
        : (Math.abs(a) > 1 ? 'plus serrée que x²' : 'plus ouverte que x²');
      legende.textContent = `La courbe de x², ${a < 0 ? 'retournée puis ' : ''}étirée par a (${ouverture}), déplacée pour poser son sommet en (${fmtCourt(al)} ; ${fmtCourt(be)}). Les deux écritures décrivent la même fonction.`;
    }

    majCurseur(curseurA, a, `a = ${fmtCourt(a)}`);
    majCurseur(curseurAl, al, `alpha = ${fmtCourt(al)}`);
    majCurseur(curseurBe, be, `beta = ${fmtCourt(be)}`);
  }

  function interaction() {
    hint.style.display = 'none';
    track('widget_interact', { widget: 'parabole-sommet', chapitre });
  }

  /* au plus un rendu par frame pendant un drag de curseur */
  let renduPlanifie = 0;
  function planifierRendu() {
    if (!renduPlanifie) renduPlanifie = requestAnimationFrame(() => { renduPlanifie = 0; rendre(); });
  }

  curseurA.addEventListener('input', () => {
    a = clamp(parseFloat(curseurA.value), parseFloat(curseurA.min), parseFloat(curseurA.max));
    interaction();
    planifierRendu();
  });
  curseurAl.addEventListener('input', () => {
    al = clamp(parseFloat(curseurAl.value), parseFloat(curseurAl.min), parseFloat(curseurAl.max));
    interaction();
    planifierRendu();
  });
  curseurBe.addEventListener('input', () => {
    be = clamp(parseFloat(curseurBe.value), parseFloat(curseurBe.min), parseFloat(curseurBe.max));
    interaction();
    planifierRendu();
  });

  /* drag direct du sommet, aimanté à la grille des curseurs */
  rendreDraggable(hit, {
    surDebut() { fig.classList.add('drag-actif'); interaction(); },
    surDeplacement(evt) {
      const r = svg.getBoundingClientRect();
      const mx = vue.xDe(((evt.clientX - r.left) / r.width) * vue.largeur);
      const my = vue.yMax - ((evt.clientY - r.top) / r.height) * (vue.yMax - vue.yMin);
      al = clamp(Math.round(mx), parseFloat(curseurAl.min), parseFloat(curseurAl.max));
      be = clamp(Math.round(my * 2) / 2, parseFloat(curseurBe.min), parseFloat(curseurBe.max));
      rendre();
    },
    surFin() { fig.classList.remove('drag-actif'); },
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    a = aInit; al = alInit; be = beInit;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="parabole-sommet"]')) initParaboleSommet(fig);
