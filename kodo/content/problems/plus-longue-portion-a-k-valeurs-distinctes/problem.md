---
id: plus-longue-portion-a-k-valeurs-distinctes
title: Plus longue portion à K valeurs distinctes
chapter: p3-balayages
order: 5
tags: [deux-pointeurs, listes]
samples: 2
---

## Énoncé
Une suite de `N` entiers `A₁, …, A_N` et un entier `K` sont donnés. Trouver la plus longue **portion** (suite de cases consécutives) qui contient au plus `K` valeurs différentes.

Afficher sa longueur, puis la position de sa première case. S'il y a plusieurs portions de longueur maximale, choisir celle qui commence le plus tôt.

## Entrée
La première ligne contient `N` et `K`. La deuxième ligne contient `A₁, …, A_N`, séparés par des espaces.

## Sortie
Deux entiers sur une ligne : la longueur maximale, puis la position (à partir de 1) du début de la portion.

## Contraintes
- 1 ≤ N ≤ 30 000
- 1 ≤ K ≤ N
- 1 ≤ Aᵢ ≤ 1 000

## Indices
1. Pour chaque début, allonger la portion tant qu'elle a au plus `K` valeurs différentes : jusqu'à N² / 2 opérations quand les portions sont longues.
2. Si une portion a au plus `K` valeurs différentes, toutes les portions qu'elle contient aussi. Quand la fin avance, le meilleur début ne recule jamais.
3. Fenêtre glissante : faire avancer la fin `d` une case à la fois ; tant que la fenêtre a plus de `K` valeurs différentes, avancer le début `g`. Un tableau de comptage donne le nombre d'exemplaires de chaque valeur dans la fenêtre.

## Solution
On fait glisser une **fenêtre** `[g, d]`. Un tableau `cpt` compte les exemplaires de chaque valeur dans la fenêtre, et `differentes` le nombre de valeurs avec `cpt > 0`. Pour chaque fin `d` de gauche à droite :

1. on ajoute `A[d]` (si son compteur passe de 0 à 1, `differentes` augmente) ;
2. tant que `differentes > K`, on retire `A[g]` (si son compteur passe à 0, `differentes` diminue) et on avance `g` ;
3. la fenêtre `[g, d]` est valide ; si elle est **strictement** plus longue que la meilleure trouvée, on la retient.

**Pourquoi.** Invariant : après l'étape 2, `g` est le plus petit début tel que `[g, d]` ait au plus `K` valeurs différentes. En effet, une portion plus courte qu'une portion valide est valide, et une portion qui en contient une invalide est invalide. Quand `d` augmente, le plus petit début valide ne peut donc qu'augmenter : on n'a jamais besoin de reculer `g`. Pour chaque fin `d`, la meilleure portion qui finit en `d` est `[g, d]`, et l'on examine toutes les fins. Avec la comparaison stricte, on garde la première portion de longueur maximale trouvée ; c'est celle qui commence le plus tôt, puisque les portions de même longueur sont trouvées par début croissant.

**Coût.** `d` avance N fois et `g` avance au plus N fois en tout : environ 2N opérations. La méthode directe peut en faire N² / 2 = 450 millions.
