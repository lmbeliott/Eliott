---
id: k-ieme-sommet-d-un-chemin
title: K-ième sommet d'un chemin
chapter: n4-arbres
order: 4
tags: [graphes, bits]
samples: 2
---

## Énoncé
On donne un arbre de `N` sommets, numérotés de `1` à `N`, enraciné au sommet `1`. Entre deux sommets `U` et `V`, il existe un unique chemin `U = x₀, x₁, …, x_d = V` qui ne passe jamais deux fois par le même sommet ; `d` est la distance entre `U` et `V`.

Écris un programme qui répond à `Q` questions : pour chaque question `U V K`, affiche le sommet `x_K` de ce chemin, c'est-à-dire le sommet situé à `K` arêtes de `U` en allant vers `V`, ou `-1` si `K > d`.

## Entrée
- La première ligne contient deux entiers `N` et `Q`.
- La deuxième ligne contient `N - 1` entiers : le parent de chacun des sommets `2, 3, …, N`, dans cet ordre. Elle est vide si `N = 1`.
- Chacune des `Q` lignes suivantes contient trois entiers `U`, `V` et `K` : une question.

## Sortie
`Q` lignes : pour chaque question, dans l'ordre, le numéro du sommet demandé, ou `-1`.

## Contraintes
- 1 ≤ N ≤ 12 000
- 1 ≤ Q ≤ 6 000
- 1 ≤ U, V ≤ N (`U` et `V` peuvent être égaux)
- 0 ≤ K ≤ N

## Indices
1. Le chemin de `U` à `V` monte de `U` jusqu'à leur **plus proche ancêtre commun** `W`, puis descend jusqu'à `V`. Avec les profondeurs, sa longueur est `prof(U) + prof(V) - 2 × prof(W)`.
2. Si `K ≤ prof(U) - prof(W)`, la réponse est l'ancêtre de `U` situé `K` niveaux plus haut. Sinon, c'est un ancêtre de `V`, situé `d - K` niveaux au-dessus de `V`.
3. Remonter niveau par niveau est trop lent sur un arbre profond. Précalcule `haut[j][v]`, l'ancêtre de `v` situé `2ʲ` niveaux plus haut : `haut[j][v] = haut[j-1][haut[j-1][v]]`. Remonter de `K` niveaux se fait alors en suivant les bits de `K` ; l'ancêtre commun se trouve aussi en O(log N).

## Solution
On calcule d'abord la profondeur de chaque sommet par un parcours en largeur depuis la racine.

**Remontée binaire** (*binary lifting*). On construit la table `haut[j][v]` : l'ancêtre de `v` situé `2ʲ` niveaux plus haut, ou `0` si l'on sort de l'arbre. La ligne `0` contient les parents, et `haut[j][v] = haut[j-1][haut[j-1][v]]` : monter de `2ʲ`, c'est monter deux fois de `2ʲ⁻¹`. Il faut `⌈log₂ N⌉ ≈ 14` lignes.

- **Ancêtre à distance `k`** : on écrit `k` en binaire et, pour chaque bit `j` à `1`, on fait `v = haut[j][v]`. O(log N).
- **Plus proche ancêtre commun** de `u` et `v` : on remonte d'abord le plus profond des deux jusqu'à la profondeur de l'autre. S'ils sont égaux, c'est fini. Sinon, pour `j` de la plus grande puissance à `0`, si `haut[j][u] ≠ haut[j][v]`, on remonte les deux. À la fin, `u` et `v` sont deux enfants différents de l'ancêtre commun, qui est leur parent. O(log N).

**Réponse à une question** `U V K`. Soit `W` l'ancêtre commun, `a = prof(U) - prof(W)` la longueur de la montée et `b = prof(V) - prof(W)` celle de la descente ; `d = a + b`.
- si `K > d`, la réponse est `-1` ;
- si `K ≤ a`, c'est l'ancêtre de `U` à distance `K` ;
- sinon, le sommet est sur la descente, à `d - K` arêtes de `V` : c'est l'ancêtre de `V` à distance `d - K`.

Complexité : **O(N log N)** pour la table, **O(log N)** par question.

Pourquoi la méthode naïve échoue : remonter les parents un par un pour construire le chemin coûte jusqu'à `2N` étapes par question sur un arbre profond, soit environ 10⁸ étapes pour 6 000 questions, trop pour Python.

Pièges :
- `U = V` est permis : la distance est `0`, la réponse est `U` pour `K = 0` et `-1` sinon.
- Sur la descente, on compte depuis `V` : l'ancêtre cherché est à `d - K` niveaux au-dessus de `V`, pas `K - a`.
- La table doit permettre de remonter jusqu'à `N - 1` niveaux : vérifie que `2^(nombre de lignes)` dépasse la plus grande profondeur.
