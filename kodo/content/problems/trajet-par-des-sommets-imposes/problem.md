---
id: trajet-par-des-sommets-imposes
title: Trajet par des sommets imposés
chapter: p4-synthese
order: 5
tags: [graphes, dijkstra, backtracking]
samples: 2
---

## Énoncé
Un graphe non orienté a `N` sommets et `M` arêtes ; chaque arête a une longueur. `K` sommets sont **imposés**. Afficher la longueur minimale d'un trajet qui part du sommet `1`, passe par tous les sommets imposés, dans l'ordre que l'on veut, et se termine au sommet `N`, ou `-1` si un tel trajet n'existe pas.

Un trajet peut repasser plusieurs fois par un même sommet ou une même arête.

## Entrée
- La première ligne contient `N`, `M` et `K`.
- La deuxième ligne contient les `K` sommets imposés, tous différents (elle est vide si `K = 0`).
- Chacune des `M` lignes suivantes contient trois entiers `A`, `B` et `L` : une arête de longueur `L` relie `A` et `B`.

## Sortie
Un seul entier : la longueur minimale, ou `-1`.

## Contraintes
- 1 ≤ N ≤ 10 000
- 0 ≤ M ≤ 6 000
- 0 ≤ K ≤ 8
- 1 ≤ A, B ≤ N
- 1 ≤ L ≤ 10⁶

## Indices
1. Une fois l'ordre de visite des sommets imposés fixé, le meilleur trajet enchaîne des plus courts chemins entre deux sommets consécutifs de cet ordre.
2. Il n'y a que `8! = 40 320` ordres possibles. Mais lancer des Dijkstra pour chaque ordre serait trop long : quelles distances sont réellement utiles ?
3. Seules servent les distances depuis le sommet `1` et depuis chaque sommet imposé : `K + 1` exécutions de Dijkstra. Ensuite, chaque ordre se teste en `K + 1` additions.

## Solution
**Découper le trajet.** Fixons l'ordre `s₁, s₂, …, s_K` dans lequel le trajet rencontre pour la première fois les sommets imposés. Entre deux étapes consécutives, le trajet est libre : le meilleur choix est un plus court chemin. La longueur minimale pour cet ordre est donc `d(1, s₁) + d(s₁, s₂) + … + d(s_K, N)`, et la réponse est le minimum sur tous les ordres. Un sommet imposé traversé « par hasard » plus tôt ne gêne pas : l'ordre correspondant est aussi essayé.

**Les distances utiles.** On lance **Dijkstra** depuis le sommet `1` et depuis chacun des `K` sommets imposés. Le graphe étant non orienté, `d(s_K, N)` se lit dans le tableau des distances depuis `s_K`.

**Tous les ordres.** On énumère les `K!` permutations (avec `itertools.permutations` en Python, `next_permutation` en C++, ou un retour sur trace), et pour chacune on additionne `K + 1` distances. Si l'une est infinie, l'ordre est impossible.

**Complexité.** `(K + 1)` Dijkstra en O((N + M) log N), plus `K! × (K + 1) ≈ 360 000` additions. Relancer Dijkstra pour chaque segment de chaque ordre coûterait 40 320 × 9 exécutions.

**Pièges.** Le sommet `1` ou le sommet `N` peuvent être imposés : la formule reste juste (une distance nulle). Pour `K = 0`, la réponse est `d(1, N)`. Les longueurs se cumulent au-delà de 2³¹ : `long long`, et un « infini » qui ne déborde pas quand on additionne neuf termes : avec 10¹⁸, la somme atteint 9 × 10¹⁸, juste sous la limite des `long long` (environ 9,2 × 10¹⁸) ; avec un terme de plus, il faudrait tester chaque terme avant d'additionner.
