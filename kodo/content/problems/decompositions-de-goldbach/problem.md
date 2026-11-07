---
id: decompositions-de-goldbach
title: Décompositions de Goldbach
chapter: p2-fonctions
order: 3
tags: [fonctions, mathématiques]
samples: 2
---

## Énoncé
On conjecture depuis 1742 que tout entier pair supérieur ou égal à 4 est la somme de deux nombres premiers. Par exemple, 10 = 3 + 7 = 5 + 5 : il y a deux décompositions.

Pour plusieurs entiers pairs `N`, compter les couples de nombres premiers `p ≤ q` tels que `p + q = N`.

## Entrée
- La première ligne contient l'entier `Q`.
- Chacune des `Q` lignes suivantes contient un entier pair `N`.

## Sortie
`Q` lignes : pour chaque `N`, dans l'ordre, le nombre de couples.

## Contraintes
- 1 ≤ Q ≤ 10
- 4 ≤ N ≤ 10 000, `N` pair

## Indices
1. Écrire une fonction `est_premier(n)` comme dans le cours, qui s'arrête dès qu'un diviseur est trouvé.
2. Pour chaque `p` de 2 à `N / 2`, le second nombre est forcément `q = N - p`. Il suffit de tester si `p` et `q` sont tous les deux premiers.
3. Écrire une fonction `goldbach(n)` qui renvoie le nombre de couples ; le programme principal l'appelle sur chaque `N`.

## Solution
Avec `p ≤ q` et `p + q = N`, on a `p ≤ N / 2`, et `q = N - p` est entièrement déterminé par `p`. La fonction `goldbach(n)` parcourt donc `p` de 2 à `n / 2` et compte les `p` tels que `est_premier(p)` et `est_premier(n - p)` sont vrais.

La fonction `est_premier` essaie les diviseurs `d` tant que `d × d ≤ n` et renvoie `False` au premier diviseur trouvé. Grâce au `and`, le second test n'est fait que si `p` est premier. Pour `N = 10 000`, cela fait au plus 5 000 tests rapides : le programme reste très rapide.

Le piège : compter aussi les couples `(q, p)` en faisant aller `p` jusqu'à `N`. Pour 10, on trouverait 3 + 7, 5 + 5 et 7 + 3, soit 3 au lieu de 2. La borne `p ≤ N / 2` compte chaque couple une seule fois, y compris le cas `p = q` (comme 5 + 5).

Personne n'a encore démontré la conjecture de Goldbach, mais elle a été vérifiée par ordinateur jusqu'à 4 × 10¹⁸.
