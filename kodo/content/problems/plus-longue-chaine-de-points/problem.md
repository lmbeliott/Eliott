---
id: plus-longue-chaine-de-points
title: Plus longue chaîne de points
chapter: n4-dynamique
order: 4
tags: [programmation-dynamique, tri, dichotomie]
samples: 2
---

## Énoncé
On donne `N` points, chacun décrit par deux entiers `X` et `Y`. Une **chaîne** est une suite de points choisis parmi eux, dans l'ordre que l'on veut, où chaque point a **à la fois** un `X` strictement plus grand et un `Y` strictement plus grand que le point précédent.

Écris un programme qui calcule le nombre maximal de points d'une chaîne.

## Entrée
- La première ligne contient un entier `N`.
- Chacune des `N` lignes suivantes contient deux entiers `X` et `Y` : les coordonnées d'un point.

Plusieurs points peuvent avoir le même `X`, le même `Y`, ou les deux.

## Sortie
Un seul entier : le nombre maximal de points d'une chaîne.

## Contraintes
- 1 ≤ N ≤ 15 000
- 1 ≤ X, Y ≤ 10 000

## Indices
1. Si les points sont triés par `X` croissant, une chaîne est une sous-suite de la liste triée. Que doit-il se passer pour les `Y` le long de cette sous-suite ?
2. Il reste à trouver la plus longue sous-suite strictement croissante des `Y`. La version en O(N²) est trop lente en Python (en C++, elle passe encore à cette taille). Garde plutôt, pour chaque longueur `k`, la plus petite valeur possible du `Y` du dernier point d'une sous-suite de longueur `k`. Ce tableau est trié, et tu peux le mettre à jour par dichotomie.
3. Attention aux points de même `X` : ils ne peuvent pas se suivre dans une chaîne. Trie-les par `Y` **décroissant** à `X` égal : ainsi, deux d'entre eux ne peuvent jamais former une sous-suite strictement croissante.

## Solution
**Réduction à une dimension.** On trie les points par `X` croissant. Une chaîne, lue dans l'ordre, a des `X` strictement croissants : c'est donc une sous-suite de la liste triée, dont les `Y` sont strictement croissants. Le problème devient celui de la **plus longue sous-suite strictement croissante** (LIS) des `Y`.

**L'astuce des égalités.** Deux points de même `X` ne peuvent pas se suivre. Si on les trie par `Y` **décroissant** à `X` égal, leurs `Y` ne forment jamais une suite croissante, donc la LIS ne peut pas en prendre deux. Avec un tri croissant à `X` égal, la LIS pourrait enchaîner `(1500, 2)` puis `(1500, 5)`, ce qui est interdit.

**La LIS en O(N log N).** La programmation dynamique directe (« `lis[i]` = plus longue chaîne finissant par le point `i`, calculée à partir de tous les `j < i` ») coûte O(N²), soit environ 10⁸ comparaisons pour `N = 15 000` : trop lent en Python. En C++, cela passe encore à cette taille, mais la méthode en O(N log N) est celle à connaître : elle reste rapide pour des centaines de milliers de points. On maintient un tableau `fin`, où `fin[k]` est la plus petite valeur possible du `Y` du dernier point d'une sous-suite strictement croissante de longueur `k + 1`. Ce tableau est strictement croissant. Pour chaque valeur `y`, dans l'ordre :
- on cherche par dichotomie la première position `k` telle que `fin[k] ≥ y` ;
- si elle n'existe pas, `y` prolonge la plus longue sous-suite : on l'ajoute à la fin ;
- sinon, on remplace `fin[k]` par `y` : on obtient une sous-suite de longueur `k + 1` qui finit plus bas.

La réponse est la longueur finale de `fin`. Complexité : **O(N log N)** pour le tri et les `N` dichotomies.

Pièges :
- Pour une suite **strictement** croissante, on cherche le premier élément `≥ y` (`bisect_left` en Python, `lower_bound` en C++). Avec `> y` (`bisect_right`, `upper_bound`), on autoriserait deux `Y` égaux.
- Le tableau `fin` n'est pas une chaîne valide en lui-même : seule sa longueur a un sens.
