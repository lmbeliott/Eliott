---
id: trajet-d-un-ascenseur
title: Trajet d'un ascenseur
chapter: p1-conditions
order: 8
synthesis: true
tags: [conditions, boucles, simulation]
samples: 2
---

## Énoncé
Un ascenseur part de l'étage `0` et se rend successivement à `N` étages, dans l'ordre donné. Les étages négatifs sont des sous-sols. Afficher :
- le nombre total d'étages parcourus ;
- l'étage le plus haut atteint (en comptant l'étage de départ) ;
- le nombre de fois où l'ascenseur change de sens, c'est-à-dire se met à descendre après avoir monté, ou à monter après être descendu.

Une demande pour l'étage où se trouve déjà l'ascenseur ne le fait pas bouger.

## Entrée
- La première ligne contient l'entier `N`.
- Les `N` lignes suivantes contiennent chacune un entier : un étage demandé.

## Sortie
Trois lignes : le nombre d'étages parcourus, l'étage le plus haut atteint, puis le nombre de changements de sens.

## Contraintes
- 1 ≤ N ≤ 1 000
- −100 ≤ chaque étage ≤ 100

## Indices
1. Pour aller de l'étage `e` à l'étage `c`, l'ascenseur parcourt `c − e` étages s'il monte, `e − c` s'il descend.
2. Pour les changements de sens, il faut se souvenir du sens du **dernier** déplacement (monter, descendre, ou aucun déplacement encore). On peut le coder par un entier : `1` pour monter, `-1` pour descendre, `0` au départ.
3. Un déplacement compte comme un changement de sens seulement s'il y a eu un déplacement avant, et dans l'autre sens. Une demande pour l'étage actuel ne modifie pas le dernier sens.

## Solution
On simule le trajet en gardant quatre variables : l'étage actuel `etage` (qui part de 0), la distance totale, l'étage le plus haut (qui part de 0, l'étage de départ), et `dernier`, le sens du dernier déplacement (`0` tant que l'ascenseur n'a pas bougé).

Pour chaque étage demandé `c` :
- si `c > etage`, l'ascenseur monte : on ajoute `c − etage` à la distance, et le sens est `1` ;
- si `c < etage`, il descend : on ajoute `etage − c`, et le sens est `-1` ;
- sinon, il ne bouge pas, et le sens vaut `0`.

Si l'ascenseur a bougé (sens différent de 0), on regarde `dernier` : s'il n'est pas nul et qu'il est différent du sens actuel, c'est un changement de sens. Puis `dernier` prend la valeur du sens actuel. Enfin, `etage` devient `c`, et on met à jour l'étage le plus haut.

Les pièges : une demande pour l'étage actuel ne doit ni compter comme un déplacement ni effacer le dernier sens (monter, rester, puis descendre fait bien un changement de sens) ; le premier déplacement n'est pas un changement de sens ; et l'étage le plus haut vaut au moins 0, même si l'ascenseur ne fait que descendre.
