---
id: plus-petit-ecart-entre-deux-listes
title: Plus petit écart entre deux listes
chapter: p3-tableaux-avances
order: 3
tags: [listes]
samples: 2
---

## Énoncé
Deux listes d'entiers `A` et `B` sont données, chacune rangée dans l'ordre croissant au sens large. Trouver le plus petit écart `|A[i] − B[j]|` entre une valeur de `A` et une valeur de `B`.

## Entrée
- La première ligne contient `N`, la deuxième les `N` entiers de `A`.
- La troisième ligne contient `M`, la quatrième les `M` entiers de `B`.

## Sortie
Le plus petit écart.

## Contraintes
- 1 ≤ N, M ≤ 10 000
- Les valeurs sont comprises entre 0 et 10⁶.

## Indices
1. Essayer tous les couples ferait jusqu'à 10⁸ calculs : trop lent. Les listes sont triées, il faut s'en servir.
2. Avancer dans les deux listes en même temps, comme pour une fusion, avec un indice `i` dans `A` et un indice `j` dans `B`.
3. Si `A[i] < B[j]`, toutes les valeurs restantes de `B` sont au moins égales à `B[j]` : `A[i]` ne peut pas faire mieux qu'avec `B[j]`. On peut l'oublier et avancer `i`.

## Solution
On parcourt les deux listes comme pour une fusion, avec `i` dans `A` et `j` dans `B`, tous deux à 0 au départ. À chaque étape, on compare `|A[i] − B[j]|` au meilleur écart connu, puis on avance l'indice de la plus petite des deux valeurs (`i` si `A[i] < B[j]`, sinon `j`). On s'arrête quand l'une des listes est épuisée.

**Pourquoi c'est juste.** Supposons `A[i] < B[j]`. Toutes les valeurs `B[j']` avec `j' ≥ j` vérifient `B[j'] ≥ B[j] > A[i]`, donc `|A[i] − B[j']| = B[j'] − A[i] ≥ B[j] − A[i]`. Le meilleur partenaire de `A[i]` parmi les valeurs restantes de `B` est donc `B[j]`, et ce couple vient d'être examiné : on peut abandonner `A[i]` sans rien perdre. Le cas `A[i] ≥ B[j]` est symétrique. Ainsi, à chaque instant, tout couple non examiné qui contient une valeur abandonnée est au moins aussi mauvais qu'un couple déjà examiné. Quand une liste est épuisée, toutes ses valeurs ont été abandonnées, et le meilleur écart connu est le plus petit de tous.

**Coût.** Chaque étape avance un indice : au plus `N + M` étapes, contre `N × M` couples pour l'essai de tous les couples, jusqu'à 10⁸. Le piège : avancer l'indice de la plus **grande** valeur, ce qui peut faire manquer le bon couple.
