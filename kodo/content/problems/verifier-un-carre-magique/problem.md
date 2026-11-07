---
id: verifier-un-carre-magique
title: Vérifier un carré magique
chapter: p2-grilles
order: 2
tags: [grilles, mathématiques]
samples: 2
---

## Énoncé
Une grille carrée de `N` lignes et `N` colonnes est un **carré magique** si :
- chaque entier de 1 à `N × N` y apparaît exactement une fois ;
- toutes les lignes, toutes les colonnes et les deux diagonales ont la même somme.

Dire si une grille donnée est un carré magique.

## Entrée
- La première ligne contient l'entier `N`.
- Chacune des `N` lignes suivantes contient `N` entiers, séparés par des espaces.

## Sortie
`OUI` si la grille est un carré magique, `NON` sinon.

## Contraintes
- 1 ≤ N ≤ 50
- Chaque valeur est comprise entre 1 et `N × N`.

## Indices
1. Pour vérifier que chaque entier apparaît une fois, utiliser une liste de `N × N + 1` booléens : une valeur déjà marquée qui revient est un doublon.
2. Calculer la somme de la première ligne, puis comparer à elle toutes les autres sommes : lignes, colonnes, diagonale `g[i][i]` et anti-diagonale `g[i][N - 1 - i]`.
3. Ne pas oublier les diagonales : une grille dont les lignes et les colonnes ont la même somme n'est pas forcément magique.

## Solution
On vérifie les deux conditions l'une après l'autre ; une fonction booléenne pour chacune rend le programme clair.

Pour les valeurs, on crée une liste `vu` de `N × N + 1` booléens à `False`. Pour chaque case de valeur `v`, si `vu[v]` est déjà vrai, la valeur apparaît deux fois et la grille n'est pas magique ; sinon, on met `vu[v]` à vrai. Comme il y a exactement `N × N` cases et que chaque valeur est entre 1 et `N × N`, l'absence de doublon garantit que chaque entier apparaît exactement une fois.

Pour les sommes, on prend comme référence la somme de la première ligne, puis on compare toutes les sommes de lignes, de colonnes et des deux diagonales. On peut aussi remarquer que la somme commune vaut forcément `N × (N × N + 1) / 2` : la somme de tous les entiers de 1 à `N × N` est répartie également entre les `N` lignes. Pour `N = 3`, c'est 15.

La première condition est indispensable : une grille de 3 × 3 remplie de 5 a toutes ses sommes égales à 15, mais ce n'est pas un carré magique. La seconde aussi : échanger deux lignes d'un carré magique garde les sommes des lignes et des colonnes, mais casse en général les diagonales.

Cas particuliers : la grille `1` de taille 1 est magique ; aucune grille de taille 2 ne l'est.
