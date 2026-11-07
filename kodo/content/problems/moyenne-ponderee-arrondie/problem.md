---
id: moyenne-ponderee-arrondie
title: Moyenne pondérée arrondie
chapter: p2-synthese
order: 1
tags: [arithmétique, fonctions]
samples: 2
---

## Énoncé
Un bulletin contient `N` notes sur 20, chacune avec un coefficient. Afficher la moyenne pondérée, arrondie au dixième le plus proche. Quand la moyenne tombe exactement au milieu de deux dixièmes, on arrondit vers le haut.

La moyenne pondérée est la somme des `note × coefficient`, divisée par la somme des coefficients. Par exemple, une note de 12 avec le coefficient 3 et une note de 13 avec le coefficient 1 donnent (36 + 13) / 4 = 12,25, qui s'arrondit à `12.3`.

## Entrée
La première ligne contient l'entier `N`. Les `N` lignes suivantes contiennent chacune une note et son coefficient, deux entiers séparés par une espace.

## Sortie
La moyenne arrondie, écrite avec un point et exactement un chiffre après le point (par exemple `12.3` ou `15.0`).

## Contraintes
- 1 ≤ N ≤ 100
- 0 ≤ note ≤ 20
- 1 ≤ coefficient ≤ 10

## Indices
1. Avec des nombres à virgule, `round(12.25, 1)` donne `12.2` en Python : à cause de l'arrondi « au pair » et des erreurs de représentation, les cas « pile au milieu » sont mal traités.
2. Arrondir `x` au dixième revient à arrondir `10 × x` à l'entier le plus proche. Pour un entier positif `a / b`, l'entier le plus proche, demis vers le haut, est `(2a + b) // (2b)`.
3. Avec `S` la somme des `note × coefficient` et `C` la somme des coefficients, le nombre de dixièmes est `(20 × S + C) // (2 × C)`. Il reste à l'afficher avec `// 10` et `% 10`.

## Solution
On calcule d'abord deux entiers : `S`, la somme des `note × coefficient`, et `C`, la somme des coefficients. La moyenne vaut `S / C`.

Le piège est de faire la division en nombres à virgule, puis d'arrondir avec `round` ou un affichage à une décimale. En Python, `round` arrondit les demis vers le chiffre pair (`round(0.25, 1)` donne `0.2`), et de toute façon `12.25` ou `13.35` ne sont pas représentés exactement en machine : le résultat dépend de minuscules erreurs.

On reste donc en nombres entiers. Le nombre de dixièmes cherché est l'entier le plus proche de `10 × S / C`. Pour un quotient positif `a / b`, ajouter un demi puis prendre la partie entière donne l'arrondi avec les demis vers le haut : `⌊a / b + 1/2⌋ = ⌊(2a + b) / (2b)⌋`. Avec `a = 10 × S` et `b = C`, on obtient `(20 × S + C) // (2 × C)`. Une petite fonction `arrondi_au_dixieme` isole ce calcul et le rend facile à tester.

Pour l'affichage, `dixiemes // 10` est la partie entière et `dixiemes % 10` le chiffre après le point : 123 dixièmes s'écrivent `12.3`, et 150 dixièmes `15.0`, avec le zéro final.
