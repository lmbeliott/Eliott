---
id: compter-les-jours-de-marche
title: Compter les jours de marché
chapter: n1-affichage
order: 6
tags: [entrées-sorties, arithmétique]
samples: 2
---

## Énoncé
Les jours sont numérotés 1, 2, 3, et ainsi de suite. Un marché a lieu tous les `K` jours : le premier a lieu le jour `S`, le suivant le jour `S + K`, puis le jour `S + 2 × K`, et ainsi de suite, sans jamais s'arrêter.

Écris un programme qui affiche le nombre de jours de marché entre le jour `A` et le jour `B`, ces deux jours compris.

Ce problème se résout sans `if` et sans boucle : uniquement avec des calculs.

## Entrée
Une seule ligne contenant quatre entiers `S`, `K`, `A` et `B` séparés par des espaces.

## Sortie
Un seul entier : le nombre de jours de marché `j` tels que `A ≤ j ≤ B`.

## Contraintes
- 1 ≤ S ≤ A ≤ B ≤ 1 000 000 000
- 1 ≤ K ≤ 1 000 000 000

## Indices
1. Commence par une question plus simple : combien y a-t-il de jours de marché du jour 1 au jour `X` ? Essaie avec `S = 3`, `K = 7` et `X = 30` : les marchés ont lieu les jours 3, 10, 17 et 24.
2. Du jour 1 au jour `X`, le nombre de marchés est `(X - S) // K + 1` dès que `X ≥ S`. Ensuite, les marchés entre `A` et `B`, ce sont les marchés jusqu'au jour `B`, moins ceux qui ont eu lieu jusqu'au jour `A - 1`.
3. Attention quand `A = S` : le jour `A - 1` est alors avant le premier marché, et la formule de l'indice 2 doit donner 0. Ajoute `K` dans la parenthèse pour éviter les nombres négatifs : `(X - S + K) // K` donne le même résultat quand `X ≥ S`, et 0 quand `X = S - 1`.

## Solution
On compte d'abord les marchés du jour 1 au jour `X`. Les jours de marché sont `S`, `S + K`, `S + 2 × K`… Si `X ≥ S`, le dernier marché avant `X` est `S + q × K`, avec `q = (X - S) // K`, et il y a `q + 1` marchés en tout (les numéros 0 à `q`).

Les marchés entre `A` et `B` sont ceux qui ont lieu jusqu'au jour `B`, sauf ceux qui ont lieu jusqu'au jour `A - 1`. La réponse est donc la différence des deux comptes.

Le piège est le cas `A = S` : il faut compter les marchés jusqu'au jour `S - 1`, et il n'y en a aucun. Or `X - S` vaut alors `-1`, un nombre négatif, et la division entière des nombres négatifs ne se comporte pas pareil dans les deux langages : en Python, `-1 // 7` vaut `-1`, mais en C++, `-1 / 7` vaut `0`. Pour ne pas dépendre de ce détail, on écrit le compte sous la forme `(X - S + K) // K` : c'est la même chose que `(X - S) // K + 1` (on a ajouté exactement une fois `K` avant de diviser par `K`), mais le nombre divisé n'est jamais négatif, et pour `X = S - 1` on obtient bien `(K - 1) // K = 0`.

Exemple : `S = 3`, `K = 7`, `A = 10`, `B = 40`. Jusqu'au jour 40, il y a `(40 - 3 + 7) // 7 = 6` marchés (3, 10, 17, 24, 31, 38) ; jusqu'au jour 9, il y en a `(9 - 3 + 7) // 7 = 1`. La réponse est 6 - 1 = 5.

Avec des nombres allant jusqu'à un milliard, impossible de tester les jours un par un : il faut la formule. Le plus grand nombre calculé, `B - S + K`, reste en dessous de 2 milliards : il tient dans un `int` en C++.
