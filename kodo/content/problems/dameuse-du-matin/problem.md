---
id: dameuse-du-matin
title: La dameuse du matin
chapter: n3-glouton
order: 3
tags: [glouton, tri]
samples: 2
---

## Énoncé
Cette nuit, il a neigé sur la station de Valcorde, et aucune piste n'est damée. Théo, le conducteur de la dameuse, doit damer N pistes, une seule à la fois et sans pause. Damer la piste numéro i lui prend D_i minutes, et la piste ouvre dès qu'elle est damée.

Au moment où Théo commence (minute 0), F_i skieurs attendent déjà au pied de la piste i. Chacun attend jusqu'à l'ouverture de sa piste : si la piste i ouvre à la minute T, ses skieurs ont attendu en tout F_i × T minutes.

Écris un programme qui calcule le plus petit temps d'attente total possible, pour tous les skieurs réunis, en choisissant bien l'ordre des pistes.

## Entrée
- La première ligne contient un entier N.
- Chacune des N lignes suivantes contient deux entiers D_i et F_i.

## Sortie
Un seul entier : le temps d'attente total minimal, en minutes.

## Contraintes
- 1 ≤ N ≤ 15 000
- 1 ≤ D_i ≤ 1 000
- 1 ≤ F_i ≤ 1 000

## Indices
1. Commence par deux pistes seulement, a et b. Calcule l'attente totale si a passe avant b, puis si b passe avant a. Qu'est-ce qui change entre les deux ?
2. Seuls les termes de a et b changent : a avant b coûte `F_b × D_a` de plus pour les skieurs de b, b avant a coûte `F_a × D_b` de plus pour ceux de a. Il vaut mieux mettre a d'abord si `D_a × F_b < D_b × F_a`.
3. Trie les pistes selon cette comparaison (c'est trier par `D / F` croissant), puis calcule l'attente totale en une passe. Attention, le total dépasse 2³¹.

## Solution
**L'idée gloutonne : trier par `D / F` croissant.** Il faut damer d'abord les pistes rapides à damer (D petit) et très attendues (F grand). Le bon critère combine les deux : on trie les pistes par rapport `D_i / F_i` croissant, puis on additionne `F_i × T_i`, où T_i est la minute d'ouverture de la piste i.

**Pourquoi c'est optimal (échange de deux voisines).** Prenons un ordre quelconque, et deux pistes a et b damées l'une juste après l'autre, a en premier, à partir de la minute t. Si on les échange, les autres pistes ouvrent exactement au même moment. Seules les attentes de a et b changent :
- a puis b : `F_a × (t + D_a) + F_b × (t + D_a + D_b)` ;
- b puis a : `F_b × (t + D_b) + F_a × (t + D_b + D_a)`.

La différence entre les deux vaut `F_b × D_a − F_a × D_b`. Donc si `D_a × F_b > D_b × F_a`, échanger a et b diminue l'attente totale. Dans un ordre optimal, deux pistes voisines sont donc toujours rangées par `D / F` croissant (à égalité, l'ordre ne change rien). Un ordre où toutes les voisines sont bien rangées, c'est exactement l'ordre trié.

**Comparer sans division.** Comparer `D_a / F_a < D_b / F_b` revient à comparer `D_a × F_b < D_b × F_a` (les F sont positifs). On évite ainsi les nombres à virgule. En Python, `functools.cmp_to_key` transforme cette comparaison en clé de tri ; en C++, on la passe directement à `sort`.

**Complexité.** O(N log N) pour le tri, puis O(N) pour le calcul.

**Pourquoi la solution naïve est trop lente.** Il y a N! ordres possibles : on ne peut même pas les essayer tous pour N = 20. Et les règles « les plus courtes d'abord » ou « les plus attendues d'abord » sont fausses : sur le premier exemple, elles donnent 860 et 820 minutes au lieu de 780.

**Pièges.**
- Le total peut dépasser 10¹³ : en C++, utilise des `long long`.
- Le minutage T_i est cumulatif : c'est la somme des durées de toutes les pistes damées avant, plus D_i.
