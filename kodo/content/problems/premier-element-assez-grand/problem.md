---
id: premier-element-assez-grand
title: Premier élément assez grand
chapter: n4-structures
order: 2
tags: [arbre-de-segments]
samples: 2
---

## Énoncé
On donne un tableau de `N` entiers `a[1], a[2], …, a[N]`. Écris un programme qui traite, dans l'ordre, une suite d'opérations de deux types :
- `M i v` (modification) : la valeur `a[i]` devient `v` ;
- `Q i h` (question) : affiche le plus petit indice `j ≥ i` tel que `a[j] ≥ h`, ou `-1` s'il n'y en a aucun.

## Entrée
- La première ligne contient deux entiers `N` et `K` : la taille du tableau et le nombre d'opérations.
- La deuxième ligne contient `N` entiers : les valeurs initiales de `a[1]` à `a[N]`.
- Chacune des `K` lignes suivantes contient une opération : la lettre `M` ou `Q`, puis deux entiers.

## Sortie
Pour chaque opération `Q`, dans l'ordre, une ligne contenant la réponse.

## Contraintes
- 1 ≤ N ≤ 10 000
- 1 ≤ K ≤ 10 000
- 1 ≤ i ≤ N
- toutes les valeurs (initiales, `v` et `h`) sont entre `1` et `5 000`

## Indices
1. Parcourir les éléments un par un depuis `i` coûte O(N) par question : 10⁸ opérations au total dans le pire cas.
2. Un arbre de segments où chaque nœud stocke le **maximum** de son intervalle permet de savoir en une comparaison si un intervalle entier contient un élément assez grand… et donc de l'éliminer d'un coup s'il n'en contient pas.
3. Pour trouver le premier bon élément : depuis la feuille `i`, passe de bloc en bloc vers la droite (en remontant) tant que le maximum du bloc est trop petit ; dans le premier bloc qui convient, redescends en choisissant à chaque fois le fils gauche s'il convient, sinon le droit.

## Solution
On construit un **arbre de segments** du tableau où chaque nœud contient le maximum de son intervalle. Avec une taille `T` puissance de deux, les feuilles sont aux indices `T` à `2T - 1`, et le nœud `k` a pour fils `2k` et `2k + 1`. Les feuilles en trop valent `0`, une valeur plus petite que toute valeur de `h`.

**Modification** `M i v` : on change la feuille de l'indice `i`, puis on remonte vers la racine en recalculant chaque maximum. O(log N).

**Question** `Q i h` : on cherche le premier indice `j ≥ i` tel que `a[j] ≥ h`, en deux temps.
1. *Remontée.* On part de la feuille `k` de l'indice `i`. Tant que `max[k] < h`, le bloc de `k` ne contient aucune réponse : on passe au bloc situé juste à sa droite. Pour cela, tant que `k` est un fils droit (impair), on remonte à son parent, puis on prend `k + 1`. Si l'on remonte au-dessus de la racine (`k = 0`), il n'y a aucune réponse : `-1`.
2. *Descente.* Le bloc trouvé contient la réponse. Tant que `k` n'est pas une feuille, on va dans le fils gauche si son maximum est `≥ h` (la réponse la plus à gauche y est), sinon dans le fils droit.

Les blocs visités pendant la remontée sont consécutifs, couvrent tout ce qui est à droite de `i` dans l'ordre, et leur taille ne fait que croître : il y en a O(log N). La descente coûte aussi O(log N). Complexité totale : **O(N + K log N)**.

Pourquoi les autres idées échouent :
- Le parcours direct coûte O(N) par question, soit 10⁸ opérations quand toutes les réponses sont lointaines ou `-1`.
- Une recherche dichotomique sur `j`, avec une requête de maximum sur `[i, j]` à chaque étape, fonctionne mais coûte O(log² N) par question : c'est correct en C++, mais lent en Python.
- Précalculer les réponses ne marche pas : chaque modification peut toutes les changer.

Pièges :
- La comparaison est large : un élément égal à `h` convient, y compris `a[i]` lui-même.
- Après une modification, il faut recalculer **tous** les ancêtres de la feuille, même si la valeur a diminué.
