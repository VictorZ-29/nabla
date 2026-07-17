/* Nabla — widgets/mouvement-forces.js
   « Qui tord le mouvement ? » (§4) : trois chronophotographies au choix —
   la balle en l'air, le palet sur la glace, le manège — et, image par
   image, les deux vecteurs vitesse successifs (craie), le vecteur Δv⃗
   (accent plein) et la somme des forces ΣF⃗ (accent pointillé, sa propre
   échelle). Le geste : changer d'image et de scène, et constater que Δv⃗
   garde toujours la direction et le sens de ΣF⃗ — et qu'il est nul quand
   les forces se compensent.
   Spec : premiere/physique-chimie/mouvement-systeme/README.md. */

import { el, creerVue, clamp, animerValeur, creerVecteur, etiquetteVecteur } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

const DT = 0.2;
const PARABOLE = [[0, 0], [0.5, 1.2], [1, 2], [1.5, 2.4], [2, 2.4], [2.5, 2], [3, 1.2], [3.5, 0]];
const GLACE = Array.from({ length: 8 }, (_, k) => [0.25 + 0.5 * k, 1.3]);
const CENTRE = [2.05, 1.3];
const RAYON = 1.05;
/* manège vu de dessus, sens horaire, un point tous les 45° */
const MANEGE = Array.from({ length: 8 }, (_, k) => {
  const a = (Math.PI / 180) * (90 - 45 * k);
  return [CENTRE[0] + RAYON * Math.cos(a), CENTRE[1] + RAYON * Math.sin(a)];
});
const SCENES = { air: PARABOLE, glace: GLACE, manege: MANEGE };

function initForces(fig) {
  let scene = 'air';
  let i = 0;
  let animation = null;
  const iMax = 5;

  const svg = fig.querySelector('svg.widget-graph');
  const X0 = -0.5, X1 = 4.1;
  const vbH = svg.viewBox.baseVal.height;
  const yMin = -0.55;
  const vue = creerVue(svg, { xMin: X0, xMax: X1, yMin, yMax: yMin + vbH * (X1 - X0) / 640 });

  let dGrille = '';
  for (let gx = Math.ceil(X0); gx <= Math.floor(X1); gx++) {
    dGrille += `M${vue.xPx(gx).toFixed(1)} 0L${vue.xPx(gx).toFixed(1)} ${vue.hauteur}`;
  }
  for (let gy = Math.ceil(yMin); gy <= Math.floor(vue.yMax); gy++) {
    dGrille += `M0 ${vue.yPx(gy).toFixed(1)}L${vue.largeur} ${vue.yPx(gy).toFixed(1)}`;
  }
  el('path', { class: 'g-grid', d: dGrille }, svg);

  /* décor propre à la scène (sol, glace, cercle, points, noms) */
  const decor = el('g', {}, svg);

  /* éléments dynamiques, créés une fois */
  const cordeAvant = creerVecteur(svg, { classeTrait: 'g-courbe', classePointe: 'vec-pointe' });
  const cordeApres = creerVecteur(svg, { classeTrait: 'g-courbe', classePointe: 'vec-pointe' });
  const labAvant = el('text', { class: 'avc-nom', 'text-anchor': 'middle' }, svg);
  labAvant.textContent = 'avant';
  const labApres = el('text', { class: 'avc-nom', 'text-anchor': 'middle' }, svg);
  labApres.textContent = 'après';
  const halo = el('circle', { class: 'pt-halo', r: 11 }, svg);
  const vecDelta = creerVecteur(svg, { classeTrait: 'g-tangente', classePointe: 'vec-pointe--accent' });
  const labDelta = etiquetteVecteur(svg, 'Δv', 'accent');
  const vecForce = creerVecteur(svg, { classeTrait: 'g-tangente', classePointe: 'vec-pointe--accent' });
  vecForce.trait.setAttribute('stroke-dasharray', '6 5');
  const labForce = etiquetteVecteur(svg, 'ΣF', 'accent');
  const vecP = creerVecteur(svg, { classeTrait: 'g-courbe', classePointe: 'vec-pointe' });
  const labP = etiquetteVecteur(svg, 'P');
  const vecR = creerVecteur(svg, { classeTrait: 'g-courbe', classePointe: 'vec-pointe' });
  const labR = etiquetteVecteur(svg, 'R');

  const curseur = fig.querySelector('.js-curseur');
  const btnRejouer = fig.querySelector('.js-rejouer');

  function dessinerDecor() {
    decor.replaceChildren();
    const P = SCENES[scene];
    if (scene === 'air') {
      el('path', { class: 'g-axis', d: `M0 ${vue.yPx(0).toFixed(1)}L${vue.largeur} ${vue.yPx(0).toFixed(1)}` }, decor);
    } else if (scene === 'glace') {
      el('path', {
        class: 'g-guide',
        d: `M0 ${vue.yPx(1.16).toFixed(1)}L${vue.largeur} ${vue.yPx(1.16).toFixed(1)}`,
      }, decor);
      const t = el('text', { class: 'avc-candidat', x: 8, y: (vue.yPx(1.16) + 18).toFixed(1) }, decor);
      t.textContent = 'la glace (frottements négligés)';
    } else {
      el('circle', {
        class: 'g-guide', fill: 'none',
        cx: vue.xPx(CENTRE[0]).toFixed(1), cy: vue.yPx(CENTRE[1]).toFixed(1),
        r: (RAYON * vue.pxParX).toFixed(1), 'stroke-dasharray': '3 4',
      }, decor);
      el('circle', {
        class: 'pt-craie',
        cx: vue.xPx(CENTRE[0]).toFixed(1), cy: vue.yPx(CENTRE[1]).toFixed(1), r: 3.5,
      }, decor);
      const t = el('text', {
        class: 'avc-candidat',
        x: vue.xPx(CENTRE[0]).toFixed(1), y: (vue.yPx(CENTRE[1]) + 20).toFixed(1),
        'text-anchor': 'middle',
      }, decor);
      t.textContent = 'le centre';
    }
    for (const [k, p] of P.entries()) {
      el('circle', { class: 'pt-craie', cx: vue.xPx(p[0]).toFixed(1), cy: vue.yPx(p[1]).toFixed(1), r: 4 }, decor);
      /* noms : sous le point, sauf au manège où ils s'écartent du centre */
      let lx = vue.xPx(p[0]);
      let ly = vue.yPx(p[1]) + 19;
      if (scene === 'manege') {
        const ux = (p[0] - CENTRE[0]) / RAYON;
        const uy = (p[1] - CENTRE[1]) / RAYON;
        lx = vue.xPx(p[0] + 0.24 * ux);
        ly = vue.yPx(p[1] + 0.24 * uy) + 4;
      }
      const t = el('text', { class: 'avc-candidat', x: lx.toFixed(1), y: ly.toFixed(1), 'text-anchor': 'middle' }, decor);
      t.textContent = `M${k}`;
    }
  }

  /* bascule l'affichage des lectures statiques (chips, lignes, légendes) */
  function basculerStatiques() {
    for (const s of ['air', 'glace', 'manege']) {
      for (const n of fig.querySelectorAll(`.js-stat-${s}`)) n.hidden = s !== scene;
    }
  }

  function rendre() {
    const P = SCENES[scene];
    const M = (k) => ({ x: vue.xPx(P[k][0]), y: vue.yPx(P[k][1]) });

    cordeAvant.maj(M(i).x, M(i).y, M(i + 1).x, M(i + 1).y);
    cordeApres.maj(M(i + 1).x, M(i + 1).y, M(i + 2).x, M(i + 2).y);
    halo.setAttribute('cx', M(i + 1).x.toFixed(1));
    halo.setAttribute('cy', M(i + 1).y.toFixed(1));

    /* étiquettes avant/après du côté extérieur de la corde */
    for (const [k, lab] of [[0, labAvant], [1, labApres]]) {
      const wx = P[i + k + 1][0] - P[i + k][0];
      const wy = P[i + k + 1][1] - P[i + k][1];
      const L = Math.hypot(wx, wy) || 1;
      const mx = (M(i + k).x + M(i + k + 1).x) / 2;
      const my = (M(i + k).y + M(i + k + 1).y) / 2;
      lab.setAttribute('x', (mx - (wy / L) * 26).toFixed(1));
      lab.setAttribute('y', (my - (wx / L) * 26 + 5).toFixed(1));
    }

    /* Δv⃗ × Δt = MᵢMᵢ₊₂ − 2·MᵢMᵢ₊₁ : dessiné au point du milieu, même
       échelle que les cordes ; ΣF⃗ en pointillé, sa propre échelle. */
    const dvx = P[i + 2][0] - 2 * P[i + 1][0] + P[i][0];
    const dvy = P[i + 2][1] - 2 * P[i + 1][1] + P[i][1];
    const nul = Math.hypot(dvx, dvy) < 1e-9;

    vecDelta.g.style.display = nul ? 'none' : '';
    labDelta.g.style.display = nul ? 'none' : '';
    vecForce.g.style.display = nul ? 'none' : '';
    labForce.g.style.display = nul ? 'none' : '';
    vecP.g.style.display = scene === 'glace' ? '' : 'none';
    labP.g.style.display = scene === 'glace' ? '' : 'none';
    vecR.g.style.display = scene === 'glace' ? '' : 'none';
    labR.g.style.display = scene === 'glace' ? '' : 'none';

    if (!nul) {
      const b = M(i + 1);
      const tx = vue.xPx(P[i + 1][0] + dvx);
      const ty = vue.yPx(P[i + 1][1] + dvy);
      vecDelta.maj(b.x, b.y, tx, ty);
      /* décalage perpendiculaire (en px) pour que ΣF⃗ longe Δv⃗ sans le couvrir */
      const dxp = tx - b.x;
      const dyp = ty - b.y;
      const Lp = Math.hypot(dxp, dyp) || 1;
      const ox = (-dyp / Lp) * 14;
      const oy = (dxp / Lp) * 14;
      const eF = 1.55;      /* ΣF⃗ un peu plus long que Δv⃗ : échelle libre */
      vecForce.maj(b.x + ox, b.y + oy, b.x + ox + dxp * eF, b.y + oy + dyp * eF);
      labDelta.maj(tx - ox * 1.6, ty - oy * 1.6);
      labForce.maj(b.x + ox * 2.4 + dxp * eF, b.y + oy * 2.4 + dyp * eF);
    } else {
      /* sur la glace : le poids et la réaction du sol, qui se compensent */
      const b = M(i + 1);
      const l = 0.52 * vue.pxParX;
      vecP.maj(b.x - 7, b.y, b.x - 7, b.y + l);
      vecR.maj(b.x + 7, b.y, b.x + 7, b.y - l);
      labP.maj(b.x - 26, b.y + l - 2);
      labR.maj(b.x + 27, b.y - l + 14);
    }

    const lectImage = fig.querySelector('.js-image');
    if (lectImage) lectImage.textContent = `M${i} à M${i + 2}`;
    if (parseFloat(curseur.value) !== i) curseur.value = String(i);
    curseur.style.setProperty('--pos', ((i / iMax) * 100) + '%');
    curseur.setAttribute('aria-valuetext', `images M${i} à M${i + 2}`);
  }

  function interaction() {
    track('widget_interact', { widget: fig.dataset.nom || 'forces', chapitre });
  }

  curseur.addEventListener('input', () => {
    if (animation) { animation.stop(); animation = null; }
    i = clamp(Math.round(parseFloat(curseur.value)), 0, iMax);
    interaction();
    rendre();
  });

  for (const btn of fig.querySelectorAll('.segmente button[data-scene]')) {
    btn.addEventListener('click', () => {
      if (animation) { animation.stop(); animation = null; }
      scene = btn.dataset.scene;
      i = 0;
      interaction();
      for (const b of fig.querySelectorAll('.segmente button[data-scene]')) {
        b.setAttribute('aria-pressed', String(b === btn));
      }
      dessinerDecor();
      basculerStatiques();
      rendre();
    });
  }

  if (btnRejouer) {
    btnRejouer.addEventListener('click', () => {
      if (animation) animation.stop();
      interaction();
      i = 0;
      rendre();
      animation = animerValeur({
        de: 0, vers: iMax, duree: iMax * 480,
        surFrame: (val) => {
          const k = clamp(Math.round(val), 0, iMax);
          if (k !== i) { i = k; rendre(); }
        },
        surFin: () => { i = iMax; animation = null; rendre(); },
      });
    });
  }

  fig.querySelector('.js-reset').addEventListener('click', () => {
    if (animation) { animation.stop(); animation = null; }
    scene = 'air';
    i = 0;
    for (const b of fig.querySelectorAll('.segmente button[data-scene]')) {
      b.setAttribute('aria-pressed', String(b.dataset.scene === 'air'));
    }
    dessinerDecor();
    basculerStatiques();
    rendre();
  });

  dessinerDecor();
  basculerStatiques();
  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="mouvement-forces"]')) initForces(fig);
