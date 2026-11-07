---
id: indice-h
title: Indice h
chapter: p3-tris-simples
order: 7
tags: [tri, mathématiques]
samples: 2
---

## Énoncé
Une personne a publié `N` articles ; l'article `i` a été cité `Cᵢ` fois. Son **indice h** est le plus grand entier `h` tel qu'au moins `h` articles ont été cités chacun au moins `h` fois.

Par exemple, avec les citations `3 0 6 1 5`, l'indice vaut 3 : trois articles ont au moins 3 citations, mais il n'y a pas quatre articles avec au moins 4 citations.

## Entrée
La première ligne contient `N`. La deuxième ligne contient `C₁, …, C_N`, séparés par des espaces.

## Sortie
Un seul entier : l'indice h.

## Contraintes
- 1 ≤ N ≤ 25 000
- 0 ≤ Cᵢ ≤ 10⁹

## Indices
1. Essayer chaque `h` de 0 à `N` en recomptant à chaque fois les articles cités au moins `h` fois coûte de l'ordre de N² opérations.
2. L'indice ne dépasse jamais `N`. Un article cité 10⁹ fois compte exactement comme un article cité `N` fois.
3. Faire un tri par comptage des valeurs `min(Cᵢ, N)`, puis parcourir `h` de `N` vers `0` en cumulant le nombre d'articles cités au moins `h` fois.

## Solution
L'indice vaut au plus `N`, puisqu'il faut au moins `h` articles. Pour un seuil `h ≤ N`, un article cité plus de `N` fois est cité au moins `h` fois, comme un article cité exactement `N` fois : on peut remplacer chaque `Cᵢ` par `min(Cᵢ, N)` sans changer la réponse. Les valeurs sont alors entre 0 et `N`, et l'on peut faire un **tri par comptage** : `cpt[v]` est le nombre d'articles de valeur `v`.

On parcourt ensuite `h = N, N − 1, …, 0` en tenant à jour `au_moins`, le nombre d'articles cités au moins `h` fois : en passant de `h + 1` à `h`, on lui ajoute `cpt[h]`. Le premier `h` rencontré tel que `au_moins ≥ h` est le plus grand qui convient, puisque l'on descend depuis `N`. On le trouve toujours : `h = 0` convient.

**Coût.** Un passage pour compter, un passage pour descendre : environ 2N opérations. Une autre solution trie les citations dans l'ordre décroissant, `D₁ ≥ D₂ ≥ …`, et cherche le plus grand `h` tel que `D_h ≥ h` ; elle est un peu plus lente à cause du tri, mais tout aussi juste. Le piège est de créer un tableau de comptage de taille 10⁹.
