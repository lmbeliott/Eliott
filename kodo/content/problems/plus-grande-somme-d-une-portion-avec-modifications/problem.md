---
id: plus-grande-somme-d-une-portion-avec-modifications
title: Plus grande somme d'une portion, avec modifications
chapter: n4-structures
order: 7
tags: [arbre-de-segments]
samples: 2
---

## Énoncé
Un tableau contient `N` entiers `a[1], a[2], …, a[N]`. Une **portion** de l'intervalle `[L, R]` est une suite de cases consécutives `a[x], a[x+1], …, a[y]` avec `L ≤ x ≤ y ≤ R` ; elle contient au moins une case.

Écris un programme qui traite, dans l'ordre, une suite de `Q` opérations de deux types :
- `1 P V` : remplace la valeur `a[P]` par `V` ;
- `2 L R` : affiche la plus grande somme d'une portion de l'intervalle `[L, R]`.

## Entrée
- La première ligne contient deux entiers `N` et `Q`.
- La deuxième ligne contient `N` entiers `a[1] … a[N]`.
- Chacune des `Q` lignes suivantes contient une opération : l'entier `1` suivi de `P` et `V`, ou l'entier `2` suivi de `L` et `R`.

## Sortie
Pour chaque opération de type `2`, dans l'ordre, une ligne avec la plus grande somme d'une portion de l'intervalle demandé.

## Contraintes
- 1 ≤ N ≤ 10 000
- 1 ≤ Q ≤ 8 000
- -1 000 ≤ a[i], V ≤ 1 000
- 1 ≤ P ≤ N et 1 ≤ L ≤ R ≤ N

## Indices
1. Pour une seule question, un parcours de l'intervalle suffit (on garde la meilleure somme d'une portion qui finit sur la case courante). Mais refaire ce parcours à chaque question coûte jusqu'à `N × Q` opérations.
2. Dans un arbre de segments, la meilleure portion d'un nœud est soit entièrement dans son fils gauche, soit entièrement dans son fils droit, soit à cheval sur les deux. Que faut-il connaître de chaque fils pour calculer le cas « à cheval » ?
3. Garde pour chaque nœud quatre valeurs : la somme totale, le meilleur préfixe, le meilleur suffixe et la meilleure portion. Elles se combinent toutes à partir de celles des deux fils.

## Solution
Chaque nœud d'un **arbre de segments** stocke, pour son intervalle :
- `somme` : la somme de toutes les cases ;
- `pref` : la plus grande somme d'un préfixe non vide ;
- `suff` : la plus grande somme d'un suffixe non vide ;
- `best` : la plus grande somme d'une portion.

Pour un nœud dont le fils gauche est `G` et le fils droit `D` :
- `somme = G.somme + D.somme` ;
- `pref = max(G.pref, G.somme + D.pref)` : le meilleur préfixe s'arrête dans `G`, ou couvre tout `G` et continue dans `D` ;
- `suff = max(D.suff, D.somme + G.suff)`, de même ;
- `best = max(G.best, D.best, G.suff + D.pref)` : la meilleure portion est dans `G`, dans `D`, ou à cheval, et alors elle est formée d'un suffixe de `G` suivi d'un préfixe de `D`.

Une feuille de valeur `v` a ses quatre valeurs égales à `v`. Une **modification** change une feuille puis recalcule ses O(log N) ancêtres. Une **question** découpe `[L, R]` en O(log N) nœuds, que l'on combine **de gauche à droite** avec les mêmes formules : l'ordre compte, car l'opération n'est pas commutative.

Complexité : **O(N + Q log N)**.

Pourquoi la méthode naïve échoue : un parcours par question coûte O(N) ; avec des milliers de questions sur de longs intervalles, cela fait des dizaines de millions d'opérations, trop pour Python. Garder seulement la meilleure portion de chaque nœud ne suffit pas : on ne saurait pas combiner deux nœuds quand la meilleure portion est à cheval.

Pièges :
- La portion n'est jamais vide : si toutes les valeurs sont négatives, la réponse est la plus grande d'entre elles, pas `0` (deuxième exemple).
- Pour les nœuds vides (feuilles en trop, accumulateurs de départ), prends `somme = 0` et une valeur très négative pour `pref`, `suff` et `best`, sans risque de dépassement quand on en additionne deux.
- Dans une question, on accumule les nœuds de gauche dans l'ordre, et ceux de droite en les plaçant **devant** l'accumulateur de droite.
