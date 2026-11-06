---
id: meilleur-chemin-descendant
title: Meilleur chemin descendant
chapter: n4-dynamique
order: 2
tags: [programmation-dynamique, grilles]
samples: 2
---

## Énoncé
Une grille a `R` lignes et `C` colonnes : chaque case est interdite, ou contient un chiffre de `0` à `9`.

Un **chemin descendant** commence sur n'importe quelle case non interdite de la première ligne. À chaque mouvement, il descend d'une ligne : vers la case juste en dessous, ou en diagonale vers la case en dessous à gauche ou à droite. Il ne passe jamais sur une case interdite, ne sort jamais de la grille, et termine sur la dernière ligne. La **valeur** d'un chemin est la somme des chiffres de toutes les cases visitées, celles de départ et d'arrivée comprises.

Écris un programme qui calcule la meilleure valeur possible et le nombre de chemins descendants différents qui l'atteignent. Deux chemins sont différents s'ils ne passent pas par exactement les mêmes cases.

## Entrée
- La première ligne contient deux entiers `R` et `C`.
- Les `R` lignes suivantes, de la ligne du haut à celle du bas, contiennent chacune `C` caractères : un chiffre de `0` à `9`, ou `#` pour une case interdite.

## Sortie
Deux entiers séparés par une espace : la meilleure valeur, puis le nombre de chemins qui l'atteignent, modulo `1 000 000 007`. S'il n'existe aucun chemin descendant, affiche seulement `-1`.

## Contraintes
- 1 ≤ R, C ≤ 300

## Indices
1. Il y a jusqu'à `C × 3ᴿ⁻¹` chemins : impossible de tous les essayer. Mais pour arriver au mieux sur une case, peu importe comment on est arrivé aux cases de la ligne du dessus, seule leur meilleure valeur compte.
2. Calcule, ligne par ligne, `meilleur[i][j]` : la meilleure valeur d'un chemin partiel qui finit sur la case `(i, j)`. Elle se déduit des trois cases au-dessus.
3. Calcule en même temps `nombre[i][j]` : le nombre de chemins partiels qui atteignent `meilleur[i][j]`. C'est la somme des `nombre` des cases du dessus dont la meilleure valeur est égale au maximum, et seulement de celles-là.

## Solution
Un chemin partiel qui finit sur la case `(i, j)` est passé juste avant par `(i - 1, j - 1)`, `(i - 1, j)` ou `(i - 1, j + 1)`. Pour avoir la meilleure valeur en `(i, j)`, il faut arriver par une de ces cases avec la meilleure valeur possible. D'où, pour une case qui n'est pas interdite :

- `meilleur[i][j] = chiffre(i, j) + max(meilleur[i - 1][k])` pour `k` parmi `j - 1, j, j + 1`, en ignorant les cases interdites, les cases hors de la grille et les cases inatteignables ;
- `nombre[i][j] = somme des nombre[i - 1][k]` pour les `k` qui **réalisent ce maximum**.

Sur la première ligne, `meilleur[0][j]` est le chiffre de la case et `nombre[0][j] = 1`. Une case dont aucune des trois cases du dessus n'est atteignable est elle-même inatteignable. À la fin, la réponse est le maximum de `meilleur` sur la dernière ligne, et le nombre de chemins est la somme des `nombre` des cases de la dernière ligne qui atteignent ce maximum.

Chaque case est calculée en temps constant : **O(R × C)**. On ne garde que la ligne précédente, la mémoire est O(C).

Pourquoi l'énumération naïve est hors de question : avec `R = 300`, une seule case de départ a déjà jusqu'à 3²⁹⁹ chemins.

Pièges :
- N'additionne que les `nombre` des cases qui atteignent **exactement** le maximum ; ajouter ceux des autres cases donne trop de chemins.
- Distingue « inatteignable » de « valeur 0 » : une case atteignable de chiffre `0` est valide. Utilise une valeur spéciale (par exemple `-1`) pour les cases inatteignables.
- Le nombre de chemins devient énorme (sur une grille sans case interdite, il y en a des milliards de milliards) : prends le modulo à chaque addition. La valeur, elle, reste petite (au plus `9 × R`).
- Si toute une ligne est interdite, il n'y a aucun chemin : affiche `-1`.
