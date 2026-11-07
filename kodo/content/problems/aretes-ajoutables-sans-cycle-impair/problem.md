---
id: aretes-ajoutables-sans-cycle-impair
title: Arêtes ajoutables sans cycle impair
chapter: p4-graphes
order: 8
synthesis: true
tags: [graphes, parcours-en-largeur, mathématiques]
samples: 3
---

## Énoncé
On donne un graphe non orienté de `N` sommets et `M` arêtes, sans boucle ni arête multiple. On souhaite lui ajouter **une** arête entre deux sommets distincts `U` et `V` qui ne sont pas déjà reliés par une arête.

Compter les paires `{U, V}` pour lesquelles le graphe obtenu ne contient aucun cycle de longueur impaire.

## Entrée
- La première ligne contient deux entiers `N` et `M` : le nombre de sommets (numérotés de `1` à `N`) et le nombre d'arêtes.
- Chacune des `M` lignes suivantes contient deux entiers distincts `A` et `B` : une arête relie les sommets `A` et `B`. Deux arêtes ne relient jamais les deux mêmes sommets.

## Sortie
Un seul entier : le nombre de paires `{U, V}` qui conviennent.

## Contraintes
- 1 ≤ N ≤ 100 000
- 0 ≤ M ≤ 10 000
- 1 ≤ A, B ≤ N et A ≠ B

## Indices
1. Un graphe n'a aucun cycle impair si et seulement si on peut colorier ses sommets en deux couleurs, les deux extrémités de chaque arête étant de couleurs différentes. Si le graphe de départ a déjà un cycle impair, la réponse est `0`.
2. Colorier chaque composante connexe. Si `U` et `V` sont dans la même composante, quand l'arête `U–V` crée-t-elle un cycle impair ? Et s'ils sont dans deux composantes différentes ?
3. Dans une composante qui a `x` sommets blancs et `y` sommets noirs, il y a `x × y` paires de couleurs différentes, dont certaines sont déjà des arêtes. Le résultat peut dépasser 2³¹.

## Solution
On colorie chaque composante connexe par un parcours en largeur, comme dans le cours. Si un conflit apparaît, le graphe contient déjà un cycle impair, qu'aucun ajout ne fait disparaître : la réponse est `0`.

Sinon, chaque composante `i` a `x_i` sommets blancs et `y_i` sommets noirs, et on distingue deux cas pour une paire `{U, V}` non reliée.
- **Même composante.** Si `U` et `V` ont la même couleur, un chemin de `U` à `V` a une longueur paire (les couleurs alternent et reviennent à la même), et l'arête `U–V` ferme un cycle impair. S'ils ont des couleurs différentes, le coloriage reste valable : aucun cycle impair. Les bonnes paires sont les `x_i × y_i` paires de couleurs différentes, moins celles qui sont déjà des arêtes. Toutes les arêtes du graphe relient deux sommets de couleurs différentes d'une même composante : il faut donc retirer `M` en tout.
- **Composantes différentes.** On peut échanger les deux couleurs dans la composante de `V` : le coloriage reste valable pour le graphe, et `U`, `V` sont maintenant de couleurs différentes ; l'ajout ne crée pas de cycle impair. Toutes ces paires conviennent : il y en a `N(N − 1)/2 − Σ s_i(s_i − 1)/2`, où `s_i = x_i + y_i` est la taille de la composante `i`.

La réponse est donc `Σ x_i y_i − M + N(N − 1)/2 − Σ s_i(s_i − 1)/2`.

**Complexité.** Un parcours de tout le graphe : O(N + M). Essayer chaque paire et refaire un test de coloriage coûterait O(N² × (N + M)).

**Piège.** Avec `N = 100 000`, il y a près de 5 × 10⁹ paires : il faut des `long long` en C++.
