---
id: monter-et-glisser
title: Monter et glisser
chapter: n1-boucles
order: 4
tags: [boucles, simulation]
samples: 2
---

## Énoncé
Un escargot grimpe le long d'un mur haut de `H` centimètres. Chaque jour, il monte de `A` centimètres ; chaque nuit, s'il n'est pas encore en haut, il glisse et redescend de `B` centimètres.

Écris un programme qui affiche le numéro du jour où l'escargot arrive en haut du mur : c'est le premier jour où, après sa montée de `A` centimètres, il se trouve à `H` centimètres ou plus au-dessus du sol. Il part du sol, et le premier jour est le jour 1.

## Entrée
Une seule ligne contenant trois entiers `A`, `B` et `H` séparés par des espaces : la montée de chaque jour, la descente de chaque nuit et la hauteur du mur, en centimètres.

## Sortie
Un seul entier : le numéro du jour où l'escargot arrive en haut du mur.

## Contraintes
- 1 ≤ A ≤ 1 000
- 0 ≤ B < A (l'escargot progresse donc un peu chaque jour)
- 1 ≤ H ≤ 50 000

## Indices
1. Simule la montée jour après jour avec une boucle `while`. Garde deux variables : la hauteur actuelle de l'escargot et le numéro du jour.
2. Le jour 1, l'escargot monte de `A` centimètres. Ensuite, tant qu'il est en dessous de `H` : il redescend de `B` centimètres pendant la nuit, on passe au jour suivant, et il remonte de `A` centimètres.
3. Le jour où il arrive en haut, l'escargot ne redescend pas. C'est pour cela que diviser `H` par `A - B` ne donne pas la bonne réponse.

## Solution
On simule la montée. Au départ, on est au jour 1 et l'escargot vient de monter : sa hauteur vaut `A`. Tant que cette hauteur est plus petite que `H`, il n'est pas arrivé : il redescend de `B` pendant la nuit, on passe au jour suivant, et il remonte de `A`. Dès que la hauteur atteint ou dépasse `H`, la boucle s'arrête et on affiche le numéro du jour.

Prenons `A = 400`, `B = 300` et `H = 1000`. Chaque jour complet fait gagner 100 centimètres, alors on pourrait croire qu'il faut 1 000 / 100 = 10 jours. Mais le matin du jour 7, l'escargot est à 600 centimètres ; en montant de 400 centimètres, il atteint 1 000 centimètres, le haut du mur. La réponse est donc 7 : le dernier jour, l'escargot ne redescend pas, et il profite de toute sa montée.

L'autre piège est la condition d'arrivée : atteindre exactement `H` centimètres suffit. La boucle continue donc tant que la hauteur est **strictement** plus petite que `H`.
