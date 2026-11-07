---
id: chemin-dans-l-arbre-de-stern-brocot
title: Chemin dans l'arbre de Stern-Brocot
chapter: p4-synthese
order: 6
tags: [arithmétique, mathématiques, récursivité]
samples: 2
---

## Énoncé
L'**arbre de Stern-Brocot** est un arbre binaire infini qui contient chaque fraction positive irréductible exactement une fois. Chaque nœud a deux **bornes** `a/b` et `c/d` et porte la fraction `(a + c)/(b + d)`. La racine a pour bornes `0/1` et `1/0` : elle porte `1/1`. Le fils gauche d'un nœud de bornes `a/b`, `c/d` et de fraction `m` a pour bornes `a/b` et `m` ; son fils droit a pour bornes `m` et `c/d`. Ainsi, les fils de la racine portent `1/2` et `2/1`, et ceux de `1/2` portent `1/3` et `2/3`.

C'est un arbre binaire de recherche : les fractions du sous-arbre gauche d'un nœud sont plus petites que la sienne, celles du sous-arbre droit plus grandes. Pour atteindre une fraction, on part de la racine et l'on descend à gauche (`L`) ou à droite (`R`).

Pour chacune des `T` fractions `P/Q` données, afficher le chemin depuis la racine, sous forme compressée : les blocs de pas identiques consécutifs.

## Entrée
- La première ligne contient `T`.
- Chacune des `T` lignes suivantes contient deux entiers `P` et `Q`, premiers entre eux.

## Sortie
Pour chaque fraction, une ligne : le nombre `B` de blocs, puis les `B` blocs, chacun écrit comme une lettre (`L` ou `R`) suivie du nombre de pas. Par exemple, `3/5` s'atteint par `L R L` : la ligne est `3 L 1 R 1 L 1`. Pour `1/1`, la ligne est `0`.

## Contraintes
- 1 ≤ T ≤ 1 000
- 1 ≤ P, Q ≤ 10¹⁸
- PGCD(P, Q) = 1

## Indices
1. Le chemin de `10¹⁸/1` fait près de 10¹⁸ pas vers la droite : on ne peut pas descendre pas à pas.
2. Le sous-arbre droit de la racine ressemble à l'arbre entier, décalé de 1 : chaque fraction `x` y devient `x + 1`. Et le sous-arbre gauche ? Que devient `P/Q` après un pas à droite ?
3. Un pas à droite transforme le problème `(P, Q)` en `(P − Q, Q)`, un pas à gauche en `(P, Q − P)`. Plusieurs pas identiques d'affilée s'enchaînent d'un coup avec une division, comme dans l'algorithme d'Euclide.

## Solution
**Un pas, c'est une soustraction.** On montre par récurrence sur la profondeur que le sous-arbre droit de la racine est l'arbre entier où chaque fraction `x` est remplacée par `x + 1`, et le sous-arbre gauche l'arbre entier où `x` est remplacée par `x / (1 + x)`. En effet, ajouter 1 aux bornes `a/b` et `c/d` (qui deviennent `(a + b)/b` et `(c + d)/d`) ajoute 1 à la médiante `(a + c)/(b + d)`, et la racine `1/1`, de bornes `0/1` et `1/0`, devient le nœud `2/1`, de bornes `1/1` et `1/0` : la construction est la même. Le raisonnement est symétrique à gauche. Donc, si `P > Q`, la fraction est à droite, et il reste à trouver `(P − Q)/Q` dans l'arbre entier ; si `P < Q`, elle est à gauche, et il reste à trouver `P/(Q − P)`. On s'arrête sur `1/1`. Ces soustractions gardent `P` et `Q` premiers entre eux et positifs, et `P + Q` diminue à chaque pas : la descente se termine.

**Des blocs entiers d'un coup.** Si `P > Q`, on fait des pas à droite tant que `P > Q` : exactement `k = (P − 1) / Q` pas (division entière), après lesquels `P` devient `P − k Q`, compris entre `1` et `Q`. De même à gauche. C'est l'algorithme d'Euclide par divisions : les nombres de pas sont les quotients du développement en fraction continue de `P/Q`, le dernier diminué de 1.

**Complexité.** Comme pour Euclide, O(log(P + Q)) blocs par fraction, soit moins de 90. La descente pas à pas en ferait jusqu'à 10¹⁸.

**Pièges.** Utiliser `(P − 1) / Q` et non `P / Q` : quand `Q` divise `P` (c'est-à-dire `Q = 1`), le dernier bloc s'arrête à `1/1`, un pas plus tôt. Les produits `k × Q` restent au plus `P` : pas de dépassement en `long long`. La fraction `1/1` donne un chemin vide.
