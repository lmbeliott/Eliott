---
id: arcs-sans-croisement
title: Arcs sans croisement
chapter: n4-dynamique-avancee
order: 2
tags: [programmation-dynamique]
samples: 2
---

## Énoncé
`N` points sont alignés et numérotés de `1` à `N` de gauche à droite. Le point `i` porte une lettre `C[i]` et une valeur entière `V[i]`, qui peut être négative.

Tu peux relier des paires de points **de même lettre** par des arcs tracés au-dessus de la ligne. Chaque point appartient à au plus un arc, et deux arcs ne doivent pas se croiser : si `i < j` et `k < l` sont reliés, on ne peut pas avoir `i < k < j < l`. En revanche, un arc peut passer au-dessus d'un autre (`i < k < l < j`).

Un arc entre les points `i` et `j` rapporte `V[i] × V[j]`. Écris un programme qui calcule le plus grand total possible. Ne tracer aucun arc est permis.

## Entrée
- La première ligne contient l'entier `N`.
- La deuxième ligne contient un mot de `N` lettres minuscules : la lettre de chaque point.
- La troisième ligne contient les `N` entiers `V[1]`, …, `V[N]`.

## Sortie
Un seul entier : le plus grand total.

## Contraintes
- 1 ≤ N ≤ 400
- −1 000 ≤ V[i] ≤ 1 000

## Indices
1. Si le point le plus à gauche est relié au point `k`, aucun arc ne peut relier l'intérieur de cet arc à l'extérieur. Les deux morceaux deviennent indépendants.
2. Calcule `f[l][r]`, le meilleur total en n'utilisant que les points de `l` à `r`. Soit `l` n'est relié à rien, soit il est relié à un point `k` de même lettre entre `l + 1` et `r`.
3. `f[l][r] = max(f[l+1][r], max sur k de V[l] × V[k] + f[l+1][k-1] + f[k+1][r])`. Calcule les `l` du plus grand au plus petit.

## Solution
**Découper le problème.** Regardons le point `l`, le plus à gauche de la plage `l..r`. Soit il n'est relié à rien, et il reste la plage `l+1..r`. Soit il est relié à un point `k` de même lettre. Comme les arcs ne se croisent pas, tout autre arc est alors soit entièrement **sous** l'arc `(l, k)` (dans `l+1..k-1`), soit entièrement **à droite** (dans `k+1..r`). Les deux plages sont indépendantes. D'où la récurrence sur les intervalles :

`f[l][r] = max( f[l+1][r], max sur k ∈ ]l, r], C[k] = C[l] de V[l] × V[k] + f[l+1][k-1] + f[k+1][r] )`

avec `f = 0` pour une plage vide. La réponse est `f[1][N]`.

**L'ordre de calcul.** `f[l][r]` utilise des plages qui commencent après `l`. On calcule donc les lignes `l` de `N` jusqu'à `1`. Il y a O(N²) plages, et chacune essaie O(N) valeurs de `k` : **O(N³)**, environ 10⁷ opérations élémentaires pour N = 400 dans le pire cas (une seule lettre).

En Python, pour aller vite, on inverse les boucles. Pour `l` et `k` fixés, la quantité `V[l] × V[k] + f[l+1][k-1]` ne dépend pas de `r`. On met donc à jour toute la ligne `f[l][r]`, pour `r ≥ k`, en une seule liste en compréhension.

Pourquoi les idées simples échouent : essayer tous les ensembles d'arcs sans croisement prend un temps exponentiel. Le glouton « relier d'abord la paire de plus grand produit » se trompe. Dans `abab` avec les valeurs `8 9 8 9`, il relie les deux `b` (81), ce qui ici est optimal, mais les tests contiennent des cas où un arc de grand produit en empêche deux autres qui rapportent plus à eux deux.

Pièges :
- Deux valeurs négatives donnent un produit positif : un arc entre elles peut être intéressant. Un arc de produit négatif n'est jamais utile, et la récurrence l'écarte toute seule grâce au cas « `l` n'est relié à rien ».
- La plage intérieure `l+1..k-1` est vide quand `k = l + 1`.
