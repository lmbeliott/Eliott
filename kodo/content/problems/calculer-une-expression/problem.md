---
id: calculer-une-expression
title: Calculer une expression
chapter: n2-chaines
order: 6
tags: [chaînes, simulation]
samples: 3
---

## Énoncé
On te donne un calcul écrit sur une seule ligne, sans espace et sans parenthèses, avec des nombres entiers positifs ou nuls et les trois opérations `+`, `-` et `*` (la multiplication). Par exemple : `7*0+100*2*3-50`.

Écris un programme qui affiche le résultat de ce calcul, avec les règles habituelles des mathématiques : les multiplications sont faites avant les additions et les soustractions, et les additions et soustractions sont faites de gauche à droite.

Par exemple, `2+3*4` vaut 14 (et pas 20), et `8-2-3` vaut 3.

## Entrée
Une seule ligne : le calcul. Il commence et se termine par un nombre, et deux nombres sont toujours séparés par exactement une opération.

## Sortie
Un seul entier : le résultat du calcul.

## Contraintes
- La ligne contient au plus 1 000 caractères.
- Chaque nombre est compris entre 0 et 1 000, et il est écrit sans zéro inutile devant.
- Pendant le calcul fait dans l'ordre habituel, chaque produit et chaque résultat intermédiaire reste compris entre -1 000 000 000 et 1 000 000 000.

## Indices
1. Les `+` et les `-` découpent le calcul en **termes**, et chaque terme est un produit : `7*0+100*2*3-50` est formé des termes `7*0`, `100*2*3` et `50`. Le résultat est le premier terme, plus ou moins chacun des suivants.
2. Pour lire un nombre écrit avec plusieurs chiffres, lis-le chiffre par chiffre : en partant de 0, à chaque chiffre, multiplie par 10 et ajoute la valeur du chiffre. Pour la chaîne `305` : 0, puis 3, puis 30, puis 305.
3. Garde trois variables : le total des termes déjà terminés, le signe du terme en cours (`1` ou `-1`) et la valeur du terme en cours. Quand un nombre suit un `*`, il multiplie le terme en cours. Quand il suit un `+` ou un `-`, le terme précédent est terminé : ajoute-le au total, puis commence un nouveau terme. N'oublie pas le dernier terme à la fin.

## Solution
On parcourt la chaîne une seule fois, de gauche à droite, en lisant alternativement un nombre et une opération.

Pour lire un nombre, on avance tant que le caractère est un chiffre, et on construit sa valeur : `nombre = nombre × 10 + chiffre`, où le chiffre s'obtient à partir du code du caractère (`ord(c) - ord("0")` en Python, `c - '0'` en C++).

Pour respecter la priorité de la multiplication, on découpe le calcul en termes séparés par des `+` et des `-`. On garde :
- `total` : la somme des termes déjà terminés ;
- `signe` : `1` si le terme en cours est précédé d'un `+` (ou s'il est le premier), `-1` s'il est précédé d'un `-` ;
- `terme` : la valeur du produit en cours.

Quand on lit un nombre, on regarde l'opération qui le précède :
- un `*` : le produit continue, on fait `terme = terme × nombre` ;
- un `+` ou un `-` : le terme précédent est terminé. On fait `total = total + signe × terme`, puis on règle `signe` selon l'opération, et le nouveau terme commence avec `terme = nombre`.

À la fin de la chaîne, le dernier terme n'est suivi d'aucune opération : on l'ajoute au total avant d'afficher.

Exemple avec `10-2*3-4` : le terme 10 commence ; le `-` le termine (total 10), et le terme suivant vaut 2, avec le signe `-1` ; le `*3` le transforme en 6 ; le `-` le termine (total 10 - 6 = 4), et le terme 4 commence avec le signe `-1` ; à la fin, total 4 - 4 = 0.

Les pièges :
- calculer de gauche à droite sans priorité : `2+3*4` donnerait 20 ;
- oublier d'ajouter le dernier terme ;
- lire un seul caractère par nombre : `100` est un seul nombre, pas trois.
