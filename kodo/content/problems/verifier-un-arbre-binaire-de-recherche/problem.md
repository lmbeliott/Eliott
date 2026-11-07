---
id: verifier-un-arbre-binaire-de-recherche
title: Vérifier un arbre binaire de recherche
chapter: p4-arbres-binaires
order: 4
tags: [parcours-en-largeur]
samples: 3
---

## Énoncé
Un arbre binaire a `N` nœuds, numérotés de `1` à `N` ; chaque nœud porte une **clé** entière. C'est un **arbre binaire de recherche** si, pour chaque nœud `v`, toutes les clés du sous-arbre gauche de `v` sont strictement plus petites que la clé de `v`, et toutes celles du sous-arbre droit strictement plus grandes.

Dire si l'arbre donné est un arbre binaire de recherche.

## Entrée
- La première ligne contient `N`.
- La ligne `i + 1` (pour `i` de 1 à `N`) contient trois entiers `K`, `G` et `D` : la clé du nœud `i`, puis ses fils gauche et droit (`0` si le fils n'existe pas).

Les données décrivent toujours un arbre binaire ; sa racine est le seul nœud qui n'est le fils d'aucun autre.

## Sortie
`OUI` si l'arbre est un arbre binaire de recherche, `NON` sinon.

## Contraintes
- 1 ≤ N ≤ 5 000
- −10⁹ ≤ K ≤ 10⁹

## Indices
1. Vérifier seulement que chaque fils gauche est plus petit que son père, et chaque fils droit plus grand, ne suffit pas : regarder le troisième exemple.
2. Chaque nœud doit avoir sa clé dans un intervalle imposé par tous ses ancêtres. En descendant à gauche d'un nœud de clé `k`, la borne supérieure devient `k` ; en descendant à droite, la borne inférieure devient `k`.
3. Autre méthode : un arbre est un arbre binaire de recherche si et seulement si son parcours infixe donne des clés strictement croissantes.

## Solution
On associe à chaque nœud un intervalle ouvert `]bas, haut[` dans lequel sa clé doit se trouver. La racine reçoit `]−∞, +∞[`. Si un nœud de clé `k` a reçu `]bas, haut[`, son fils gauche reçoit `]bas, k[` et son fils droit `]k, haut[`. On parcourt l'arbre en largeur depuis la racine, avec une file de couples (nœud, intervalle), et l'on répond `NON` dès qu'une clé sort de son intervalle.

**Pourquoi c'est juste.** Par récurrence sur la profondeur, l'intervalle d'un nœud `w` est exactement l'ensemble des valeurs compatibles avec ses ancêtres : pour chaque ancêtre `v` dont `w` est dans le sous-arbre gauche, la clé de `w` doit être inférieure à celle de `v`, et la borne `haut` retient la plus petite de ces clés ; de même pour `bas`. La définition demande exactement que chaque nœud respecte toutes ces conditions.

**Le piège.** Dans le troisième exemple, chaque fils est bien placé par rapport à son père, mais la clé 6 est dans le sous-arbre **gauche** de la racine 5 tout en étant plus grande que 5.

**Complexité.** O(N). Le parcours en largeur évite la récursion, dont la profondeur pourrait atteindre 5 000 sur un arbre en forme de chemin.
