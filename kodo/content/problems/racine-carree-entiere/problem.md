---
id: racine-carree-entiere
title: Racine carrée entière
chapter: p2-nombres
order: 8
synthesis: true
tags: [arithmétique, mathématiques, boucles]
samples: 2
---

## Énoncé
Pour chacun des `Q` entiers `N` donnés, afficher sa **racine carrée entière** `R`, c'est-à-dire le plus grand entier tel que `R × R ≤ N`, puis l'écart `N − R × R`.

Par exemple, pour `N = 30`, on a 5 × 5 = 25 ≤ 30 < 36 = 6 × 6 : on affiche `5 5`.

Attention : les flottants sont approchés. Pour les grands `N`, la racine calculée par `N ** 0.5` ou `sqrt(N)` puis convertie en entier peut être fausse d'une unité, et les tests contiennent de tels cas.

## Entrée
La première ligne contient l'entier `Q`. Chacune des `Q` lignes suivantes contient un entier `N`.

## Sortie
`Q` lignes : pour chaque `N`, dans l'ordre, les entiers `R` et `N − R × R` séparés par une espace.

## Contraintes
- 1 ≤ Q ≤ 1 000
- 0 ≤ N ≤ 10¹⁸

## Indices
1. `N ** 0.5` en Python, ou `sqrt(N)` en C++, donne une valeur approchée de la racine. Pour les grands `N`, elle peut être fausse d'une unité une fois convertie en entier : par exemple pour `N = 999 999 999 999 999 999`.
2. Partir de cette valeur approchée `R`, puis la corriger avec des entiers, qui sont exacts.
3. Tant que `R × R > N`, diminuer `R`. Puis, tant que `(R + 1) × (R + 1) ≤ N`, augmenter `R`. À la fin, `R × R ≤ N < (R + 1) × (R + 1)`.

## Solution
Essayer tous les entiers `R` à partir de 0 est trop lent : la racine de 10¹⁸ vaut 10⁹. On utilise donc la racine flottante comme point de départ : `R = int(N ** 0.5)`.

Cette valeur est presque juste, mais pas toujours. Un flottant ne garde qu'environ 16 chiffres significatifs, et `N = 10¹⁸ − 1` est converti en exactement 10¹⁸ : sa racine flottante vaut 10⁹, alors que la bonne réponse est 999 999 999, puisque (10⁹)² = 10¹⁸ dépasse `N`.

On corrige donc `R` avec des calculs entiers, exacts :
- tant que `R × R > N`, on diminue `R` de 1 ;
- tant que `(R + 1) × (R + 1) ≤ N`, on augmente `R` de 1.

À la sortie des deux boucles, les deux conditions sont fausses : `R × R ≤ N < (R + 1) × (R + 1)`, ce qui est exactement la définition de la racine carrée entière. L'erreur de départ ne dépasse jamais une ou deux unités, donc chaque boucle ne fait que très peu de tours.

En C++, `R` vaut au plus environ 10⁹ et `(R + 1) × (R + 1)` environ 10¹⁸ : tout tient dans un `long long`.
