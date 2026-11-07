---
id: cercle-de-sommes-premieres
title: Cercle de sommes premières
chapter: p4-exploration
order: 2
tags: [backtracking, mathématiques]
samples: 2
---

## Énoncé
On dispose `N` entiers distincts autour d'un cercle. La disposition est **valable** si la somme de deux nombres voisins sur le cercle est toujours un nombre premier.

Deux dispositions qui se déduisent l'une de l'autre par une rotation du cercle sont considérées comme identiques ; deux dispositions symétriques l'une de l'autre (le même cercle lu dans l'autre sens) sont considérées comme différentes. Par exemple, avec `1 2 3 4`, il y a exactement 2 dispositions valables : `1 2 3 4` et `1 4 3 2` (sommes 3, 5, 7, 5 et 5, 7, 5, 3).

Compter les dispositions valables.

## Entrée
- La première ligne contient `N`.
- La deuxième ligne contient les `N` entiers, distincts.

## Sortie
Un seul entier : le nombre de dispositions valables.

## Contraintes
- 3 ≤ N ≤ 14
- chaque entier est entre 1 et 1 000

## Indices
1. Pour ne compter chaque cercle qu'une fois, on peut fixer le premier nombre de la liste en position 0 : chaque classe de rotations contient exactement une disposition qui commence par lui.
2. Placer les nombres un par un, et abandonner une branche dès que deux voisins ont une somme non première, sans attendre la fin.
3. Un crible jusqu'à 2 000 suffit pour tester les sommes. Une somme de deux nombres impairs est paire : elle n'est première que si elle vaut 2, ce qui est impossible ici.

## Solution
**Briser la symétrie.** Les rotations d'une disposition donnent `N` listes différentes ; exactement une commence par le premier nombre donné, `a₀`. On compte donc les ordres des `N − 1` autres nombres placés après `a₀`, c'est-à-dire les permutations de `N − 1` éléments qui forment un cercle valable.

**Retour sur trace.** Une fonction récursive place un nombre non encore utilisé à la position `i`, à condition que sa somme avec le nombre de la position `i − 1` soit première ; si ce n'est pas le cas, la branche est coupée immédiatement. Quand les `N` positions sont remplies, on vérifie la dernière somme, celle du dernier nombre et de `a₀`, et l'on compte 1. Les tests de primalité se font en temps constant grâce à un crible d'Ératosthène jusqu'à 2 000.

**Taille de l'arbre de recherche.** Sans élagage, il y aurait `13! ≈ 6 × 10⁹` feuilles pour `N = 14`. L'élagage est très efficace : une somme d'impairs est paire et supérieure à 2, donc les nombres pairs et impairs doivent alterner, et parmi les sommes de parités différentes, peu sont premières. Sur les tests, l'arbre compte au plus quelques centaines de milliers de nœuds.

**Pour aller plus loin.** Avec les nombres de 1 à `N`, l'alternance impose que `N` soit pair (sinon la réponse est 0) ; les réponses pour `N = 4, 6, 8, 10, 12, 14` sont 2, 2, 4, 96, 1 024 et 2 880.
