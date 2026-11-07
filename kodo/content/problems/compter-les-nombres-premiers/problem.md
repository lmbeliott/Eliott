---
id: compter-les-nombres-premiers
title: Compter les nombres premiers
chapter: p1-boucles-imbriquees
order: 6
tags: [boucles, mathématiques]
samples: 2
---

## Énoncé
Un entier est **premier** s'il est supérieur ou égal à 2 et s'il n'a pas d'autre diviseur que 1 et lui-même : `2`, `3`, `5`, `7`, `11` sont premiers, mais pas `1`, `9` ni `15`.

Afficher combien d'entiers compris entre 2 et `N` sont premiers, puis le plus grand d'entre eux.

## Entrée
Une seule ligne contenant l'entier `N`.

## Sortie
Une seule ligne avec deux entiers séparés par une espace : le nombre de nombres premiers entre 2 et `N` (inclus), puis le plus grand nombre premier inférieur ou égal à `N`.

## Contraintes
- 2 ≤ N ≤ 30 000

## Indices
1. Une boucle externe sur les candidats `n` de 2 à `N`, et une boucle interne qui cherche un diviseur `d` de `n`, à partir de 2.
2. Si `n` a un diviseur `d` avec `2 ≤ d < n`, il en a un qui vérifie `d × d ≤ n` : il suffit de tester les `d` tant que `d × d ≤ n`. Sans cette remarque, le programme est trop lent en Python.
3. Une variable booléenne `premier`, mise à `True` au début de chaque tour externe, passe à `False` dès qu'on trouve un diviseur. La boucle interne peut s'arrêter à ce moment-là : `while d * d <= n and premier`.

## Solution
Pour chaque candidat `n`, on cherche un diviseur `d` à partir de 2. On n'a pas besoin d'aller jusqu'à `n - 1` : si `n = d × e` avec `2 ≤ d ≤ e`, alors `d × d ≤ d × e = n`. Donc, si aucun `d` tel que `d × d ≤ n` ne divise `n`, alors `n` est premier.

La boucle interne s'écrit avec `while d * d <= n and premier`, où `premier` est un booléen remis à `True` au début de chaque tour de la boucle externe. Dès qu'un diviseur est trouvé, `premier` devient `False` et la boucle interne s'arrête. Après la boucle interne, si `premier` est encore vrai, on augmente le compteur et on retient `n` comme plus grand nombre premier trouvé : comme les candidats sont parcourus dans l'ordre croissant, le dernier retenu est le plus grand.

Avec la limite `d × d ≤ n`, la boucle interne fait au plus 172 tours pour `n ≤ 30 000`, et beaucoup moins pour les nombres qui ne sont pas premiers. Sans cette limite, il faudrait près de 450 millions de tours au total pour `N = 30 000` : beaucoup trop pour Python.

Le piège : initialiser `premier` une seule fois avant la boucle externe. Dès le premier nombre non premier (`4`), il resterait à `False` pour toujours.
