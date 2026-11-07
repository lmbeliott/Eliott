---
id: portions-d-amplitude-au-plus-d
title: Portions d'amplitude au plus D
chapter: p3-synthese
order: 7
tags: [deux-pointeurs, listes]
samples: 2
---

## Énoncé
Une suite de N entiers a₀, a₁, …, a_{N−1} est fabriquée par une formule, pour que l'entrée reste courte : a₀ = X, puis a_{i+1} = (aᵢ × B + C) mod M.

L'**amplitude** d'une portion (une suite d'éléments consécutifs aᵢ, …, aⱼ, avec i ≤ j) est la différence entre son plus grand et son plus petit élément. Compter les portions d'amplitude au plus D.

Par exemple, la suite 3, 1, 2 a six portions ; avec D = 1, celles qui conviennent sont [3], [1], [2] et [1, 2] : la réponse est 4.

## Entrée
La première ligne contient N et D. La deuxième ligne contient X, B, C et M.

## Sortie
Le nombre de portions d'amplitude au plus D.

## Contraintes
- 1 ≤ N ≤ 100 000
- 0 ≤ D ≤ 10⁶
- 1 ≤ M ≤ 10⁶ et 0 ≤ X, B, C < M

## Indices
1. Si une portion a une amplitude au plus D, toutes les portions qu'elle contient aussi. Pour chaque fin j, les débuts possibles forment donc un intervalle [g, j], et g ne recule jamais quand j avance.
2. Il reste à connaître rapidement le maximum et le minimum de la fenêtre [g, j] pendant que g et j avancent. Recalculer à chaque fois coûte O(N) par fenêtre : trop lent.
3. Garder une file à double entrée (deque) d'indices dont les valeurs sont décroissantes : son premier élément est la position du maximum de la fenêtre. Un indice qui arrive retire de la fin de la file tous ceux dont la valeur est plus petite : ils ne pourront plus jamais être le maximum. Faire de même pour le minimum.

## Solution
**Deux pointeurs.** L'amplitude d'une portion ne peut que diminuer quand on la raccourcit. Pour chaque fin j, notons g(j) le plus petit début tel que [g(j), j] a une amplitude au plus D ; toutes les portions [i, j] avec g(j) ≤ i ≤ j conviennent, soit j − g(j) + 1 portions, et aucune autre. De plus g(j + 1) ≥ g(j). On fait donc avancer j de 0 à N − 1, et, à chaque étape, on avance g tant que l'amplitude de [g, j] dépasse D. La réponse est la somme des j − g + 1.

**Maximum et minimum de la fenêtre.** On garde une deque `dmax` d'indices de la fenêtre, de valeurs strictement décroissantes, qui contient en tête la position du maximum. Quand j arrive, on retire de la fin de `dmax` les indices de valeur ≤ a_j : ils sont plus anciens et pas plus grands que a_j, donc a_j les remplace comme maximum tant qu'il est dans la fenêtre. Puis on ajoute j à la fin. Quand g avance au-delà de l'indice de tête, on retire la tête. **Invariant** : `dmax` contient, dans l'ordre, les indices k de la fenêtre tels que a_k est plus grand que toutes les valeurs situées après lui dans la fenêtre ; le premier est donc le maximum. Une deque `dmin` symétrique donne le minimum.

**Coût amorti.** Chaque indice entre une fois dans chaque deque et en sort au plus une fois, et g comme j avancent au plus N fois : malgré les boucles imbriquées, le total est O(N). Examiner toutes les portions coûterait O(N²), soit 5 × 10⁹ pour N = 100 000.

La réponse peut atteindre N(N + 1)/2 ≈ 5 × 10⁹ : `long long` en C++.
