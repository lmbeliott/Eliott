---
id: miroirs-de-l-observatoire
title: Les miroirs de l'observatoire
chapter: n2-grilles
order: 4
tags: [grilles, simulation]
samples: 2
---

## Énoncé
À l'observatoire de Valcorde, Sofia règle un rayon laser qui sert à aligner les télescopes. La salle des instruments est un quadrillage de `H` lignes et `W` colonnes. Chaque case est vide (`.`) ou contient un miroir posé en diagonale (`/` ou `\`).

Le rayon entre dans la salle par la case en haut à gauche, en venant de la gauche : il se déplace donc vers la droite. Il avance d'une case à la fois dans sa direction. Quand il arrive sur une case avec un miroir, il change de direction comme ceci, puis repart vers la case suivante :
- `/` : un rayon qui allait vers la droite part vers le haut, vers le haut part vers la droite, vers la gauche part vers le bas, vers le bas part vers la gauche ;
- `\` : un rayon qui allait vers la droite part vers le bas, vers le bas part vers la droite, vers la gauche part vers le haut, vers le haut part vers la gauche.

Les cases vides ne changent pas la direction du rayon. Il finit toujours par sortir de la salle.

Écris un programme qui affiche le nombre de cases différentes éclairées par le rayon, c'est-à-dire traversées au moins une fois (les cases des miroirs comptent aussi).

## Entrée
- La première ligne contient deux entiers `H` et `W`.
- Les `H` lignes suivantes contiennent chacune `W` caractères parmi `.`, `/` et `\` : la salle, vue de dessus.

## Sortie
Un seul entier : le nombre de cases différentes éclairées.

## Contraintes
- 1 ≤ H ≤ 50
- 1 ≤ W ≤ 50

## Indices
1. Garde la position du rayon (ligne, colonne) et sa direction. Une façon pratique de noter la direction est un couple `(dl, dc)` : ce qu'on ajoute à la ligne et à la colonne à chaque pas. Vers la droite, c'est `(0, 1)` ; vers le haut, `(-1, 0)`.
2. Simule le trajet avec une boucle « tant que le rayon est dans la salle » : marque la case, change de direction si c'est un miroir, puis avance d'une case.
3. Le rayon peut passer plusieurs fois par la même case (dans le deuxième exemple, il repasse par la troisième case de la première ligne). Utilise une grille de booléens pour ne compter chaque case qu'une fois.

## Solution
On simule le rayon pas à pas. Sa position est `(l, c)`, au départ `(0, 0)`, et sa direction est un couple `(dl, dc)`, au départ `(0, 1)` (vers la droite). Tant que la position est dans la salle :
1. si la case n'est pas encore marquée, on la marque et on augmente le compteur ;
2. si la case contient un miroir, on change de direction ;
3. on avance : `l += dl` et `c += dc`.

Pour changer de direction, on peut écrire quatre `if`, un par direction possible. Il existe aussi un raccourci : avec `/`, la nouvelle direction est `(-dc, -dl)`, et avec `\`, c'est `(dc, dl)`. Vérifie-le : avec `\`, la droite `(0, 1)` devient `(1, 0)`, c'est-à-dire le bas.

Les pièges :
- la toute première case peut contenir un miroir : il faut l'appliquer avant de faire le premier pas (avec `/` sur la première case, le rayon ressort aussitôt par le haut, et une seule case est éclairée) ;
- compter les pas au lieu des cases différentes : le rayon peut croiser son propre chemin, ou revenir sur un miroir par un autre côté ;
- en Python, `"\\"` est la façon d'écrire le caractère `\` : la barre oblique inversée seule sert à écrire des caractères spéciaux (comme `"\n"`). C'est pareil en C++ avec `'\\'` ;
- en changeant de direction, ne pas écraser `dl` avant de s'en servir pour calculer `dc` : en Python, `dl, dc = dc, dl` fait l'échange d'un coup ; en C++, on passe par une variable temporaire.

Pourquoi le rayon finit-il toujours par sortir ? Si l'on connaît la case et la direction du rayon à un instant, on peut retrouver d'où il venait juste avant. Un rayon qui tournerait en rond pour toujours n'aurait donc jamais pu entrer dans sa boucle depuis l'extérieur de la salle.
