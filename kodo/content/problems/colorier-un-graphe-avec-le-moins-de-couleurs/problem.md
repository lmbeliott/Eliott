---
id: colorier-un-graphe-avec-le-moins-de-couleurs
title: Colorier un graphe avec le moins de couleurs
chapter: p4-exploration
order: 8
synthesis: true
tags: [backtracking, graphes]
samples: 2
---

## Énoncé
On donne un graphe non orienté de `N` sommets et `M` arêtes. On veut attribuer une couleur à chaque sommet de sorte que les deux extrémités de chaque arête aient des couleurs différentes : par exemple, placer des examens sur des créneaux, deux examens qui ont un candidat commun ne pouvant pas avoir lieu en même temps.

Calculer le plus petit nombre de couleurs nécessaires (on l'appelle le **nombre chromatique** du graphe).

## Entrée
- La première ligne contient deux entiers `N` et `M`.
- Chacune des `M` lignes suivantes contient deux entiers distincts `A` et `B` : une arête relie les sommets `A` et `B`. Deux arêtes ne relient jamais les deux mêmes sommets.

## Sortie
Un seul entier : le nombre minimal de couleurs.

## Contraintes
- 1 ≤ N ≤ 30
- 0 ≤ M ≤ N(N − 1)/2

## Indices
1. Pour `k` = 1, 2, 3…, se demander si `k` couleurs suffisent, par un retour sur trace qui colorie les sommets un par un en n'essayant que les couleurs absentes chez les voisins déjà coloriés. Le premier `k` qui marche est la réponse.
2. Les couleurs sont interchangeables : échanger le rouge et le bleu dans un coloriage en donne un autre, tout aussi valable. Pour ne pas explorer `k!` fois le même coloriage, un sommet ne peut recevoir qu'une couleur déjà utilisée ou la **première** couleur encore jamais utilisée.
3. Colorier d'abord les sommets de plus grand degré fait apparaître les conflits plus tôt.

## Solution
On teste `k = 1, 2, 3, …` et l'on s'arrête au premier `k` pour lequel un coloriage existe. Pour un `k` donné, la fonction `colorier(i, utilisees)` colorie le `i`-ième sommet de la liste, sachant que les couleurs `0` à `utilisees − 1` ont déjà servi. Elle essaie chaque couleur `c < min(k, utilisees + 1)` qui n'apparaît chez aucun voisin déjà colorié, s'appelle sur le sommet suivant, et défait son choix en cas d'échec. Elle renvoie vrai dès qu'un coloriage complet est trouvé : on cherche **un** coloriage, pas tous.

**Briser la symétrie.** Dans un coloriage, renommer les couleurs donne un autre coloriage. La règle « une nouvelle couleur est toujours la plus petite jamais utilisée » ne garde qu'un représentant de chaque famille de coloriages qui se déduisent l'un de l'autre par un renommage : celui où les couleurs apparaissent dans l'ordre 0, 1, 2… le long de la liste des sommets. Aucun coloriage n'est perdu, et l'arbre est divisé par un facteur pouvant aller jusqu'à `k!`. C'est surtout utile quand la réponse est « non » : pour prouver que `k − 1` couleurs ne suffisent pas, il faut parcourir tout l'arbre.

**Ordre des sommets.** Les sommets de grand degré sont les plus contraints : les colorier en premier coupe les branches vouées à l'échec plus près de la racine.

**Correction.** Le retour sur trace essaie toutes les couleurs possibles pour chaque sommet, à la symétrie près : il trouve un coloriage à `k` couleurs s'il en existe un. Comme on teste les `k` dans l'ordre croissant, le premier succès donne le minimum. On retrouve des cas connus : 1 couleur si `M = 0`, 2 si le graphe est biparti et a une arête, 3 pour un cycle impair.

**Taille de l'arbre.** Elle dépend beaucoup du graphe. Les cas difficiles sont ceux où il faut prouver qu'un `k` ne suffit pas sans que cela se voie localement : le graphe de Mycielski à 23 sommets n'a aucun triangle mais demande 5 couleurs, et prouver que 4 ne suffisent pas fait visiter quelques dizaines de milliers de nœuds.
