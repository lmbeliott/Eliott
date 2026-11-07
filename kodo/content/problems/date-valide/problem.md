---
id: date-valide
title: Date valide
chapter: p1-booleens
order: 4
tags: [conditions]
samples: 4
---

## Énoncé
Une date est donnée par trois entiers : le jour `J`, le mois `M` et l'année `A`. Afficher `OUI` si cette date existe dans le calendrier, `NON` sinon.

Rappels :
- les mois 1, 3, 5, 7, 8, 10 et 12 ont 31 jours ; les mois 4, 6, 9 et 11 en ont 30 ;
- février (mois 2) a 29 jours les années bissextiles et 28 les autres ;
- une année est bissextile si elle est divisible par 4 mais pas par 100, ou si elle est divisible par 400.

## Entrée
Une seule ligne contenant trois entiers `J`, `M` et `A` séparés par des espaces.

## Sortie
`OUI` ou `NON`.

## Contraintes
- 0 ≤ J ≤ 40
- 0 ≤ M ≤ 15
- 1 ≤ A ≤ 9 999

## Indices
1. Le mois doit être entre 1 et 12, et le jour au moins 1. Ensuite, tout dépend du nombre de jours du mois.
2. Calculer d'abord ce nombre de jours dans une variable `jours_du_mois`, puis comparer `J` à cette valeur.
3. Pour les mois de 30 jours : `M == 4 or M == 6 or M == 9 or M == 11`.

## Solution
On procède en deux temps. D'abord, on calcule le nombre de jours du mois :
- si `M == 2`, c'est 29 si l'année est bissextile, 28 sinon, avec `bissextile = (A % 4 == 0 and A % 100 != 0) or A % 400 == 0` ;
- sinon, si `M` vaut 4, 6, 9 ou 11 (quatre égalités reliées par `or`), c'est 30 ;
- sinon, c'est 31.

Ensuite, la date est valide si `1 <= M <= 12` et `1 <= J <= jours_du_mois`. Pour un mois invalide comme 13, le calcul du nombre de jours donne 31, mais cela n'a pas d'importance : le test sur le mois rejette la date.

Les pièges : oublier qu'un jour ou un mois peut valoir 0 ; oublier les parenthèses dans la règle bissextile ; et confondre les années comme 1900 (non bissextile, donc pas de 29 février) et 2000 (bissextile).
