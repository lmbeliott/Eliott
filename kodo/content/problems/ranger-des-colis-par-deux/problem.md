---
id: ranger-des-colis-par-deux
title: Ranger des colis par deux
chapter: n3-glouton
order: 1
tags: [glouton, tri, deux-pointeurs]
samples: 2
---

## Énoncé
Des colis doivent être expédiés dans des caisses. Une caisse contient **un ou deux colis**, et le poids total de ses colis ne doit pas dépasser C kilos.

Il y a N colis : le colis numéro i pèse P_i kilos, et aucun ne pèse plus de C kilos. Écris un programme qui calcule le nombre minimal de caisses nécessaires pour expédier tous les colis.

## Entrée
- La première ligne contient deux entiers N et C.
- La deuxième ligne contient N entiers P_1, P_2, …, P_N.

## Sortie
Un seul entier : le nombre minimal de caisses.

## Contraintes
- 1 ≤ N ≤ 30 000
- 1 ≤ P_i ≤ C ≤ 400

## Indices
1. Trie les poids. Intéresse-toi au colis le plus lourd : avec lequel a-t-il le plus de chances de pouvoir partager une caisse ?
2. Si le plus lourd ne peut pas aller avec le plus léger, il ne peut aller avec aucun autre : il part seul. Sinon, mets-les ensemble.
3. Garde deux indices dans la liste triée : `leger` au début et `lourd` à la fin. À chaque caisse, `lourd` recule ; `leger` avance seulement si les deux tiennent ensemble.

## Solution
**L'idée gloutonne.** On trie les poids. Chaque caisse reçoit le plus lourd des colis restants, accompagné du plus léger des colis restants si leurs deux poids tiennent dans la limite C. Avec deux indices `leger` (début de la liste) et `lourd` (fin de la liste), on avance l'un ou l'autre selon le cas.

**Pourquoi c'est optimal (argument d'échange).** Notons h le plus lourd et l le plus léger.
- Si `P_h + P_l > C`, alors h ne peut aller avec aucun autre colis, puisque tous les autres pèsent au moins P_l. Dans **toute** solution, h est seul : le glouton fait pareil.
- Si `P_h + P_l ≤ C`, prenons une solution optimale quelconque. Si h y est seul dans sa caisse, on peut y ajouter l (l quitte sa caisse, qui reste valable) : on n'utilise pas plus de caisses. Si h est avec un autre colis x, et l avec y (ou seul), on échange x et l : la caisse de h devient {h, l}, qui tient par hypothèse, et la caisse {x, y} tient aussi car `P_x + P_y ≤ P_x + P_h ≤ C` (h est le plus lourd). Le nombre de caisses ne change pas.

Il existe donc toujours une solution optimale qui commence comme le glouton. On recommence ensuite le même raisonnement avec les colis restants.

**Complexité.** Le tri coûte O(N log N), puis les deux indices parcourent la liste une seule fois : O(N log N) en tout.

**Pourquoi la solution naïve est trop lente.** Essayer toutes les façons de former les paires est exponentiel. Même la version gloutonne qui, pour chaque colis, cherche son partenaire en parcourant toute la liste coûte O(N²), soit environ 4,5 × 10⁸ comparaisons pour N = 30 000 : beaucoup trop en Python. En C++, ces comparaisons très simples passent encore, mais le tri suivi des deux pointeurs reste bien plus rapide.

**Pièges.**
- Apparier les colis voisins après le tri ne marche pas : avec C = 100 et les poids 10, 20, 80, 90, on ferait (10, 20), puis 80 et 90 seuls, soit 3 caisses, alors que (10, 90) et (20, 80) n'en utilisent que 2.
- Quand `leger == lourd`, il ne reste qu'un colis : il part seul. Ne le compte pas deux fois.
