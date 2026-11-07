---
id: jours-heures-minutes-secondes
title: Jours, heures, minutes, secondes
chapter: p1-lecture
order: 3
tags: [entrées-sorties, arithmétique]
samples: 2
---

## Énoncé
Une durée est donnée en secondes. L'écrire en jours, heures, minutes et secondes : le nombre d'heures doit être entre 0 et 23, et les nombres de minutes et de secondes entre 0 et 59.

## Entrée
Une seule ligne contenant un entier `S` : la durée en secondes.

## Sortie
Une seule ligne contenant quatre entiers séparés par des espaces : les jours, les heures, les minutes et les secondes.

## Contraintes
- 0 ≤ S ≤ 1 000 000 000

## Indices
1. Une minute fait 60 secondes, une heure 3 600 secondes et un jour 86 400 secondes.
2. `S // 86400` donne le nombre de jours complets, et `S % 86400` ce qui reste une fois ces jours retirés.
3. On recommence avec ce reste : il donne les heures, puis un nouveau reste pour les minutes, et ainsi de suite.

## Solution
On retire les plus grandes unités en premier. Le nombre de jours est `S // 86400` ; il reste `S % 86400` secondes, moins d'un jour. Dans ce reste, le nombre d'heures est `reste // 3600`, et il reste `reste % 3600` secondes, moins d'une heure. Puis les minutes sont `reste // 60` et les secondes `reste % 60`.

Le piège classique est de calculer les heures avec `S // 3600` : on obtient alors le nombre total d'heures, qui peut dépasser 23. Il faut bien partir du reste après avoir retiré les jours.

`S` va jusqu'à 10⁹, ce qui tient dans un `int` en C++ (la limite est environ 2,1 × 10⁹).
