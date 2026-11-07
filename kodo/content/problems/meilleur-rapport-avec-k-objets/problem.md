---
id: meilleur-rapport-avec-k-objets
title: Meilleur rapport avec K objets
chapter: n3-dichotomie
order: 5
tags: [dichotomie, tri]
samples: 2
---

## Énoncé
On dispose de N objets : l'objet numéro i a une valeur V_i et un poids P_i. Tu dois choisir **exactement K** objets différents. Le rapport d'un choix est la somme des valeurs des objets choisis divisée par la somme de leurs poids.

Écris un programme qui calcule le plus grand rapport possible. Pour éviter les nombres à virgule, affiche la partie entière de 1000 × ce rapport.

## Entrée
- La première ligne contient deux entiers N et K.
- Les N lignes suivantes contiennent chacune deux entiers V_i et P_i.

## Sortie
Un seul entier : la partie entière de 1000 × (V total / P total), pour le meilleur choix de K objets.

## Contraintes
- 1 ≤ K ≤ N ≤ 10 000
- 1 ≤ V_i, P_i ≤ 10 000

## Indices
1. Prendre les K objets qui ont individuellement le meilleur rapport V_i / P_i ne marche pas : regarde le deuxième exemple. Un objet léger au rapport moyen peut gêner moins qu'un objet lourd au bon rapport.
2. Pose-toi une question plus simple : pour un entier q donné, peut-on choisir K objets tels que 1000 × (V total) ≥ q × (P total) ? Réécris cette condition comme une somme sur les objets choisis.
3. La condition devient : la somme des `1000 × V_i − q × P_i` des objets choisis est ≥ 0. Pour la rendre la plus grande possible, prends les K objets où cette quantité est la plus grande. Si c'est possible pour q, c'est possible pour q − 1 : cherche le plus grand q par dichotomie.

## Solution
**Le piège.** Trier les objets par rapport V_i / P_i et prendre les K premiers semble naturel, mais c'est faux. Dans le deuxième exemple, avec K = 2, les deux meilleurs rapports sont (100, 100) et (60, 100), soit 160 / 200 = 0,8 ; alors que (100, 100) et (1, 2) donnent 101 / 102 ≈ 0,99. Le poids d'un objet compte autant que son rapport : un objet léger tire peu le rapport vers le bas.

**L'idée : chercher la réponse par dichotomie.** La réponse est le plus grand entier q tel qu'il existe K objets avec `1000 × (V total) ≥ q × (P total)`. Cette condition se réécrit
`somme sur les objets choisis de (1000 × V_i − q × P_i) ≥ 0`.
Pour q fixé, chaque objet a donc une « note » `1000 × V_i − q × P_i` qui ne dépend que de lui. La plus grande somme possible de K notes s'obtient en prenant les K plus grandes notes : on trie et on additionne. Si cette somme est ≥ 0, q est possible.

Si q est possible, q − 1 l'est aussi (les notes ne font qu'augmenter quand q diminue). Les réponses sont donc oui, oui, …, oui, non, non : on cherche le dernier « oui » par dichotomie, entre `0` (toujours possible) et `1000 × max(V) + 1` (jamais possible, car le rapport ne dépasse pas max(V) / 1).

**Complexité.** La dichotomie fait environ log₂(10⁷) ≈ 24 tours ; chacun calcule N notes et les trie : O(N log N × log(1000 × max V)), quelques millions d'opérations.

**Pourquoi la solution naïve ne marche pas.** Essayer tous les choix de K objets parmi N est impossible : il y en a des milliards dès N = 40 et K = 20. Et le glouton « meilleurs rapports d'abord » donne une réponse fausse, comme on l'a vu.

**Pièges.**
- Travaille uniquement avec des entiers : la condition `1000 × V ≥ q × P` évite toute division et tout arrondi.
- Les notes peuvent atteindre 10⁷ × 10⁴ = 10¹¹ en valeur absolue : utilise des `long long` en C++.
- La note dépend de q : il faut refaire le tri à chaque tour de la dichotomie, l'ordre des objets change.
