---
id: plus-grand-pgcd-de-k-nombres
title: Plus grand PGCD de K nombres
chapter: p3-complexite
order: 8
synthesis: true
tags: [mathématiques, arithmétique, listes]
samples: 2
---

## Énoncé
On dispose de N entiers strictement positifs. Pour chaque K de 1 à N, on veut choisir K de ces entiers (à des positions différentes) de façon que leur PGCD soit le plus grand possible.

Par exemple, avec 6, 10, 15, 12 et 9 : pour K = 2, le meilleur choix est {6, 12}, de PGCD 6 ; pour K = 3, on peut choisir {6, 12, 9}, de PGCD 3, et on ne peut pas faire mieux.

Afficher, pour chaque K, ce plus grand PGCD.

## Entrée
La première ligne contient N. La deuxième ligne contient les N entiers.

## Sortie
Une ligne de N entiers : le plus grand PGCD possible pour K = 1, 2, …, N.

## Contraintes
- 1 ≤ N ≤ 20 000
- 1 ≤ chaque entier ≤ 100 000

## Indices
1. Essayer tous les choix de K nombres est hors de question. Retourner la question : pour un entier d, combien des N nombres sont des multiples de d ? Si au moins K le sont, on peut obtenir un PGCD au moins égal à d.
2. Notons cnt[d] le nombre de multiples de d parmi les N nombres. Avec un tableau de fréquences des valeurs, cnt[d] se calcule en parcourant d, 2d, 3d… jusqu'à 100 000. Combien d'opérations pour tous les d ?
3. La réponse pour K est le plus grand d tel que cnt[d] ≥ K. Elle ne peut que diminuer quand K augmente : on peut toutes les calculer d'un seul balayage.

## Solution
**Reformuler.** Notons M = 100 000 et cnt[d] le nombre de positions dont la valeur est un multiple de d. La réponse pour K est le plus grand d tel que cnt[d] ≥ K :

- si cnt[d] ≥ K, on choisit K multiples de d ; leur PGCD est un multiple de d, donc au moins d ;
- réciproquement, si K nombres ont pour PGCD g, ils sont tous multiples de g, donc cnt[g] ≥ K.

**Calculer tous les cnt[d].** On remplit un tableau de fréquences `f[v]` (nombre de positions de valeur v), puis, pour chaque d, cnt[d] = f[d] + f[2d] + f[3d] + … Le nombre total d'additions vaut M/1 + M/2 + … + M/M ≈ M × ln(M), environ 1,2 million : c'est le coût de la **série harmonique**, O(M log M). Tester la divisibilité des N nombres pour chaque d coûterait N × M = 2 × 10⁹ opérations ; énumérer les diviseurs de chaque nombre jusqu'à sa racine carrée en coûterait environ N × √M ≈ 6 × 10⁶ : c'est une autre solution acceptable, mais le parcours des multiples est plus simple et son coût ne dépend pas de N. Les contraintes (valeurs bornées par 10⁵) orientent vers le tableau de fréquences.

**Toutes les réponses d'un coup.** On parcourt d de M jusqu'à 1 en gardant un indice K, qui part de 1 : tant que K ≤ N et cnt[d] ≥ K, la réponse pour K est d (c'est le plus grand d possible, puisque les d plus grands ont déjà été examinés sans succès pour ce K), et on augmente K. **Invariant** : quand on examine d, les réponses pour 1, …, K − 1 sont trouvées, et aucun d' > d ne vérifie cnt[d'] ≥ K. Comme cnt[1] = N, toutes les réponses sont trouvées à la fin. Ce balayage coûte O(M + N).

**Coût total.** O(N + M log M). Sur l'exemple, cnt[15] = 1, cnt[12] = 1, …, cnt[6] = 2, cnt[5] = 2, cnt[4] = 1, cnt[3] = 4, cnt[2] = 3, cnt[1] = 5 : les réponses sont 15, 6, 3, 3, 1.
