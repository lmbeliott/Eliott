---
id: descente-hors-piste
title: La descente hors-piste
chapter: n4-dynamique
order: 2
tags: [programmation-dynamique, grilles]
samples: 2
---

## Énoncé
Hugo, moniteur à la station de Valcorde, prépare une descente hors-piste sur la face nord. Sa carte découpe la pente en `R` rangées de `C` cases : chaque case est un rocher, ou un champ de neige noté de `0` à `9` selon la qualité de la poudreuse.

Hugo commence sur n'importe quelle case de la première rangée qui n'est pas un rocher. À chaque mouvement, il descend d'une rangée : vers la case juste en dessous, ou en diagonale vers la case en dessous à gauche ou à droite. Il ne doit jamais passer sur un rocher ni sortir de la carte, et il termine sur la dernière rangée. La **note** d'une descente est la somme des notes de toutes les cases visitées, celles de départ et d'arrivée comprises.

Écris un programme qui calcule la meilleure note possible et le nombre de descentes différentes qui l'atteignent. Deux descentes sont différentes si elles ne passent pas par exactement les mêmes cases.

## Entrée
- La première ligne contient deux entiers `R` et `C`.
- Les `R` lignes suivantes, de la rangée du haut à celle du bas, contiennent chacune `C` caractères : un chiffre de `0` à `9` pour un champ de neige, `#` pour un rocher.

## Sortie
Deux entiers séparés par une espace : la meilleure note, puis le nombre de descentes qui l'atteignent, modulo `1 000 000 007`. S'il n'existe aucune descente, affiche seulement `-1`.

## Contraintes
- 1 ≤ R, C ≤ 300

## Indices
1. Il y a jusqu'à `C × 3ᴿ⁻¹` descentes : impossible de toutes les essayer. Mais pour aller au mieux jusqu'à une case, peu importe comment on est arrivé aux cases de la rangée du dessus, seule leur meilleure note compte.
2. Calcule, rangée par rangée, `meilleur[i][j]` : la meilleure note d'une descente partielle qui finit sur la case `(i, j)`. Elle se déduit des trois cases au-dessus.
3. Calcule en même temps `nombre[i][j]` : le nombre de descentes partielles qui atteignent `meilleur[i][j]`. C'est la somme des `nombre` des cases du dessus dont la meilleure note est égale au maximum, et seulement de celles-là.

## Solution
Une descente partielle qui finit sur la case `(i, j)` est passée juste avant par `(i - 1, j - 1)`, `(i - 1, j)` ou `(i - 1, j + 1)`. Pour avoir la meilleure note en `(i, j)`, il faut arriver par une de ces cases avec la meilleure note possible. D'où, pour une case qui n'est pas un rocher :

- `meilleur[i][j] = note(i, j) + max(meilleur[i - 1][k])` pour `k` parmi `j - 1, j, j + 1`, en ignorant les rochers, les cases hors de la carte et les cases inatteignables ;
- `nombre[i][j] = somme des nombre[i - 1][k]` pour les `k` qui **réalisent ce maximum**.

Sur la première rangée, `meilleur[0][j]` est la note de la case et `nombre[0][j] = 1`. Une case dont aucune des trois cases du dessus n'est atteignable est elle-même inatteignable. À la fin, la réponse est le maximum de `meilleur` sur la dernière rangée, et le nombre de descentes est la somme des `nombre` des cases de la dernière rangée qui atteignent ce maximum.

Chaque case est calculée en temps constant : **O(R × C)**. On ne garde que la rangée précédente, la mémoire est O(C).

Pourquoi l'énumération naïve est hors de question : avec `R = 300`, une seule case de départ a déjà jusqu'à 3²⁹⁹ descentes.

Pièges :
- N'additionne que les `nombre` des cases qui atteignent **exactement** le maximum ; ajouter ceux des autres cases donne trop de descentes.
- Distingue « inatteignable » de « note 0 » : une case de note `0` atteignable est valide. Utilise une valeur spéciale (par exemple `-1`) pour les cases inatteignables.
- Le nombre de descentes devient énorme (sur une carte sans rocher, il y en a des milliards de milliards) : prends le modulo à chaque addition. La note, elle, reste petite (au plus `9 × R`).
- Si toute une rangée est bloquée, il n'y a aucune descente : affiche `-1`.
