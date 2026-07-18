/* Nabla — accueil.js
   Comportement de l'accueil : filtre de matière (les sections de chapitres
   portent data-niveau/data-matiere) et recherche chapitres + notions.
   La recherche est un combobox clavier (flèches, Entrée, Échap) qui pointe
   vers les pages — elle ignore le filtre courant. Index : recherche-data.js.
   Sans JS, la page reste complète : tout est dans le HTML, rien n'est requis. */

import { track } from './analytics.js';
import { CHAPITRES } from './recherche-data.js';

/* --- Filtre de matière ---------------------------------------------------- */

const rangees = Array.from(document.querySelectorAll('.rangee-chapitres[data-matiere]'));
const boutonsMatiere = Array.from(document.querySelectorAll('.filtres button[data-matiere]'));

let matiere = 'tout';
try { matiere = localStorage.getItem('nabla-matiere') || 'tout'; } catch (e) { /* navigation privée */ }
if (!boutonsMatiere.some((b) => b.dataset.matiere === matiere)) matiere = 'tout';

function appliquerFiltre() {
  for (const b of boutonsMatiere) {
    b.setAttribute('aria-pressed', String(b.dataset.matiere === matiere));
  }
  for (const s of rangees) {
    s.hidden = matiere !== 'tout' && s.dataset.matiere !== matiere;
  }
}

for (const b of boutonsMatiere) {
  b.addEventListener('click', () => {
    matiere = b.dataset.matiere;
    try { localStorage.setItem('nabla-matiere', matiere); } catch (e) { /* navigation privée */ }
    appliquerFiltre();
  });
}
appliquerFiltre();

/* --- Recherche ------------------------------------------------------------ */

const zone = document.querySelector('.js-recherche');
const champ = zone && zone.querySelector('.recherche-input');
const panneau = zone && zone.querySelector('.recherche-resultats');

if (champ && panneau) {

  /* Normalisation : accents, œ, apostrophes, symboles maths courants —
     « derivee », « stoechiometrique » ou « mv2 » doivent matcher. */
  const normaliser = (s) => s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/[’′]/g, "'")
    .replace(/²/g, '2')
    .replace(/³/g, '3')
    .replace(/½/g, '1/2')
    .replace(/[−–—]/g, '-');

  /* Index précalculé : un « haystack » normalisé par chapitre et par section.
     Celui d'une section n'inclut PAS le titre du chapitre, sinon chercher le
     nom d'un chapitre ferait remonter ses cinq sections d'un coup. */
  const index = CHAPITRES.map((c) => ({
    c,
    h: normaliser(`${c.titre} ${c.mots} ${c.niveau} ${c.matiere}`),
    sections: c.sections.map((s) => ({ s, h: normaliser(`${s.titre} ${s.mots}`) })),
  }));

  const MAX_CHAPITRES = 4;
  const MAX_NOTIONS = 6;
  let options = [];   // liens affichés, dans l'ordre
  let actif = -1;     // option surlignée au clavier

  function chercher(q) {
    const tokens = normaliser(q).split(/[\s,;:!?()«»"]+/).filter((t) => t.length >= 2);
    if (!tokens.length) return null;
    const chapitres = [];
    const notions = [];
    for (const e of index) {
      if (tokens.every((t) => e.h.includes(t))) chapitres.push(e.c);
      for (const es of e.sections) {
        if (tokens.every((t) => es.h.includes(t))) notions.push({ c: e.c, s: es.s });
      }
    }
    return { chapitres: chapitres.slice(0, MAX_CHAPITRES), notions: notions.slice(0, MAX_NOTIONS) };
  }

  function el(tag, classe, texte) {
    const n = document.createElement(tag);
    if (classe) n.className = classe;
    if (texte) n.textContent = texte;
    return n;
  }

  function fermer() {
    panneau.hidden = true;
    panneau.textContent = '';
    champ.setAttribute('aria-expanded', 'false');
    champ.removeAttribute('aria-activedescendant');
    options = [];
    actif = -1;
  }

  function ajouterOption(href, titre, sous) {
    const a = el('a', 'resultat');
    a.href = href;
    a.id = `recherche-opt-${options.length}`;
    a.setAttribute('role', 'option');
    a.appendChild(el('div', 'resultat-titre', titre));
    a.appendChild(el('div', 'resultat-sous', sous));
    panneau.appendChild(a);
    options.push(a);
  }

  function rendre(q) {
    const r = chercher(q);
    if (!r) { fermer(); return; }
    panneau.textContent = '';
    options = [];
    actif = -1;

    if (r.chapitres.length) {
      panneau.appendChild(el('div', 'resultat-groupe', 'Chapitres'));
      for (const c of r.chapitres) {
        ajouterOption(c.url, c.titre, `${c.niveau} · ${c.matiere}`);
      }
    }
    if (r.notions.length) {
      panneau.appendChild(el('div', 'resultat-groupe', 'Notions'));
      for (const { c, s } of r.notions) {
        ajouterOption(`${c.url}#${s.id}`, s.titre, `${c.titre} · ${c.niveau}`);
      }
    }
    if (!options.length) {
      panneau.appendChild(el('div', 'recherche-vide',
        `Aucun résultat pour « ${q.trim()} ». Essaie un autre mot du cours (« tangente », « réactif limitant »…).`));
    }

    panneau.hidden = false;
    champ.setAttribute('aria-expanded', 'true');
    track('recherche', { resultats: options.length ? 'avec' : 'aucun' });
  }

  function surligner(i) {
    if (actif >= 0) options[actif].classList.remove('actif');
    actif = i;
    if (actif >= 0) {
      options[actif].classList.add('actif');
      champ.setAttribute('aria-activedescendant', options[actif].id);
      options[actif].scrollIntoView({ block: 'nearest' });
    } else {
      champ.removeAttribute('aria-activedescendant');
    }
  }

  champ.addEventListener('input', () => rendre(champ.value));

  champ.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      if (panneau.hidden && champ.value) rendre(champ.value);
      if (!options.length) return;
      ev.preventDefault();
      const pas = ev.key === 'ArrowDown' ? 1 : -1;
      surligner((actif + pas + options.length) % options.length);
    } else if (ev.key === 'Enter') {
      const cible = actif >= 0 ? options[actif] : options[0];
      if (cible) { ev.preventDefault(); window.location.href = cible.href; }
    } else if (ev.key === 'Escape') {
      fermer();
    }
  });

  champ.addEventListener('focus', () => {
    if (champ.value && panneau.hidden) rendre(champ.value);
  });

  /* Fermer au clic/toucher hors de la zone de recherche. */
  document.addEventListener('pointerdown', (ev) => {
    if (!zone.contains(ev.target)) fermer();
  });
}
