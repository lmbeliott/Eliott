---
id: taches-avec-date-limite
title: Tâches avec date limite
chapter: n3-glouton
order: 5
tags: [glouton, tri]
samples: 2
---

## Énoncé
On a N tâches. Chaque tâche prend exactement un jour, et on ne peut faire qu'une seule tâche par jour ; les jours sont numérotés 1, 2, 3… La tâche numéro i rapporte G_i points si elle est faite au plus tard le jour D_i. Une tâche faite trop tard ne rapporte rien : autant ne pas la faire.

Écris un programme qui calcule le plus grand total de points qu'on peut obtenir en choisissant bien les tâches à faire et leurs jours.

## Entrée
- La première ligne contient un entier N.
- Les N lignes suivantes contiennent chacune deux entiers D_i et G_i.

## Sortie
Un seul entier : le plus grand total de points possible.

## Contraintes
- 1 ≤ N ≤ 15 000
- 1 ≤ D_i ≤ 10⁹
- 1 ≤ G_i ≤ 10 000

## Indices
1. Si tu as déjà choisi un ensemble de tâches, il est facile de savoir s'il est faisable : fais-les par date limite croissante. Il est faisable si, pour chaque jour d, au plus d tâches choisies ont une date limite inférieure ou égale à d.
2. Parcours les tâches par date limite croissante en les gardant toutes. Quand tu viens d'ajouter une tâche de date limite d et que tu en gardes plus que d, l'ensemble n'est plus faisable : il faut en abandonner une. Laquelle ?
3. Abandonne la tâche gardée qui rapporte le moins. Pour la retrouver vite, range les gains des tâches gardées dans un tas (`heapq` en Python, `priority_queue` en C++).

## Solution
**Savoir si un choix est faisable.** Un ensemble de tâches est faisable si on peut les placer sur des jours distincts, chacune avant sa date limite. Le mieux est de les faire par date limite croissante : la j-ième tâche de cet ordre est faite le jour j, et l'ensemble est faisable si et seulement si chaque tâche a une date limite au moins égale à son rang. Autrement dit : pour chaque d, au plus d tâches choisies ont une date limite ≤ d.

**L'idée gloutonne : tout garder, puis corriger.** On parcourt les tâches par date limite croissante. On ajoute chaque tâche à l'ensemble gardé. Si on garde maintenant plus de tâches que la date limite d de celle qu'on vient d'ajouter, il y en a exactement une de trop parmi celles de date limite ≤ d : on retire celle qui rapporte le moins (c'est peut-être la nouvelle). À la fin, l'ensemble gardé est faisable, et son total est la réponse.

**Pourquoi c'est optimal.** On montre qu'après chaque étape, l'ensemble gardé a le plus grand total possible parmi les ensembles faisables formés des tâches déjà parcourues. Quand on doit retirer une tâche, c'est qu'il y a d + 1 tâches de date limite ≤ d : n'importe quel ensemble faisable doit en laisser au moins une de côté. Laisser la moins rentable est le meilleur choix : si une solution optimale en laisse une autre, on peut l'échanger contre la moins rentable sans perdre de points et sans rendre le choix infaisable (les dates limites des tâches déjà vues sont toutes ≤ d).

Sur le premier exemple, on voit (1, 10), puis (1, 30) : deux tâches pour un jour, on abandonne 10. Puis (2, 40) et (2, 50) : trois tâches pour deux jours, on abandonne 30. Il reste 40 + 50 = 90 (la tâche à 40 points est faite le jour 1).

**Complexité.** Le tri coûte O(N log N), et chaque tâche entre et sort au plus une fois du tas, en O(log N) : O(N log N) en tout.

**Pourquoi les solutions simples ne marchent pas.** Prendre les tâches par date limite croissante tant qu'il reste de la place est faux : sur le premier exemple, cela garde la tâche à 10 points au lieu de celle à 30. Prendre les gains du plus grand au plus petit en plaçant chaque tâche le jour de sa date limite est faux aussi : la tâche à 40 points trouverait son jour 2 occupé, alors qu'elle pouvait aller au jour 1. Le placer au **dernier** jour libre avant sa date limite est juste, mais chercher ce jour case par case coûte O(N²). Enfin, essayer tous les ensembles de tâches coûte 2ᴺ.

**Pièges.**
- Les dates limites vont jusqu'à 10⁹ : pas question de faire un tableau indexé par les jours. Avec le tas, on ne regarde que le nombre de tâches gardées.
- Le total peut atteindre 15 000 × 10 000 = 1,5 × 10⁸ : il tient encore dans un `int`, mais un `long long` évite toute mauvaise surprise.
- En Python, `heapq` donne toujours le **plus petit** élément : c'est exactement ce qu'il faut ici. En C++, `priority_queue` donne le plus grand par défaut : utilise `greater<long long>`.
