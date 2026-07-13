/* Nabla — widgets/secante.js
   « De la sécante à la tangente » : A fixe en x = a, B déplaçable sur la
   courbe des deux côtés de A (h < 0 permis, garde |h| ≥ h-min), lecture du
   taux de variation en direct, préréglages de h animés, légende « tangente »
   révélée quand |h| ≤ h-legende.
   Spec de l'instance : premiere/maths/derivation/README.md. */

import {
  FONCTIONS, el, creerVue, cheminCourbe, grilleUnite, axes,
  clamp, fmt, fmtAdaptatif, animerValeur, rendreDraggable, creerHint,
} from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

function initSecante(fig) {
  const d = fig.dataset;
  const { f } = FONCTIONS[d.fn];
  const a = parseFloat(d.a);
  const [domMin, domMax] = d.domaine.split(',').map(Number);
  const hMin = parseFloat(d.hMin);
  const hLegende = parseFloat(d.hLegende);
  const hInit = parseFloat(d.hInit);
  let h = hInit;
  let animation = null;

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, {
    xMin: +d.xmin, xMax: +d.xmax, yMin: +d.ymin, yMax: +d.ymax,
  });
  const fa = f(a);
  const ax = vue.xPx(a);
  const ay = vue.yPx(fa);

  /* --- décor statique ----------------------------------------------------- */
  el('path', { class: 'g-grid', d: grilleUnite(vue) }, svg);
  el('path', { class: 'g-axis', d: axes(vue) }, svg);
  const labF = el('text', { class: 'etiquette-math', 'font-size': 18, x: 160, y: 90 }, svg);
  labF.textContent = 'f';
  el('path', { class: 'g-courbe', d: cheminCourbe(vue, f, domMin, domMax) }, svg);

  /* --- éléments dynamiques (sécante sous les points, cf. design) --------- */
  const gDyn = el('g', {}, svg);
  const secante = el('path', { class: 'g-tangente' }, gDyn);
  const guides = el('path', { class: 'g-guide', 'stroke-dasharray': '4 4' }, gDyn);
  const labH = el('text', {
    class: 'etiquette-math etiquette-math--muted', 'font-size': 15, 'text-anchor': 'middle',
  }, gDyn);
  labH.textContent = 'h';
  const labNum = el('text', {
    class: 'etiquette-math etiquette-math--muted', 'font-size': 14,
  }, gDyn);
  labNum.textContent = 'f(a + h) − f(a)';
  const halo = el('circle', { class: 'pt-halo', r: 12 }, gDyn);
  const ptB = el('circle', { class: 'pt-point', r: 5.5 }, gDyn);
  const labB = el('text', { class: 'etiquette-math', 'font-size': 17 }, gDyn);
  labB.textContent = 'B';

  /* point A fixe, peint au-dessus de la sécante */
  el('circle', { class: 'pt-fixe', r: 5, cx: ax, cy: ay }, svg);
  const labA = el('text', { class: 'etiquette-math', 'font-size': 17, x: ax - 22, y: ay + 25 }, svg);
  labA.textContent = 'A';

  /* indice « glisse-moi », positionné près de B initial */
  const bx0 = vue.xPx(a + hInit);
  const by0 = vue.yPx(f(a + hInit));
  const hint = creerHint(svg, {
    x: bx0 - 124.8, y: by0 - 33,
    filDe: [bx0 - 39.8, by0 - 17], filVers: [bx0 - 10.8, by0 - 7],
  });

  /* zone de saisie invisible ≥ 44 px (rayon 42 unités viewBox), clavier */
  const hit = el('circle', {
    class: 'hit-zone', r: 42,
    tabindex: 0, role: 'slider', 'aria-orientation': 'horizontal',
    'aria-label': 'Point B : écart h avec le point A',
    'aria-valuemin': fmtBrut(domMin - a), 'aria-valuemax': fmtBrut(domMax - a),
  }, svg);

  /* --- lectures ------------------------------------------------------------ */
  const elNum = fig.querySelector('.js-num');
  const elH = fig.querySelector('.js-h');
  const elHChip = fig.querySelector('.js-h-chip');
  const elTaux = fig.querySelector('.js-taux');
  const legende = fig.querySelector('.js-legende');
  const presets = [...fig.querySelectorAll('.segmente button')];

  function fmtBrut(v) { return String(Math.round(v * 100) / 100); }

  function garde(hBrut, versDroite) {
    let v = clamp(hBrut, domMin - a, domMax - a);
    if (Math.abs(v) < hMin) v = (v > 0 || (v === 0 && versDroite)) ? hMin : -hMin;
    return v;
  }

  function rendre() {
    const b = a + h;
    const fb = f(b);
    const bx = vue.xPx(b);
    const by = vue.yPx(fb);
    const pente = (fb - fa) / h;

    /* sécante sur toute la largeur de la vue */
    const y0 = fa + pente * (vue.xMin - a);
    const y1 = fa + pente * (vue.xMax - a);
    secante.setAttribute('d', `M0 ${vue.yPx(y0)}L${vue.largeur} ${vue.yPx(y1)}`);

    halo.setAttribute('cx', bx); halo.setAttribute('cy', by);
    ptB.setAttribute('cx', bx); ptB.setAttribute('cy', by);
    hit.setAttribute('cx', bx); hit.setAttribute('cy', by);
    labB.setAttribute('x', clamp(bx + 14, 8, vue.largeur - 18));
    labB.setAttribute('y', clamp(by - 10, 16, vue.hauteur - 8));

    /* guides h / f(a+h) − f(a), masqués quand l'écart devient illisible */
    const visibles = Math.abs(h) >= 0.15;
    guides.style.display = visibles ? '' : 'none';
    labH.style.display = visibles ? '' : 'none';
    labNum.style.display = visibles ? '' : 'none';
    if (visibles) {
      guides.setAttribute('d', `M${ax} ${ay}L${bx} ${ay}L${bx} ${by}`);
      labH.setAttribute('x', (ax + bx) / 2);
      labH.setAttribute('y', ay + 19);
      const cote = h >= 0 ? 1 : -1;
      if (Math.abs(by - ay) >= 110) {
        const cx = bx + 17 * cote;
        const cy = (ay + by) / 2;
        labNum.setAttribute('text-anchor', 'middle');
        labNum.setAttribute('transform', `rotate(-90 ${cx} ${cy})`);
        labNum.setAttribute('x', cx);
        labNum.setAttribute('y', cy);
      } else {
        labNum.removeAttribute('transform');
        labNum.setAttribute('text-anchor', cote > 0 ? 'start' : 'end');
        labNum.setAttribute('x', bx + 10 * cote);
        labNum.setAttribute('y', (ay + by) / 2 + 5);
      }
    }

    /* lectures (nœuds texte, jamais de KaTeX par frame) */
    elNum.textContent = fmtAdaptatif(fb - fa);
    elH.textContent = fmt(h);
    elHChip.textContent = fmt(h);
    elTaux.textContent = fmt(pente);
    hit.setAttribute('aria-valuenow', fmtBrut(h));
    hit.setAttribute('aria-valuetext', `h = ${fmt(h)}`);

    legende.hidden = Math.abs(h) > hLegende;

    for (const btn of presets) {
      btn.setAttribute('aria-pressed', String(Math.abs(parseFloat(btn.dataset.h) - h) < 1e-9));
    }
  }

  function interaction() {
    hint.style.display = 'none';
    track('widget_interact', { widget: 'secante', chapitre });
  }

  /* --- drag ----------------------------------------------------------------- */
  rendreDraggable(hit, {
    surDebut() {
      if (animation) { animation.stop(); animation = null; }
      fig.classList.add('drag-actif');
      interaction();
    },
    surDeplacement(evt) {
      const x = vue.xDePointeur(evt);
      h = garde(x - a, x >= a);
      rendre();
    },
    surFin() { fig.classList.remove('drag-actif'); },
  });

  /* --- clavier ---------------------------------------------------------------- */
  hit.addEventListener('keydown', (e) => {
    const pas = e.shiftKey ? 0.01 : 0.05;
    let cible = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') cible = h + pas;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') cible = h - pas;
    else if (e.key === 'Home') cible = domMin - a;
    else if (e.key === 'End') cible = domMax - a;
    if (cible === null) return;
    e.preventDefault();
    if (animation) { animation.stop(); animation = null; }
    /* saute la zone morte |h| < hMin dans le sens du déplacement */
    if (Math.abs(cible) < hMin) cible = cible >= h ? hMin : -hMin;
    h = garde(cible, cible >= h);
    interaction();
    rendre();
  });

  /* --- préréglages animés --------------------------------------------------------- */
  for (const btn of presets) {
    btn.addEventListener('click', () => {
      const cible = garde(parseFloat(btn.dataset.h), true);
      if (animation) animation.stop();
      interaction();
      animation = animerValeur({
        de: h, vers: cible,
        surFrame(v) { h = Math.abs(v) < hMin ? (v >= 0 ? hMin : -hMin) : v; rendre(); },
        surFin() { animation = null; },
      });
    });
  }

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="secante"]')) initSecante(fig);
