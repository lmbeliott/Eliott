---
id: minimiser-l-attente-totale
title: Minimiser l'attente totale
chapter: n3-glouton
order: 3
tags: [glouton, tri]
samples: 2
---

## Énoncé
Un atelier doit traiter N tâches, une seule à la fois et sans pause. La tâche numéro i dure D_i minutes, et F_i personnes attendent qu'elle soit terminée.

Toutes ces personnes attendent depuis la minute 0 : si la tâche i se termine à la minute T, ses F_i personnes ont attendu en tout F_i × T minutes. Écris un programme qui calcule le plus petit temps d'attente total possible, pour toutes les personnes réunies, en choisissant bien l'ordre des tâches.

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
1. Commence par deux tâches seulement, a et b. Calcule l'attente totale si a passe avant b, puis si b passe avant a. Qu'est-ce qui change entre les deux ?
2. Seuls les termes de a et b changent : a avant b coûte `F_b × D_a` de plus aux personnes qui attendent b, b avant a coûte `F_a × D_b` de plus à celles qui attendent a. Il vaut mieux mettre a d'abord si `D_a × F_b < D_b × F_a`.
3. Trie les tâches selon cette comparaison (c'est trier par `D / F` croissant), puis calcule l'attente totale en une passe. Attention, le total dépasse 2³¹.

## Solution
**L'idée gloutonne : trier par `D / F` croissant.** Il faut traiter d'abord les tâches courtes (D petit) et très attendues (F grand). Le bon critère combine les deux : on trie les tâches par rapport `D_i / F_i` croissant, puis on additionne `F_i × T_i`, où T_i est la minute où la tâche i se termine.

**Pourquoi c'est optimal (échange de deux voisines).** Prenons un ordre quelconque, et deux tâches a et b traitées l'une juste après l'autre, a en premier, à partir de la minute t. Si on les échange, les autres tâches se terminent exactement au même moment. Seules les attentes de a et b changent :
- a puis b : `F_a × (t + D_a) + F_b × (t + D_a + D_b)` ;
- b puis a : `F_b × (t + D_b) + F_a × (t + D_b + D_a)`.

La différence entre les deux vaut `F_b × D_a − F_a × D_b`. Donc si `D_a × F_b > D_b × F_a`, échanger a et b diminue l'attente totale. Dans un ordre optimal, deux tâches voisines sont donc toujours rangées par `D / F` croissant (à égalité, l'ordre ne change rien). Un ordre où toutes les voisines sont bien rangées, c'est exactement l'ordre trié.

**Comparer sans division.** Comparer `D_a / F_a < D_b / F_b` revient à comparer `D_a × F_b < D_b × F_a` (les F sont positifs). On évite ainsi les nombres à virgule. En Python, `functools.cmp_to_key` transforme cette comparaison en clé de tri ; en C++, on la passe directement à `sort`.

**Complexité.** O(N log N) pour le tri, puis O(N) pour le calcul.

**Pourquoi la solution naïve est trop lente.** Il y a N! ordres possibles : on ne peut même pas les essayer tous pour N = 20. Et les règles « les plus courtes d'abord » ou « les plus attendues d'abord » sont fausses : sur le premier exemple, elles donnent 860 et 820 minutes au lieu de 780.

**Pièges.**
- Le total peut dépasser 10¹³ : en C++, utilise des `long long`.
- La minute de fin T_i est cumulative : c'est la somme des durées de toutes les tâches traitées avant, plus D_i.
