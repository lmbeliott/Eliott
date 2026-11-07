---
id: plus-grand-ensemble-sans-voisins
title: Plus grand ensemble sans voisins
chapter: p4-exploration
order: 7
tags: [backtracking, graphes, bits]
samples: 2
---

## Énoncé
On donne un graphe non orienté de `N` sommets et `M` arêtes. Un ensemble de sommets est **sans voisins** si aucune arête ne relie deux de ses sommets : par exemple, des invités dont aucun couple ne se dispute.

Calculer le plus grand nombre de sommets d'un ensemble sans voisins.

## Entrée
- La première ligne contient deux entiers `N` et `M`.
- Chacune des `M` lignes suivantes contient deux entiers distincts `A` et `B` : une arête relie les sommets `A` et `B`. Deux arêtes ne relient jamais les deux mêmes sommets.

## Sortie
Un seul entier : la taille du plus grand ensemble sans voisins.

## Contraintes
- 1 ≤ N ≤ 50
- 0 ≤ M ≤ N(N − 1)/2

## Indices
1. Essayer les `2^50` ensembles est hors de question. Un retour sur trace choisit un sommet `v` et explore deux branches : `v` est pris (ses voisins deviennent interdits), ou `v` est écarté.
2. Coder l'ensemble des sommets encore disponibles par un entier de `N` bits. Si la taille actuelle plus le nombre de sommets disponibles ne dépasse pas le meilleur résultat connu, la branche est inutile.
3. Si un sommet `v` n'a plus de voisins disponibles, ou si ses voisins disponibles sont tous reliés entre eux, on peut le prendre sans essayer l'autre branche. Pourquoi ?

## Solution
On code les voisins de chaque sommet par un **masque** de `N` bits, et l'ensemble des sommets encore disponibles par un masque `restants`. La fonction `chercher(restants, taille)` explore les ensembles qui complètent l'ensemble déjà choisi (de taille `taille`).

**Règle de choix forcé.** Si les voisins disponibles de `v` sont deux à deux voisins (en particulier si `v` a 0 ou 1 voisin disponible), on peut prendre `v`. Argument d'**échange** : un ensemble sans voisins contient au plus un sommet parmi `v` et ses voisins disponibles, puisqu'ils sont tous reliés entre eux. S'il en contient un, `u`, on remplace `u` par `v` : les voisins de `v` sont tous parmi ceux de `u` ou `u` lui-même, donc l'ensemble reste sans voisins et garde sa taille. S'il n'en contient aucun, on peut ajouter `v`. Il existe donc toujours une meilleure solution qui contient `v` : on le prend, on retire ses voisins, et l'on recommence tant que la règle s'applique.

**Coupure.** Si `taille` plus le nombre de bits de `restants` ne dépasse pas le meilleur résultat trouvé, cette branche ne peut pas faire mieux : on l'abandonne.

**Branchement.** Sinon, on choisit le sommet disponible `v` de plus grand degré, et l'on essaie : prendre `v` (on retire `v` et ses voisins), puis écarter `v` (on retire seulement `v`). Prendre un sommet de grand degré fait disparaître beaucoup de sommets d'un coup.

**Taille de l'arbre.** Quand on branche, `v` a au moins 2 voisins disponibles (sinon la règle de choix forcé s'applique) : la première branche retire au moins 3 sommets, la seconde au moins 1. Le nombre de feuilles `T(n)` vérifie donc `T(n) ≤ T(n − 1) + T(n − 3)`, ce qui donne `T(n) ≤ 1,47ⁿ` environ, au lieu de `2ⁿ`. En pratique, avec la coupure, l'arbre compte au plus quelques milliers de nœuds sur les tests.

**Remarque.** Ce problème, l'**ensemble indépendant maximum**, est réputé difficile en général : on ne connaît aucun algorithme polynomial. Les techniques de ce type (règles de réduction, coupures, branchement) sont celles qu'on utilise en pratique.
