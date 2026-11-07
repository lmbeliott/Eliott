---
id: nombres-premiers-jumeaux
title: Nombres premiers jumeaux
chapter: n2-fonctions
order: 4
tags: [fonctions, mathématiques]
samples: 2
---

## Énoncé
Un nombre est **premier** s'il est plus grand que 1 et s'il n'est divisible que par 1 et par lui-même : `2`, `3`, `5`, `7`, `11` et `13` sont premiers, mais pas `1`, `9` ni `15`.

Deux nombres premiers sont **jumeaux** quand leur écart vaut exactement 2 : par exemple `11` et `13`, ou `17` et `19`.

Écris un programme qui compte les paires de nombres premiers jumeaux dont les deux nombres sont compris entre `A` et `B` (inclus).

## Entrée
Une seule ligne contenant deux entiers `A` et `B`.

## Sortie
Un seul entier : le nombre de paires `(p, p + 2)` telles que `p` et `p + 2` sont premiers, avec `A ≤ p` et `p + 2 ≤ B`.

## Contraintes
- 1 ≤ A ≤ B ≤ 20 000

## Indices
1. Écris d'abord une fonction `est_premier(n)` qui renvoie vrai ou faux. Teste-la seule sur quelques nombres : `1`, `2`, `9`, `13`.
2. Pour savoir si `n` est premier, cherche un diviseur `d` à partir de 2. Inutile d'aller jusqu'à `n - 1` : si `n` a un diviseur, il en a un tel que `d × d ≤ n`.
3. Le programme principal parcourt les `p` de `A` à `B - 2` et compte ceux pour lesquels `est_premier(p)` et `est_premier(p + 2)` sont vrais tous les deux.

## Solution
Le problème se découpe en deux morceaux :
- une fonction `est_premier(n)`, qui répond à la question « `n` est-il premier ? » ;
- un programme principal qui l'appelle deux fois pour chaque `p` de `A` à `B - 2` : la paire `(p, p + 2)` est comptée quand les deux réponses sont vraies.

Dans `est_premier`, on traite d'abord le cas `n < 2` : `0` et `1` ne sont pas premiers. Ensuite, on essaie les diviseurs `d = 2, 3, 4…` tant que `d × d ≤ n`. Si l'un d'eux divise `n` (le reste `n % d` vaut 0), on renvoie faux tout de suite. Si aucun ne convient, on renvoie vrai.

Pourquoi s'arrêter quand `d × d` dépasse `n` ? Si `n = d × e` avec `d ≤ e`, alors `d × d ≤ d × e = n`. Un diviseur, s'il en existe un, est donc trouvé avant cette limite. Pour `n = 19 997`, on fait ainsi au plus 141 essais au lieu de presque 20 000.

Les pièges :
- `1` n'est pas premier : sans le cas `n < 2`, la boucle ne fait aucun tour et la fonction répond vrai ;
- les bornes : il faut que `p + 2 ≤ B`, donc `p` va seulement jusqu'à `B - 2`. Entre 6 et 30, la paire `(29, 31)` ne compte pas ;
- un même nombre peut faire partie de deux paires : `(3, 5)` et `(5, 7)` comptent toutes les deux.
