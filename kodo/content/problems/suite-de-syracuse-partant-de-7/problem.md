---
id: suite-de-syracuse-partant-de-7
title: Suite de Syracuse partant de 7
chapter: p1-affichage
order: 5
tags: [entrées-sorties, mathématiques]
samples: 1
no_input: true
---

## Énoncé
Une suite de nombres entiers part de `7` et se construit avec la règle suivante : si le nombre est pair, le suivant est sa moitié ; s'il est impair, le suivant est son triple plus un. La suite s'arrête dès qu'elle atteint `1`.

Afficher, sur une première ligne, tous les termes de la suite, de `7` jusqu'à `1` inclus, séparés par une espace. Afficher ensuite, sur une deuxième ligne, le plus grand terme de la suite, puis, sur une troisième ligne, le nombre de termes.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
Trois lignes : les termes de la suite séparés par une espace ; le plus grand terme ; le nombre de termes affichés sur la première ligne.

## Indices
1. Calculer la suite sur papier. Après 7, qui est impair, vient 3 × 7 + 1 = 22 ; 22 est pair, le suivant est 11.
2. Vérifier chaque calcul : une seule erreur fausse toute la fin de la suite. Le dernier terme est `1`.

## Solution
On applique la règle à la main : 7 → 22 → 11 → 34 → 17 → 52 → 26 → 13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1. La suite a 17 termes et son plus grand terme est 52.

Le programme affiche ces trois résultats avec trois instructions. Pour compter les termes sans erreur, on peut les numéroter sur papier ; il ne faut pas oublier de compter le `7` du départ et le `1` final.

Cette suite porte le nom de **suite de Syracuse**. Quel que soit le nombre de départ, on a toujours observé qu'elle finit par atteindre 1, mais personne n'a encore su le démontrer. Dans quelques chapitres, un programme pourra calculer lui-même la suite pour n'importe quel départ.
