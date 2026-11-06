---
id: petit-telepherique
title: Le petit téléphérique du Lac Noir
chapter: n3-glouton
order: 1
tags: [glouton, tri, deux-pointeurs]
samples: 2
---

## Énoncé
Le petit téléphérique qui monte au refuge du Lac Noir a des cabines minuscules : une cabine emporte **une ou deux personnes**, et le poids total de ses passagers (sacs compris) ne doit pas dépasser C kilos.

Ce matin, N randonneurs attendent au départ. Le randonneur numéro i pèse P_i kilos avec son sac, et personne ne pèse plus de C kilos.

Écris un programme qui calcule le nombre minimal de cabines nécessaires pour monter tout le monde.

## Entrée
- La première ligne contient deux entiers N et C.
- La deuxième ligne contient N entiers P_1, P_2, …, P_N.

## Sortie
Un seul entier : le nombre minimal de cabines.

## Contraintes
- 1 ≤ N ≤ 30 000
- 1 ≤ P_i ≤ C ≤ 400

## Indices
1. Trie les poids. Intéresse-toi au randonneur le plus lourd : avec qui a-t-il le plus de chances de pouvoir partager une cabine ?
2. Si le plus lourd ne peut pas monter avec le plus léger, il ne peut monter avec personne : il part seul. Sinon, mets-les ensemble.
3. Garde deux indices dans la liste triée : `leger` au début et `lourd` à la fin. À chaque cabine, `lourd` recule ; `leger` avance seulement si les deux tiennent ensemble.

## Solution
**L'idée gloutonne.** On trie les poids. Chaque cabine emmène le plus lourd des randonneurs restants, accompagné du plus léger des randonneurs restants si leurs deux poids tiennent dans la limite C. Avec deux indices `leger` (début de la liste) et `lourd` (fin de la liste), on avance l'un ou l'autre selon le cas.

**Pourquoi c'est optimal (argument d'échange).** Notons h le plus lourd et l le plus léger.
- Si `P_h + P_l > C`, alors h ne peut monter avec personne, puisque tous les autres pèsent au moins P_l. Dans **toute** solution, h est seul : le glouton fait pareil.
- Si `P_h + P_l ≤ C`, prenons une solution optimale quelconque. Si h y voyage seul, on peut faire monter l avec lui (l quitte sa cabine, qui reste valable) : on n'utilise pas plus de cabines. Si h voyage avec un autre randonneur x, et l avec y (ou seul), on échange x et l : la cabine de h devient {h, l}, qui tient par hypothèse, et la cabine {x, y} tient aussi car `P_x + P_y ≤ P_x + P_h ≤ C` (h est le plus lourd). Le nombre de cabines ne change pas.

Il existe donc toujours une solution optimale qui commence comme le glouton. On recommence ensuite le même raisonnement avec les randonneurs restants.

**Complexité.** Le tri coûte O(N log N), puis les deux indices parcourent la liste une seule fois : O(N log N) en tout.

**Pourquoi la solution naïve est trop lente.** Essayer toutes les façons de former les paires est exponentiel. Même la version gloutonne qui, pour chaque randonneur, cherche son partenaire en parcourant toute la liste coûte O(N²), soit environ 10⁹ opérations pour N = 30 000.

**Pièges.**
- Apparier les randonneurs voisins après le tri ne marche pas : avec C = 100 et les poids 10, 20, 80, 90, on ferait (10, 20), puis 80 et 90 seuls, soit 3 cabines, alors que (10, 90) et (20, 80) n'en utilisent que 2.
- Quand `leger == lourd`, il ne reste qu'une personne : elle part seule. Ne la compte pas deux fois.
