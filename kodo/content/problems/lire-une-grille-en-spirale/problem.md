---
id: lire-une-grille-en-spirale
title: Lire une grille en spirale
chapter: n2-grilles
order: 7
tags: [grilles, simulation]
samples: 2
---

## Énoncé
On te donne une grille de `H` lignes et `W` colonnes remplie de lettres. On la lit **en spirale**, dans le sens des aiguilles d'une montre : on part de la case en haut à gauche et on avance vers la droite. Dès que la case suivante sort de la grille ou a déjà été lue, on tourne d'un quart de tour vers la droite (droite, puis bas, puis gauche, puis haut, puis à nouveau droite…), et on continue jusqu'à avoir lu toutes les cases, chacune une seule fois.

Par exemple, la grille

```
abcd
efgh
ijkl
```

se lit `abcd`, puis `hl` en descendant, puis `kji` vers la gauche, puis `e` en remontant, puis `fg` vers la droite.

Écris un programme qui affiche les lettres de la grille dans l'ordre de cette lecture.

## Entrée
- La première ligne contient deux entiers `H` et `W` : le nombre de lignes et le nombre de colonnes.
- Les `H` lignes suivantes contiennent chacune `W` lettres minuscules : la grille.

## Sortie
Une seule ligne de `H × W` lettres : la grille lue en spirale.

## Contraintes
- 1 ≤ H ≤ 100
- 1 ≤ W ≤ 100

## Indices
1. Garde la position `(l, c)` de la case lue et une direction `(dl, dc)`. Range les quatre directions dans l'ordre où l'on tourne : `(0, 1)`, `(1, 0)`, `(0, -1)`, `(-1, 0)`. Tourner d'un quart de tour, c'est passer à la direction suivante de cette liste.
2. Garde aussi une grille de booléens `vu`, pour savoir quelles cases ont déjà été lues.
3. Fais exactement `H × W` tours de boucle : lis la case, marque-la, puis regarde la case suivante dans la direction actuelle. Si elle sort de la grille ou si elle est déjà lue, tourne avant d'avancer.

## Solution
On simule la lecture case par case, exactement comme l'énoncé la décrit.

Les quatre directions sont rangées dans l'ordre où l'on tourne : droite `(0, 1)`, bas `(1, 0)`, gauche `(0, -1)`, haut `(-1, 0)`. La direction actuelle est un numéro `d` entre 0 et 3, et tourner d'un quart de tour revient à faire `d = (d + 1) % 4`.

On part de `(0, 0)` avec `d = 0`, et on répète `H × W` fois :
1. on ajoute la lettre de la case `(l, c)` au résultat et on marque la case dans `vu` ;
2. on calcule la case suivante `(l + dl, c + dc)` ;
3. si elle sort de la grille ou si elle est déjà marquée, on tourne, et on recalcule la case suivante avec la nouvelle direction ;
4. on avance.

Pourquoi un seul quart de tour suffit-il toujours ? Après avoir tourné, la nouvelle direction mène à une case qui n'a pas encore été lue, tant qu'il en reste. Et au tout dernier tour de boucle, on calcule une case suivante sans s'en servir : peu importe qu'elle soit hors de la grille.

Avec la grille de deux colonnes `ab`, `cd`, `ef`, `gh`, on lit `ab`, on descend `dfh`, on va à gauche `g`, et on remonte `ec` : la réponse est `abdfhgec`.

Les pièges :
- lire deux fois une case, ou en oublier une, quand la grille n'a qu'une ligne ou qu'une colonne, ou quand il ne reste qu'une ligne au milieu : la grille `vu` règle tous ces cas d'un coup ;
- tourner dans le mauvais sens : après la droite vient le bas ;
- s'arrêter quand on est bloqué au lieu de compter les cases : on sait qu'il faut en lire exactement `H × W`.

Une autre méthode lit la grille couche par couche, en gardant les numéros de la première et de la dernière ligne et colonne pas encore lues. Elle marche aussi, mais elle demande plus de précautions sur les couches d'une seule ligne ou d'une seule colonne.
