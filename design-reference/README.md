# design-reference/ — copie du handoff Claude Design (READ-ONLY)

Copie exacte des exports du projet Claude Design « Nabla », commitée pour que
les sessions futures gardent la spec (le handoff n'est attaché qu'à la session
d'origine). **Source de vérité pour le look, le layout, les deux thèmes, les
design tokens et la copie française.**

Règles (voir CLAUDE.md) :

- **Ne jamais servir, shipper ou lier ces fichiers.** Ils contiennent la
  machinerie Claude Design (`x-dc`, `sc-if`, `DCLogic`, `support.js`,
  placeholders `{{ … }}`) qui doit être entièrement retirée lors de la
  conversion en pages de production.
- Ne pas modifier ces fichiers. Si Victor envoie un handoff mis à jour,
  remplacer le dossier entier et re-dériver `assets/css/tokens.css`.

Contenu :

| Fichier | Rôle |
|---|---|
| `Nabla - Accueil.dc.html` | Page d'accueil (version courante, thème dark + light via DCLogic) |
| `Nabla - La dérivation.dc.html` | Page chapitre dérivation (version courante, les deux thèmes) |
| `support.js`, `image-slot.js` | Runtime Claude Design — machinerie, pas du design |
| `v1 (thème clair)/…` | Première itération (thème clair uniquement), gardée pour historique |

Le fichier `.thumbnail` du projet (vignette binaire générée) n'a pas été copié.

Les palettes des deux thèmes, les épaisseurs de traits SVG par thème et la
logique du toggle de thème sont définies dans le bloc `DCLogic` en bas de
chaque page courante — c'est de là que `assets/css/tokens.css` est dérivé.
