/* Nabla — widgets/chrono-vecteurs.js
   « La chronophotographie » : un lancer de basket filmé image par image
   (Δt fixe entre deux positions). Deux modes sur la même trajectoire :
   - mode "vitesse" (§2) : le curseur choisit une image ; la flèche
     v⃗ = MᵢMᵢ₊₁/Δt se trace du point vers le suivant — tangente à la
     trajectoire, dans le sens du mouvement, longue comme la norme.
   - mode "delta" (§3) : les deux flèches successives sur la trajectoire,
     et en dessous « l'établi » qui les ramène au même point — l'écart
     entre leurs pointes est Δv⃗, identique pour toutes les images.
   Les positions vivent dans le bloc JSON de la figure : le module est
   réutilisable tel quel avec une autre trajectoire.
   Spec : premiere/physique-chimie/mouvement-systeme/README.md. */

import { el, creerVue, clamp, fmt, animerValeur, creerVecteur, etiquetteVecteur } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

/* La valeur affichée à `dec` décimales est-elle exacte ? (signe = ou ≈) */
const exactA = (v, dec) => Math.abs(Math.round(v * 10 ** dec) / 10 ** dec - v) < 1e-9;

function initChrono(fig) {
  const mode = fig.dataset.mode || 'vitesse';
  const cfg = JSON.parse(fig.querySelector('script[type="application/json"]').textContent);
  const dt = cfg.dt;
  const P = cfg.points;
  /* vitesses moyennes par segment : v⃗ᵢ = MᵢMᵢ₊₁ / Δt (analytique, exact) */
  const vSeg = [];
  for (let k = 0; k + 1 < P.length; k++) {
    vSeg.push([(P[k + 1][0] - P[k][0]) / dt, (P[k + 1][1] - P[k][1]) / dt]);
  }
  const iMax = mode === 'delta' ? vSeg.length - 2 : vSeg.length - 1;
  let i = 0;
  let touche = false;
  let animation = null;
  const visites = new Set();

  /* --- graphique du haut : la chronophotographie (repère orthonormé) ------- */
  const svgHaut = fig.querySelector('svg.widget-graph');
  const X0 = -0.5, X1 = 4.1;
  const vbH = svgHaut.viewBox.baseVal.height;
  const yMin = -0.55;
  const vue = creerVue(svgHaut, { xMin: X0, xMax: X1, yMin, yMax: yMin + vbH * (X1 - X0) / 640 });

  let dGrille = '';
  for (let gx = Math.ceil(X0); gx <= Math.floor(X1); gx++) {
    dGrille += `M${vue.xPx(gx).toFixed(1)} 0L${vue.xPx(gx).toFixed(1)} ${vue.hauteur}`;
  }
  for (let gy = Math.ceil(yMin); gy <= Math.floor(vue.yMax); gy++) {
    if (gy === 0) continue;
    dGrille += `M0 ${vue.yPx(gy).toFixed(1)}L${vue.largeur} ${vue.yPx(gy).toFixed(1)}`;
  }
  el('path', { class: 'g-grid', d: dGrille }, svgHaut);
  el('path', { class: 'g-axis', d: `M0 ${vue.yPx(0).toFixed(1)}L${vue.largeur} ${vue.yPx(0).toFixed(1)}` }, svgHaut);

  for (const [k, p] of P.entries()) {
    el('circle', { class: 'pt-craie', cx: vue.xPx(p[0]).toFixed(1), cy: vue.yPx(p[1]).toFixed(1), r: 4 }, svgHaut);
    const lab = el('text', {
      class: 'avc-candidat', x: vue.xPx(p[0]).toFixed(1), y: (vue.yPx(p[1]) + 19).toFixed(1),
      'text-anchor': 'middle',
    }, svgHaut);
    lab.textContent = `M${k}`;
  }

  /* éléments dynamiques du haut */
  const haloSel = el('circle', { class: 'pt-halo', r: 11 }, svgHaut);
  const ptSel = el('circle', { class: 'pt-point', r: 5 }, svgHaut);
  const fleches = [];       /* mode vitesse : 1 flèche accent ; mode delta : 2 flèches craie */
  const etiquettes = [];    /* petits noms mono sous les flèches */
  if (mode === 'vitesse') {
    fleches.push(creerVecteur(svgHaut, { classeTrait: 'g-tangente', classePointe: 'vec-pointe--accent' }));
    etiquettes.push(etiquetteVecteur(svgHaut, 'v', 'accent'));
  } else {
    for (const nom of ['avant', 'après']) {
      fleches.push(creerVecteur(svgHaut, { classeTrait: 'g-courbe', classePointe: 'vec-pointe' }));
      const t = el('text', { class: 'avc-nom', 'text-anchor': 'middle' }, svgHaut);
      t.textContent = nom;
      etiquettes.push(t);
    }
  }

  /* --- graphique du bas (mode delta) : l'établi ---------------------------- */
  let etabli = null;
  if (mode === 'delta') {
    const svgBas = fig.querySelectorAll('svg.widget-graph')[1];
    const O = { x: 250, y: 150 };
    const E = 20;             /* pixels par m/s — 1 carreau (40 px) = 2 m/s */
    let dG = '';
    for (let x = O.x % 40; x <= 640; x += 40) dG += `M${x} 0L${x} 300`;
    for (let y = O.y % 40; y <= 300; y += 40) dG += `M0 ${y}L640 ${y}`;
    el('path', { class: 'g-grid', d: dG }, svgBas);
    const titre = el('text', { class: 'avc-candidat', x: 8, y: 16 }, svgBas);
    titre.textContent = 'L’ÉTABLI — les deux vecteurs, ramenés au même point';
    const echelle = el('text', { class: 'avc-candidat', x: 632, y: 292, 'text-anchor': 'end' }, svgBas);
    echelle.textContent = 'échelle : 1 carreau = 2 m/s';
    el('circle', { class: 'pt-craie', cx: O.x, cy: O.y, r: 3.5 }, svgBas);
    etabli = {
      O, E,
      vAvant: creerVecteur(svgBas, { classeTrait: 'g-courbe', classePointe: 'vec-pointe' }),
      vApres: creerVecteur(svgBas, { classeTrait: 'g-courbe', classePointe: 'vec-pointe' }),
      delta: creerVecteur(svgBas, { classeTrait: 'g-tangente', classePointe: 'vec-pointe--accent' }),
      labAvant: el('text', { class: 'avc-nom', 'text-anchor': 'start' }, svgBas),
      labApres: el('text', { class: 'avc-nom', 'text-anchor': 'start' }, svgBas),
      labDelta: etiquetteVecteur(svgBas, 'Δv', 'accent'),
    };
    etabli.labAvant.textContent = 'avant';
    etabli.labApres.textContent = 'après';
  }

  /* --- lectures ------------------------------------------------------------ */
  const curseur = fig.querySelector('.js-curseur');
  const lectImage = fig.querySelector('.js-image');
  const ligne = fig.querySelector('.js-ligne');
  const legendes = {
    debut: fig.querySelector('.js-leg-debut'),
    cours: fig.querySelector('.js-leg-cours'),
    sommet: fig.querySelector('.js-leg-sommet'),
    fin: fig.querySelector('.js-leg-fin'),
  };
  const etat = fig.querySelector('.js-etat');
  const btnRejouer = fig.querySelector('.js-rejouer');

  function poserEtat(texte, classe) {
    if (!etat) return;
    etat.textContent = texte;
    etat.className = `chip${classe ? ` ${classe}` : ''} js-etat`;
  }

  /* flèche = corde MᵢMᵢ₊₁ (à l'échelle 1/Δt, c'est le vecteur vitesse) */
  function poserCorde(fleche, k) {
    fleche.maj(
      vue.xPx(P[k][0]), vue.yPx(P[k][1]),
      vue.xPx(P[k + 1][0]), vue.yPx(P[k + 1][1]),
    );
  }

  function rendre() {
    haloSel.setAttribute('cx', vue.xPx(P[i][0]).toFixed(1));
    haloSel.setAttribute('cy', vue.yPx(P[i][1]).toFixed(1));
    ptSel.setAttribute('cx', vue.xPx(P[i][0]).toFixed(1));
    ptSel.setAttribute('cy', vue.yPx(P[i][1]).toFixed(1));

    const [vx, vy] = vSeg[i];
    const v = Math.hypot(vx, vy);
    const d = v * dt;

    if (mode === 'vitesse') {
      poserCorde(fleches[0], i);
      /* étiquette v⃗ décalée du côté extérieur de la trajectoire
         (normale maths (−vy ; vx), composante y vers le haut) */
      const mx = (vue.xPx(P[i][0]) + vue.xPx(P[i + 1][0])) / 2;
      const my = (vue.yPx(P[i][1]) + vue.yPx(P[i + 1][1])) / 2;
      const L = Math.hypot(vx, vy) || 1;
      etiquettes[0].maj(mx - (vy / L) * 26, my - (vx / L) * 26 + 6);

      const eD = exactA(d, 2), eV = exactA(v, 1);
      ligne.textContent =
        `de M${i} à M${i + 1} : d ${eD ? '=' : '≈'} ${fmt(d, 2)} m, ` +
        `donc v = d/Δt ${eV ? '=' : '≈'} ${fmt(d, 2)}/${fmt(dt, 2)} ${eV ? '=' : '≈'} ${fmt(v, 1)} m/s`;

      if (vy > 0) poserEtat('la balle monte — la flèche raccourcit', '');
      else if (vy === 0) poserEtat('autour du sommet — v horizontal, jamais nul', 'chip--accent');
      else poserEtat('la balle retombe — la flèche s’allonge', '');

      legendes.debut.hidden = touche;
      legendes.sommet.hidden = !(touche && vy === 0);
      legendes.fin.hidden = !(touche && i === iMax);
      legendes.cours.hidden = !(touche && vy !== 0 && i !== iMax);
    } else {
      poserCorde(fleches[0], i);
      poserCorde(fleches[1], i + 1);
      for (const [k, t] of etiquettes.entries()) {
        const [wx, wy] = vSeg[i + k];
        const L = Math.hypot(wx, wy) || 1;
        const mx = (vue.xPx(P[i + k][0]) + vue.xPx(P[i + k + 1][0])) / 2;
        const my = (vue.yPx(P[i + k][1]) + vue.yPx(P[i + k + 1][1])) / 2;
        t.setAttribute('x', (mx - (wy / L) * 26).toFixed(1));
        t.setAttribute('y', (my - (wx / L) * 26 + 5).toFixed(1));
      }

      /* l'établi : v⃗ᵢ et v⃗ᵢ₊₁ depuis la même origine, Δv⃗ de pointe à pointe */
      const { O, E } = etabli;
      const [ax, ay] = vSeg[i];
      const [bx, by] = vSeg[i + 1];
      const tA = { x: O.x + ax * E, y: O.y - ay * E };
      const tB = { x: O.x + bx * E, y: O.y - by * E };
      etabli.vAvant.maj(O.x, O.y, tA.x, tA.y);
      etabli.vApres.maj(O.x, O.y, tB.x, tB.y);
      etabli.delta.maj(tA.x, tA.y, tB.x, tB.y);
      /* noms au milieu de chaque fût, chacun de son côté ; Δv à droite des pointes */
      for (const [tip, lab, côté] of [[tA, etabli.labAvant, 1], [tB, etabli.labApres, -1]]) {
        const dx = tip.x - O.x;
        const dy = tip.y - O.y;
        const L = Math.hypot(dx, dy) || 1;
        lab.setAttribute('text-anchor', 'middle');
        lab.setAttribute('x', ((O.x + tip.x) / 2 + (dy / L) * 16 * côté).toFixed(1));
        lab.setAttribute('y', ((O.y + tip.y) / 2 - (dx / L) * 16 * côté + 5).toFixed(1));
      }
      etabli.labDelta.maj(tA.x + 30, (tA.y + tB.y) / 2 + 6);

      const dvx = bx - ax;
      const dvy = by - ay;
      const ndv = Math.hypot(dvx, dvy);
      ligne.textContent =
        `entre M${i} et M${i + 2} : Δv = (${fmt(dvx, 1)} ; ${fmt(dvy, 1)}) m/s — norme ${fmt(ndv, 1)} m/s`;

      legendes.debut.hidden = touche;
      legendes.fin.hidden = !(touche && visites.size >= 3);
      legendes.cours.hidden = !(touche && visites.size < 3);
    }

    if (lectImage) lectImage.textContent = `M${i}`;
    if (parseFloat(curseur.value) !== i) curseur.value = String(i);
    curseur.style.setProperty('--pos', ((i / iMax) * 100) + '%');
    curseur.setAttribute('aria-valuetext', `image M${i} — t = ${fmt(i * dt, 2)} seconde`);
  }

  function interaction() {
    touche = true;
    visites.add(i);
    track('widget_interact', { widget: fig.dataset.nom || mode, chapitre });
  }

  curseur.addEventListener('input', () => {
    if (animation) { animation.stop(); animation = null; }
    i = clamp(Math.round(parseFloat(curseur.value)), 0, iMax);
    interaction();
    rendre();
  });

  if (btnRejouer) {
    btnRejouer.addEventListener('click', () => {
      if (animation) animation.stop();
      i = 0;
      interaction();
      rendre();
      animation = animerValeur({
        de: 0, vers: iMax, duree: iMax * 480,
        surFrame: (val) => {
          const k = clamp(Math.round(val), 0, iMax);
          if (k !== i) { i = k; visites.add(i); rendre(); }
        },
        surFin: () => { i = iMax; animation = null; visites.add(i); rendre(); },
      });
    });
  }

  fig.querySelector('.js-reset').addEventListener('click', () => {
    if (animation) { animation.stop(); animation = null; }
    i = 0;
    touche = false;
    visites.clear();
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="chrono-vecteurs"]')) initChrono(fig);
