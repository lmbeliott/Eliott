---
id: rebonds-d-une-balle
title: Rebonds d'une balle
chapter: p1-tant-que
order: 5
tags: [boucles, simulation]
samples: 2
---

## Énoncé
Une balle est lâchée d'une hauteur de `H` centimètres. Chaque fois qu'elle touche le sol, elle remonte à `P` % de la hauteur dont elle vient de tomber, arrondi au centimètre inférieur : si elle est tombée de `h` centimètres, elle remonte de `h × P // 100` centimètres, puis retombe de cette même hauteur. Elle s'immobilise dès que la hauteur de remontée vaut `0`.

Afficher le nombre de fois où la balle touche le sol, puis la distance verticale totale qu'elle parcourt, en centimètres.

## Entrée
Une seule ligne contenant deux entiers `H` et `P` séparés par une espace.

## Sortie
Une seule ligne avec deux entiers séparés par une espace : le nombre de contacts avec le sol, puis la distance totale parcourue (descentes et montées).

## Contraintes
- 1 ≤ H ≤ 10⁹
- 0 ≤ P ≤ 99
- En C++, la distance totale demande un `long long`.

## Indices
1. Les variables qui décrivent la situation : la hauteur de la dernière chute, le nombre de contacts et la distance parcourue. Au départ, la balle tombe de `H` : un contact, et `H` centimètres parcourus.
2. À chaque tour de boucle, on calcule la hauteur de remontée. Si elle est positive, la balle monte puis redescend de cette hauteur : cela fait deux fois la hauteur en distance, et un contact de plus.
3. Exemple : avec `H = 100` et `P = 50`, la balle remonte de 50, 25, 12, 6, 3, 1, puis de 0. Elle touche le sol 7 fois et parcourt `100 + 2 × (50 + 25 + 12 + 6 + 3 + 1) = 294` centimètres.

## Solution
On simule les rebonds un par un. La variable `h` contient la hauteur de la dernière chute. Au départ, `h = H`, `contacts = 1` et `distance = H` (la première chute).

Ensuite, on calcule la remontée `h = h * P // 100`, et tant qu'elle est positive : la balle monte de `h` puis retombe de `h`, donc `distance` augmente de `2 × h` et `contacts` de 1 ; puis on calcule la remontée suivante. Quand `h` vaut 0, la boucle s'arrête.

La boucle se termine toujours, car `P` est au plus 99 : la hauteur diminue d'au moins un centimètre à chaque rebond. Même dans le pire cas (`H = 10⁹`, `P = 99`), il y a environ 1 700 rebonds.

Les pièges : oublier la première chute, compter deux fois la distance de la première chute, ou compter un contact pour la remontée nulle. En C++, la distance peut dépasser 2 × 10⁹ (elle approche 2 × 10¹¹) : il faut un `long long`.
