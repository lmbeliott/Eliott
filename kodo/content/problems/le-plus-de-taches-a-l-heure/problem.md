---
id: le-plus-de-taches-a-l-heure
title: Le plus de tâches à l'heure
chapter: p4-gloutons
order: 8
synthesis: true
tags: [glouton, tri]
samples: 2
---

## Énoncé
Un atelier reçoit N tâches. La tâche i dure pᵢ minutes et doit être **finie au plus tard** à l'instant dᵢ. L'atelier fait une tâche à la fois, sans pause, à partir de l'instant 0, et il peut refuser des tâches : une tâche refusée n'est pas faite du tout.

Afficher le plus grand nombre de tâches que l'atelier peut accepter, de façon à les finir toutes à l'heure.

## Entrée
La première ligne contient N. Chacune des N lignes suivantes contient deux entiers pᵢ et dᵢ.

## Sortie
Le plus grand nombre de tâches finies à l'heure.

## Contraintes
- 1 ≤ N ≤ 10 000
- 1 ≤ pᵢ ≤ 1 000
- 1 ≤ dᵢ ≤ 10⁷

## Indices
1. Si on a choisi les tâches à faire, dans quel ordre faut-il les faire pour qu'elles soient toutes à l'heure, si c'est possible ? (Penser au plus petit retard maximal.)
2. Parcourir les tâches par date limite croissante en les acceptant. Si la dernière acceptée finit en retard, il faut en abandonner une parmi celles qu'on a acceptées : laquelle libère le plus de temps ?
3. Abandonner la plus longue des tâches acceptées. Pour la trouver vite, une file de priorité (`heapq` en Python, `priority_queue` en C++).

## Solution
**Tester un ensemble de tâches.** D'après l'argument d'échange du cours (retard maximal), un ensemble de tâches peut être fini à l'heure si et seulement s'il l'est quand on fait ses tâches par date limite croissante.

**Le glouton.** On parcourt les tâches par date limite croissante, en gardant l'ensemble A des tâches acceptées et leur durée totale T. On ajoute la tâche courante : T augmente de pᵢ. Si T > dᵢ, la tâche courante, qui est la dernière dans l'ordre des dates limites, finit en retard ; on retire alors de A la tâche **la plus longue** (éventuellement la tâche courante elle-même), et T diminue d'autant. La réponse est le nombre de tâches de A à la fin.

**Pourquoi c'est optimal.** On montre par récurrence l'invariant : après les k premières tâches, A est faisable à l'heure, a le plus grand nombre de tâches possible parmi les k premières, et, parmi les ensembles faisables de cette taille, la plus petite durée totale. Si la tâche k + 1 tient (T + p ≤ d), A plus cette tâche est faisable et la taille maximale ne peut augmenter que de 1 : l'invariant reste vrai (aucun ensemble de même taille n'a une durée plus petite, sinon en lui retirant la tâche k + 1 on battrait A). Sinon, aucun ensemble faisable ne peut avoir une tâche de plus que A : il contiendrait la tâche k + 1 et un ensemble de |A| tâches parmi les k premières, de durée au moins T, donc finirait après T + p > d. La taille reste |A|, et retirer la tâche la plus longue de A plus la tâche k + 1 donne la plus petite durée possible pour cette taille. L'ensemble obtenu est faisable : sa durée est au plus T, qui tenait avant la date limite de toutes les tâches précédentes, et la tâche k + 1 a la date la plus tardive.

**Une file de priorité.** Pour retirer vite la plus longue tâche, on range les durées acceptées dans une **file de priorité**, qui donne et retire le maximum en O(log N). En Python, `heapq` donne le minimum : on y range les durées avec un signe moins. **Coût** : O(N log N). Une liste parcourue à chaque retrait coûterait O(N²).
