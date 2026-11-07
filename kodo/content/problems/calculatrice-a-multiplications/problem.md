---
id: calculatrice-a-multiplications
title: Calculatrice à multiplications
chapter: p4-synthese
order: 10
synthesis: true
tags: [graphes, dijkstra, mathématiques, glouton]
samples: 2
---

## Énoncé
Une calculatrice affiche `0`. Les touches `+ 1` et `− 1` coûtent chacune `D`. Il y a aussi `K` touches de multiplication : la touche `i` multiplie le nombre affiché par `M_i` et coûte `C_i`. Afficher le coût minimal pour faire apparaître l'entier `N`.

Par exemple, avec `D = 1` et les touches `× 2` et `× 3` de coût 1 chacune, on obtient 11 par `+ 1`, `× 2`, `× 2`, `× 3`, `− 1` (1, 2, 4, 12, 11) : coût 5.

Chaque test contient `T` cas indépendants.

## Entrée
- La première ligne contient `T`.
- Chacune des `T` lignes suivantes décrit un cas : `N`, `D`, `K`, puis les `K` couples `M_i C_i`.

## Sortie
`T` lignes : le coût minimal pour chaque cas.

## Contraintes
- 1 ≤ T ≤ 20
- 1 ≤ N ≤ 10¹²
- 1 ≤ D ≤ 10⁶
- 1 ≤ K ≤ 4
- 2 ≤ M_i ≤ 10 et 1 ≤ C_i ≤ 10⁶

## Indices
1. Les valeurs vont jusqu'à 10¹² : un plus court chemin sur tous les entiers de `0` à `N` est hors de portée. Raisonner à l'envers : quelle est la **dernière** multiplication, et à quel nombre `v` est-elle appliquée ?
2. Après la dernière multiplication `× M`, on n'utilise plus que `+ 1` et `− 1` : le coût final est `D × |N − M v|`. Montrer qu'il suffit d'essayer `v = ⌊N / M⌋` et `v = ⌈N / M⌉`.
3. Graphe à l'envers : depuis `n`, des arcs vers `0` (coût `n × D`), vers `⌊n / M⌋` et vers `⌈n / M⌉` (coût `C` plus les ajustements). Les sommets atteints sont peu nombreux : Dijkstra depuis `N` avec un dictionnaire, jusqu'à `0`.

## Solution
Soit `f(n)` le coût minimal pour afficher `n`.

**Une récurrence.** Dans une suite optimale de touches qui mène à `n`, ou bien il n'y a aucune multiplication, et le coût vaut au moins `n × D` (il faut au moins `n` fois `+ 1`) ; ou bien on considère la dernière multiplication, `× M` de coût `C`, appliquée à un nombre `v` : avant, on a affiché `v` (coût au moins `f(v)`), et après, seulement des `± 1` (coût au moins `D × |n − M v|`). Donc `f(n) = min(n × D, min sur M et v de f(v) + C + D × |n − M v|)`.

**Seuls deux `v` comptent** (argument d'échange). Si `v < ⌊n / M⌋`, remplacer `v` par `v + 1` coûte au plus `D` de plus avant la multiplication (une touche `+ 1`), mais `M (v + 1)` est encore au plus `n` : on économise `M × D ≥ 2D` d'ajustements après. Le total ne fait que baisser. De même, si `v > ⌈n / M⌉`, on remplace `v` par `v − 1`. On peut donc se limiter à `v = ⌊n / M⌋` et `v = ⌈n / M⌉`.

**Un plus court chemin.** On voit chaque nombre `n` comme un sommet, avec des arcs vers `0` (coût `n × D`), vers `⌊n / M⌋` (coût `C + D (n − M ⌊n / M⌋)`) et, si `M` ne divise pas `n`, vers `⌈n / M⌉` (coût `C + D (M ⌈n / M⌉ − n)`). Ces valeurs sont strictement plus petites que `n` dès que `n ≥ 2` (pour `n = 1`, l'arc vers `⌈1 / M⌉ = 1` est inutile). `f(N)` est la longueur d'un plus court chemin de `N` à `0` : coûts positifs, donc **Dijkstra**, avec un dictionnaire pour les distances puisque les sommets sont de grands nombres.

**Peu de sommets.** On a `⌊⌊n / a⌋ / b⌋ = ⌊n / (a b)⌋`, et un arrondi vers le haut ou vers le bas de `n / (a b)` pour les autres combinaisons : les sommets atteints sont de la forme `⌊N / P⌋` ou `⌈N / P⌉`, où `P` est un produit des `M_i`. Avec des `M_i ≤ 10`, il y a au plus quelques dizaines de milliers de tels sommets, et beaucoup moins en pratique car Dijkstra s'arrête dès que `0` sort du tas.

**Complexité.** O(S × K × log S) par cas, où `S` est le nombre de sommets atteints. Un plus court chemin sur tous les entiers jusqu'à `N` demanderait 10¹² sommets.

**Pièges.** `N × D` atteint 10¹⁸ : `long long` en C++. Oublier `⌈n / M⌉` donne des réponses trop grandes (pour 11 avec `× 3`, il faut passer par 4 puis faire `− 1`). Plusieurs touches peuvent avoir le même multiplicateur avec des coûts différents.
