---
id: plus-petite-solution-d-une-congruence
title: Plus petite solution d'une congruence
chapter: p4-arithmetique
order: 4
tags: [arithmétique, mathématiques]
samples: 1
---

## Énoncé
On cherche les entiers x tels que A × x et B ont le même reste dans la division par M ; on écrit A × x ≡ B (mod M). Par exemple, 4 × x ≡ 2 (mod 6) a pour solutions 2 et 5 entre 0 et 5, car 4 × 2 = 8 et 4 × 5 = 20 ont pour reste 2.

Répondre à T questions : pour A, B et M donnés, afficher la plus petite solution x entre 0 et M − 1 et le nombre de solutions entre 0 et M − 1, ou `-1` s'il n'y a aucune solution.

## Entrée
La première ligne contient T. Chacune des T lignes suivantes contient trois entiers A, B et M.

## Sortie
T lignes : pour chaque question, la plus petite solution et le nombre de solutions dans [0, M − 1], séparés par une espace, ou `-1`.

## Contraintes
- 1 ≤ T ≤ 1 000
- 1 ≤ M ≤ 10⁹
- 0 ≤ A, B < M

## Indices
1. Soit g = PGCD(A, M). Si A × x ≡ B (mod M), alors B = A × x − k × M est un multiple de g. S'il ne l'est pas, il n'y a pas de solution.
2. Sinon, on divise tout par g : (A/g) × x ≡ B/g (mod M/g), et A/g est premier avec M/g, donc il a un inverse modulo M/g, donné par l'algorithme d'Euclide étendu.
3. Les solutions sont x₀, x₀ + M/g, x₀ + 2M/g, … : il y en a g entre 0 et M − 1.

## Solution
**Condition d'existence.** Soit g = PGCD(A, M). Si A × x ≡ B (mod M), il existe k tel que B = A × x − k × M, et g divise A et M, donc divise B. Si B n'est pas un multiple de g, on affiche `-1`.

**Se ramener à un inverse.** Sinon, posons a = A/g, b = B/g et m = M/g. Alors A × x ≡ B (mod M) équivaut à a × x ≡ b (mod m) : M divise A × x − B si et seulement si m divise a × x − b, en divisant par g. Comme PGCD(a, m) = 1, l'algorithme d'Euclide étendu donne u et v tels que a × u + m × v = 1 : u est un **inverse** de a modulo m. Les solutions sont exactement les x ≡ u × b (mod m) : si a × x ≡ b, on multiplie par u ; et réciproquement, a × (u × b) ≡ b.

**La réponse.** La plus petite solution est x₀ = (u × b) mod m, entre 0 et m − 1. Les solutions entre 0 et M − 1 sont x₀, x₀ + m, …, x₀ + (g − 1) × m : il y en a g. Cas particuliers : pour A = 0, g = M, et il y a M solutions si B = 0 (et aucune sinon) ; pour M = 1, tout x convient et la réponse est `0 1`.

**Les pièges.** Euclide étendu peut renvoyer un u négatif : en C++, `%` garde le signe, et on ajoute m pour revenir entre 0 et m − 1. Le produit u × b atteint 10¹⁸ : il tient dans un `long long`, à condition de réduire u modulo m d'abord. **Coût** : O(log M) par question. Essayer tous les x de 0 à M − 1 coûterait jusqu'à 10⁹ opérations par question.
