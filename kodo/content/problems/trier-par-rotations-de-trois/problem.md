---
id: trier-par-rotations-de-trois
title: Trier par rotations de trois
chapter: p3-synthese
order: 4
tags: [tri, mathématiques]
samples: 2
---

## Énoncé
Une liste A₁, A₂, …, A_N peut être modifiée par une seule opération : choisir trois cases consécutives et faire tourner leurs valeurs, la dernière passant en tête. Ainsi (x, y, z) devient (z, x, y). Par exemple, en faisant tourner les cases 2 à 4 de `5 1 4 2 3`, on obtient `5 2 1 4 3`.

Pour chacune des T listes données, dire s'il est possible de la trier dans l'ordre croissant (au sens large) avec des opérations de ce type, en nombre quelconque.

## Entrée
La première ligne contient T. Chaque liste est décrite par deux lignes : la première contient N, la seconde les N valeurs.

## Sortie
T lignes : `OUI` si la liste peut être triée, `NON` sinon.

## Contraintes
- 1 ≤ T ≤ 1 000
- 1 ≤ N, et la somme des N ne dépasse pas 10 000
- 1 ≤ Aᵢ ≤ 10⁹

## Indices
1. Si toutes les valeurs sont différentes, compter les **inversions**, les paires de positions i < j avec Aᵢ > Aⱼ. Comment ce nombre change-t-il lors d'une opération ? Seules les paires formées à l'intérieur des trois cases peuvent changer.
2. Une opération change le nombre d'inversions de −2, 0 ou +2 : sa **parité** est un invariant. Une liste triée a 0 inversion. Réciproquement, on peut montrer qu'avec N ≥ 3 toute liste de valeurs différentes ayant un nombre pair d'inversions peut être triée.
3. Compter les inversions une par une coûte O(N²). La parité du nombre d'inversions est aussi celle de N moins le nombre de **cycles** de la permutation qui envoie chaque valeur à sa place dans la liste triée. Et si deux valeurs sont égales ?

## Solution
**Cas N ≤ 2.** Aucune opération n'est possible : la réponse est `OUI` si la liste est déjà triée, `NON` sinon.

**L'invariant.** Supposons les valeurs toutes différentes. Faire tourner (x, y, z) en (z, x, y) ne change l'ordre relatif d'aucune paire, sauf des paires {x, z} et {y, z}, qui sont toutes deux inversées. Le nombre d'inversions varie donc de −2, 0 ou +2 : sa parité ne change jamais. Une liste triée ayant 0 inversion, une liste avec un nombre impair d'inversions ne peut pas être triée.

**La réciproque, pour N ≥ 3.** On place les valeurs une par une, de la plus petite à la plus grande, au début de la partie non triée. Si la plus petite valeur restante est à une distance d ≥ 2 de sa place, une rotation des trois cases qui finissent sur elle la rapproche de 2. Si elle est juste à côté de sa place (d = 1) et qu'il reste au moins trois cases, deux rotations des trois premières cases non triées, (x, y, z) → (z, x, y) → (y, z, x), la mettent en place. On continue jusqu'à ce qu'il ne reste que deux cases. Comme la parité est conservée et qu'elle était paire, ces deux dernières valeurs ne peuvent pas être inversées (cela ferait une seule inversion) : la liste est triée.

**Valeurs égales.** Si deux valeurs sont égales (et N ≥ 3), on peut toujours trier : il suffit de les considérer comme différentes en choisissant l'ordre à donner aux deux valeurs égales dans la liste triée de façon que le nombre d'inversions soit pair (échanger ce choix change la parité).

**Calculer la parité.** On trie les positions par valeur pour connaître, pour chaque position i, la place p(i) de sa valeur dans la liste triée. La permutation p se décompose en **cycles** (i → p(i) → p(p(i)) → … → i). Un cycle de longueur ℓ s'obtient par ℓ − 1 échanges, et chaque échange de deux valeurs change la parité du nombre d'inversions. La parité cherchée est donc celle de N − (nombre de cycles). On parcourt les cycles en marquant les positions visitées : O(N).

**Coût.** O(N log N) par liste à cause du tri, au lieu de O(N²) pour compter les inversions une à une, et d'un nombre d'états astronomique pour une recherche exhaustive.
