---
id: decouper-un-cercle-en-k-arcs
title: Découper un cercle en K arcs
chapter: n3-dichotomie
order: 7
tags: [dichotomie, sommes-préfixes]
samples: 2
---

## Énoncé
N entiers positifs A_1, A_2, …, A_N sont disposés en cercle : chaque case est voisine de la suivante, et A_N est voisine de A_1. Tu dois couper le cercle en **exactement K arcs** : un arc est une suite de cases voisines (il peut passer de A_N à A_1), chaque case appartient à un seul arc, et chaque arc contient au moins une case. Le poids d'un arc est la somme de ses cases.

Écris un programme qui calcule le plus petit poids possible pour l'arc le plus lourd.

## Entrée
- La première ligne contient deux entiers N et K.
- La deuxième ligne contient N entiers A_1, A_2, …, A_N, dans l'ordre du cercle.

## Sortie
Un seul entier : le plus petit poids possible de l'arc le plus lourd.

## Contraintes
- 1 ≤ K ≤ N ≤ 15 000
- 1 ≤ A_i ≤ 10 000

## Indices
1. Comme pour une liste, retourne la question : pour une limite D, peut-on couper le cercle en au plus K arcs de poids ≤ D ? Si oui pour D, c'est oui pour D + 1 : la plus petite limite se cherche par dichotomie. Toute la difficulté est de répondre vite à cette question.
2. Si tu sais où se trouve **une** coupure d'un bon découpage, le reste se fait comme sur une liste : on part de là et on prend des arcs aussi longs que possible. Essayer les N points de départ coûte trop cher quand K est grand. Mais l'arc qui contient la case p se termine forcément avant la fin de l'arc le plus long qui part de p.
3. Pour une limite D, appelle `suivant(i)` la fin de l'arc le plus long qui commence en i (une dichotomie dans les sommes préfixes du cercle déplié deux fois). Choisis la case p où cet arc est le plus court : un bon découpage coupe forcément entre p et `suivant(p)`. N'essaie que ces points de départ, en t'arrêtant dès que tu dépasses K arcs.

## Solution
**La dichotomie sur la réponse.** La question « peut-on couper le cercle en au plus K arcs de poids ≤ D ? » a une réponse « non » pour les petits D, puis « oui » à partir d'un seuil. Au plus K arcs suffit : comme K ≤ N, on peut toujours couper un arc de plusieurs cases en deux. La réponse est au moins `max(A)` et au moins ⌈S / K⌉ (S est la somme totale), et `⌈S / K⌉ + max(A)` suffit toujours : le découpage glouton d'une liste, avec cette limite, fait chaque arc (sauf le dernier) de poids au moins ⌈S / K⌉, donc au plus K arcs. La dichotomie fait environ 14 tours.

**Répondre à la question sur un cercle.** Sur une liste, on lit le plus possible à chaque arc. Sur un cercle, il faut en plus choisir où commencer. On déplie le cercle deux fois (A_1 … A_N A_1 … A_N) et on calcule ses sommes préfixes. Pour une limite D, `suivant(i)` est la fin de l'arc le plus long qui commence à la case i : une dichotomie (`bisect_right` ou `upper_bound`) dans les sommes préfixes la trouve. Le découpage glouton qui commence en i saute de `i` à `suivant(i)`, puis à `suivant(suivant(i))`, et ainsi de suite jusqu'à faire le tour : il utilise le moins d'arcs possible parmi les découpages qui coupent juste avant i.

**Où commencer ?** Prends n'importe quelle case p. Dans un bon découpage, l'arc qui contient p pèse au plus D, donc il se termine au plus tard en `suivant(p)` : il y a une coupure entre p et `suivant(p)`. Il suffit donc d'essayer les débuts p + 1, …, `suivant(p)`. On choisit la case p pour laquelle `suivant(p) − p` est le plus petit, et on arrête chaque essai dès qu'il dépasse K arcs.

Pourquoi c'est rapide : si le glouton qui part de la case 1 réussit, c'est fini. Sinon, ses K premiers arcs tiennent dans moins de N cases, donc l'un d'eux a au plus N / K cases, et le plus court des arcs `suivant(p) − p` aussi. On fait au plus N / K essais d'au plus K + 1 sauts : environ 2N sauts en tout.

Sur le premier exemple (5 1 3 8 9 3 6, K = 3), le total vaut 35, donc un arc pèse au moins 12. Les arcs 6 + 5 + 1 = 12, 3 + 8 = 11 et 9 + 3 = 12 atteignent cette borne : la réponse est 12. Sans passer de la dernière case à la première, le mieux serait 17.

**Complexité.** Chaque question coûte O(N log N) (une dichotomie par saut), et la dichotomie sur D fait environ log₂(10 000) ≈ 14 tours : O(N log N log(max A)).

**Pourquoi la solution naïve est trop lente.** Couper le cercle à chacun des N endroits et résoudre chaque fois le problème de la liste donne la bonne réponse, mais coûte N fois plus. Même en essayant les N débuts dans chaque question, avec arrêt après K + 1 arcs, on fait N × K sauts, soit 7,5 × 10⁷ pour N = 15 000 et K = 5 000, à chacun des 14 tours. Et couper toujours après la dernière case est faux : sur le premier exemple, cela donne 17 au lieu de 12.

**Pièges.**
- Si D ≥ S, un seul arc suffit : réponds « oui » tout de suite (sinon `suivant(p)` peut faire plus d'un tour).
- Un essai qui commence à la case `debut` s'arrête quand on atteint `debut + N` dans le cercle déplié : prends `debut` modulo N pour rester dans le tableau.
- N'essaie pas seulement les débuts dans l'arc qui part de la case 1 : il peut contenir des milliers de cases légères.
