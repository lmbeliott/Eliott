---
id: nombres-aux-chiffres-imposes
title: Nombres aux chiffres imposés
chapter: n2-fonctions
order: 7
tags: [fonctions, mathématiques]
samples: 2
---

## Énoncé
On choisit quelques chiffres **autorisés**. Un entier positif est **écrit avec les chiffres autorisés** si chacun des chiffres de son écriture habituelle (sans `0` au début) est autorisé. Par exemple, avec les chiffres `0` et `5`, les nombres `5`, `50`, `505` et `550` conviennent, mais pas `15` ni `501`.

Écris un programme qui répond à `Q` questions : pour chacune, il affiche combien d'entiers compris entre `A` et `B` (inclus) sont écrits avec les chiffres autorisés.

## Entrée
- La première ligne contient l'entier `Q`, le nombre de questions.
- Les `Q` lignes suivantes contiennent chacune une question : les chiffres autorisés, collés et rangés dans l'ordre croissant, puis les entiers `A` et `B`, séparés par des espaces.

## Sortie
`Q` lignes : pour chaque question, dans l'ordre, le nombre d'entiers `n` tels que `A ≤ n ≤ B` qui sont écrits avec les chiffres autorisés.

## Contraintes
- 1 ≤ Q ≤ 20
- 1 ≤ A ≤ B ≤ 10¹⁸
- Entre 1 et 10 chiffres autorisés, tous différents.

## Indices
1. Tester tous les nombres de `A` à `B` est hors de question : il peut y en avoir 10¹⁸. Écris plutôt une fonction `compter(x)` qui donne le nombre d'entiers de `1` à `x` écrits avec les chiffres autorisés. La réponse est alors `compter(B) - compter(A - 1)`.
2. Avec `m` chiffres autorisés, dont `z` non nuls, combien y a-t-il de nombres de `L` chiffres qui conviennent ? Le premier chiffre ne peut pas être `0` : cela fait `z × m × m × … × m`, avec `L - 1` facteurs `m`. Cela compte tous les nombres qui ont moins de chiffres que `x`.
3. Pour ceux qui ont autant de chiffres que `x` : un tel nombre plus petit que `x` commence comme `x`, puis, à une certaine position `i`, il a un chiffre autorisé plus petit que celui de `x` ; après cette position, tous les chiffres autorisés sont possibles. Parcours les chiffres de `x` de gauche à droite, et arrête-toi dès que le chiffre de `x` n'est pas autorisé.

## Solution
**Découper avec une fonction.** Compter directement entre `A` et `B` est pénible. On écrit plutôt `compter(x)`, le nombre d'entiers de `1` à `x` qui conviennent, et la réponse est `compter(B) - compter(A - 1)` : ceux qui sont au plus `B`, moins ceux qui sont avant `A`. On utilise la même fonction deux fois, et `compter(0)` vaut 0.

**Les nombres plus courts que `x`.** Notons `m` le nombre de chiffres autorisés et `z` le nombre d'entre eux qui ne sont pas `0`. Un nombre de `L` chiffres qui convient a un premier chiffre non nul (`z` choix) puis `L - 1` chiffres quelconques (`m` choix chacun) : il y en a `z × m^(L-1)`. On additionne cela pour toutes les longueurs `L` plus petites que celle de `x`. Une petite fonction `puissance(m, e)` calcule `m^e` avec une boucle.

**Les nombres de la même longueur que `x`.** Un tel nombre `n < x` coïncide avec `x` sur ses premiers chiffres, puis il a, à une position `i`, un chiffre plus petit que celui de `x`. Pour chaque position `i`, on compte les chiffres autorisés plus petits que le chiffre de `x` (sans `0` si `i` est la première position), et on multiplie par `m^(nombre de positions restantes)`. Mais on ne peut suivre `x` jusqu'à la position `i` que si tous ses chiffres précédents sont autorisés : dès qu'un chiffre de `x` ne l'est pas, on s'arrête. Si on arrive au bout, `x` lui-même convient : on ajoute 1.

Exemple avec les chiffres `2` et `7`, et `x = 100` : il y a 2 nombres d'un chiffre et 2 × 2 = 4 nombres de deux chiffres. Pour trois chiffres, le premier chiffre de `x` est `1` : aucun chiffre autorisé non nul n'est plus petit, et `1` n'est pas autorisé, donc on s'arrête. `compter(100) = 6` : ce sont `2`, `7`, `22`, `27`, `72` et `77`.

Chaque appel ne fait qu'une vingtaine de tours de boucle (un par chiffre de `x`), au lieu de jusqu'à 10¹⁸ pour la solution naïve.

Les pièges :
- le `0` ne peut pas être le premier chiffre : `05` n'est pas une écriture de `5` ;
- si seul le `0` est autorisé, aucun entier positif ne convient : la réponse est 0 ;
- en C++, les nombres vont jusqu'à 10¹⁸ : il faut des `long long`. `10¹⁸` lui-même a 19 chiffres, et `m^18` peut valoir 10¹⁸, ce qui tient encore dans un `long long`.
