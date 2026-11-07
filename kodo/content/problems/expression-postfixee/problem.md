---
id: expression-postfixee
title: Expression postfixée
chapter: p3-piles-files
order: 3
tags: [chaînes, simulation]
samples: 3
---

## Énoncé
Dans une expression **postfixée**, chaque opérateur est écrit après ses deux opérandes. Ainsi, `3 4 +` vaut `3 + 4 = 7`, et `5 1 2 + 4 * + 3 -` vaut `5 + (1 + 2) × 4 − 3 = 14`. Il n'y a jamais besoin de parenthèses.

Les opérateurs sont `+`, `-` et `*`. Pour `a b -`, le résultat est `a − b`. Calculer la valeur de l'expression donnée, ou afficher `ERREUR` si elle est mal formée : un opérateur arrive alors qu'il y a moins de deux valeurs disponibles, ou bien il ne reste pas exactement une valeur à la fin.

## Entrée
Une seule ligne : les `N` éléments de l'expression (entiers positifs ou nuls et opérateurs), séparés par des espaces.

## Sortie
La valeur de l'expression, ou `ERREUR`.

## Contraintes
- 1 ≤ N ≤ 40 000
- les nombres de l'expression sont entre `0` et `99`
- tous les résultats des opérations effectuées sont compris entre −10¹⁸ et 10¹⁸

## Indices
1. Lire l'expression de gauche à droite. Un nombre est mis de côté ; un opérateur utilise les deux derniers nombres mis de côté.
2. Une pile : un nombre est empilé ; un opérateur dépile `b`, puis `a`, et empile `a op b`. Attention à l'ordre pour `-`.
3. L'expression est mal formée si l'on doit dépiler une pile qui a moins de deux éléments, ou si la pile ne contient pas exactement un élément à la fin.

## Solution
On parcourt les éléments avec une pile de valeurs. Un nombre est empilé. Pour un opérateur, s'il y a moins de deux valeurs dans la pile, l'expression est mal formée ; sinon, on dépile `b` (le haut), puis `a`, et on empile le résultat de `a op b`. À la fin, l'expression est correcte si et seulement si la pile contient exactement une valeur : c'est le résultat.

**Pourquoi.** Dans une expression postfixée, les deux opérandes d'un opérateur sont les deux valeurs les plus récentes qui n'ont pas encore été utilisées. La pile contient exactement ces valeurs non utilisées, la plus récente en haut : l'invariant est « la pile contient, dans l'ordre, les valeurs des sous-expressions déjà lues et pas encore utilisées ».

**Coût.** Une opération de pile par élément : environ N opérations. Chercher dans la chaîne un motif « nombre nombre opérateur », le remplacer par sa valeur et recommencer coûterait jusqu'à N² / 2 opérations. Les pièges : inverser `a` et `b` pour la soustraction, et oublier les valeurs restantes (`1 2 3 +` est mal formée). En C++, les valeurs nécessitent des `long long`.
