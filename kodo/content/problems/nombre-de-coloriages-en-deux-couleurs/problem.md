---
id: nombre-de-coloriages-en-deux-couleurs
title: Nombre de coloriages en deux couleurs
chapter: p4-graphes
order: 5
tags: [graphes, parcours-en-largeur, mathématiques]
samples: 3
---

## Énoncé
On donne un graphe non orienté de `N` sommets et `M` arêtes. On veut peindre chaque sommet en blanc ou en noir, de sorte que les deux extrémités de chaque arête soient de couleurs différentes.

Compter les coloriages qui conviennent. Deux coloriages sont différents si au moins un sommet n'a pas la même couleur. Comme ce nombre peut être très grand, afficher son reste dans la division par 1 000 000 007.

## Entrée
- La première ligne contient deux entiers `N` et `M` : le nombre de sommets (numérotés de `1` à `N`) et le nombre d'arêtes.
- Chacune des `M` lignes suivantes contient deux entiers `A` et `B` : une arête relie les sommets `A` et `B`.

Une arête peut relier un sommet à lui-même, et deux sommets peuvent être reliés par plusieurs arêtes.

## Sortie
Un seul entier : le nombre de coloriages qui conviennent, modulo 1 000 000 007.

## Contraintes
- 1 ≤ N ≤ 100 000
- 0 ≤ M ≤ 10 000
- 1 ≤ A, B ≤ N

## Indices
1. Dans une composante connexe, une fois la couleur d'un sommet choisie, celle de tous les autres est imposée.
2. Chaque composante connexe admet donc soit exactement 2 coloriages, soit aucun.
3. Si toutes les composantes sont coloriables, la réponse est 2 puissance le nombre de composantes. Une boucle rend tout coloriage impossible.

## Solution
Dans une composante connexe, choisissons la couleur d'un sommet `s`. Pour tout sommet `v` de la composante, un chemin `s → … → v` impose les couleurs le long du chemin : elles alternent, donc la couleur de `v` est imposée. Une composante a ainsi au plus 2 coloriages (un par couleur de `s`), et si elle en a un, l'échange des deux couleurs en donne un second : elle en a 0 ou 2.

Les composantes se colorient indépendamment les unes des autres. Si l'une d'elles n'a pas de coloriage, la réponse est 0 ; sinon, avec `c` composantes, elle vaut `2^c`.

Pour chaque composante, un parcours en largeur colorie le sommet de départ en blanc, puis chaque voisin découvert de la couleur opposée à celle du sommet défilé. Si un voisin déjà colorié a la même couleur que le sommet défilé, la composante n'est pas coloriable : le cours montre qu'elle contient alors un cycle de longueur impaire. Une boucle `A A` est détectée de la même façon, puisque `A` a la même couleur que lui-même. Au passage, on multiplie la réponse par 2, modulo 1 000 000 007, à chaque nouvelle composante.

**Complexité.** O(N + M). Essayer les `2^N` coloriages est impossible dès que `N` dépasse 30.
