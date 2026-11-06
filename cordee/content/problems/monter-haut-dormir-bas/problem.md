---
id: monter-haut-dormir-bas
title: Monter haut, dormir bas
chapter: n1-boucles
order: 4
tags: [boucles, simulation]
samples: 2
---

## Énoncé
Pour s'habituer à l'altitude, les guides de Valcorde suivent une règle d'or : « monter haut, dormir bas ». Pendant l'ascension d'un sommet, la cordée de Malik monte de `A` mètres chaque jour. Le soir, si elle n'a pas encore atteint le sommet, elle redescend de `B` mètres pour dormir un peu plus bas. Le sommet se trouve `H` mètres au-dessus du point de départ.

Écris un programme qui affiche le numéro du jour où la cordée atteint le sommet : c'est le premier jour où, après sa montée de `A` mètres, elle se trouve à `H` mètres ou plus au-dessus du point de départ. Le premier jour de l'ascension est le jour 1.

## Entrée
Une seule ligne contenant trois entiers `A`, `B` et `H` séparés par des espaces : la montée de chaque jour, la descente de chaque soir et la hauteur du sommet, en mètres.

## Sortie
Un seul entier : le numéro du jour où la cordée atteint le sommet.

## Contraintes
- 1 ≤ A ≤ 1 000
- 0 ≤ B < A (la cordée progresse donc un peu chaque jour)
- 1 ≤ H ≤ 50 000

## Indices
1. Simule l'ascension jour après jour avec une boucle `while`. Garde deux variables : la hauteur actuelle de la cordée et le numéro du jour.
2. Le jour 1, la cordée monte de `A` mètres. Ensuite, tant qu'elle est en dessous de `H` : elle redescend de `B` mètres pour la nuit, on passe au jour suivant, et elle remonte de `A` mètres.
3. Le jour où elle atteint le sommet, la cordée ne redescend pas. C'est pour cela que diviser `H` par `A - B` ne donne pas la bonne réponse.

## Solution
On simule l'ascension. Au départ, on est au jour 1 et la cordée vient de monter : sa hauteur vaut `A`. Tant que cette hauteur est plus petite que `H`, le sommet n'est pas atteint : la cordée redescend de `B` pour la nuit, on passe au jour suivant, et elle remonte de `A`. Dès que la hauteur atteint ou dépasse `H`, la boucle s'arrête et on affiche le numéro du jour.

Prenons `A = 400`, `B = 300` et `H = 1000`. Chaque jour complet fait gagner 100 mètres, alors on pourrait croire qu'il faut 1 000 / 100 = 10 jours. Mais le matin du jour 7, la cordée est à 600 mètres ; en montant de 400 mètres, elle atteint 1 000 mètres et le sommet. La réponse est donc 7 : le dernier jour, la cordée ne redescend pas, et elle profite de toute sa montée.

L'autre piège est la condition d'arrivée : atteindre exactement `H` mètres suffit. La boucle continue donc tant que la hauteur est **strictement** plus petite que `H`.
