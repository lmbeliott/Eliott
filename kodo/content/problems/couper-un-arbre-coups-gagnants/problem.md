---
id: couper-un-arbre-coups-gagnants
title: "Couper un arbre : coups gagnants"
chapter: n4-defis
order: 5
tags: [graphes, programmation-dynamique, bits]
samples: 2
---

## Énoncé
Un arbre a `N + 1` sommets numérotés de `0` à `N`. Le sommet `0` est le **sol**. Pour chaque `i` de `1` à `N`, une arête relie le sommet `i` à son parent `P[i]`, avec `P[i] < i`.

Deux joueurs jouent à tour de rôle. Un coup consiste à couper une arête encore présente. Toutes les arêtes qui ne sont plus reliées au sol disparaissent alors aussi. Le joueur qui ne peut plus jouer, parce qu'il ne reste aucune arête, a perdu.

Un premier coup est **gagnant** si, après lui, le premier joueur peut gagner quoi que fasse son adversaire. Écris un programme qui compte les premiers coups gagnants, c'est-à-dire les arêtes dont la coupe est un coup gagnant. La réponse est `0` si le premier joueur perd quoi qu'il fasse.

## Entrée
La première ligne contient deux entiers `N` et `G`.

**Si `G = 0`**, la deuxième ligne contient les `N` entiers `P[1]`, …, `P[N]`.

**Si `G > 0`**, la deuxième ligne contient deux entiers `S` et `K`, et les parents sont produits par un générateur. On part de `x = G`, et chaque appel à `suivant()` fait :
- `x ← (x × 6364136223846793005 + 1442695040888963407) mod 2⁶⁴` ;
- puis renvoie `x` divisé par `2³³` (division entière).

Pour `i` de `1` à `N`, dans l'ordre : `P[i] = max(0, i - S × (1 + (suivant() mod K)))`.

Avec `G = 7`, les premiers appels à `suivant()` renvoient `1059165278`, `2052263231` et `1946856753`. Dans le deuxième exemple (`N = 9`, `S = 2`, `K = 2`), les parents sont `0 0 0 0 1 2 5 6 5`. En C++, le calcul modulo 2⁶⁴ est automatique avec `unsigned long long`. En Python, utilise `% 2**64`.

## Sortie
Un seul entier : le nombre de premiers coups gagnants.

## Contraintes
- 1 ≤ N ≤ 200 000
- 0 ≤ P[i] < i
- 1 ≤ S ≤ N et 1 ≤ K ≤ N

## Indices
1. Le jeu se découpe en jeux indépendants, un par arête qui part du sol, et le théorème de Sprague-Grundy s'applique : une position est perdante pour celui qui doit jouer exactement quand le XOR des nombres de Grundy des morceaux vaut `0`. Commence par une seule branche : un chemin de `k` arêtes posé sur le sol se comporte comme un tas de Nim de taille `k`.
2. Plus généralement, une arête posée sur un sommet `c` se comporte comme un chemin dont la longueur est `1 +` (la valeur de ce qu'il y a au-dessus de `c`). On en déduit, des feuilles vers le sol : `g(v) = XOR sur les enfants c de (g(c) + 1)`. Le premier joueur gagne si `g(0) ≠ 0`.
3. Pour compter les coups gagnants, descends du sol vers les feuilles en calculant `besoin(v)` : la valeur que `g(v)` doit prendre après le coup pour que le sol vaille `0`. Comme `g(p)` dépend de `g(v)` par un XOR, `besoin(v)` se déduit de `besoin(p)` en O(1). Couper l'arête `(p, v)` change `g(p)` en `g(p) XOR (g(v) + 1)`.

## Solution
**Nombres de Grundy.** Coupons d'abord l'arbre au niveau du sol : chaque arête qui part du sol porte un morceau indépendant, et un coup ne touche qu'un morceau. D'après le théorème de **Sprague-Grundy**, la position est perdante pour le joueur qui doit jouer si et seulement si le XOR des nombres de Grundy des morceaux est nul.

Pour un sommet `v`, notons `g(v)` le nombre de Grundy de tout ce qui pend au-dessus de `v`. Un résultat classique (le « principe de la colonne ») dit que l'arête `(v, c)` surmontée du sous-arbre de `c` vaut `g(c) + 1`. On peut le vérifier par récurrence : les coups possibles sont couper `(v, c)` (on arrive à `0`) ou jouer au-dessus de `c`. Le premier donne `0`, le second toutes les valeurs `h + 1` où `h` parcourt les options de `c`, et le mex de tout cela vaut `g(c) + 1`. D'où :

`g(v) = XOR sur les enfants c de v de (g(c) + 1)`,

calculé en parcourant `v` de `N` à `1`, car `P[v] < v`. Le premier joueur gagne si et seulement si `g(0) ≠ 0`.

**Compter les coups gagnants.** Un coup est gagnant s'il amène `g(0)` à `0`. Notons `besoin(v)` la valeur que `g(v)` doit avoir après un coup joué au-dessus de `v` pour que le sol tombe à `0`, ou `-1` si c'est impossible. On a `besoin(0) = 0`. Pour un enfant `v` de `p`, un coup au-dessus de `v` change `g(p)` en `g(p) XOR (g(v) + 1) XOR (g'(v) + 1)`. Il faut donc `g'(v) + 1 = besoin(p) XOR g(p) XOR (g(v) + 1)`. Si ce nombre vaut `0`, c'est impossible (`g'(v) + 1 ≥ 1`). Sinon, `besoin(v)` vaut ce nombre moins `1`. Enfin, couper l'arête `(p, v)` elle-même donne `g'(p) = g(p) XOR (g(v) + 1)` : c'est un coup gagnant si cette valeur est égale à `besoin(p)`. Comme `P[v] < v`, on parcourt `v` de `1` à `N`.

Complexité : **O(N)**.

Pourquoi les idées simples échouent :
- Explorer l'arbre de jeu est exponentiel.
- Après avoir calculé les `g`, on peut tester chaque arête en recalculant les valeurs sur le chemin jusqu'au sol. Cela coûte O(N × profondeur), soit environ 10¹⁰ opérations sur les tests en forme de longues branches.

Pièges :
- `g(v) + 1`, et non `g(v)` : oublier le `+ 1` donne le XOR de Nim ordinaire, qui est faux ici.
- Un `besoin` impossible (`-1`) se propage à tout le sous-arbre : aucun coup au-dessus ne peut gagner.
- La réponse peut valoir `0` : la position de départ est alors perdante.
