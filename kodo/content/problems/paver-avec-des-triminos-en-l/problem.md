---
id: paver-avec-des-triminos-en-l
title: Paver avec des triminos en L
chapter: n3-recursivite
order: 7
tags: [backtracking, récursivité, grilles]
samples: 2
---

## Énoncé
Une grille de R lignes et C colonnes contient des cases libres (`.`) et des cases bloquées (`#`). Un **trimino en L** couvre trois des quatre cases d'un carré de 2 × 2 : il peut être posé dans ses quatre orientations.

Paver la grille, c'est poser des triminos en L de sorte que chaque case libre soit couverte par exactement un trimino, sans couvrir de case bloquée ni dépasser de la grille.

Écris un programme qui compte les pavages de la grille. Deux pavages sont différents si l'un contient un trimino (trois cases précises) que l'autre ne contient pas.

## Entrée
- La première ligne contient deux entiers R et C.
- Les R lignes suivantes contiennent chacune C caractères `.` ou `#` : la grille, ligne par ligne.

## Sortie
Un seul entier : le nombre de pavages de la grille (`0` s'il n'y en a aucun).

## Contraintes
- 1 ≤ R ≤ 8 et 1 ≤ C ≤ 8
- R × C ≤ 48
- La grille contient au moins une case libre.

## Indices
1. Poser un trimino n'importe où, puis un autre n'importe où, et ainsi de suite, trouve chaque pavage plusieurs fois (une fois par ordre de pose) : pour 16 triminos, cela fait 16! ordres. Il faut décider dans quel ordre on couvre les cases.
2. Lis la grille ligne par ligne, de gauche à droite, et regarde la **première case libre pas encore couverte**. Elle doit être couverte par un trimino. Toutes les cases avant elle sont déjà couvertes : c'est donc la première case de ce trimino dans l'ordre de lecture.
3. Avec cette case en (0, 0), il reste exactement quatre formes : {(0, 0), (0, 1), (1, 0)}, {(0, 0), (0, 1), (1, 1)}, {(0, 0), (1, 0), (1, 1)} et {(0, 0), (1, 0), (1, −1)}. Pour chacune qui tient, pose-la, appelle la fonction récursive, puis retire-la.

## Solution
**L'idée : toujours couvrir la première case libre.** La fonction récursive `compter(pos)` cherche la première case non couverte à partir de la position `pos` (les cases sont numérotées ligne par ligne). S'il n'y en a plus, la grille est pavée : on compte 1. Sinon, cette case doit être couverte par un trimino, et toutes les cases avant elle le sont déjà. Le trimino qui la couvre ne peut donc pas utiliser de case plus haute, ni de case plus à gauche sur la même ligne : elle est sa première case. Un carré de 2 × 2 privé d'une case donne quatre formes, et chacune a une seule première case : il n'y a que quatre façons de poser ce trimino. Pour chacune qui tient dans la grille sur des cases libres non couvertes, on la pose, on ajoute `compter` sur la suite, puis on la retire.

Chaque pavage est trouvé **une seule fois** : à chaque étape, le trimino qui couvre la première case libre est imposé par le pavage.

Sur le premier exemple (2 × 3, tout libre), la première case est (0, 0). La forme {(0, 0), (0, 1), (1, 0)} laisse les cases (0, 2), (1, 1) et (1, 2), qui forment un L : un pavage. La forme {(0, 0), (1, 0), (1, 1)} laisse (0, 1), (0, 2) et (1, 2), encore un L : un deuxième pavage. La forme {(0, 0), (0, 1), (1, 1)} laisse la case (1, 0) isolée, et la quatrième forme sort de la grille. La réponse est 2.

**Élaguer tout de suite.** Chaque trimino couvre 3 cases : si le nombre de cases libres n'est pas un multiple de 3, la réponse est `0` sans rien chercher. Ensuite, une branche s'arrête d'elle-même dès que la première case libre ne peut être couverte par aucune des quatre formes : c'est souvent le cas très vite (une case libre isolée contre un bord, par exemple).

**Complexité.** Exponentielle dans le pire cas, mais chaque appel ne fait que quatre essais, et les impasses sont détectées tôt. Pour les grilles permises, il y a au plus une centaine de milliers d'appels : la grille 6 × 8 vide, qui a 1 514 pavages, en demande environ 70 000.

**Pourquoi la solution naïve est trop lente.** Essayer les triminos dans n'importe quel ordre trouve chaque pavage de 16 triminos 16! ≈ 2 × 10¹³ fois. Même en divisant à la fin, le nombre d'appels est astronomique. Fixer la case à couvrir enlève toutes ces répétitions.

**Pièges.**
- La forme {(0, 0), (1, 0), (1, −1)} descend vers la **gauche** : n'oublie pas de vérifier que la colonne −1 existe.
- Retire toujours le trimino après l'appel récursif, sinon les essais suivants croient ces cases encore couvertes.
- Un pavage n'existe que si chaque case libre est couverte : une grille d'une seule ligne n'en a aucun.
