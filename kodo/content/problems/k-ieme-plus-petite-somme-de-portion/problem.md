---
id: k-ieme-plus-petite-somme-de-portion
title: K-ième plus petite somme de portion
chapter: n3-dichotomie
order: 4
tags: [dichotomie, deux-pointeurs]
samples: 2
---

## Énoncé
On te donne une liste de N entiers strictement positifs A_1, A_2, …, A_N. Une **portion** est une suite de cases consécutives de la liste, d'au moins une case : il y en a N × (N + 1) / 2.

On calcule la somme de chaque portion, puis on range toutes ces sommes dans l'ordre croissant, en gardant les répétitions. Écris un programme qui affiche la K-ième somme de ce classement.

## Entrée
- La première ligne contient deux entiers N et K.
- La deuxième ligne contient N entiers A_1, A_2, …, A_N.

## Sortie
Un seul entier : la K-ième plus petite somme de portion.

## Contraintes
- 1 ≤ N ≤ 30 000
- 1 ≤ K ≤ N × (N + 1) / 2
- 1 ≤ A_i ≤ 10 000

## Indices
1. Il y a jusqu'à 4,5 × 10⁸ portions : impossible de calculer toutes les sommes puis de les trier. Retourne la question : pour une valeur S donnée, combien de portions ont une somme inférieure ou égale à S ?
2. Ce nombre se calcule en O(N) avec deux pointeurs, car les valeurs sont positives : pour chaque fin de portion, les débuts qui conviennent forment un intervalle qui se termine à la fin, et son premier début ne recule jamais.
3. La réponse est la plus petite valeur S pour laquelle au moins K portions ont une somme ≤ S. Cherche-la par dichotomie entre `0` (aucune portion) et la somme de toute la liste (toutes les portions).

## Solution
**L'idée : chercher la réponse par dichotomie, et compter avec deux pointeurs.** Notons `f(S)` le nombre de portions dont la somme est inférieure ou égale à S. Plus S est grand, plus `f(S)` est grand. La K-ième plus petite somme est exactement la plus petite valeur S telle que `f(S) ≥ K` : avant elle, il y a moins de K sommes, et à partir d'elle, au moins K.

On cherche ce seuil par dichotomie : `trop_petit = 0` (aucune portion n'a une somme nulle, puisque les valeurs sont positives) et `suffisant = A_1 + … + A_N` (toutes les portions ont une somme au plus égale à ça). On teste le milieu et on déplace la borne qui convient.

**Calculer f(S) en O(N).** On fait avancer `fin` de gauche à droite, en gardant une fenêtre `debut..fin` et sa somme. Après avoir ajouté `A[fin]`, tant que la somme dépasse S, on retire `A[debut]` et on avance `debut`. Ensuite, toutes les portions qui finissent en `fin` et commencent entre `debut` et `fin` ont une somme ≤ S (une portion plus courte a une somme plus petite, car les valeurs sont positives), et celles qui commencent avant `debut` ont une somme > S. On ajoute donc `fin − debut + 1` au compte. Comme `debut` ne recule jamais, le calcul fait O(N) pas en tout.

Sur le premier exemple (3 1 4 2, K = 4), les 10 sommes rangées sont 1, 2, 3, 4, 4, 5, 6, 7, 8, 10 : f(3) = 3 < 4 et f(4) = 5 ≥ 4, donc la réponse est 4.

**Complexité.** La dichotomie fait environ log₂(3 × 10⁸) ≈ 29 tours, chacun en O(N) : O(N log(somme)), environ 10⁶ opérations.

**Pourquoi la solution naïve est trop lente.** Calculer et trier les N × (N + 1) / 2 ≈ 4,5 × 10⁸ sommes demande des milliards d'opérations et plusieurs gigaoctets de mémoire, même en C++. Extraire les sommes une par une dans l'ordre (avec une file de priorité) coûte au moins K opérations, et K peut valoir 4,5 × 10⁸.

**Pièges.**
- K et le nombre de portions dépassent 2³¹ : utilise des `long long` en C++ pour K, pour le compte `f(S)` et pour les sommes.
- La condition est `f(S) ≥ K`, et non `f(S) == K` : quand plusieurs portions ont la même somme, `f` saute plusieurs valeurs d'un coup et peut ne jamais valoir K exactement.
- La réponse est toujours la somme d'une vraie portion : c'est le plus petit S tel que `f(S) ≥ K`, et `f` n'augmente qu'aux valeurs qui sont des sommes de portions.
