---
id: seuil-de-temperature
title: Seuil de température
chapter: n1-conditions
order: 1
tags: [conditions]
samples: 2
---

## Énoncé
Un thermomètre indique la température `T`, en degrés. On veut savoir si elle atteint au moins 8 degrés.

Écris un programme qui lit `T`. Si `T` est supérieure ou égale à `8`, affiche `OUI` ; sinon, affiche `NON`.

## Entrée
Une seule ligne contenant un entier `T` : la température en degrés. Elle peut être négative.

## Sortie
Un seul mot, en majuscules : `OUI` ou `NON`.

## Contraintes
- −30 ≤ T ≤ 40

## Indices
1. Il y a deux cas possibles : c'est le travail d'un `if` suivi d'un `else`.
2. « Supérieure ou égale à 8 » s'écrit `t >= 8`.
3. Vérifie ce que ton programme affiche quand il fait exactement 8 degrés.

## Solution
On lit `T`, puis on teste la condition `T >= 8` : si elle est vraie, on affiche `OUI`, sinon `NON`.

Le piège classique : écrire `T > 8` au lieu de `T >= 8`. Les deux conditions donnent le même résultat pour presque toutes les températures… sauf pour 8 degrés, où la réponse est bien `OUI` ! Quand un énoncé dit « au moins », « au plus », « strictement », prends le temps de choisir le bon opérateur, et teste toujours la valeur limite.
