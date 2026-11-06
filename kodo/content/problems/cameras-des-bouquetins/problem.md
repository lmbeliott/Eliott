---
id: cameras-des-bouquetins
title: Les caméras des bouquetins
chapter: n3-recursivite
order: 3
tags: [backtracking, grilles]
samples: 2
---

## Énoncé
Les gardes du parc veulent filmer les bouquetins qui escaladent une falaise. Ils ont quadrillé la paroi en N × N cases : certaines sont des rochers lisses (`#`) où l'on ne peut rien fixer, les autres sont libres (`.`).

Ils doivent installer exactement N caméras, chacune sur une case libre. Une caméra filme toute sa ligne, toute sa colonne et ses deux diagonales : pour ne pas se gêner, deux caméras ne doivent jamais être sur la même ligne, la même colonne ou la même diagonale.

Écris un programme qui compte le nombre de façons d'installer les N caméras.

## Entrée
- La première ligne contient un entier N.
- Les N lignes suivantes contiennent chacune N caractères `.` ou `#` : la falaise, ligne par ligne.

## Sortie
Un seul entier : le nombre de façons de placer les N caméras. Deux façons sont différentes si l'ensemble des cases utilisées n'est pas le même.

## Contraintes
- 1 ≤ N ≤ 11

## Indices
1. Comme deux caméras ne peuvent pas partager une ligne, il y a exactement une caméra par ligne. Place-les ligne par ligne, avec une fonction récursive `placer(ligne)`.
2. Pour chaque case libre de la ligne, vérifie que sa colonne et ses deux diagonales sont encore libres. Si oui, pose la caméra, appelle `placer(ligne + 1)`, puis retire-la.
3. Pour vérifier en temps constant, garde trois tableaux de booléens : les colonnes occupées, les diagonales « / » (où `ligne + col` est constant) et les diagonales « \ » (où `ligne − col` est constant).

## Solution
**L'idée : le retour sur trace (backtracking).** On place une caméra par ligne, de haut en bas. La fonction `placer(ligne)` essaie chaque colonne de la ligne : si la case est libre et que sa colonne et ses diagonales ne sont pas déjà surveillées, elle pose la caméra, marque la colonne et les diagonales, appelle `placer(ligne + 1)`, puis **défait** tout avant d'essayer la colonne suivante. Quand `ligne == N`, toutes les caméras sont posées : on compte une solution.

Deux cases (l₁, c₁) et (l₂, c₂) sont sur la même diagonale « / » si `l₁ + c₁ = l₂ + c₂`, et sur la même diagonale « \ » si `l₁ − c₁ = l₂ − c₂`. On numérote donc les diagonales par `ligne + col` (de 0 à 2N − 2) et par `ligne − col + N` (pour éviter les indices négatifs).

**Pourquoi ça va vite : l'élagage.** Dès qu'une caméra ne peut être posée nulle part sur une ligne, on abandonne toute la branche, sans explorer les lignes suivantes. Pour N = 11 sans rocher, la fonction n'est appelée qu'environ 170 000 fois, pour 2 680 solutions.

**Complexité.** Exponentielle dans le pire cas, mais l'élagage réduit énormément l'arbre de recherche : quelques dixièmes de seconde en Python pour N = 11.

**Pourquoi la solution naïve est trop lente.** Essayer toutes les façons de choisir une colonne par ligne, puis vérifier, fait 11¹¹ ≈ 2,8 × 10¹¹ essais. Même en se limitant aux permutations (une colonne différente par ligne), il y a 11! ≈ 40 millions de cas à vérifier un par un : bien trop pour Python.

**Pièges.**
- N'oublie pas de libérer la colonne et les diagonales après l'appel récursif, sinon les branches suivantes croient les cases encore surveillées.
- Une ligne entièrement rocheuse rend toute installation impossible : la réponse est alors `0`.
- Pour N = 2 ou N = 3, il n'y a aucune solution, même sans rocher.
