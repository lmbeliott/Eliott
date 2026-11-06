---
id: repartition-en-k-sacs
title: Répartition en K sacs
chapter: n3-recursivite
order: 4
tags: [backtracking, récursivité]
samples: 2
---

## Énoncé
On doit répartir N objets dans K sacs : l'objet numéro i pèse P_i kilos, et chaque objet va en entier dans un seul sac. Un sac peut contenir autant d'objets qu'on veut, ou aucun.

Écris un programme qui calcule le plus petit poids possible pour le sac le plus lourd.

## Entrée
- La première ligne contient deux entiers N et K.
- La deuxième ligne contient N entiers P_1, P_2, …, P_N.

## Sortie
Un seul entier : le plus petit poids possible pour le sac le plus lourd.

## Contraintes
- 1 ≤ N ≤ 12
- 1 ≤ K ≤ 5
- 1 ≤ P_i ≤ 1 000

## Indices
1. Mettre chaque objet dans le sac le moins chargé ne marche pas toujours : regarde le deuxième exemple. Il faut essayer plusieurs répartitions. Mais il y en a Kᴺ = 5¹² ≈ 244 millions : il faut éviter d'explorer celles qui ne servent à rien.
2. Écris `placer(i)`, qui essaie de mettre l'objet i dans chacun des sacs, puis appelle `placer(i + 1)`. Garde la meilleure charge maximale trouvée jusqu'ici, et abandonne une branche dès qu'un sac atteint cette valeur : elle ne peut plus faire mieux.
3. Deux sacs qui ont la même charge sont interchangeables : n'en essaie qu'un. Place les objets du plus lourd au plus léger, et essaie d'abord le sac le moins chargé : tu trouves vite une bonne répartition, et l'élagage coupe alors presque tout.

## Solution
**L'idée : le retour sur trace avec élagage (« séparation et évaluation »).** On trie les objets du plus lourd au plus léger. La fonction récursive `placer(i)` essaie de mettre l'objet i dans chaque sac, appelle `placer(i + 1)`, puis retire l'objet. Quand tous les objets sont placés, on a une répartition complète et on met à jour `meilleur`, la plus petite charge maximale trouvée.

Sans précaution, cela fait Kᴺ répartitions. Trois idées coupent l'arbre de recherche :
- **Couper les branches sans espoir.** Si un sac de charge c reçoit un objet de poids p avec `c + p ≥ meilleur`, cette branche ne peut pas donner une répartition strictement meilleure : on l'abandonne. En essayant les sacs du moins chargé au plus chargé, on peut même arrêter la boucle (`break`) : les sacs suivants sont encore plus chargés.
- **Ne pas répéter les cas symétriques.** Deux sacs qui ont la même charge à ce moment donnent exactement les mêmes possibilités pour la suite : on n'essaie que le premier. Cela évite en particulier d'essayer chaque sac vide.
- **S'arrêter dès que c'est parfait.** Aucune répartition ne fait mieux que `borne = max(objet le plus lourd, ⌈total / K⌉)`. Si `meilleur` atteint cette borne, on arrête toute la recherche.

Commencer par les objets lourds et par le sac le moins chargé fait que la toute première répartition trouvée est déjà bonne (c'est celle du glouton « sac le moins chargé »). L'élagage devient alors très efficace.

**Pourquoi le glouton seul ne suffit pas.** Sur le deuxième exemple (objets de 3, 3, 2, 2, 2 et deux sacs), le glouton donne 3 + 2 + 2 = 7 et 3 + 2 = 5, soit 7. La meilleure répartition est 3 + 3 = 6 et 2 + 2 + 2 = 6, soit 6.

**Complexité.** Exponentielle dans le pire cas, mais sur les tests (N = 12, K = 5), la fonction `placer` est appelée moins de 10 000 fois, au lieu de centaines de millions.

**Pourquoi la solution naïve est trop lente.** Essayer les Kᴺ répartitions sans élaguer fait 5¹² ≈ 2,4 × 10⁸ répartitions complètes, chacune avec le calcul d'un maximum : plusieurs minutes en Python, et environ une seconde même en C++.

**Pièges.**
- Remets la charge du sac à jour après l'appel récursif (`charges[j] -= objets[i]`).
- L'élagage utilise `≥` et non `>` : une répartition qui égale `meilleur` ne l'améliore pas.
- Il peut y avoir plus de sacs que d'objets : certains sacs restent vides, et la réponse est alors l'objet le plus lourd.
