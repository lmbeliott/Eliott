---
id: somme-geometrique-modulo-m
title: Somme géométrique modulo M
chapter: n3-arithmetique
order: 4
tags: [arithmétique, récursivité]
samples: 2
---

## Énoncé
Écris un programme qui répond à T questions. Chaque question donne trois entiers A, N et M, et demande le reste de la division par M de la somme

1 + A + A² + A³ + … + A^N

Cette somme contient N + 1 termes ; le premier vaut toujours 1, même quand A = 0.

## Entrée
- La première ligne contient un entier T.
- Les T lignes suivantes contiennent chacune trois entiers A, N et M.

## Sortie
T lignes : pour chaque question, dans l'ordre, la valeur de (1 + A + … + A^N) mod M.

## Contraintes
- 1 ≤ T ≤ 1 000
- 0 ≤ A ≤ 10¹⁸
- 0 ≤ N ≤ 10¹⁸
- 1 ≤ M ≤ 10⁹

## Indices
1. Additionner les N + 1 termes un par un est impossible pour N = 10¹⁸. La formule (A^(N+1) − 1) / (A − 1) ne marche pas non plus : on ne sait pas diviser modulo M quand M n'est pas premier (regarde le deuxième exemple), ni quand A − 1 est un multiple de M.
2. Note S(n) la somme des n premiers termes, 1 + A + … + A^(n−1). Les 2k premiers termes sont les k premiers, suivis des k premiers multipliés par A^k : S(2k) = S(k) × (1 + A^k).
3. Écris une fonction récursive qui calcule en même temps A^n mod M et S(n) mod M, comme la puissance rapide : si n est pair, à partir de n / 2 ; si n est impair, à partir de n − 1, avec S(n) = S(n − 1) + A^(n−1). La réponse est S(N + 1).

## Solution
**Pourquoi ne pas utiliser la formule.** On sait que 1 + A + … + A^N = (A^(N+1) − 1) / (A − 1) quand A ≠ 1. Mais modulo M, diviser n'est possible que si A − 1 a un inverse modulo M, ce qui n'arrive pas en général : dans le deuxième exemple, (4⁶ − 1) / 3 avec M = 6, et 3 n'a pas d'inverse modulo 6. Il faut une méthode qui n'utilise que des additions et des multiplications.

**L'idée : diviser pour régner, comme la puissance rapide.** Notons `S(n) = 1 + A + … + A^(n−1)` la somme des n premiers termes, avec S(0) = 0. On calcule ensemble le couple `(A^n mod M, S(n) mod M)` :
- si n = 0 : `(1, 0)` ;
- si n est pair, n = 2k : les 2k termes sont les k premiers, puis les k suivants, qui sont les k premiers multipliés par A^k. Donc `A^n = (A^k)²` et `S(n) = S(k) × (1 + A^k)` ;
- si n est impair : `A^n = A^(n−1) × A` et `S(n) = S(n − 1) + A^(n−1)`.

On réduit modulo M après chaque opération. La réponse à la question est `S(N + 1)`, puisque la somme a N + 1 termes.

Sur le premier exemple, pour A = 2, N = 3 et M = 100 : S(4) = S(2) × (1 + 2²) = 3 × 5 = 15 = 1 + 2 + 4 + 8.

**Complexité.** Comme pour la puissance rapide, n est au moins divisé par deux tous les deux appels : O(log N) par question, soit environ 120 appels pour N = 10¹⁸, et 120 000 pour les 1 000 questions.

**Pourquoi la solution naïve est trop lente.** Additionner les termes un par un coûte N + 1 opérations par question : jusqu'à 10¹⁸. La formule avec une division donne des résultats faux dès que A − 1 et M ont un diviseur commun.

**Pièges.**
- Réduis A modulo M dès le départ : A peut valoir 10¹⁸, et `A × A` déborderait.
- En C++, les valeurs restent inférieures à M ≤ 10⁹, donc un produit de deux d'entre elles est inférieur à 10¹⁸ : il tient dans un `long long`.
- Quand M = 1, tout vaut 0 : écris `1 % M` plutôt que `1` pour le cas de base.
- Quand A est un multiple de M plus 1, chaque terme vaut 1 modulo M : la réponse est (N + 1) mod M. La méthode récursive le trouve sans cas particulier.
