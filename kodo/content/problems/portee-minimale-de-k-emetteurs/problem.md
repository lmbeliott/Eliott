---
id: portee-minimale-de-k-emetteurs
title: Portée minimale de K émetteurs
chapter: p4-dichotomie
order: 5
tags: [dichotomie, tri]
samples: 2
---

## Énoncé
N maisons sont construites le long d'une route droite, la maison i au kilomètre xᵢ. On veut installer K émetteurs, chacun à un kilomètre entier au choix, qui ont tous la même **portée** R : un émetteur placé au kilomètre p couvre toutes les maisons dont la position x vérifie |x − p| ≤ R.

Afficher la plus petite portée R, entière, qui permet de couvrir toutes les maisons avec K émetteurs.

## Entrée
La première ligne contient N et K. La deuxième ligne contient les N positions x₁, …, x_N, dans le désordre ; plusieurs maisons peuvent être au même kilomètre.

## Sortie
La plus petite portée possible.

## Contraintes
- 1 ≤ K ≤ N ≤ 10 000
- 0 ≤ xᵢ ≤ 10⁹

## Indices
1. Pour une portée R fixée, comment savoir si K émetteurs suffisent ? Trier les maisons, et s'occuper d'abord de la plus à gauche.
2. La maison la plus à gauche doit être couverte par un émetteur : autant le placer le plus à droite possible, au kilomètre x + R. Il couvre alors toutes les maisons jusqu'au kilomètre x + 2R.
3. Si R suffit, toute portée plus grande suffit aussi : dichotomie sur R, entre 0 et 10⁹.

## Solution
**Tester une portée.** On trie les positions. Pour une portée R, on compte le nombre minimal d'émetteurs : la maison la plus à gauche, au kilomètre x, doit être couverte, donc un émetteur est placé entre x − R et x + R. Le placer en x + R est le meilleur choix : il n'y a aucune maison avant x, et cet émetteur couvre tout ce que couvrirait un émetteur placé plus à gauche, et davantage. Il couvre les maisons jusqu'au kilomètre x + 2R ; on recommence avec la première maison au-delà. On compte ainsi le nombre d'émetteurs utilisés, et R convient s'il est au plus K. Un seul passage sur la liste triée : O(N).

**Pourquoi ce compte est minimal.** Par récurrence sur le nombre d'émetteurs : après j émetteurs, le procédé a couvert un préfixe de maisons au moins aussi long que n'importe quelle autre façon de placer j émetteurs. C'est vrai au départ, et l'argument ci-dessus le conserve : la première maison non couverte doit l'être par un nouvel émetteur, qui ne peut pas aller plus loin que x + 2R.

**Dichotomie.** Si R convient, R + 1 aussi. La portée 10⁹ convient toujours (un seul émetteur au kilomètre 0 suffit), et on cherche la plus petite qui convient, avec l'invariant « lo ne convient pas, hi convient », en partant de lo = −1 et hi = 10⁹. Coût total : O(N log N) pour le tri, puis une trentaine de tests en O(N). Essayer toutes les portées R = 0, 1, 2, … coûterait jusqu'à 5 × 10⁸ tests.
