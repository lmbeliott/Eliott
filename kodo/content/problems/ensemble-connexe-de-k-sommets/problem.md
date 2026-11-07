---
id: ensemble-connexe-de-k-sommets
title: Ensemble connexe de K sommets
chapter: n4-dynamique-avancee
order: 5
tags: [programmation-dynamique, graphes]
samples: 2
---

## Énoncé
On donne un arbre de `N` sommets numérotés de `1` à `N`. Le sommet `i` a un poids `W[i]`, qui peut être négatif. Un ensemble de sommets est **connexe** si on peut aller de n'importe quel sommet de l'ensemble à n'importe quel autre en n'empruntant que des sommets de l'ensemble.

Écris un programme qui choisit un ensemble connexe d'**exactement** `K` sommets dont la somme des poids est la plus grande possible, et qui affiche cette somme.

## Entrée
- La première ligne contient les entiers `N` et `K`.
- La deuxième ligne contient les `N` entiers `W[1]`, …, `W[N]`.
- La troisième ligne contient `N - 1` entiers `P[2]`, …, `P[N]` : pour chaque sommet `i ≥ 2`, une arête relie `i` à `P[i]`, avec `P[i] < i`. Cette ligne est vide si `N = 1`.

## Sortie
Un seul entier : la plus grande somme des poids d'un ensemble connexe de `K` sommets.

## Contraintes
- 1 ≤ K ≤ N ≤ 10 000
- K ≤ 150
- −1 000 ≤ W[i] ≤ 1 000
- 1 ≤ P[i] < i

## Indices
1. Enracine l'arbre en `1`. Un ensemble connexe a un unique sommet `v` plus proche de la racine que tous les autres : son « sommet le plus haut ». Calcule, pour chaque `v` et chaque taille `j ≤ K`, le meilleur ensemble connexe de `j` sommets dont `v` est le sommet le plus haut.
2. Pour obtenir ces valeurs, on ajoute les enfants de `v` un par un. Avec un enfant `c`, soit on ne prend rien sous `c`, soit on prend un ensemble de `b` sommets dont `c` est le plus haut : c'est un sac à dos où chaque enfant est un groupe d'objets.
3. Ne garde jamais de taille au-delà de `K`, et ne fais varier `a` et `b` que jusqu'aux tailles réellement atteintes (taille du morceau déjà fusionné, taille du sous-arbre de `c`). Le total est alors O(N × K), et non O(N × K²).

## Solution
On enracine l'arbre en `1`. Dans un ensemble connexe, un seul sommet est plus proche de la racine que tous les autres : on l'appelle son sommet le plus haut `v`. L'ensemble contient alors `v`, et, sous chaque enfant `c` de `v`, soit rien, soit un ensemble connexe dont `c` est le sommet le plus haut.

**L'état.** `f[v][j]` est la plus grande somme d'un ensemble connexe de `j` sommets (`1 ≤ j ≤ K`) dont `v` est le sommet le plus haut. Au départ `f[v][1] = W[v]`. On ajoute les enfants un par un : avec l'enfant `c`, la nouvelle valeur pour `a + b` sommets est le maximum de `f[v][a] + f[c][b]`, et on garde aussi l'ancienne valeur (rien sous `c`). La réponse est le maximum des `f[v][K]` sur tous les `v`.

Comme `P[i] < i`, parcourir `v` de `N` à `1` termine chaque sommet avant son parent : on fusionne `f[v]` dans `f[P[v]]` sans récursion.

**Pourquoi c'est rapide.** Si on borne `a` et `b` par `K` **et** par les tailles déjà atteintes (le tableau de `v` n'a que `min(K, taille fusionnée)` cases), le coût total est O(N × K). L'idée : une fusion entre deux morceaux de tailles `s` et `t` coûte `min(s, K) × min(t, K)`. Tant que les deux morceaux sont petits, ce coût se répartit sur les paires de sommets fusionnées, chacune comptée une fois. Dès qu'un morceau dépasse `K`, chaque sommet de l'autre morceau paie au plus `K`. Avec `N = 10 000` et `K = 150`, cela fait au plus quelques millions d'opérations.

Pourquoi les idées simples échouent :
- Faire varier `a` et `b` de `1` à `K` à chaque fusion coûte O(N × K²), soit plus de 10⁸ opérations.
- Fusionner sans limiter les tailles à `K` coûte O(N²) : sur un chemin de 10 000 sommets, environ 5 × 10⁷ opérations, beaucoup trop pour Python.
- Partir du sommet le plus lourd et ajouter à chaque étape le voisin le plus lourd est faux : il faut parfois traverser un sommet négatif pour atteindre de gros poids. Dans le premier exemple, ce glouton prend `3`, `6`, puis `1`, pour un total de `5`, alors que `{1, 2, 3}` donne `7`.

Pièges :
- Les poids négatifs interdisent de prendre « le mieux possible avec au plus `K` sommets » : il en faut exactement `K`.
- La réponse peut être négative : initialise le maximum à moins l'infini, pas à `0`.
