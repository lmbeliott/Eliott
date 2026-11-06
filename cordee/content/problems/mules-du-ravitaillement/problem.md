---
id: mules-du-ravitaillement
title: Les mules du ravitaillement
chapter: n3-recursivite
order: 4
tags: [backtracking, récursivité]
samples: 2
---

## Énoncé
Le refuge des Aiguilles est ravitaillé à dos de mule. Ce matin, Inès doit répartir N sacs entre ses K mules : le sac numéro i pèse P_i kilos, et chaque sac doit être chargé en entier sur une seule mule. Une mule peut porter autant de sacs qu'on veut, ou aucun.

La caravane avance au rythme de la mule la plus chargée. Inès veut donc que la charge de la mule la plus chargée soit la plus petite possible.

Écris un programme qui calcule cette charge minimale.

## Entrée
- La première ligne contient deux entiers N et K.
- La deuxième ligne contient N entiers P_1, P_2, …, P_N.

## Sortie
Un seul entier : la plus petite charge possible pour la mule la plus chargée.

## Contraintes
- 1 ≤ N ≤ 12
- 1 ≤ K ≤ 5
- 1 ≤ P_i ≤ 1 000

## Indices
1. Mettre chaque sac sur la mule la moins chargée ne marche pas toujours : regarde le deuxième exemple. Il faut essayer plusieurs répartitions. Mais il y en a Kᴺ = 5¹² ≈ 244 millions : il faut éviter d'explorer celles qui ne servent à rien.
2. Écris `placer(i)`, qui essaie de mettre le sac i sur chacune des mules, puis appelle `placer(i + 1)`. Garde la meilleure charge maximale trouvée jusqu'ici, et abandonne une branche dès qu'une mule atteint cette valeur : elle ne peut plus faire mieux.
3. Deux mules qui portent la même charge sont interchangeables : n'en essaie qu'une. Place les sacs du plus lourd au plus léger, et essaie d'abord la mule la moins chargée : tu trouves vite une bonne répartition, et l'élagage coupe alors presque tout.

## Solution
**L'idée : le retour sur trace avec élagage (« séparation et évaluation »).** On trie les sacs du plus lourd au plus léger. La fonction récursive `placer(i)` essaie de charger le sac i sur chaque mule, appelle `placer(i + 1)`, puis retire le sac. Quand tous les sacs sont placés, on a une répartition complète et on met à jour `meilleur`, la plus petite charge maximale trouvée.

Sans précaution, cela fait Kᴺ répartitions. Trois idées coupent l'arbre de recherche :
- **Couper les branches sans espoir.** Si une mule de charge c reçoit un sac de poids p avec `c + p ≥ meilleur`, cette branche ne peut pas donner une répartition strictement meilleure : on l'abandonne. En essayant les mules de la moins chargée à la plus chargée, on peut même arrêter la boucle (`break`) : les mules suivantes sont encore plus chargées.
- **Ne pas répéter les cas symétriques.** Deux mules qui ont la même charge à ce moment donnent exactement les mêmes possibilités pour la suite : on n'essaie que la première. Cela évite en particulier d'essayer chaque mule vide.
- **S'arrêter dès que c'est parfait.** Aucune répartition ne fait mieux que `borne = max(plus lourd sac, ⌈total / K⌉)`. Si `meilleur` atteint cette borne, on arrête toute la recherche.

Commencer par les sacs lourds et par la mule la moins chargée fait que la toute première répartition trouvée est déjà bonne (c'est celle du glouton « mule la moins chargée »). L'élagage devient alors très efficace.

**Pourquoi le glouton seul ne suffit pas.** Sur le deuxième exemple (sacs de 3, 3, 2, 2, 2 et deux mules), le glouton donne 3 + 2 + 2 = 7 et 3 + 2 = 5, soit 7. La meilleure répartition est 3 + 3 = 6 et 2 + 2 + 2 = 6, soit 6.

**Complexité.** Exponentielle dans le pire cas, mais sur les tests (N = 12, K = 5), la fonction `placer` est appelée moins de 10 000 fois, au lieu de centaines de millions.

**Pourquoi la solution naïve est trop lente.** Essayer les Kᴺ répartitions sans élaguer fait 5¹² ≈ 2,4 × 10⁸ répartitions complètes, chacune avec le calcul d'un maximum : plusieurs minutes en Python, et environ une seconde même en C++.

**Pièges.**
- Remets la charge de la mule à jour après l'appel récursif (`charges[j] -= sacs[i]`).
- L'élagage utilise `≥` et non `>` : une répartition qui égale `meilleur` ne l'améliore pas.
- Il peut y avoir plus de mules que de sacs : certaines mules restent vides, et la réponse est alors le sac le plus lourd.
