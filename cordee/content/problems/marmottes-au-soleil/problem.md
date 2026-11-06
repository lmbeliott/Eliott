---
id: marmottes-au-soleil
title: Les marmottes sortent-elles ?
chapter: n1-conditions
order: 1
tags: [conditions]
samples: 2
---

## Énoncé
Sur l'alpage de Valcorde, Théo observe les marmottes depuis des années. Il a remarqué qu'elles ne sortent de leur terrier que s'il fait au moins 8 degrés. Chaque matin, il lit la température sur son thermomètre pour savoir s'il a une chance de les voir.

Écris un programme qui lit la température `T`. Si `T` est supérieure ou égale à `8`, affiche `SORTIE` ; sinon, affiche `TERRIER`.

## Entrée
Une seule ligne contenant un entier `T` : la température en degrés. Elle peut être négative.

## Sortie
Un seul mot, en majuscules : `SORTIE` ou `TERRIER`.

## Contraintes
- −30 ≤ T ≤ 40

## Indices
1. Il y a deux cas possibles : c'est le travail d'un `if` suivi d'un `else`.
2. « Supérieure ou égale à 8 » s'écrit `t >= 8`.
3. Vérifie ce que ton programme affiche quand il fait exactement 8 degrés.

## Solution
On lit `T`, puis on teste la condition `T >= 8` : si elle est vraie, on affiche `SORTIE`, sinon `TERRIER`.

Le piège classique : écrire `t > 8` au lieu de `t >= 8`. Les deux conditions donnent le même résultat pour presque toutes les températures… sauf pour 8 degrés, où les marmottes sortent ! Quand un énoncé dit « au moins », « au plus », « strictement », prends le temps de choisir le bon opérateur, et teste toujours la valeur limite.
