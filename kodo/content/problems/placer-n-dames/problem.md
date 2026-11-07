---
id: placer-n-dames
title: Placer N dames
chapter: n3-recursivite
order: 3
tags: [backtracking, grilles]
samples: 2
---

## Énoncé
On dispose d'une grille de N × N cases : certaines sont bloquées (`#`), les autres sont libres (`.`). Il faut y placer exactement N dames, chacune sur une case libre. Comme aux échecs, une dame menace toute sa ligne, toute sa colonne et ses deux diagonales : deux dames ne doivent donc jamais être sur la même ligne, la même colonne ou la même diagonale.

Écris un programme qui compte le nombre de façons de placer les N dames.

## Entrée
- La première ligne contient un entier N.
- Les N lignes suivantes contiennent chacune N caractères `.` ou `#` : la grille, ligne par ligne.

## Sortie
Un seul entier : le nombre de façons de placer les N dames. Deux façons sont différentes si l'ensemble des cases utilisées n'est pas le même.

## Contraintes
- 1 ≤ N ≤ 12

## Indices
1. Comme deux dames ne peuvent pas partager une ligne, il y a exactement une dame par ligne. Place-les ligne par ligne, avec une fonction récursive `placer(ligne)`.
2. Pour chaque case libre de la ligne, vérifie que sa colonne et ses deux diagonales sont encore libres. Si oui, pose la dame, appelle `placer(ligne + 1)`, puis retire-la.
3. Pour vérifier en temps constant, garde trois tableaux de booléens : les colonnes occupées, les diagonales « / » (où `ligne + col` est constant) et les diagonales « \ » (où `ligne − col` est constant).

## Solution
**L'idée : le retour sur trace (backtracking).** On place une dame par ligne, de haut en bas. La fonction `placer(ligne)` essaie chaque colonne de la ligne : si la case est libre et que sa colonne et ses diagonales ne sont pas déjà occupées, elle pose la dame, marque la colonne et les diagonales, appelle `placer(ligne + 1)`, puis **défait** tout avant d'essayer la colonne suivante. Quand `ligne == N`, toutes les dames sont posées : on compte une solution.

Deux cases (l₁, c₁) et (l₂, c₂) sont sur la même diagonale « / » si `l₁ + c₁ = l₂ + c₂`, et sur la même diagonale « \ » si `l₁ − c₁ = l₂ − c₂`. On numérote donc les diagonales par `ligne + col` (de 0 à 2N − 2) et par `ligne − col + N` (pour éviter les indices négatifs).

**Pourquoi ça va vite : l'élagage.** Dès qu'une dame ne peut être posée nulle part sur une ligne, on abandonne toute la branche, sans explorer les lignes suivantes. Pour N = 12 sans case bloquée, la fonction n'est appelée qu'environ 860 000 fois, pour 14 200 solutions.

**Complexité.** Exponentielle dans le pire cas, mais l'élagage réduit énormément l'arbre de recherche : environ une demi-seconde en Python pour N = 12.

**Pourquoi la solution naïve est trop lente.** Essayer toutes les façons de choisir une colonne par ligne, puis vérifier, fait 12¹² ≈ 8,9 × 10¹² essais. Même en se limitant aux permutations (une colonne différente par ligne), il y a 12! ≈ 4,8 × 10⁸ cas à vérifier un par un : bien trop pour Python, et plusieurs secondes même en C++.

**Pièges.**
- N'oublie pas de libérer la colonne et les diagonales après l'appel récursif, sinon les branches suivantes les croient encore occupées.
- Une ligne entièrement bloquée rend tout placement impossible : la réponse est alors `0`.
- Pour N = 2 ou N = 3, il n'y a aucune solution, même sans case bloquée.
