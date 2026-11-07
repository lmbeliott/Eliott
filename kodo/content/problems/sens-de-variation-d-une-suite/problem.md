---
id: sens-de-variation-d-une-suite
title: Sens de variation d'une suite
chapter: p1-booleens
order: 5
tags: [conditions, boucles]
samples: 4
---

## Énoncé
Lire une suite de `N` entiers et dire comment elle varie, en regardant chaque valeur par rapport à la précédente :
- `CONSTANTE` si toutes les valeurs sont égales ;
- `CROISSANTE` si la suite monte au moins une fois et ne descend jamais ;
- `DECROISSANTE` si elle descend au moins une fois et ne monte jamais ;
- `AUCUNE` si elle monte au moins une fois et descend au moins une fois.

## Entrée
- La première ligne contient l'entier `N`.
- Les `N` lignes suivantes contiennent chacune un entier.

## Sortie
Un seul mot : `CONSTANTE`, `CROISSANTE`, `DECROISSANTE` ou `AUCUNE`.

## Contraintes
- 1 ≤ N ≤ 1 000
- −1 000 000 ≤ chaque valeur ≤ 1 000 000

## Indices
1. Deux informations suffisent : « la suite est-elle montée au moins une fois ? » et « est-elle descendue au moins une fois ? ».
2. Ce sont deux drapeaux, `monte` et `descend`, qui partent de `False`.
3. À la fin, les quatre réponses correspondent aux quatre combinaisons possibles des deux drapeaux.

## Solution
On lit la première valeur, puis on compare chaque valeur suivante `x` à la précédente. Si `x > precedent`, on passe le drapeau `monte` à vrai ; si `x < precedent`, on passe `descend` à vrai ; en cas d'égalité, rien ne change. Une fois levé, un drapeau reste levé.

À la fin :
- `not monte and not descend` : `CONSTANTE` ;
- `monte and not descend` : `CROISSANTE` ;
- `descend and not monte` : `DECROISSANTE` ;
- `monte and descend` : `AUCUNE`.

Les pièges : une suite comme `1 3 3 5` est croissante, car les égalités ne comptent ni comme une montée ni comme une descente ; et une suite d'une seule valeur est constante.
