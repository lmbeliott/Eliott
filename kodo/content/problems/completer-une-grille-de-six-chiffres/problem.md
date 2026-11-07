---
id: completer-une-grille-de-six-chiffres
title: Compléter une grille de six chiffres
chapter: p4-exploration
order: 5
tags: [backtracking, grilles, bits]
samples: 2
---

## Énoncé
Une grille de 6 × 6 cases est découpée en six **blocs** de 2 lignes et 3 colonnes. Elle est **complète** quand chaque ligne, chaque colonne et chaque bloc contient une fois et une seule chacun des chiffres de 1 à 6.

Certaines cases sont déjà remplies. Compter les façons de remplir les cases vides pour obtenir une grille complète. Si deux chiffres déjà écrits sont incompatibles, la réponse est 0.

## Entrée
6 lignes de 6 caractères : un chiffre de `1` à `6` pour une case remplie, `.` pour une case vide. Les blocs sont formés des lignes 1-2, 3-4 et 5-6, et des colonnes 1-3 et 4-6.

## Sortie
Un seul entier : le nombre de complétions.

## Contraintes
- La réponse ne dépasse pas 5 000.

## Indices
1. Un retour sur trace remplit les cases vides une par une, en n'essayant que les chiffres absents de la ligne, de la colonne et du bloc de la case ; il revient en arrière quand une case n'a plus aucun chiffre possible.
2. Pour savoir vite quels chiffres sont possibles, tenir pour chaque ligne, chaque colonne et chaque bloc un entier dont le bit `d` vaut 1 si le chiffre `d` y est déjà.
3. Remplir d'abord la case qui a le **moins** de chiffres possibles : une case sans choix coupe la branche tout de suite, une case à un seul choix ne crée pas de branche.

## Solution
On tient trois tableaux de **masques** : `ligne[i]`, `colonne[j]` et `bloc[b]`, où le bit `d` vaut 1 si le chiffre `d` est déjà présent. Les chiffres possibles pour la case `(i, j)` sont les bits à 1 de `0b1111110 & ~(ligne[i] | colonne[j] | bloc[b])`, avec `b = (i // 2) × 2 + j // 3`. On vérifie au passage, en lisant la grille, qu'aucun chiffre donné n'est en double ; sinon on affiche 0.

La fonction récursive `compter()` cherche, parmi les cases vides, celle qui a le moins de chiffres possibles. S'il n'y a plus de case vide, la grille est complète : elle renvoie 1. Sinon, pour chaque chiffre possible de cette case, elle l'écrit, met à jour les trois masques, s'appelle, puis **défait** ces modifications ; elle renvoie la somme des résultats. Si la case choisie n'a aucun chiffre possible, la boucle ne fait rien et la branche renvoie 0.

**Correction.** Chaque complétion est obtenue exactement une fois : à chaque appel, les branches correspondent à des chiffres différents pour la même case, donc elles ne se recouvrent pas, et aucun chiffre valable n'est oublié.

**Pourquoi choisir la case la plus contrainte.** L'ordre de remplissage ne change pas le résultat, mais il change énormément la taille de l'arbre. Une case qui n'a plus de chiffre possible fait échouer la branche dès maintenant, au lieu de laisser le programme remplir dix autres cases avant de s'en apercevoir. Avec cette règle, le nombre de nœuds visités reste proche du nombre de complétions.

**Complexité.** Chaque nœud coûte O(36) pour trouver la meilleure case. Le nombre de nœuds dépend de la grille ; sur les tests, il est de l'ordre de quelques dizaines de milliers au plus.
