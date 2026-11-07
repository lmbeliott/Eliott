---
id: marches-de-longueur-exacte
title: Marches de longueur exacte
chapter: n4-graphes
order: 8
tags: [graphes, parcours-en-largeur]
samples: 3
---

## Énoncé
On donne un graphe non orienté de `N` sommets et `M` arêtes. Une **marche** de longueur `K` est une suite de sommets `v₀, v₁, …, v_K` dans laquelle deux sommets qui se suivent sont toujours reliés par une arête. Une marche peut repasser autant de fois qu'elle veut par un même sommet ou une même arête. Une marche de longueur `0` ne contient que son sommet de départ.

Écris un programme qui répond à `Q` questions. Chaque question donne un sommet `V` et un entier `K`, et demande s'il existe une marche de longueur **exactement** `K` qui part du sommet `1` et se termine au sommet `V`.

## Entrée
- La première ligne contient deux entiers `N` et `M` : le nombre de sommets (numérotés de `1` à `N`) et le nombre d'arêtes.
- Chacune des `M` lignes suivantes contient deux entiers distincts `A` et `B` : une arête relie les sommets `A` et `B`.
- La ligne suivante contient un entier `Q`.
- Chacune des `Q` lignes suivantes contient deux entiers `V` et `K`.

Deux sommets peuvent être reliés par plusieurs arêtes.

## Sortie
`Q` lignes : pour chaque question, dans l'ordre, `OUI` s'il existe une marche de longueur exactement `K` du sommet `1` au sommet `V`, `NON` sinon.

## Contraintes
- 1 ≤ N ≤ 5 000
- 0 ≤ M ≤ 8 000
- 1 ≤ A, B ≤ N et A ≠ B
- 1 ≤ Q ≤ 5 000
- 1 ≤ V ≤ N
- 0 ≤ K ≤ 10⁹

## Indices
1. Avancer pas à pas pendant `K` étapes est impossible pour `K = 10⁹`. Si tu as une marche de longueur `d` de `1` à `V`, comment obtenir une marche de longueur `d + 2` qui arrive aussi en `V` ?
2. Un aller-retour sur la dernière arête allonge la marche de `2`. Il suffit donc de connaître, pour chaque sommet, la plus petite longueur **paire** et la plus petite longueur **impaire** d'une marche qui y arrive depuis `1`.
3. Fais un parcours en largeur sur les **états** (sommet, parité de la longueur) : depuis l'état `(u, p)`, chaque arête `u – v` mène à l'état `(v, 1 − p)`. Attention au cas où le sommet `1` n'a aucune arête.

## Solution
**Allonger une marche.** Si une marche de longueur `d ≥ 1` va de `1` à `V`, sa dernière arête relie un sommet `u` à `V`. En ajoutant `u` puis `V` à la fin, on obtient une marche de longueur `d + 2` qui arrive toujours en `V`. En recommençant, on obtient toutes les longueurs `d + 2`, `d + 4`, … Donc, si `pair[V]` et `impair[V]` sont les plus petites longueurs paire et impaire d'une marche de `1` à `V`, il existe une marche de longueur `K` si et seulement si la plus petite longueur de même parité que `K` existe et vaut au plus `K`.

**Calculer les deux plus petites longueurs.** On construit un graphe d'**états** : l'état `(v, p)` signifie « être en `v` après une marche dont la longueur a la parité `p` ». Chaque arête `u – v` du graphe relie `(u, 0)` à `(v, 1)` et `(u, 1)` à `(v, 0)`. Une marche de `1` à `V` de longueur `d` correspond exactement à un chemin de `d` pas de `(1, 0)` à `(V, d mod 2)`. Un parcours en largeur depuis `(1, 0)` donne donc `pair[V]` et `impair[V]` pour tous les sommets à la fois. Il y a `2N` états et `4M` transitions.

**Le cas du départ isolé.** L'allongement utilise la dernière arête de la marche : il ne marche pas pour la marche de longueur `0`, qui n'a pas d'arête. Si le sommet `1` a au moins une arête, on fait l'aller-retour sur elle. S'il n'en a aucune, la seule marche possible est celle de longueur `0`, et la réponse est `OUI` seulement pour `V = 1` et `K = 0`.

Sur le deuxième exemple, le triangle `1 – 2 – 3` permet de revenir en `1` en `3` pas : `impair[1] = 3`, donc `(1, 1)` donne `NON` et `(1, 3)` donne `OUI`. Pour le sommet `4`, `pair[4] = 2` (par `1 – 3 – 4`) et `impair[4] = 3` (par `1 – 2 – 3 – 4`). Sur le premier exemple, le graphe se colorie en deux couleurs (`1`, `3` et `5` d'un côté, `2` et `4` de l'autre) : chaque pas change de couleur, donc toute marche de `1` à `5` a une longueur paire, et `impair[5]` n'existe pas.

**Complexité.** Un parcours en largeur sur `2N` états, puis `O(1)` par question : **O(N + M + Q)**.

**Pourquoi la solution naïve est trop lente.** Calculer l'ensemble des sommets atteints après `1`, `2`, …, `K` pas coûte `K × (N + M)` : impossible pour `K = 10⁹`. Relancer un parcours pour chaque question coûte `Q × (N + M)`, de l'ordre de 10⁸ opérations.

**Pièges.**
- La distance ordinaire ne suffit pas : dans le deuxième exemple, la distance de `1` à `1` est `0`, mais il existe une marche de longueur `3`. La parité de `K − distance` ne suffit pas non plus : dans le premier exemple, `5` est à distance `2` mais n'est atteint par aucune marche de longueur impaire.
- Une marche de longueur `0` existe toujours de `1` à `1`, même si le sommet `1` est isolé ; mais alors aucune marche plus longue n'existe (troisième exemple).
