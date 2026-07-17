/* Nabla — widgets/mouvement-masse.js
   « La même poussée, trois chariots » (§5) : une poussée identique (même
   force, même durée 0,50 s) appliquée à un chariot de 1, 2 ou 3 kg, dans
   le sens du mouvement ou contre lui. Deux photos : AVANT et APRÈS. Le
   fantôme pointillé de v⃗ avant reste sur la photo d'après : l'écart
   entre les deux pointes, c'est Δv⃗ — divisé par deux quand la masse
   double. Tout est exact par construction : Δv = 3,0/m m/s.
   Spec : premiere/physique-chimie/mouvement-systeme/README.md. */

import { el, fmt, creerVecteur } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

const E = 26;              /* pixels par m/s */
const FRONT = 170;         /* abscisse du nez du chariot */
const DV0 = 3;             /* Δv pour 1 kg, en m/s */

function initMasse(fig) {
  let sens = 'avec';       /* 'avec' : pousser vers l'avant — 'contre' : freiner */
  let masse = 1;
  const massesVues = new Set([1]);
  let touche = false;

  const svg = fig.querySelector('svg.widget-graph');

  /* décor fixe : titres de rangée et sols */
  for (const [texte, y] of [['AVANT LA POUSSÉE', 20], ['APRÈS LA POUSSÉE', 150]]) {
    const t = el('text', { class: 'avc-candidat', x: 8, y }, svg);
    t.textContent = texte;
  }
  for (const y of [112, 248]) {
    el('path', { class: 'g-guide', d: `M30 ${y}L610 ${y}` }, svg);
  }

  /* chariots : m caisses côte à côte, le nez reste au même endroit */
  const caissesAvant = el('g', {}, svg);
  const caissesApres = el('g', {}, svg);
  const labMasseAvant = el('text', { class: 'avc-nom', 'text-anchor': 'middle' }, svg);
  const labMasseApres = el('text', { class: 'avc-nom', 'text-anchor': 'middle' }, svg);

  /* la poussée (accent pointillé), les vitesses (craie) et Δv⃗ (accent) */
  const vecPoussee = creerVecteur(svg, { classeTrait: 'g-tangente', classePointe: 'vec-pointe--accent' });
  vecPoussee.trait.setAttribute('stroke-dasharray', '6 5');
  const labPoussee = el('text', { class: 'avc-nom--accent avc-nom', x: 234, y: 38, 'text-anchor': 'middle' }, svg);
  labPoussee.textContent = 'la poussée — pendant 0,50 s';
  const vecAvant = creerVecteur(svg, { classeTrait: 'g-courbe', classePointe: 'vec-pointe' });
  const labAvant = el('text', { class: 'avc-nom' }, svg);
  const vecApres = creerVecteur(svg, { classeTrait: 'g-courbe', classePointe: 'vec-pointe' });
  const labApres = el('text', { class: 'avc-nom' }, svg);
  const fantome = el('path', { class: 'g-guide', 'stroke-dasharray': '4 4' }, svg);
  const tique = el('path', { class: 'g-guide' }, svg);
  const relie1 = el('path', { class: 'g-guide', 'stroke-dasharray': '2 3' }, svg);
  const relie2 = el('path', { class: 'g-guide', 'stroke-dasharray': '2 3' }, svg);
  const vecDelta = creerVecteur(svg, { classeTrait: 'g-tangente', classePointe: 'vec-pointe--accent' });
  const labDelta = el('text', { class: 'etl-valeur', 'text-anchor': 'middle' }, svg);

  const ligne = fig.querySelector('.js-ligne');
  const etat = fig.querySelector('.js-etat');
  const legDebut = fig.querySelector('.js-leg-debut');
  const legFin = fig.querySelector('.js-leg-fin');

  function dessinerChariot(groupe, label, solY) {
    groupe.replaceChildren();
    for (let k = 0; k < masse; k++) {
      el('rect', {
        class: 'mvt-caisse', x: FRONT - 46 * (k + 1) - 2 * k, y: solY - 26,
        width: 46, height: 26, rx: 3,
      }, groupe);
    }
    label.setAttribute('x', (FRONT - (46 * masse + 2 * (masse - 1)) / 2).toFixed(1));
    label.setAttribute('y', solY + 18);
    label.textContent = `m = ${masse} kg`;
  }

  function rendre() {
    const dv = DV0 / masse;
    const vAv = sens === 'avec' ? 1 : 4;
    const vAp = sens === 'avec' ? vAv + dv : vAv - dv;

    dessinerChariot(caissesAvant, labMasseAvant, 112);
    dessinerChariot(caissesApres, labMasseApres, 248);

    /* la poussée : flèche pointillée au-dessus du nez, sens au choix */
    if (sens === 'avec') vecPoussee.maj(196, 54, 272, 54);
    else vecPoussee.maj(272, 54, 196, 54);

    vecAvant.maj(178, 99, 178 + vAv * E, 99);
    labAvant.setAttribute('x', (178 + vAv * E + 12).toFixed(1));
    labAvant.setAttribute('y', 103);
    labAvant.textContent = `v = ${fmt(vAv, 1)} m/s`;

    vecApres.maj(178, 235, 178 + vAp * E, 235);
    labApres.setAttribute('x', (178 + Math.max(vAp, vAv) * E + 12).toFixed(1));
    labApres.setAttribute('y', 239);
    labApres.textContent = `v = ${fmt(vAp, 1)} m/s`;

    /* le fantôme de v⃗ avant, et Δv⃗ de sa pointe à celle de v⃗ après */
    const xa = 178 + vAv * E;
    const xb = 178 + vAp * E;
    fantome.setAttribute('d', `M178 235L${xa} 235`);
    tique.setAttribute('d', `M${xa} 229L${xa} 241`);
    relie1.setAttribute('d', `M${xa} 216L${xa} 230`);
    relie2.setAttribute('d', `M${xb} 216L${xb} 230`);
    vecDelta.maj(xa, 210, xb, 210);
    labDelta.setAttribute('x', ((xa + xb) / 2).toFixed(1));
    labDelta.setAttribute('y', 198);
    labDelta.textContent = `Δv = ${fmt(dv, 1)} m/s`;

    ligne.textContent =
      `même poussée, m = ${masse} kg : Δv = ${fmt(dv, 1)} m/s — ` +
      `la vitesse passe de ${fmt(vAv, 1)} à ${fmt(vAp, 1)} m/s`;

    if (etat) {
      etat.textContent = sens === 'avec'
        ? 'la poussée est dans le sens du mouvement — la vitesse augmente'
        : 'la poussée est contre le mouvement — la vitesse diminue';
      etat.className = `chip ${sens === 'avec' ? 'chip--good' : 'chip--bad'} js-etat`;
    }

    legDebut.hidden = touche;
    legFin.hidden = !(touche && massesVues.size >= 2);
  }

  function interaction() {
    touche = true;
    track('widget_interact', { widget: fig.dataset.nom || 'masse', chapitre });
  }

  for (const btn of fig.querySelectorAll('.js-sens button')) {
    btn.addEventListener('click', () => {
      sens = btn.dataset.sens;
      interaction();
      for (const b of fig.querySelectorAll('.js-sens button')) {
        b.setAttribute('aria-pressed', String(b === btn));
      }
      rendre();
    });
  }
  for (const btn of fig.querySelectorAll('.js-masse button')) {
    btn.addEventListener('click', () => {
      masse = parseInt(btn.dataset.masse, 10);
      massesVues.add(masse);
      interaction();
      for (const b of fig.querySelectorAll('.js-masse button')) {
        b.setAttribute('aria-pressed', String(b === btn));
      }
      rendre();
    });
  }

  fig.querySelector('.js-reset').addEventListener('click', () => {
    sens = 'avec';
    masse = 1;
    touche = false;
    massesVues.clear();
    massesVues.add(1);
    for (const b of fig.querySelectorAll('.js-sens button')) {
      b.setAttribute('aria-pressed', String(b.dataset.sens === 'avec'));
    }
    for (const b of fig.querySelectorAll('.js-masse button')) {
      b.setAttribute('aria-pressed', String(b.dataset.masse === '1'));
    }
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="mouvement-masse"]')) initMasse(fig);
