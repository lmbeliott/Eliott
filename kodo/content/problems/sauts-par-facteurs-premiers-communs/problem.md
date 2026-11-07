---
id: sauts-par-facteurs-premiers-communs
title: Sauts par facteurs premiers communs
chapter: p4-plus-courts-chemins
order: 8
synthesis: true
tags: [graphes, dijkstra, arithmétique, mathématiques]
samples: 2
---

## Énoncé
Une rangée de `N` cases, numérotées de `1` à `N`, porte des entiers `A₁, …, A_N`. On part de la case `1` et l'on veut atteindre la case `N`. Deux mouvements sont possibles, dans un sens comme dans l'autre :
- passer d'une case à une case voisine, pour un coût `C` ;
- sauter de la case `i` à n'importe quelle case `j` telle que `A_i` et `A_j` ont un facteur premier commun `p` ; ce saut coûte `p`.

Afficher le coût total minimal.

Par exemple, avec `C = 10` et les nombres `4 15 49 10 35 21`, on saute de `4` à `10` (facteur 2, coût 2), de `10` à `15` (facteur 5, coût 5), puis de `15` à `21` (facteur 3, coût 3) : le coût total est 10.

## Entrée
- La première ligne contient `N` et `C`.
- La deuxième ligne contient les `N` entiers `A₁ … A_N`.

## Sortie
Un seul entier : le coût minimal pour aller de la case `1` à la case `N`.

## Contraintes
- 2 ≤ N ≤ 15 000
- 1 ≤ C ≤ 10⁶
- 2 ≤ A_i ≤ 100 000

## Indices
1. Relier directement toutes les paires de cases qui partagent un facteur premier peut donner plus de 10⁸ arêtes (pensez à des nombres tous pairs).
2. Ajouter un sommet par nombre premier `p`, un « carrefour » : une case dont le nombre est multiple de `p` y entre pour un coût `p`, et en ressort gratuitement vers n'importe quelle autre case multiple de `p`.
3. Les facteurs premiers de chaque `A_i` s'obtiennent vite avec un crible qui calcule le plus petit facteur premier de chaque entier jusqu'à 100 000. Puis Dijkstra, et attention aux dépassements.

## Solution
**Modélisation.** Le graphe naturel (une arête entre deux cases dès qu'elles partagent un facteur premier) peut avoir `N² / 2` arêtes. On ajoute plutôt un sommet par nombre premier `p`, le **carrefour** de `p`. Pour chaque case `i` et chaque facteur premier `p` de `A_i`, on crée un arc `i → p` de coût `p` et un arc `p → i` de coût `0`. On garde les arcs `i ↔ i + 1` de coût `C`. Un saut de `i` à `j` par le facteur `p` correspond exactement au chemin `i → p → j`, de même coût `p` ; réciproquement, tout passage par un carrefour `i → p → j` est un saut autorisé, puisque `p` divise `A_i` et `A_j`. Les coûts minimaux sont donc les mêmes dans les deux graphes. On lance Dijkstra depuis la case `1`.

**Facteurs premiers.** Un crible calcule `ppf[x]`, le plus petit facteur premier de chaque `x ≤ max(A)` : pour chaque `i` premier avec `i² ≤ max`, on marque les multiples de `i` à partir de `i²` qui n'ont pas encore de facteur. Puis on factorise `A_i` en divisant par `ppf` tant que c'est possible. Un nombre au plus égal à 100 000 a au plus 6 facteurs premiers distincts (2 × 3 × 5 × 7 × 11 × 13 = 30 030, et × 17 dépasse 100 000).

**Complexité.** Le crible coûte O(V log log V) avec `V = max(A)`. Le graphe a au plus `N + V` sommets et `14 N` arcs environ : Dijkstra coûte O((N + V + 14N) log N). Le graphe explicite demanderait jusqu'à 10⁸ arêtes.

**Pièges.** Le carrefour doit coûter `p` à l'entrée et `0` à la sortie (ou l'inverse), pas `p` dans les deux sens, qui compterait chaque saut deux fois. Ne relier une case qu'aux facteurs **distincts** de son nombre. Le coût peut dépasser 2³¹ (des milliers de pas de coût 10⁶) : `long long` en C++. Un saut peut aussi ramener en arrière : le meilleur trajet n'avance pas toujours de gauche à droite.
