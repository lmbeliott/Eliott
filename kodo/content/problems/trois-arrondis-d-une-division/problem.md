---
id: trois-arrondis-d-une-division
title: Trois arrondis d'une division
chapter: p2-nombres
order: 2
tags: [arithmétique]
samples: 2
---

## Énoncé
Pour deux entiers `A` et `B`, afficher trois arrondis du quotient `A / B` : l'arrondi inférieur, l'arrondi supérieur, puis l'arrondi à l'entier le plus proche. Pour ce dernier, un quotient qui tombe exactement au milieu de deux entiers (comme 2,5) est arrondi vers le haut.

## Entrée
Une seule ligne contenant `A` et `B`, séparés par une espace.

## Sortie
Une seule ligne avec trois entiers séparés par des espaces : l'arrondi inférieur, l'arrondi supérieur et l'arrondi au plus proche de `A / B`.

## Contraintes
- 0 ≤ A ≤ 10¹⁸
- 1 ≤ B ≤ 10¹⁸

## Indices
1. Avec des nombres jusqu'à 10¹⁸, les flottants ne sont pas assez précis : `math.ceil(A / B)` peut se tromper. Tout se calcule avec la division entière.
2. L'arrondi supérieur vaut `(A + B - 1) // B`.
3. Arrondir au plus proche revient à ajouter un demi puis à prendre l'arrondi inférieur : A/B + 1/2 = (2A + B) / (2B).

## Solution
On applique les trois formules entières du cours :
- arrondi inférieur : `A // B` ;
- arrondi supérieur : `(A + B - 1) // B`. Si `A` est un multiple de `B`, ajouter `B − 1` ne change pas le quotient ; sinon, cela fait franchir exactement le multiple suivant ;
- arrondi au plus proche : `(2A + B) // (2B)`, car c'est l'arrondi inférieur de A/B + 1/2. Une moitié exacte donne bien l'entier supérieur.

Le piège est de passer par les flottants. Avec `A = 10¹⁸ − 1` et `B = 1`, `A / B` vaut le flottant 10¹⁸, et les trois réponses seraient fausses. En C++, `2A + B` peut atteindre 3 × 10¹⁸ : cela tient dans un `long long` (jusqu'à environ 9,2 × 10¹⁸).
