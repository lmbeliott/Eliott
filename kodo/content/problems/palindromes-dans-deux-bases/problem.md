---
id: palindromes-dans-deux-bases
title: Palindromes dans deux bases
chapter: p3-chaines-avancees
order: 8
synthesis: true
tags: [chaînes, fonctions, mathématiques]
samples: 2
---

## Énoncé
Un nombre est un palindrome **en base `B`** quand son écriture en base `B`, sans zéro de tête, se lit de la même façon dans les deux sens. Par exemple, 585 est un palindrome en base 10, et aussi en base 2, où il s'écrit `1001001001`. L'écriture en base `B` utilise les chiffres de 0 à `B − 1`, et s'obtient comme en base 10 : le dernier chiffre de `x` est `x % B`, et les autres sont ceux de `x // B`.

Deux entiers `N` et `B` sont donnés. Compter les entiers `x` tels que `1 ≤ x ≤ N` qui sont des palindromes à la fois en base 10 et en base `B`.

## Entrée
Une ligne : les entiers `N` et `B`.

## Sortie
Le nombre d'entiers qui conviennent.

## Contraintes
- 1 ≤ N ≤ 10⁹
- 2 ≤ B ≤ 9

## Indices
1. Tester les `N` nombres un par un ferait jusqu'à un milliard de tests : beaucoup trop. Combien y a-t-il de palindromes en base 10 jusqu'à 10⁹ ?
2. Un palindrome décimal est entièrement déterminé par sa première moitié : `123` donne `123321` (longueur paire) et `12321` (longueur impaire).
3. Pour chaque longueur, on parcourt les premières moitiés dans l'ordre croissant : les palindromes obtenus sont croissants, et on peut s'arrêter dès qu'on dépasse `N`. Il reste à écrire une fonction qui teste si un nombre est un palindrome en base `B`.

## Solution
Les palindromes décimaux sont rares : un palindrome de `L` chiffres est déterminé par ses `h = (L + 1) // 2` premiers chiffres, la première moitié, qui ne commence pas par 0. Il y en a donc 9 × 10^(h − 1) de chaque longueur, soit 109 998 en tout jusqu'à 10⁹, contre un milliard de nombres. On les fabrique au lieu de les chercher.

**Fabriquer.** Pour chaque longueur `L` de 1 au nombre de chiffres de `N`, et pour chaque première moitié `m` de 10^(h − 1) à 10^h − 1, on forme la chaîne `s = str(m)`, puis le palindrome `s + s[::-1]` si `L` est paire, ou `s + s[:-1][::-1]` si `L` est impaire (le chiffre du milieu n'est pas répété). Chaque palindrome de `L` chiffres est obtenu exactement une fois, à partir de sa première moitié. Pour une longueur fixée, deux palindromes se comparent comme leurs premières moitiés : en parcourant les moitiés dans l'ordre croissant, les palindromes sont croissants, et dès que l'un dépasse `N`, tous les suivants de même longueur le dépassent aussi. On place donc ce parcours dans une fonction `compter_longueur`, qui s'arrête avec `return` dès que le palindrome dépasse `N`.

**Tester en base `B`.** La fonction `palindrome_en_base(x, b)` calcule les chiffres de `x` en base `b` avec la méthode des restes : `x % b` est le dernier chiffre, puis on remplace `x` par `x // b`, jusqu'à 0. On obtient les chiffres de droite à gauche, ce qui ne gêne pas pour tester un palindrome. On compare ensuite le premier et le dernier, le deuxième et l'avant-dernier, avec deux indices qui se rapprochent, et on renvoie `False` au premier désaccord.

**Coût.** Au plus 109 998 palindromes, et pour chacun au plus une trentaine de chiffres en base `B` : quelques millions d'opérations au pire. La plupart des tests s'arrêtent d'ailleurs dès la première comparaison. Le piège : construire la chaîne retournée avec `s = c + s` dans une boucle est correct ici, car les chaînes sont courtes, mais la tranche `[::-1]` est plus simple.
