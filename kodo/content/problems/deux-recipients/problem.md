---
id: deux-recipients
title: Deux récipients
chapter: p4-graphes-implicites
order: 4
tags: [parcours-en-largeur, mathématiques, dictionnaires]
samples: 2
---

## Énoncé
On dispose de deux récipients sans graduation, de contenances `A` et `B` litres, vides au départ, et d'un robinet. Une **opération** est l'une des six actions suivantes :
- remplir complètement le premier récipient, ou le second, au robinet ;
- vider complètement le premier récipient, ou le second ;
- verser le premier dans le second, ou le second dans le premier, jusqu'à ce que celui qu'on verse soit vide ou que celui qui reçoit soit plein.

Calculer le nombre minimal d'opérations pour qu'un des deux récipients contienne exactement `C` litres, ou afficher `-1` si c'est impossible.

## Entrée
Une seule ligne contenant trois entiers `A`, `B` et `C`.

## Sortie
Un seul entier : le nombre minimal d'opérations, ou `-1`.

## Contraintes
- 1 ≤ A, B ≤ 50 000
- 0 ≤ C ≤ 100 000

## Indices
1. Un état est un couple `(x, y)` : les quantités dans les deux récipients. Chaque opération mène à un autre état : la réponse est une distance, calculée par un parcours en largeur depuis `(0, 0)`.
2. Il y a jusqu'à 50 001 × 50 001 couples possibles : un tableau de cette taille ne tient pas en mémoire. Ne stocker que les états réellement atteints, dans un dictionnaire.
3. Après n'importe quelle opération, l'un des deux récipients est vide ou plein. Combien d'états peut-on donc atteindre ?

## Solution
Un état est le couple `(x, y)` des quantités contenues. Depuis `(x, y)`, les six opérations donnent `(A, y)`, `(x, B)`, `(0, y)`, `(x, 0)`, puis, en notant `v = min(x, B − y)` et `w = min(y, A − x)` les volumes versés, `(x − v, y + v)` et `(x + w, y − w)`. Un parcours en largeur depuis `(0, 0)` donne le nombre minimal d'opérations pour atteindre chaque état ; on s'arrête au premier état défilé où `x = C` ou `y = C`. Comme les états sortent de la file par distances croissantes, c'est le minimum cherché.

**Taille de l'espace d'états.** Il y a `(A + 1)(B + 1)` couples, soit 2,5 × 10⁹ : impossible de réserver un tableau de distances. Mais chaque opération laisse un récipient vide ou plein : remplir le rend plein, vider le rend vide, et un versement s'arrête quand la source est vide ou la destination pleine. Les états atteints sont donc sur le bord du rectangle, au plus `2(A + 1) + 2(B + 1)` états. On les range dans un dictionnaire (en C++, une `map` de couples), et le parcours coûte O(A + B) opérations de dictionnaire.

**Le lien avec l'arithmétique.** Toutes les quantités manipulées sont des combinaisons `uA + vB` avec `u`, `v` entiers, donc des multiples de `d = pgcd(A, B)`. Si `C` n'est pas un multiple de `d`, ou si `C > max(A, B)`, la réponse est `-1`. Le théorème de Bézout montre que tous les autres `C` sont atteignables, mais le nombre minimal d'opérations demande bien le parcours.
