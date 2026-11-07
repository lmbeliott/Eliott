---
id: valeurs-en-double
title: Valeurs en double
chapter: n2-trier-compter
order: 5
tags: [tri, dictionnaires]
samples: 2
---

## Énoncé
On te donne une liste de `N` entiers. Certaines valeurs y apparaissent plusieurs fois.

Écris un programme qui trouve toutes les valeurs qui apparaissent **au moins deux fois** dans la liste, et qui affiche, pour chacune, combien de fois elle apparaît.

## Entrée
- La première ligne contient l'entier `N`.
- La deuxième ligne contient `N` entiers séparés par des espaces.

## Sortie
- Sur la première ligne, le nombre `K` de valeurs différentes qui apparaissent au moins deux fois.
- Puis `K` lignes, une par valeur, de la plus petite valeur à la plus grande : la valeur, une espace, puis son nombre d'apparitions.

Si aucune valeur n'apparaît deux fois, le programme affiche seulement `0`.

## Contraintes
- 1 ≤ N ≤ 10 000
- Chaque entier est compris entre -1 000 000 et 1 000 000.

## Indices
1. Compte les apparitions de chaque valeur avec un dictionnaire : la clé est la valeur, et ce qui lui est associé est le nombre de fois où on l'a vue.
2. Une fois tout compté, garde seulement les clés dont le compte est au moins 2.
3. Il faut afficher le nombre de valeurs **avant** les valeurs elles-mêmes : range d'abord les valeurs retenues dans une liste, triée, puis affiche sa longueur, puis son contenu.

## Solution
On parcourt la liste une fois et on compte les apparitions de chaque valeur dans un dictionnaire (`dict` en Python, `map` en C++). Les valeurs vont de -1 000 000 à 1 000 000 : un tableau de 2 000 001 compteurs, avec un décalage d'un million, marcherait aussi, mais le dictionnaire est plus simple et ne garde que les valeurs présentes.

Ensuite, on construit la liste des valeurs dont le compte est au moins 2, et on la trie. On affiche sa longueur, puis chaque valeur suivie de son compte.

Les pièges :
- afficher une valeur autant de fois qu'elle apparaît : chaque valeur en double ne doit être affichée qu'une seule fois, avec son compte ;
- oublier de trier : en Python, un dictionnaire se parcourt dans l'ordre où les clés ont été ajoutées, pas dans l'ordre croissant. En C++, une `map` garde ses clés triées, ce qui fait le travail ;
- les nombres négatifs : ils viennent avant les positifs dans l'ordre croissant, et `-1` vient après `-5`.

Une autre méthode utilise seulement le tri : une fois la liste triée, les valeurs égales sont côte à côte, et on peut compter la longueur de chaque groupe en un seul parcours.
