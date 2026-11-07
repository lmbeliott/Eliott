---
id: energie-de-depart-minimale
title: Énergie de départ minimale
chapter: n3-glouton
order: 7
tags: [glouton, tri]
samples: 2
---

## Énoncé
On doit faire N tâches, une par une, dans l'ordre de son choix. Pour commencer la tâche i, il faut avoir au moins R_i points d'énergie. Une fois la tâche finie, l'énergie change de G_i points : elle augmente si G_i est positif, elle diminue s'il est négatif. On a toujours R_i ≥ −G_i : l'énergie ne devient donc jamais négative.

Écris un programme qui calcule la plus petite énergie de départ qui permet de faire toutes les tâches, en choisissant bien leur ordre.

## Entrée
- La première ligne contient un entier N.
- Les N lignes suivantes contiennent chacune deux entiers R_i et G_i.

## Sortie
Un seul entier : l'énergie de départ minimale.

## Contraintes
- 1 ≤ N ≤ 10 000
- 0 ≤ R_i ≤ 10⁶
- −R_i ≤ G_i ≤ 10⁶

## Indices
1. Une tâche qui rapporte de l'énergie (G_i ≥ 0) ne fait jamais de mal : mieux vaut la faire avant celles qui en coûtent. Parmi les tâches qui rapportent, laquelle faire en premier ?
2. Pour les tâches qui coûtent, compare deux tâches voisines a et b : de quelle énergie faut-il disposer avant elles pour faire a puis b ? Et pour faire b puis a ? Regarde le deuxième exemple : commencer par la plus exigeante n'est pas toujours le bon choix.
3. Faire a puis b demande `max(R_a, R_b − G_a)`. Les tâches qui coûtent se rangent par `R_i + G_i` décroissant : l'énergie qui reste après la tâche, si on la commence avec tout juste R_i. Ensuite, un seul parcours donne l'énergie de départ nécessaire.

## Solution
**Calculer l'énergie nécessaire pour un ordre fixé.** Si on fait les tâches dans un ordre donné, et que V est le changement total d'énergie avant la tâche i, il faut une énergie de départ E telle que `E + V ≥ R_i`. L'énergie de départ minimale est donc le plus grand des `R_i − V` (et au moins `0`). Un seul parcours suffit. Toute la question est de choisir l'ordre.

**D'abord les tâches qui rapportent, les moins exigeantes en premier.** Si une tâche qui coûte est juste avant une tâche qui rapporte, les échanger ne demande jamais plus d'énergie : la tâche qui rapporte, faite plus tôt, ne subit plus la perte de l'autre et a donc plus d'énergie qu'avant, et celle qui coûte, faite après le gain, en a au moins autant. Parmi les tâches qui rapportent, on les fait par R_i croissant : quand on attaque la plus exigeante, on a gagné tout ce qu'on pouvait avant.

**Puis les tâches qui coûtent, par énergie restante décroissante.** Pour deux tâches voisines a et b qui coûtent, faire a puis b demande, avant elles, `max(R_a, R_b − G_a)`, et b puis a demande `max(R_b, R_a − G_b)`. Si `R_a + G_a ≥ R_b + G_b`, alors `R_b − G_a ≤ R_a − G_b`, et comme `R_a ≤ R_a − G_b` (G_b est négatif), faire a d'abord ne coûte jamais plus. C'est l'argument d'échange : on trie les tâches qui coûtent par `R_i + G_i` décroissant. Cette quantité est l'énergie qui reste si l'on commence la tâche avec tout juste R_i : on garde pour la fin les tâches qui laissent le moins.

Sur le deuxième exemple, on fait d'abord (3, +4). Puis (6, −2), qui laisse 4, avant (7, −5), qui laisse 2. En partant de 5 : 5 → 9 → 7 → 2, et chaque tâche a l'énergie demandée. Avec 4, on aurait 8 puis 6 : pas assez pour (7, −5). Commencer les tâches qui coûtent par la plus exigeante (7, −5) demanderait 7.

**Complexité.** Deux tris et un parcours : O(N log N).

**Pourquoi les solutions simples ne marchent pas.** Essayer tous les ordres est impossible (N! ordres). Les tris qui viennent en premier à l'esprit sont faux : tout trier par R_i croissant, faire les tâches qui coûtent de la plus exigeante à la moins exigeante, ou de la plus petite perte à la plus grande, ou encore faire d'abord les plus gros gains. Chacun de ces tris se trompe sur certains tests.

**Pièges.**
- La réponse peut dépasser 2³¹ (jusqu'à environ 10¹⁰) : utilise des `long long` en C++.
- Les tâches avec G_i = 0 vont avec celles qui rapportent, triées par R_i comme elles. Pas n'importe où : elles ne changent pas l'énergie, mais leur R_i compte. Avec (10, 0) et (10, −10), faire (10, 0) en dernier demanderait 20 au lieu de 10.
- La réponse vaut au moins `0`, même si aucune tâche ne demande d'énergie.
