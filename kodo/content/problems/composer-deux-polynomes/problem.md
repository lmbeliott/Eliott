---
id: composer-deux-polynomes
title: Composer deux polynômes
chapter: p2-fonctions
order: 8
synthesis: true
tags: [fonctions, listes, mathématiques]
samples: 2
---

## Énoncé
Un polynôme de degré `n` s'écrit `P(x) = p₀ + p₁x + p₂x² + … + pₙxⁿ`. On le représente par la liste de ses coefficients `p₀, p₁, …, pₙ`, en commençant par le terme constant.

Étant donnés deux polynômes `P` et `Q`, calculer les coefficients du polynôme **composé** `P(Q(x))`, obtenu en remplaçant `x` par `Q(x)` dans `P`.

Par exemple, avec `P(x) = 1 + x²` et `Q(x) = 1 + x` : `P(Q(x)) = 1 + (1 + x)² = 2 + 2x + x²`.

## Entrée
- La première ligne contient le degré `n` de `P`, puis ses `n + 1` coefficients `p₀ p₁ … pₙ`.
- La deuxième ligne contient le degré `m` de `Q`, puis ses `m + 1` coefficients `q₀ q₁ … qₘ`.

## Sortie
Une seule ligne : les `n × m + 1` coefficients de `P(Q(x))`, du terme constant au terme de plus haut degré, séparés par des espaces.

## Contraintes
- 0 ≤ n ≤ 5 et 0 ≤ m ≤ 5
- Tous les coefficients sont des entiers compris entre -9 et 9.
- `pₙ ≠ 0` et `qₘ ≠ 0`.

## Indices
1. Écrire d'abord deux fonctions sur les listes de coefficients : `somme(a, b)` et `produit(a, b)`. Dans le produit, le coefficient `a[i]` multiplié par `b[j]` contribue au terme de degré `i + j`.
2. Pour composer, utiliser la forme de Horner : `P(y) = p₀ + y × (p₁ + y × (p₂ + … + y × pₙ))`. On part de `[pₙ]`, et pour `i` allant de `n - 1` à 0, on multiplie par `Q` puis on ajoute `[pᵢ]`.
3. Les coefficients du résultat peuvent dépasser 2³¹ : en C++, utiliser `long long`.

## Solution
On découpe le problème en trois fonctions, chacune facile à vérifier seule.

- `somme(a, b)` renvoie une nouvelle liste de longueur égale à la plus grande des deux longueurs : le coefficient de degré `k` est `a[k] + b[k]`, en prenant 0 quand une liste est trop courte.
- `produit(a, b)` renvoie une liste de `len(a) + len(b) - 1` zéros, puis, pour chaque couple `(i, j)`, ajoute `a[i] × b[j]` à la case `i + j`. C'est exactement la distributivité : `(a₀ + a₁x)(b₀ + b₁x) = a₀b₀ + (a₀b₁ + a₁b₀)x + a₁b₁x²`.
- `composer(p, q)` applique la **méthode de Horner** : `P(y) = p₀ + y(p₁ + y(p₂ + … + y pₙ))`. On part de `r = [pₙ]`, puis, pour `i` de `n - 1` jusqu'à 0, `r = somme(produit(r, q), [pᵢ])`. À la fin, `r` contient `P(Q(x))`.

Le degré du résultat est exactement `n × m`, car son coefficient de plus haut degré vaut `pₙ × qₘⁿ`, qui n'est pas nul. Les listes calculées ont donc la bonne longueur, et il suffit d'afficher `r`.

Les fonctions renvoient de nouvelles listes et ne modifient pas leurs arguments : on peut réutiliser `q` à chaque tour sans risque. En C++, on passe les tableaux en `const vector<long long> &` pour éviter les copies, et on renvoie un `vector<long long>`.

Ordre de grandeur : la somme des valeurs absolues des coefficients est au plus 54 pour chaque polynôme, donc celle du résultat est au plus 54 × 54⁵ ≈ 2,5 × 10¹⁰. Cela dépasse la limite d'un `int` (environ 2,1 × 10⁹), mais tient largement dans un `long long`.
