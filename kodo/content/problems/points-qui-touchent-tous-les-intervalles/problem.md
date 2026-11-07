---
id: points-qui-touchent-tous-les-intervalles
title: Points qui touchent tous les intervalles
chapter: p4-gloutons
order: 2
tags: [glouton, tri]
samples: 2
---

## Énoncé
Des contrôles doivent être faits sur une ligne de production pendant N périodes : la période i va de la minute aᵢ à la minute bᵢ, bornes comprises. Un contrôle a lieu à une minute entière, et il compte pour toutes les périodes qui contiennent cette minute.

Afficher le plus petit nombre de contrôles qui permet que chaque période contienne au moins un contrôle.

## Entrée
La première ligne contient N. Chacune des N lignes suivantes contient deux entiers aᵢ et bᵢ.

## Sortie
Le plus petit nombre de contrôles.

## Contraintes
- 1 ≤ N ≤ 10 000
- 0 ≤ aᵢ ≤ bᵢ ≤ 10⁶

## Indices
1. Parmi toutes les périodes, regarder celle qui **se termine** le plus tôt. Elle doit contenir un contrôle : à quelle minute est-il le plus utile ?
2. Placer ce contrôle à la fin de cette période : il touche toutes les périodes qui ont commencé avant, et ne perd rien.
3. Trier les périodes par fin croissante, et placer un contrôle à la fin de chaque période qui n'est pas encore touchée.

## Solution
**Le glouton.** On trie les périodes par fin croissante. On les parcourt dans cet ordre en retenant la minute du dernier contrôle placé : si la période courante commence après ce contrôle, elle n'est pas touchée, et on place un nouveau contrôle à sa **fin** bᵢ. Sinon, elle contient le dernier contrôle (il est au plus égal à sa fin, puisque les fins sont triées) et il n'y a rien à faire.

**Le choix est sûr (argument d'échange).** Soit [a, b] la période qui se termine le plus tôt, et une solution optimale quelconque. Elle a un contrôle q dans [a, b]. Remplaçons q par b. Toute période qui contenait q commence avant q ≤ b, et se termine après b, puisque b est la plus petite fin : elle contient aussi b. La solution modifiée est donc encore valable, avec le même nombre de contrôles, et elle fait le même premier choix que le glouton. On retire les périodes touchées par b et on recommence le raisonnement sur celles qui restent : par récurrence, le glouton utilise autant de contrôles qu'une solution optimale.

**Les mauvais gloutons.** Trier par début, ou placer le contrôle au début d'une période, échoue : avec [0, 10], [1, 2] et [5, 6], un contrôle à la minute 0 ou 10 ne touche qu'une période ; le bon glouton place 2 et 6, et répond 2.

**Coût.** O(N log N) pour le tri, puis un seul passage.
