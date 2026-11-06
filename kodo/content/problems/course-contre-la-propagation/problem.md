---
id: course-contre-la-propagation
title: Course contre la propagation
chapter: n4-graphes
order: 4
tags: [graphes, parcours-en-largeur, grilles]
samples: 2
---

## Énoncé
Une grille contient des cases libres, des murs, des sorties, des cases contaminées et la case de départ d'un pion. La contamination se propage dans la grille pendant que le pion cherche à atteindre une sortie.

À la minute `0`, la contamination couvre exactement les cases sources et le pion est sur sa case de départ. Ensuite, chaque minute :
- la contamination s'étend de chaque case contaminée à ses cases voisines (haut, bas, gauche, droite), sauf les murs et les sorties ;
- le pion se déplace obligatoirement vers une case voisine qui n'est pas un mur.

Le pion peut entrer dans une sortie à n'importe quelle minute. Il ne peut entrer dans une autre case à la minute `t` que si la contamination l'atteint **strictement après** la minute `t` (ou ne l'atteint jamais).

Écris un programme qui calcule la première minute à laquelle le pion peut entrer dans une sortie, ou affiche `-1` s'il ne peut en atteindre aucune.

## Entrée
- La première ligne contient deux entiers `R` et `C` : le nombre de lignes et de colonnes.
- Les `R` lignes suivantes contiennent chacune `C` caractères : `.` pour une case libre, `#` pour un mur, `*` pour une source de contamination, `X` pour une sortie et `@` pour la case de départ du pion.

La grille contient exactement un `@` et au moins un `X`. Elle peut ne contenir aucun `*`. La case de départ et les sources se comportent ensuite comme des cases libres.

## Sortie
Un seul entier : la première minute à laquelle le pion entre dans une sortie, ou `-1` si c'est impossible.

## Contraintes
- 1 ≤ R, C ≤ 300

## Indices
1. La propagation ne dépend pas du pion. Commence par calculer, pour chaque case, la minute où la contamination l'atteint.
2. Ce calcul est un parcours en largeur qui part de toutes les sources à la fois. Les murs et les sorties l'arrêtent.
3. Fais ensuite un parcours en largeur depuis le pion : depuis une case atteinte à la minute `t`, une voisine peut être atteinte à la minute `t + 1` seulement si c'est une sortie, ou si la contamination y arrive strictement après `t + 1`.

## Solution
La propagation ne dépend pas du pion : on la calcule d'abord. Un **parcours en largeur à sources multiples**, qui part de toutes les cases `*` à la minute `0` et ne traverse ni murs ni sorties, donne pour chaque case la minute `conta[x]` où elle est contaminée (l'infini si elle ne l'est jamais).

On fait ensuite un **second parcours en largeur**, depuis la case du pion. Quand on retire de la file une case atteinte à la minute `t`, chaque voisine `v` qui n'est pas un mur et pas encore atteinte peut l'être à la minute `t + 1` :
- si `v` est une sortie, la réponse est `t + 1` : le parcours en largeur traite les cases par minutes croissantes, donc c'est la première minute possible ;
- sinon, `v` est atteinte seulement si `t + 1 < conta[v]`.

Pourquoi garder pour chaque case la **première** minute d'arrivée suffit : arriver plus tôt dans une case n'est jamais un désavantage, puisque la contrainte « arriver avant la contamination » est d'autant plus facile à respecter qu'on arrive tôt. Pour la même raison, le pion n'aurait jamais intérêt à attendre sur place.

Les deux parcours coûtent **O(R × C)**. Simuler minute par minute la contamination et l'ensemble des positions possibles du pion coûterait O(R × C) **par minute**, et la réponse peut dépasser 40 000 minutes dans un long couloir : beaucoup trop lent.

Pièges :
- L'inégalité est **stricte** : si le pion et la contamination arrivent dans une case à la même minute, le pion ne peut pas y entrer.
- Les sorties arrêtent la contamination : elles ne doivent pas la propager.
- Une case jamais contaminée doit avoir une valeur plus grande que toutes les minutes possibles (un grand nombre), pas `-1`.
