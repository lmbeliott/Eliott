---
id: desaccords-entre-deux-juges
title: Désaccords entre deux juges
chapter: p4-diviser-regner
order: 1
tags: [tri, mathématiques]
samples: 2
time_limit_ms: 500
---

## Énoncé
Deux juges notent les mêmes N candidats. On dit que les juges sont **en désaccord** sur deux candidats u et v si le premier juge donne une note strictement plus haute à u qu'à v, alors que le second donne une note strictement plus haute à v qu'à u (ou l'inverse). Si l'un des deux juges donne la même note à u et à v, ce n'est pas un désaccord.

Compter les paires de candidats sur lesquelles les deux juges sont en désaccord.

Les notes sont fabriquées par une formule, pour que l'entrée reste courte : x₁ = X, puis x_{k+1} = (x_k × B + C) mod M. Le candidat i reçoit la note x_{2i−1} du premier juge et la note x_{2i} du second.

Par exemple, avec N = 4, X = 2, B = 17, C = 21 et M = 22, la suite commence par 2, 11, 10, 15, 12, 5, 18, 19 : les quatre candidats ont les notes (2, 11), (10, 15), (12, 5) et (18, 19). Les juges sont en désaccord sur les candidats 1 et 3, et sur les candidats 2 et 3 : la réponse est 2.

## Entrée
Une seule ligne : les cinq entiers N, X, B, C et M.

## Sortie
Le nombre de paires de candidats sur lesquelles les juges sont en désaccord.

## Contraintes
- 2 ≤ N ≤ 100 000
- 1 ≤ M ≤ 10⁹
- 0 ≤ X, B, C < M

## Indices
1. Ranger les candidats par note du premier juge. Une paire est alors un désaccord si le candidat placé avant a une note **strictement plus grande** chez le second juge : c'est une inversion.
2. Les candidats qui ont la même note chez le premier juge ne doivent jamais compter : il suffit de les ranger entre eux par note croissante du second juge.
3. Les inversions se comptent en O(N log N) avec le tri fusion : au moment de la fusion, chaque élément pris dans la moitié droite forme une inversion avec chaque élément qui reste dans la moitié gauche.

## Solution
**Se ramener aux inversions.** On trie les candidats par couple (note du premier juge, note du second), dans l'ordre croissant, et on note r₁, r₂, …, r_N les notes du second juge dans cet ordre. Prenons deux candidats aux positions p < q. Si leurs notes du premier juge diffèrent, celle de p est la plus petite, et il y a désaccord si et seulement si r_p > r_q. Si elles sont égales, il n'y a jamais désaccord, et en effet r_p ≤ r_q grâce au second critère du tri. La réponse est donc le nombre d'**inversions** de la suite r : les paires p < q avec r_p > r_q.

**Compter les inversions.** On adapte le tri fusion : on trie et on compte les inversions de chaque moitié, puis on fusionne les deux moitiés triées. Quand on prend un élément dans la moitié droite parce qu'il est strictement plus petit que l'élément courant de gauche, il est plus petit que tous les éléments qui restent à gauche : il forme une inversion avec chacun d'eux, et on ajoute leur nombre. À égalité, on prend l'élément de gauche d'abord, pour ne pas compter les égalités. Chaque inversion entre les deux moitiés est comptée exactement une fois, au moment où son élément droit est placé.

**Coût.** Le tri des couples et le tri fusion coûtent O(N log N), environ 2 millions d'opérations. Comparer toutes les paires demanderait N(N − 1)/2 ≈ 5 × 10⁹ comparaisons. La réponse peut dépasser 2³¹ : `long long` en C++.
