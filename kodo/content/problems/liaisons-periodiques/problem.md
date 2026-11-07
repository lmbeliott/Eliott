---
id: liaisons-periodiques
title: Liaisons périodiques
chapter: n4-chemins
order: 5
tags: [graphes, dijkstra]
samples: 2
---

## Énoncé
Un réseau a `N` sommets et `M` liaisons à sens unique. La liaison `A B F P T` part du sommet `A` aux dates `F`, `F + P`, `F + 2P`, `F + 3P`, … et arrive au sommet `B` exactement `T` unités de temps après chacun de ses départs. On ne peut l'emprunter qu'à l'une de ses dates de départ.

On part du sommet `1` à la date `0`. On peut attendre aussi longtemps que l'on veut sur un sommet, et prendre un départ qui a lieu à la date même où l'on arrive. Écris un programme qui calcule la date d'arrivée au plus tôt au sommet `N`, ou qui affiche `-1` s'il est impossible de l'atteindre.

## Entrée
- La première ligne contient deux entiers `N` et `M`.
- Chacune des `M` lignes suivantes contient cinq entiers `A`, `B`, `F`, `P` et `T` : une liaison.

## Sortie
Un seul entier : la date d'arrivée au plus tôt au sommet `N`, ou `-1`.

## Contraintes
- 1 ≤ N ≤ 4 000
- 0 ≤ M ≤ 4 500
- 1 ≤ A, B ≤ N et A ≠ B
- 0 ≤ F ≤ 10⁶
- 1 ≤ P, T ≤ 10⁶

## Indices
1. Si l'on arrive au sommet `A` à la date `d`, le premier départ possible de la liaison est `F` si `d ≤ F`, et sinon le plus petit `F + kP` supérieur ou égal à `d`, avec `k = ⌈(d - F) / P⌉`.
2. Arriver plus tôt sur un sommet n'est jamais un désavantage : on peut toujours attendre. Le « coût » d'une liaison dépend de la date d'arrivée, mais partir plus tard ne fait jamais arriver plus tôt.
3. L'algorithme de Dijkstra marche donc tel quel, en remplaçant `d + longueur` par `départ(d) + T`.

## Solution
On applique l'**algorithme de Dijkstra** en calculant le coût de chaque liaison au moment où on l'utilise. On garde `arrivée[v]`, la meilleure date connue pour atteindre `v`, et un tas. Quand on retire le sommet `u`, arrivé à la date `d`, pour chaque liaison `u → v` :
- le premier départ est `F` si `d ≤ F`, sinon `F + ⌈(d - F) / P⌉ × P` ;
- on arrive en `v` à la date `départ + T`, que l'on compare à `arrivée[v]`.

Pourquoi Dijkstra reste juste : sa preuve n'utilise que deux propriétés. Prendre une liaison ne fait jamais remonter le temps (on arrive après la date `d`), et la fonction « date d'arrivée au bout de la liaison » est **croissante** en `d` : arriver plus tôt au départ ne fait jamais arriver plus tard au bout. Donc, quand un sommet sort du tas avec la date `d`, aucun autre chemin ne peut l'atteindre plus tôt. Ce serait faux si l'on pouvait, par exemple, prendre des liaisons qui arrivent plus tôt quand on part plus tard.

Complexité : **O(M log M)**.

Pourquoi les autres idées échouent :
- Simuler le temps unité par unité est hors de question : les dates dépassent le milliard.
- Chercher d'abord le chemin de durée de trajet minimale, puis ajouter les attentes, est faux : sur le premier exemple, le trajet `1 → 3 → 4` ne dure que `2`, mais il faut attendre la liaison `3 → 4` jusqu'à la date `8`. Le trajet `1 → 2 → 4`, plus long, arrive à la date `6`.
- Relâcher toutes les liaisons en boucle jusqu'à stabilité (Bellman-Ford) coûte O(N × M) quand les liaisons sont données dans le mauvais ordre : trop lent en Python.

Pièges :
- Le calcul du prochain départ : si `d ≤ F`, le départ est `F`, sans formule. Sinon, `⌈x / P⌉` s'écrit `(x + P - 1) // P` avec des entiers positifs. Un départ à la date exacte d'arrivée compte.
- Les dates peuvent dépasser 2³¹ : utilise des `long long` en C++, y compris pour `F`, `P` et `T` dans les calculs.
- Avec `N = 1`, la réponse est `0`.
