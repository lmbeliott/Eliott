---
id: comparer-deux-grands-nombres
title: Comparer deux grands nombres
chapter: p2-chaines
order: 6
tags: [chaînes, conditions]
samples: 2
---

## Énoncé
Comparer deux entiers `A` et `B` qui peuvent avoir jusqu'à 10 000 chiffres, et être négatifs. Afficher `<` si `A` est plus petit que `B`, `>` s'il est plus grand, et `=` s'ils sont égaux.

## Entrée
La première ligne contient `A`, la deuxième `B`. Un nombre négatif commence par le signe `-`. Aucun nombre n'a de zéro inutile au début, et zéro s'écrit toujours `0`, sans signe.

## Sortie
Un seul symbole : `<`, `>` ou `=`.

## Contraintes
- `A` et `B` ont chacun entre 1 et 10 000 chiffres.

## Indices
1. Ces nombres sont trop grands pour être convertis en entiers : il faut raisonner sur les chaînes. Mais comparer directement les chaînes ne marche pas : `"9" > "10"` dans l'ordre du dictionnaire.
2. Commencer par les signes : un nombre négatif est plus petit qu'un nombre positif ou nul.
3. Pour deux nombres positifs sans zéro au début, celui qui a le plus de chiffres est le plus grand ; à longueur égale, l'ordre des chaînes est l'ordre des nombres. Pour deux négatifs, la comparaison des valeurs sans le signe s'inverse.

## Solution
On traite d'abord les signes. Si un seul des deux nombres commence par `-`, c'est le plus petit.

Sinon, les deux nombres ont le même signe, et on compare leurs **valeurs absolues**, c'est-à-dire les chaînes sans le `-` éventuel (`a[1:]` en Python, `a.substr(1)` en C++) :
- si les longueurs diffèrent, le nombre le plus long est le plus grand en valeur absolue, puisqu'il n'y a pas de zéro inutile au début ;
- à longueur égale, l'ordre lexicographique des chaînes est exactement l'ordre des nombres : on compare les chiffres de gauche à droite, et le premier chiffre différent décide, comme pour les mots du dictionnaire.

Si les deux nombres sont négatifs, l'ordre s'inverse : −500 < −20 alors que 500 > 20.

Le piège principal est de comparer les chaînes directement : `"9" > "10"` et `"-1" < "-2"` en ordre lexicographique, deux réponses fausses pour les nombres. En Python, `int()` est en plus refusé pour les chaînes de plus de 4 300 chiffres.
