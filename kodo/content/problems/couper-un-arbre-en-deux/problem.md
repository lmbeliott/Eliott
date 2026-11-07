---
id: couper-un-arbre-en-deux
title: Couper un arbre en deux
chapter: n4-arbres
order: 1
tags: [graphes, parcours-en-largeur]
samples: 2
---

## Énoncé
On donne un arbre de `N` sommets, numérotés de `1` à `N`, enraciné au sommet `1`. Chaque sommet `v` porte un poids `P[v]`.

Supprimer une arête coupe l'arbre en deux parties. L'**écart** de la coupe est la valeur absolue de la différence entre les poids totaux des deux parties. Écris un programme qui calcule le plus petit écart possible, et le nombre d'arêtes dont la suppression donne cet écart.

## Entrée
- La première ligne contient un entier `N`.
- La deuxième ligne contient `N` entiers `P[1] … P[N]`.
- La troisième ligne contient `N - 1` entiers : le parent de chacun des sommets `2, 3, …, N`, dans cet ordre.

Un sommet peut avoir un numéro plus petit que son parent.

## Sortie
Deux entiers séparés par une espace : le plus petit écart, puis le nombre d'arêtes qui l'atteignent.

## Contraintes
- 2 ≤ N ≤ 12 000
- 1 ≤ P[v] ≤ 1 000

## Indices
1. Supprimer l'arête entre `v` et son parent sépare le **sous-arbre** de `v` (le sommet `v` et tous ses descendants) du reste de l'arbre. Si `S` est le poids total et `s` celui du sous-arbre, l'écart vaut `|S - 2s|`.
2. Le poids d'un sous-arbre est le poids de `v` plus les poids des sous-arbres de ses enfants. Il suffit de traiter chaque sommet **après** tous ses enfants.
3. Un parcours en largeur depuis la racine donne un ordre où chaque sommet vient après son parent. Lu à l'envers, cet ordre traite chaque sommet après ses enfants : ajoute alors `s[v]` à `s[parent[v]]`.

## Solution
Chaque arête relie un sommet `v ≠ 1` à son parent. La supprimer sépare le sous-arbre de `v` du reste : si `s[v]` est le poids du sous-arbre de `v` et `S` le poids total, les deux parties pèsent `s[v]` et `S - s[v]`, et l'écart vaut `|S - 2 × s[v]|`. Il suffit donc de connaître le poids de tous les sous-arbres.

On range d'abord les enfants de chaque sommet dans des listes. Un **parcours en largeur** depuis la racine produit une liste `ordre` où chaque sommet apparaît après son parent. On parcourt `ordre` à l'envers : quand on traite `v`, tous ses descendants, plus loin dans la liste, ont déjà été traités, et `s[v]` est complet. On l'ajoute alors à `s[parent[v]]`. Au départ, `s[v] = P[v]`.

Enfin, on calcule `|S - 2 × s[v]|` pour chaque `v` de `2` à `N`, en gardant le minimum et le nombre de fois où il est atteint.

Complexité : **O(N)**.

Pourquoi les approches naïves échouent :
- Pour chaque arête, recalculer le poids d'une des deux parties par un parcours coûte O(N) par arête, O(N²) en tout : environ 7 × 10⁷ visites de sommets, trop pour Python.
- Une fonction récursive qui calcule `s[v]` dépasse la limite de récursion de Python quand l'arbre est un long chemin (12 000 niveaux).

Pièges :
- Les numéros ne suivent pas la hiérarchie : un sommet peut avoir un numéro plus petit que son parent. Parcourir les sommets de `N` à `2` pour ajouter `s[v]` à son parent est donc faux ; il faut un vrai ordre de parcours.
- Plusieurs arêtes peuvent donner le même écart : un chemin de 7 sommets de poids `1` se coupe en `3 + 4` ou en `4 + 3`.
