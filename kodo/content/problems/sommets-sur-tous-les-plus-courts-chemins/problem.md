---
id: sommets-sur-tous-les-plus-courts-chemins
title: Sommets sur tous les plus courts chemins
chapter: n4-graphes
order: 7
tags: [graphes, parcours-en-largeur]
samples: 2
---

## Énoncé
On donne un graphe non orienté de `N` sommets et `M` arêtes, ainsi que deux sommets distincts `S` et `T`. La longueur d'un chemin est son nombre d'arêtes ; un **plus court chemin** de `S` à `T` est un chemin de `S` à `T` de longueur minimale. Il peut y en avoir plusieurs.

Écris un programme qui trouve les sommets par lesquels passent **tous** les plus courts chemins de `S` à `T`. `S` et `T` en font toujours partie.

## Entrée
- La première ligne contient quatre entiers `N`, `M`, `S` et `T` : le nombre de sommets (numérotés de `1` à `N`), le nombre d'arêtes, le départ et l'arrivée.
- Chacune des `M` lignes suivantes contient deux entiers distincts `A` et `B` : une arête relie les sommets `A` et `B`.

Deux sommets peuvent être reliés par plusieurs arêtes.

## Sortie
Deux lignes : le nombre `K` de sommets par lesquels passent tous les plus courts chemins de `S` à `T`, puis ces `K` sommets dans l'ordre croissant, séparés par des espaces.

Si `T` n'est pas accessible depuis `S`, affiche seulement `-1`.

## Contraintes
- 2 ≤ N ≤ 10 000
- 0 ≤ M ≤ 10 000
- 1 ≤ S, T ≤ N et S ≠ T
- 1 ≤ A, B ≤ N et A ≠ B

## Indices
1. Retirer chaque sommet à tour de rôle et relancer un parcours coûte `N` parcours : trop lent pour `N = 10 000`. Fais plutôt un parcours en largeur depuis `S` et un autre depuis `T`.
2. Avec `dS[v]` la distance de `S` à `v` et `dT[v]` celle de `v` à `T`, le sommet `v` est sur **au moins un** plus court chemin si et seulement si `dS[v] + dT[v] = dS[T]`.
3. Un plus court chemin de longueur `D` passe par exactement un sommet à distance `k` de `S`, pour chaque `k` de `0` à `D`. Combien de sommets d'au moins un plus court chemin y a-t-il à chaque distance ?

## Solution
On fait deux parcours en largeur : l'un depuis `S` donne `dS[v]`, l'autre depuis `T` donne `dT[v]`. Si `T` n'est pas atteint, on affiche `-1`. Sinon, soit `D = dS[T]`.

**Les sommets d'au moins un plus court chemin.** Un sommet `v` est sur un plus court chemin si et seulement si `dS[v] + dT[v] = D` : il suffit de recoller un plus court chemin de `S` à `v` et un plus court chemin de `v` à `T`. Le long d'un plus court chemin, le `k`-ième sommet est exactement à distance `k` de `S` (sinon on pourrait raccourcir le chemin). Chaque plus court chemin passe donc par **un seul** sommet de chaque « couche » `k = 0, 1, …, D`.

**Les sommets obligatoires.** Pour chaque distance `k`, on compte les sommets `v` d'au moins un plus court chemin avec `dS[v] = k`.
- S'il n'y en a qu'un, tout plus court chemin passe par lui : il est obligatoire.
- S'il y en a deux ou plus, aucun d'eux n'est obligatoire : un plus court chemin qui passe par l'un ne peut pas passer par l'autre, puisqu'il n'a qu'un sommet à cette distance.

Sur le premier exemple, `D = 4` et les couches sont `{1}`, `{2, 3}`, `{4}`, `{5, 6}`, `{7}` : les sommets obligatoires sont `1`, `4` et `7`. Sur le deuxième, le seul plus court chemin est `1 - 2 - 3 - 5`, de longueur `3` ; le chemin par `4`, `6` et `7` est plus long.

**Complexité.** Deux parcours en largeur et un passage sur les sommets : **O(N + M)**.

**Pourquoi la solution naïve est trop lente.** Retirer chaque sommet puis vérifier par un parcours si la distance de `S` à `T` augmente coûte `N` parcours, soit **O(N × (N + M))** : 2 × 10⁸ opérations ici.

**Pièges.**
- Un sommet obligatoire n'est pas forcément un sommet dont le retrait coupe `S` de `T` : dans le deuxième exemple, sans le sommet `2`, on va encore de `1` à `5` par `4`, `6` et `7`, mais par un chemin plus long.
- Il faut ne compter, dans chaque couche, que les sommets qui sont sur un plus court chemin : les autres sommets à distance `k` de `S` ne comptent pas.
