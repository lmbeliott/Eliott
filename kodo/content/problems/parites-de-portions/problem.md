---
id: parites-de-portions
title: Parités de portions
chapter: p4-union-find
order: 5
tags: [union-find, mathématiques, dictionnaires]
samples: 2
---

## Énoncé
Une suite secrète de `N` bits `b₁, b₂, …, b_N` (chacun vaut `0` ou `1`) est cachée. On reçoit `Q` affirmations, chacune de la forme « la somme `b_L + b_(L+1) + … + b_R` est paire » ou « … est impaire ».

Afficher le plus grand entier `k` tel que les `k` premières affirmations puissent être vraies toutes en même temps, pour une même suite de bits.

## Entrée
- La première ligne contient `N` et `Q`.
- Chacune des `Q` lignes suivantes contient trois entiers `L`, `R` et `P` : la somme de `b_L` à `b_R` a la parité `P` (`0` pour paire, `1` pour impaire).

## Sortie
Un seul entier `k`, entre `0` et `Q`.

## Contraintes
- 1 ≤ N ≤ 10⁹
- 1 ≤ Q ≤ 8 000
- 1 ≤ L ≤ R ≤ N
- P vaut `0` ou `1`

## Indices
1. Avec les sommes préfixes `S_x = b₁ + … + b_x` (et `S₀ = 0`), une affirmation porte sur deux nombres seulement : `S_R − S_(L−1)` a la parité `P`. Seules les parités des `S_x` comptent.
2. « `S_i` et `S_j` ont la même parité » ou « des parités différentes » : ces relations se combinent comme dans un Union-Find, mais avec deux sortes de liens.
3. Créer deux sommets par préfixe `x` : « `S_x` est pair » et « `S_x` est impair ». « Même parité » relie pair–pair et impair–impair ; « parités différentes » relie pair–impair et impair–pair. Une affirmation est contradictoire si ses deux conclusions possibles sont déjà dans des composantes incompatibles.

## Solution
**Des parités de préfixes.** Soit `S_x = b₁ + … + b_x`, avec `S₀ = 0`. L'affirmation `(L, R, P)` dit exactement que `S_R − S_(L−1)` a la parité `P`, c'est-à-dire que `S_(L−1)` et `S_R` ont la même parité si `P = 0`, des parités différentes si `P = 1`. Réciproquement, n'importe quel choix des parités des `S_x` (avec `S₀` pair) donne une suite de bits : `b_x` est la parité de `S_x − S_(x−1)`. Il s'agit donc de savoir si des relations « même parité / parité différente » entre préfixes sont compatibles.

**Deux sommets par préfixe.** Pour chaque préfixe `x`, on crée les sommets `(x, 0)` (« `S_x` est pair ») et `(x, 1)` (« `S_x` est impair »). La relation « `S_i` et `S_j` diffèrent de `P` » se traduit par deux unions : `(i, 0)` avec `(j, P)`, et `(i, 1)` avec `(j, 1 − P)`. Deux sommets sont dans la même composante exactement quand l'un **implique** l'autre : si `(i, a)` et `(j, c)` sont reliés, alors la parité de `S_i` vaut `a` si et seulement si celle de `S_j` vaut `c`. Une nouvelle affirmation `(i, j, P)` est contradictoire exactement quand `(i, 0)` est déjà relié à `(j, 1 − P)` : les affirmations précédentes imposent la parité contraire. Sinon, choisir pour chaque composante une valeur cohérente (une composante et sa « jumelle », obtenue en échangeant 0 et 1, reçoivent des valeurs opposées) donne des parités qui vérifient tout ; quitte à inverser toutes les valeurs, `S₀` est pair. On s'arrête à la première contradiction.

**Positions jusqu'à 10⁹.** On ne peut pas créer un tableau de taille `N`. Seuls les préfixes cités comptent : au plus `2Q`. Un dictionnaire leur attribue des numéros `0, 1, 2, …` à la première apparition.

**Complexité.** O(Q) opérations de dictionnaire et d'Union-Find. Revérifier toutes les affirmations par un parcours après chaque nouvelle, comme pour colorier un graphe en deux couleurs, coûterait O(Q²).

**Pièges.** Le préfixe à utiliser est `L − 1`, pas `L`. Une affirmation peut être répétée ; si elle est répétée avec l'autre parité, c'est une contradiction. La réponse vaut `Q` quand tout est cohérent.
