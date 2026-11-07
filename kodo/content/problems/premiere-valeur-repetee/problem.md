---
id: premiere-valeur-repetee
title: Première valeur répétée
chapter: p2-dictionnaires
order: 2
tags: [dictionnaires]
samples: 2
---

## Énoncé
Une suite de `N` entiers est lue de gauche à droite. Trouver le premier moment où l'on lit une valeur déjà rencontrée plus tôt : afficher cette valeur et sa position.

Par exemple, dans `5 3 8 3 5 8`, la valeur `3` en position 4 est la première à avoir déjà été vue. Les positions sont numérotées à partir de 1.

## Entrée
La première ligne contient l'entier `N`. La deuxième ligne contient les `N` entiers, séparés par des espaces.

## Sortie
La valeur répétée et sa position, séparées par une espace. Si toutes les valeurs sont différentes, afficher `AUCUNE`.

## Contraintes
- 1 ≤ N ≤ 30 000
- 0 ≤ chaque entier ≤ 10⁹

## Indices
1. Il suffit de lire les valeurs dans l'ordre en se souvenant de celles déjà vues.
2. Un ensemble répond très vite à la question « cette valeur a-t-elle déjà été vue ? ». Tester l'appartenance **avant** d'ajouter la valeur.
3. Dès qu'une répétition est trouvée, on peut arrêter la boucle avec `break`.

## Solution
On parcourt la suite en gardant un **ensemble** `vues` des valeurs déjà lues. Pour chaque valeur `v`, en position `i` :

- si `v` est dans `vues`, c'est la première répétition : on affiche `v` et `i`, et on s'arrête ;
- sinon, on ajoute `v` à `vues` et on continue.

L'ordre des deux opérations compte : si on ajoute `v` avant de tester, chaque valeur semble répétée dès sa première apparition.

Il ne faut pas confondre avec « la première valeur qui sera répétée plus tard » : dans `4 1 2 1 4`, la réponse est `1 4`, car la lecture rencontre le second `1` (position 4) avant le second `4` (position 5).

Avec une liste à la place de l'ensemble, chaque test parcourt toutes les valeurs déjà vues : sur 30 000 valeurs distinctes, cela fait environ 450 millions de comparaisons.
