---
id: premiere-erreur-de-parenthesage
title: Première erreur de parenthésage
chapter: p3-piles-files
order: 2
tags: [chaînes, simulation]
samples: 3
---

## Énoncé
Une chaîne est formée des caractères `(`, `)`, `[`, `]`, `{` et `}`. On la lit de gauche à droite. Chaque caractère fermant doit refermer le dernier caractère ouvrant **pas encore refermé**, et il doit être du même type : `)` referme `(`, `]` referme `[`, `}` referme `{`.

- Si un caractère fermant ne peut pas refermer d'ouvrant (il n'y en a aucun en attente, ou le dernier en attente est d'un autre type), la chaîne est incorrecte : afficher la position de ce fermant. On s'arrête à la première erreur de ce genre.
- Si la lecture va jusqu'au bout sans telle erreur mais que des ouvrants n'ont jamais été refermés, afficher la position du plus à gauche d'entre eux.
- Sinon, la chaîne est bien parenthésée : afficher `OUI`.

Les positions sont numérotées à partir de 1.

## Entrée
Une seule ligne : la chaîne, de longueur `N`, sans espace.

## Sortie
`OUI`, ou la position de l'erreur.

## Contraintes
- 1 ≤ N ≤ 100 000

## Indices
1. Les ouvrants en attente se referment dans l'ordre inverse de leur ouverture : le dernier ouvert est le premier refermé. C'est une pile.
2. Empiler la **position** de chaque ouvrant plutôt que le caractère : on retrouve le caractère avec `s[position]`, et on a la position pour l'affichage.
3. À la fin, s'il reste des ouvrants, le plus à gauche est tout en bas de la pile.

## Solution
On parcourt la chaîne avec une pile qui contient les positions des ouvrants en attente, du plus ancien (en bas) au plus récent (en haut).

- Pour un ouvrant, on empile sa position.
- Pour un fermant, on regarde le haut de la pile. Si la pile est vide, ou si l'ouvrant du haut n'est pas du même type, on affiche la position du fermant et on s'arrête. Sinon, on dépile : cet ouvrant est refermé.

Si la boucle se termine, la pile contient les ouvrants jamais refermés. Si elle est vide, on affiche `OUI` ; sinon, on affiche la position tout en bas de la pile, `pile[0]`, qui est le plus à gauche puisque les positions ont été empilées dans l'ordre croissant.

**Invariant.** Avant de traiter le caractère `i`, la pile contient, dans l'ordre, exactement les ouvrants déjà lus et pas encore refermés. Le haut de la pile est donc bien le dernier ouvrant pas encore refermé, celui que le fermant doit refermer.

**Coût.** Chaque caractère est empilé au plus une fois et dépilé au plus une fois : au plus 2N opérations. Supprimer à répétition les paires `()`, `[]`, `{}` voisines dans la chaîne coûterait jusqu'à N² / 2 opérations. Les pièges : regarder le haut d'une pile vide, et oublier le cas des ouvrants restants à la fin.
