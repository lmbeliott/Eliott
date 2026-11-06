---
id: note-du-milieu
title: Note du milieu
chapter: n1-conditions
order: 4
tags: [conditions]
samples: 2
---

## Énoncé
Trois juges donnent chacun une note entière sur 20 à un candidat. Pour qu'un juge trop sévère ou trop généreux ne fausse pas le résultat, on ne garde que la note du milieu.

Écris un programme qui lit les trois notes et affiche la note du milieu, c'est-à-dire celle qui se retrouve au centre quand on range les trois notes de la plus petite à la plus grande.

## Entrée
Une seule ligne contenant trois entiers `A`, `B` et `C` séparés par des espaces : les notes des trois juges. Deux notes, ou même les trois, peuvent être égales.

## Sortie
Un seul entier : la note du milieu.

## Contraintes
- 0 ≤ A, B, C ≤ 20

## Indices
1. Pose-toi la question : quand est-ce que `A` est la note du milieu ? Il faut qu'elle soit entre les deux autres.
2. `A` est au milieu si B ≤ A ≤ C, ou bien si C ≤ A ≤ B. On peut faire le même raisonnement pour `B`. Si ni `A` ni `B` n'est au milieu, c'est forcément `C`.
3. Pour combiner deux conditions, utilise `and` et `or` en Python, `&&` et `||` en C++. Pense aux notes égales : utilise `<=` plutôt que `<`.

## Solution
La note `A` est au milieu quand elle se trouve entre les deux autres : B ≤ A ≤ C ou C ≤ A ≤ B. Même chose pour `B`. Si ni `A` ni `B` n'est au milieu, c'est `C` qui l'est. Trois cas, donc `if`, `elif`, `else`.

Premier piège : les notes égales. Avec des comparaisons strictes (`<`), pour les notes `5 5 1`, aucune des deux premières conditions n'est vraie, et le programme répondrait `1` au lieu de `5`. Avec `<=`, tout va bien.

Second piège, en C++ : `b <= a <= c` est accepté par le compilateur, mais ne veut pas dire ce qu'on croit ! Le C++ calcule d'abord `b <= a` (qui vaut 0 ou 1), puis compare ce 0 ou ce 1 avec `c`. Il faut écrire `b <= a && a <= c`. En Python, en revanche, `b <= a <= c` fonctionne comme en mathématiques.

Une autre idée, plus astucieuse : la note du milieu, c'est la somme des trois notes, moins la plus grande, moins la plus petite.
