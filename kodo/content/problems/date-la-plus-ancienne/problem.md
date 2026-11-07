---
id: date-la-plus-ancienne
title: Date la plus ancienne
chapter: p1-conditions
order: 5
tags: [conditions]
samples: 3
---

## Énoncé
Deux dates sont données sous la forme jour, mois, année. Afficher celle qui vient en premier dans le calendrier. Si les deux dates sont identiques, l'afficher une seule fois.

## Entrée
Deux lignes, une par date. Chaque ligne contient trois entiers `J`, `M` et `A` séparés par des espaces : le jour, le mois et l'année.

## Sortie
Une seule ligne : la date la plus ancienne, sous la même forme `J M A`.

## Contraintes
- 1 ≤ A ≤ 9 999
- 1 ≤ M ≤ 12
- 1 ≤ J ≤ 31, et les dates existent.

## Indices
1. Les années décident en premier : si elles sont différentes, le jour et le mois ne comptent pas.
2. Si les années sont égales, ce sont les mois qui décident ; si les mois sont aussi égaux, les jours.
3. Une seule chaîne `if` / `elif` suffit : `A1 < A2`, puis `A1 > A2`, puis `M1 < M2`, puis `M1 > M2`, puis les jours. Quand on arrive au test des mois, on sait déjà que les années sont égales.

## Solution
On compare comme dans un dictionnaire : d'abord les années, puis les mois, puis les jours. La chaîne de tests est :
- si `A1 < A2`, la première date est la plus ancienne ; si `A1 > A2`, c'est la seconde ;
- sinon (les années sont égales), si `M1 < M2`, la première ; si `M1 > M2`, la seconde ;
- sinon (années et mois égaux), si `J1 <= J2`, la première ; sinon la seconde.

Le `<=` du dernier test traite le cas de deux dates identiques : on affiche alors la première, qui est aussi la seconde.

Le piège est de comparer les jours en premier, ou de comparer chaque nombre séparément : le 30 janvier 2020 est plus ancien que le 2 mars 2019 seulement si on oublie de regarder l'année d'abord. Il ne l'est pas : c'est l'année qui décide.
