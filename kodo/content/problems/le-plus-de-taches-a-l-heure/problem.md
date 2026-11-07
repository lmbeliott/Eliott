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

**Pourquoi c'est optimal.** Numérotons les tâches par date limite croissante, et notons f_k(j) la plus petite durée totale d'un ensemble de j tâches choisies parmi les k premières et qu'on peut finir à l'heure (+∞ s'il n'y en a pas). On montre par récurrence l'invariant : après les k premières tâches, A se finit à l'heure, et pour tout j, f_k(j) est la somme des j plus petites durées de A (+∞ si j > |A|). En particulier, |A| est le plus grand nombre possible de tâches à l'heure.

Ajoutons la tâche k + 1, de durée p et de date limite d, la plus tardive jusqu'ici. Un ensemble de j tâches à l'heure parmi les k + 1 premières, soit ne la contient pas, soit est formé de j − 1 tâches à l'heure parmi les k premières, puis de cette tâche, faite en dernier, ce qui demande que leur durée plus p soit au plus d. Autant prendre ces j − 1 tâches de durée minimale : f_{k+1}(j) = min(f_k(j), f_k(j − 1) + p), le second terme ne comptant que si f_k(j − 1) + p ≤ d. Et le minimum de « somme des j plus petites durées de A » et « somme des j − 1 plus petites + p » est exactement la somme des j plus petites durées de A et de la tâche k + 1 réunies.

- Si T + p ≤ d, la condition est vraie pour tout j ≤ |A| + 1, car f_k(j − 1) ≤ T : l'invariant vaut pour A plus la tâche k + 1.
- Sinon, aucun ensemble de |A| + 1 tâches n'est possible, puisque f_k(|A|) + p = T + p > d. Pour j ≤ |A|, si la condition est fausse, f_k(j − 1) + p > d ≥ T ≥ f_k(j) (T ≤ d, car A est à l'heure et ses dates limites sont au plus d) : donc p dépasse la j-ième plus petite durée de A, le minimum vaut f_k(j), et c'est encore la somme des j plus petites durées réunies. Ces j plus petites durées n'utilisent jamais la plus longue : l'invariant vaut pour l'ensemble obtenu en retirant la tâche la plus longue. Cet ensemble se finit à l'heure : si la tâche retirée est la tâche k + 1, c'est A ; sinon, les autres tâches finissent plus tôt qu'avant, et la tâche k + 1 finit à T + p − (durée retirée) ≤ T ≤ d.

**Une file de priorité.** Pour retirer vite la plus longue tâche, on range les durées acceptées dans une **file de priorité**, qui donne et retire le maximum en O(log N). En Python, `heapq` donne le minimum : on y range les durées avec un signe moins. **Coût** : O(N log N). Une liste parcourue à chaque retrait coûterait O(N²).
