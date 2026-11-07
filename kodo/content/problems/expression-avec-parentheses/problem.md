---
id: expression-avec-parentheses
title: Expression avec parenthèses
chapter: p3-piles-files
order: 8
synthesis: true
tags: [chaînes, simulation]
samples: 3
---

## Énoncé
Calculer la valeur d'une expression écrite sur une ligne, sans espace, avec des entiers positifs ou nuls, les opérations `+`, `-`, `*` et des parenthèses. Les règles sont celles des mathématiques : on calcule d'abord ce qui est entre parenthèses, les multiplications passent avant les additions et les soustractions, et des opérations de même priorité se font de gauche à droite. Ainsi, `2+3*4` vaut `14`, `(2+3)*4` vaut `20` et `10-4-3` vaut `3`.

Le signe `-` n'est jamais placé devant un nombre pour le rendre négatif : il est toujours entre deux opérandes.

## Entrée
Une seule ligne : l'expression, de longueur `N`. Elle est correcte, et les nombres n'ont pas de zéro inutile au début.

## Sortie
Un seul entier : la valeur de l'expression.

## Contraintes
- 1 ≤ N ≤ 100 000
- chaque nombre est entre `0` et `999`
- les résultats de toutes les opérations du calcul sont compris entre −10¹⁸ et 10¹⁸
- les parenthèses peuvent être imbriquées jusqu'à 20 000 niveaux

## Indices
1. Chercher les parenthèses les plus intérieures, les calculer, remplacer et recommencer peut coûter N² opérations.
2. Utiliser deux piles : une pour les valeurs, une pour les opérateurs et les parenthèses ouvrantes. « Appliquer » un opérateur, c'est dépiler deux valeurs `b` puis `a` et empiler `a op b`.
3. Avant d'empiler un opérateur, appliquer tous les opérateurs en haut de la pile qui ont une priorité **supérieure ou égale** (sans dépasser une parenthèse ouvrante). Une parenthèse fermante applique tout jusqu'à la parenthèse ouvrante correspondante, puis retire celle-ci.

## Solution
On lit l'expression de gauche à droite avec deux piles : `valeurs` et `ops` (opérateurs et parenthèses ouvrantes). Appliquer le haut de `ops` signifie : retirer l'opérateur, dépiler `b` puis `a`, empiler `a op b`.

- Un **nombre** (on lit tous ses chiffres) est empilé dans `valeurs`.
- Une parenthèse **ouvrante** est empilée dans `ops`.
- Un **opérateur** `o` : tant que le haut de `ops` est un opérateur de priorité supérieure ou égale à celle de `o`, on l'applique ; puis on empile `o`. Les priorités sont 2 pour `*`, 1 pour `+` et `-`.
- Une parenthèse **fermante** : on applique les opérateurs jusqu'à la parenthèse ouvrante, que l'on retire.

À la fin, on applique tous les opérateurs restants ; la valeur restante est le résultat.

**Pourquoi.** Invariant : dans la pile `ops`, entre deux parenthèses ouvrantes, les priorités sont strictement croissantes vers le haut. Un opérateur reste dans la pile tant que son opérande de droite n'est pas complet : il l'est dès qu'arrive un opérateur de priorité plus faible ou égale (règle de gauche à droite), une parenthèse fermante ou la fin. Quand on l'applique, les deux valeurs du haut sont exactement ses deux opérandes, déjà entièrement calculés. On retrouve ainsi l'ordre de calcul des mathématiques.

**Coût.** Chaque nombre, opérateur ou parenthèse est empilé une fois et dépilé une fois : environ N opérations. Une solution qui s'appelle elle-même pour chaque parenthèse dépasserait la profondeur autorisée en Python avec 20 000 niveaux. En C++, il faut des `long long`. Les pièges : appliquer `-` avec les opérandes inversés, et utiliser « priorité strictement supérieure » au lieu de « supérieure ou égale », qui calculerait `10-4-3` comme `10-(4-3)`.
