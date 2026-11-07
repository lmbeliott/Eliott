---
id: minimum-apres-des-ajouts
title: Minimum après des ajouts
chapter: n4-structures
order: 4
tags: [arbre-de-segments]
samples: 2
---

## Énoncé
Un tableau contient `N` entiers `a[1], a[2], …, a[N]`, qui valent tous `0` au départ. Écris un programme qui traite, dans l'ordre, une suite de `Q` opérations de deux types :
- `+ L R V` : ajoute `V` à chacune des valeurs `a[L], a[L+1], …, a[R]` ;
- `? L R` : affiche la plus petite valeur parmi `a[L], …, a[R]`, et le nombre de cases de cet intervalle qui ont cette valeur.

## Entrée
- La première ligne contient deux entiers `N` et `Q`.
- Chacune des `Q` lignes suivantes contient une opération : le caractère `+` suivi de trois entiers `L`, `R` et `V`, ou le caractère `?` suivi de deux entiers `L` et `R`.

## Sortie
Pour chaque opération `?`, dans l'ordre, une ligne avec deux entiers : le minimum de l'intervalle, puis le nombre de cases qui l'atteignent.

## Contraintes
- 1 ≤ N ≤ 1 000 000
- 1 ≤ Q ≤ 6 000
- 1 ≤ L ≤ R ≤ N
- -10⁶ ≤ V ≤ 10⁶

## Indices
1. Modifier les cases une par une coûte jusqu'à `N` opérations par ajout : plusieurs milliards en tout.
2. Dans un arbre de segments, garde pour chaque nœud le minimum de son intervalle **et** le nombre de cases qui l'atteignent. Deux fils se combinent facilement : si leurs minimums sont égaux, on additionne les nombres ; sinon on garde le couple du plus petit.
3. Quand un ajout couvre **tout** l'intervalle d'un nœud, inutile de descendre : le minimum du nœud augmente de `V`, le nombre ne change pas. Note dans le nœud qu'il reste `V` à ajouter à tout son sous-arbre (c'est la **propagation paresseuse**), et tiens-en compte en remontant.

## Solution
On utilise un **arbre de segments** dont chaque nœud `k` couvre un intervalle de cases et stocke :
- `mini[k]` et `nb[k]` : le minimum de son intervalle et le nombre de cases qui l'atteignent ;
- `ajout[k]` : la somme des ajouts qui ont couvert tout l'intervalle de `k`, et qui n'ont pas été transmis à ses fils.

Au départ, toutes les cases valent `0` : chaque nœud a `mini = 0` et `nb` égal à la taille de son intervalle.

**Ajout** `+ L R V`, depuis la racine. Si le nœud est hors de `[L, R]`, on ne fait rien. S'il est entièrement dedans, on fait `mini[k] += V` et `ajout[k] += V`, et on s'arrête : le nombre de cases minimales ne change pas quand tout augmente de la même valeur. Sinon, on descend dans les deux fils, puis on recalcule : on combine les couples des deux fils (le plus petit minimum, ou la somme des nombres en cas d'égalité) et on ajoute `ajout[k]` au minimum.

**Question** `? L R`. On descend de la même façon. Un nœud entièrement dans `[L, R]` renvoie son couple `(mini, nb)`. Un nœud coupé combine les réponses de ses fils, puis ajoute son propre `ajout[k]` au minimum, car ses fils ne le connaissent pas.

Comme dans un arbre de segments ordinaire, chaque opération visite O(log N) nœuds. Complexité : **O(N + Q log N)**.

Ici, la valeur en attente reste dans le nœud et n'est jamais poussée vers les fils : cela marche parce qu'un ajout commute avec le minimum. Pour d'autres opérations (par exemple « remplacer par `V` »), il faut au contraire **pousser** la valeur en attente vers les deux fils avant de descendre.

Pourquoi la méthode naïve échoue : un ajout ou une question sur un grand intervalle parcourt jusqu'à un million de cases. Avec 6 000 opérations, cela fait plusieurs milliards d'opérations, trop même en C++. Un arbre de segments sans propagation paresseuse ne suffit pas non plus : un ajout sur `[L, R]` y modifie toutes les feuilles de l'intervalle.

Pièges :
- Les valeurs peuvent dépasser 2³¹ en valeur absolue : utilise des `long long` en C++.
- Quand les deux fils ont le même minimum, on additionne les nombres : oublier ce cas compte trop peu de cases.
- Si l'arbre est arrondi à une puissance de deux, les feuilles en trop ne doivent jamais être comptées : donne-leur une valeur immense.
