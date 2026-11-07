---
id: tourner-une-grille
title: Tourner une grille
chapter: n2-grilles
order: 5
tags: [grilles]
samples: 2
---

## Énoncé
On te donne une grille de `H` lignes et `W` colonnes. Écris un programme qui affiche cette grille après l'avoir tournée d'un quart de tour **dans le sens des aiguilles d'une montre**.

Après la rotation, la grille a `W` lignes et `H` colonnes. La première colonne de la grille de départ, lue de bas en haut, devient la première ligne de la nouvelle grille. Par exemple :

```
abc        da
def   →    eb
           fc
```

## Entrée
- La première ligne contient deux entiers `H` et `W` : le nombre de lignes et le nombre de colonnes.
- Les `H` lignes suivantes contiennent chacune `W` caractères : des lettres minuscules, des `.` ou des `#`.

## Sortie
`W` lignes de `H` caractères chacune : la grille tournée.

## Contraintes
- 1 ≤ H ≤ 100
- 1 ≤ W ≤ 100

## Indices
1. Fais l'essai sur papier avec l'exemple `abc` / `def`. Où se retrouve la case en bas à gauche, `d` ? Et la case en haut à gauche, `a` ?
2. La ligne `i` de la nouvelle grille est faite de la colonne `i` de l'ancienne grille, lue **de bas en haut** : en partant de la ligne `H - 1` jusqu'à la ligne 0.
3. Construis chaque nouvelle ligne caractère par caractère : pour `i` de 0 à `W - 1`, parcours `l` de `H - 1` jusqu'à 0, ajoute `grille[l][i]`, puis affiche la ligne obtenue.

## Solution
Regardons où va chaque case. Quand on tourne d'un quart de tour vers la droite, la colonne de gauche se couche et devient la ligne du haut : sa case du bas (`d` dans l'exemple) se retrouve tout à gauche, et sa case du haut (`a`) tout à droite. Plus généralement, la ligne `i` de la nouvelle grille est la colonne `i` de l'ancienne, lue de bas en haut.

Le programme fait donc deux boucles imbriquées :
- la boucle extérieure choisit la nouvelle ligne `i`, de 0 à `W - 1` (une par colonne de l'ancienne grille) ;
- la boucle intérieure parcourt les lignes `l` de l'ancienne grille, de `H - 1` jusqu'à 0, et ajoute `grille[l][i]` à la nouvelle ligne.

On affiche chaque nouvelle ligne dès qu'elle est terminée. Avec une formule : le caractère à la ligne `i` et à la colonne `j` de la nouvelle grille est `grille[H - 1 - j][i]`.

Les pièges :
- inverser les dimensions : la nouvelle grille a `W` lignes de `H` caractères, et non l'inverse ; une grille qui n'est pas carrée le montre tout de suite ;
- tourner dans le mauvais sens : lire les colonnes de haut en bas donne une grille retournée comme dans un miroir, et non tournée. Vérifie toujours sur un petit exemple.
