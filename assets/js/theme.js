/* Nabla — theme.js
   Toggle de thème. Le thème initial est résolu avant le premier rendu par le
   snippet inline dans <head> (localStorage 'nabla-theme' → prefers-color-scheme
   → dark) ; ici on ne gère que le bouton, la persistance et l'événement. */

import { track } from './analytics.js';

const LIBELLES = { dark: '☀ clair', light: '☾ sombre' }; // ce vers quoi on bascule

function themeCourant() {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

function majBouton(bouton) {
  bouton.textContent = LIBELLES[themeCourant()];
}

for (const bouton of document.querySelectorAll('.js-toggle-theme')) {
  majBouton(bouton);
  bouton.addEventListener('click', () => {
    const vers = themeCourant() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = vers;
    try { localStorage.setItem('nabla-theme', vers); } catch (e) { /* navigation privée */ }
    majBouton(bouton);
    track('theme_toggle', { to: vers }, 1000);
  });
}
