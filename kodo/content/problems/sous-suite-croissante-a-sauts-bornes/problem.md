---
id: sous-suite-croissante-a-sauts-bornes
title: Sous-suite croissante à sauts bornés
chapter: n4-defis
order: 6
tags: [programmation-dynamique, arbre-de-segments, tri]
samples: 2
---

## Énoncé
On donne deux tableaux `A[1..N]` et `W[1..N]`, et un entier `D`. Tu dois choisir des indices `i₁ < i₂ < … < iₖ` (avec `k ≥ 1`) qui respectent deux règles :
- les valeurs sont strictement croissantes : `A[i₁] < A[i₂] < … < A[iₖ]` ;
- deux indices choisis consécutifs sont proches : `iₜ₊₁ - iₜ ≤ D` pour tout `t`.

Le **poids** du choix est `W[i₁] + W[i₂] + … + W[iₖ]`. Écris un programme qui affiche le plus grand poids possible.

## Entrée
- La première ligne contient les entiers `N` et `D`.
- La deuxième ligne contient les `N` entiers `A[1]`, …, `A[N]`.
- La troisième ligne contient les `N` entiers `W[1]`, …, `W[N]`.

## Sortie
Un seul entier : le plus grand poids possible.

## Contraintes
- 1 ≤ D ≤ N ≤ 12 000
- 0 ≤ A[i] ≤ 1 000 000
- 1 ≤ W[i] ≤ 1 000

## Indices
1. Note `f[i]` le plus grand poids d'un choix qui se termine par l'indice `i`. Alors `f[i] = W[i] + max(f[j])`, sur les `j` de `[i - D, i - 1]` tels que `A[j] < A[i]` (ou `+ 0` s'il n'y en a pas). Le calcul direct coûte O(N × D), trop si `D` est grand.
2. Il faut un maximum sur les `j` qui vérifient **deux** conditions : une sur l'indice (la fenêtre), une sur la valeur. Gère la fenêtre en ajoutant et en retirant des éléments au fur et à mesure que `i` avance, et la valeur avec une structure indexée par la valeur.
3. Trie les indices par `(A, indice)` pour donner à chacun un rang différent. Un arbre de segments (maximum) sur les rangs contient `f[j]` pour les `j` de la fenêtre et `0` ailleurs. Avant de traiter `i`, remets à `0` la case de `i - D - 1`. Les valeurs strictement plus petites que `A[i]` occupent un début de l'ordre trié : un maximum de préfixe.

## Solution
**La récurrence.** Soit `f[i]` le plus grand poids d'un choix dont le dernier indice est `i`. L'avant-dernier indice `j`, s'il existe, vérifie `i - D ≤ j < i` et `A[j] < A[i]`. Donc `f[i] = W[i] + max(0, max f[j])` sur ces `j`, et la réponse est le maximum des `f[i]`.

**Deux conditions à la fois.** La condition sur l'indice se règle par un **balayage** : on traite `i` dans l'ordre et on garde dans une structure uniquement les `j` de la fenêtre `[i - D, i - 1]`. Quand `i` avance d'une case, l'indice `i - D - 1` sort de la fenêtre et on le retire. La condition sur la valeur se règle par un **arbre de segments** indexé par la valeur.

**Les rangs.** On trie les indices par `(A[j], j)` et on note `rang[j]` la place de `j` dans cet ordre. Chaque indice a sa propre case, même si des valeurs sont égales : retirer `j` ne touche aucun autre indice. Les indices de valeur strictement plus petite que `A[i]` ont exactement les rangs `0` à `p - 1`, où `p` est la première place de valeur `≥ A[i]` dans l'ordre trié (une recherche dichotomique).

**L'algorithme.** L'arbre de segments garde, pour chaque rang, `f[j]` si `j` est dans la fenêtre, `0` sinon. Pour chaque `i` : remettre à `0` la case de `i - D - 1`, lire le maximum des rangs `0` à `p - 1`, calculer `f[i]`, puis l'écrire à la case `rang[i]`. Comme tous les poids sont positifs, `0` joue bien le rôle de « rien avant ».

Complexité : **O(N log N)**.

Pourquoi les idées simples échouent :
- Parcourir toute la fenêtre pour chaque `i` coûte O(N × D), soit environ 7 × 10⁷ opérations quand `D` est proche de `N`.
- Un arbre de Fenwick pour le maximum ne sait pas **retirer** un élément de la fenêtre (le maximum ne se « soustrait » pas). L'arbre de segments, lui, accepte qu'on remplace une case par `0`.
- Un maximum glissant (file monotone) sur la fenêtre ignore la condition sur les valeurs, et la plus longue sous-suite croissante n'est pas forcément la plus lourde.

Pièges :
- La croissance est **stricte** : deux valeurs égales ne se suivent jamais. Avec des rangs triés par `(A, indice)`, il faut s'arrêter avant la **première** valeur égale à `A[i]`, pas après la dernière.
- La fenêtre contient `i - D` : c'est `i - D - 1` qu'on retire avant de traiter `i`.
