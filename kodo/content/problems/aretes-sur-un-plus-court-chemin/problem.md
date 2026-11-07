---
id: aretes-sur-un-plus-court-chemin
title: Arêtes sur un plus court chemin
chapter: n4-chemins
order: 6
tags: [graphes, dijkstra]
samples: 2
---

## Énoncé
On donne un graphe non orienté de `N` sommets et `M` arêtes ; chaque arête a une longueur. Il peut y avoir plusieurs plus courts chemins du sommet `1` au sommet `N`.

Écris un programme qui compte les arêtes qui appartiennent à **au moins un** plus court chemin du sommet `1` au sommet `N`. Si le sommet `N` n'est pas accessible depuis le sommet `1`, la réponse est `0`.

## Entrée
- La première ligne contient deux entiers `N` et `M` : le nombre de sommets et le nombre d'arêtes.
- Chacune des `M` lignes suivantes contient trois entiers `A`, `B` et `T` : une arête de longueur `T` relie les sommets `A` et `B`.

## Sortie
Un seul entier : le nombre d'arêtes qui appartiennent à au moins un plus court chemin du sommet `1` au sommet `N`.

## Contraintes
- 1 ≤ N ≤ 5 000
- 0 ≤ M ≤ 8 000
- 1 ≤ A, B ≤ N et A ≠ B ; deux sommets peuvent être reliés par plusieurs arêtes, qui comptent séparément
- 1 ≤ T ≤ 1 000

## Indices
1. Un seul passage de Dijkstra depuis le sommet `1` donne un plus court chemin, pas tous. Lancer un calcul par arête est beaucoup trop lent.
2. Lance Dijkstra deux fois : une fois depuis le sommet `1`, une fois depuis le sommet `N`. Tu connais alors `d1[v]` et `dN[v]` pour tout sommet `v`.
3. Une arête `A – B` de longueur `T` est sur un plus court chemin si l'on peut aller au plus court de `1` à `A`, prendre l'arête, puis aller au plus court de `B` à `N`, sans dépasser la distance `d1[N]`. N'oublie pas l'autre sens.

## Solution
On calcule avec **Dijkstra** les distances `d1[v]` depuis le sommet `1` et `dN[v]` depuis le sommet `N` (le graphe n'est pas orienté, donc `dN[v]` est aussi la distance de `v` à `N`). Soit `D = d1[N]`.

Un chemin de `1` à `N` qui emprunte l'arête `A – B` dans le sens `A → B` mesure au moins `d1[A] + T + dN[B]`, et cette valeur est atteinte en recollant un plus court chemin de `1` à `A`, l'arête, et un plus court chemin de `B` à `N`. L'arête est donc sur un plus court chemin si et seulement si
`d1[A] + T + dN[B] = D` ou `d1[B] + T + dN[A] = D`.

Le chemin recollé ne repasse jamais par le même sommet : sinon on pourrait le raccourcir, et il ne serait pas de longueur `D`. Il suffit de tester chaque arête une fois. Si `N` est inaccessible, la réponse est `0`.

Complexité : **O(M log M)** pour les deux Dijkstra, plus O(M) pour le test.

Pourquoi les autres idées échouent :
- Suivre l'arbre des plus courts chemins de Dijkstra ne donne qu'**un** chemin : sur le premier exemple, il en existe trois, qui utilisent six arêtes en tout.
- Garder les arêtes « tendues » depuis `1` (celles où `d1[A] + T = d1[B]`) compte aussi des arêtes qui mènent vers des sommets d'où l'on ne rejoint pas `N` au plus court.
- Relancer un Dijkstra par arête coûte O(M² log M) : beaucoup trop lent.

Pièges :
- Une arête se parcourt dans les deux sens : il faut tester les deux.
- Deux arêtes parallèles de même longueur minimale comptent toutes les deux (deuxième exemple).
- Avec `N = 1`, le plus court chemin n'a aucune arête : la réponse est `0`.
