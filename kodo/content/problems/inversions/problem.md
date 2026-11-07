---
id: inversions
title: Inversions
chapter: n4-structures
order: 1
tags: [fenwick, tri]
samples: 2
---

## Énoncé
On donne une permutation `P[1], P[2], …, P[N]` des entiers de `1` à `N`. Une **inversion** est une paire de positions `i < j` telle que `P[i] > P[j]`.

Écris un programme qui compte les inversions de la permutation.

## Entrée
- La première ligne contient un entier `N`.
- La deuxième ligne contient `N` entiers distincts entre `1` et `N` : `P[1]`, `P[2]`, …, `P[N]`.

## Sortie
Un seul entier : le nombre d'inversions.

## Contraintes
- 1 ≤ N ≤ 20 000

## Indices
1. Comparer toutes les paires fait environ 2 × 10⁸ comparaisons : beaucoup trop en Python.
2. Parcours la permutation de gauche à droite. Quand tu arrives sur la valeur `d`, combien d'inversions forme-t-elle avec les valeurs déjà vues ? Il suffit de savoir combien de valeurs déjà vues sont **plus grandes** que `d`.
3. Tiens à jour un arbre de Fenwick sur les valeurs : la case `d` vaut `1` si la valeur `d` a déjà été vue. Une somme de préfixe donne alors le nombre de valeurs déjà vues inférieures à `d`.

## Solution
On parcourt la permutation de gauche à droite. Quand on arrive sur la valeur `d` en `i`-ème position (en comptant à partir de `0`), `i` valeurs ont déjà été vues. Celles qui sont plus grandes que `d` sont placées avant elle : chacune forme une inversion avec `d`. En ajoutant ce nombre pour chaque position, chaque inversion est comptée exactement une fois (au moment où l'on voit le second élément de la paire).

Il faut donc répondre vite à la question « combien de valeurs déjà vues sont inférieures à `d` ? » tout en ajoutant les valeurs une par une. C'est exactement ce que fait un **arbre de Fenwick** sur le tableau `vu[1..N]` (`vu[d] = 1` si `d` a déjà été vue) :
- `somme(d)` donne le nombre de valeurs déjà vues entre `1` et `d`, en O(log N) ;
- `ajoute(d)` met `vu[d]` à `1`, en O(log N).

Le nombre d'inversions que `d` forme avec les valeurs placées avant elle vaut `i - somme(d)`. Complexité totale : **O(N log N)**.

L'algorithme naïf compare toutes les paires : N(N - 1)/2, soit 2 × 10⁸ comparaisons pour `N = 20 000`. C'est trop lent en Python ; en C++, cela passe encore à cette taille, mais plus du tout pour `N` autour de 10⁵ et au-delà, où l'arbre de Fenwick devient indispensable.

Un tri fusion modifié permet également de compter les inversions en O(N log N).

Pièges :
- Le résultat peut atteindre N(N - 1)/2 ≈ 2 × 10⁸ : il tient dans un `int` de 32 bits (limite ≈ 2,1 × 10⁹) ; un `long long` reste une bonne habitude pour les comptages de paires.
- L'arbre de Fenwick s'indexe à partir de `1` : avec l'indice `0`, `i & -i` vaut `0` et la boucle de `ajoute` ne s'arrête jamais.
