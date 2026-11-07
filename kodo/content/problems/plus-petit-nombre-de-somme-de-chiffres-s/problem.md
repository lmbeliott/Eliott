---
id: plus-petit-nombre-de-somme-de-chiffres-s
title: Plus petit nombre de somme de chiffres S
chapter: p1-synthese
order: 8
tags: [arithmétique, glouton]
samples: 2
---

## Énoncé
Afficher le plus petit entier positif ou nul dont la somme des chiffres vaut exactement `S`.

Par exemple, pour `S = 20`, les nombres `299`, `389`, `479`, `992` ou `5555` ont une somme des chiffres égale à 20, et le plus petit de tous est `299`.

## Entrée
Une seule ligne contenant l'entier `S`.

## Sortie
Un seul entier : le plus petit nombre dont la somme des chiffres vaut `S`.

## Contraintes
- 0 ≤ S ≤ 162
- La réponse est inférieure à 10¹⁸ : en C++, utiliser un `long long`.

## Indices
1. Essayer tous les nombres un par un est beaucoup trop long : pour `S = 162`, la réponse a 18 chiffres. Il faut construire la réponse directement.
2. Entre deux nombres sans zéro devant, celui qui a le moins de chiffres est le plus petit. Chaque chiffre vaut au plus 9 : combien de chiffres faut-il au minimum pour atteindre la somme `S` ?
3. À nombre de chiffres égal, on veut le premier chiffre le plus petit possible, donc les autres les plus grands possible : des 9. La réponse est le reste `S % 9` suivi de `S // 9` chiffres 9 (sans le reste s'il vaut 0).

## Solution
Deux remarques construisent la réponse.

**Le moins de chiffres possible.** Un nombre à `k` chiffres a une somme des chiffres d'au plus `9 × k`. Il faut donc au moins `S / 9` chiffres, arrondi au supérieur. Et un nombre qui a moins de chiffres qu'un autre (sans zéro devant) est toujours plus petit.

**Les petits chiffres devant.** Avec ce nombre minimal de chiffres, on veut le premier chiffre le plus petit possible, puis le deuxième, et ainsi de suite. Pour cela, on met le maximum dans les derniers chiffres : des 9. Avec `q = S // 9` et `r = S % 9`, la réponse est `r` suivi de `q` chiffres 9. Si `r = 0`, la réponse est simplement `q` chiffres 9. Pour `S = 20` : `q = 2`, `r = 2`, la réponse est `299`.

Pour construire ce nombre sans chaîne de caractères, on part de `r` et on ajoute `q` fois un chiffre 9 à droite : `resultat = resultat × 10 + 9`. Quand `r = 0`, le 0 de départ disparaît tout seul. Le cas `S = 0` donne 0, ce qui est juste.

C'est un raisonnement **glouton** : on fait à chaque étape le meilleur choix local (le moins de chiffres, puis le plus petit chiffre en tête), et on justifie que ce choix mène à la meilleure réponse.
