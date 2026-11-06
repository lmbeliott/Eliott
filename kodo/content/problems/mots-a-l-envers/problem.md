---
id: mots-a-l-envers
title: Mots à l'envers
chapter: n2-chaines
order: 2
tags: [chaînes, boucles]
samples: 2
---

## Énoncé
On te donne une liste de mots. Écris un programme qui affiche chaque mot écrit à l'envers : par exemple, `python` devient `nohtyp`.

Certains mots ne changent pas quand on les écrit à l'envers, comme `kayak`. À la fin, ton programme doit aussi afficher combien de mots de la liste sont dans ce cas.

## Entrée
- La première ligne contient un entier `N` : le nombre de mots.
- Les `N` lignes suivantes contiennent chacune un mot, en lettres minuscules sans accents.

## Sortie
- `N` lignes : pour chaque mot, dans l'ordre de l'entrée, le mot écrit à l'envers.
- Puis une dernière ligne avec un entier : le nombre de mots identiques à leur envers.

## Contraintes
- 1 ≤ N ≤ 100
- Chaque mot contient entre 1 et 50 lettres.

## Indices
1. Pour écrire un mot à l'envers, parcours ses lettres de la dernière à la première, et ajoute-les une à une à une nouvelle chaîne vide.
2. La dernière lettre de `mot` est à l'indice `len(mot) - 1` (en C++ : `mot.size() - 1`), la première à l'indice `0`.
3. Une fois l'envers calculé, il suffit de le comparer au mot de départ avec `==` pour savoir si le mot reste identique.

## Solution
Pour chaque mot, on construit son envers : on part d'une chaîne vide et on y ajoute les lettres du mot en partant de la fin (indices `len(mot) - 1`, `len(mot) - 2`, …, `0`). On affiche cet envers, puis on le compare au mot : s'ils sont égaux, on augmente un compteur, qu'on affiche tout à la fin.

Un mot égal à son envers s'appelle un **palindrome**. Un mot d'une seule lettre en est toujours un.

Les pièges :
- la boucle qui part de la fin doit bien aller jusqu'à l'indice `0` inclus : en Python, c'est `range(len(mot) - 1, -1, -1)` ;
- le compteur ne s'affiche qu'**une fois**, après la boucle sur les mots.

En Python, on peut aussi obtenir l'envers d'un coup avec `mot[::-1]`, et en C++ avec `string envers(mot.rbegin(), mot.rend());`. C'est pratique, mais sache d'abord l'écrire avec une boucle !
