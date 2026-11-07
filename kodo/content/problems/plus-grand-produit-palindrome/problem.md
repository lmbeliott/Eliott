---
id: plus-grand-produit-palindrome
title: Plus grand produit palindrome
chapter: p1-synthese
order: 9
tags: [boucles, arithmétique]
samples: 3
---

## Énoncé
Un entier est un **palindrome** s'il se lit de la même façon de gauche à droite et de droite à gauche, comme `7`, `55` ou `9009`.

On considère tous les produits `x × y` avec `A ≤ x ≤ y ≤ B`. Afficher le plus grand de ces produits qui est un palindrome, puis le nombre de couples `(x, y)` avec `A ≤ x ≤ y ≤ B` qui donnent ce produit. Si aucun produit n'est un palindrome, afficher `AUCUN`.

Par exemple, pour `A = 10` et `B = 99`, le plus grand produit palindrome est `9009 = 91 × 99`, et c'est le seul couple qui le donne.

## Entrée
Une seule ligne contenant deux entiers `A` et `B` séparés par une espace.

## Sortie
Une seule ligne : le plus grand produit palindrome et le nombre de couples qui le donnent, séparés par une espace ; ou le mot `AUCUN`.

## Contraintes
- 1 ≤ A ≤ B ≤ 10 000
- B - A ≤ 300

## Indices
1. Deux boucles imbriquées parcourent les couples : `x` de `A` à `B`, et `y` de `x` à `B`. Au plus 301 × 302 / 2, soit environ 45 000 couples.
2. Pour savoir si un produit `p` est un palindrome, construire son retourné chiffre par chiffre (`r = r × 10 + m % 10`, puis `m = m // 10`) et le comparer à `p`. C'est une troisième boucle, à l'intérieur des deux autres.
3. Garder le meilleur palindrome et son nombre de couples : si un palindrome est plus grand que le meilleur, il le remplace et le compteur repart à 1 ; s'il lui est égal, le compteur augmente de 1. Au départ, le meilleur vaut 0 : s'il vaut encore 0 à la fin, aucun produit n'est un palindrome.

## Solution
On fait une recherche exhaustive sur les couples `(x, y)` avec `A ≤ x ≤ y ≤ B` : la boucle externe fait varier `x`, la boucle interne fait varier `y` à partir de `x`, pour ne compter chaque couple qu'une fois.

Pour chaque produit `p = x × y`, on teste s'il est un palindrome. On recopie `p` dans `m`, et on construit le retourné `r` avec une boucle `while m > 0` : `r = r × 10 + m % 10` puis `m = m // 10`. Le produit est un palindrome quand `r == p`. Il y a donc trois boucles imbriquées, mais la dernière fait au plus 9 tours (les produits ont au plus 9 chiffres) : environ 400 000 tours en tout.

On garde deux variables : `meilleur`, le plus grand palindrome trouvé (0 au départ, ce qui n'est jamais un produit puisque `A ≥ 1`), et `nombre`, le nombre de couples qui le donnent.
- Si `p` est un palindrome plus grand que `meilleur`, il devient le nouveau meilleur, et `nombre` repart à 1.
- Si `p` est un palindrome égal à `meilleur`, `nombre` augmente de 1.

À la fin, si `meilleur` vaut toujours 0, on affiche `AUCUN` ; sinon, `meilleur` et `nombre`.

Les pièges : remettre `nombre` à 0 au lieu de 1 quand un nouveau meilleur est trouvé (le couple courant compte déjà), oublier de remettre `r` à 0 avant chaque test, et faire partir `y` de `A` au lieu de `x`, ce qui compterait deux fois les couples comme `(3, 4)` et `(4, 3)`. Une petite accélération possible : inutile de tester si `p` est un palindrome quand `p` est plus petit que `meilleur`.
