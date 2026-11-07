---
id: premier-palindrome-suivant
title: Premier palindrome suivant
chapter: p2-fonctions
order: 4
tags: [fonctions, mathématiques]
samples: 2
---

## Énoncé
Un nombre est un **palindrome** s'il se lit de la même façon de gauche à droite et de droite à gauche, comme 383 ou 7. Trouver le plus petit nombre supérieur ou égal à `N` qui est à la fois premier et palindrome.

## Entrée
Une seule ligne contenant l'entier `N`.

## Sortie
Le plus petit entier `P ≥ N` qui est premier et palindrome.

## Contraintes
- 1 ≤ N ≤ 1 000 000

## Indices
1. Trois fonctions : `renverser(n)` qui renvoie le nombre écrit à l'envers, `est_palindrome(n)` qui l'utilise, et `est_premier(n)`.
2. Partir de `N` et avancer de 1 tant que le nombre n'est pas à la fois palindrome et premier.
3. Le test de palindrome est beaucoup plus rapide que le test de primalité : le faire en premier.

## Solution
On découpe le problème en trois fonctions, comme dans le cours : `renverser(n)` construit le nombre à l'envers chiffre par chiffre (`r = r × 10 + n % 10`), `est_palindrome(n)` renvoie `renverser(n) == n`, et `est_premier(n)` essaie les diviseurs jusqu'à la racine carrée. Le programme principal part de `N` et avance tant que la condition `est_palindrome(n) and est_premier(n)` est fausse.

L'ordre des deux tests compte : avec `and`, le second n'est évalué que si le premier est vrai. Les palindromes sont rares, donc on ne teste la primalité que de très peu de nombres.

Combien de nombres faut-il essayer ? Beaucoup parfois : il n'existe aucun palindrome premier de 4 chiffres, ni de 6 chiffres. En effet, un palindrome d'un nombre pair de chiffres est toujours divisible par 11 (par exemple 3443 = 11 × 313). Pour `N = 1000`, la réponse est donc 10 301, et pour `N = 100 000`, c'est 1 003 001. Même dans ce dernier cas, on teste moins d'un million de nombres, avec un test de palindrome très court pour chacun.

Le piège : 11 est le seul palindrome premier de deux chiffres. Pour `N = 12`, la réponse est 101.
