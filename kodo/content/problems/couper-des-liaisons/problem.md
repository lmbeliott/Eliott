---
id: couper-des-liaisons
title: Couper des liaisons
chapter: p4-union-find
order: 4
tags: [graphes, union-find]
samples: 2
---

## Énoncé
Un réseau a `N` sommets et `M` liaisons, numérotées de `1` à `M`. On coupe `Q` liaisons, l'une après l'autre. Après chaque coupure, afficher le nombre de sommets de la plus grande composante connexe du réseau.

## Entrée
- La première ligne contient `N`, `M` et `Q`.
- Chacune des `M` lignes suivantes contient deux entiers `A` et `B` : la liaison relie `A` et `B`.
- La dernière ligne contient les numéros des `Q` liaisons coupées, dans l'ordre des coupures. Ils sont tous différents.

## Sortie
Une ligne de `Q` entiers : la taille de la plus grande composante après chaque coupure.

## Contraintes
- 1 ≤ N ≤ 100 000
- 1 ≤ Q ≤ M ≤ 8 000
- 1 ≤ A, B ≤ N

## Indices
1. Union-Find sait fusionner deux composantes, mais pas en séparer une. Et si l'on regardait le film à l'envers ?
2. Partir du réseau final, où toutes les coupures ont été faites. En remontant le temps, chaque coupure devient un **ajout** de liaison.
3. La réponse après la `i`-ème coupure est l'état du réseau juste avant d'annuler cette coupure. En remontant, la plus grande taille ne peut qu'augmenter.

## Solution
Couper une liaison peut séparer une composante en deux, et l'Union-Find ne sait pas défaire une union. Mais les coupures sont toutes connues à l'avance : on peut traiter le problème **hors ligne**, en **ordre inverse**.

On construit d'abord le réseau final, avec toutes les liaisons qui ne seront jamais coupées. Puis on parcourt les coupures de la dernière à la première : l'état courant est exactement le réseau après la coupure `i`, donc on note `reponse[i]`, la plus grande taille ; ensuite on **ajoute** la liaison coupée à l'étape `i`, ce qui donne le réseau juste avant cette coupure, c'est-à-dire après la coupure `i − 1`. On affiche enfin les réponses dans l'ordre normal.

**Pourquoi c'est juste.** Invariant de la boucle inverse : au moment de traiter `i`, l'Union-Find contient exactement les liaisons non coupées après les `i` premières coupures. C'est vrai pour `i = Q` (réseau final), et ajouter la liaison de l'étape `i` le rend vrai pour `i − 1`. La plus grande taille ne fait que croître pendant les fusions : il suffit de garder un maximum.

**Complexité.** O(N + M + Q) opérations Union-Find, en temps quasi constant. Refaire un parcours du réseau après chaque coupure coûterait `Q × (N + M)`, soit près de 10⁹ opérations.

**Pièges.** Les numéros de liaisons commencent à `1`. Une liaison `A – A`, ou une liaison parallèle à une autre, ne change rien quand on la coupe. Ne pas oublier les sommets isolés : la plus grande composante a au moins 1 sommet.
