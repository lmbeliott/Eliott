---
id: prix-arrondi-au-centime
title: Prix arrondi au centime
chapter: p2-nombres
order: 3
tags: [arithmétique]
samples: 2
---

## Énoncé
Un article coûte `P` centimes avant taxe. Afficher son prix taxe comprise, avec une taxe de `T` %, en euros. Le prix est arrondi au centime le plus proche ; un demi-centime exact est arrondi vers le haut.

Par exemple, avec `P = 1999` et `T = 20`, le prix exact est 2 398,8 centimes, arrondi à 2 399 centimes : on affiche `23.99`.

## Entrée
Une seule ligne contenant `P` et `T`, séparés par une espace.

## Sortie
Le prix taxe comprise en euros, avec exactement deux chiffres après le point.

## Contraintes
- 1 ≤ P ≤ 10⁹
- 0 ≤ T ≤ 100

## Indices
1. Le prix exact, en centimes, vaut `P × (100 + T) / 100`. Les demi-centimes arrivent souvent : `round` et le format `.2f` ne les arrondissent pas toujours vers le haut.
2. Faire tout le calcul en centimes, avec des entiers. L'arrondi au plus proche de `a / b`, moitié vers le haut, vaut `(2 * a + b) // (2 * b)`.
3. Une fois le nombre entier de centimes `c` connu, `c / 100` affiché avec deux décimales donne le prix en euros.

## Solution
On travaille en centimes, avec des entiers. Le prix exact est `P × (100 + T) / 100` centimes. Son arrondi au plus proche, moitié vers le haut, est `c = (2 × P × (100 + T) + 100) // 200` (la formule `(2a + b) // (2b)` avec `a = P × (100 + T)` et `b = 100`).

Il reste à afficher `c` centimes en euros : `c / 100` avec deux décimales. Ce dernier passage par un flottant est sans danger, car `c / 100` a exactement deux décimales et l'erreur d'approximation est des milliards de fois plus petite qu'un centime.

Le piège : calculer directement `P * (100 + T) / 10000` en flottant puis l'afficher avec `.2f`. Avec `P = 1` et `T = 50`, le prix exact est 1,5 centime, qu'il faut arrondir à 2 ; le flottant 0,015 est en réalité stocké comme 0,01499999…, et `.2f` affiche `0.01` au lieu de `0.02`.
