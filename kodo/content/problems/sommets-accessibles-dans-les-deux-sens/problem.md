---
id: sommets-accessibles-dans-les-deux-sens
title: Sommets accessibles dans les deux sens
chapter: p4-graphes
order: 3
tags: [graphes, parcours-en-largeur]
samples: 2
---

## Énoncé
On donne un graphe **orienté** de `N` sommets et `M` arcs : l'arc `A B` permet d'aller de `A` à `B`, mais pas de `B` à `A`. Un sommet `V` est **accessible** depuis `U` s'il existe un chemin de `U` à `V` qui suit les arcs dans leur sens ; tout sommet est accessible depuis lui-même.

Calculer trois nombres :
- le nombre de sommets accessibles depuis le sommet `1` ;
- le nombre de sommets depuis lesquels le sommet `1` est accessible ;
- le nombre de sommets qui vérifient les deux conditions à la fois.

## Entrée
- La première ligne contient deux entiers `N` et `M` : le nombre de sommets (numérotés de `1` à `N`) et le nombre d'arcs.
- Chacune des `M` lignes suivantes contient deux entiers `A` et `B` : un arc va du sommet `A` au sommet `B`.

Un arc peut aller d'un sommet vers lui-même, et un même arc peut apparaître plusieurs fois.

## Sortie
Les trois nombres sur une ligne, séparés par des espaces, dans l'ordre de l'énoncé.

## Contraintes
- 1 ≤ N ≤ 100 000
- 0 ≤ M ≤ 10 000
- 1 ≤ A, B ≤ N

## Indices
1. Le premier nombre s'obtient avec un seul parcours depuis le sommet `1`.
2. Pour le deuxième, lancer un parcours depuis chaque sommet est beaucoup trop lent. Comment savoir d'un seul coup quels sommets peuvent atteindre `1` ?
3. Retourner tous les arcs : un chemin de `V` à `1` dans le graphe devient un chemin de `1` à `V` dans le graphe retourné.

## Solution
Un parcours en largeur depuis `1`, qui suit les arcs dans leur sens, marque les sommets accessibles depuis `1`.

Pour le deuxième nombre, on construit le **graphe retourné** : pour chaque arc `A → B`, on ajoute l'arc `B → A`. Un chemin `V → … → 1` du graphe d'origine, lu à l'envers, est un chemin `1 → … → V` du graphe retourné, et inversement. Les sommets qui peuvent atteindre `1` sont donc exactement ceux qu'un parcours depuis `1` atteint dans le graphe retourné.

Le troisième nombre compte les sommets marqués par les deux parcours. Il vaut au moins `1`, à cause du sommet `1` lui-même.

**Complexité.** Deux parcours : O(N + M). Lancer un parcours depuis chacun des `N` sommets pour tester s'il atteint `1` coûterait O(N × (N + M)).

**Piège.** Dans un graphe orienté, l'arc `A B` n'est ajouté qu'à la liste de `A`. L'ajouter aussi à celle de `B` revient à traiter un autre graphe.
