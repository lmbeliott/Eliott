---
id: remonter-vers-un-couple
title: Remonter vers un couple
chapter: p3-correction
order: 7
tags: [arithmétique, mathématiques]
samples: 2
---

## Énoncé
On part d'un couple d'entiers strictement positifs `(x, y)`. Un **coup** remplace ce couple par `(x + y, y)` ou par `(x, x + y)`. Par exemple, `(2, 3)` peut devenir `(5, 3)` ou `(2, 5)`.

Deux couples `(A, B)` et `(C, D)` sont donnés. Afficher le nombre de coups nécessaires pour passer de `(A, B)` à `(C, D)`, ou `-1` si c'est impossible. On peut montrer que ce nombre, quand il existe, ne dépend pas des coups choisis.

L'entrée contient `T` questions.

## Entrée
- La première ligne contient `T`.
- Les `T` lignes suivantes contiennent chacune quatre entiers `A`, `B`, `C` et `D`.

## Sortie
Pour chaque question, une ligne avec le nombre de coups, ou `-1`.

## Contraintes
- 1 ≤ T ≤ 1 000
- 1 ≤ A, B, C, D ≤ 10¹⁸

## Indices
1. En avançant, deux choix à chaque coup : trop de possibilités. En reculant depuis `(C, D)`, il n'y en a qu'une. Laquelle ?
2. Si `C > D`, le dernier coup était forcément `(C − D, D) → (C, D)`. Si `C = D`, aucun coup ne mène à `(C, D)`.
3. Reculer d'un coup à la fois est trop lent pour `(10¹⁸, 1)`. Comme pour l'algorithme d'Euclide, on fait d'un coup toutes les soustractions de `D`, en faisant attention à ne pas « sauter » par-dessus `(A, B)`.

## Solution
**Reculer.** Les deux nombres restent positifs. Si `C > D`, le coup qui a produit `(C, D)` ne peut être que `(C − D, D) → (C, D)`, car l'autre coup aurait donné un second nombre plus grand que le premier. De même si `D > C`. Si `C = D`, aucun coup ne produit `(C, D)`. Chaque couple a donc **au plus un prédécesseur**, et en reculant depuis `(C, D)` on suit un unique chemin. `(A, B)` mène à `(C, D)` exactement quand ce chemin passe par `(A, B)`, et le nombre de coups est alors la longueur du chemin entre les deux : il ne dépend d'aucun choix.

**Accélérer.** Supposons `C > D`. Tant que le premier nombre reste plus grand que `D`, on retire `D` : on recule de `q = (C − 1) // D` coups d'un seul calcul, et le premier nombre devient `C − q × D`, compris entre 1 et `D`. Pendant ces reculs, le second nombre vaut toujours `D`. Deux cas :
- si `D ≠ B`, aucun couple intermédiaire n'est `(A, B)` : on peut sauter tout le paquet ;
- si `D = B`, le chemin passe par `(A, B)` exactement quand `A ≤ C` et que `C − A` est un multiple de `D` ; le nombre de coups restants est alors `(C − A) / D`. Sinon, la réponse est `-1`, car ensuite le second nombre diminuera en dessous de `B`.

On s'arrête aussi avec `-1` si `C < A` ou `D < B` (les nombres ne font que diminuer en reculant), ou si `C = D` sans être en `(A, B)`.

**Terminaison et coût.** La somme `C + D` est un entier positif qui diminue strictement à chaque tour de boucle : la boucle s'arrête. Les quotients successifs sont ceux de l'algorithme d'Euclide appliqué à `(C, D)`, donc il y a moins de 120 tours environ pour des nombres inférieurs à 10¹⁸. Reculer coup par coup en demanderait jusqu'à 10¹⁸. Le nombre de coups peut atteindre 10¹⁸ : en C++, `long long`.
