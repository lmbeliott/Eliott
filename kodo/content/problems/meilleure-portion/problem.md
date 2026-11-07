---
id: meilleure-portion
title: Meilleure portion
chapter: p3-tableaux-avances
order: 5
tags: [listes]
samples: 2
---

## Énoncé
Un commerçant note son bénéfice de chaque jour, positif ou négatif, pendant `N` jours numérotés de 1 à `N`. Trouver une période de jours consécutifs (au moins un jour) dont le bénéfice total est le plus grand possible.

Si plusieurs périodes donnent ce même total, choisir celle qui commence le plus tôt, et parmi elles, la plus courte.

## Entrée
- La première ligne contient `N`.
- La deuxième ligne contient les `N` bénéfices, dans l'ordre des jours.

## Sortie
Trois entiers sur une ligne : le bénéfice total de la période, son premier jour et son dernier jour.

## Contraintes
- 1 ≤ N ≤ 30 000
- Chaque bénéfice est compris entre −1 000 et 1 000.

## Indices
1. Essayer toutes les périodes, avec une somme mise à jour au fur et à mesure, ferait environ `N² / 2` additions : 450 millions. Trop lent.
2. Pour chaque jour `i`, on cherche la meilleure période qui **se termine** le jour `i`. Comment la déduire de la meilleure période qui se termine le jour `i − 1` ?
3. Si la meilleure somme qui se termine la veille est négative, mieux vaut repartir de zéro et commencer la période le jour `i`.

## Solution
Notons `fin[i]` le plus grand total d'une période qui se termine le jour `i`. Une telle période est soit le jour `i` seul, soit une période qui se termine la veille, prolongée du jour `i`. Dans le second cas, on a intérêt à prendre la meilleure période qui se termine la veille. Donc `fin[i] = t[i] + max(fin[i − 1], 0)` : on prolonge si `fin[i − 1] ≥ 0`, on repart de zéro sinon. La réponse est le plus grand des `fin[i]`, car toute période se termine un certain jour.

Le programme parcourt les jours en tenant à jour `courant` (la valeur de `fin[i]`) et `debut` (le premier jour de la période correspondante), ainsi que le meilleur total vu et sa période. En cas d'égalité `fin[i − 1] = 0`, on **prolonge** : la période commence ainsi plus tôt. Et on ne remplace le meilleur que si `courant` est **strictement** plus grand : on garde la première période trouvée. On peut vérifier que ces deux choix donnent bien la période qui commence le plus tôt, puis la plus courte : si deux périodes de total maximal se croisent mal, la partie qui les sépare a un total nul, ce qui fournit une période encore plus à gauche, trouvée en premier.

Coût : un seul passage, un nombre constant d'opérations par jour. Le piège : initialiser le meilleur total à 0, ce qui est faux quand tous les bénéfices sont négatifs (la réponse est alors le plus grand d'entre eux, sur un seul jour). On l'initialise avec le premier jour.
